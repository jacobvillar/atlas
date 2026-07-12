import type { Metadata } from "next";
import { PublicShell, faqEntries } from "@/modules/public-site";

export const metadata: Metadata = {
  title: "FAQ — Atlas",
  description:
    "Practical questions about how Atlas works, what it stores, and what to expect.",
};

export default function FaqPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Frequently asked questions
        </h1>
        <p className="mt-3 text-foreground-secondary">
          Practical answers before you sign up.
        </p>

        <dl className="mt-10 divide-y divide-border-subtle border-t border-border-subtle">
          {faqEntries.map((entry) => (
            <div key={entry.question} className="py-6">
              <dt className="text-base font-semibold text-foreground">
                {entry.question}
              </dt>
              <dd className="mt-2 text-sm text-foreground-secondary">
                {entry.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </PublicShell>
  );
}
