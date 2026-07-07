import type { Texts } from './language';
import type { Quiz } from './quizTypes';

export const skippedAnswer = -1;

export function getScore(quiz: Quiz, answers: number[]) {
  return quiz.questions.reduce((sum, question, index) => (
    answers[index] === question.correctIndex ? sum + 1 : sum
  ), 0);
}

export function getQuestionSeconds(mode: Quiz['game_mode']) {
  if (mode === 'practice') return 0;
  if (mode === 'blitz') return 8;
  if (mode === 'final_boss') return 10;
  return 20;
}

export function getModeDescription(mode: Quiz['game_mode'], texts: Texts) {
  if (mode === 'hardcore') return texts.hardcoreModeDescription;
  if (mode === 'blitz') return texts.blitzModeDescription;
  if (mode === 'practice') return texts.practiceModeDescription;
  if (mode === 'final_boss') return texts.finalBossModeDescription;
  return texts.normalModeDescription;
}

export function getAnswerClass(selectedAnswer: number | undefined, answerIndex: number, removedAnswer?: number) {
  if (removedAnswer === answerIndex) return 'answer eliminated';
  return selectedAnswer === answerIndex ? 'answer active' : 'answer';
}
