import {
  DISCLAIMER,
  type AnalysisOutput,
  type GuidanceChunk,
  type ReportJson,
  type ReportSource,
  type RoadmapQuest,
} from "./schemas";

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
): { reportJson: ReportJson; quests: RoadmapQuest[] } {
  const quests: RoadmapQuest[] = output.report.roadmapQuests.map(
    (quest, index) => ({ questId: `q${index + 1}`, ...quest }),
  );

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
  };

  return { reportJson, quests };
}
