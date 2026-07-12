"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AppNavProps {
  // Latest report id for the signed-in user, or null when they have no reports
  // yet. Drives where the report-scoped tabs point.
  latestReportId: string | null;
}

// Persistent top-nav tabs for the authenticated app shell. Quests and Ask Atlas
// point at the user's latest report when one exists; otherwise they fall back
// to the new-analysis flow so the tabs always lead somewhere useful.
export function AppNav({ latestReportId }: AppNavProps) {
  const pathname = usePathname();

  const onReportPage = latestReportId
    ? pathname === `/reports/${latestReportId}`
    : false;

  // Report-scoped tabs are disabled until the user has a report — otherwise they
  // would fall back to /analysis/new and silently no-op when clicked from there.
  const noReport = !latestReportId;

  const tabs = [
    { label: "Home", href: "/dashboard", active: pathname === "/dashboard" },
    {
      label: "Quests",
      href: `/reports/${latestReportId}`,
      active: onReportPage,
      disabled: noReport,
    },
    {
      label: "Ask Atlas",
      href: `/reports/${latestReportId}#ask-atlas`,
      active: onReportPage,
      disabled: noReport,
    },
    {
      label: "New Analysis",
      href: "/analysis/new",
      active: pathname === "/analysis/new",
    },
  ];

  return (
    <nav aria-label="Primary" className="flex items-center gap-1">
      {tabs.map((tab) =>
        tab.disabled ? (
          <span
            key={tab.label}
            aria-disabled="true"
            title="Generate a report first to unlock this."
            className="cursor-not-allowed rounded-md px-3 py-1.5 text-sm font-medium text-foreground-muted opacity-50"
          >
            {tab.label}
          </span>
        ) : (
          <Link
            key={tab.label}
            href={tab.href}
            aria-current={tab.active ? "page" : undefined}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab.active
                ? "bg-accent/10 text-accent"
                : "text-foreground-secondary hover:bg-background-tertiary hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        ),
      )}
    </nav>
  );
}
