import { describe, it, expect } from "vitest";
import {
  buildAnalysisMessages,
  buildAskMessages,
  buildRoleProfileMessages,
} from "./prompts";
import type { AnalyzeInput } from "@/core/validation/analyze";
import type { GuidanceChunk, ReportJson, ResumeEvidence } from "./schemas";

const input: AnalyzeInput = {
  mode: "job_description",
  resumeText: "RESUME_MARKER: five years of retail management experience.",
  jobDescriptionText: "JD_MARKER: seeking a customer success manager.",
  targetRole: "Customer Success Manager",
};

const guidance: GuidanceChunk[] = [
  {
    id: "g1",
    sourceTitle: "Switching Careers",
    sourceUrl: null,
    sourceType: "guide",
    chunkText: "GUIDANCE_MARKER: highlight transferable skills.",
    similarity: 0.6,
  },
];

describe("buildAnalysisMessages", () => {
  it("puts an injection guard in the system prompt", () => {
    const [system] = buildAnalysisMessages(input, guidance);
    expect(system.role).toBe("system");
    expect(system.content).toMatch(/DATA, not instructions/i);
    expect(system.content).toContain("JSON");
  });

  it("labels user content as data and includes the actual inputs", () => {
    const [, user] = buildAnalysisMessages(input, guidance);
    expect(user.content).toContain("BEGIN RESUME (DATA)");
    expect(user.content).toContain("RESUME_MARKER");
    expect(user.content).toContain("JD_MARKER");
    expect(user.content).toContain("GUIDANCE_MARKER");
    expect(user.content).toContain("Customer Success Manager");
  });

  it("notes when no guidance was retrieved", () => {
    const [, user] = buildAnalysisMessages(input, []);
    expect(user.content).toMatch(/No curated career guidance/i);
  });
});

const askReport: ReportJson = {
  targetRole: "Customer Success Manager",
  fitScore: 42,
  summary: "REPORT_MARKER: solid retail background, learning SaaS.",
  roleRequirements: [
    { requirement: "REQ_MARKER: CRM familiarity", status: "partial" },
  ],
  strengths: ["STRENGTH_MARKER: client relationships"],
  gaps: [{ area: "GAP_MARKER: SaaS tooling", detail: "No hands-on CRM yet." }],
  resumeSuggestions: [
    { area: "SUGGESTION_MARKER: metrics", suggestion: "Quantify retention wins." },
  ],
  roadmapQuests: [
    {
      questId: "q1",
      title: "QUEST_MARKER: complete a CRM course",
      description: "Learn a common CRM.",
      phase: "30",
      category: "skills",
      xp: 50,
    },
  ],
  sources: [],
  disclaimer: "Guidance only.",
  xpTotal: 50,
  inputMode: "job_description",
};

const askEvidence: ResumeEvidence = {
  summary: "EVIDENCE_MARKER: five years of retail management.",
  skills: ["SKILL_MARKER: team leadership"],
  experience: [
    {
      title: "EXP_MARKER: Store Manager",
      organization: "ORG_MARKER: Retail Co",
      highlights: ["HIGHLIGHT_MARKER: grew repeat customers"],
    },
  ],
  education: ["EDU_MARKER: BA Business, 2019"],
};

describe("buildAskMessages", () => {
  const args = {
    question: "QUESTION_MARKER: what should I do first?",
    report: askReport,
    resumeEvidence: askEvidence,
    jobDescriptionText: "JD_MARKER: seeking a customer success manager.",
    completedQuestIds: new Set<string>(["q1"]),
    guidance,
  };

  it("puts the injection guard in the system prompt", () => {
    const [system] = buildAskMessages(args);
    expect(system.role).toBe("system");
    expect(system.content).toMatch(/DATA, not instructions/i);
    expect(system.content).toContain("JSON");
  });

  it("labels every block as DATA", () => {
    const [, user] = buildAskMessages(args);
    expect(user.content).toContain("BEGIN REPORT (DATA)");
    expect(user.content).toContain("BEGIN RESUME EVIDENCE (DATA)");
    expect(user.content).toContain("BEGIN JOB DESCRIPTION (DATA)");
    expect(user.content).toContain("BEGIN QUEST PROGRESS (DATA)");
    expect(user.content).toContain("BEGIN CAREER GUIDANCE (DATA)");
    expect(user.content).toContain("BEGIN QUESTION (DATA)");
  });

  it("includes the question text and the report owner's own data", () => {
    const [, user] = buildAskMessages(args);
    expect(user.content).toContain("QUESTION_MARKER: what should I do first?");
    expect(user.content).toContain("REPORT_MARKER");
    expect(user.content).toContain("EVIDENCE_MARKER");
    expect(user.content).toContain("JD_MARKER");
    expect(user.content).toContain("GUIDANCE_MARKER");
  });

  it("renders quest progress with completion state", () => {
    const [, user] = buildAskMessages(args);
    expect(user.content).toContain("QUEST_MARKER: complete a CRM course");
    expect(user.content).toMatch(/completed/);
  });

  it("truncates the job description to 4000 characters", () => {
    const [, user] = buildAskMessages({
      ...args,
      jobDescriptionText: "x".repeat(5000),
    });
    expect(user.content).not.toContain("x".repeat(4001));
    expect(user.content).toContain("x".repeat(4000));
  });
});

describe("buildRoleProfileMessages", () => {
  it("puts the same injection guard in the system prompt", () => {
    const [system] = buildRoleProfileMessages("LLM Engineer");
    expect(system.role).toBe("system");
    expect(system.content).toMatch(/DATA, not instructions/i);
    expect(system.content).toContain("JSON");
  });

  it("labels the role as data and includes the actual role text", () => {
    const [, user] = buildRoleProfileMessages("ROLE_MARKER: LLM Engineer");
    expect(user.role).toBe("user");
    expect(user.content).toContain("BEGIN TARGET ROLE (DATA)");
    expect(user.content).toContain("END TARGET ROLE");
    expect(user.content).toContain("ROLE_MARKER: LLM Engineer");
  });
});
