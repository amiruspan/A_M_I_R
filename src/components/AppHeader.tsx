import type { Profile } from '../lib/quizTypes';
import type { Language, Texts } from '../lib/language';
import { getNameFrame } from '../lib/nameFrameCatalog';
import { getLevelInfo } from '../lib/profileProgress';
import { BackgroundMusicButton } from './BackgroundMusicButton';
import { LanguageToggle } from './LanguageToggle';
import { SkinBadge } from './SkinBadge';
import { StreakBadge } from './StreakBadge';

type AppHeaderProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
  profile: Profile;
  onSignOut: () => void;
  texts: Texts;
};

export function AppHeader({ language, onLanguageChange, profile, onSignOut, texts }: AppHeaderProps) {
  const nameFrame = getNameFrame(profile.active_name_frame_id);
  const levelInfo = getLevelInfo(profile.xp);

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
        <small>{texts.level} {levelInfo.level} | {profile.coins} {texts.coins}</small>
        <StreakBadge texts={texts} user={profile} />
        <LanguageToggle language={language} onChange={onLanguageChange} texts={texts} />
        <BackgroundMusicButton />
        <button className="secondary-button" onClick={onSignOut} type="button">
          {texts.logout}
        </button>
      </div>
    </header>
  );
}
