import Image from "next/image";
import Link from "next/link";
import { PublicShell } from "@/modules/public-site";

const workflowSteps = [
  {
    step: "01",
    title: "Start with your resume",
    description: "Upload a PDF or DOCX. Check the text Atlas pulled out.",
  },
  {
    step: "02",
    title: "Add the job you want",
    description: "Paste a real job description. That becomes your target.",
  },
  {
    step: "03",
    title: "Take the next step",
    description: "See what already fits, what is missing, and what to do first.",
  },
];

const trustItems = [
  "Resume files are processed, then discarded.",
  "Full raw resume text is not saved.",
  "Reports, missions, and Ask Atlas chats are private to your account.",
];

function CampaignPreview() {
  return (
    <div className="campaign-preview" aria-label="Example Atlas Career Campaign">
      <div className="campaign-preview__header">
        <div>
          <p className="campaign-preview__eyebrow">YOUR PLAN</p>
          <h2>Junior Product Analyst</h2>
        </div>
        <div className="campaign-preview__tier">
          <span>Stage 2</span>
          <strong>Build proof</strong>
        </div>
      </div>

      <div className="campaign-preview__score-row">
        <div className="campaign-preview__score" aria-label="Readiness score 68 out of 100">
          <span>68</span>
          <small>readiness</small>
        </div>
        <div>
          <p className="campaign-preview__eyebrow">YOUR PROGRESS</p>
          <p className="campaign-preview__progress-copy">2 of 7 steps done</p>
          <div className="campaign-preview__progress-track" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>

      <div className="campaign-preview__mission">
        <div className="campaign-preview__mission-topline">
          <span className="campaign-preview__status-dot" />
          <span>Do this next</span>
          <span>About 30 min</span>
        </div>
        <h3>Add evidence for stakeholder reporting</h3>
        <p>
          Use one project to show the kind of reporting this role asks for.
        </p>
        <div className="campaign-preview__mission-footer">
          <span>Outcome: one stronger bullet</span>
          <span className="campaign-preview__start">Start</span>
        </div>
      </div>

      <div className="campaign-preview__path" aria-label="Three phase career mission path">
        <div className="campaign-preview__path-line" aria-hidden="true" />
        <div className="campaign-preview__checkpoint campaign-preview__checkpoint--complete">
          <span>1</span>
          <strong>30 days</strong>
          <small>Get clear</small>
        </div>
        <div className="campaign-preview__checkpoint campaign-preview__checkpoint--active">
          <span>2</span>
          <strong>60 days</strong>
          <small>Show proof</small>
        </div>
        <div className="campaign-preview__checkpoint">
          <span>3</span>
          <strong>90 days</strong>
          <small>Get ready</small>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <PublicShell>
      <section className="atlas-hero">
        <div className="atlas-hero__grid">
          <div className="atlas-hero__copy">
            <div className="atlas-hero__kicker">
              <Image src="/atlas-mark.svg" alt="" width={30} height={30} priority />
              <span>Career planning, made clearer</span>
            </div>
            <h1>Know what to do next.</h1>
            <p>
              Add your resume and a job you want. Atlas shows what already fits and gives you a short plan for the rest.
            </p>
            <div className="atlas-hero__actions">
              <Link href="/signup" className="atlas-button atlas-button--primary">
                See my next step
              </Link>
              <Link href="/use-cases" className="atlas-button atlas-button--quiet">
                See how it works
              </Link>
            </div>
            <p className="atlas-hero__note">
              A plan, not a promise.
            </p>
          </div>
          <CampaignPreview />
        </div>
      </section>

      <section className="atlas-section atlas-section--workflow">
        <div className="atlas-section__heading">
          <p className="atlas-section__eyebrow">A SIMPLE START</p>
          <h2>One role. A clearer way forward.</h2>
          <p>
            No generic checklist. Just the work that matters for the role you picked.
          </p>
        </div>
        <ol className="workflow-list">
          {workflowSteps.map((step) => (
            <li key={step.step} className="workflow-list__item">
              <span>{step.step}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="atlas-section atlas-section--promise">
        <div className="campaign-promise">
          <div>
            <p className="atlas-section__eyebrow">WHY THIS FEELS DIFFERENT</p>
            <h2>Less advice. More follow-through.</h2>
          </div>
          <div className="campaign-promise__points">
            <p><strong>One next step</strong> Start with the thing most worth doing, not a wall of suggestions.</p>
            <p><strong>Something to show</strong> Each step ends with a stronger bullet, work sample, practice answer, or outreach note.</p>
            <p><strong>Your own pace</strong> Your progress is private. It does not promise an interview or offer.</p>
          </div>
        </div>
      </section>

      <section className="atlas-section atlas-section--trust">
        <div className="atlas-section__heading">
          <p className="atlas-section__eyebrow">YOUR WORK STAYS YOURS</p>
          <h2>Private by default.</h2>
        </div>
        <ul className="trust-list">
          {trustItems.map((item, index) => (
            <li key={item}>
              <span>0{index + 1}</span>
              <p>{item}</p>
            </li>
          ))}
        </ul>
        <Link href="/privacy" className="atlas-inline-link">
          Read privacy commitments <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="atlas-final-cta">
        <div>
          <p className="atlas-section__eyebrow">READY WHEN YOU ARE</p>
          <h2>Pick a role. Start there.</h2>
        </div>
        <Link href="/signup" className="atlas-button atlas-button--primary">
          Start for free
        </Link>
      </section>
    </PublicShell>
  );
}
