import type { Progression } from "@/core/gamification/levels";

interface RoadmapProgressProps {
  progression: Progression | null;
}

// Read-only snapshot of quest progress for the user's most recent report.
// Interaction (toggling quests) happens on the report page, not here
// (ATLAS-009).
export function RoadmapProgress({ progression }: RoadmapProgressProps) {
  if (!progression) {
    return (
      <div className="rounded-md border border-dashed border-border-subtle bg-background-secondary p-4 text-sm text-foreground-muted">
        Quest progress for your latest report will appear here once you
        generate a report.
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">
        {progression.rankName}
      </h3>
      <p className="mt-1 text-sm text-foreground-secondary">
        {progression.earnedXp} / {progression.totalXp} xp earned (
        {progression.percent}%)
      </p>
      <div
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-background-tertiary"
        role="progressbar"
        aria-valuenow={progression.percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${progression.percent}%` }}
        />
      </div>
    </div>
  );
}
