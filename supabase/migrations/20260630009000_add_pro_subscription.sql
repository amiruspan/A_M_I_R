alter table public.profiles
  add column if not exists pro_expires_at timestamptz;
