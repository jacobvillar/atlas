# Atlas PRD

## Product One-Liner

Atlas is a gamified career coach, roadmap, and tracker. It turns career preparation into an adventure: you level up in real life, build real skills, grow your professional "aura," and evolve with every quest you complete.

Tagline: "Map your next career move."

## Problem Statement

Fresh graduates, early-career professionals, and career shifters moving into AI engineering roles often struggle to understand whether their resume is ready for a specific role. They may have coursework, projects, internships, or transferable experience, but they need help translating that evidence into a clear role-fit story and a practical improvement plan.

Generic chat tools can provide useful feedback, but they require the user to design the prompt, manage context, judge whether the output is complete, and turn advice into an action plan. Atlas packages that workflow into a guided, gamified product experience with personalized roadmap quests, XP, and readiness levels.

## Target Users

v1 is scoped to AI-engineering-readiness (AI Engineer, ML Engineer, LLM/Applied-AI Engineer, MLOps Engineer target roles). Primary users are fresh graduates, early-career professionals, and career shifters working toward one of those roles.

Secondary users are learners and career shifters from adjacent fields (data, software, analytics) who need to convert coursework, projects, certificates, internships, and transferable experience into a credible AI-engineering-readiness story.

The underlying analysis engine is general-purpose (any resume, any job description); only v1's content, RAG guidance, presets, and demo are themed around AI engineering. Broad job market coverage across all roles and industries is v2.

## How to Use Atlas

1. Answer a few career questions to build your plan — current role, target role, and optionally a target job description.
2. Get your custom career plan — a readiness report plus a personalized quest roadmap.
3. Complete quests and earn rewards as you level up toward your target role.

## Core Features

1. Authentication: user signs up or signs in before running an analysis.
2. Resume upload: user uploads a PDF or DOCX resume.
3. Document extraction: a Python FastAPI service uses Docling to extract resume text without storing the file.
4. Review step: user reviews and edits extracted resume text before analysis.
5. Two input modes, one pipeline: user pastes a target job description (primary, hero flow) or chooses/enters a target AI-engineering career path, which Atlas synthesizes into a representative role profile.
6. RAG guidance: Atlas retrieves relevant career guidance chunks from a curated knowledge base themed around AI-engineering readiness.
7. Role-fit report: Atlas compares resume evidence against the target role and generates a structured readiness report.
8. Readiness dashboard: Atlas presents the result as a scannable dashboard with fit score, strengths, gaps, role requirements, resume actions, and roadmap quests.
9. Career roadmap quests: Atlas generates a 30/60/90-day action plan as small, trackable quests tied to the user's resume gaps and target role, with a "today's quests" view that surfaces the next actionable quests from the roadmap.
10. Gamification: Atlas awards XP for completed quests, tracks a readiness level/rank that rises as XP accumulates, shows next-best-quest guidance, immediate completion feedback, milestone badges, and "aura" (professional presence) as playful progression flavor. Progression is in-app only.
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
- Leaderboards, competitive leagues, or ranking users against each other
- Social or public sharing of career data
- Streak-loss mechanics or countdown pressure
- Push notifications, mascot-led nudges, daily lessons, or generic career curriculum
- Broad job market coverage beyond AI-engineering-adjacent roles (v2)
- Storing raw uploaded resume files
- Storing full raw resume text
- Adding private user resumes to the RAG knowledge base
- Streaming chat responses

## Success Metrics

- A signed-in user can generate a complete report from a PDF/DOCX resume and either a pasted job description or a chosen AI-engineering career path.
- The report includes fit score, strengths, gaps, resume suggestions, source titles, and 30/60/90-day roadmap quests.
- The readiness dashboard makes the next action obvious without requiring the user to read a long chat transcript.
- Users can mark at least one roadmap quest complete and see XP, readiness level, and progress update.
- Users can see milestone badges and a readiness level that reflect meaningful completed quest categories.
- Ask Atlas answers at least one follow-up question after report generation.
- The app saves reports and messages under the correct authenticated user.
- At least 3 validation users say the roadmap quests clarified their next steps toward an AI-engineering role.
- The live app loads in an incognito browser and the core AI feature works.

## Open Questions

- Which deployment target should host the Python document service: Render or Railway?
- What file size limit should the MVP enforce for resume uploads?
- Should users be able to delete saved reports in v1 or only in v2?
- Which public career resources will be used as the initial seed set?
