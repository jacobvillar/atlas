import {
  DISCLAIMER,
  type AnalysisOutput,
  type GuidanceChunk,
  type ReportJson,
  type ReportSource,
  type RoadmapQuest,
} from "./schemas";

// XP awarded per roadmap phase. Server-owned scoring (see CLAUDE.md AI rules:
// XP is never model-generated) — used by core/gamification to compute
// per-report progression.
export const PHASE_XP = { "30": 50, "60": 75, "90": 100 } as const;

// Sources are derived from the guidance we actually retrieved, never from the
// model — so a report can never cite a source that was not consulted.
export function guidanceToSources(guidance: GuidanceChunk[]): ReportSource[] {
  const seen = new Map<string, ReportSource>();
  for (const chunk of guidance) {
    if (!seen.has(chunk.sourceTitle)) {
      seen.set(chunk.sourceTitle, {
        title: chunk.sourceTitle,
        url: chunk.sourceUrl ?? null,
      });
    }
  }
  return [...seen.values()];
}

// Turns validated model output + retrieved guidance into the persisted report
// shape. Quest ids are assigned here (q1..qN) so they are unique per report and
// stable across re-reads; disclaimer and sources are server-owned.
export function assembleReportJson(
  output: AnalysisOutput,
  guidance: GuidanceChunk[],
  targetRole: string | null,
  inputMode: ReportJson["inputMode"] = "job_description",
): { reportJson: ReportJson; quests: RoadmapQuest[] } {
  const quests: RoadmapQuest[] = output.report.roadmapQuests.map(
    (quest, index) => ({
      questId: `q${index + 1}`,
      ...quest,
      xp: PHASE_XP[quest.phase],
    }),
  );

  const xpTotal = quests.reduce((sum, quest) => sum + quest.xp, 0);

  const reportJson: ReportJson = {
    targetRole,
    fitScore: output.report.fitScore,
    summary: output.report.summary,
    roleRequirements: output.report.roleRequirements,
    strengths: output.report.strengths,
    gaps: output.report.gaps,
    resumeSuggestions: output.report.resumeSuggestions,
    roadmapQuests: quests,
    sources: guidanceToSources(guidance),
    disclaimer: DISCLAIMER,
    xpTotal,
    inputMode,
  };

  return { reportJson, quests };
}
