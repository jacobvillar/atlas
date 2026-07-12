# Atlas PRD

## Problem Statement

Fresh graduates and early-career professionals struggle to understand how well their resume fits a specific target role. Existing tools often provide resume edits or generic advice, but users still need a clear action plan for closing gaps before applying.

## Target Users

Primary users are fresh graduates and early-career professionals applying for first or next roles in AI, data, business analysis, software, operations, and tech-adjacent fields.

Secondary users are career shifters and post-grad learners who need to convert training, projects, and certificates into a stronger career narrative.

## Core Features

1. Resume input: user can paste resume text or upload a supported document.
2. Job description input: user can paste the target job description.
3. Role-fit analysis: Atlas extracts skills, experience, tools, education, and projects, then compares them with the job description.
4. Career roadmap: Atlas generates a 30/60/90-day action plan.
5. Resume improvements: Atlas suggests stronger bullets and missing evidence to add.
6. Exportable report: user can copy or download the result as markdown.

## Out of Scope

- User accounts and authentication
- Long-term resume storage
- LinkedIn scraping
- Job board integrations
- Automated job applications
- Payment processing
- Real hiring predictions or guaranteed outcomes

## Success Metrics

- A user can generate a complete report from resume and job description inputs.
- The report includes a fit score, strengths, gaps, roadmap, and resume suggestions.
- The app returns useful feedback in under 60 seconds for typical inputs.
- At least 3 validation users say the roadmap clarified their next steps.
- The live app loads in an incognito browser and the core AI feature works.

## Open Questions

- Should v1 support PDF upload, paste-only input, or both?
- Which AI provider will be used for deployment?
- Should the fit score be numeric, qualitative, or both?
- What document size limit should the MVP enforce?

