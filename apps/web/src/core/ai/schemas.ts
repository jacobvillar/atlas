import { z } from "zod";

// Stable, closed vocabularies. Quest categories drive milestone badges
// (ATLAS-009), so keep this list stable once reports exist in the wild.
export const QUEST_CATEGORIES = [
  "resume",
  "skills",
  "projects",
  "networking",
  "interview",
] as const;

export const QUEST_PHASES = ["30", "60", "90"] as const;

// Server-owned, never model-generated: keeps the fit score framed as guidance
// (see CLAUDE.md product rules) instead of letting the model soften or drop it.
export const DISCLAIMER =
  "This readiness estimate is AI-generated guidance to help you prepare. The fit score is not a hiring prediction and does not guarantee interviews or offers. Use your own judgment alongside it.";

// Structured resume evidence. This — not raw resume text — is what we persist.
export const resumeEvidenceSchema = z.object({
  summary: z.string().max(1200),
  skills: z.array(z.string().max(120)).max(40),
  experience: z
    .array(
      z.object({
        title: z.string().max(200),
        organization: z.string().max(200).optional(),
        highlights: z.array(z.string().max(400)).max(8),
      }),
    )
    .max(15),
  education: z.array(z.string().max(300)).max(10),
});

// The model produces quest drafts WITHOUT ids; the server assigns stable ids at
// save time so they are unique per report and survive re-reads.
export const questDraftSchema = z.object({
  title: z.string().max(160),
  description: z.string().max(600),
  phase: z.enum(QUEST_PHASES),
  category: z.enum(QUEST_CATEGORIES),
});

export const roleRequirementSchema = z.object({
  requirement: z.string().max(300),
  status: z.enum(["met", "partial", "missing"]),
});

export const gapSchema = z.object({
  area: z.string().max(160),
  detail: z.string().max(600),
});

export const resumeSuggestionSchema = z.object({
  area: z.string().max(160),
  suggestion: z.string().max(600),
});

// The report fields the model is responsible for. sources + disclaimer are added
// server-side, so they are intentionally absent here.
export const reportDraftSchema = z.object({
  fitScore: z.number().int().min(0).max(100),
  summary: z.string().max(1500),
  roleRequirements: z.array(roleRequirementSchema).min(1).max(14),
  strengths: z.array(z.string().max(400)).min(1).max(10),
  gaps: z.array(gapSchema).max(8),
  resumeSuggestions: z.array(resumeSuggestionSchema).max(8),
  roadmapQuests: z.array(questDraftSchema).min(3).max(12),
});

// Single structured payload the analysis call must return.
export const analysisOutputSchema = z.object({
  resumeEvidence: resumeEvidenceSchema,
  report: reportDraftSchema,
});

// Career-path mode (ATLAS-006A): when a user supplies only a target role, the
// model synthesizes a representative role-requirements profile that is then fed
// into the identical downstream pipeline as if it were a pasted job description.
export const roleProfileOutputSchema = z.object({
  roleProfile: z.string().min(200).max(8000),
});
export type RoleProfileOutput = z.infer<typeof roleProfileOutputSchema>;

export type ResumeEvidence = z.infer<typeof resumeEvidenceSchema>;
export type QuestDraft = z.infer<typeof questDraftSchema>;
export type ReportDraft = z.infer<typeof reportDraftSchema>;
export type AnalysisOutput = z.infer<typeof analysisOutputSchema>;

// xp is server-assigned (see core/gamification) — never model-generated, so it
// is added here rather than in questDraftSchema.
export type RoadmapQuest = QuestDraft & { questId: string; xp: number };

export interface ReportSource {
  title: string;
  url: string | null;
}

// The shape saved to career_reports.report_json and rendered by ATLAS-008.
export interface ReportJson {
  targetRole: string | null;
  fitScore: number;
  summary: string;
  roleRequirements: z.infer<typeof roleRequirementSchema>[];
  strengths: string[];
  gaps: z.infer<typeof gapSchema>[];
  resumeSuggestions: z.infer<typeof resumeSuggestionSchema>[];
  roadmapQuests: RoadmapQuest[];
  sources: ReportSource[];
  disclaimer: string;
  xpTotal: number;
  inputMode: "job_description" | "career_path";
}

// Retrieved career-guidance chunk. Defined here (type-only) so pure modules can
// reference it without importing the Supabase server client.
export interface GuidanceChunk {
  id: string;
  sourceTitle: string;
  sourceUrl: string | null;
  sourceType: string;
  chunkText: string;
  similarity: number;
}
