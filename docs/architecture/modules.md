# Initial Modules

Atlas should start with a small set of product modules that map directly to the MVP demo path. The modules are intentionally broader than tiny components, but narrower than generic folders. Each module owns one user-facing workflow and can expose pages, components, hooks, schemas, and server actions.

## Recommended MVP Module Map

| Module | Purpose | MVP Routes | Owns | Depends On |
| --- | --- | --- | --- | --- |
| `public-site` | Public marketing and trust pages before login | `/`, `/use-cases`, `/privacy`, `/faq`, `/about` | Public nav, footer, homepage sections, FAQ/use-case content | Brand assets |
| `auth` | Sign-up, sign-in, session handling, and protected access | `/login`, `/signup` | Auth forms, session helpers, protected layout | Supabase Auth |
| `career-dashboard` | Main authenticated cockpit for the user | `/dashboard` | New analysis entry point, recent reports, active quest preview, quick actions | `reports`, `roadmap` |
| `analysis-workbench` | Guided resume + job description input flow | `/analysis/new` | Resume upload, extracted text review, job description input, generate button | Document service, `ai`, `rag`, Supabase |
| `readiness-report` | Structured role-fit report experience | `/reports/[id]` | Fit score, role requirements, strengths, gaps, resume improvements, source titles, export | `reports`, `ask-atlas` |
| `roadmap` | Personalized 30/60/90-day career quest UI | Part of `/reports/[id]`, preview on `/dashboard` | Roadmap quest sections, completion toggles, progress bar, next best quest, milestone badges | `readiness-report` |
| `ask-atlas` | Report-specific follow-up chat | Part of `/reports/[id]` | Question form, answer cards, saved message list | `readiness-report`, `rag`, OpenAI |
| `reports` | Saved report listing and persistence helpers | `/reports`, `/reports/[id]` | Report list, report fetching, report ownership checks, markdown export | Supabase |

## Backend And Service Modules

| Module | Location | Purpose |
| --- | --- | --- |
| `core/auth` | `apps/web/src/core/auth` | Supabase session helpers, server-side user lookup, auth guards |
| `core/supabase` | `apps/web/src/core/supabase` | Browser and server Supabase clients |
| `core/ai` | `apps/web/src/core/ai` | OpenAI client, prompt builders, response schemas, output validation |
| `core/rag` | `apps/web/src/core/rag` | Runtime retrieval helpers used by analysis and Ask Atlas |
| `core/validation` | `apps/web/src/core/validation` | Shared Zod schemas and input limits |
| `document-service` | `services/knowledge/document-service` | FastAPI + Docling PDF/DOCX extraction |
| `rag` | `services/knowledge/rag` | Curated career guidance ingestion, chunking, embeddings, Supabase vector upserts |

## Web App Folder Shape

The web app should follow the same module-first style as the reference codebase while staying idiomatic for Next.js.

```text
apps/web/
  src/
    app/
      (auth)/
        login/
        signup/
      (app)/
        dashboard/
        analysis/new/
        reports/
        reports/[id]/
      api/
        analyze/
        ask/
        reports/
    components/
      ui/
    core/
      ai/
      auth/
      rag/
      supabase/
      validation/
    modules/
      public-site/
        components/
        content/
        index.ts
      auth/
        components/
        actions/
        schemas/
        index.ts
      career-dashboard/
        components/
        pages/
        hooks/
        index.ts
      analysis-workbench/
        components/
        actions/
        schemas/
        index.ts
      readiness-report/
        components/
        schemas/
        export/
        index.ts
      roadmap/
        components/
        types/
        index.ts
      ask-atlas/
        components/
        actions/
        schemas/
        index.ts
      reports/
        components/
        queries/
        types/
        index.ts
    lib/
    tests/
```

## Career Dashboard Scope

`career-dashboard` is the Atlas home module after login. It should feel like the product cockpit, not a marketing page.

MVP dashboard sections:

- Start New Analysis: primary action to upload a resume and paste a job description.
- Recent Reports: latest saved readiness reports with target role, fit score, and date.
- Active Quest Preview: top 3 incomplete roadmap quests from the latest report.
- Readiness Snapshot: latest fit score, strongest matching area, and biggest gap.
- Roadmap Progress: completion count for the latest report's quests.
- Milestone Badges: private, professional labels earned through completed quest categories.
- Ask Atlas Entry: disabled until a report exists, then links to the report-specific chat.

V1 includes lightweight progress tracking only: users can mark generated roadmap quests complete or incomplete and see milestone badges. Keep streaks, XP, leaderboards, competitive leagues, notifications, mascot nudges, and generic lessons out of scope.

## Auth Module Scope

`auth` owns the entry point from public visitor to authenticated user. Keep it simple and testable.

MVP auth sections:

- Login page with Atlas logo, `Welcome back`, and `Continue your career roadmap.`
- Signup page with Atlas logo, `Start mapping your next career move`, and a short explanation that accounts save reports, quests, and Ask Atlas chats.
- Email/password forms backed by Supabase Auth unless a later decision adds OAuth.
- Redirect authenticated users to `/dashboard`.
- Redirect unauthenticated users away from protected app routes.
- Display field-level validation and auth errors in plain language.
- Show a short privacy reassurance that resume files are not stored in v1.

The auth module should not introduce gamification. Roadmap quests begin after analysis, not during signup.

## Module Boundaries

- `analysis-workbench` collects and validates inputs, but it should not render the final report.
- `readiness-report` renders generated output, but it should not parse resume files.
- `roadmap` renders roadmap quest data and owns completion UI, but it should not call OpenAI directly.
- `ask-atlas` handles follow-up questions, but it should not become a general chatbot.
- `reports` owns report list/detail fetching and export helpers, but report generation remains in `/api/analyze`.
- `core/ai` owns prompts and schemas, not UI.
- `core/rag` owns runtime retrieval, not ingestion.
- `services/knowledge/rag` owns ingestion, chunking, and embedding of curated guidance only.

## Initial Build Order

1. `public-site`
2. `auth`
3. `career-dashboard` shell
4. `analysis-workbench`
5. `document-service`
6. `core/ai` and `core/rag`
7. `readiness-report`
8. `roadmap`
9. `reports`
10. `ask-atlas`

This order gives the project a visible app early, then fills in the AI workflow slice by slice.

## Future Modules

Keep these out of v1 unless time remains after deployment:

- `roadmap-progress-plus`: reminders, notes, due dates, streaks, or richer habit tracking.
- `resume-library`: multiple saved resumes per user.
- `job-tracker`: saved jobs and application statuses.
- `interview-practice`: STAR answer generation and mock interview prompts.
- `coach-admin`: organization or career-coach review workflows.
