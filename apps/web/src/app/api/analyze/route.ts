import { NextResponse } from "next/server";
import { createClient } from "@/core/supabase/server";
import { analyzeInputSchema } from "@/core/validation/analyze";
import { retrieveGuidance } from "@/core/rag/retrieve";
import { generateAnalysis, synthesizeRoleProfile } from "@/core/ai/openai";
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

  // Career-path mode: the user gave only a target role, so synthesize a
  // representative role profile that stands in for the job description across
  // retrieval, generation, and the persisted record. Any failure here is fatal
  // to the request — we cannot analyze without a job description. Log only the
  // error string; never the role text or the synthesized profile.
  let jobDescriptionText = input.jobDescriptionText ?? "";
  if (input.mode === "career_path") {
    try {
      jobDescriptionText = await synthesizeRoleProfile(input.targetRole ?? "");
    } catch (error) {
      console.error(
        "analyze: role profile synthesis failed:",
        error instanceof Error ? error.message : "unknown error",
      );
      return NextResponse.json(
        {
          error:
            "Could not build a role profile. Please try again or paste a job description.",
        },
        { status: 502 },
      );
    }
  }

  // From here the pipeline is identical for both modes: it always operates on a
  // concrete job description (pasted or synthesized).
  const analysisInput = { ...input, jobDescriptionText };

  let output;
  let guidance;
  try {
    guidance = await retrieveGuidance(
      `${input.targetRole ?? ""}\n${jobDescriptionText}`,
    );
    output = await generateAnalysis(analysisInput, guidance);
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
    input.mode,
  );

  // Verify the caller owns the referenced resume document before linking it.
  // RLS scopes this lookup to the authenticated user, so a foreign id simply
  // returns no row. Provenance is optional, so we silently null it rather
  // than failing the request.
  let resumeDocumentId: string | null = null;
  if (input.resumeDocumentId) {
    const { data: doc } = await supabase
      .from("resume_documents")
      .select("id")
      .eq("id", input.resumeDocumentId)
      .maybeSingle();
    resumeDocumentId = doc?.id ?? null;
  }

  const { data: report, error: insertError } = await supabase
    .from("career_reports")
    .insert({
      user_id: user.id,
      resume_document_id: resumeDocumentId,
      target_role: input.targetRole ?? null,
      job_description_text: jobDescriptionText,
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

  // Seed one progress row per quest. A report without those rows leaves the
  // quest board permanently broken, so roll back the report rather than
  // returning a partially usable analysis.
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
      const { error: rollbackError } = await supabase
        .from("career_reports")
        .delete()
        .eq("id", report.id);
      if (rollbackError) {
        console.error("analyze: report rollback failed:", rollbackError.message);
      }
      return NextResponse.json(
        { error: "Could not initialize your roadmap. Please try again." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ reportId: report.id, report: reportJson });
}
