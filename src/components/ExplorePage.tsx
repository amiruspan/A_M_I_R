import type { Attempt, Quiz } from '../lib/quizTypes';
import { JoinQuizCard } from './JoinQuizCard';
import { QuizList } from './QuizList';
import { ResultsPanel } from './ResultsPanel';

type ExplorePageProps = {
  attempts: Attempt[];
  currentUserId: string;
  onJoin: (code: string) => Promise<void>;
  onPlay: (quiz: Quiz) => Promise<void>;
  quizzes: Quiz[];
};

export function ExplorePage({ attempts, currentUserId, onJoin, onPlay, quizzes }: ExplorePageProps) {
  return (
    <section className="workspace">
      <div className="stack">
        <JoinQuizCard onJoin={onJoin} />
        <section className="panel stack">
          <h2>Quiz library</h2>
          <QuizList
            attempts={attempts}
            currentUserId={currentUserId}
            onPlay={onPlay}
            quizzes={quizzes}
          />
        </section>
      </div>
      <ResultsPanel attempts={attempts} quizzes={quizzes} />
    </section>
  );
}
