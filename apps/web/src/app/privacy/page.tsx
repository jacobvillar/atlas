import type { Metadata } from "next";
import { PublicShell } from "@/modules/public-site";

export const metadata: Metadata = {
  title: "Privacy — Atlas",
  description:
    "Plain-language privacy commitments for your Atlas Career Campaign.",
};

const commitments = [
  {
    number: "01",
    title: "Your resume file is not a trophy we keep",
    detail:
      "Atlas processes an uploaded PDF or DOCX to extract career evidence. The original file is discarded after processing in v1.",
  },
  {
    number: "02",
    title: "Your full raw resume text is not stored",
    detail:
      "Atlas saves resume metadata and structured evidence for your report. It does not keep a full text copy of your resume.",
  },
  {
    number: "03",
    title: "Your Career Campaign stays in your account",
    detail:
      "Your reports, mission progress, and Ask Atlas messages are private to your authenticated account.",
  },
  {
    number: "04",
    title: "Private work never trains the shared guidance library",
    detail:
      "Resumes, job descriptions, reports, and chats are never added to Atlas's curated career-guidance knowledge base.",
  },
  {
    number: "05",
    title: "AI is a coach, not a hiring gatekeeper",
    detail:
      "Atlas provides guidance to prioritize next steps. It does not predict interviews, offers, or a hiring decision.",
  },
];

export default function PrivacyPage() {
  return (
    <PublicShell>
      <section className="campaign-page-hero campaign-page-hero--privacy">
        <div className="campaign-page-hero__inner">
          <p className="campaign-page-hero__eyebrow">YOUR DATA, YOUR CAMPAIGN</p>
          <h1>Privacy that is easy to understand.</h1>
          <p>
            Atlas handles career materials with a simple rule: keep only what helps your saved campaign work, and leave raw source documents behind.
          </p>
        </div>
      </section>

      <section className="privacy-commitments">
        <div className="privacy-commitments__intro">
          <p className="campaign-section-label">THE ATLAS PRIVACY PROMISE</p>
          <h2>Clear boundaries for sensitive career work.</h2>
          <p>This is a plain-language product privacy page for the capstone MVP, not a full legal privacy policy.</p>
        </div>
        <ol className="privacy-commitments__list">
          {commitments.map((commitment) => (
            <li key={commitment.number}>
              <span>{commitment.number}</span>
              <div>
                <h3>{commitment.title}</h3>
                <p>{commitment.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </PublicShell>
  );
}
