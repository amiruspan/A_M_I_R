import { supabase } from './supabase';
import type { Attempt, GameMode, Quiz, QuizQuestion } from './quizTypes';

type QuizRow = Omit<Quiz, 'questions'> & {
  questions: unknown;
};

const baseQuizColumns = 'id,user_id,title,description,share_code,is_public,questions,created_at';
const quizColumns = `${baseQuizColumns},game_mode`;

function createShareCode() {
  return String(Math.floor(10_000_000 + Math.random() * 90_000_000));
}

function toQuiz(row: QuizRow): Quiz {
  return {
    ...row,
    game_mode: row.game_mode ?? 'normal',
    questions: row.questions as QuizQuestion[],
  };
}

export async function loadQuizzes() {
  const { data, error } = await supabase
    .from('quizzes')
    .select(quizColumns)
    .order('created_at', { ascending: false });

  if (error) {
    const fallback = await supabase
      .from('quizzes')
      .select(baseQuizColumns)
      .order('created_at', { ascending: false });
    if (fallback.error) throw fallback.error;
    return ((fallback.data ?? []) as QuizRow[]).map(toQuiz);
  }
  return ((data ?? []) as QuizRow[]).map(toQuiz);
}

export async function loadQuizByCode(code: string) {
  const { data, error } = await supabase
    .from('quizzes')
    .select(quizColumns)
    .eq('share_code', code)
    .maybeSingle();

  if (error) {
    const fallback = await supabase
      .from('quizzes')
      .select(baseQuizColumns)
      .eq('share_code', code)
      .maybeSingle();
    if (fallback.error) throw fallback.error;
    return fallback.data ? toQuiz(fallback.data as QuizRow) : null;
  }
  return data ? toQuiz(data as QuizRow) : null;
}

export async function createQuiz(
  userId: string,
  title: string,
  description: string,
  gameMode: GameMode,
  questions: QuizQuestion[],
) {
  const { data, error } = await supabase
    .from('quizzes')
    .insert({
      user_id: userId,
      title,
      description,
      game_mode: gameMode,
      questions,
      share_code: createShareCode(),
      is_public: true,
    })
    .select(quizColumns)
    .single();

  if (error) {
    const fallback = await supabase
      .from('quizzes')
      .insert({
        user_id: userId,
        title,
        description,
        questions,
        share_code: createShareCode(),
        is_public: true,
      })
      .select(baseQuizColumns)
      .single();
    if (fallback.error) throw fallback.error;
    return toQuiz(fallback.data as QuizRow);
  }
  return toQuiz(data as QuizRow);
}

export async function loadAttempts() {
  const { data, error } = await supabase
    .from('attempts')
    .select('id,quiz_id,user_id,player_name,score,total,created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Attempt[];
}

export async function saveAttempt(
  userId: string,
  quizId: string,
  playerName: string,
  score: number,
  total: number,
) {
  const { error } = await supabase.from('attempts').insert({
    user_id: userId,
    quiz_id: quizId,
    player_name: playerName,
    score,
    total,
  });

  if (error) throw error;
}

export async function loadProgress(quizId: string) {
  const { data, error } = await supabase
    .from('quiz_progress')
    .select('answers')
    .eq('quiz_id', quizId)
    .maybeSingle();

  if (error) throw error;
  return (data?.answers as number[] | undefined) ?? [];
}

export async function saveProgress(userId: string, quizId: string, answers: number[]) {
  const { error } = await supabase.from('quiz_progress').upsert({
    user_id: userId,
    quiz_id: quizId,
    answers,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

export async function clearProgress(quizId: string) {
  const { error } = await supabase.from('quiz_progress').delete().eq('quiz_id', quizId);
  if (error) throw error;
}
