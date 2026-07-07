import { useEffect, useMemo, useState } from 'react';
import { HostLeaderboard } from './HostLeaderboard';
import { LiveRoundResults } from './LiveRoundResults';
import type { HostAnswer, HostParticipant, HostSession, Quiz } from '../lib/quizTypes';

type LiveQuizPlayerProps = {
  loadAnswers: (sessionId: string) => Promise<HostAnswer[]>;
  loadParticipants: (sessionId: string) => Promise<HostParticipant[]>;
  loadSession: (sessionId: string) => Promise<HostSession | null>;
  onAnswer: (questionIndex: number, answerIndex: number, isCorrect: boolean) => Promise<void>;
  onClose: () => void;
  participant: HostParticipant;
  quiz: Quiz;
  session: HostSession;
};

export function LiveQuizPlayer({
  loadAnswers,
  loadParticipants,
  loadSession,
  onAnswer,
  onClose,
  participant,
  quiz,
  session,
}: LiveQuizPlayerProps) {
  const [liveSession, setLiveSession] = useState(session);
  const [participants, setParticipants] = useState<HostParticipant[]>([]);
  const [answers, setAnswers] = useState<HostAnswer[]>([]);
  const currentQuestion = quiz.questions[liveSession.current_question_index];
  const answeredCount = answers.filter((answer) =>
    answer.question_index === liveSession.current_question_index,
  ).length;
  const allAnswered = participants.length > 0 && answeredCount >= participants.length;
  const myAnswer = useMemo(() => answers.find((answer) => (
    answer.participant_id === participant.id &&
    answer.question_index === liveSession.current_question_index
  )), [answers, liveSession.current_question_index, participant.id]);

  useEffect(() => {
    let alive = true;

    async function refresh() {
      const [nextSession, nextParticipants, nextAnswers] = await Promise.all([
        loadSession(session.id),
        loadParticipants(session.id),
        loadAnswers(session.id),
      ]);
      if (!alive) return;
      if (nextSession) setLiveSession(nextSession);
      setParticipants(nextParticipants);
      setAnswers(nextAnswers);
    }

    void refresh();
    const timer = window.setInterval(() => void refresh(), 1200);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, [loadAnswers, loadParticipants, loadSession, session.id]);

  async function choose(answerIndex: number) {
    if (!currentQuestion || myAnswer || liveSession.status !== 'playing') return;
    await onAnswer(
      liveSession.current_question_index,
      answerIndex,
      answerIndex === currentQuestion.correctIndex,
    );
    setAnswers(await loadAnswers(session.id));
  }

  return (
    <section className="player">
      <div className="player-header">
        <div>
          <p className="eyebrow">Live game</p>
          <h2>{quiz.title}</h2>
          <p className="message">You joined as {participant.player_name}</p>
        </div>
        <button className="secondary-button" onClick={onClose} type="button">Close</button>
      </div>

      {liveSession.status === 'lobby' ? (
        <section className="panel stack">
          <h2>Waiting for the host to start</h2>
          <p className="message">{participants.length} players are in the room.</p>
        </section>
      ) : null}

      {liveSession.status === 'playing' && currentQuestion && !myAnswer ? (
        <div className="question-card">
          <div className="question-meta">
            <span>Question {liveSession.current_question_index + 1} / {quiz.questions.length}</span>
            <span>Choose an answer</span>
          </div>
          <h3>{currentQuestion.text}</h3>
          <div className="answer-grid">
            {currentQuestion.options.map((option, answerIndex) => (
              <button
                className="answer"
                disabled={!!myAnswer}
                key={`${option}-${answerIndex}`}
                onClick={() => void choose(answerIndex)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {liveSession.status === 'playing' && currentQuestion && myAnswer && !allAnswered ? (
        <section className="panel stack">
          <div>
            <p className="eyebrow">Answer saved</p>
            <h2>Waiting for everyone</h2>
          </div>
          <p className="message">{answeredCount} / {participants.length} players answered.</p>
        </section>
      ) : null}

      {liveSession.status === 'playing' && currentQuestion && myAnswer && allAnswered ? (
        <LiveRoundResults
          answers={answers}
          participants={participants}
          question={currentQuestion}
          questionIndex={liveSession.current_question_index}
        />
      ) : null}

      {liveSession.status === 'finished' ? (
        <section className="panel stack">
          <div>
            <p className="eyebrow">Final leaderboard</p>
            <h2>Results</h2>
          </div>
          <HostLeaderboard answers={answers} participants={participants} quiz={quiz} />
        </section>
      ) : null}
    </section>
  );
}
