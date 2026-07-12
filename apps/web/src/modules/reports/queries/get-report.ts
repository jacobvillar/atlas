import type { createClient } from "@/core/supabase/server";
import type { ReportJson } from "@/core/ai/schemas";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export interface CareerReportRow {
  id: string;
  target_role: string | null;
  fit_score: number;
  report_json: ReportJson;
  created_at: string;
}

export interface ReportForUser {
  report: CareerReportRow;
  completedQuestIds: ReadonlySet<string>;
}

// RLS scopes both queries to the authenticated user, so no extra user_id
// filter is needed here. Returns null when the report doesn't exist or isn't
// owned by the current user (RLS makes those indistinguishable, which is the
// desired behavior — callers should render a generic not-found state).
export async function getReportForUser(
  supabase: SupabaseServerClient,
  id: string,
): Promise<ReportForUser | null> {
  const { data: report } = await supabase
    .from("career_reports")
    .select("id, target_role, fit_score, report_json, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!report) {
    return null;
  }

  const { data: progress } = await supabase
    .from("roadmap_quest_progress")
    .select("quest_id, status")
    .eq("career_report_id", id)
    .eq("status", "completed");

  const completedQuestIds = new Set<string>(
    (progress ?? []).map((row) => row.quest_id as string),
  );

  return {
    report: report as CareerReportRow,
    completedQuestIds,
  };
}
