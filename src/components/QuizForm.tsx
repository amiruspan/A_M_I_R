import { useState } from 'react';
import { AiQuizGenerator } from './AiQuizGenerator';
import type { AiQuizDraft } from '../lib/aiQuiz';
import type { GameMode, QuizQuestion } from '../lib/quizTypes';

type QuizFormProps = {
  onCreate: (
    title: string,
    description: string,
    gameMode: GameMode,
    questions: QuizQuestion[],
  ) => Promise<void>;
};

const starterQuestion: QuizQuestion = {
  text: '',
  options: ['', '', '', ''],
  correctIndex: 0,
};

function createStarterQuestions() {
  return Array.from({ length: 4 }, () => ({ ...starterQuestion, options: [...starterQuestion.options] }));
}

const gameModes: { id: GameMode; label: string }[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'hardcore', label: 'Hardcore' },
  { id: 'blitz', label: 'Blitz' },
  { id: 'practice', label: 'Practice' },
  { id: 'final_boss', label: 'Final Boss' },
];

export function QuizForm({ onCreate }: QuizFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gameMode, setGameMode] = useState<GameMode>('normal');
  const [questions, setQuestions] = useState<QuizQuestion[]>(createStarterQuestions);
  const [activeIndex, setActiveIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const activeQuestion = questions[activeIndex];

  function updateQuestion(nextQuestion: QuizQuestion) {
    setQuestions((current) =>
      current.map((question, index) => index === activeIndex ? nextQuestion : question),
    );
  }

  function updateOption(index: number, value: string) {
    updateQuestion({
      ...activeQuestion,
      options: activeQuestion.options.map((option, optionIndex) =>
        optionIndex === index ? value : option,
      ),
    });
  }

  function addQuestion() {
    setQuestions((current) => [...current, { ...starterQuestion, options: [...starterQuestion.options] }]);
    setActiveIndex(questions.length);
  }

  function removeQuestion() {
    if (questions.length === 1) return;
    setQuestions((current) => current.filter((_, index) => index !== activeIndex));
    setActiveIndex((current) => Math.max(0, current - 1));
  }

  function applyAiDraft(draft: AiQuizDraft) {
    setTitle(draft.title);
    setDescription(draft.description);
    setQuestions(draft.questions);
    setActiveIndex(0);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await onCreate(title.trim(), description.trim(), gameMode, questions);
      setTitle('');
      setDescription('');
      setGameMode('normal');
      setQuestions(createStarterQuestions());
      setActiveIndex(0);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="panel stack" onSubmit={handleSubmit}>
      <h2>Create quiz</h2>
      <AiQuizGenerator onGenerated={applyAiDraft} />
      <input onChange={(event) => setTitle(event.target.value)} placeholder="Quiz title" required value={title} />
      <input onChange={(event) => setDescription(event.target.value)} placeholder="Short description" value={description} />
      <div className="mode-grid">
        {gameModes.map((mode) => (
          <button
            className={gameMode === mode.id ? 'active' : ''}
            key={mode.id}
            onClick={() => setGameMode(mode.id)}
            type="button"
          >
            {mode.label}
          </button>
        ))}
      </div>
      <div className="question-tabs">
        {questions.map((_, index) => (
          <button className={activeIndex === index ? 'active' : ''} key={index} onClick={() => setActiveIndex(index)} type="button">
            Q{index + 1}
          </button>
        ))}
      </div>
      <input onChange={(event) => updateQuestion({ ...activeQuestion, text: event.target.value })} placeholder="Question" required value={activeQuestion.text} />
      {activeQuestion.options.map((option, index) => (
        <label className="option-row" key={index}>
          <input checked={activeQuestion.correctIndex === index} onChange={() => updateQuestion({ ...activeQuestion, correctIndex: index })} type="radio" />
          <input onChange={(event) => updateOption(index, event.target.value)} placeholder={`Answer ${index + 1}`} required value={option} />
        </label>
      ))}
      <div className="button-row">
        <button className="secondary-button" onClick={addQuestion} type="button">Add question</button>
        <button className="secondary-button" disabled={questions.length === 1} onClick={removeQuestion} type="button">Remove</button>
      </div>
      <button disabled={busy} type="submit">{busy ? 'Saving...' : 'Share quiz'}</button>
    </form>
  );
}
