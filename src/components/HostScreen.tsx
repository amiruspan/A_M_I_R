import { useEffect, useState } from 'react';
import type { HostParticipant, HostSession, Quiz } from '../lib/quizTypes';

type HostScreenProps = {
  loadParticipants: (sessionId: string) => Promise<HostParticipant[]>;
  onClose: () => Promise<void>;
  quiz: Quiz;
  session: HostSession;
};

export function HostScreen({ loadParticipants, onClose, quiz, session }: HostScreenProps) {
  const [participants, setParticipants] = useState<HostParticipant[]>([]);
  const [copied, setCopied] = useState(false);
  const joinLink = `${window.location.origin}${window.location.pathname}?code=${session.join_code}`;

  useEffect(() => {
    let alive = true;

    async function refreshParticipants() {
      const nextParticipants = await loadParticipants(session.id);
      if (alive) setParticipants(nextParticipants);
    }

    void refreshParticipants();
    const timer = window.setInterval(() => void refreshParticipants(), 2000);

    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, [loadParticipants, session.id]);

  async function copyJoinLink() {
    await navigator.clipboard.writeText(joinLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
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

      <div className="host-code-panel">
        <span>Join code</span>
        <strong>{session.join_code}</strong>
        <button onClick={() => void copyJoinLink()} type="button">
          {copied ? 'Copied' : 'Copy join link'}
        </button>
      </div>

      <section className="host-players">
        <div>
          <p className="eyebrow">Players joined</p>
          <h2>{participants.length} players</h2>
        </div>
        {participants.length === 0 ? (
          <p className="empty">Waiting for players to enter the code.</p>
        ) : (
          <ul className="host-player-grid">
            {participants.map((participant) => (
              <li key={participant.id}>{participant.player_name}</li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
