// Calm, professional milestone labels. Locked/greyed until earned via
// completed quest categories. No XP, streak, or leaderboard language.
const PLACEHOLDER_BADGES = ["Resume Ready", "Proof Added", "Gap Closed"];

export function MilestoneBadges() {
  return (
    <div className="flex flex-wrap gap-2">
      {PLACEHOLDER_BADGES.map((badge) => (
        <span
          key={badge}
          className="rounded-full border border-border-subtle bg-background-secondary px-3 py-1 text-xs font-medium text-foreground-muted"
        >
          {badge}
        </span>
      ))}
    </div>
  );
}
