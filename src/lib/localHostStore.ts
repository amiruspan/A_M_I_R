import type { HostParticipant, HostSession, Quiz } from './quizTypes';

const sessionsKey = 'quizroom_host_sessions';
const participantsKey = 'quizroom_host_participants';

function readJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function startHostSession(userId: string, quiz: Quiz) {
  const sessions = readJson<HostSession[]>(sessionsKey, [])
    .map((session) => session.quiz_id === quiz.id ? { ...session, is_active: false } : session);
  const session: HostSession = {
    id: crypto.randomUUID(),
    quiz_id: quiz.id,
    user_id: userId,
    join_code: quiz.share_code,
    is_active: true,
    created_at: new Date().toISOString(),
  };
  writeJson(sessionsKey, [session, ...sessions]);
  return session;
}

export function endHostSession(sessionId: string) {
  const sessions = readJson<HostSession[]>(sessionsKey, []);
  writeJson(sessionsKey, sessions.map((session) =>
    session.id === sessionId ? { ...session, is_active: false } : session,
  ));
}

export function loadActiveHostByQuiz(quiz: Quiz) {
  return readJson<HostSession[]>(sessionsKey, [])
    .find((session) => session.quiz_id === quiz.id && session.is_active) ?? null;
}

export function joinHostSession(sessionId: string, playerName: string) {
  const participants = readJson<HostParticipant[]>(participantsKey, []);
  if (participants.some((item) => item.session_id === sessionId && item.player_name === playerName)) return;
  writeJson(participantsKey, [...participants, {
    id: crypto.randomUUID(),
    session_id: sessionId,
    player_name: playerName,
    joined_at: new Date().toISOString(),
  }]);
}

export function loadHostParticipants(sessionId: string) {
  return readJson<HostParticipant[]>(participantsKey, [])
    .filter((participant) => participant.session_id === sessionId)
    .sort((a, b) => a.joined_at.localeCompare(b.joined_at));
}
