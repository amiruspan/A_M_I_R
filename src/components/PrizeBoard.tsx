import type { Texts } from '../lib/language';
import type { Attempt } from '../lib/quizTypes';

type PrizeBoardProps = {
  attempts: Attempt[];
  quizId: string;
  texts: Texts;
};

export function PrizeBoard({ attempts, quizId, texts }: PrizeBoardProps) {
  const winners = attempts
    .filter((attempt) => attempt.quiz_id === quizId)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.created_at.localeCompare(b.created_at);
    })
    .slice(0, 3);

  if (winners.length === 0) {
    return <p className="empty">{texts.prizePlacesEmpty}</p>;
  }

  return (
    <ol className="prize-board">
      {winners.map((attempt, index) => (
        <li key={attempt.id}>
          <span className="place-badge">{index + 1} {texts.place}</span>
          <span>{attempt.player_name}</span>
          <strong>{attempt.score}/{attempt.total}</strong>
        </li>
      ))}
    </ol>
  );
}
