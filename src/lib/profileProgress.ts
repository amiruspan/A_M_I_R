import type { Attempt, LocalUser, Profile, Quiz } from './quizTypes';

export type Badge = {
  id: string;
  name: string;
  description: string;
};

const streakAnimationKey = 'quizroom_streak_animation';
export const dailyBonusCoins = 50;
export const xpPerCorrectAnswer = 12;
export const xpPerQuizComplete = 20;
const xpPerLevel = 120;

export const badges: Badge[] = [
  { id: 'first_quiz', name: 'First Quiz', description: 'Finish your first quiz.' },
  { id: 'sharp_mind', name: 'Sharp Mind', description: 'Answer 10 questions correctly.' },
  { id: 'perfect_run', name: 'Perfect Run', description: 'Get a perfect quiz score.' },
  { id: 'quiz_maker', name: 'Quiz Maker', description: 'Create your first quiz.' },
];

export function getLevelInfo(xp: number) {
  const level = Math.floor(xp / xpPerLevel) + 1;
  const currentLevelXp = xp % xpPerLevel;
  return {
    currentLevelXp,
    level,
    nextLevelXp: xpPerLevel,
    percent: Math.round((currentLevelXp / xpPerLevel) * 100),
  };
}

export function getTodayKey() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

function dateKeyToUtcMs(dateKey: string) {
  return new Date(`${dateKey}T00:00:00.000Z`).getTime();
}

export function updateLoginStreakForToday(user: LocalUser) {
  const today = getTodayKey();
  if (user.last_seen_date === today) return user;

  const lastSeenMs = user.last_seen_date ? dateKeyToUtcMs(user.last_seen_date) : Number.NaN;
  const todayMs = dateKeyToUtcMs(today);
  const daysSinceLastSeen = Number.isFinite(lastSeenMs)
    ? Math.round((todayMs - lastSeenMs) / 86_400_000)
    : 0;
  const loginStreak = daysSinceLastSeen === 1 ? user.login_streak + 1 : 1;

  return {
    ...user,
    last_seen_date: today,
    login_streak: loginStreak,
  };
}

export function isStreakOnFire(user: Profile) {
  return user.login_streak > 1 && user.last_seen_date === getTodayKey();
}

export function markStreakAnimation(user: Profile) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(streakAnimationKey, getStreakAnimationValue(user));
}

export function consumeStreakAnimation(user: Profile) {
  if (typeof window === 'undefined') return false;
  const value = getStreakAnimationValue(user);
  if (window.sessionStorage.getItem(streakAnimationKey) !== value) return false;
  window.sessionStorage.removeItem(streakAnimationKey);
  return true;
}

export function canClaimDailyBonus(user: LocalUser) {
  return user.last_daily_bonus !== getTodayKey();
}

function getStreakAnimationValue(user: Profile) {
  return `${user.user_id}:${user.login_streak}:${user.last_seen_date ?? ''}`;
}

export function getEarnedBadges(user: LocalUser, attempts: Attempt[], quizzes: Quiz[]) {
  const userAttempts = attempts.filter((attempt) => attempt.user_id === user.user_id);
  const correctAnswers = userAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const ownsQuiz = quizzes.some((quiz) => quiz.user_id === user.user_id);
  const perfectScore = userAttempts.some((attempt) => attempt.score === attempt.total);
  const earnedIds = new Set(user.earned_badge_ids);

  if (userAttempts.length > 0) earnedIds.add('first_quiz');
  if (correctAnswers >= 10) earnedIds.add('sharp_mind');
  if (perfectScore) earnedIds.add('perfect_run');
  if (ownsQuiz) earnedIds.add('quiz_maker');

  return badges.map((badge) => ({ ...badge, earned: earnedIds.has(badge.id) }));
}
