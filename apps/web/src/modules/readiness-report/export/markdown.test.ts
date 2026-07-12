import { describe, it, expect } from "vitest";
import { reportToMarkdown } from "./markdown";
import { DISCLAIMER, type ReportJson } from "@/core/ai/schemas";

const baseReport: ReportJson = {
  targetRole: "Marketing Analyst",
  fitScore: 62,
  summary: "Solid foundation with gaps in analytics.",
  roleRequirements: [{ requirement: "2 years experience", status: "partial" }],
  strengths: ["Strong writing"],
  gaps: [{ area: "Analytics", detail: "No GA4 experience shown." }],
  resumeSuggestions: [{ area: "Metrics", suggestion: "Quantify campaign results." }],
  roadmapQuests: [
    {
      questId: "q1",
      title: "Learn GA4",
      description: "Complete GA4 cert.",
      phase: "30",
      category: "skills",
      xp: 50,
    },
    {
      questId: "q2",
      title: "Build portfolio",
      description: "Publish 2 case studies.",
      phase: "60",
      category: "projects",
      xp: 75,
    },
    {
      questId: "q3",
      title: "Mock interviews",
      description: "Do 3 mock interviews.",
      phase: "90",
      category: "interview",
      xp: 100,
    },
  ],
  sources: [
    { title: "Resume Basics", url: "https://example.com/a" },
    { title: "Interview Prep", url: null },
  ],
  disclaimer: DISCLAIMER,
  xpTotal: 225,
  inputMode: "job_description",
};

describe("reportToMarkdown", () => {
  it("includes the role and fit score", () => {
    const md = reportToMarkdown(baseReport);
    expect(md).toContain("# Readiness Report: Marketing Analyst");
    expect(md).toContain("## Fit Score");
    expect(md).toContain("62/100");
  });

  it("includes the summary section", () => {
    const md = reportToMarkdown(baseReport);
    expect(md).toContain("## Summary");
    expect(md).toContain("Solid foundation with gaps in analytics.");
  });

  it("includes role requirements with status", () => {
    const md = reportToMarkdown(baseReport);
    expect(md).toContain("## Role Requirements");
    expect(md).toContain("[Partial] 2 years experience");
  });

  it("includes matched strengths", () => {
    const md = reportToMarkdown(baseReport);
    expect(md).toContain("## Matched Strengths");
    expect(md).toContain("- Strong writing");
  });

  it("includes priority gaps", () => {
    const md = reportToMarkdown(baseReport);
    expect(md).toContain("## Priority Gaps");
    expect(md).toContain("**Analytics**: No GA4 experience shown.");
  });

  it("includes resume suggestions", () => {
    const md = reportToMarkdown(baseReport);
    expect(md).toContain("## Resume Suggestions");
    expect(md).toContain("**Metrics**: Quantify campaign results.");
  });

  it("groups roadmap quests by phase", () => {
    const md = reportToMarkdown(baseReport);
    expect(md).toContain("## Roadmap Quests");
    expect(md).toContain("### 30 days");
    expect(md).toContain("- **Learn GA4** (50 xp): Complete GA4 cert.");
    expect(md).toContain("### 60 days");
    expect(md).toContain("- **Build portfolio** (75 xp): Publish 2 case studies.");
    expect(md).toContain("### 90 days");
    expect(md).toContain("- **Mock interviews** (100 xp): Do 3 mock interviews.");
  });

  it("includes sources with links when a url is present", () => {
    const md = reportToMarkdown(baseReport);
    expect(md).toContain("## Sources");
    expect(md).toContain("- [Resume Basics](https://example.com/a)");
    expect(md).toContain("- Interview Prep");
  });

  it("includes the disclaimer", () => {
    const md = reportToMarkdown(baseReport);
    expect(md).toContain("## Disclaimer");
    expect(md).toContain(DISCLAIMER);
  });

  it("includes a generated date when createdAt is provided", () => {
    const md = reportToMarkdown({ ...baseReport, createdAt: "2026-07-01T00:00:00.000Z" });
    expect(md).toMatch(/_Generated July 1, 2026_|_Generated June 30, 2026_/);
  });

  it("omits the generated date line when createdAt is absent", () => {
    const md = reportToMarkdown(baseReport);
    expect(md).not.toContain("_Generated");
  });

  it("adds a career-path note when inputMode is career_path", () => {
    const md = reportToMarkdown({ ...baseReport, inputMode: "career_path" });
    expect(md).toContain(
      "Based on a typical Marketing Analyst profile — not a specific job posting.",
    );
  });

  it("omits the career-path note when inputMode is job_description", () => {
    const md = reportToMarkdown(baseReport);
    expect(md).not.toContain("not a specific job posting");
  });

  it("handles a null target role gracefully", () => {
    const md = reportToMarkdown({ ...baseReport, targetRole: null });
    expect(md).toContain("# Readiness Report: Target role not specified");
  });

  it("handles empty arrays without throwing", () => {
    const empty: ReportJson = {
      ...baseReport,
      roleRequirements: [],
      strengths: [],
      gaps: [],
      resumeSuggestions: [],
      roadmapQuests: [],
      sources: [],
    };
    const md = reportToMarkdown(empty);
    expect(md).toContain("_No role requirements listed._");
    expect(md).toContain("_No matched strengths listed._");
    expect(md).toContain("_No priority gaps listed._");
    expect(md).toContain("_No resume suggestions listed._");
    expect(md).toContain("_No quests in this phase._");
    expect(md).toContain("_No sources listed._");
  });
});
