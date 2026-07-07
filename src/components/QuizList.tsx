import type { Texts } from '../lib/language';
import type { Attempt, Quiz } from '../lib/quizTypes';
import { PrizeBoard } from './PrizeBoard';

type QuizListProps = {
  attempts: Attempt[];
  currentUserId: string;
  onHost?: (quiz: Quiz) => Promise<void>;
  onPlay: (quiz: Quiz) => Promise<void>;
  quizzes: Quiz[];
  texts: Texts;
};

export function QuizList({ attempts, currentUserId, onHost, onPlay, quizzes, texts }: QuizListProps) {
  if (quizzes.length === 0) {
    return <p className="empty">{texts.noQuizzes}</p>;
  }

  return (
    <div className="quiz-list">
      {quizzes.map((quiz) => {
        const best = attempts
          .filter((attempt) => attempt.quiz_id === quiz.id)
          .sort((a, b) => b.score - a.score)[0];
        const ownerText = quiz.user_id === currentUserId ? texts.publish : texts.explore;

        return (
          <article className="quiz-card" key={quiz.id}>
            <div>
              <span className="pill">{ownerText}</span>
              <h3>{quiz.title}</h3>
              <p>{quiz.description || texts.welcomeOneText}</p>
            </div>
            <div className="quiz-meta">
              <span>{texts.code}: {quiz.share_code}</span>
              <span>{getModeLabel(quiz.game_mode, texts)}</span>
              {best && <span>{texts.best}: {best.score}/{best.total}</span>}
            </div>
            <PrizeBoard attempts={attempts} quizId={quiz.id} texts={texts} />
            <div className="button-row">
              <button onClick={() => void onPlay(quiz)} type="button">{texts.explore}</button>
              {quiz.user_id === currentUserId && onHost ? (
                <button className="secondary-button" onClick={() => void onHost(quiz)} type="button">
                  {texts.host}
                </button>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function getModeLabel(mode: Quiz['game_mode'], texts: Texts) {
  if (mode === 'hardcore') return texts.hardcore;
  if (mode === 'blitz') return texts.blitz;
  if (mode === 'practice') return texts.practice;
  if (mode === 'final_boss') return texts.finalBoss;
  return texts.normal;
}
