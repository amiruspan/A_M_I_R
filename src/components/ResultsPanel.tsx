import type { Attempt, Quiz } from '../lib/quizTypes';

type ResultsPanelProps = {
  attempts: Attempt[];
  quizzes: Quiz[];
};

export function ResultsPanel({ attempts, quizzes }: ResultsPanelProps) {
  const recent = attempts.slice(0, 5);

  return (
    <section className="panel stack">
      <h2>Recent results</h2>
      {recent.length === 0 ? (
        <p className="empty">Results will appear after someone plays.</p>
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
    </section>
  );
}
