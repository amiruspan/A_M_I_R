import { useEffect, useRef, useState } from 'react';
import type { Quiz } from '../lib/quizTypes';
import { playLoseSound, playWinSound } from '../lib/quizSounds';
import { getSkin } from '../lib/skinCatalog';
import { getQuestionSeconds, getScore, skippedAnswer } from '../lib/quizPlayerRules';

type UseQuizPlayerStateParams = {
  activeSkinId: string;
  initialAnswers: number[];
  onFinish: (score: number, total: number) => Promise<void>;
  onProgress: (answers: number[]) => Promise<void>;
  quiz: Quiz;
};

export function useQuizPlayerState({
  activeSkinId,
  initialAnswers,
  onFinish,
  onProgress,
  quiz,
}: UseQuizPlayerStateParams) {
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
  const [abilityUsed, setAbilityUsed] = useState(false);
  const [removedAnswers, setRemovedAnswers] = useState<Record<number, number>>({});
  const questionSeconds = getQuestionSeconds(quiz.game_mode);
  const [secondsLeft, setSecondsLeft] = useState(questionSeconds);
  const currentQuestion = quiz.questions[currentIndex];
  const hasTimer = questionSeconds > 0;
  const mistakeIsFatal = quiz.game_mode === 'hardcore' || quiz.game_mode === 'final_boss';
  const activeSkin = getSkin(activeSkinId);
  const skinAbility = activeSkin.ability;
  const removedAnswer = removedAnswers[currentIndex];

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
    if (finished || finishingRef.current || !currentQuestion || removedAnswer === answerIndex) return;
    const questionIndex = currentIndexRef.current;
    const next = [...answersRef.current];
    next[questionIndex] = answerIndex;
    saveAnswers(next);
    if (answerIndex !== currentQuestion.correctIndex) playLoseSound();
    if (mistakeIsFatal && answerIndex !== currentQuestion.correctIndex) {
      void finish(next, true);
      return;
    }
    goNext(next, questionIndex);
  }

  function useSkinAbility() {
    if (!currentQuestion || abilityUsed || skinAbility?.id !== 'remove_wrong_answer') return;
    const wrongIndexes = currentQuestion.options
      .map((_, index) => index)
      .filter((index) => index !== currentQuestion.correctIndex);
    const answerIndex = wrongIndexes[Math.floor(Math.random() * wrongIndexes.length)];
    setRemovedAnswers((current) => ({ ...current, [currentIndexRef.current]: answerIndex }));
    setAbilityUsed(true);
  }

  function markQuestionWrong(questionIndex: number) {
    if (finished || finishingRef.current || answersRef.current[questionIndex] !== undefined) return;
    const next = [...answersRef.current];
    next[questionIndex] = skippedAnswer;
    saveAnswers(next);
    playLoseSound();
    if (mistakeIsFatal) {
      void finish(next, true);
      return;
    }
    goNext(next, questionIndex);
  }

  function saveAnswers(next: number[]) {
    answersRef.current = next;
    setAnswers(next);
    void onProgress(next);
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
    if (!failed && getScore(quiz, finalAnswers) === quiz.questions.length) playWinSound();
    try {
      await onFinish(getScore(quiz, finalAnswers), quiz.questions.length);
    } catch {
      // The result screen should not freeze if saving the attempt fails.
    }
  }

  return {
    abilityUsed,
    answers,
    choose,
    currentIndex,
    currentQuestion,
    failedHardcore,
    finished,
    hasTimer,
    questionSeconds,
    removedAnswer,
    score: getScore(quiz, answers),
    secondsLeft,
    skinName: activeSkin.name,
    skinAbility,
    useSkinAbility,
  };
}
