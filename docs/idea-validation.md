# Atlas Idea Validation Report

## 1. Define the Problem

Fresh graduates and early-career job seekers often do not know how their resume compares with a real target job. They may know they need a better resume, but they do not know which skills, project evidence, or bullet points matter most for a specific role.

The pain is specific: a job seeker has a resume and a job description, but still cannot answer, "Am I ready for this role, and what should I do next?"

## 2. Profile the Target Customer

Primary users are fresh graduates and early-career professionals applying for their first or next role, especially in AI, data, business analyst, software, operations, and tech-adjacent positions.

Secondary users are career shifters and post-grad learners who need to translate certificates, bootcamp projects, and self-directed learning into a credible career story.

These users are reachable through universities, bootcamps, LinkedIn communities, career centers, Discord/Slack groups, and job-search communities.

## 3. Size the Market

The opportunity is large enough for a focused capstone product because job seeking is a recurring problem for students, new graduates, and early-career professionals. Resume tools, job-fit scanners, interview coaches, and career planning platforms already exist, which indicates demand for AI-assisted career support.

For an MVP, the market does not need to be broad. Atlas can start with one concrete wedge: early-career candidates who want to compare one resume against one target job and receive a practical roadmap.

Supporting evidence:

- Resume Worded says its platform has been used by over 5 million job seekers, graduates, and students, which shows demand for resume and LinkedIn feedback tools: https://resumeworded.com/
- Jobscan positions itself around resume/job-description matching, ATS checks, job tracking, and AI resume optimization, which validates the resume-fit category: https://www.jobscan.co/
- Career.io markets an end-to-end career services platform for landing the next role, which validates demand for broader job-search support beyond a single resume edit: https://career.io/
- Recent coverage of the graduate job market reports that new graduates face a tougher hiring environment and increased competition, which strengthens the "why now" for early-career guidance tools.

## 4. Map the Competition

Existing alternatives include:

- Generic LLM chat tools for resume feedback
- Resume builders
- Resume scoring and ATS keyword tools
- Interview preparation tools
- Career coaching platforms
- Manual help from mentors, classmates, or career centers

The gap is that many tools optimize a document, but fewer connect the resume to a target job and translate the gap into an actionable 30/60/90-day plan.

Competitive notes:

- Jobscan emphasizes ATS scoring, keyword matching, LinkedIn optimization, and job application tracking.
- Resume Worded emphasizes resume scoring, line-by-line feedback, job-description targeting, and LinkedIn review.
- Career.io emphasizes a broader job-search suite, including resume tools, career services, and next-role support.
- Atlas will stay narrower in v1: one resume, one target job, one roadmap.

## 5. Define Your Edge

Atlas focuses on role readiness rather than resume editing alone. It helps users understand the relationship between their current evidence and the role they want.

The differentiating angle is the roadmap: Atlas turns the analysis into concrete next steps, including skill priorities, resume bullet improvements, and a suggested portfolio project.

## 6. Design a Cheap Test

The first validation test is a concierge prototype:

1. Ask 5 fresh graduates, classmates, or early-career job seekers for a resume and a target job description.
2. Generate an Atlas-style report manually or with an internal prompt.
3. Ask three questions:
   - Did the report make your gaps clearer?
   - Did the roadmap make your next two weeks easier to plan?
   - Would you use this before applying to a job?

Success criteria: at least 3 of 5 users say the roadmap clarified their next steps and they would use it before applying.

## 7. Stress-Test the Idea

Key risks:

- The AI output may be too generic.
- Resume parsing may fail on unusual formats.
- Users may upload sensitive personal information.
- A fit score may feel overly authoritative.
- The app may overpromise job outcomes.

Mitigations:

- Require both resume and job description for grounded analysis.
- Use structured output sections and clear acceptance criteria.
- Avoid storing user documents in version 1.
- Frame the score as a readiness estimate, not a hiring prediction.
- Add a disclaimer that Atlas provides career guidance, not employment guarantees.
