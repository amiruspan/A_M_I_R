import { useEffect, useRef, useState } from 'react';
import { PrizeBoard } from './PrizeBoard';
import { QuizResultStats } from './QuizResultStats';
import type { Attempt, Quiz } from '../lib/quizTypes';

type QuizPlayerProps = {
  attempts: Attempt[];
  initialAnswers: number[];
  onClose: () => void;
  onFinish: (score: number, total: number) => Promise<void>;
  onProgress: (answers: number[]) => Promise<void>;
  quiz: Quiz;
  rewardPerCorrectAnswer: number;
};

const skippedAnswer = -1;

export function QuizPlayer({
  attempts,
  initialAnswers,
  onClose,
  onFinish,
  onProgress,
  quiz,
  rewardPerCorrectAnswer,
}: QuizPlayerProps) {
  const [answers, setAnswers] = useState<number[]>(initialAnswers);
  const answersRef = useRef<number[]>(initialAnswers);
  const currentIndexRef = useRef(0);
  const finishingRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(() => {
    const firstOpenIndex = quiz.questions.findIndex((_, index) => initialAnswers[index] === undefined);
    const nextIndex = firstOpenIndex === -1 ? 0 : firstOpenIndex;
    currentIndexRef.current = nextIndex;
    return nextIndex;
  });
  const [finished, setFinished] = useState(false);
  const [failedHardcore, setFailedHardcore] = useState(false);
  const questionSeconds = getQuestionSeconds(quiz.game_mode);
  const [secondsLeft, setSecondsLeft] = useState(questionSeconds);
  const score = getScore(quiz, answers);
  const currentQuestion = quiz.questions[currentIndex];
  const hasTimer = questionSeconds > 0;
  const mistakeIsFatal = quiz.game_mode === 'hardcore' || quiz.game_mode === 'final_boss';

  useEffect(() => {
    if (finished || !currentQuestion) return;
    setSecondsLeft(questionSeconds);
    if (!hasTimer) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current > 1) return current - 1;
        window.clearInterval(timer);
        return 0;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [currentIndex, finished, currentQuestion, hasTimer, questionSeconds]);

  useEffect(() => {
    if (!hasTimer || finished || finishingRef.current || secondsLeft !== 0) return;
    markQuestionWrong(currentIndexRef.current);
  }, [finished, hasTimer, secondsLeft]);

  function choose(answerIndex: number) {
    if (finished || finishingRef.current || !currentQuestion) return;
    const questionIndex = currentIndexRef.current;
    const next = [...answersRef.current];
    next[questionIndex] = answerIndex;
    answersRef.current = next;
    setAnswers(next);
    void onProgress(next);
    if (mistakeIsFatal && answerIndex !== currentQuestion.correctIndex) {
      void finish(next, true);
      return;
    }
    goNext(next, questionIndex);
  }

  function markQuestionWrong(questionIndex: number) {
    if (finished || finishingRef.current || answersRef.current[questionIndex] !== undefined) return;
    const next = [...answersRef.current];
    next[questionIndex] = skippedAnswer;
    answersRef.current = next;
    setAnswers(next);
    void onProgress(next);
    if (mistakeIsFatal) {
      void finish(next, true);
      return;
    }
    goNext(next, questionIndex);
  }

  function goNext(nextAnswers: number[], questionIndex: number) {
    if (questionIndex + 1 < quiz.questions.length) {
      const nextIndex = questionIndex + 1;
      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
      return;
    }
    void finish(nextAnswers);
  }

  async function finish(finalAnswers: number[], failed = false) {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setFailedHardcore(failed);
    setFinished(true);
    try {
      await onFinish(getScore(quiz, finalAnswers), quiz.questions.length);
    } catch {
      // The result screen should not freeze if saving the attempt fails.
    }
  }

  return (
    <section className="player">
      <div className="player-header">
        <div>
          <p className="eyebrow">Playing</p>
          <h2>{quiz.title}</h2>
          <p className="message">{getModeDescription(quiz.game_mode)}</p>
        </div>
        <button className="secondary-button" onClick={onClose} type="button">Close</button>
      </div>

      {!finished && currentQuestion ? (
        <div className="question-card" key={`${currentQuestion.text}-${currentIndex}`}>
          <div className="question-meta">
            <span>Question {currentIndex + 1} / {quiz.questions.length}</span>
            <span>{hasTimer ? `${secondsLeft}s` : 'No timer'}</span>
          </div>
          {hasTimer ? (
            <div className="timer-track" aria-hidden="true">
              <div style={{ width: `${(secondsLeft / questionSeconds) * 100}%` }} />
            </div>
          ) : null}
          <h3>{currentQuestion.text}</h3>
          <div className="answer-grid">
            {currentQuestion.options.map((option, answerIndex) => (
              <button
                className={answers[currentIndex] === answerIndex ? 'answer active' : 'answer'}
                key={`${option}-${answerIndex}`}
                onClick={() => choose(answerIndex)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {finished ? (
        <div className="stack">
          <QuizResultStats
            answers={answers}
            failedHardcore={failedHardcore}
            onClose={onClose}
            quiz={quiz}
            score={score}
          />
          <section className="panel">
            <p className="eyebrow">Reward</p>
            <h2>+{score * rewardPerCorrectAnswer} coins</h2>
            <p className="message">{rewardPerCorrectAnswer} coins for each correct answer.</p>
          </section>
          <section className="panel stack">
            <h2>Prize places</h2>
            <PrizeBoard attempts={attempts} quizId={quiz.id} />
          </section>
        </div>
      ) : null}
    </section>
  );
}

function getScore(quiz: Quiz, answers: number[]) {
  return quiz.questions.reduce((sum, question, index) => (
    answers[index] === question.correctIndex ? sum + 1 : sum
  ), 0);
}

function getQuestionSeconds(mode: Quiz['game_mode']) {
  if (mode === 'practice') return 0;
  if (mode === 'blitz') return 8;
  if (mode === 'final_boss') return 10;
  return 20;
}

function getModeDescription(mode: Quiz['game_mode']) {
  if (mode === 'hardcore') return 'Hardcore: one mistake ends the run.';
  if (mode === 'blitz') return 'Blitz: only 8 seconds for each question.';
  if (mode === 'practice') return 'Practice: no timer, learn calmly.';
  if (mode === 'final_boss') return 'Final Boss: 10 seconds and one mistake ends the run.';
  return 'Normal mode: answer all questions before time runs out.';
}
