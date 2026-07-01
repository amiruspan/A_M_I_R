import type { Attempt, LocalUser } from '../lib/quizTypes';

type ProfileStatsProps = {
  attempts: Attempt[];
  user: LocalUser;
};

export function ProfileStats({ attempts, user }: ProfileStatsProps) {
  const userAttempts = attempts.filter((attempt) => attempt.user_id === user.user_id);
  const totalQuizzes = userAttempts.length;
  const totalCorrect = userAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const totalQuestions = userAttempts.reduce((sum, attempt) => sum + attempt.total, 0);
  const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const bestAttempt = [...userAttempts].sort((a, b) => {
    const firstPercent = a.score / a.total;
    const secondPercent = b.score / b.total;
    return secondPercent - firstPercent || b.score - a.score;
  })[0];

  return (
    <section className="panel stack">
      <div>
        <p className="eyebrow">Stats</p>
        <h2>Your progress</h2>
      </div>

      <div className="stats-grid">
        <StatCard label="Quizzes played" value={String(totalQuizzes)} />
        <StatCard label="Correct answers" value={`${totalCorrect}/${totalQuestions}`} />
        <StatCard label="Average score" value={`${averageScore}%`} />
        <StatCard label="Coins" value={String(user.coins)} />
      </div>

      {bestAttempt ? (
        <div className="best-stat">
          <span>Best result</span>
          <strong>{bestAttempt.score}/{bestAttempt.total}</strong>
        </div>
      ) : (
        <p className="empty">Play a quiz to start filling your stats.</p>
      )}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}
