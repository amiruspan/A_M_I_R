import { useMemo, useState } from 'react';
import type { Texts } from '../lib/language';
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
  texts: Texts;
};

export function ExplorePage({ attempts, currentUserId, onJoin, onPlay, quizzes, texts }: ExplorePageProps) {
  const [search, setSearch] = useState('');
  const visibleQuizzes = useMemo(() => (
    search.trim() ? filterQuizzes(quizzes, search) : getPopularQuizzes(quizzes, attempts)
  ), [attempts, quizzes, search]);

  return (
    <section className="workspace">
      <div className="stack">
        <JoinQuizCard onJoin={onJoin} texts={texts} />
        <section className="panel stack">
          <div>
            <h2>{texts.explore}</h2>
            <p className="message">{texts.welcomeOneText}</p>
          </div>
          <input
            onChange={(event) => setSearch(event.target.value)}
            placeholder={texts.search}
            value={search}
          />
          <QuizList
            attempts={attempts}
            currentUserId={currentUserId}
            onPlay={onPlay}
            quizzes={visibleQuizzes}
            texts={texts}
          />
        </section>
      </div>
      <ResultsPanel attempts={attempts} quizzes={quizzes} texts={texts} />
    </section>
  );
}

function filterQuizzes(quizzes: Quiz[], search: string) {
  const query = normalizeSearch(search);
  if (!query) return [];

  return quizzes.filter((quiz) => {
    const text = normalizeSearch([
      quiz.title,
      quiz.description,
      quiz.game_mode,
      ...quiz.questions.map((question) => question.text),
    ].join(' '));
    return query.split(' ').every((word: string) => text.includes(word));
  });
}

function getPopularQuizzes(quizzes: Quiz[], attempts: Attempt[]) {
  return [...quizzes]
    .sort((first, second) => getPopularity(second, attempts) - getPopularity(first, attempts))
    .slice(0, 4);
}

function getPopularity(quiz: Quiz, attempts: Attempt[]) {
  const plays = attempts.filter((attempt) => attempt.quiz_id === quiz.id).length;
  const featuredBoost = quiz.user_id === null ? 3 : 0;
  const hardModeBoost = quiz.game_mode === 'hardcore' || quiz.game_mode === 'final_boss' ? 1 : 0;
  return plays * 5 + featuredBoost + hardModeBoost;
}

function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .replace(/математика/g, 'math')
    .replace(/матеша/g, 'math')
    .replace(/алгебра/g, 'math')
    .replace(/геометрия/g, 'math')
    .replace(/кодинг/g, 'coding')
    .replace(/программирование/g, 'coding')
    .replace(/спорт/g, 'sport')
    .replace(/наука/g, 'science')
    .replace(/сложный/g, 'hardcore')
    .replace(/сложные/g, 'hardcore')
    .trim();
}
