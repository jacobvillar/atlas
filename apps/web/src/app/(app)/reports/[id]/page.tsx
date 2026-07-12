import { notFound, redirect } from "next/navigation";
import { createClient } from "@/core/supabase/server";
import { getReportForUser } from "@/modules/reports/queries/get-report";
import { getAskMessages } from "@/modules/ask-atlas/queries/get-messages";
import { ReadinessDashboard } from "@/modules/readiness-report/components/readiness-dashboard";

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

// Protected by proxy.ts (/reports prefix); this second check is
// defense-in-depth, matching the dashboard page's pattern. Quest completion
// toggling, live XP, and badges (ATLAS-009) are interactive and live in
// ReadinessDashboard/InteractiveRoadmap — this page fetches once server-side
// and hands off the initial completed-quest set as a starting point.
export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const result = await getReportForUser(supabase, id);

  if (!result) {
    notFound();
  }

  const { report, completedQuestIds } = result;
  const askMessages = await getAskMessages(supabase, id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <ReadinessDashboard
        report={report.report_json}
        createdAt={report.created_at}
        reportId={report.id}
        initialCompletedQuestIds={Array.from(completedQuestIds)}
        askMessages={askMessages}
      />
    </main>
  );
}
