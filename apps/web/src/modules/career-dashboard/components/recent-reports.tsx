import Link from "next/link";

export interface RecentReport {
  id: string;
  target_role: string | null;
  fit_score: number;
  created_at: string;
}

interface RecentReportsProps {
  reports: RecentReport[];
}

// Compact list of the current user's most recent saved reports. RLS already
// scopes the query to the owning user server-side.
export function RecentReports({ reports }: RecentReportsProps) {
  return (
    <ul className="divide-y divide-border-subtle">
      {reports.map((report) => (
        <li key={report.id}>
          <Link
            href={`/reports/${report.id}`}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0 hover:opacity-80"
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {report.target_role ?? "Untitled role"}
              </p>
              <p className="mt-0.5 text-xs text-foreground-muted">
                {new Date(report.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-background-tertiary px-2.5 py-1 text-xs font-semibold text-foreground">
              {report.fit_score}% fit
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
