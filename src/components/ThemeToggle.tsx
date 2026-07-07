import type { Texts } from '../lib/language';
import type { AppTheme } from '../lib/theme';
import { themes } from '../lib/theme';

type ThemeToggleProps = {
  onChange: (theme: AppTheme) => void;
  texts: Texts;
  theme: AppTheme;
};

export function ThemeToggle({ onChange, texts, theme }: ThemeToggleProps) {
  return (
    <div className="theme-toggle" aria-label={texts.theme}>
      {themes.map((item) => (
        <button
          className={theme === item.id ? 'active' : ''}
          key={item.id}
          onClick={() => onChange(item.id)}
          type="button"
        >
          {getThemeLabel(item.id, texts)}
        </button>
      ))}
    </div>
  );
}

function getThemeLabel(theme: AppTheme, texts: Texts) {
  if (theme === 'warm') return texts.warmTheme;
  if (theme === 'dark') return texts.darkTheme;
  return texts.lightTheme;
}
