import type { Badge } from "@/core/gamification/badges";

interface MilestoneBadgesProps {
  badges: Badge[] | null;
}

// Calm, professional milestone labels. Locked/greyed until earned via
// completed quest categories. No XP, streak, or leaderboard language. This is
// a read-only snapshot for the user's most recent report — toggling quests
// happens on the report page (ATLAS-009).
export function MilestoneBadges({ badges }: MilestoneBadgesProps) {
  if (!badges) {
    return (
      <div className="rounded-md border border-dashed border-border-subtle bg-background-secondary p-4 text-sm text-foreground-muted">
        Milestone badges will appear here once you generate a report.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
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
  );
}
