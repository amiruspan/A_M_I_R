import { useState } from 'react';
import { levelPlaylistQuizIds } from '../lib/featuredQuizzes';
import type { Texts } from '../lib/language';
import type { Attempt, Quiz } from '../lib/quizTypes';

type LevelPlaylistProps = {
  attempts: Attempt[];
  onPlay: (quiz: Quiz) => Promise<void>;
  quizzes: Quiz[];
  texts: Texts;
};

export function LevelPlaylist({ attempts, onPlay, quizzes, texts }: LevelPlaylistProps) {
  const [open, setOpen] = useState(true);
  const playlist = levelPlaylistQuizIds
    .map((id) => quizzes.find((quiz) => quiz.id === id))
    .filter((quiz): quiz is Quiz => Boolean(quiz));

  if (playlist.length === 0) return null;

  return (
    <section className="level-playlist">
      <div className="level-playlist-head">
        <div>
          <p className="eyebrow">{texts.levelPlaylist}</p>
          <h2>{texts.eightLevelPlaylist}</h2>
        </div>
        <div className="level-playlist-actions">
          <span>{playlist.length}/8</span>
          <button className="secondary-button" onClick={() => setOpen((current) => !current)} type="button">
            {open ? texts.collapse : texts.expand}
          </button>
        </div>
      </div>
      <div className={open ? 'level-playlist-grid' : 'level-playlist-grid collapsed'}>
        {playlist.map((quiz, index) => {
          const bestAttempt = getBestAttempt(attempts, quiz.id);
          const completed = Boolean(bestAttempt && bestAttempt.score === bestAttempt.total);

          return (
            <article className={completed ? 'level-card completed' : 'level-card'} key={quiz.id}>
              <div className="level-number">{index + 1}</div>
              <div>
                <p className="level-card-kicker">
                  {texts.level} {index + 1}
                  {completed ? ` · ${texts.quizComplete}` : ''}
                </p>
                <h3>{quiz.title}</h3>
                <p>{quiz.description}</p>
                <small>
                  {bestAttempt ? `${texts.best}: ${bestAttempt.score}/${bestAttempt.total}` : `${quiz.questions.length} ${texts.questions}`}
                </small>
              </div>
              <button onClick={() => void onPlay(quiz)} type="button">{texts.explore}</button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function getBestAttempt(attempts: Attempt[], quizId: string) {
  return attempts
    .filter((attempt) => attempt.quiz_id === quizId)
    .sort((first, second) => second.score - first.score)[0];
}
