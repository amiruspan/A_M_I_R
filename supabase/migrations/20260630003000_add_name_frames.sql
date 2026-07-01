alter table public.profiles
  add column if not exists owned_name_frame_ids text[] not null default array['plain']::text[],
  add column if not exists active_name_frame_id text not null default 'plain';
