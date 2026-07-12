// Shown when a user has no saved reports yet.
export function DashboardEmptyState() {
  return (
    <div className="rounded-lg border border-border-subtle bg-background p-8 text-center">
      <p className="text-sm font-medium text-foreground">
        You have no reports yet.
      </p>
      <p className="mt-2 text-sm text-foreground-secondary">
        Start a new analysis above to generate your first role-readiness
        report and roadmap quests.
      </p>
    </div>
  );
}
