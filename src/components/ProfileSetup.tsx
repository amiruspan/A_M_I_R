import { useState } from 'react';
import type { Texts } from '../lib/language';

type ProfileSetupProps = {
  email: string;
  currentDisplayName: string;
  onSave: (displayName: string) => Promise<void>;
  texts: Texts;
};

export function ProfileSetup({ currentDisplayName, email, onSave, texts }: ProfileSetupProps) {
  const [name, setName] = useState(currentDisplayName || email.split('@')[0] || 'Player');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    await onSave(name.trim() || 'Player');
    setBusy(false);
  }

  return (
    <section className="panel">
      <form className="stack" onSubmit={handleSubmit}>
        <p className="eyebrow">{texts.profile}</p>
        <h2>{texts.yourNickname}</h2>
        <input
          maxLength={18}
          onChange={(event) => setName(event.target.value)}
          placeholder={texts.yourNickname}
          value={name}
        />
        <button disabled={busy} type="submit">{texts.saveProfile}</button>
      </form>
    </section>
  );
}
