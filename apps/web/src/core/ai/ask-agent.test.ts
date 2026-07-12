import { describe, it, expect } from "vitest";
import {
  answerQuestionAgentic,
  dispatchToolCall,
  type AskToolExecutors,
} from "./ask-agent";
import type { AskMessagesArgs } from "./prompts";
import type { ReportJson, ResumeEvidence } from "./schemas";

const resumeEvidence: ResumeEvidence = {
  summary: "Early-career analyst.",
  skills: ["SQL"],
  experience: [{ title: "Analyst", organization: "Acme", highlights: ["Built dashboards"] }],
  education: ["BS Statistics"],
};

const report: ReportJson = {
  targetRole: "Data Analyst",
  fitScore: 60,
  summary: "Solid foundation.",
  roleRequirements: [{ requirement: "SQL", status: "met" }],
  strengths: ["SQL"],
  gaps: [{ area: "Viz", detail: "No Tableau." }],
  resumeSuggestions: [{ area: "Metrics", suggestion: "Quantify impact." }],
  roadmapQuests: [
    { questId: "q1", title: "Learn Tableau", description: "d", phase: "30", category: "skills", xp: 10 },
    { questId: "q2", title: "Portfolio", description: "d", phase: "60", category: "projects", xp: 10 },
  ],
  sources: [],
  disclaimer: "d",
  xpTotal: 20,
  inputMode: "job_description",
};

const baseArgs: AskMessagesArgs = {
  question: "What should I do next?",
  report,
  resumeEvidence,
  jobDescriptionText: "JD text",
  completedQuestIds: new Set<string>(["q1"]),
  guidance: [],
};

const stubExecutors: AskToolExecutors = {
  retrieveGuidance: async (query: string) =>
    `=== BEGIN TOOL RESULT: retrieved career guidance (DATA) ===\nGUIDANCE for: ${query}\n=== END TOOL RESULT ===`,
  getQuestProgress: () =>
    `=== BEGIN TOOL RESULT: quest progress (DATA) ===\nRank: Explorer\n=== END TOOL RESULT ===`,
};

describe("dispatchToolCall", () => {
  it("routes retrieve_guidance and frames the result as DATA", async () => {
    const out = await dispatchToolCall(
      "retrieve_guidance",
      JSON.stringify({ query: "networking tips" }),
      stubExecutors,
    );
    expect(out).toContain("(DATA)");
    expect(out).toContain("networking tips");
  });

  it("tolerates malformed args without throwing", async () => {
    const out = await dispatchToolCall("retrieve_guidance", "{not json", stubExecutors);
    expect(out).toContain("(DATA)");
  });

  it("routes get_quest_progress", async () => {
    const out = await dispatchToolCall("get_quest_progress", "{}", stubExecutors);
    expect(out).toContain("quest progress");
  });

  it("returns a framed error for an unknown tool", async () => {
    const out = await dispatchToolCall("delete_everything", "{}", stubExecutors);
    expect(out).toContain("Unknown tool");
    expect(out).toContain("(DATA)");
  });
});

// Minimal fake OpenAI client: a scripted queue of responses drives the loop
// without any network. Each call shifts the next scripted response.
function fakeClient(responses: unknown[]) {
  let i = 0;
  const calls: unknown[] = [];
  return {
    calls,
    client: {
      chat: {
        completions: {
          create: async (params: unknown) => {
            calls.push(params);
            const r = responses[i++];
            if (r === undefined) throw new Error("no scripted response");
            return r;
          },
        },
      },
    } as never,
  };
}

function toolCallMsg(name: string, args: string) {
  return {
    choices: [
      {
        message: {
          role: "assistant",
          content: null,
          tool_calls: [{ id: "call_1", type: "function", function: { name, arguments: args } }],
        },
      },
    ],
  };
}

function answerMsg(answer: string) {
  return {
    choices: [{ message: { role: "assistant", content: JSON.stringify({ answer }), tool_calls: [] } }],
  };
}

describe("answerQuestionAgentic loop", () => {
  it("executes a tool round then returns the validated answer", async () => {
    const { client, calls } = fakeClient([
      toolCallMsg("retrieve_guidance", JSON.stringify({ query: "next steps" })),
      answerMsg("Focus on the Tableau quest next."),
    ]);
    const answer = await answerQuestionAgentic(baseArgs, {
      client,
      executors: stubExecutors,
    });
    expect(answer).toBe("Focus on the Tableau quest next.");
    // Second call must include a tool-role message carrying the DATA result.
    const secondCallMessages = (calls[1] as { messages: { role: string; content?: string }[] })
      .messages;
    const toolMsg = secondCallMessages.find((m) => m.role === "tool");
    expect(toolMsg?.content).toContain("(DATA)");
  });

  it("answers directly when the model requests no tools", async () => {
    const { client } = fakeClient([answerMsg("Direct answer.")]);
    const answer = await answerQuestionAgentic(baseArgs, { client, executors: stubExecutors });
    expect(answer).toBe("Direct answer.");
  });

  it("does a corrective retry when the first final answer is invalid", async () => {
    const invalid = { choices: [{ message: { content: "not json", tool_calls: [] } }] };
    const { client } = fakeClient([invalid, answerMsg("Recovered answer.")]);
    const answer = await answerQuestionAgentic(baseArgs, { client, executors: stubExecutors });
    expect(answer).toBe("Recovered answer.");
  });

  it("throws when validation never succeeds", async () => {
    const invalid = { choices: [{ message: { content: "still bad", tool_calls: [] } }] };
    const { client } = fakeClient([invalid, invalid, invalid]);
    await expect(
      answerQuestionAgentic(baseArgs, { client, executors: stubExecutors }),
    ).rejects.toThrow(/failed validation/);
  });
});
