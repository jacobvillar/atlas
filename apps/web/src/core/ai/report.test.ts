import { describe, it, expect } from "vitest";
import { assembleReportJson, guidanceToSources } from "./report";
import { DISCLAIMER, type AnalysisOutput, type GuidanceChunk } from "./schemas";

const output: AnalysisOutput = {
  resumeEvidence: {
    summary: "Early-career marketer with internship experience.",
    skills: ["copywriting", "SEO"],
    experience: [
      { title: "Marketing Intern", organization: "Acme", highlights: ["Ran email campaigns"] },
    ],
    education: ["BA Communications"],
  },
  report: {
    fitScore: 62,
    summary: "Solid foundation with gaps in analytics.",
    roleRequirements: [{ requirement: "2 years experience", status: "partial" }],
    strengths: ["Strong writing"],
    gaps: [{ area: "Analytics", detail: "No GA4 experience shown." }],
    resumeSuggestions: [{ area: "Metrics", suggestion: "Quantify campaign results." }],
    roadmapQuests: [
      { title: "Learn GA4", description: "Complete GA4 cert.", phase: "30", category: "skills" },
      { title: "Build portfolio", description: "Publish 2 case studies.", phase: "60", category: "projects" },
      { title: "Mock interviews", description: "Do 3 mock interviews.", phase: "90", category: "interview" },
    ],
  },
};

function chunk(title: string, url: string | null): GuidanceChunk {
  return {
    id: `${title}-1`,
    sourceTitle: title,
    sourceUrl: url,
    sourceType: "guide",
    chunkText: "text",
    similarity: 0.5,
  };
}

describe("assembleReportJson", () => {
  it("assigns stable sequential quest ids", () => {
    const { reportJson, quests } = assembleReportJson(output, [], "Marketing Analyst");
    expect(quests.map((q) => q.questId)).toEqual(["q1", "q2", "q3"]);
    expect(reportJson.roadmapQuests).toHaveLength(3);
    expect(reportJson.roadmapQuests[0].questId).toBe("q1");
  });

  it("sets the server-owned disclaimer and target role", () => {
    const { reportJson } = assembleReportJson(output, [], "Marketing Analyst");
    expect(reportJson.disclaimer).toBe(DISCLAIMER);
    expect(reportJson.targetRole).toBe("Marketing Analyst");
    expect(reportJson.fitScore).toBe(62);
  });

  it("derives deduped sources from guidance only", () => {
    const guidance = [
      chunk("Resume Basics", "https://example.com/a"),
      chunk("Resume Basics", "https://example.com/a"),
      chunk("Interview Prep", null),
    ];
    const { reportJson } = assembleReportJson(output, guidance, null);
    expect(reportJson.sources).toEqual([
      { title: "Resume Basics", url: "https://example.com/a" },
      { title: "Interview Prep", url: null },
    ]);
  });
});

describe("guidanceToSources", () => {
  it("returns empty for no guidance", () => {
    expect(guidanceToSources([])).toEqual([]);
  });
});
