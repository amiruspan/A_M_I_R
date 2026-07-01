import type { Attempt } from '../lib/quizTypes';

type PrizeBoardProps = {
  attempts: Attempt[];
  quizId: string;
};

const prizeLabels = ['1 place', '2 place', '3 place'];

export function PrizeBoard({ attempts, quizId }: PrizeBoardProps) {
  const winners = attempts
    .filter((attempt) => attempt.quiz_id === quizId)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.created_at.localeCompare(b.created_at);
    })
    .slice(0, 3);

  if (winners.length === 0) {
    return <p className="empty">Prize places will appear after players finish.</p>;
  }

  return (
    <ol className="prize-board">
      {winners.map((attempt, index) => (
        <li key={attempt.id}>
          <span className="place-badge">{prizeLabels[index]}</span>
          <span>{attempt.player_name}</span>
          <strong>{attempt.score}/{attempt.total}</strong>
        </li>
      ))}
    </ol>
  );
}
