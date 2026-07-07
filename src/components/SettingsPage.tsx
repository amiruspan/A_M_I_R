import type { Language, Texts } from '../lib/language';
import type { AppTheme } from '../lib/theme';
import { BackgroundMusicButton } from './BackgroundMusicButton';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';

type SettingsPageProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
  onSignOut: () => void;
  onThemeChange: (theme: AppTheme) => void;
  texts: Texts;
  theme: AppTheme;
};

export function SettingsPage({
  language,
  onLanguageChange,
  onSignOut,
  onThemeChange,
  texts,
  theme,
}: SettingsPageProps) {
  return (
    <section className="panel stack">
      <div>
        <p className="eyebrow">{texts.settings}</p>
        <h2>{texts.appSettings}</h2>
      </div>

      <div className="settings-grid">
        <article className="setting-card">
          <div>
            <h3>{texts.theme}</h3>
            <p>{texts.themeHint}</p>
          </div>
          <ThemeToggle onChange={onThemeChange} texts={texts} theme={theme} />
        </article>

        <article className="setting-card">
          <div>
            <h3>{texts.language}</h3>
            <p>{texts.switchLanguageHint}</p>
          </div>
          <LanguageToggle language={language} onChange={onLanguageChange} texts={texts} />
        </article>

        <article className="setting-card">
          <div>
            <h3>{texts.music}</h3>
            <p>{texts.musicHint}</p>
          </div>
          <BackgroundMusicButton />
        </article>
      </div>

      <button className="secondary-button" onClick={onSignOut} type="button">
        {texts.logout}
      </button>
    </section>
  );
}
