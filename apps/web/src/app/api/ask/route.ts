import { NextResponse } from "next/server";
import { createClient } from "@/core/supabase/server";
import { askInputSchema } from "@/core/validation/ask";
import { retrieveGuidance } from "@/core/rag/retrieve";
import { answerQuestion } from "@/core/ai/openai";
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

  const { data: progress } = await supabase
    .from("roadmap_quest_progress")
    .select("quest_id, status")
    .eq("career_report_id", reportId)
    .eq("status", "completed");

  const completedQuestIds = new Set<string>(
    (progress ?? []).map((row) => row.quest_id as string),
  );

  // Guidance is retrieved for the QUESTION and degrades to [] on any failure.
  const guidance = await retrieveGuidance(question);

  let answer: string;
  try {
    answer = await answerQuestion({
      question,
      report: report.report_json as ReportJson,
      resumeEvidence: report.resume_evidence_json as ResumeEvidence,
      jobDescriptionText: (report.job_description_text as string) ?? "",
      completedQuestIds,
      guidance,
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

  // Persist the user message first, then the assistant message. Their created_at
  // differ by the LLM latency between these two inserts, which is what the
  // (created_at ASC, id ASC) read ordering relies on. RLS scopes both writes to
  // the owner. A save failure after a successful answer is logged (error string
  // only) but not fatal — the caller still gets the answer.
  const { error: userInsertError } = await supabase
    .from("ask_atlas_messages")
    .insert({
      user_id: user.id,
      career_report_id: reportId,
      role: "user",
      content: question,
    });
  if (userInsertError) {
    console.error("ask: user message insert failed:", userInsertError.message);
  }

  const { error: assistantInsertError } = await supabase
    .from("ask_atlas_messages")
    .insert({
      user_id: user.id,
      career_report_id: reportId,
      role: "assistant",
      content: answer,
    });
  if (assistantInsertError) {
    console.error(
      "ask: assistant message insert failed:",
      assistantInsertError.message,
    );
  }

  return NextResponse.json({ answer });
}
