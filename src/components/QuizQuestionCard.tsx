import type { Texts } from '../lib/language';
import type { QuizQuestion } from '../lib/quizTypes';
import type { SkinAbility } from '../lib/skinCatalog';
import { getAnswerClass } from '../lib/quizPlayerRules';

type QuizQuestionCardProps = {
  abilityUsed: boolean;
  answer: number | undefined;
  currentIndex: number;
  hasTimer: boolean;
  onChoose: (answerIndex: number) => void;
  onUseAbility: () => void;
  question: QuizQuestion;
  questionSeconds: number;
  removedAnswer?: number;
  secondsLeft: number;
  skinName: string;
  skinAbility?: SkinAbility;
  texts: Texts;
  totalQuestions: number;
};

export function QuizQuestionCard({
  abilityUsed,
  answer,
  currentIndex,
  hasTimer,
  onChoose,
  onUseAbility,
  question,
  questionSeconds,
  removedAnswer,
  secondsLeft,
  skinName,
  skinAbility,
  texts,
  totalQuestions,
}: QuizQuestionCardProps) {
  return (
    <div className="question-card" key={`${question.text}-${currentIndex}`}>
      <div className="question-meta">
        <span>{texts.question} {currentIndex + 1} / {totalQuestions}</span>
        <span>{hasTimer ? `${secondsLeft}s` : texts.noTimer}</span>
      </div>
      {hasTimer ? (
        <div className="timer-track" aria-hidden="true">
          <div style={{ width: `${(secondsLeft / questionSeconds) * 100}%` }} />
        </div>
      ) : null}
      <h3>{question.text}</h3>
      {skinAbility?.id === 'remove_wrong_answer' ? (
        <button className="ability-button" disabled={abilityUsed || removedAnswer !== undefined} onClick={onUseAbility} type="button">
          {abilityUsed ? texts.powerUsed : texts.removeWrongAnswerAbility}
        </button>
      ) : null}
      {removedAnswer !== undefined ? (
        <p className="ability-note">
          {skinName} {texts.skinRemovedWrongAnswer}
        </p>
      ) : null}
      <div className="answer-grid">
        {question.options.map((option, answerIndex) => (
          <button
            className={getAnswerClass(answer, answerIndex, removedAnswer)}
            disabled={removedAnswer === answerIndex}
            key={`${option}-${answerIndex}`}
            onClick={() => onChoose(answerIndex)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
