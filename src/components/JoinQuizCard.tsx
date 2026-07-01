import { useState } from 'react';

type JoinQuizCardProps = {
  onJoin: (code: string) => Promise<void>;
};

export function JoinQuizCard({ onJoin }: JoinQuizCardProps) {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const cleanCode = code.trim();
    if (!cleanCode) return;
    setBusy(true);
    try {
      await onJoin(cleanCode);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel stack">
      <div>
        <p className="eyebrow">Join</p>
        <h2>Connect to quiz</h2>
      </div>
      <form className="join-form" onSubmit={handleSubmit}>
        <input
          autoCapitalize="characters"
          maxLength={8}
          onChange={(event) => setCode(event.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
          placeholder="Enter quiz code"
          value={code}
        />
        <button disabled={busy || !code.trim()} type="submit">
          Join
        </button>
      </form>
    </section>
  );
}
