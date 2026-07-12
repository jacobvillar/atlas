import { z } from "zod";

// Trust-boundary validation for POST /api/analyze. Bounds are enforced here so
// unbounded user content never reaches OpenAI (cost + prompt-injection surface).
//
// Two input modes (ATLAS-006A):
// - "job_description" (default): the user pastes a real job description.
// - "career_path": the user supplies only a target role; the server synthesizes
//   a representative role profile that stands in for jobDescriptionText.
//
// mode is optional and defaults to "job_description", so existing callers that
// send no mode field validate exactly as before. jobDescriptionText is optional
// at the field level and its presence is enforced per-mode in superRefine, which
// yields clear per-field error messages while keeping AnalyzeInput a single
// object type for the downstream analysis pipeline.
export const analyzeInputSchema = z
  .object({
    mode: z.enum(["job_description", "career_path"]).default("job_description"),
    resumeText: z
      .string()
      .trim()
      .min(50, "Add more resume detail before analyzing.")
      .max(20000, "Resume text is too long."),
    jobDescriptionText: z.string().trim().max(15000, "Job description is too long.").optional(),
    targetRole: z.string().trim().max(200).optional(),
    resumeDocumentId: z.string().uuid().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "career_path") {
      // Role-only input: the job description is synthesized, so it must not be
      // supplied, and a target role is required.
      if (data.jobDescriptionText && data.jobDescriptionText.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jobDescriptionText"],
          message: "Leave the job description empty in career-path mode; it is generated for you.",
        });
      }
      const role = data.targetRole?.trim() ?? "";
      if (role.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["targetRole"],
          message: "Enter a target role (at least 3 characters).",
        });
      }
    } else {
      // Pasted job-description mode: keep the original required rule and bounds.
      const jd = data.jobDescriptionText?.trim() ?? "";
      if (jd.length < 50) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jobDescriptionText"],
          message: "Add more job description detail before analyzing.",
        });
      }
    }
  });

export type AnalyzeInput = z.infer<typeof analyzeInputSchema>;
