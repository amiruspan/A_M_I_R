import type { Profile } from '../lib/quizTypes';
import type { Language, Texts } from '../lib/language';
import { getNameFrame } from '../lib/nameFrameCatalog';
import { getLevelInfo } from '../lib/profileProgress';
import { getSkin } from '../lib/skinCatalog';
import { SkinBadge } from './SkinBadge';
import { StreakBadge } from './StreakBadge';

type AppHeaderProps = {
  language: Language;
  profile: Profile;
  texts: Texts;
};

export function AppHeader({
  language,
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
          <SkinBadge language={language} skinId={profile.active_skin_id} />
          <span className={`name-frame ${nameFrame.className}`}>{profile.display_name}</span>
        </div>
        {activeSkin.ability ? <small className="header-ability">{texts.ability}: {texts.removeWrongAnswerAbility}</small> : null}
        <small>{texts.level} {levelInfo.level} | {profile.coins} {texts.coins}</small>
        <div className="header-xp" aria-label={texts.levelProgress}>
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
