import type { HostAnswer, HostParticipant, HostSession, Quiz } from './quizTypes';

export type HostLeaderboardRow = {
  participant: HostParticipant;
  score: number;
  answeredCount: number;
};

export function buildHostLeaderboard(
  participants: HostParticipant[],
  answers: HostAnswer[],
  quiz: Quiz,
) {
  return participants
    .map((participant) => {
      const playerAnswers = answers.filter((answer) => answer.participant_id === participant.id);
      return {
        participant,
        score: playerAnswers.filter((answer) => answer.is_correct).length,
        answeredCount: playerAnswers.length,
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.answeredCount !== a.answeredCount) return b.answeredCount - a.answeredCount;
      return a.participant.joined_at.localeCompare(b.participant.joined_at);
    })
    .slice(0, Math.max(participants.length, quiz.questions.length));
}

export function countQuestionAnswers(answers: HostAnswer[], questionIndex: number) {
  return answers.filter((answer) => answer.question_index === questionIndex).length;
}

export function getHostTitle(session: HostSession, totalQuestions: number) {
  if (session.status === 'lobby') return 'Waiting room';
  return session.status === 'finished'
    ? 'Final leaderboard'
    : `Question ${session.current_question_index + 1} / ${totalQuestions}`;
}
