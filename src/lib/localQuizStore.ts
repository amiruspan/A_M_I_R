import type { Attempt, GameMode, LocalUser, Quiz, QuizQuestion, Role, StoredAccount } from './quizTypes';
import { normalizeUser } from './profileEconomy';
import { getTodayKey, markStreakAnimation, updateLoginStreakForToday } from './profileProgress';

const accountsKey = 'quizroom_accounts';
const userKey = 'quizroom_user';
const quizzesKey = 'quizroom_quizzes';
const attemptsKey = 'quizroom_attempts';
const progressKey = 'quizroom_progress';

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

function createId() {
  return crypto.randomUUID();
}

function createShareCode() {
  return String(Math.floor(10_000_000 + Math.random() * 90_000_000));
}

function isNumericShareCode(code: string) {
  return /^\d{8}$/.test(code);
}

export function getCurrentUser() {
  const user = readJson<LocalUser | null>(userKey, null);
  if (!user) return null;
  const currentUser = normalizeUser(user);
  const nextUser = updateLoginStreakForToday(currentUser);
  if (nextUser.login_streak > currentUser.login_streak && nextUser.login_streak > 1) {
    markStreakAnimation(nextUser);
  }
  writeJson(userKey, nextUser);
  return nextUser;
}

export function signOut() {
  localStorage.removeItem(userKey);
}

export function createAccount(email: string, password: string) {
  const accounts = readJson<StoredAccount[]>(accountsKey, []);
  if (accounts.some((account) => account.email === email)) {
    throw new Error('Account already exists.');
  }
  const today = getTodayKey();
  const account: StoredAccount = {
    user_id: createId(),
    email,
    password,
    role: 'student',
    display_name: email.split('@')[0] || 'Player',
    coins: 0,
    xp: 0,
    last_daily_bonus: null,
    login_streak: 1,
    last_seen_date: today,
    banned_until: null,
    earned_badge_ids: [],
    owned_skin_ids: ['classic'],
    active_skin_id: 'classic',
    owned_name_frame_ids: ['plain'],
    active_name_frame_id: 'plain',
  };
  writeJson(accountsKey, [...accounts, account]);
  writeJson(userKey, account);
  return account;
}

export function signIn(email: string, password: string) {
  const accounts = readJson<StoredAccount[]>(accountsKey, []);
  const account = accounts.find((item) => item.email === email && item.password === password);
  if (!account) throw new Error('Wrong email or password.');
  const user = normalizeUser(account);
  const nextUser = updateLoginStreakForToday(user);
  if (nextUser.login_streak > user.login_streak && nextUser.login_streak > 1) {
    markStreakAnimation(nextUser);
  }
  const nextAccounts = accounts.map((item) => (
    item.user_id === nextUser.user_id ? { ...item, ...nextUser, password: item.password } : item
  ));
  writeJson(accountsKey, nextAccounts);
  writeJson(userKey, nextUser);
  return nextUser;
}

export function saveProfile(userId: string, role: Role, displayName: string) {
  const accounts = readJson<StoredAccount[]>(accountsKey, []);
  const nextAccounts = accounts.map((account) =>
    account.user_id === userId ? { ...account, role, display_name: displayName } : account,
  );
  const updated = nextAccounts.find((account) => account.user_id === userId);
  if (!updated) throw new Error('Account not found.');
  writeJson(accountsKey, nextAccounts);
  const user = normalizeUser(updated);
  writeJson(userKey, user);
  return user;
}

export function loadQuizzes() {
  const quizzes = readJson<Quiz[]>(quizzesKey, []);
  const usedCodes = new Set(quizzes.map((quiz) => quiz.share_code));
  let changed = false;
  const normalizedQuizzes = quizzes.map((quiz) => {
    const normalizedQuiz = { ...quiz, game_mode: quiz.game_mode ?? 'normal' };
    if (isNumericShareCode(quiz.share_code)) return normalizedQuiz;
    let nextCode = createShareCode();
    while (usedCodes.has(nextCode)) nextCode = createShareCode();
    usedCodes.add(nextCode);
    changed = true;
    return { ...normalizedQuiz, share_code: nextCode };
  });

  if (changed) writeJson(quizzesKey, normalizedQuizzes);

  return normalizedQuizzes.sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );
}

export function createQuiz(
  userId: string,
  title: string,
  description: string,
  gameMode: GameMode,
  questions: QuizQuestion[],
) {
  const quiz: Quiz = {
    id: createId(),
    user_id: userId,
    title,
    description,
    share_code: createShareCode(),
    is_public: true,
    game_mode: gameMode,
    questions,
    created_at: new Date().toISOString(),
  };
  writeJson(quizzesKey, [quiz, ...loadQuizzes()]);
  return quiz;
}

export function saveAttempt(userId: string, quizId: string, playerName: string, score: number, total: number) {
  const attempt: Attempt = {
    id: createId(),
    quiz_id: quizId,
    user_id: userId,
    player_name: playerName,
    score,
    total,
    created_at: new Date().toISOString(),
  };
  writeJson(attemptsKey, [attempt, ...loadAttempts()]);
}

export function loadAttempts() {
  return readJson<Attempt[]>(attemptsKey, [])
    .map((attempt) => ({ ...attempt, player_name: attempt.player_name ?? 'Player' }))
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function loadProgress(quizId: string) {
  const progress = readJson<Record<string, number[]>>(progressKey, {});
  return progress[quizId] ?? [];
}

export function saveProgress(_userId: string, quizId: string, answers: number[]) {
  const progress = readJson<Record<string, number[]>>(progressKey, {});
  progress[quizId] = answers;
  writeJson(progressKey, progress);
}

export function clearProgress(quizId: string) {
  const progress = readJson<Record<string, number[]>>(progressKey, {});
  delete progress[quizId];
  writeJson(progressKey, progress);
}
