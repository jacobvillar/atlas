export type UseCaseEntry = {
  title: string;
  situation: string;
  input: string;
  output: string;
  example: string;
};

export const useCaseEntries: UseCaseEntry[] = [
  {
    title: "Fresh graduates",
    situation:
      "You are preparing for your first professional role and are not sure how your coursework and internships line up with what employers expect.",
    input:
      "Your resume and the job description for a role you are targeting.",
    output:
      "A readiness report showing your fit score, matched strengths, and the priority gaps to close before you apply.",
    example:
      "Example roadmap quest: \"Add a project bullet that quantifies the impact of your capstone data analysis.\"",
  },
  {
    title: "Early-career professionals",
    situation:
      "You have a year or two of experience and want a clear-eyed view of how ready you are for your next step up.",
    input: "Your current resume and a job description for the next role.",
    output:
      "A gap analysis and resume bullet rewrites focused on the skills and evidence the target role expects.",
    example:
      "Example gap: \"The target role expects stakeholder reporting experience that isn't reflected in your current bullets.\"",
  },
  {
    title: "Career shifters",
    situation:
      "You are moving into a new field and need to translate training, projects, or certificates into a narrative that makes sense to a new industry.",
    input:
      "Your resume, including transferable experience, and the job description for the field you are shifting into.",
    output:
      "Strengths that transfer well, gaps specific to the new field, and quests for building missing evidence.",
    example:
      "Example roadmap quest: \"Complete a small portfolio project that demonstrates the core skill this role requires.\"",
  },
  {
    title: "Bootcamp and post-grad learners",
    situation:
      "You have recently completed a bootcamp or post-graduate program and want to turn coursework into role-ready evidence.",
    input: "Your resume and a job description from your target track.",
    output:
      "Concrete resume improvements and a 30/60/90-day plan for closing the gap between coursework and job requirements.",
    example:
      "Example resume improvement: rewrite a coursework bullet to lead with the outcome instead of the tool.",
  },
  {
    title: "Advisors and mentors",
    situation:
      "You are helping someone else review their career readiness and want a structured, shareable starting point for the conversation.",
    input:
      "The mentee's resume and a job description relevant to their goal, reviewed together.",
    output:
      "A readiness report and roadmap that gives the conversation a concrete, evidence-based structure.",
    example:
      "Example use: reviewing the priority gaps section together to decide what to work on this month.",
  },
];
