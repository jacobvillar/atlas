import type OpenAI from "openai";
import { getOpenAI } from "./openai";
import { askOutputSchema, type GuidanceChunk } from "./schemas";
import {
  buildAskMessages,
  renderGuidanceToolResult,
  renderQuestProgressToolResult,
  renderQuestProgressBlock,
  type AskMessagesArgs,
} from "./prompts";
import { computeProgression } from "@/core/gamification/levels";
import { retrieveGuidance } from "@/core/rag/retrieve";

// Ask Atlas agent (ATLAS-010A): upgrades the single-shot answer into a bounded
// OpenAI native tool-calling loop. The model may fetch guidance on demand and
// read this report's quest progress, then must return the same validated
// {answer} contract. Privacy/injection discipline is unchanged: tool results are
// framed as untrusted DATA, and nothing here logs resume/JD/report/answer text.

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// Hard cap on tool rounds so a misbehaving model can never loop forever. After
// this many rounds we stop offering tools and force a final text answer.
const MAX_TOOL_ROUNDS = 4;

const TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "retrieve_guidance",
      description:
        "Retrieve curated career guidance relevant to a query. Returns guidance chunks with source titles. Use for advice, examples, or best practices beyond the report.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "What to search career guidance for.",
          },
        },
        required: ["query"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_quest_progress",
      description:
        "Get a compact summary of the report owner's roadmap progress for THIS report: rank, XP percent, and per-quest completion. Read-only.",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    },
  },
];

// Tool executors are injectable so unit tests can exercise the loop and dispatch
// without hitting Supabase/OpenAI. Each returns a DATA-framed string.
export interface AskToolExecutors {
  retrieveGuidance: (query: string) => Promise<string>;
  getQuestProgress: () => string;
}

// Default executors bound to the report context. The RAG call degrades to an
// empty result on failure (retrieveGuidance already swallows errors internally).
export function buildDefaultExecutors(args: AskMessagesArgs): AskToolExecutors {
  return {
    retrieveGuidance: async (query: string) => {
      const query_ = typeof query === "string" && query.trim() ? query : args.question;
      const guidance: GuidanceChunk[] = await retrieveGuidance(query_);
      return renderGuidanceToolResult(guidance);
    },
    getQuestProgress: () => {
      const progression = computeProgression(
        args.report.roadmapQuests,
        args.completedQuestIds,
      );
      return renderQuestProgressToolResult({
        rankName: progression.rankName,
        percent: progression.percent,
        earnedXp: progression.earnedXp,
        totalXp: progression.totalXp,
        quests: renderQuestProgressBlock(args.report, args.completedQuestIds),
      });
    },
  };
}

// Dispatches one tool call by name. Unknown names return a framed error rather
// than throwing, so a stray tool call can't crash the loop. Tool ARGUMENTS come
// from the model and are parsed defensively; tool RESULTS are always DATA.
export async function dispatchToolCall(
  name: string,
  rawArgs: string,
  executors: AskToolExecutors,
): Promise<string> {
  if (name === "get_quest_progress") {
    return executors.getQuestProgress();
  }
  if (name === "retrieve_guidance") {
    let query = "";
    try {
      const parsed = JSON.parse(rawArgs || "{}");
      if (parsed && typeof parsed.query === "string") query = parsed.query;
    } catch {
      // Malformed arguments → fall back to an empty query; the executor then
      // uses the original question. Never throw on model-supplied args.
    }
    return executors.retrieveGuidance(query);
  }
  return `=== BEGIN TOOL RESULT: error (DATA) ===
Unknown tool "${name}". No such tool is available.
=== END TOOL RESULT ===`;
}

type ChatMessageParam = OpenAI.Chat.Completions.ChatCompletionMessageParam;

// Extracts and validates a final {answer}. Returns null if the message has no
// usable content or fails the schema, so the caller can drive a corrective retry.
function extractAnswer(content: string | null | undefined): string | null {
  if (!content) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return null;
  }
  const result = askOutputSchema.safeParse(parsed);
  return result.success ? result.data.answer : null;
}

export interface AnswerQuestionAgenticOptions {
  client?: Pick<OpenAI, "chat">;
  executors?: AskToolExecutors;
  maxToolRounds?: number;
}

// Runs the bounded tool-calling loop and returns the validated answer string.
// Same external contract as the old answerQuestion: takes AskMessagesArgs,
// returns a schema-valid answer, throws on unrecoverable validation failure.
export async function answerQuestionAgentic(
  args: AskMessagesArgs,
  options: AnswerQuestionAgenticOptions = {},
): Promise<string> {
  const client = options.client ?? getOpenAI();
  const executors = options.executors ?? buildDefaultExecutors(args);
  const maxRounds = options.maxToolRounds ?? MAX_TOOL_ROUNDS;

  const messages: ChatMessageParam[] = buildAskMessages(
    args,
  ) as ChatMessageParam[];

  // Tool rounds: offer tools until the model stops requesting them or we hit the
  // cap. Each requested call is executed server-side and its DATA-framed result
  // appended, then we call the model again.
  for (let round = 0; round < maxRounds; round += 1) {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages,
      tools: TOOLS,
      tool_choice: "auto",
      temperature: 0.4,
    });

    const message = response.choices[0]?.message;
    const toolCalls = message?.tool_calls ?? [];

    if (toolCalls.length === 0) {
      // No tool requested this round — the message may already be the answer.
      const answer = extractAnswer(message?.content);
      if (answer !== null) return answer;
      break;
    }

    // Append the assistant turn (with its tool_calls) then each tool result.
    messages.push(message as ChatMessageParam);
    for (const call of toolCalls) {
      if (call.type !== "function") continue;
      const result = await dispatchToolCall(
        call.function.name,
        call.function.arguments,
        executors,
      );
      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: result,
      });
    }
  }

  // Final answer phase with a corrective retry, mirroring the old single-shot
  // behavior. Tools are withheld here so the model must produce the JSON answer.
  let lastError = "Response was not a valid {answer} object.";
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const attemptMessages: ChatMessageParam[] =
      attempt === 0
        ? messages
        : [
            ...messages,
            {
              role: "user",
              content: `Your previous response was not valid. Error: ${lastError}. Respond now with a single valid JSON object of exactly this shape and nothing else: {"answer": "..."}.`,
            },
          ];

    const response = await client.chat.completions.create({
      model: MODEL,
      messages: attemptMessages,
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const answer = extractAnswer(response.choices[0]?.message?.content);
    if (answer !== null) return answer;
    lastError = "Response did not match the required {answer} schema.";
  }

  throw new Error(`Ask output failed validation: ${lastError}`);
}
