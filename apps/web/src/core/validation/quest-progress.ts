import { z } from "zod";

// Trust-boundary validation for PATCH /api/reports/[id]/quests/[questId].
// Only these two statuses exist in roadmap_quest_progress (see
// supabase/migrations/001_reports.sql check constraint).
export const questProgressInputSchema = z.object({
  status: z.enum(["completed", "not_started"]),
});

export type QuestProgressInput = z.infer<typeof questProgressInputSchema>;
