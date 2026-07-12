import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/modules/public-site";

export const metadata: Metadata = {
  title: "About — Atlas",
  description: "Why Atlas turns role-fit advice into a Career Campaign.",
};

const principles = [
  {
    number: "01",
    title: "Advice should become evidence",
    copy: "A useful recommendation points to something you can show: a stronger resume bullet, a work sample, a practice answer, or a thoughtful outreach note.",
  },
  {
    number: "02",
    title: "Progress should be visible",
    copy: "Career preparation gets overwhelming when every gap feels equal. Atlas turns the highest-value next step into a current mission with a clear finish line.",
  },
  {
    number: "03",
    title: "The user owns the move",
    copy: "Atlas can organize evidence and suggest a path. It cannot promise a hiring outcome, and it never replaces your judgment or a recruiter’s decision.",
  },
];

export default function AboutPage() {
  return (
    <PublicShell>
      <section className="campaign-page-hero campaign-page-hero--lanes">
        <div className="campaign-page-hero__inner">
          <p className="campaign-page-hero__eyebrow">THE ATLAS POINT OF VIEW</p>
          <h1>Career advice should feel like a path, not a pile of tips.</h1>
          <p>
            Atlas exists for the moment after you receive feedback and before you know what to do with it. We turn that uncertainty into a role-specific campaign you can actually work through.
          </p>
        </div>
      </section>

      <section className="about-principles">
        <div className="about-principles__intro">
          <p className="campaign-section-label">WHAT ATLAS BELIEVES</p>
          <h2>Make the next move smaller, clearer, and more yours.</h2>
        </div>
        <div className="about-principles__list">
          {principles.map((principle) => (
            <article key={principle.number}>
              <span>{principle.number}</span>
              <h3>{principle.title}</h3>
              <p>{principle.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-how">
        <div>
          <p className="campaign-section-label">HOW A CAMPAIGN WORKS</p>
          <h2>Bring a resume. Choose a role. Build the proof.</h2>
        </div>
        <ol>
          <li><span>1</span><p><strong>Review your evidence.</strong> Atlas extracts and organizes what your resume already shows.</p></li>
          <li><span>2</span><p><strong>Compare it to a real role.</strong> Your job description creates the target, not a generic career template.</p></li>
          <li><span>3</span><p><strong>Work the missions.</strong> Complete small, visible actions that strengthen your story for that role.</p></li>
        </ol>
        <Link href="/signup" className="atlas-button atlas-button--primary">Start your campaign</Link>
      </section>

      <section className="about-note">
        <p>Atlas is built around a simple idea: a useful career plan should leave you with something clear to do and something real to show.</p>
      </section>
    </PublicShell>
  );
}
