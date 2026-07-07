import type { Texts } from '../lib/language';
import type { HostAnswer, HostParticipant, Quiz } from '../lib/quizTypes';
import { buildHostLeaderboard } from '../lib/hostLeaderboard';

type HostLeaderboardProps = {
  answers: HostAnswer[];
  participants: HostParticipant[];
  quiz: Quiz;
  texts: Texts;
};

export function HostLeaderboard({ answers, participants, quiz, texts }: HostLeaderboardProps) {
  const rows = buildHostLeaderboard(participants, answers, quiz);
  const podiumRows = [rows[1], rows[0], rows[2]].filter(Boolean);
  const otherRows = rows.slice(3);

  if (rows.length === 0) {
    return <p className="empty">{texts.leaderboardEmpty}</p>;
  }

  return (
    <div className="host-leaderboard">
      <div className="podium" aria-label="Top players">
        {podiumRows.map((row) => {
          const place = rows.indexOf(row) + 1;
          return (
            <article className={`podium-place podium-place-${place}`} key={row.participant.id}>
              <span className="podium-medal">#{place}</span>
              <strong>{row.participant.player_name}</strong>
              <p>{row.score}/{quiz.questions.length}</p>
              <div className="podium-block" />
            </article>
          );
        })}
      </div>
      {otherRows.length > 0 ? (
        <ol className="prize-board">
          {otherRows.map((row, index) => (
            <li key={row.participant.id}>
              <span className="place-badge">#{index + 4}</span>
              <span>{row.participant.player_name}</span>
              <strong>{row.score}/{quiz.questions.length}</strong>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
