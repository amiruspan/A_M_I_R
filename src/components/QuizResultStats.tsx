import type { CSSProperties } from 'react';
import type { Texts } from '../lib/language';
import type { Quiz } from '../lib/quizTypes';
import './QuizResultStats.css';

type QuizResultStatsProps = {
  answers: number[];
  failedHardcore: boolean;
  onClose: () => void;
  quiz: Quiz;
  score: number;
  texts: Texts;
};

export function QuizResultStats({ answers, failedHardcore, onClose, quiz, score, texts }: QuizResultStatsProps) {
  const total = quiz.questions.length;
  const percent = total === 0 ? 0 : Math.round((score / total) * 100);
  const mistakes = total - score;
  const message = failedHardcore ? texts.hardcoreRunFailed : getResultMessage(percent, texts);

  return (
    <div className="result-card" role="status">
      <div className={failedHardcore ? 'result-badge failed' : 'result-badge'} aria-hidden="true">
        {failedHardcore ? '!' : 'OK'}
      </div>
      <p className="eyebrow">{failedHardcore ? texts.hardcoreMode : texts.quizComplete}</p>
      <h2>{message}</h2>

      <div className="score-ring" style={{ '--score': `${percent}%` } as CSSProperties}>
        <span>{percent}%</span>
      </div>

      <dl className="stats-grid">
        <div>
          <dt>{texts.correct}</dt>
          <dd>{score}</dd>
        </div>
        <div>
          <dt>{texts.mistakes}</dt>
          <dd>{mistakes}</dd>
        </div>
        <div>
          <dt>{texts.total}</dt>
          <dd>{total}</dd>
        </div>
      </dl>

      <div className="answer-dots">
        {quiz.questions.map((question, index) => {
          const isCorrect = answers[index] === question.correctIndex;
          return (
            <span className={isCorrect ? 'review-dot correct' : 'review-dot wrong'} key={`${question.text}-${index}`}>
              {index + 1}
            </span>
          );
        })}
      </div>

      <section className="answer-review">
        <h3>{texts.correctAnswers}</h3>
        {quiz.questions.map((question, index) => {
          const selectedAnswer = answers[index];
          const isCorrect = selectedAnswer === question.correctIndex;
          const selectedText = selectedAnswer === undefined || selectedAnswer < 0
            ? texts.noAnswer
            : question.options[selectedAnswer];

          return (
            <article className={isCorrect ? 'answer-review-card correct' : 'answer-review-card'} key={`${question.text}-review`}>
              <div>
                <strong>{index + 1}. {question.text}</strong>
                <span>{texts.yourAnswer}: {selectedText}</span>
              </div>
              <p>{texts.correct}: {question.options[question.correctIndex]}</p>
            </article>
          );
        })}
      </section>

      <button onClick={onClose} type="button">{texts.backToQuizzes}</button>
    </div>
  );
}

function getResultMessage(percent: number, texts: Texts) {
  if (percent === 100) return texts.perfectScore;
  if (percent >= 80) return texts.greatJob;
  if (percent >= 50) return texts.niceProgress;
  return texts.keepPracticing;
}
