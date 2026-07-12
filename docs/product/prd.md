# Atlas PRD

## Problem Statement

Fresh graduates, early-career professionals, and career shifters often struggle to understand whether their resume is ready for a specific role. They may have coursework, projects, internships, or transferable experience, but they need help translating that evidence into a clear role-fit story and a practical improvement plan.

Generic chat tools can provide useful feedback, but they require the user to design the prompt, manage context, judge whether the output is complete, and turn advice into an action plan. Atlas packages that workflow into a guided product experience with personalized roadmap quests.

## Target Users

Primary users are fresh graduates and early-career professionals applying for entry-level or early-career roles across business, operations, data, marketing, customer success, finance, and tech-adjacent fields.

Secondary users are career shifters and post-grad learners who need to convert coursework, projects, certificates, internships, and transferable experience into a stronger career narrative.

## Core Features

1. Authentication: user signs up or signs in before running an analysis.
2. Resume upload: user uploads a PDF or DOCX resume.
3. Document extraction: a Python FastAPI service uses Docling to extract resume text without storing the file.
4. Review step: user reviews and edits extracted resume text before analysis.
5. Job description input: user pastes the target job description.
6. RAG guidance: Atlas retrieves relevant career guidance chunks from a curated knowledge base.
7. Role-fit report: Atlas compares resume evidence against the target role and generates a structured readiness report.
8. Readiness dashboard: Atlas presents the result as a scannable dashboard with fit score, strengths, gaps, role requirements, resume actions, and roadmap quests.
9. Career roadmap quests: Atlas generates a 30/60/90-day action plan as small, trackable quests tied to the user's resume gaps and target role.
10. Lightweight gamification: Atlas shows report progress, next best quest, immediate completion feedback, and calm milestone badges.
11. Resume improvements: Atlas suggests stronger bullets and missing evidence to add.
12. Ask Atlas: after a report exists, user can ask follow-up questions about the report.
13. Saved reports: user can revisit generated reports and attached Ask Atlas messages.
14. Lightweight progress: user can mark roadmap quests complete or incomplete.
15. Export: user can copy or download the report as Markdown.

## Out of Scope

- LinkedIn scraping
- Job board integrations
- Automated job applications
- Payment processing
- Hiring probability claims or guaranteed outcomes
- Streaks, XP economy, leaderboards, competitive leagues, push notifications, mascot-led nudges, daily lessons, or generic career curriculum
- Storing raw uploaded resume files
- Storing full raw resume text
- Adding private user resumes to the RAG knowledge base
- Streaming chat responses

## Success Metrics

- A signed-in user can generate a complete report from a PDF/DOCX resume and pasted job description.
- The report includes fit score, strengths, gaps, resume suggestions, source titles, and 30/60/90-day roadmap quests.
- The readiness dashboard makes the next action obvious without requiring the user to read a long chat transcript.
- Users can mark at least one roadmap quest complete and see progress update.
- Users can see milestone badges that reflect meaningful completed quest categories.
- Ask Atlas answers at least one follow-up question after report generation.
- The app saves reports and messages under the correct authenticated user.
- At least 3 validation users say the roadmap quests clarified their next steps.
- The live app loads in an incognito browser and the core AI feature works.

## Open Questions

- Which deployment target should host the Python document service: Render or Railway?
- What file size limit should the MVP enforce for resume uploads?
- Should users be able to delete saved reports in v1 or only in v2?
- Which public career resources will be used as the initial seed set?
