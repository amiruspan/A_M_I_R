import type { Language, Texts } from '../lib/language';
import { LanguageToggle } from './LanguageToggle';

type WelcomeScreenProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
  onStart: () => void;
  texts: Texts;
};

export function WelcomeScreen({ language, onLanguageChange, onStart, texts }: WelcomeScreenProps) {
  const highlights = [
    { title: texts.welcomeOneTitle, text: texts.welcomeOneText },
    { title: texts.welcomeTwoTitle, text: texts.welcomeTwoText },
    { title: texts.welcomeThreeTitle, text: texts.welcomeThreeText },
  ];
  const tutorial = [
    { title: texts.tutorialOneTitle, text: texts.tutorialOneText },
    { title: texts.tutorialTwoTitle, text: texts.tutorialTwoText },
    { title: texts.tutorialThreeTitle, text: texts.tutorialThreeText },
  ];

  return (
    <main className="welcome-screen">
      <section className="welcome-panel">
        <div className="welcome-copy">
          <LanguageToggle language={language} onChange={onLanguageChange} texts={texts} />
          <p className="eyebrow">QuizRoom</p>
          <h1>{texts.welcomeTitle}</h1>
          <p className="welcome-text">
            {texts.welcomeText}
          </p>
          <div className="welcome-tutorial" aria-label={texts.tutorialTitle}>
            <strong>{texts.tutorialTitle}</strong>
            <ol>
              {tutorial.map((item) => (
                <li key={item.title}>
                  <span>{item.title}</span>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <button onClick={onStart} type="button">{texts.welcomeAction}</button>
        </div>

        <div className="welcome-steps" aria-label={texts.welcomeTitle}>
          {highlights.map((item, index) => (
            <article className="welcome-step" key={item.title}>
              <span>{index + 1}</span>
              <div>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
