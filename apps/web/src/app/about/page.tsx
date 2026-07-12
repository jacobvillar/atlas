import type { Metadata } from "next";
import { PublicShell } from "@/modules/public-site";

export const metadata: Metadata = {
  title: "About — Atlas",
  description:
    "Why Atlas exists and how it turns a resume and job description into a structured, actionable career-readiness report.",
};

export default function AboutPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          About Atlas
        </h1>

        <div className="mt-8 space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Why Atlas exists
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
              Career advice is often generic, and it is hard to turn resume
              feedback into a concrete plan. Atlas takes a resume and a
              specific target job description and turns them into a
              structured, evidence-based readiness report instead of vague
              suggestions.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              The problem
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
              Job seekers get plenty of general career advice but rarely a
              clear, role-specific view of where their resume stands
              against a real job description, or what to actually do about
              the gaps.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              What we believe
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
              Career guidance should be structured, private, and actionable.
              A useful readiness report shows your fit score, your matched
              strengths, your priority gaps, and a practical roadmap, not
              just a generic tip list.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              How Atlas works
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
              After you sign in, you upload or paste a resume and paste a
              target job description. Atlas extracts structured resume
              evidence, compares it against the job description, and
              generates a readiness report with a fit score, strengths,
              gaps, resume improvements, and 30/60/90-day roadmap quests.
              You can mark quests complete, track progress, and ask
              report-specific follow-up questions through Ask Atlas.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Project note
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
              Atlas is a post-graduate AI web application capstone project.
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
