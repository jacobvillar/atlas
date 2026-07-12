import type { Metadata } from "next";
import { PublicShell, useCaseEntries } from "@/modules/public-site";

export const metadata: Metadata = {
  title: "Use Cases — Atlas",
  description:
    "See who Atlas helps: fresh graduates, early-career professionals, career shifters, learners, and advisors.",
};

export default function UseCasesPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Who Atlas helps
        </h1>
        <p className="mt-3 max-w-2xl text-foreground-secondary">
          Atlas is built for the broader job market, not only tech roles.
          Here is how different people use it.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {useCaseEntries.map((useCase) => (
            <div
              key={useCase.title}
              className="rounded-lg border border-border-subtle bg-background p-6"
            >
              <h2 className="text-lg font-semibold text-foreground">
                {useCase.title}
              </h2>
              <p className="mt-2 text-sm text-foreground-secondary">
                {useCase.situation}
              </p>

              <dl className="mt-4 space-y-3 border-t border-border-subtle pt-4">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                    Input
                  </dt>
                  <dd className="mt-1 text-sm text-foreground-secondary">
                    {useCase.input}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                    Atlas returns
                  </dt>
                  <dd className="mt-1 text-sm text-foreground-secondary">
                    {useCase.output}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                    Example
                  </dt>
                  <dd className="mt-1 text-sm text-foreground-secondary">
                    {useCase.example}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
