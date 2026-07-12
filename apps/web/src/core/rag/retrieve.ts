import { createClient } from "@/core/supabase/server";
import { embedText } from "@/core/ai/openai";
import type { GuidanceChunk } from "@/core/ai/schemas";

interface MatchRow {
  id: string;
  source_title: string;
  source_url: string | null;
  source_type: string;
  chunk_text: string;
  similarity: number;
}

// Runtime RAG retrieval (CLAUDE.md keeps Python RAG offline-only). Guidance is
// optional context: any failure — missing key, unseeded table, RPC error —
// degrades to no guidance rather than blocking report generation.
export async function retrieveGuidance(
  query: string,
  matchCount = 6,
): Promise<GuidanceChunk[]> {
  try {
    const embedding = await embedText(query);
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("match_career_resources", {
      query_embedding: embedding,
      match_count: matchCount,
      min_similarity: 0.2,
    });

    if (error || !data) {
      return [];
    }

    return (data as MatchRow[]).map((row) => ({
      id: row.id,
      sourceTitle: row.source_title,
      sourceUrl: row.source_url ?? null,
      sourceType: row.source_type,
      chunkText: row.chunk_text,
      similarity: row.similarity,
    }));
  } catch {
    return [];
  }
}
