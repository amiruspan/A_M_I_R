import type { Profile } from '../lib/quizTypes';
import { getNameFrame } from '../lib/nameFrameCatalog';
import { BackgroundMusicButton } from './BackgroundMusicButton';
import { SkinBadge } from './SkinBadge';

type AppHeaderProps = {
  profile: Profile;
  onSignOut: () => void;
};

export function AppHeader({ profile, onSignOut }: AppHeaderProps) {
  const nameFrame = getNameFrame(profile.active_name_frame_id);

  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">QuizRoom</p>
        <h1>Class quizzes</h1>
      </div>
      <div className="user-box">
        <div className="user-line">
          <SkinBadge skinId={profile.active_skin_id} />
          <span className={`name-frame ${nameFrame.className}`}>{profile.display_name}</span>
        </div>
        <small>{profile.coins} coins</small>
        <BackgroundMusicButton />
        <button className="secondary-button" onClick={onSignOut} type="button">
          Sign out
        </button>
      </div>
    </header>
  );
}
