# Data Model

Atlas stores user-owned reports and a small curated career guidance knowledge base. It does not store raw resume files or full raw resume text in v1.

## Profiles

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now()
);
```

## Resume Documents

Tracks extraction metadata only.

```sql
create table resume_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_type text not null,
  extracted_text_preview text,
  extraction_status text not null default 'completed',
  created_at timestamptz not null default now()
);
```

## Career Reports

Stores the generated report, structured resume evidence, job context, and generated roadmap quest structure. Full raw resume text is not persisted.

```sql
create table career_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_document_id uuid references resume_documents(id) on delete set null,
  target_role text,
  job_description_text text not null,
  job_requirements_summary text,
  resume_evidence_json jsonb not null default '{}'::jsonb,
  report_json jsonb not null,
  fit_score integer not null check (fit_score >= 0 and fit_score <= 100),
  created_at timestamptz not null default now()
);
```

`resume_evidence_json` is the privacy-preserving context used by Ask Atlas after the first analysis. It should contain normalized evidence, not the full resume:

```json
{
  "skills": ["Excel", "customer research"],
  "tools": ["Power BI"],
  "education": ["BS Business Administration"],
  "experienceThemes": ["operations reporting", "client coordination"],
  "projects": ["sales dashboard capstone"],
  "constraints": ["no direct SQL work shown"]
}
```

`report_json` includes generated roadmap quests. Quest completion is stored separately so progress can change without rewriting the full AI report.

Expected quest shape inside `report_json`:

```json
{
  "roadmapQuests": [
    {
      "questId": "q_30_resume_keywords",
      "phase": "30",
      "title": "Add evidence for Excel reporting",
      "whyItMatters": "The target role asks for recurring reporting experience.",
      "evidenceOutput": "One revised resume bullet with metric and reporting cadence.",
      "timeEstimate": "30 minutes",
      "difficulty": "quick_win",
      "category": "resume_evidence"
    }
  ]
}
```

## Roadmap Quest Progress

Stores lightweight completion state for generated quests. This is the v1 gamification layer.

```sql
create table roadmap_quest_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  career_report_id uuid not null references career_reports(id) on delete cascade,
  quest_id text not null,
  status text not null default 'not_started' check (status in ('not_started', 'completed')),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (career_report_id, quest_id)
);
```

Rules:

- The quest must exist in the linked report JSON.
- Completion is user-controlled.
- Completing quests does not automatically change the original fit score.
- Milestone badges are computed from quest categories and completion state.
- No streaks, XP, leaderboard, league, notification, or mascot-nudge data is stored in v1.

## Ask Atlas Messages

Stores follow-up chat messages linked to a saved report.

```sql
create table ask_atlas_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  career_report_id uuid not null references career_reports(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
```

## Career Resource Chunks

Stores curated career guidance chunks for RAG. These are public/open resources or user-authored notes, not private resumes.

```sql
create extension if not exists vector;

create table career_resource_chunks (
  id text primary key,
  source_title text not null,
  source_url text,
  source_type text not null,
  chunk_text text not null,
  embedding vector(1536) not null,
  created_at timestamptz not null default now()
);
```

## RAG Match Function

```sql
create or replace function match_career_resources(
  query_embedding vector(1536),
  match_count int default 6
)
returns table (
  id text,
  source_title text,
  source_url text,
  source_type text,
  chunk_text text,
  similarity float
)
language sql stable
as $$
  select
    id,
    source_title,
    source_url,
    source_type,
    chunk_text,
    1 - (embedding <=> query_embedding) as similarity
  from career_resource_chunks
  order by embedding <=> query_embedding
  limit match_count;
$$;
```

## Row-Level Security

Enable RLS for user-owned tables:

- `profiles`
- `resume_documents`
- `career_reports`
- `roadmap_quest_progress`
- `ask_atlas_messages`

Users can select, insert, update, and delete only rows where `user_id = auth.uid()` or `id = auth.uid()` for `profiles`.

`career_resource_chunks` is read-only to authenticated users. Writes are performed only by an admin ingestion script using a service role key.
