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
        <p className="eyebrow">Settings</p>
        <h2>App settings</h2>
      </div>

      <div className="settings-grid">
        <article className="setting-card">
          <div>
            <h3>Theme</h3>
            <p>Choose a comfortable look.</p>
          </div>
          <ThemeToggle onChange={onThemeChange} theme={theme} />
        </article>

        <article className="setting-card">
          <div>
            <h3>{texts.language}</h3>
            <p>Switch interface language.</p>
          </div>
          <LanguageToggle language={language} onChange={onLanguageChange} texts={texts} />
        </article>

        <article className="setting-card">
          <div>
            <h3>Music</h3>
            <p>Turn background music on or off.</p>
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
