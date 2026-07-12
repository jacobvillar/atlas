import { describe, it, expect } from "vitest";
import { buildAnalysisMessages, buildRoleProfileMessages } from "./prompts";
import type { AnalyzeInput } from "@/core/validation/analyze";
import type { GuidanceChunk } from "./schemas";

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
