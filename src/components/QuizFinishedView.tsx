import { PrizeBoard } from './PrizeBoard';
import { QuizResultStats } from './QuizResultStats';
import type { Texts } from '../lib/language';
import type { Attempt, Quiz } from '../lib/quizTypes';

type QuizFinishedViewProps = {
  answers: number[];
  attempts: Attempt[];
  failedHardcore: boolean;
  onClose: () => void;
  quiz: Quiz;
  rewardPerCorrectAnswer: number;
  score: number;
  texts: Texts;
};

export function QuizFinishedView({
  answers,
  attempts,
  failedHardcore,
  onClose,
  quiz,
  rewardPerCorrectAnswer,
  score,
  texts,
}: QuizFinishedViewProps) {
  return (
    <div className="stack">
      <QuizResultStats answers={answers} failedHardcore={failedHardcore} onClose={onClose} quiz={quiz} score={score} />
      <section className="panel">
        <p className="eyebrow">{texts.coins}</p>
        <h2>+{score * rewardPerCorrectAnswer} {texts.coins}</h2>
        <p className="message">{rewardPerCorrectAnswer} {texts.coins}</p>
      </section>
      <section className="panel stack">
        <h2>{texts.best}</h2>
        <PrizeBoard attempts={attempts} quizId={quiz.id} />
      </section>
    </div>
  );
}
