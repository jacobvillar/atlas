export type FaqEntry = {
  question: string;
  answer: string;
};

export const faqEntries: FaqEntry[] = [
  {
    question: "What is Atlas?",
    answer:
      "Atlas compares your resume against a target job description and returns a role-readiness report: a fit score, matched strengths, priority gaps, resume improvements, and a 30/60/90-day roadmap of career quests.",
  },
  {
    question: "Who is Atlas for?",
    answer:
      "Atlas is built for fresh graduates, early-career professionals, and career shifters across the broader job market, not only tech roles.",
  },
  {
    question: "What file types can I upload?",
    answer:
      "You can upload a resume as a PDF or DOCX file. Pasting your resume as text remains available as a fallback.",
  },
  {
    question: "Does Atlas apply to non-tech jobs?",
    answer:
      "Yes. Atlas is designed for the broader job market, including operations, marketing, healthcare, education, and other non-tech roles, not only software roles.",
  },
  {
    question: "Is the fit score a hiring prediction?",
    answer:
      "No. The fit score is guidance to help you understand role readiness and prioritize next steps. It is not a hiring prediction or a guarantee of an interview or offer.",
  },
  {
    question: "Does Atlas store my resume?",
    answer:
      "Atlas does not store your uploaded resume file or your full raw resume text. Atlas stores resume metadata, structured resume evidence extracted during analysis, and your saved report so your account can keep working without holding onto raw resume content.",
  },
  {
    question: "Can I ask follow-up questions?",
    answer:
      "Yes. Once a report exists, Ask Atlas lets you ask report-specific follow-up questions using your saved resume evidence, job description context, quest progress, and retrieved career guidance.",
  },
  {
    question: "Is Atlas like Duolingo for careers?",
    answer:
      "Atlas uses lightweight roadmap quests to make career preparation easier to act on, but it is not a daily lesson game. There are no leaderboards, XP systems, or streak pressure in v1.",
  },
  {
    question: "What AI models does Atlas use?",
    answer:
      "Atlas uses OpenAI gpt-4o-mini for report and Ask Atlas generation, and OpenAI text-embedding-3-small for retrieval over curated career guidance.",
  },
  {
    question: "What is RAG in this project?",
    answer:
      "RAG stands for retrieval-augmented generation. Atlas retrieves relevant passages from a curated career guidance knowledge base and includes them as context so generated reports and answers are grounded in practical guidance rather than the model's memory alone.",
  },
  {
    question: "Is Atlas free?",
    answer:
      "Atlas is a capstone project and does not include payments or paid tiers in v1. Create a free account to generate and save your readiness report.",
  },
];
