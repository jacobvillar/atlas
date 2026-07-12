import { NextResponse } from "next/server";
import { createClient } from "@/core/supabase/server";
import { questProgressInputSchema } from "@/core/validation/quest-progress";

interface RouteParams {
  params: Promise<{ id: string; questId: string }>;
}

// PATCH /api/reports/[id]/quests/[questId] — authenticated. Updates an
// existing roadmap_quest_progress row (never inserts; rows are seeded at
// report generation in /api/analyze). RLS scopes the UPDATE to rows owned by
// the current user, so this can only ever touch the caller's own progress.
// Logging is limited to error strings: never report content (CLAUDE.md
// privacy rules).
export async function PATCH(request: Request, { params }: RouteParams) {
  const { id, questId } = await params;

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

  const parsed = questProgressInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { status } = parsed.data;

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("roadmap_quest_progress")
    .update({
      status,
      completed_at: status === "completed" ? now : null,
      updated_at: now,
    })
    .eq("career_report_id", id)
    .eq("quest_id", questId)
    .select("quest_id, status");

  if (error) {
    console.error(
      "quest-progress: update failed:",
      error instanceof Error ? error.message : "unknown error",
    );
    return NextResponse.json(
      { error: "Could not update quest." },
      { status: 500 },
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Quest not found." }, { status: 404 });
  }

  return NextResponse.json({ questId, status });
}
