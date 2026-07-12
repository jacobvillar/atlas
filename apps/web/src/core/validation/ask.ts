import { z } from "zod";

// Trust-boundary validation for POST /api/ask (ATLAS-010: Ask Atlas follow-up
// chat). Bounds are enforced here so unbounded user content never reaches
// OpenAI (cost + prompt-injection surface). reportId identifies the saved
// report the question is about; RLS + an explicit ownership fetch in the route
// guarantee the caller can only ask about their own report.
export const askInputSchema = z.object({
  reportId: z.string().uuid(),
  question: z
    .string()
    .trim()
    .min(3, "Ask a slightly longer question.")
    .max(1000, "Question is too long."),
});

export type AskInput = z.infer<typeof askInputSchema>;
