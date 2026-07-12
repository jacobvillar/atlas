# Auth and Permissions

## Version 1 Decision

Atlas v1 requires login before analysis. Supabase Auth provides sign-up, sign-in, session management, and user identity for row-level security.

Auth UX should be intentionally light: users can create an account quickly, then land on the dashboard where the real product starts. Login and signup pages should use Atlas copy, not generic boilerplate:

- Login: `Welcome back` and `Continue your career roadmap.`
- Signup: `Start mapping your next career move` and `Create a free account to save reports, quests, and Ask Atlas chats.`

Email/password auth is enough for v1 unless a later implementation decision adds OAuth.

## Actors

| Actor | Permissions |
| --- | --- |
| Anonymous visitor | View marketing/login shell only |
| Authenticated user | Upload resume for extraction, generate reports, view own reports, update own roadmap quest progress, ask questions on own reports |
| Web API route | Validate session, call OpenAI, query Supabase, save report/message rows |
| Document service | Extract text from a resume file and return content to the web app |
| RAG ingestion script | Upsert curated career guidance chunks using service role credentials |
| AI provider | Process request content for generation and embeddings |

## Permissions Model

- Users must be authenticated before resume extraction or analysis.
- `career_reports.user_id` must equal `auth.uid()` for select, insert, update, and delete.
- `roadmap_quest_progress.user_id` must equal `auth.uid()` for select, insert, update, and delete.
- `ask_atlas_messages.user_id` must equal `auth.uid()` for select, insert, update, and delete.
- `resume_documents.user_id` must equal `auth.uid()` for select, insert, update, and delete.
- `career_resource_chunks` can be read by authenticated users.
- Only server-side code can access OpenAI, Supabase service role, and document service secrets.

## Privacy Rules

- Do not store uploaded resume files in v1.
- Do not store full raw resume text in v1.
- Store only resume metadata (file name, type, status), not an extracted text preview.
- Store generated reports and Ask Atlas messages because they are user-owned product artifacts.
- Store roadmap quest progress because it is a user-owned product artifact.
- Do not embed private resumes into the RAG knowledge base in v1.

## Future Version

If Atlas adds richer account features, consider:

- Report deletion controls.
- Explicit opt-in for storing full resume text.
- Multiple saved resumes per user.
- Organization accounts for career coaches.
- Admin moderation for public knowledge base resources.
