import type { Metadata } from "next";
import { PublicShell } from "@/modules/public-site";

export const metadata: Metadata = {
  title: "Privacy — Atlas",
  description:
    "Plain-language privacy commitments: Atlas does not store uploaded resume files or full raw resume text.",
};

const commitments = [
  {
    title: "We do not store uploaded resume files",
    detail:
      "Atlas processes your uploaded resume file to extract structured evidence, but the file itself is not stored in v1.",
  },
  {
    title: "We do not store full raw resume text",
    detail:
      "Atlas does not save your complete raw resume text. We store resume metadata (like file name, type, and status) and structured resume evidence extracted during analysis, not a full text copy.",
  },
  {
    title: "Reports and Ask Atlas messages belong to you",
    detail:
      "Your generated readiness report, roadmap quest progress, and Ask Atlas messages are saved to your account and are only readable and writable by you.",
  },
  {
    title: "Private resumes are not added to the shared knowledge base",
    detail:
      "Atlas retrieves career guidance from a curated knowledge base for report generation and Ask Atlas. Your resume, job description, and Ask Atlas messages are never added to that shared knowledge base.",
  },
  {
    title: "AI output is guidance, not a hiring decision",
    detail:
      "The fit score and roadmap are meant to help you prioritize next steps. They are not a hiring prediction, an interview guarantee, or a substitute for a recruiter's decision.",
  },
  {
    title: "Remove sensitive personal data before uploading",
    detail:
      "Atlas only needs resume-relevant information and your target job description. Please remove highly sensitive personal data (such as government ID numbers) from your resume before uploading.",
  },
];

export default function PrivacyPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Privacy
        </h1>
        <p className="mt-3 text-foreground-secondary">
          This page explains, in plain language, what Atlas stores and does
          not store. It is a product privacy page for the capstone MVP, not
          a full legal privacy policy.
        </p>

        <div className="mt-10 space-y-6">
          {commitments.map((commitment) => (
            <div
              key={commitment.title}
              className="rounded-lg border border-border-subtle bg-background-secondary p-6"
            >
              <h2 className="text-base font-semibold text-foreground">
                {commitment.title}
              </h2>
              <p className="mt-2 text-sm text-foreground-secondary">
                {commitment.detail}
              </p>
            </div>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
