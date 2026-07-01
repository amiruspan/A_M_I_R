alter table public.quizzes
  drop constraint if exists quizzes_game_mode_check;

alter table public.quizzes
  add constraint quizzes_game_mode_check
  check (game_mode in ('normal', 'hardcore', 'blitz', 'practice', 'final_boss'));
