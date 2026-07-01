import { useState } from 'react';

type ProfileSetupProps = {
  email: string;
  currentDisplayName: string;
  onSave: (displayName: string) => Promise<void>;
};

export function ProfileSetup({ currentDisplayName, email, onSave }: ProfileSetupProps) {
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
        <p className="eyebrow">Profile</p>
        <h2>Your nickname</h2>
        <input
          maxLength={18}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nickname"
          value={name}
        />
        <button disabled={busy} type="submit">Save profile</button>
      </form>
    </section>
  );
}
