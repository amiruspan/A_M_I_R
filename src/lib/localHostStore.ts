import type { HostAnswer, HostParticipant, HostSession, Quiz } from './quizTypes';

const sessionsKey = 'quizroom_host_sessions';
const participantsKey = 'quizroom_host_participants';
const answersKey = 'quizroom_host_answers';

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
    status: 'lobby',
    current_question_index: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    started_at: null,
    finished_at: null,
  };
  writeJson(sessionsKey, [session, ...sessions]);
  return session;
}

export function endHostSession(sessionId: string) {
  const sessions = readJson<HostSession[]>(sessionsKey, []);
  writeJson(sessionsKey, sessions.map((session) =>
    session.id === sessionId ? {
      ...session,
      is_active: false,
      status: 'finished',
      finished_at: new Date().toISOString(),
    } : session,
  ));
}

export function loadActiveHostByQuiz(quiz: Quiz) {
  return readJson<HostSession[]>(sessionsKey, [])
    .find((session) => (
      session.quiz_id === quiz.id &&
      session.is_active &&
      session.status !== 'finished'
    )) ?? null;
}

export function joinHostSession(sessionId: string, playerName: string) {
  const participants = readJson<HostParticipant[]>(participantsKey, []);
  const existing = participants.find((item) => item.session_id === sessionId && item.player_name === playerName);
  if (existing) return existing;
  const participant = {
    id: crypto.randomUUID(),
    session_id: sessionId,
    player_name: playerName,
    joined_at: new Date().toISOString(),
  };
  writeJson(participantsKey, [...participants, participant]);
  return participant;
}

export function loadHostParticipants(sessionId: string) {
  return readJson<HostParticipant[]>(participantsKey, [])
    .filter((participant) => participant.session_id === sessionId)
    .sort((a, b) => a.joined_at.localeCompare(b.joined_at));
}

export function loadHostSession(sessionId: string) {
  return readJson<HostSession[]>(sessionsKey, [])
    .find((session) => session.id === sessionId) ?? null;
}

export function startLiveGame(sessionId: string) {
  updateSession(sessionId, {
    status: 'playing',
    current_question_index: 0,
    started_at: new Date().toISOString(),
  });
}

export function setLiveQuestion(sessionId: string, questionIndex: number) {
  updateSession(sessionId, { current_question_index: questionIndex });
}

export function finishLiveGame(sessionId: string) {
  updateSession(sessionId, { status: 'finished', finished_at: new Date().toISOString() });
}

export function loadHostAnswers(sessionId: string) {
  return readJson<HostAnswer[]>(answersKey, [])
    .filter((answer) => answer.session_id === sessionId)
    .sort((a, b) => a.answered_at.localeCompare(b.answered_at));
}

export function saveHostAnswer(
  sessionId: string,
  participantId: string,
  questionIndex: number,
  answerIndex: number,
  isCorrect: boolean,
) {
  const answers = readJson<HostAnswer[]>(answersKey, []);
  if (answers.some((answer) => (
    answer.session_id === sessionId &&
    answer.participant_id === participantId &&
    answer.question_index === questionIndex
  ))) return;

  writeJson(answersKey, [...answers, {
    id: crypto.randomUUID(),
    session_id: sessionId,
    participant_id: participantId,
    question_index: questionIndex,
    answer_index: answerIndex,
    is_correct: isCorrect,
    answered_at: new Date().toISOString(),
  }]);
}

function updateSession(sessionId: string, patch: Partial<HostSession>) {
  const sessions = readJson<HostSession[]>(sessionsKey, []);
  writeJson(sessionsKey, sessions.map((session) =>
    session.id === sessionId ? { ...session, ...patch } : session,
  ));
}
