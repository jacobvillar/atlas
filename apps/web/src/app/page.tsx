import Image from "next/image";
import Link from "next/link";
import { PublicShell } from "@/modules/public-site";

const workflowSteps = [
  {
    step: "01",
    title: "Bring your resume",
    description: "Upload a PDF or DOCX, then review the extracted text before analysis.",
  },
  {
    step: "02",
    title: "Choose a target role",
    description: "Paste one real job description you want to work toward next.",
  },
  {
    step: "03",
    title: "Launch your campaign",
    description: "See matched evidence, priority gaps, and a role-specific mission path.",
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
          <p className="campaign-preview__eyebrow">YOUR CAREER CAMPAIGN</p>
          <h2>Junior Product Analyst</h2>
        </div>
        <div className="campaign-preview__tier">
          <span>Tier 2</span>
          <strong>Builder</strong>
        </div>
      </div>

      <div className="campaign-preview__score-row">
        <div className="campaign-preview__score" aria-label="Readiness score 68 out of 100">
          <span>68</span>
          <small>readiness</small>
        </div>
        <div>
          <p className="campaign-preview__eyebrow">CAMPAIGN PROGRESS</p>
          <p className="campaign-preview__progress-copy">2 of 7 missions complete</p>
          <div className="campaign-preview__progress-track" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>

      <div className="campaign-preview__mission">
        <div className="campaign-preview__mission-topline">
          <span className="campaign-preview__status-dot" />
          <span>Current mission</span>
          <span>30 min</span>
        </div>
        <h3>Add evidence for stakeholder reporting</h3>
        <p>
          Turn one relevant project into a measurable resume bullet for this role.
        </p>
        <div className="campaign-preview__mission-footer">
          <span>Evidence: revised bullet</span>
          <span className="campaign-preview__start">Start mission</span>
        </div>
      </div>

      <div className="campaign-preview__path" aria-label="Three phase career mission path">
        <div className="campaign-preview__path-line" aria-hidden="true" />
        <div className="campaign-preview__checkpoint campaign-preview__checkpoint--complete">
          <span>1</span>
          <strong>30 days</strong>
          <small>Foundation</small>
        </div>
        <div className="campaign-preview__checkpoint campaign-preview__checkpoint--active">
          <span>2</span>
          <strong>60 days</strong>
          <small>Build proof</small>
        </div>
        <div className="campaign-preview__checkpoint">
          <span>3</span>
          <strong>90 days</strong>
          <small>Apply ready</small>
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
              <span>AI career readiness coach</span>
            </div>
            <h1>Turn your next role into a campaign worth completing.</h1>
            <p>
              Atlas compares your resume with a real job description, then maps the gaps into clear missions, milestones, and evidence you can build.
            </p>
            <div className="atlas-hero__actions">
              <Link href="/signup" className="atlas-button atlas-button--primary">
                Start your campaign
              </Link>
              <Link href="/use-cases" className="atlas-button atlas-button--quiet">
                Explore use cases
              </Link>
            </div>
            <p className="atlas-hero__note">
              Guidance for your next move, never a hiring prediction.
            </p>
          </div>
          <CampaignPreview />
        </div>
      </section>

      <section className="atlas-section atlas-section--workflow">
        <div className="atlas-section__heading">
          <p className="atlas-section__eyebrow">FROM RESUME TO MOMENTUM</p>
          <h2>One role. One focused path forward.</h2>
          <p>
            Atlas keeps the work concrete, so you always know what to do next and why it matters.
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
            <p className="atlas-section__eyebrow">A BETTER WAY TO USE AI CAREER ADVICE</p>
            <h2>Less chat scroll. More visible progress.</h2>
          </div>
          <div className="campaign-promise__points">
            <p><strong>Current mission</strong> A single high-impact action, not an overwhelming list.</p>
            <p><strong>Evidence first</strong> Each mission points to a resume bullet, work sample, practice answer, or outreach action.</p>
            <p><strong>Private milestones</strong> Progress belongs to your campaign and never promises an interview or offer.</p>
          </div>
        </div>
      </section>

      <section className="atlas-section atlas-section--trust">
        <div className="atlas-section__heading">
          <p className="atlas-section__eyebrow">BUILT FOR SENSITIVE CAREER WORK</p>
          <h2>Your progress should feel personal, not exposed.</h2>
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
          <p className="atlas-section__eyebrow">YOUR NEXT CHECKPOINT</p>
          <h2>Map the move you want to make next.</h2>
        </div>
        <Link href="/signup" className="atlas-button atlas-button--primary">
          Start for free
        </Link>
      </section>
    </PublicShell>
  );
}
