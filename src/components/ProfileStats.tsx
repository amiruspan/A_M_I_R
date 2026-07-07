import type { Attempt, LocalUser, Quiz } from '../lib/quizTypes';
import type { Language, Texts } from '../lib/language';
import {
  canClaimDailyBonus,
  dailyBonusCoins,
  getBadgeDescription,
  getBadgeName,
  getEarnedBadges,
  getLevelInfo,
  isStreakOnFire,
} from '../lib/profileProgress';

type ProfileStatsProps = {
  attempts: Attempt[];
  language: Language;
  onClaimDailyBonus: () => Promise<void>;
  quizzes: Quiz[];
  texts: Texts;
  user: LocalUser;
};

export function ProfileStats({ attempts, language, onClaimDailyBonus, quizzes, texts, user }: ProfileStatsProps) {
  const userAttempts = attempts.filter((attempt) => attempt.user_id === user.user_id);
  const totalQuizzes = userAttempts.length;
  const totalCorrect = userAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const totalQuestions = userAttempts.reduce((sum, attempt) => sum + attempt.total, 0);
  const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const levelInfo = getLevelInfo(user.xp);
  const earnedBadges = getEarnedBadges(user, attempts, quizzes);
  const dailyReady = canClaimDailyBonus(user);
  const streakActive = isStreakOnFire(user);
  const bestAttempt = [...userAttempts].sort((a, b) => {
    const firstPercent = a.score / a.total;
    const secondPercent = b.score / b.total;
    return secondPercent - firstPercent || b.score - a.score;
  })[0];

  return (
    <section className="panel stack">
      <div>
        <p className="eyebrow">{texts.stats}</p>
        <h2>{texts.profile}</h2>
      </div>

      <div className="stats-grid">
        <StatCard label={texts.level} value={String(levelInfo.level)} />
        <StatCard label="XP" value={`${levelInfo.currentLevelXp}/${levelInfo.nextLevelXp}`} />
        <StatCard label={texts.explore} value={String(totalQuizzes)} />
        <StatCard label={texts.correctAnswers} value={`${totalCorrect}/${totalQuestions}`} />
        <StatCard label={texts.average} value={`${averageScore}%`} />
        <StatCard label={texts.coins} value={String(user.coins)} />
        <StatCard label={streakActive ? texts.dayStreak : texts.newStreak} value={String(user.login_streak)} />
      </div>

      <div className="xp-progress" aria-label={texts.levelProgress}>
        <div className="xp-progress-top">
          <span>{texts.level} {levelInfo.level}</span>
          <strong>{levelInfo.percent}%</strong>
        </div>
        <div className="level-track">
          <div style={{ width: `${levelInfo.percent}%` }}>
            <span />
          </div>
        </div>
        <p className="xp-progress-caption">
          {levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} {texts.xpToLevel} {levelInfo.level + 1}
        </p>
      </div>

      <button disabled={!dailyReady} onClick={() => void onClaimDailyBonus()} type="button">
        {dailyReady ? `+${dailyBonusCoins} ${texts.coins}` : texts.dailyClaimed}
      </button>

      {bestAttempt ? (
        <div className="best-stat">
          <span>{texts.best}</span>
          <strong>{bestAttempt.score}/{bestAttempt.total}</strong>
        </div>
      ) : (
        <p className="empty">{texts.noQuizzes}</p>
      )}

      <div className="badge-grid">
        {earnedBadges.map((badge) => (
          <article className={badge.earned ? 'badge-card earned' : 'badge-card'} key={badge.id}>
            <strong>{getBadgeName(badge, language)}</strong>
            <span>{getBadgeDescription(badge, language)}</span>
          </article>
        ))}
      </div>
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
