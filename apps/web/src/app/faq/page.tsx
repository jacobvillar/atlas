import type { Metadata } from "next";
import { PublicShell, faqEntries } from "@/modules/public-site";

export const metadata: Metadata = {
  title: "FAQ — Atlas",
  description: "Practical questions about Atlas Career Campaigns.",
};

export default function FaqPage() {
  return (
    <PublicShell>
      <section className="campaign-page-hero campaign-page-hero--faq">
        <div className="campaign-page-hero__inner">
          <p className="campaign-page-hero__eyebrow">FIELD GUIDE</p>
          <h1>Everything you need before starting.</h1>
          <p>Short answers about how Atlas works, what it stores, and what a Career Campaign can actually help you do.</p>
        </div>
      </section>
      <section className="atlas-faq">
        <div className="atlas-faq__intro">
          <p className="campaign-section-label">COMMON QUESTIONS</p>
          <h2>Know the map before you take the first step.</h2>
        </div>
        <dl className="atlas-faq__list">
          {faqEntries.map((entry, index) => (
            <div key={entry.question}>
              <dt><span>0{index + 1}</span>{entry.question}</dt>
              <dd>{entry.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </PublicShell>
  );
}
