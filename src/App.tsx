import { useEffect, useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { Auth } from './components/Auth';
import { ExplorePage } from './components/ExplorePage';
import { HostScreen } from './components/HostScreen';
import { ProfileSetup } from './components/ProfileSetup';
import { PublishPage } from './components/PublishPage';
import { ProfileStats } from './components/ProfileStats';
import { QuizPlayer } from './components/QuizPlayer';
import { SkinShop } from './components/SkinShop';
import { WelcomeScreen } from './components/WelcomeScreen';
import type { Attempt, GameMode, HostSession, LocalUser, Quiz, QuizQuestion } from './lib/quizTypes';
import {
  endHostSession as endRemoteHostSession,
  joinHostSession as joinRemoteHostSession,
  loadActiveHostByCode as loadRemoteActiveHostByCode,
  loadHostParticipants as loadRemoteHostParticipants,
  startHostSession as startRemoteHostSession,
} from './lib/hostStore';
import {
  clearProgress as clearRemoteProgress,
  createQuiz as createRemoteQuiz,
  loadQuizByCode as loadRemoteQuizByCode,
  loadProgress as loadRemoteProgress,
  loadAttempts as loadRemoteAttempts,
  loadQuizzes as loadRemoteQuizzes,
  saveAttempt as saveRemoteAttempt,
  saveProgress as saveRemoteProgress,
} from './lib/quizStore';
import {
  loadQuizzes as loadGuestQuizzes,
  loadAttempts as loadGuestAttempts,
  createQuiz as createGuestQuiz,
  saveAttempt as saveGuestAttempt,
  loadProgress as loadGuestProgress,
  saveProgress as saveGuestProgress,
  clearProgress as clearGuestProgress,
} from './lib/localQuizStore';
import {
  endHostSession as endGuestHostSession,
  joinHostSession as joinGuestHostSession,
  loadActiveHostByQuiz as loadGuestActiveHostByQuiz,
  loadHostParticipants as loadGuestHostParticipants,
  startHostSession as startGuestHostSession,
} from './lib/localHostStore';
import {
  awardQuizRewards,
  buyNameFrame,
  buySkin,
  claimDailyBonus,
  equipNameFrame,
  equipSkin,
  openNameFramePack,
} from './lib/profileEconomy';
import { openSkinPack } from './lib/profileEconomy';
import { xpPerCorrectAnswer, xpPerQuizComplete } from './lib/profileProgress';
import { getCurrentUser, isGuestUser, saveGuestProfile, saveProfile, signOut } from './lib/userStore';
import type { NameFrame } from './lib/nameFrameCatalog';
import type { Skin } from './lib/skinCatalog';
import { findFeaturedQuizByCode, mergeFeaturedQuizzes } from './lib/featuredQuizzes';

const coinsPerCorrectAnswer = 10;
const welcomeSeenKey = 'quizroom_welcome_seen';

type PackResult = {
  skin: Skin;
  duplicateRefund: number;
};

type FramePackResult = {
  frame: NameFrame;
  duplicateRefund: number;
};

type ActiveHost = {
  quiz: Quiz;
  session: HostSession;
};

export default function App() {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activeAnswers, setActiveAnswers] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<'publish' | 'explore' | 'shop' | 'profile'>('explore');
  const [packResult, setPackResult] = useState<PackResult | null>(null);
  const [frameResult, setFrameResult] = useState<FramePackResult | null>(null);
  const [activeHost, setActiveHost] = useState<ActiveHost | null>(null);
  const [autoJoinCode, setAutoJoinCode] = useState(() => readJoinCodeFromUrl());
  const [autoJoinStarted, setAutoJoinStarted] = useState(false);
  const [welcomeSeen, setWelcomeSeen] = useState(() => (
    localStorage.getItem(welcomeSeenKey) === 'true'
  ));

  async function refresh(nextUser: LocalUser | null = user) {
    if (isGuestUser(nextUser)) {
      const remoteQuizzes = await loadRemoteQuizzes().catch(() => []);
      setQuizzes(mergeFeaturedQuizzes([...loadGuestQuizzes(), ...remoteQuizzes]));
      setAttempts(loadGuestAttempts());
      return;
    }

    const [nextQuizzes, nextAttempts] = await Promise.all([
      loadRemoteQuizzes().catch(() => []),
      loadRemoteAttempts().catch(() => []),
    ]);
    setQuizzes(mergeFeaturedQuizzes(nextQuizzes));
    setAttempts(nextAttempts);
  }

  useEffect(() => {
    async function boot() {
      try {
        const nextUser = await getCurrentUser();
        setUser(nextUser);
        await refresh(nextUser);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Could not load progress.');
      } finally {
        setLoading(false);
      }
    }

    void boot();
  }, []);

  async function handleProfile(displayName: string) {
    if (!user) return;
    if (isGuestUser(user)) {
      setUser(saveGuestProfile(user, user.role, displayName));
      return;
    }
    setUser(await saveProfile(user.user_id, user.role, displayName));
  }

  async function handleAuth(nextUser: LocalUser) {
    setUser(nextUser);
    await refresh(nextUser);
  }

  async function handleDailyBonus() {
    if (!user) return;
    try {
      setUser(await claimDailyBonus(user));
      setMessage('Daily bonus claimed.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not claim daily bonus.');
    }
  }

  async function handleCreate(
    title: string,
    description: string,
    gameMode: GameMode,
    questions: QuizQuestion[],
  ) {
    if (!user) return;
    try {
      if (isGuestUser(user)) {
        const createdQuiz = createGuestQuiz(user.user_id, title, description, gameMode, questions);
        setQuizzes((current) => [createdQuiz, ...current.filter((quiz) => quiz.id !== createdQuiz.id)]);
        await refresh(user);
        setMessage('Quiz saved.');
        return;
      }
      const createdQuiz = await createRemoteQuiz(user.user_id, title, description, gameMode, questions);
      setQuizzes((current) => [createdQuiz, ...current.filter((quiz) => quiz.id !== createdQuiz.id)]);
      await refresh(user);
      setMessage('Quiz saved.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save quiz.');
    }
  }

  async function handlePlay(quiz: Quiz) {
    if (!user) return;
    const nextAnswers = isGuestUser(user) ? loadGuestProgress(quiz.id) : await loadRemoteProgress(quiz.id);
    setActiveAnswers(nextAnswers);
    setActiveQuiz(quiz);
  }

  async function handleHost(quiz: Quiz) {
    if (!user) return;
    const session = isGuestUser(user)
      ? startGuestHostSession(user.user_id, quiz)
      : await startRemoteHostSession(user.user_id, quiz);
    setActiveHost({ quiz, session });
    setMessage('');
  }

  async function handleEndHost() {
    if (!activeHost || !user) return;
    if (isGuestUser(user)) {
      endGuestHostSession(activeHost.session.id);
    } else {
      await endRemoteHostSession(activeHost.session.id);
    }
    setActiveHost(null);
  }

  async function handleJoin(code: string) {
    if (!user) return;
    const cleanCode = code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const localMatch = quizzes.find((quiz) => quiz.share_code.toUpperCase() === cleanCode);

    try {
      if (localMatch) {
        const guestHost = loadGuestActiveHostByQuiz(localMatch);
        if (guestHost) joinGuestHostSession(guestHost.id, user.display_name);
        setMessage('');
        await handlePlay(localMatch);
        return;
      }

      const joinedQuiz = await loadRemoteQuizByCode(cleanCode) ?? findFeaturedQuizByCode(cleanCode);

      if (!joinedQuiz) {
        setMessage('Quiz code not found.');
        return;
      }

      const remoteHost = await loadRemoteActiveHostByCode(cleanCode, loadRemoteQuizByCode).catch(() => null);
      if (remoteHost) await joinRemoteHostSession(remoteHost.session.id, user.display_name).catch(() => undefined);
      setQuizzes((current) => [joinedQuiz, ...current]);
      setMessage('');
      await handlePlay(joinedQuiz);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not join quiz.');
    }
  }

  useEffect(() => {
    if (loading || !user || !autoJoinCode || autoJoinStarted) return;

    setAutoJoinStarted(true);
    setPage('explore');
    void handleJoin(autoJoinCode).then(() => {
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      url.searchParams.delete('join');
      window.history.replaceState({}, '', url);
      setAutoJoinCode('');
    });
  }, [autoJoinCode, autoJoinStarted, loading, user]);

  async function handleProgress(answers: number[]) {
    if (!activeQuiz || !user) return;
    setActiveAnswers(answers);
    if (isGuestUser(user)) {
      saveGuestProgress(user.user_id, activeQuiz.id, answers);
      return;
    }
    await saveRemoteProgress(user.user_id, activeQuiz.id, answers);
  }

  async function handleFinish(score: number, total: number) {
    if (!activeQuiz || !user) return;
    const earnedCoins = score * coinsPerCorrectAnswer;
    const earnedXp = xpPerQuizComplete + score * xpPerCorrectAnswer;
    if (isGuestUser(user)) {
      saveGuestAttempt(user.user_id, activeQuiz.id, user.display_name, score, total);
      clearGuestProgress(activeQuiz.id);
      setUser(await awardQuizRewards(user, earnedCoins, earnedXp));
      setActiveAnswers([]);
      await refresh(user);
      return;
    }
    await saveRemoteAttempt(user.user_id, activeQuiz.id, user.display_name, score, total);
    await clearRemoteProgress(activeQuiz.id);
    setUser(await awardQuizRewards(user, earnedCoins, earnedXp));
    setActiveAnswers([]);
    await refresh(user);
  }

  async function handleBuySkin(skinId: string) {
    if (!user) return;
    try {
      setUser(await buySkin(user, skinId));
      setMessage('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not buy skin.');
    }
  }

  async function handleEquipSkin(skinId: string) {
    if (!user) return;
    try {
      setUser(await equipSkin(user, skinId));
      setMessage('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not equip skin.');
    }
  }

  async function handleBuyNameFrame(frameId: string) {
    if (!user) return;
    try {
      setUser(await buyNameFrame(user, frameId));
      setMessage('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not buy nickname border.');
    }
  }

  async function handleEquipNameFrame(frameId: string) {
    if (!user) return;
    try {
      setUser(await equipNameFrame(user, frameId));
      setMessage('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not equip nickname border.');
    }
  }

  async function handleOpenPack(packId: string) {
    if (!user) return;
    try {
      const result = await openSkinPack(user, packId);
      setUser(result.user);
      setPackResult({ skin: result.skin, duplicateRefund: result.duplicateRefund });
      setMessage('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not open pack.');
    }
  }

  async function handleOpenFramePack(packId: string) {
    if (!user) return;
    try {
      const result = await openNameFramePack(user, packId);
      setUser(result.user);
      setFrameResult({ frame: result.frame, duplicateRefund: result.duplicateRefund });
      setMessage('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not open border pack.');
    }
  }

  async function handleSignOut() {
    await signOut();
    setUser(null);
    setActiveQuiz(null);
    setActiveAnswers([]);
    setActiveHost(null);
  }

  function handleWelcomeStart() {
    localStorage.setItem(welcomeSeenKey, 'true');
    setWelcomeSeen(true);
  }

  function handleWelcomeBack() {
    localStorage.removeItem(welcomeSeenKey);
    setWelcomeSeen(false);
  }

  if (loading) return <main className="app-shell"><p className="empty">Loading...</p></main>;
  if (!welcomeSeen) return <WelcomeScreen onStart={handleWelcomeStart} />;
  if (!user) return <Auth onAuth={(nextUser) => void handleAuth(nextUser)} onBack={handleWelcomeBack} />;

  return (
    <main className="app-shell">
      {activeHost ? (
        <HostScreen
          loadParticipants={isGuestUser(user) ? async (sessionId) => loadGuestHostParticipants(sessionId) : loadRemoteHostParticipants}
          onClose={handleEndHost}
          quiz={activeHost.quiz}
          session={activeHost.session}
        />
      ) : (
      <>
      <AppHeader profile={user} onSignOut={() => void handleSignOut()} />
      {message && <p className="message">{message}</p>}
      {activeQuiz ? (
        <QuizPlayer
          attempts={attempts}
          initialAnswers={activeAnswers}
          onClose={() => setActiveQuiz(null)}
          onFinish={async (score, total) => handleFinish(score, total)}
          onProgress={handleProgress}
          quiz={activeQuiz}
          rewardPerCorrectAnswer={coinsPerCorrectAnswer}
        />
      ) : (
        <div className="stack">
          <nav className="page-tabs" aria-label="Pages">
            <button className={page === 'explore' ? 'active' : ''} onClick={() => setPage('explore')} type="button">
              Explore
            </button>
            <button className={page === 'publish' ? 'active' : ''} onClick={() => setPage('publish')} type="button">
              Publish
            </button>
            <button className={page === 'shop' ? 'active' : ''} onClick={() => setPage('shop')} type="button">
              Shop
            </button>
            <button className={page === 'profile' ? 'active' : ''} onClick={() => setPage('profile')} type="button">
              Profile
            </button>
          </nav>
          {page === 'publish' ? (
            <section className="workspace">
              <PublishPage
                attempts={attempts}
                currentUserId={user.user_id}
                onCreate={async (title, description, gameMode, questions) =>
                  handleCreate(title, description, gameMode, questions)
                }
                onHost={handleHost}
                onPlay={handlePlay}
                quizzes={quizzes}
              />
              <ProfileSetup
                currentDisplayName={user.display_name}
                email={user.email}
                onSave={async (name) => handleProfile(name)}
              />
            </section>
          ) : page === 'shop' ? (
            <SkinShop
              onBuyFrame={handleBuyNameFrame}
              onBuy={handleBuySkin}
              onEquipFrame={handleEquipNameFrame}
              onEquip={handleEquipSkin}
              onOpenFramePack={handleOpenFramePack}
              onOpenPack={handleOpenPack}
              frameResult={frameResult}
              packResult={packResult}
              user={user}
            />
          ) : page === 'profile' ? (
            <div className="profile-grid">
              <ProfileSetup
                currentDisplayName={user.display_name}
                email={user.email}
                onSave={async (name) => handleProfile(name)}
              />
              <ProfileStats
                attempts={attempts}
                onClaimDailyBonus={handleDailyBonus}
                quizzes={quizzes}
                user={user}
              />
            </div>
          ) : (
            <ExplorePage
              attempts={attempts}
              currentUserId={user.user_id}
              onJoin={handleJoin}
              onPlay={handlePlay}
              quizzes={quizzes}
            />
          )}
        </div>
      )}
      </>
      )}
    </main>
  );
}

function readJoinCodeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('code') ?? params.get('join') ?? '';
}
