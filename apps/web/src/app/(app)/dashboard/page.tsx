import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/core/supabase/server";
import { SignOutButton } from "@/modules/auth/components/sign-out-button";
import { NewAnalysisCard } from "@/modules/career-dashboard/components/new-analysis-card";
import { DashboardEmptyState } from "@/modules/career-dashboard/components/dashboard-empty-state";
import {
  RecentReports,
  type RecentReport,
} from "@/modules/career-dashboard/components/recent-reports";
import { DashboardSection } from "@/modules/career-dashboard/components/dashboard-section";
import { ActiveQuestsPreview } from "@/modules/career-dashboard/components/active-quests-preview";
import { RoadmapProgress } from "@/modules/career-dashboard/components/roadmap-progress";
import { MilestoneBadges } from "@/modules/career-dashboard/components/milestone-badges";
import { computeProgression } from "@/core/gamification/levels";
import { computeBadges } from "@/core/gamification/badges";
import { todaysQuests } from "@/core/gamification/today";
import type { ReportJson } from "@/core/ai/schemas";

// Protected by proxy.ts; this second check is defense-in-depth and gives us the
// authenticated user for the greeting.
export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // RLS scopes this to the authenticated user; no extra filter needed.
  const { data: reports } = await supabase
    .from("career_reports")
    .select("id, target_role, fit_score, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const recentReports = (reports ?? []) as RecentReport[];
  const hasReports = recentReports.length > 0;

  // Most recent report drives the quest-preview, progress, and badge widgets.
  // These are read-only snapshots — interaction happens on the report page
  // (ATLAS-009).
  const latestReportId = recentReports[0]?.id ?? null;

  let latestReportJson: ReportJson | null = null;
  if (latestReportId) {
    const { data: latestReport } = await supabase
      .from("career_reports")
      .select("report_json")
      .eq("id", latestReportId)
      .maybeSingle();
    latestReportJson = (latestReport?.report_json as ReportJson) ?? null;
  }

  let completedQuestIds = new Set<string>();
  if (latestReportId) {
    const { data: progress } = await supabase
      .from("roadmap_quest_progress")
      .select("quest_id")
      .eq("career_report_id", latestReportId)
      .eq("status", "completed");
    completedQuestIds = new Set((progress ?? []).map((row) => row.quest_id as string));
  }

  const latestQuests = latestReportJson?.roadmapQuests ?? [];
  const progression = latestReportJson
    ? computeProgression(latestQuests, completedQuestIds)
    : null;
  const badges = latestReportJson ? computeBadges(latestQuests, completedQuestIds) : null;
  const nextQuests = latestReportJson
    ? todaysQuests(latestQuests, completedQuestIds)
    : [];

  return (
    <div className="min-h-full bg-background-secondary">
      <header className="border-b border-border-subtle bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/atlas-mark.svg" alt="Atlas" width={28} height={28} />
            <span className="text-sm font-semibold text-foreground">Atlas</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground-muted">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Your career dashboard
        </h1>
        <p className="mt-2 text-sm text-foreground-secondary">
          Start a new analysis to compare your resume against a target role and
          map your next move.
        </p>

        <div className="mt-8">
          <NewAnalysisCard />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DashboardSection
              title="Recent reports"
              description="Your latest saved readiness reports."
            >
              {hasReports ? (
                <RecentReports reports={recentReports} />
              ) : (
                <DashboardEmptyState />
              )}
            </DashboardSection>
          </div>

          <div className="flex flex-col gap-6">
            <DashboardSection
              title="Active quest preview"
              description="Top roadmap quests from your latest report."
            >
              <ActiveQuestsPreview reportId={latestReportId} quests={nextQuests} />
            </DashboardSection>

            <DashboardSection
              title="Roadmap progress"
              description="Completion across your latest report's quests."
            >
              <RoadmapProgress progression={progression} />
            </DashboardSection>

            <DashboardSection
              title="Milestone badges"
              description="Earned by completing quest categories."
            >
              <MilestoneBadges badges={badges} />
            </DashboardSection>
          </div>
        </div>
      </main>
    </div>
  );
}
