# Agent Rules

Atlas may be developed with Claude, Codex, Cursor, or other coding agents. This file keeps those agents aligned with the project scope, architecture, and safety rules.

## Source Of Truth

Agents should read these files before major changes:

- `spec.md`
- `CLAUDE.md`
- `.cursorrules`
- `docs/index.md`
- `docs/product/prd.md`
- `docs/architecture/project-plan.md`
- `docs/architecture/modules.md`
- `docs/architecture/data-model.md`
- `docs/architecture/auth-and-permissions.md`
- `docs/integrations/rag.md`
- `docs/integrations/document-service.md`
- `docs/superpowers/plans/2026-07-12-atlas-mvp.md`

## Daily Agentic Workflow

1. Pick one vertical slice from the MVP plan.
2. Confirm the feature goal, acceptance criteria, data touched, and verification command.
3. Update or create a small feature spec under `docs/superpowers/` when the work changes behavior or architecture.
4. Implement the smallest useful path first.
5. Add tests around validation, permissions, AI schema parsing, RAG behavior, or document extraction where applicable.
6. Run the relevant checks and record what passed or failed.
7. Update docs only when they describe current behavior or decisions.
8. Do not commit unless the user explicitly asks.

## Commit Message Convention

Use Conventional Commits for all Atlas commits:

```text
type(scope): short imperative description
```

Use these types:

- `feat` for new product or system capabilities.
- `fix` for bug fixes.
- `docs` for documentation-only changes.
- `test` for tests.
- `refactor` for behavior-preserving code changes.
- `chore` for tooling, dependency, or repo maintenance.
- `ci` for GitHub Actions or deployment automation.

Use specific Atlas scopes such as `public-site`, `auth`, `dashboard`, `analysis`, `document-service`, `rag`, `ai`, `reports`, `roadmap`, `ask-atlas`, `supabase`, `readme`, `docs`, or `ci`.

Good examples:

```text
docs(plan): finalize Atlas MVP plan
docs(readme): align overview with architecture plan
feat(document-service): add Docling extraction endpoint
feat(rag): load curated career guidance chunks
feat(ask-atlas): add report-specific follow-up chat
test(supabase): cover report ownership policies
ci(actions): add MVP validation checks
```

Avoid vague messages such as `update`, `changes`, `fix stuff`, or `initial commit`.

## ECC-Inspired Practices

Atlas can borrow useful practices from [affaan-m/ecc](https://github.com/affaan-m/ecc) without adding ECC as a dependency.

Adopt these practices:

- Reusable project rules for agents through `CLAUDE.md` and `.cursorrules`.
- Research-first development before adding unfamiliar packages, AI APIs, auth patterns, or deployment assumptions.
- Small skills or playbooks for repeated work, especially RAG ingestion, Supabase migrations, and AI output validation.
- Security scanning before final delivery when an approved scanner is available.
- Explicit verification before claiming a feature works.

Do not adopt these practices for the MVP:

- Do not install ECC automatically.
- Do not vendor external agent frameworks into the capstone repo.
- Do not add large multi-agent infrastructure.
- Do not add hooks that block normal student development unless the user asks.

## Backend Rules

- Supabase Auth is required before analysis.
- Every user-owned table needs `user_id` and Row Level Security.
- RLS policies should be created in the same migration as the protected table.
- Service-role keys must stay server-side.
- Client code may only use the Supabase anon key.
- Database changes should be represented as migrations, not undocumented dashboard edits.

## Frontend Rules

- Build the authenticated Atlas dashboard as the first product screen.
- Put product workflow code under `apps/web/src/modules`, not generic shared folders.
- Keep the dashboard focused on resume readiness, not general chat.
- Use clear UI states for upload, validating, extracting, analyzing, completed, and failed.
- Keep report sections scannable: score, strengths, gaps, resume edits, roadmap quests, quest progress, sources, and Ask Atlas.
- Keep gamification lightweight: private quest XP, readiness levels, and milestone badges are in scope; streaks, leaderboards, competitive leagues, push notifications, mascot-led nudges, and generic lessons are not.
- Do not add a marketing-heavy landing page until the core workflow works.

## AI And RAG Rules

- RAG is for curated career guidance only.
- Private resumes, job descriptions, reports, and Ask Atlas messages must not be embedded into shared knowledge tables.
- Prompt templates must separate user content from system instructions.
- Validate AI output against a schema before saving or rendering.
- Include retrieved source titles where useful.
- Treat fit scores as approximate guidance, not hiring predictions.

## Document Service Rules

- The document service handles PDF/DOCX text extraction.
- Validate file type and size before extraction.
- Return structured extraction output and clear errors.
- Delete temporary files after processing.
- Do not log resume content.
- Keep extraction independent from report generation.

## Verification Checklist

Before marking a major slice complete, check:

- The app path is usable by an authenticated user.
- Input validation handles missing, oversized, or unsupported inputs.
- Secrets are not exposed client-side.
- RLS prevents cross-user report access.
- AI output is schema-validated.
- Relevant tests or manual smoke checks were run.
- Documentation still matches the implementation plan.
