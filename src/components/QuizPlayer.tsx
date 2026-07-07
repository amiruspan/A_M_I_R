import { QuizFinishedView } from './QuizFinishedView';
import { QuizQuestionCard } from './QuizQuestionCard';
import { useQuizPlayerState } from './useQuizPlayerState';
import type { Texts } from '../lib/language';
import type { Attempt, Quiz } from '../lib/quizTypes';
import { getModeDescription } from '../lib/quizPlayerRules';

type QuizPlayerProps = {
  activeSkinId: string;
  attempts: Attempt[];
  initialAnswers: number[];
  onClose: () => void;
  onFinish: (score: number, total: number) => Promise<void>;
  onProgress: (answers: number[]) => Promise<void>;
  quiz: Quiz;
  rewardPerCorrectAnswer: number;
  texts: Texts;
};

export function QuizPlayer({
  activeSkinId,
  attempts,
  initialAnswers,
  onClose,
  onFinish,
  onProgress,
  quiz,
  rewardPerCorrectAnswer,
  texts,
}: QuizPlayerProps) {
  const quizState = useQuizPlayerState({ activeSkinId, initialAnswers, onFinish, onProgress, quiz });

  return (
    <section className="player">
      <div className="player-header">
        <div>
          <p className="eyebrow">{texts.explore}</p>
          <h2>{quiz.title}</h2>
          <p className="message">{getModeDescription(quiz.game_mode)}</p>
        </div>
        <button className="secondary-button" onClick={onClose} type="button">{texts.close}</button>
      </div>

      {!quizState.finished && quizState.currentQuestion ? (
        <QuizQuestionCard
          abilityUsed={quizState.abilityUsed}
          answer={quizState.answers[quizState.currentIndex]}
          currentIndex={quizState.currentIndex}
          hasTimer={quizState.hasTimer}
          onChoose={quizState.choose}
          onUseAbility={quizState.useSkinAbility}
          question={quizState.currentQuestion}
          questionSeconds={quizState.questionSeconds}
          removedAnswer={quizState.removedAnswer}
          secondsLeft={quizState.secondsLeft}
          skinName={quizState.skinName}
          skinAbility={quizState.skinAbility}
          texts={texts}
          totalQuestions={quiz.questions.length}
        />
      ) : null}

      {quizState.finished ? (
        <QuizFinishedView
          answers={quizState.answers}
          attempts={attempts}
          failedHardcore={quizState.failedHardcore}
          onClose={onClose}
          quiz={quiz}
          rewardPerCorrectAnswer={rewardPerCorrectAnswer}
          score={quizState.score}
          texts={texts}
        />
      ) : null}
    </section>
  );
}
