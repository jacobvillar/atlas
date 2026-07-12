import type { ReportJson } from "@/core/ai/schemas";

const PHASE_LABELS: Record<string, string> = {
  "30": "30 days",
  "60": "60 days",
  "90": "90 days",
};

const STATUS_LABELS: Record<string, string> = {
  met: "Met",
  partial: "Partial",
  missing: "Missing",
};

function formatDate(iso: string | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Pure, deterministic Markdown rendering of a saved report. No secrets, no
// network calls — safe to unit test and to run client-side for export.
export function reportToMarkdown(
  report: ReportJson & { createdAt?: string },
): string {
  const lines: string[] = [];

  const roleHeading = report.targetRole ?? "Target role not specified";
  lines.push(`# Readiness Report: ${roleHeading}`);
  lines.push("");

  const createdLabel = formatDate(report.createdAt);
  if (createdLabel) {
    lines.push(`_Generated ${createdLabel}_`);
    lines.push("");
  }

  if (report.inputMode === "career_path") {
    lines.push(
      `> Based on a typical ${roleHeading} profile — not a specific job posting.`,
    );
    lines.push("");
  }

  lines.push(`## Fit Score`);
  lines.push("");
  lines.push(`${report.fitScore}/100`);
  lines.push("");

  lines.push(`## Summary`);
  lines.push("");
  lines.push(report.summary);
  lines.push("");

  lines.push(`## Role Requirements`);
  lines.push("");
  if (report.roleRequirements.length === 0) {
    lines.push("_No role requirements listed._");
  } else {
    for (const req of report.roleRequirements) {
      const status = STATUS_LABELS[req.status] ?? req.status;
      lines.push(`- [${status}] ${req.requirement}`);
    }
  }
  lines.push("");

  lines.push(`## Matched Strengths`);
  lines.push("");
  if (report.strengths.length === 0) {
    lines.push("_No matched strengths listed._");
  } else {
    for (const strength of report.strengths) {
      lines.push(`- ${strength}`);
    }
  }
  lines.push("");

  lines.push(`## Priority Gaps`);
  lines.push("");
  if (report.gaps.length === 0) {
    lines.push("_No priority gaps listed._");
  } else {
    for (const gap of report.gaps) {
      lines.push(`- **${gap.area}**: ${gap.detail}`);
    }
  }
  lines.push("");

  lines.push(`## Resume Suggestions`);
  lines.push("");
  if (report.resumeSuggestions.length === 0) {
    lines.push("_No resume suggestions listed._");
  } else {
    for (const suggestion of report.resumeSuggestions) {
      lines.push(`- **${suggestion.area}**: ${suggestion.suggestion}`);
    }
  }
  lines.push("");

  lines.push(`## Roadmap Quests`);
  lines.push("");
  for (const phase of ["30", "60", "90"] as const) {
    const phaseQuests = report.roadmapQuests.filter(
      (quest) => quest.phase === phase,
    );
    lines.push(`### ${PHASE_LABELS[phase]}`);
    lines.push("");
    if (phaseQuests.length === 0) {
      lines.push("_No quests in this phase._");
    } else {
      for (const quest of phaseQuests) {
        lines.push(`- **${quest.title}** (${quest.xp ?? 0} xp): ${quest.description}`);
      }
    }
    lines.push("");
  }

  lines.push(`## Sources`);
  lines.push("");
  if (report.sources.length === 0) {
    lines.push("_No sources listed._");
  } else {
    for (const source of report.sources) {
      lines.push(source.url ? `- [${source.title}](${source.url})` : `- ${source.title}`);
    }
  }
  lines.push("");

  lines.push(`## Disclaimer`);
  lines.push("");
  lines.push(report.disclaimer);
  lines.push("");

  return lines.join("\n");
}
