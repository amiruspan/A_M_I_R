import { supabase } from './supabase';
import type { HostAnswer, HostParticipant, HostSession, Quiz } from './quizTypes';

const sessionColumns = `
  id,quiz_id,user_id,join_code,status,current_question_index,is_active,created_at,started_at,finished_at
`;
const participantColumns = 'id,session_id,player_name,joined_at';
const answerColumns = 'id,session_id,participant_id,question_index,answer_index,is_correct,answered_at';

export type ActiveHost = {
  quiz: Quiz;
  session: HostSession;
};

export async function startHostSession(userId: string, quiz: Quiz) {
  await supabase
    .from('host_sessions')
    .update({ is_active: false })
    .eq('quiz_id', quiz.id)
    .eq('user_id', userId);

  const { data, error } = await supabase
    .from('host_sessions')
    .insert({ user_id: userId, quiz_id: quiz.id, join_code: quiz.share_code })
    .select(sessionColumns)
    .single();

  if (error) throw error;
  return data as HostSession;
}

export async function endHostSession(sessionId: string) {
  const { error } = await supabase
    .from('host_sessions')
    .update({ is_active: false, status: 'finished', finished_at: new Date().toISOString() })
    .eq('id', sessionId);

  if (error) throw error;
}

export async function loadActiveHostByCode(code: string, loadQuiz: (code: string) => Promise<Quiz | null>) {
  const quiz = await loadQuiz(code);
  if (!quiz) return null;

  const { data, error } = await supabase
    .from('host_sessions')
    .select(sessionColumns)
    .eq('quiz_id', quiz.id)
    .eq('is_active', true)
    .neq('status', 'finished')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ? { quiz, session: data as HostSession } : null;
}

export async function joinHostSession(sessionId: string, playerName: string) {
  const { data, error } = await supabase
    .from('host_participants')
    .insert({ session_id: sessionId, player_name: playerName })
    .select(participantColumns)
    .single();

  if (error?.code === '23505') return loadHostParticipant(sessionId, playerName);
  if (error) throw error;
  return data as HostParticipant;
}

export async function loadHostSession(sessionId: string) {
  const { data, error } = await supabase
    .from('host_sessions')
    .select(sessionColumns)
    .eq('id', sessionId)
    .maybeSingle();

  if (error) throw error;
  return data ? data as HostSession : null;
}

export async function startLiveGame(sessionId: string) {
  const { error } = await supabase
    .from('host_sessions')
    .update({
      status: 'playing',
      current_question_index: 0,
      started_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  if (error) throw error;
}

export async function setLiveQuestion(sessionId: string, questionIndex: number) {
  const { error } = await supabase
    .from('host_sessions')
    .update({ current_question_index: questionIndex })
    .eq('id', sessionId);

  if (error) throw error;
}

export async function finishLiveGame(sessionId: string) {
  const { error } = await supabase
    .from('host_sessions')
    .update({ status: 'finished', finished_at: new Date().toISOString() })
    .eq('id', sessionId);

  if (error) throw error;
}

export async function loadHostParticipants(sessionId: string) {
  const { data, error } = await supabase
    .from('host_participants')
    .select(participantColumns)
    .eq('session_id', sessionId)
    .order('joined_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as HostParticipant[];
}

export async function loadHostAnswers(sessionId: string) {
  const { data, error } = await supabase
    .from('host_answers')
    .select(answerColumns)
    .eq('session_id', sessionId)
    .order('answered_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as HostAnswer[];
}

export async function saveHostAnswer(
  sessionId: string,
  participantId: string,
  questionIndex: number,
  answerIndex: number,
  isCorrect: boolean,
) {
  const { error } = await supabase
    .from('host_answers')
    .insert({
      session_id: sessionId,
      participant_id: participantId,
      question_index: questionIndex,
      answer_index: answerIndex,
      is_correct: isCorrect,
    });

  if (error?.code === '23505') return;
  if (error) throw error;
}

async function loadHostParticipant(sessionId: string, playerName: string) {
  const { data, error } = await supabase
    .from('host_participants')
    .select(participantColumns)
    .eq('session_id', sessionId)
    .eq('player_name', playerName)
    .single();

  if (error) throw error;
  return data as HostParticipant;
}
