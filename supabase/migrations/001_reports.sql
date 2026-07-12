-- Atlas core user-owned tables + Row Level Security.
-- No `profiles` table in v1: auth.users already holds identity/email and nothing
-- reads extra profile fields. Add one (with an auth.users insert trigger) only
-- when a feature needs it.

create table resume_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_type text not null,
  extraction_status text not null default 'completed',
  created_at timestamptz not null default now()
);

create table career_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_document_id uuid references resume_documents(id) on delete set null,
  target_role text,
  job_description_text text not null,
  resume_evidence_json jsonb not null default '{}'::jsonb,
  report_json jsonb not null,
  fit_score integer not null check (fit_score >= 0 and fit_score <= 100),
  created_at timestamptz not null default now()
);

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

create table ask_atlas_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  career_report_id uuid not null references career_reports(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

-- Support the common access paths: a user's report list, a report's quests/messages.
create index career_reports_user_id_idx on career_reports (user_id, created_at desc);
create index roadmap_quest_progress_report_idx on roadmap_quest_progress (career_report_id);
create index ask_atlas_messages_report_idx on ask_atlas_messages (career_report_id, created_at);

alter table resume_documents enable row level security;
alter table career_reports enable row level security;
alter table roadmap_quest_progress enable row level security;
alter table ask_atlas_messages enable row level security;

create policy "resume_documents_own" on resume_documents for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "career_reports_own" on career_reports for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "roadmap_quest_progress_own" on roadmap_quest_progress for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "ask_atlas_messages_own" on ask_atlas_messages for all using (user_id = auth.uid()) with check (user_id = auth.uid());
