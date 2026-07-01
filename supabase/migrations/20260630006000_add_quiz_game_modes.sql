alter table public.quizzes
  add column if not exists game_mode text not null default 'normal'
  check (game_mode in ('normal', 'hardcore'));
