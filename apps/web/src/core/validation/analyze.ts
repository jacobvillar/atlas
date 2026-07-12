import { z } from "zod";

// Trust-boundary validation for POST /api/analyze. Bounds are enforced here so
// unbounded user content never reaches OpenAI (cost + prompt-injection surface).
export const analyzeInputSchema = z.object({
  resumeText: z
    .string()
    .trim()
    .min(50, "Add more resume detail before analyzing.")
    .max(20000, "Resume text is too long."),
  jobDescriptionText: z
    .string()
    .trim()
    .min(50, "Add more job description detail before analyzing.")
    .max(15000, "Job description is too long."),
  targetRole: z.string().trim().max(200).optional(),
  resumeDocumentId: z.string().uuid().optional(),
});

export type AnalyzeInput = z.infer<typeof analyzeInputSchema>;
