import { useState } from 'react';
import type { Texts } from '../lib/language';
import { generateQuizDraft, type AiQuizDraft } from '../lib/aiQuiz';

type AiQuizGeneratorProps = {
  onGenerated: (draft: AiQuizDraft) => void;
  texts: Texts;
};

const questionCounts = [4, 6, 8];

export function AiQuizGenerator({ onGenerated, texts }: AiQuizGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(4);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleGenerate() {
    if (!topic.trim()) return;
    setBusy(true);
    setError('');
    try {
      const draft = await generateQuizDraft(topic.trim(), questionCount);
      onGenerated(draft);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : texts.couldNotGenerateQuiz);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="ai-generator stack">
      <div>
        <p className="eyebrow">{texts.aiHelper}</p>
        <h3>{texts.generateQuizDraft}</h3>
      </div>
      <input
        disabled={busy}
        onChange={(event) => setTopic(event.target.value)}
        placeholder={texts.topicPlaceholder}
        value={topic}
      />
      <div className="button-row">
        {questionCounts.map((count) => (
          <button
            className={questionCount === count ? 'active secondary-button' : 'secondary-button'}
            disabled={busy}
            key={count}
            onClick={() => setQuestionCount(count)}
            type="button"
          >
            {count} {texts.questions}
          </button>
        ))}
      </div>
      {error && <p className="message">{error}</p>}
      <button disabled={busy || !topic.trim()} onClick={handleGenerate} type="button">
        {busy ? texts.generating : texts.generateWithAi}
      </button>
    </section>
  );
}
