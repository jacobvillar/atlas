import type { ReportJson } from "@/core/ai/schemas";
import { ReportSection } from "./report-section";
import { CopyMarkdownButton } from "./copy-markdown-button";
import { InteractiveRoadmap } from "@/modules/roadmap/components/interactive-roadmap";
import { AskAtlasPanel } from "@/modules/ask-atlas/components/ask-atlas-panel";
import type { AskMessage } from "@/modules/ask-atlas/queries/get-messages";
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

interface ReadinessDashboardProps {
  report: ReportJson;
  createdAt: string;
  reportId: string;
  initialCompletedQuestIds: string[];
  askMessages: AskMessage[];
}

// Scannable rendering of a saved readiness report. Quest completion,
// progression (XP/rank), and milestone badges are interactive (ATLAS-009) and
// live in InteractiveRoadmap, which recomputes them client-side on every
// toggle from the pure gamification modules.
export function ReadinessDashboard({
  report,
  createdAt,
  reportId,
  initialCompletedQuestIds,
  askMessages,
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

      <InteractiveRoadmap
        reportId={reportId}
        quests={report.roadmapQuests}
        initialCompletedQuestIds={initialCompletedQuestIds}
      />

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

      <AskAtlasPanel reportId={reportId} initialMessages={askMessages} />
    </div>
  );
}
