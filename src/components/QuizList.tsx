import type { Attempt, Quiz } from '../lib/quizTypes';
import { PrizeBoard } from './PrizeBoard';

type QuizListProps = {
  attempts: Attempt[];
  currentUserId: string;
  onHost?: (quiz: Quiz) => Promise<void>;
  onPlay: (quiz: Quiz) => Promise<void>;
  quizzes: Quiz[];
};

export function QuizList({ attempts, currentUserId, onHost, onPlay, quizzes }: QuizListProps) {
  if (quizzes.length === 0) {
    return <p className="empty">No shared quizzes yet. Create the first one.</p>;
  }

  return (
    <div className="quiz-list">
      {quizzes.map((quiz) => {
        const best = attempts
          .filter((attempt) => attempt.quiz_id === quiz.id)
          .sort((a, b) => b.score - a.score)[0];
        const ownerText = quiz.user_id === currentUserId ? 'Your quiz' : 'Shared quiz';

        return (
          <article className="quiz-card" key={quiz.id}>
            <div>
              <span className="pill">{ownerText}</span>
              <h3>{quiz.title}</h3>
              <p>{quiz.description || 'Quick class quiz'}</p>
            </div>
            <div className="quiz-meta">
              <span>Code: {quiz.share_code}</span>
              <span>{getModeLabel(quiz.game_mode)}</span>
              {best && <span>Best: {best.score}/{best.total}</span>}
            </div>
            <PrizeBoard attempts={attempts} quizId={quiz.id} />
            <div className="button-row">
              <button onClick={() => void onPlay(quiz)} type="button">Play</button>
              {quiz.user_id === currentUserId && onHost ? (
                <button className="secondary-button" onClick={() => void onHost(quiz)} type="button">
                  Host
                </button>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function getModeLabel(mode: Quiz['game_mode']) {
  if (mode === 'hardcore') return 'Hardcore';
  if (mode === 'blitz') return 'Blitz';
  if (mode === 'practice') return 'Practice';
  if (mode === 'final_boss') return 'Final Boss';
  return 'Normal';
}
