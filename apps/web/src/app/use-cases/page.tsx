import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell, useCaseEntries } from "@/modules/public-site";

export const metadata: Metadata = {
  title: "Use Cases — Atlas",
  description:
    "Find the Atlas Career Campaign that fits your next professional move.",
};

export default function UseCasesPage() {
  return (
    <PublicShell>
      <section className="campaign-page-hero campaign-page-hero--lanes">
        <div className="campaign-page-hero__orb campaign-page-hero__orb--one" aria-hidden="true" />
        <div className="campaign-page-hero__orb campaign-page-hero__orb--two" aria-hidden="true" />
        <div className="campaign-page-hero__inner">
          <p className="campaign-page-hero__eyebrow">CHOOSE YOUR STARTING POINT</p>
          <h1>Every career move deserves a mission map.</h1>
          <p>
            Pick the path that feels closest to your next move, then turn your resume into evidence employers can see.
          </p>
          <div className="campaign-page-hero__stats" aria-label="Atlas campaign qualities">
            <span><strong>1</strong> target role</span>
            <span><strong>3</strong> campaign phases</span>
            <span><strong>0</strong> empty advice lists</span>
          </div>
        </div>
      </section>

      <section className="campaign-lanes">
        <div className="campaign-lanes__heading">
          <p className="campaign-section-label">CAREER CAMPAIGN LANES</p>
          <h2>Start with the story you already have.</h2>
          <p>Each lane begins with the same core move: turn what you have done into the proof your target role needs.</p>
        </div>

        <div className="campaign-lanes__grid">
          {useCaseEntries.map((useCase, index) => (
            <article key={useCase.title} className="campaign-lane-card">
              <div className="campaign-lane-card__topline">
                <span className="campaign-lane-card__number">0{index + 1}</span>
                <span className="campaign-lane-card__label">{useCase.label}</span>
              </div>
              <h2>{useCase.title}</h2>
              <p className="campaign-lane-card__situation">{useCase.situation}</p>

              <div className="campaign-lane-card__mission">
                <span>Campaign objective</span>
                <strong>{useCase.mission}</strong>
              </div>

              <dl className="campaign-lane-card__details">
                <div>
                  <dt>Bring</dt>
                  <dd>{useCase.input}</dd>
                </div>
                <div>
                  <dt>Unlock</dt>
                  <dd>{useCase.output}</dd>
                </div>
              </dl>

              <p className="campaign-lane-card__example">{useCase.example}</p>
            </article>
          ))}
        </div>

        <div className="campaign-lanes__cta">
          <div>
            <p className="campaign-section-label">NOT SURE WHICH LANE?</p>
            <h2>Your target job is the compass.</h2>
          </div>
          <Link href="/signup" className="atlas-button atlas-button--primary">
            Build my campaign
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
