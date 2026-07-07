import type { Profile } from '../lib/quizTypes';
import type { Texts } from '../lib/language';
import { getNameFrame } from '../lib/nameFrameCatalog';
import { getLevelInfo } from '../lib/profileProgress';
import { getSkin } from '../lib/skinCatalog';
import { SkinBadge } from './SkinBadge';
import { StreakBadge } from './StreakBadge';

type AppHeaderProps = {
  profile: Profile;
  texts: Texts;
};

export function AppHeader({
  profile,
  texts,
}: AppHeaderProps) {
  const nameFrame = getNameFrame(profile.active_name_frame_id);
  const levelInfo = getLevelInfo(profile.xp);
  const activeSkin = getSkin(profile.active_skin_id);

  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">QuizRoom</p>
        <h1>{texts.appTitle}</h1>
      </div>
      <div className="user-box">
        <div className="user-line">
          <SkinBadge skinId={profile.active_skin_id} />
          <span className={`name-frame ${nameFrame.className}`}>{profile.display_name}</span>
        </div>
        {activeSkin.ability ? <small className="header-ability">Ability: {activeSkin.ability.description}</small> : null}
        <small>{texts.level} {levelInfo.level} | {profile.coins} {texts.coins}</small>
        <div className="header-xp" aria-label="XP progress">
          <span>{levelInfo.currentLevelXp}/{levelInfo.nextLevelXp} XP</span>
          <div>
            <strong style={{ width: `${levelInfo.percent}%` }} />
          </div>
        </div>
        <StreakBadge texts={texts} user={profile} />
      </div>
    </header>
  );
}
