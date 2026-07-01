import type { Attempt, LocalUser, Quiz } from './quizTypes';

export type Badge = {
  id: string;
  name: string;
  description: string;
};

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
  return new Date().toISOString().slice(0, 10);
}

export function canClaimDailyBonus(user: LocalUser) {
  return user.last_daily_bonus !== getTodayKey();
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
