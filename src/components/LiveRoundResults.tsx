import type { Texts } from '../lib/language';
import type { HostAnswer, HostParticipant, QuizQuestion } from '../lib/quizTypes';

type LiveRoundResultsProps = {
  answers: HostAnswer[];
  participants: HostParticipant[];
  question: QuizQuestion;
  questionIndex: number;
  texts: Texts;
};

export function LiveRoundResults({
  answers,
  participants,
  question,
  questionIndex,
  texts,
}: LiveRoundResultsProps) {
  return (
    <section className="panel stack">
      <div>
        <p className="eyebrow">{texts.roundResults}</p>
        <h2>{texts.correctAnswer}: {question.options[question.correctIndex]}</h2>
      </div>
      <ol className="prize-board">
        {participants.map((participant) => {
          const answer = answers.find((item) => (
            item.participant_id === participant.id &&
            item.question_index === questionIndex
          ));
          return (
            <li key={participant.id}>
              <span className="place-badge">{answer?.is_correct ? texts.correct : texts.wrong}</span>
              <span>{participant.player_name}</span>
              <strong>{answer ? question.options[answer.answer_index] : texts.noAnswer}</strong>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
