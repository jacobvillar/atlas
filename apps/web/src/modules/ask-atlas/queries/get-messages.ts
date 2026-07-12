import type { createClient } from "@/core/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export interface AskMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

// Ask Atlas conversation for one report (ATLAS-010). RLS scopes the read to the
// authenticated owner, so no user_id filter is needed here. The user message is
// inserted before generation and the assistant message after, so their
// created_at differ by LLM latency; ordering by (created_at ASC, id ASC) keeps
// each pair in send order and is a stable tiebreak.
export async function getAskMessages(
  supabase: SupabaseServerClient,
  reportId: string,
): Promise<AskMessage[]> {
  const { data } = await supabase
    .from("ask_atlas_messages")
    .select("id, role, content, created_at")
    .eq("career_report_id", reportId)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  return (data ?? []) as AskMessage[];
}
