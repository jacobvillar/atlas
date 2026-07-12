import { describe, it, expect } from "vitest";
import { analysisOutputSchema, roleProfileOutputSchema } from "./schemas";

const valid = {
  resumeEvidence: {
    summary: "Career shifter moving into data analysis.",
    skills: ["Excel", "SQL"],
    experience: [{ title: "Operations Associate", highlights: ["Built weekly reports"] }],
    education: ["BS Biology"],
  },
  report: {
    fitScore: 55,
    summary: "Transferable skills present; needs analytics depth.",
    roleRequirements: [{ requirement: "SQL proficiency", status: "met" }],
    strengths: ["Process improvement"],
    gaps: [{ area: "Statistics", detail: "No formal stats background." }],
    resumeSuggestions: [{ area: "Impact", suggestion: "Add measurable outcomes." }],
    roadmapQuests: [
      { title: "SQL course", description: "Finish an intermediate SQL course.", phase: "30", category: "skills" },
      { title: "Dashboard project", description: "Build a public dashboard.", phase: "60", category: "projects" },
      { title: "Networking", description: "Reach out to 5 analysts.", phase: "90", category: "networking" },
    ],
  },
};

describe("analysisOutputSchema", () => {
  it("accepts a well-formed analysis payload", () => {
    expect(analysisOutputSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a fit score above 100", () => {
    const bad = { ...valid, report: { ...valid.report, fitScore: 150 } };
    expect(analysisOutputSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects an unknown quest category", () => {
    const bad = {
      ...valid,
      report: {
        ...valid.report,
        roadmapQuests: [
          { title: "x", description: "y", phase: "30", category: "dancing" },
          ...valid.report.roadmapQuests,
        ],
      },
    };
    expect(analysisOutputSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects fewer than three quests", () => {
    const bad = {
      ...valid,
      report: { ...valid.report, roadmapQuests: valid.report.roadmapQuests.slice(0, 1) },
    };
    expect(analysisOutputSchema.safeParse(bad).success).toBe(false);
  });
});

describe("roleProfileOutputSchema", () => {
  it("accepts a substantial role profile", () => {
    const roleProfile = "A".repeat(500);
    expect(roleProfileOutputSchema.safeParse({ roleProfile }).success).toBe(true);
  });

  it("rejects a too-short (< 200 char) profile", () => {
    expect(roleProfileOutputSchema.safeParse({ roleProfile: "short" }).success).toBe(false);
  });

  it("rejects a too-long (> 8000 char) profile", () => {
    const roleProfile = "A".repeat(8001);
    expect(roleProfileOutputSchema.safeParse({ roleProfile }).success).toBe(false);
  });

  it("rejects a missing roleProfile field", () => {
    expect(roleProfileOutputSchema.safeParse({}).success).toBe(false);
  });
});
