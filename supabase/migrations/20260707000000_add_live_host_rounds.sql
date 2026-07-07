alter table public.host_sessions
  add column if not exists status text not null default 'lobby'
    check (status in ('lobby', 'playing', 'finished')),
  add column if not exists current_question_index integer not null default 0,
  add column if not exists started_at timestamptz,
  add column if not exists finished_at timestamptz;

create table if not exists public.host_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.host_sessions (id) on delete cascade,
  participant_id uuid not null references public.host_participants (id) on delete cascade,
  question_index integer not null,
  answer_index integer not null,
  is_correct boolean not null,
  answered_at timestamptz not null default now(),
  unique (session_id, participant_id, question_index)
);

alter table public.host_answers enable row level security;

drop policy if exists "join active host sessions" on public.host_participants;

create policy "join active host sessions"
  on public.host_participants for insert
  with check (
    exists (
      select 1
      from public.host_sessions
      where host_sessions.id = host_participants.session_id
        and host_sessions.is_active
        and host_sessions.status <> 'finished'
    )
  );

create policy "read answers for active or own host"
  on public.host_answers for select
  using (
    exists (
      select 1
      from public.host_sessions
      where host_sessions.id = host_answers.session_id
        and (host_sessions.is_active or host_sessions.user_id = auth.uid())
    )
  );

create policy "players answer active host sessions"
  on public.host_answers for insert
  with check (
    exists (
      select 1
      from public.host_participants
      join public.host_sessions on host_sessions.id = host_participants.session_id
      where host_participants.id = host_answers.participant_id
        and host_participants.session_id = host_answers.session_id
        and host_sessions.is_active
        and host_sessions.status = 'playing'
    )
  );
