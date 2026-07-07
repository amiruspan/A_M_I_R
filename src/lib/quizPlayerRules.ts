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

export function getModeDescription(mode: Quiz['game_mode']) {
  if (mode === 'hardcore') return 'Hardcore: one mistake ends the run.';
  if (mode === 'blitz') return 'Blitz: only 8 seconds for each question.';
  if (mode === 'practice') return 'Practice: no timer, learn calmly.';
  if (mode === 'final_boss') return 'Final Boss: 10 seconds and one mistake ends the run.';
  return 'Normal mode: answer all questions before time runs out.';
}

export function getAnswerClass(selectedAnswer: number | undefined, answerIndex: number, removedAnswer?: number) {
  if (removedAnswer === answerIndex) return 'answer eliminated';
  return selectedAnswer === answerIndex ? 'answer active' : 'answer';
}
