alter table public.profiles
  add column if not exists coins integer not null default 0 check (coins >= 0),
  add column if not exists owned_skin_ids text[] not null default array['classic']::text[],
  add column if not exists active_skin_id text not null default 'classic';
