"use client";

import { useMemo, useState } from "react";
import type { RoadmapQuest } from "@/core/ai/schemas";
import { computeProgression } from "@/core/gamification/levels";
import { computeBadges } from "@/core/gamification/badges";

const PHASE_LABELS: Record<RoadmapQuest["phase"], string> = {
  "30": "First 30 days",
  "60": "Next 60 days",
  "90": "By 90 days",
};

const PHASES = ["30", "60", "90"] as const;

interface InteractiveRoadmapProps {
  reportId: string;
  quests: RoadmapQuest[];
  initialCompletedQuestIds: string[];
}

// Interactive quest board (ATLAS-009): toggling a quest optimistically updates
// local state, persists via PATCH /api/reports/[id]/quests/[questId], and
// reverts with an inline error on failure. Progression and badges are
// recomputed from the pure gamification modules on every render so the strip
// and badge chips update live as quests toggle. Quest-board rank/level
// language is fine here; analysis sections stay hype-free and never imply a
// quest guarantees a job outcome.
export function InteractiveRoadmap({
  reportId,
  quests,
  initialCompletedQuestIds,
}: InteractiveRoadmapProps) {
  const [completedQuestIds, setCompletedQuestIds] = useState<Set<string>>(
    () => new Set(initialCompletedQuestIds),
  );
  const [pendingQuestIds, setPendingQuestIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [errorQuestId, setErrorQuestId] = useState<string | null>(null);

  const progression = useMemo(
    () => computeProgression(quests, completedQuestIds),
    [quests, completedQuestIds],
  );
  const badges = useMemo(
    () => computeBadges(quests, completedQuestIds),
    [quests, completedQuestIds],
  );

  async function toggleQuest(questId: string) {
    const wasCompleted = completedQuestIds.has(questId);
    const nextStatus = wasCompleted ? "not_started" : "completed";

    setErrorQuestId(null);
    setPendingQuestIds((prev) => new Set(prev).add(questId));
    setCompletedQuestIds((prev) => {
      const next = new Set(prev);
      if (wasCompleted) {
        next.delete(questId);
      } else {
        next.add(questId);
      }
      return next;
    });

    try {
      const response = await fetch(
        `/api/reports/${reportId}/quests/${questId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        },
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch {
      // Revert the optimistic update on any failure (network error or
      // non-2xx response) and surface an inline, quest-scoped error.
      setCompletedQuestIds((prev) => {
        const next = new Set(prev);
        if (wasCompleted) {
          next.add(questId);
        } else {
          next.delete(questId);
        }
        return next;
      });
      setErrorQuestId(questId);
    } finally {
      setPendingQuestIds((prev) => {
        const next = new Set(prev);
        next.delete(questId);
        return next;
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border border-border-subtle bg-background p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {progression.rankName}
            </h2>
            <p className="mt-1 text-sm text-foreground-secondary">
              {progression.earnedXp} / {progression.totalXp} xp earned (
              {progression.percent}%)
            </p>
          </div>
        </div>

        <div
          className="mt-4 h-2 w-full overflow-hidden rounded-full bg-background-tertiary"
          role="progressbar"
          aria-valuenow={progression.percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
            style={{ width: `${progression.percent}%` }}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge.id}
              className={
                badge.earned
                  ? "rounded-full border border-border-subtle bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                  : "rounded-full border border-border-subtle bg-background-secondary px-3 py-1 text-xs font-medium text-foreground-muted"
              }
            >
              {badge.name}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border-subtle bg-background p-6">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Roadmap quests
          </h2>
          <p className="mt-1 text-sm text-foreground-secondary">
            A 30/60/90-day plan to close gaps and build proof. Mark quests
            complete as you finish them — progress here is a guide, not a
            guarantee of interviews or offers.
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-6">
          {PHASES.map((phase) => {
            const phaseQuests = quests.filter((quest) => quest.phase === phase);
            if (phaseQuests.length === 0) return null;
            return (
              <div key={phase}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                  {PHASE_LABELS[phase]}
                </h3>
                <ul className="mt-3 flex flex-col gap-3">
                  {phaseQuests.map((quest) => {
                    const isCompleted = completedQuestIds.has(quest.questId);
                    const isPending = pendingQuestIds.has(quest.questId);
                    const hasError = errorQuestId === quest.questId;
                    return (
                      <li
                        key={quest.questId}
                        className="rounded-md border border-border-subtle bg-background-secondary p-3"
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id={`quest-${quest.questId}`}
                            checked={isCompleted}
                            disabled={isPending}
                            onChange={() => toggleQuest(quest.questId)}
                            aria-label={`Mark "${quest.title}" as ${
                              isCompleted ? "incomplete" : "complete"
                            }`}
                            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border-subtle accent-accent"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <label
                                htmlFor={`quest-${quest.questId}`}
                                className={
                                  isCompleted
                                    ? "text-sm font-medium text-foreground-muted line-through"
                                    : "text-sm font-medium text-foreground"
                                }
                              >
                                {quest.title}
                              </label>
                              <span className="shrink-0 rounded-full bg-background-tertiary px-2 py-0.5 text-xs font-medium text-foreground-muted">
                                {quest.xp} xp
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-foreground-secondary">
                              {quest.description}
                            </p>
                            {hasError ? (
                              <p className="mt-2 text-xs text-red-600" role="alert">
                                Could not save this update. Please try again.
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
