alter table public.attempts
  add column if not exists player_name text not null default 'Player';

drop policy if exists "read own attempts" on public.attempts;

create policy "read attempts for playable quizzes"
  on public.attempts for select
  using (
    auth.uid() = user_id
    or exists (
      select 1
      from public.quizzes
      where quizzes.id = attempts.quiz_id
        and (quizzes.is_public or quizzes.user_id = auth.uid())
    )
  );
