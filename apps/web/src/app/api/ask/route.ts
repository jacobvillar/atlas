import { NextResponse } from "next/server";
import { createClient } from "@/core/supabase/server";
import { askInputSchema } from "@/core/validation/ask";
import { answerQuestionAgentic } from "@/core/ai/ask-agent";
import type { ReportJson, ResumeEvidence } from "@/core/ai/schemas";

// POST /api/ask — authenticated Ask Atlas follow-up (ATLAS-010). Answers one
// report-specific question grounded in the report owner's OWN stored data
// (report JSON, structured resume evidence, pasted/synthesized job description,
// quest progress) plus retrieved curated guidance, then saves both the question
// and the answer.
//
// Privacy boundary (CLAUDE.md): RLS scopes every read/write to the current
// user, and the report is fetched by id (owner-only) before anything else — a
// missing/foreign report is a 404. Retrieved guidance (RAG) is READ-ONLY here;
// the question, answer, report, evidence, or job description are NEVER written
// into the shared RAG tables or embedded into them. Logging is limited to error
// strings: never the question, answer, report content, evidence, or JD.
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const parsed = askInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { reportId, question } = parsed.data;

  // Explicit ownership fetch (defense-in-depth on top of RLS). A missing or
  // foreign report is indistinguishable under RLS — both surface as not found.
  const { data: report } = await supabase
    .from("career_reports")
    .select("report_json, resume_evidence_json, job_description_text")
    .eq("id", reportId)
    .maybeSingle();

  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  const { data: progress, error: progressError } = await supabase
    .from("roadmap_quest_progress")
    .select("quest_id, status")
    .eq("career_report_id", reportId)
    .eq("status", "completed");

  // Quest progress is graceful-degrade context (like guidance): a fetch failure
  // means the answer is generated as if no quests were completed. Surface it in
  // logs so it isn't a silent gap; never block the answer on it.
  if (progressError) {
    console.warn("ask: quest progress fetch failed:", progressError.message);
  }

  const completedQuestIds = new Set<string>(
    (progress ?? []).map((row) => row.quest_id as string),
  );

  // The agent retrieves guidance on demand via its retrieve_guidance tool, so no
  // eager pre-fetch here; the static prompt starts with no pre-stuffed guidance.
  let answer: string;
  try {
    answer = await answerQuestionAgentic({
      question,
      report: report.report_json as ReportJson,
      resumeEvidence: report.resume_evidence_json as ResumeEvidence,
      jobDescriptionText: (report.job_description_text as string) ?? "",
      completedQuestIds,
      guidance: [],
    });
  } catch (error) {
    console.error(
      "ask: generation failed:",
      error instanceof Error ? error.message : "unknown error",
    );
    return NextResponse.json(
      { error: "Ask Atlas could not answer right now. Please try again." },
      { status: 502 },
    );
  }

  // Insert both sides of the exchange in one database operation. A separate
  // insert could leave an orphaned user question or assistant reply on failure.
  // The UI treats a persistence failure as retryable so saved history remains
  // internally consistent.
  const { error: messageInsertError } = await supabase
    .from("ask_atlas_messages")
    .insert([
      {
        user_id: user.id,
        career_report_id: reportId,
        role: "user",
        content: question,
      },
      {
        user_id: user.id,
        career_report_id: reportId,
        role: "assistant",
        content: answer,
      },
    ]);
  if (messageInsertError) {
    console.error("ask: message insert failed:", messageInsertError.message);
    return NextResponse.json(
      { error: "Ask Atlas could not save this conversation. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ answer });
}
