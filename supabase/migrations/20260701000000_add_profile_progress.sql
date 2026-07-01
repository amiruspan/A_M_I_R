alter table public.profiles
  add column if not exists xp integer not null default 0 check (xp >= 0),
  add column if not exists last_daily_bonus date,
  add column if not exists earned_badge_ids text[] not null default array[]::text[];
