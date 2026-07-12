import type { ReportJson } from "@/core/ai/schemas";
import type { Progression } from "@/core/gamification/levels";
import type { Badge } from "@/core/gamification/badges";
import { ReportSection } from "./report-section";
import { CopyMarkdownButton } from "./copy-markdown-button";
import { reportToMarkdown } from "../export/markdown";

const STATUS_STYLES: Record<
  ReportJson["roleRequirements"][number]["status"],
  { label: string; className: string }
> = {
  met: {
    label: "Met",
    className: "bg-accent/10 text-accent",
  },
  partial: {
    label: "Partial",
    className: "bg-background-tertiary text-foreground-secondary",
  },
  missing: {
    label: "Missing",
    className: "bg-background-tertiary text-foreground-muted",
  },
};

const PHASE_LABELS: Record<ReportJson["roadmapQuests"][number]["phase"], string> = {
  "30": "First 30 days",
  "60": "Next 60 days",
  "90": "By 90 days",
};

const PHASES = ["30", "60", "90"] as const;

interface ReadinessDashboardProps {
  report: ReportJson;
  createdAt: string;
  progression: Progression;
  badges: Badge[];
}

// Scannable, read-only rendering of a saved readiness report. Quest
// completion toggles and live XP updates are ATLAS-009 — progression and
// badges here are computed server-side and passed in as props.
export function ReadinessDashboard({
  report,
  createdAt,
  progression,
  badges,
}: ReadinessDashboardProps) {
  const markdown = reportToMarkdown({ ...report, createdAt });
  const createdLabel = new Date(createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border border-border-subtle bg-background p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
              Readiness report
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {report.targetRole ?? "Untitled role"}
            </h1>
            <p className="mt-1 text-sm text-foreground-muted">
              Generated {createdLabel}
            </p>
            {report.inputMode === "career_path" ? (
              <p className="mt-2 text-xs text-foreground-muted">
                Based on a typical {report.targetRole ?? "this role"} profile
                — not a specific job posting.
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
            <div className="flex items-baseline gap-1 rounded-lg bg-background-secondary px-4 py-3">
              <span className="text-3xl font-semibold text-foreground">
                {report.fitScore}
              </span>
              <span className="text-sm font-medium text-foreground-muted">
                /100 fit
              </span>
            </div>
            <CopyMarkdownButton markdown={markdown} />
          </div>
        </div>
      </section>

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
            className="h-full rounded-full bg-accent"
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

      <ReportSection title="Summary">
        <p className="text-sm text-foreground-secondary">{report.summary}</p>
      </ReportSection>

      <ReportSection
        title="Role requirements"
        description="How your background lines up with what the role asks for."
      >
        <ul className="flex flex-col gap-3">
          {report.roleRequirements.map((req, index) => {
            const status = STATUS_STYLES[req.status];
            return (
              <li
                key={`${req.requirement}-${index}`}
                className="flex items-start justify-between gap-4"
              >
                <span className="text-sm text-foreground">
                  {req.requirement}
                </span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                >
                  {status.label}
                </span>
              </li>
            );
          })}
        </ul>
      </ReportSection>

      <ReportSection title="Matched strengths">
        <ul className="flex flex-col gap-2">
          {report.strengths.map((strength, index) => (
            <li
              key={index}
              className="text-sm text-foreground-secondary before:mr-2 before:content-['—']"
            >
              {strength}
            </li>
          ))}
        </ul>
      </ReportSection>

      <ReportSection title="Priority gaps">
        <ul className="flex flex-col gap-4">
          {report.gaps.map((gap, index) => (
            <li key={index}>
              <p className="text-sm font-medium text-foreground">{gap.area}</p>
              <p className="mt-1 text-sm text-foreground-secondary">
                {gap.detail}
              </p>
            </li>
          ))}
        </ul>
      </ReportSection>

      <ReportSection
        title="Resume suggestions"
        description="Concrete edits to strengthen your resume for this role."
      >
        <ul className="flex flex-col gap-4">
          {report.resumeSuggestions.map((suggestion, index) => (
            <li key={index}>
              <p className="text-sm font-medium text-foreground">
                {suggestion.area}
              </p>
              <p className="mt-1 text-sm text-foreground-secondary">
                {suggestion.suggestion}
              </p>
            </li>
          ))}
        </ul>
      </ReportSection>

      <ReportSection
        title="Roadmap quests"
        description="A 30/60/90-day plan to close gaps and build proof."
      >
        <div className="flex flex-col gap-6">
          {PHASES.map((phase) => {
            const quests = report.roadmapQuests.filter(
              (quest) => quest.phase === phase,
            );
            if (quests.length === 0) return null;
            return (
              <div key={phase}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                  {PHASE_LABELS[phase]}
                </h3>
                <ul className="mt-3 flex flex-col gap-3">
                  {quests.map((quest) => (
                    <li
                      key={quest.questId}
                      className="rounded-md border border-border-subtle bg-background-secondary p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium text-foreground">
                          {quest.title}
                        </p>
                        <span className="shrink-0 rounded-full bg-background-tertiary px-2 py-0.5 text-xs font-medium text-foreground-muted">
                          {quest.xp} xp
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-foreground-secondary">
                        {quest.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </ReportSection>

      <ReportSection title="Sources">
        {report.sources.length === 0 ? (
          <p className="text-sm text-foreground-muted">
            No external guidance sources were used for this report.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {report.sources.map((source, index) => (
              <li key={index} className="text-sm">
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {source.title}
                  </a>
                ) : (
                  <span className="text-foreground-secondary">
                    {source.title}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </ReportSection>

      <p className="text-xs text-foreground-muted">{report.disclaimer}</p>
    </div>
  );
}
