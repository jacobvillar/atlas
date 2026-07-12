import OpenAI from "openai";
import {
  analysisOutputSchema,
  roleProfileOutputSchema,
  type AnalysisOutput,
  type GuidanceChunk,
} from "./schemas";
import {
  buildAnalysisMessages,
  buildRoleProfileMessages,
  type ChatMessage,
} from "./prompts";
import type { AnalyzeInput } from "@/core/validation/analyze";

let client: OpenAI | null = null;

// Lazy singleton so importing this module never throws at build time when the
// key is absent; it only fails when an analysis is actually requested.
function getOpenAI(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }
    // Optional: course/Vocareum keys need their proxy base URL. Unset → SDK
    // default (api.openai.com).
    const baseURL = process.env.OPENAI_BASE_URL || undefined;
    client = new OpenAI({ apiKey, baseURL });
  }
  return client;
}

export async function embedText(text: string): Promise<number[]> {
  const model = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
  const response = await getOpenAI().embeddings.create({
    model,
    // 1536-d model; cap input so an oversized query can't blow the token limit.
    input: text.slice(0, 8000),
  });
  return response.data[0].embedding;
}

async function completeJson(messages: ChatMessage[]): Promise<string> {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const response = await getOpenAI().chat.completions.create({
    model,
    messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    response_format: { type: "json_object" },
    temperature: 0.4,
  });
  return response.choices[0]?.message?.content ?? "";
}

// Generates the readiness analysis and validates it against the schema. Retries
// once with a corrective message if the first response is unparseable or invalid
// — cheap insurance against the occasional malformed JSON.
export async function generateAnalysis(
  input: AnalyzeInput,
  guidance: GuidanceChunk[],
): Promise<AnalysisOutput> {
  const messages = buildAnalysisMessages(input, guidance);
  let lastError = "";

  for (let attempt = 0; attempt < 2; attempt++) {
    const attemptMessages =
      attempt === 0
        ? messages
        : [
            ...messages,
            {
              role: "user" as const,
              content: `Your previous response was not valid. Error: ${lastError}. Respond again with a single valid JSON object matching the required shape exactly.`,
            },
          ];

    const raw = await completeJson(attemptMessages);

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(raw);
    } catch {
      lastError = "Response was not valid JSON.";
      continue;
    }

    const result = analysisOutputSchema.safeParse(parsedJson);
    if (result.success) {
      return result.data;
    }
    lastError = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
  }

  throw new Error(`Analysis output failed validation: ${lastError}`);
}

// Career-path mode (ATLAS-006A): synthesizes a representative role-requirements
// profile from a target role, validated against roleProfileOutputSchema. Retries
// once with a corrective message, mirroring generateAnalysis. Returns just the
// profile string, which the caller feeds into the identical analysis pipeline.
export async function synthesizeRoleProfile(targetRole: string): Promise<string> {
  const messages = buildRoleProfileMessages(targetRole);
  let lastError = "";

  for (let attempt = 0; attempt < 2; attempt++) {
    const attemptMessages =
      attempt === 0
        ? messages
        : [
            ...messages,
            {
              role: "user" as const,
              content: `Your previous response was not valid. Error: ${lastError}. Respond again with a single valid JSON object matching the required shape exactly.`,
            },
          ];

    const raw = await completeJson(attemptMessages);

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(raw);
    } catch {
      lastError = "Response was not valid JSON.";
      continue;
    }

    const result = roleProfileOutputSchema.safeParse(parsedJson);
    if (result.success) {
      return result.data.roleProfile;
    }
    lastError = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
  }

  throw new Error(`Role profile output failed validation: ${lastError}`);
}
