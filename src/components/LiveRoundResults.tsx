import type { HostAnswer, HostParticipant, QuizQuestion } from '../lib/quizTypes';

type LiveRoundResultsProps = {
  answers: HostAnswer[];
  participants: HostParticipant[];
  question: QuizQuestion;
  questionIndex: number;
};

export function LiveRoundResults({
  answers,
  participants,
  question,
  questionIndex,
}: LiveRoundResultsProps) {
  return (
    <section className="panel stack">
      <div>
        <p className="eyebrow">Round results</p>
        <h2>Correct answer: {question.options[question.correctIndex]}</h2>
      </div>
      <ol className="prize-board">
        {participants.map((participant) => {
          const answer = answers.find((item) => (
            item.participant_id === participant.id &&
            item.question_index === questionIndex
          ));
          return (
            <li key={participant.id}>
              <span className="place-badge">{answer?.is_correct ? 'Correct' : 'Wrong'}</span>
              <span>{participant.player_name}</span>
              <strong>{answer ? question.options[answer.answer_index] : 'No answer'}</strong>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
