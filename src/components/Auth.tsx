import { useState } from 'react';
import type { LocalUser } from '../lib/quizTypes';
import { continueAsGuest, createAccount, signIn, signInWithGoogle } from '../lib/userStore';

type AuthMode = 'login' | 'signup';

type AuthProps = {
  onAuth: (user: LocalUser) => void;
  onBack: () => void;
};

export function Auth({ onAuth, onBack }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>('login');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const isSignup = mode === 'signup';

  function getAuthErrorMessage(error: unknown, fallback: string) {
    if (!(error instanceof Error)) return fallback;
    const cleanMessage = error.message.toLowerCase();
    if (cleanMessage.includes('already registered') || cleanMessage.includes('already exists')) {
      return 'This email already has an account. Try logging in.';
    }
    if (cleanMessage.includes('invalid login credentials')) {
      return 'Wrong email or password.';
    }
    return error.message;
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setMessage('');
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const user = isSignup
        ? await createAccount(email.trim(), password)
        : await signIn(email.trim(), password);
      onAuth(user);
    } catch (error) {
      setMessage(getAuthErrorMessage(error, isSignup ? 'Could not create account.' : 'Could not log in.'));
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

  async function handleGoogleEnter() {
    setBusy(true);
    setMessage('');
    try {
      await signInWithGoogle();
    } catch (error) {
      setBusy(false);
      setMessage(error instanceof Error ? error.message : 'Could not sign in with Google.');
    }
  }

  return (
    <section className="auth-screen">
      <div className="auth-card">
        <button className="link-button auth-back-button" onClick={onBack} type="button">
          Back
        </button>
        <p className="eyebrow">QuizRoom</p>
        <h1>{isSignup ? 'Sign up' : 'Log in'}</h1>

        <div className="auth-tabs" aria-label="Auth mode">
          <button
            className={mode === 'login' ? 'active' : ''}
            disabled={busy}
            onClick={() => switchMode('login')}
            type="button"
          >
            Log in
          </button>
          <button
            className={mode === 'signup' ? 'active' : ''}
            disabled={busy}
            onClick={() => switchMode('signup')}
            type="button"
          >
            Sign up
          </button>
        </div>

        <form className="stack auth-form" onSubmit={handleSubmit}>
          <input
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            required
            type="email"
            value={email}
          />
          <input
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
            type="password"
            value={password}
          />
          <button disabled={busy} type="submit">
            {busy ? 'Loading...' : isSignup ? 'Create account' : 'Log in'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>
        <button className="google-button" disabled={busy} onClick={handleGoogleEnter} type="button">
          {busy ? 'Opening Google...' : 'Continue with Google'}
        </button>

        {message && <p className="message auth-message">{message}</p>}
        <button className="link-button full-button" disabled={busy} onClick={handleGuestEnter} type="button">
          Continue as guest
        </button>
      </div>
    </section>
  );
}
