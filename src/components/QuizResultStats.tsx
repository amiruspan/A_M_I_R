import type { CSSProperties } from 'react';
import type { Quiz } from '../lib/quizTypes';
import './QuizResultStats.css';

type QuizResultStatsProps = {
  answers: number[];
  failedHardcore: boolean;
  onClose: () => void;
  quiz: Quiz;
  score: number;
};

export function QuizResultStats({ answers, failedHardcore, onClose, quiz, score }: QuizResultStatsProps) {
  const total = quiz.questions.length;
  const percent = total === 0 ? 0 : Math.round((score / total) * 100);
  const mistakes = total - score;
  const message = failedHardcore ? 'Hardcore run failed!' : getResultMessage(percent);

  return (
    <div className="result-card" role="status">
      <div className={failedHardcore ? 'result-badge failed' : 'result-badge'} aria-hidden="true">
        {failedHardcore ? '!' : 'OK'}
      </div>
      <p className="eyebrow">{failedHardcore ? 'Hardcore mode' : 'Quiz complete'}</p>
      <h2>{message}</h2>

      <div className="score-ring" style={{ '--score': `${percent}%` } as CSSProperties}>
        <span>{percent}%</span>
      </div>

      <dl className="stats-grid">
        <div>
          <dt>Correct</dt>
          <dd>{score}</dd>
        </div>
        <div>
          <dt>Mistakes</dt>
          <dd>{mistakes}</dd>
        </div>
        <div>
          <dt>Total</dt>
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
        <h3>Correct answers</h3>
        {quiz.questions.map((question, index) => {
          const selectedAnswer = answers[index];
          const isCorrect = selectedAnswer === question.correctIndex;
          const selectedText = selectedAnswer === undefined || selectedAnswer < 0
            ? 'No answer'
            : question.options[selectedAnswer];

          return (
            <article className={isCorrect ? 'answer-review-card correct' : 'answer-review-card'} key={`${question.text}-review`}>
              <div>
                <strong>{index + 1}. {question.text}</strong>
                <span>Your answer: {selectedText}</span>
              </div>
              <p>Correct: {question.options[question.correctIndex]}</p>
            </article>
          );
        })}
      </section>

      <button onClick={onClose} type="button">Back to quizzes</button>
    </div>
  );
}

function getResultMessage(percent: number) {
  if (percent === 100) return 'Perfect score!';
  if (percent >= 80) return 'Great job!';
  if (percent >= 50) return 'Nice progress!';
  return 'Keep practicing!';
}
