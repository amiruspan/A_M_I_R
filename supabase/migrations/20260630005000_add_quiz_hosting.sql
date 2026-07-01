create table if not exists public.host_sessions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  join_code text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.host_sessions enable row level security;

create policy "read active or own host sessions"
  on public.host_sessions for select
  using (is_active or auth.uid() = user_id);

create policy "insert own host sessions"
  on public.host_sessions for insert
  with check (auth.uid() = user_id);

create policy "update own host sessions"
  on public.host_sessions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.host_participants (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.host_sessions (id) on delete cascade,
  player_name text not null,
  joined_at timestamptz not null default now(),
  unique (session_id, player_name)
);

alter table public.host_participants enable row level security;

create policy "read participants for active or own host"
  on public.host_participants for select
  using (
    exists (
      select 1
      from public.host_sessions
      where host_sessions.id = host_participants.session_id
        and (host_sessions.is_active or host_sessions.user_id = auth.uid())
    )
  );

create policy "join active host sessions"
  on public.host_participants for insert
  with check (
    exists (
      select 1
      from public.host_sessions
      where host_sessions.id = host_participants.session_id
        and host_sessions.is_active
    )
  );
