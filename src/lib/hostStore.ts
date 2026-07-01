import { supabase } from './supabase';
import type { HostParticipant, HostSession, Quiz } from './quizTypes';

const sessionColumns = 'id,quiz_id,user_id,join_code,is_active,created_at';
const participantColumns = 'id,session_id,player_name,joined_at';

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
    .update({ is_active: false })
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
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ? { quiz, session: data as HostSession } : null;
}

export async function joinHostSession(sessionId: string, playerName: string) {
  const { error } = await supabase
    .from('host_participants')
    .insert({ session_id: sessionId, player_name: playerName });

  if (error?.code === '23505') return;
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
