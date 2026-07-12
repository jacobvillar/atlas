import Link from "next/link";

// Prominent primary entry point into the analysis flow (built in ATLAS-007).
// The link target intentionally 404s until that route exists.
export function NewAnalysisCard() {
  return (
    <div className="rounded-lg border border-border-subtle bg-background p-6 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Start a new analysis
          </h2>
          <p className="mt-1 text-sm text-foreground-secondary">
            Compare your resume against a target job description to get a
            readiness report and roadmap quests.
          </p>
        </div>
        <Link
          href="/analysis/new"
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Start a new analysis
        </Link>
      </div>
    </div>
  );
}
