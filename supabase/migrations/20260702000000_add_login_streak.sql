alter table public.profiles
  add column if not exists login_streak integer not null default 0 check (login_streak >= 0),
  add column if not exists last_seen_date date;
