import type { Language, Texts } from '../lib/language';

type LanguageToggleProps = {
  language: Language;
  onChange: (language: Language) => void;
  texts: Texts;
};

export function LanguageToggle({ language, onChange, texts }: LanguageToggleProps) {
  return (
    <div className="language-toggle" aria-label={texts.language}>
      <button
        className={language === 'ru' ? 'active' : ''}
        onClick={() => onChange('ru')}
        type="button"
      >
        {texts.russian}
      </button>
      <button
        className={language === 'en' ? 'active' : ''}
        onClick={() => onChange('en')}
        type="button"
      >
        {texts.english}
      </button>
    </div>
  );
}
