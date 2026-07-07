import { useEffect, useState } from 'react';
import { HostLeaderboard } from './HostLeaderboard';
import { LiveRoundResults } from './LiveRoundResults';
import type { HostAnswer, HostParticipant, HostSession, Quiz } from '../lib/quizTypes';
import { countQuestionAnswers, getHostTitle } from '../lib/hostLeaderboard';

type HostScreenProps = {
  loadAnswers: (sessionId: string) => Promise<HostAnswer[]>;
  loadParticipants: (sessionId: string) => Promise<HostParticipant[]>;
  loadSession: (sessionId: string) => Promise<HostSession | null>;
  onClose: () => Promise<void>;
  onFinish: () => Promise<void>;
  onNextQuestion: (questionIndex: number) => Promise<void>;
  onStart: () => Promise<void>;
  quiz: Quiz;
  session: HostSession;
};

export function HostScreen({
  loadAnswers,
  loadParticipants,
  loadSession,
  onClose,
  onFinish,
  onNextQuestion,
  onStart,
  quiz,
  session,
}: HostScreenProps) {
  const [liveSession, setLiveSession] = useState(session);
  const [participants, setParticipants] = useState<HostParticipant[]>([]);
  const [answers, setAnswers] = useState<HostAnswer[]>([]);
  const [copied, setCopied] = useState(false);
  const joinLink = `${window.location.origin}${window.location.pathname}?code=${session.join_code}`;
  const answeredCount = countQuestionAnswers(answers, liveSession.current_question_index);
  const allAnswered = participants.length > 0 && answeredCount >= participants.length;
  const isLastQuestion = liveSession.current_question_index + 1 >= quiz.questions.length;
  const currentQuestion = quiz.questions[liveSession.current_question_index];

  useEffect(() => {
    let alive = true;

    async function refreshLiveState() {
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

    void refreshLiveState();
    const timer = window.setInterval(() => void refreshLiveState(), 1200);

    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, [loadAnswers, loadParticipants, loadSession, session.id]);

  async function copyJoinLink() {
    await navigator.clipboard.writeText(joinLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function handleNext() {
    if (!allAnswered) return;
    if (isLastQuestion) {
      await onFinish();
      setLiveSession({ ...liveSession, status: 'finished', finished_at: new Date().toISOString() });
      return;
    }
    const nextIndex = liveSession.current_question_index + 1;
    await onNextQuestion(nextIndex);
    setLiveSession({ ...liveSession, current_question_index: nextIndex });
  }

  return (
    <section className="host-screen">
      <header className="host-topbar">
        <div>
          <p className="eyebrow">Live host</p>
          <h1>{quiz.title}</h1>
        </div>
        <button className="secondary-button" onClick={() => void onClose()} type="button">
          End host
        </button>
      </header>

      {liveSession.status === 'lobby' ? (
        <div className="host-code-panel">
          <span>Join code</span>
          <strong>{session.join_code}</strong>
          <button onClick={() => void copyJoinLink()} type="button">
            {copied ? 'Copied' : 'Copy join link'}
          </button>
        </div>
      ) : null}

      <section className={liveSession.status === 'lobby' ? 'host-players host-lobby' : 'host-players'}>
        <div>
          <p className="eyebrow">{liveSession.status === 'lobby' ? 'Players joined' : 'Live round'}</p>
          <h2>{getHostTitle(liveSession, quiz.questions.length)}</h2>
        </div>
        {liveSession.status === 'lobby' && participants.length === 0 ? (
          <p className="empty">Waiting for players to enter the code.</p>
        ) : null}
        {liveSession.status === 'lobby' && participants.length > 0 ? (
          <ul className="host-player-grid">
            {participants.map((participant) => (
              <li key={participant.id}>{participant.player_name}</li>
            ))}
          </ul>
        ) : null}
        {liveSession.status === 'lobby' ? (
          <button disabled={participants.length === 0} onClick={() => void onStart()} type="button">
            Start game
          </button>
        ) : null}
        {liveSession.status === 'playing' ? (
          <div className="stack">
            <p className="message">{answeredCount} / {participants.length} players answered.</p>
            {allAnswered && currentQuestion ? (
              <LiveRoundResults
                answers={answers}
                participants={participants}
                question={currentQuestion}
                questionIndex={liveSession.current_question_index}
              />
            ) : null}
            <button disabled={!allAnswered} onClick={() => void handleNext()} type="button">
              {isLastQuestion ? 'Show leaderboard' : 'Next question'}
            </button>
          </div>
        ) : null}
        {liveSession.status === 'finished' ? (
          <HostLeaderboard answers={answers} participants={participants} quiz={quiz} />
        ) : null}
      </section>
    </section>
  );
}
