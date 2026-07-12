import Link from "next/link";

export interface ActiveQuestPreviewItem {
  questId: string;
  title: string;
  xp: number;
}

interface ActiveQuestsPreviewProps {
  reportId: string | null;
  quests: ActiveQuestPreviewItem[];
}

// Read-only snapshot of today's next quests from the user's most recent
// report. Links to the report for interaction — toggling happens there, not
// here (ATLAS-009).
export function ActiveQuestsPreview({ reportId, quests }: ActiveQuestsPreviewProps) {
  if (!reportId || quests.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border-subtle bg-background-secondary p-4 text-sm text-foreground-muted">
        {reportId
          ? "All quests from your latest report are complete."
          : "Your top roadmap quests will appear here after you generate a report."}
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {quests.map((quest) => (
        <li
          key={quest.questId}
          className="flex items-center justify-between gap-3 rounded-md border border-border-subtle bg-background-secondary px-3 py-2"
        >
          <span className="text-sm text-foreground">{quest.title}</span>
          <span className="shrink-0 rounded-full bg-background-tertiary px-2 py-0.5 text-xs font-medium text-foreground-muted">
            {quest.xp ?? 0} xp
          </span>
        </li>
      ))}
      <li className="pt-1">
        <Link
          href={`/reports/${reportId}`}
          className="text-xs font-medium text-accent hover:underline"
        >
          Open report to update quests
        </Link>
      </li>
    </ul>
  );
}
