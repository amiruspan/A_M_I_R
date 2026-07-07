import type { Texts } from '../lib/language';
import type { Attempt, GameMode, Quiz, QuizQuestion } from '../lib/quizTypes';
import { QuizForm } from './QuizForm';
import { QuizList } from './QuizList';

type PublishPageProps = {
  attempts: Attempt[];
  currentUserId: string;
  onCreate: (
    title: string,
    description: string,
    gameMode: GameMode,
    questions: QuizQuestion[],
  ) => Promise<void>;
  onHost: (quiz: Quiz) => Promise<void>;
  onPlay: (quiz: Quiz) => Promise<void>;
  quizzes: Quiz[];
  texts: Texts;
};

export function PublishPage({ attempts, currentUserId, onCreate, onHost, onPlay, quizzes, texts }: PublishPageProps) {
  const ownQuizzes = quizzes.filter((quiz) => quiz.user_id === currentUserId);

  return (
    <div className="stack">
      <QuizForm onCreate={onCreate} texts={texts} />
      <section className="panel stack">
        <h2>{texts.publish}</h2>
        <QuizList
          attempts={attempts}
          currentUserId={currentUserId}
          onHost={onHost}
          onPlay={onPlay}
          quizzes={ownQuizzes}
          texts={texts}
        />
      </section>
    </div>
  );
}
