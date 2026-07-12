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

  const reportHref = latestReportId
    ? `/reports/${latestReportId}`
    : "/analysis/new";
  const askHref = latestReportId
    ? `/reports/${latestReportId}#ask-atlas`
    : "/analysis/new";

  const onReportPage = latestReportId
    ? pathname === `/reports/${latestReportId}`
    : false;

  const tabs = [
    { label: "Home", href: "/dashboard", active: pathname === "/dashboard" },
    { label: "Quests", href: reportHref, active: onReportPage },
    { label: "Ask Atlas", href: askHref, active: onReportPage },
    {
      label: "New Analysis",
      href: "/analysis/new",
      active: pathname === "/analysis/new",
    },
  ];

  return (
    <nav aria-label="Primary" className="flex items-center gap-1">
      {tabs.map((tab) => (
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
      ))}
    </nav>
  );
}
