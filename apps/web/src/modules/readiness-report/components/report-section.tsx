import type { ReactNode } from "react";

interface ReportSectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  id?: string;
  className?: string;
}

// Reusable titled section card for the readiness report, matching
// DashboardSection's spacing/border/heading conventions.
export function ReportSection({
  title,
  description,
  action,
  children,
  id,
  className,
}: ReportSectionProps) {
  return (
    <section
      id={id}
      className={`rounded-lg border border-border-subtle bg-background p-6${
        className ? ` ${className}` : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-foreground-secondary">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
