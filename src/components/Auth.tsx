import { useState } from 'react';
import type { LocalUser } from '../lib/quizTypes';
import { continueAsGuest, createAccount, signIn } from '../lib/userStore';

type AuthProps = {
  onAuth: (user: LocalUser) => void;
};

export function Auth({ onAuth }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const user =
        mode === 'signup'
          ? await createAccount(email.trim(), password)
          : await signIn(email.trim(), password);
      onAuth(user);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  function handleGuestEnter() {
    setBusy(true);
    setMessage('');
    try {
      onAuth(continueAsGuest());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not enter guest mode.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-screen">
      <div className="auth-card">
        <p className="eyebrow">QuizRoom</p>
        <h1>{mode === 'signin' ? 'Sign in' : 'Create account'}</h1>
        <form className="stack" onSubmit={handleSubmit}>
          <input
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email"
            required
            type="email"
            value={email}
          />
          <input
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="password"
            required
            type="password"
            value={password}
          />
          <button disabled={busy} type="submit">
            {busy ? 'Loading...' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
        <button className="link-button" onClick={handleGuestEnter} type="button">
          Continue as guest
        </button>
        <button
          className="link-button"
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          type="button"
        >
          {mode === 'signin' ? 'I need an account' : 'I already have an account'}
        </button>
      </div>
    </section>
  );
}
