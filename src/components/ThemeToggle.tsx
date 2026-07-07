import type { AppTheme } from '../lib/theme';
import { themes } from '../lib/theme';

type ThemeToggleProps = {
  onChange: (theme: AppTheme) => void;
  theme: AppTheme;
};

export function ThemeToggle({ onChange, theme }: ThemeToggleProps) {
  return (
    <div className="theme-toggle" aria-label="Theme">
      {themes.map((item) => (
        <button
          className={theme === item.id ? 'active' : ''}
          key={item.id}
          onClick={() => onChange(item.id)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
