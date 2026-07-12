// Locked/empty shell until a report with quest completion state exists.
export function RoadmapProgress() {
  return (
    <div className="rounded-md border border-dashed border-border-subtle bg-background-secondary p-4 text-sm text-foreground-muted">
      Quest progress for your latest report will appear here once you
      generate a report.
    </div>
  );
}
