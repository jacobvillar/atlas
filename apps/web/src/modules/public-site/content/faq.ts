export type FaqEntry = {
  question: string;
  answer: string;
};

export const faqEntries: FaqEntry[] = [
  {
    question: "What is Atlas?",
    answer:
      "Atlas compares your resume against a target job description and returns a role-readiness report that becomes a Career Campaign: fit score, matched strengths, priority gaps, resume improvements, and a 30/60/90-day mission path.",
  },
  {
    question: "Who is Atlas for?",
    answer:
      "Fresh graduates, early-career professionals, and career shifters who are working toward a specific role.",
  },
  {
    question: "What file types can I upload?",
    answer:
      "You can upload a resume as a PDF or DOCX file, then review the extracted text before analysis.",
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
      "Yes. Once a report exists, Ask Atlas lets you ask report-specific follow-up questions using your saved resume evidence, job description context, mission progress, and retrieved career guidance.",
  },
];
