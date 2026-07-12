import { NextResponse } from "next/server";
import { createClient } from "@/core/supabase/server";
import { analyzeInputSchema } from "@/core/validation/analyze";
import { retrieveGuidance } from "@/core/rag/retrieve";
import { generateAnalysis } from "@/core/ai/openai";
import { assembleReportJson } from "@/core/ai/report";

// POST /api/analyze — authenticated. Validates input, retrieves RAG guidance,
// generates a validated readiness report, and saves it under the current user.
// Logging is deliberately limited to error strings: never resume text, job
// descriptions, keys, or report content (CLAUDE.md privacy rules).
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

  const parsed = analyzeInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const input = parsed.data;

  let output;
  let guidance;
  try {
    guidance = await retrieveGuidance(
      `${input.targetRole ?? ""}\n${input.jobDescriptionText}`,
    );
    output = await generateAnalysis(input, guidance);
  } catch (error) {
    console.error(
      "analyze: generation failed:",
      error instanceof Error ? error.message : "unknown error",
    );
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 502 },
    );
  }

  const { reportJson, quests } = assembleReportJson(
    output,
    guidance,
    input.targetRole ?? null,
  );

  const { data: report, error: insertError } = await supabase
    .from("career_reports")
    .insert({
      user_id: user.id,
      resume_document_id: input.resumeDocumentId ?? null,
      target_role: input.targetRole ?? null,
      job_description_text: input.jobDescriptionText,
      resume_evidence_json: output.resumeEvidence,
      report_json: reportJson,
      fit_score: reportJson.fitScore,
    })
    .select("id")
    .single();

  if (insertError || !report) {
    console.error("analyze: report insert failed:", insertError?.message);
    return NextResponse.json({ error: "Could not save report." }, { status: 500 });
  }

  // Seed one progress row per quest. RLS scopes these to the owner; a failure
  // here leaves a valid report, so log and continue rather than 500.
  if (quests.length > 0) {
    const { error: questError } = await supabase
      .from("roadmap_quest_progress")
      .insert(
        quests.map((quest) => ({
          user_id: user.id,
          career_report_id: report.id,
          quest_id: quest.questId,
          status: "not_started" as const,
        })),
      );
    if (questError) {
      console.error("analyze: quest seed failed:", questError.message);
    }
  }

  return NextResponse.json({ reportId: report.id, report: reportJson });
}
