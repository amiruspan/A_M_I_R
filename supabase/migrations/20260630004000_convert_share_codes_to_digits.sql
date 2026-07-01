do $$
declare
  quiz_record record;
  next_code text;
begin
  for quiz_record in
    select id
    from public.quizzes
    where share_code !~ '^[0-9]{8}$'
  loop
    loop
      next_code := floor(10000000 + random() * 90000000)::bigint::text;
      exit when not exists (
        select 1
        from public.quizzes
        where share_code = next_code
      );
    end loop;

    update public.quizzes
    set share_code = next_code
    where id = quiz_record.id;
  end loop;
end $$;
