import type { HostAnswer, HostParticipant, Quiz } from '../lib/quizTypes';
import { buildHostLeaderboard } from '../lib/hostLeaderboard';

type HostLeaderboardProps = {
  answers: HostAnswer[];
  participants: HostParticipant[];
  quiz: Quiz;
};

export function HostLeaderboard({ answers, participants, quiz }: HostLeaderboardProps) {
  const rows = buildHostLeaderboard(participants, answers, quiz);

  if (rows.length === 0) {
    return <p className="empty">Leaderboard will appear after players join.</p>;
  }

  return (
    <ol className="prize-board">
      {rows.map((row, index) => (
        <li key={row.participant.id}>
          <span className="place-badge">#{index + 1}</span>
          <span>{row.participant.player_name}</span>
          <strong>{row.score}/{quiz.questions.length}</strong>
        </li>
      ))}
    </ol>
  );
}
