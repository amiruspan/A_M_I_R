create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'student' check (role in ('teacher', 'student')),
  display_name text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "read own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "update own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  description text not null default '',
  share_code text not null unique,
  is_public boolean not null default true,
  questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.quizzes enable row level security;

create policy "read public or own quizzes"
  on public.quizzes for select
  using (is_public or auth.uid() = user_id);

create policy "insert own quizzes"
  on public.quizzes for insert
  with check (auth.uid() = user_id);

create policy "update own quizzes"
  on public.quizzes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "delete own quizzes"
  on public.quizzes for delete
  using (auth.uid() = user_id);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  score integer not null check (score >= 0),
  total integer not null check (total > 0),
  created_at timestamptz not null default now()
);

alter table public.attempts enable row level security;

create policy "read own attempts"
  on public.attempts for select
  using (auth.uid() = user_id);

create policy "insert own attempts"
  on public.attempts for insert
  with check (auth.uid() = user_id);

create policy "delete own attempts"
  on public.attempts for delete
  using (auth.uid() = user_id);

create table if not exists public.quiz_progress (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  answers jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, quiz_id)
);

alter table public.quiz_progress enable row level security;

create policy "read own quiz progress"
  on public.quiz_progress for select
  using (auth.uid() = user_id);

create policy "insert own quiz progress"
  on public.quiz_progress for insert
  with check (auth.uid() = user_id);

create policy "update own quiz progress"
  on public.quiz_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "delete own quiz progress"
  on public.quiz_progress for delete
  using (auth.uid() = user_id);
