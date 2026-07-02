import type { Texts } from '../lib/language';
import type { Attempt, Quiz } from '../lib/quizTypes';

type ResultsPanelProps = {
  attempts: Attempt[];
  quizzes: Quiz[];
  texts: Texts;
};

export function ResultsPanel({ attempts, quizzes, texts }: ResultsPanelProps) {
  const recent = attempts.slice(0, 5);
  const leaders = getLeaders(attempts).slice(0, 5);

  return (
    <section className="panel stack">
      <h2>{texts.best}</h2>
      {recent.length === 0 ? (
        <p className="empty">{texts.noQuizzes}</p>
      ) : (
        <ul className="results-list">
          {recent.map((attempt) => {
            const quiz = quizzes.find((item) => item.id === attempt.quiz_id);
            return (
              <li key={attempt.id}>
                <span>{attempt.player_name} - {quiz?.title ?? 'Quiz'}</span>
                <strong>{attempt.score}/{attempt.total}</strong>
              </li>
            );
          })}
        </ul>
      )}

      <h2>{texts.level}</h2>
      {leaders.length === 0 ? (
        <p className="empty">{texts.noQuizzes}</p>
      ) : (
        <ol className="leader-list">
          {leaders.map((leader) => (
            <li key={leader.userId}>
              <span>{leader.name}</span>
              <strong>{leader.score} pts</strong>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function getLeaders(attempts: Attempt[]) {
  const leaders = new Map<string, { name: string; score: number; userId: string }>();

  attempts.forEach((attempt) => {
    const current = leaders.get(attempt.user_id);
    leaders.set(attempt.user_id, {
      name: attempt.player_name,
      score: (current?.score ?? 0) + attempt.score,
      userId: attempt.user_id,
    });
  });

  return [...leaders.values()].sort((a, b) => b.score - a.score);
}
