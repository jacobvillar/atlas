import Image from "next/image";
import Link from "next/link";
import { PublicShell } from "@/modules/public-site";

const workflowSteps = [
  {
    title: "Upload your resume",
    description:
      "Upload a PDF or DOCX resume, or paste your resume text as a fallback.",
  },
  {
    title: "Paste a job description",
    description:
      "Paste the job description for the role you are targeting next.",
  },
  {
    title: "Review your readiness dashboard",
    description:
      "See your fit score, matched strengths, priority gaps, and resume improvements.",
  },
  {
    title: "Work your roadmap quests",
    description:
      "Complete 30/60/90-day quests, track progress, and ask Atlas follow-up questions.",
  },
];

const dashboardPreviewItems = [
  { label: "Fit score", detail: "A guidance score, not a hiring prediction." },
  { label: "Matched strengths", detail: "Evidence pulled from your resume." },
  { label: "Priority gaps", detail: "What to close before you apply." },
  { label: "Roadmap quests", detail: "30/60/90-day practical next steps." },
];

const trustItems = [
  "We do not store your uploaded resume file.",
  "We do not store your full raw resume text.",
  "Your reports and Ask Atlas chats are private to your account.",
];

export default function Home() {
  return (
    <PublicShell>
      <section className="border-b border-border-subtle bg-background-secondary">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-20">
          <Image
            src="/atlas-mark.svg"
            alt="Atlas"
            width={56}
            height={56}
            priority
          />
          <div className="flex flex-col gap-4">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Map your next career move.
            </h1>
            <p className="max-w-xl text-lg text-foreground-secondary">
              Compare your resume to a real target role and turn the gaps
              into practical 30/60/90-day career quests.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="rounded-md bg-accent px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-hover"
            >
              Sign up for free
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-border-subtle bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-background-tertiary"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
          How it works
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-lg border border-border-subtle bg-background p-5"
            >
              <span className="text-xs font-medium text-accent">
                Step {index + 1}
              </span>
              <h3 className="mt-2 text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-foreground-secondary">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border-subtle bg-background-secondary">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
            Your readiness dashboard
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dashboardPreviewItems.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border-subtle bg-background p-5"
              >
                <h3 className="text-base font-semibold text-foreground">
                  {item.label}
                </h3>
                <p className="mt-2 text-sm text-foreground-secondary">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm text-foreground-muted">
            Use the fit score and roadmap as guidance, not a hiring
            prediction.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
          Built with your privacy in mind
        </h2>
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {trustItems.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-border-subtle bg-background p-5 text-sm text-foreground-secondary"
            >
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-foreground-muted">
          Read the full{" "}
          <Link href="/privacy" className="text-accent hover:text-accent-hover">
            privacy commitments
          </Link>
          .
        </p>
      </section>

      <section className="border-t border-border-subtle bg-background-secondary">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Ready to map your next move?
          </h2>
          <p className="max-w-xl text-sm text-foreground-secondary">
            Create a free account to generate your first readiness report.
          </p>
          <Link
            href="/signup"
            className="rounded-md bg-accent px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-hover"
          >
            Sign up for free
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
