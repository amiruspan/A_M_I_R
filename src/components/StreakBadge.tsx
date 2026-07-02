import { useEffect, useState } from 'react';
import type { Profile } from '../lib/quizTypes';
import type { Texts } from '../lib/language';
import { consumeStreakAnimation, isStreakOnFire } from '../lib/profileProgress';

type StreakBadgeProps = {
  texts: Texts;
  user: Profile;
};

export function StreakBadge({ texts, user }: StreakBadgeProps) {
  const [celebrates, setCelebrates] = useState(false);
  const isActive = isStreakOnFire(user);
  const label = isActive
    ? `${user.login_streak} ${texts.streakTitle}`
    : texts.streakHint;

  useEffect(() => {
    if (!consumeStreakAnimation(user)) return;
    setCelebrates(true);
    const timeoutId = window.setTimeout(() => setCelebrates(false), 1300);
    return () => window.clearTimeout(timeoutId);
  }, [user]);

  return (
    <span className={getClassName(isActive, celebrates)} title={label}>
      <span className="flame-icon" aria-hidden="true" />
      <strong>{user.login_streak}</strong>
    </span>
  );
}

function getClassName(isActive: boolean, celebrates: boolean) {
  return [
    'streak-badge',
    isActive ? 'active' : '',
    celebrates ? 'celebrate' : '',
  ].filter(Boolean).join(' ');
}
