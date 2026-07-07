import { useEffect, useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { Auth } from './components/Auth';
import { ExplorePage } from './components/ExplorePage';
import { HostScreen } from './components/HostScreen';
import { LiveQuizPlayer } from './components/LiveQuizPlayer';
import { ProfileSetup } from './components/ProfileSetup';
import { PublishPage } from './components/PublishPage';
import { ProfileStats } from './components/ProfileStats';
import { QuizPlayer } from './components/QuizPlayer';
import { SkinShop } from './components/SkinShop';
import { WelcomeScreen } from './components/WelcomeScreen';
import type { Language } from './lib/language';
import { languageStorageKey, texts } from './lib/language';
import type { Attempt, GameMode, HostParticipant, HostSession, LocalUser, Quiz, QuizQuestion } from './lib/quizTypes';
import {
  endHostSession as endRemoteHostSession,
  finishLiveGame as finishRemoteLiveGame,
  joinHostSession as joinRemoteHostSession,
  loadActiveHostByCode as loadRemoteActiveHostByCode,
  loadHostAnswers as loadRemoteHostAnswers,
  loadHostParticipants as loadRemoteHostParticipants,
  loadHostSession as loadRemoteHostSession,
  saveHostAnswer as saveRemoteHostAnswer,
  setLiveQuestion as setRemoteLiveQuestion,
  startLiveGame as startRemoteLiveGame,
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
  finishLiveGame as finishGuestLiveGame,
  joinHostSession as joinGuestHostSession,
  loadActiveHostByQuiz as loadGuestActiveHostByQuiz,
  loadHostAnswers as loadGuestHostAnswers,
  loadHostParticipants as loadGuestHostParticipants,
  loadHostSession as loadGuestHostSession,
  saveHostAnswer as saveGuestHostAnswer,
  setLiveQuestion as setGuestLiveQuestion,
  startLiveGame as startGuestLiveGame,
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
import type { AppPage } from './lib/routes';
import { getPathForPage, isKnownAppPath, readPageFromPath } from './lib/routes';
import { supabase } from './lib/supabase';
import type { AppTheme } from './lib/theme';
import { readTheme, themeStorageKey } from './lib/theme';
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

type ActiveLive = ActiveHost & {
  participant: HostParticipant;
};

export default function App() {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activeAnswers, setActiveAnswers] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<AppPage>(() => readPageFromPath(window.location.pathname));
  const [packResult, setPackResult] = useState<PackResult | null>(null);
  const [frameResult, setFrameResult] = useState<FramePackResult | null>(null);
  const [activeHost, setActiveHost] = useState<ActiveHost | null>(null);
  const [activeLive, setActiveLive] = useState<ActiveLive | null>(null);
  const [autoJoinCode, setAutoJoinCode] = useState(() => readJoinCodeFromUrl());
  const [autoJoinStarted, setAutoJoinStarted] = useState(false);
  const [welcomeSeen, setWelcomeSeen] = useState(() => (
    localStorage.getItem(welcomeSeenKey) === 'true' || hasAuthRedirectParams()
  ));
  const [language, setLanguage] = useState<Language>(() => (
    localStorage.getItem(languageStorageKey) === 'ru' ? 'ru' : 'en'
  ));
  const [theme, setTheme] = useState<AppTheme>(() => readTheme());
  const copy = texts[language];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function handleLanguage(nextLanguage: Language) {
    localStorage.setItem(languageStorageKey, nextLanguage);
    setLanguage(nextLanguage);
  }

  function handleTheme(nextTheme: AppTheme) {
    localStorage.setItem(themeStorageKey, nextTheme);
    setTheme(nextTheme);
  }

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
        await finishAuthRedirect();
        const nextUser = await getCurrentUser();
        await applyLoadedUser(nextUser);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Could not load progress.');
      } finally {
        setLoading(false);
      }
    }

    void boot();
  }, []);

  useEffect(() => {
    if (!isKnownAppPath(window.location.pathname)) {
      window.history.replaceState({}, '', getPathForPage('explore'));
      setPage('explore');
    }

    function handlePopState() {
      if (!isKnownAppPath(window.location.pathname)) {
        window.history.replaceState({}, '', getPathForPage('explore'));
      }
      setPage(readPageFromPath(window.location.pathname));
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== 'SIGNED_IN' || !session?.user.email) return;
      void getCurrentUser()
        .then((nextUser) => applyLoadedUser(nextUser))
        .catch((error: unknown) => {
          setMessage(error instanceof Error ? error.message : 'Could not load progress.');
        });
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function applyLoadedUser(nextUser: LocalUser | null) {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem(welcomeSeenKey, 'true');
      setWelcomeSeen(true);
      if (window.location.pathname === '/') {
        replaceRoute('explore');
      }
    }
    await refresh(nextUser);
  }

  function navigateToPage(nextPage: AppPage) {
    setPage(nextPage);
    window.history.pushState({}, '', getPathForPage(nextPage));
  }

  function replaceRoute(nextPage: AppPage) {
    setPage(nextPage);
    window.history.replaceState({}, '', getPathForPage(nextPage));
  }

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
    if (window.location.pathname === '/') {
      navigateToPage('explore');
    }
  }

  async function handleDailyBonus() {
    if (!user) return;
    try {
      setUser(await claimDailyBonus(user));
      setMessage(copy.dailyClaimed);
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

  async function handleStartLiveGame() {
    if (!activeHost || !user) return;
    if (isGuestUser(user)) {
      startGuestLiveGame(activeHost.session.id);
      return;
    }
    await startRemoteLiveGame(activeHost.session.id);
  }

  async function handleNextLiveQuestion(questionIndex: number) {
    if (!activeHost || !user) return;
    if (isGuestUser(user)) {
      setGuestLiveQuestion(activeHost.session.id, questionIndex);
      return;
    }
    await setRemoteLiveQuestion(activeHost.session.id, questionIndex);
  }

  async function handleFinishLiveGame() {
    if (!activeHost || !user) return;
    if (isGuestUser(user)) {
      finishGuestLiveGame(activeHost.session.id);
      return;
    }
    await finishRemoteLiveGame(activeHost.session.id);
  }

  async function handleJoin(code: string) {
    if (!user) return;
    const cleanCode = code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const localMatch = quizzes.find((quiz) => quiz.share_code.toUpperCase() === cleanCode);

    try {
      if (localMatch) {
        if (isGuestUser(user)) {
          const guestHost = loadGuestActiveHostByQuiz(localMatch);
          if (guestHost) {
            const participant = joinGuestHostSession(guestHost.id, user.display_name);
            setActiveLive({ quiz: localMatch, session: guestHost, participant });
            setMessage('');
            return;
          }
          setMessage('');
          await handlePlay(localMatch);
          return;
        }

        const remoteHost = await loadRemoteActiveHostByCode(cleanCode, loadRemoteQuizByCode).catch(() => null);
        if (remoteHost) {
          const participant = await joinRemoteHostSession(remoteHost.session.id, user.display_name);
          if (participant) setActiveLive({ ...remoteHost, participant });
          setMessage('');
          return;
        }
        setMessage('');
        await handlePlay(localMatch);
        return;
      }

      const remoteHost = await loadRemoteActiveHostByCode(cleanCode, loadRemoteQuizByCode).catch(() => null);
      if (remoteHost) {
        const participant = await joinRemoteHostSession(remoteHost.session.id, user.display_name);
        if (participant) {
          setQuizzes((current) => [remoteHost.quiz, ...current]);
          setActiveLive({ ...remoteHost, participant });
        }
        setMessage('');
        return;
      }

      const joinedQuiz = await loadRemoteQuizByCode(cleanCode) ?? findFeaturedQuizByCode(cleanCode);

      if (!joinedQuiz) {
        setMessage('Quiz code not found.');
        return;
      }

      if (isGuestUser(user)) {
        const guestHost = loadGuestActiveHostByQuiz(joinedQuiz);
        if (guestHost) {
          const participant = joinGuestHostSession(guestHost.id, user.display_name);
          setActiveLive({ quiz: joinedQuiz, session: guestHost, participant });
          setMessage('');
          return;
        }
      }
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
    replaceRoute('explore');
    void handleJoin(autoJoinCode).then(() => {
      const url = new URL(window.location.href);
      url.pathname = getPathForPage('explore');
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
    setActiveLive(null);
    window.history.pushState({}, '', '/');
  }

  function handleWelcomeStart() {
    localStorage.setItem(welcomeSeenKey, 'true');
    setWelcomeSeen(true);
  }

  function handleWelcomeBack() {
    localStorage.removeItem(welcomeSeenKey);
    setWelcomeSeen(false);
    window.history.pushState({}, '', '/');
  }

  if (loading) return <main className="app-shell"><p className="empty">{copy.loading}</p></main>;
  if (!welcomeSeen && !user && window.location.pathname === '/') {
    return (
      <WelcomeScreen
        language={language}
        onLanguageChange={handleLanguage}
        onStart={handleWelcomeStart}
        texts={copy}
      />
    );
  }
  if (!user) {
    return (
      <Auth
        language={language}
        onAuth={(nextUser) => void handleAuth(nextUser)}
        onBack={handleWelcomeBack}
        onLanguageChange={handleLanguage}
        texts={copy}
      />
    );
  }

  return (
    <main className="app-shell">
      {activeHost ? (
        <HostScreen
          loadAnswers={isGuestUser(user) ? async (sessionId) => loadGuestHostAnswers(sessionId) : loadRemoteHostAnswers}
          loadParticipants={isGuestUser(user) ? async (sessionId) => loadGuestHostParticipants(sessionId) : loadRemoteHostParticipants}
          loadSession={isGuestUser(user) ? async (sessionId) => loadGuestHostSession(sessionId) : loadRemoteHostSession}
          onClose={handleEndHost}
          onFinish={handleFinishLiveGame}
          onNextQuestion={handleNextLiveQuestion}
          onStart={handleStartLiveGame}
          quiz={activeHost.quiz}
          session={activeHost.session}
        />
      ) : activeLive ? (
        <LiveQuizPlayer
          loadAnswers={isGuestUser(user) ? async (sessionId) => loadGuestHostAnswers(sessionId) : loadRemoteHostAnswers}
          loadParticipants={isGuestUser(user) ? async (sessionId) => loadGuestHostParticipants(sessionId) : loadRemoteHostParticipants}
          loadSession={isGuestUser(user) ? async (sessionId) => loadGuestHostSession(sessionId) : loadRemoteHostSession}
          onAnswer={async (questionIndex, answerIndex, isCorrect) => {
            if (isGuestUser(user)) {
              saveGuestHostAnswer(activeLive.session.id, activeLive.participant.id, questionIndex, answerIndex, isCorrect);
              return;
            }
            await saveRemoteHostAnswer(activeLive.session.id, activeLive.participant.id, questionIndex, answerIndex, isCorrect);
          }}
          onClose={() => setActiveLive(null)}
          participant={activeLive.participant}
          quiz={activeLive.quiz}
          session={activeLive.session}
        />
      ) : (
      <>
      <AppHeader
        language={language}
        onLanguageChange={handleLanguage}
        onSignOut={() => void handleSignOut()}
        onThemeChange={handleTheme}
        profile={user}
        texts={copy}
        theme={theme}
      />
      {message && <p className="message">{message}</p>}
      {activeQuiz ? (
        <QuizPlayer
          activeSkinId={user.active_skin_id}
          attempts={attempts}
          initialAnswers={activeAnswers}
          onClose={() => setActiveQuiz(null)}
          onFinish={async (score, total) => handleFinish(score, total)}
          onProgress={handleProgress}
          quiz={activeQuiz}
          rewardPerCorrectAnswer={coinsPerCorrectAnswer}
          texts={copy}
        />
      ) : (
        <div className="stack">
          <nav className="page-tabs" aria-label="Pages">
            <button className={page === 'explore' ? 'active' : ''} onClick={() => navigateToPage('explore')} type="button">
              {copy.explore}
            </button>
            <button className={page === 'publish' ? 'active' : ''} onClick={() => navigateToPage('publish')} type="button">
              {copy.publish}
            </button>
            <button className={page === 'shop' ? 'active' : ''} onClick={() => navigateToPage('shop')} type="button">
              {copy.shop}
            </button>
            <button className={page === 'profile' ? 'active' : ''} onClick={() => navigateToPage('profile')} type="button">
              {copy.profile}
            </button>
          </nav>
          {page === 'publish' ? (
            <div className="stack">
              <PublishPage
                attempts={attempts}
                currentUserId={user.user_id}
                onCreate={async (title, description, gameMode, questions) =>
                  handleCreate(title, description, gameMode, questions)
                }
                onHost={handleHost}
                onPlay={handlePlay}
                quizzes={quizzes}
                texts={copy}
              />
            </div>
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
                texts={copy}
              />
              <ProfileStats
                attempts={attempts}
                onClaimDailyBonus={handleDailyBonus}
                quizzes={quizzes}
                texts={copy}
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
              texts={copy}
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
  const joinCode = params.get('join');
  const code = params.get('code') ?? '';
  if (joinCode) return joinCode;
  return /^[a-zA-Z0-9]{1,8}$/.test(code) ? code : '';
}

function hasAuthRedirectParams() {
  const params = new URLSearchParams(window.location.search);
  return params.has('code') || params.has('error') || params.has('error_description');
}

async function finishAuthRedirect() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const authError = params.get('error_description') ?? params.get('error');

  if (authError) throw new Error(authError);
  if (!code) return;

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  cleanAuthRedirectParams();
  if (error && !isIgnorableAuthExchangeError(error.message)) {
    throw error;
  }
}

function isIgnorableAuthExchangeError(message: string) {
  const cleanMessage = message.toLowerCase();
  return cleanMessage.includes('invalid flow state') || cleanMessage.includes('code verifier');
}

function cleanAuthRedirectParams() {
  const url = new URL(window.location.href);
  ['code', 'error', 'error_code', 'error_description'].forEach((key) => {
    url.searchParams.delete(key);
  });
  window.history.replaceState({}, '', url);
}
