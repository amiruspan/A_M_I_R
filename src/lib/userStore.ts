import { supabase } from './supabase';
import { normalizeUser } from './profileEconomy';
import { getTodayKey, markStreakAnimation, updateLoginStreakForToday } from './profileProgress';
import type { LocalUser, Role } from './quizTypes';

const guestUserKey = 'quizroom_guest_user';
const welcomeSeenKey = 'quizroom_welcome_seen';
const profileColumns = `
  user_id,role,display_name,coins,xp,last_daily_bonus,login_streak,last_seen_date,banned_until,
  earned_badge_ids,owned_skin_ids,active_skin_id,owned_name_frame_ids,active_name_frame_id
`;
const authRedirectUrl = import.meta.env.VITE_AUTH_REDIRECT_URL as string | undefined;

type SupabaseErrorLike = {
  code?: string;
  message?: string;
  details?: string;
};

function getAuthRedirectUrl() {
  const url = authRedirectUrl?.trim() || window.location.origin;
  return url.endsWith('/') ? url : `${url}/`;
}

function isMissingProfilesTable(error: SupabaseErrorLike) {
  const text = `${error.code ?? ''} ${error.message ?? ''} ${error.details ?? ''}`.toLowerCase();
  return text.includes('profiles') && (
    text.includes('404') ||
    text.includes('could not find') ||
    text.includes('does not exist') ||
    error.code === '42P01' ||
    error.code === 'PGRST205'
  );
}

function isBanned(user: LocalUser) {
  return !!user.banned_until && new Date(user.banned_until).getTime() > Date.now();
}

function readGuestUser(): LocalUser | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(guestUserKey);
  if (!raw) return null;
  try {
    const currentUser = normalizeUser(JSON.parse(raw) as LocalUser);
    const user = updateLoginStreakForToday(currentUser);
    if (user.login_streak > currentUser.login_streak && user.login_streak > 1) {
      markStreakAnimation(user);
    }
    writeGuestUser(user);
    return user;
  } catch {
    return null;
  }
}

function writeGuestUser(user: LocalUser) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(guestUserKey, JSON.stringify(user));
  }
}

function clearGuestUser() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(guestUserKey);
  }
}

async function ensureProfile(userId: string, email: string): Promise<LocalUser> {
  const { data, error } = await supabase
    .from('profiles')
    .select(profileColumns)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    if (isMissingProfilesTable(error)) {
      throw new Error('Database tables are missing. Run npm run db:push, then try logging in again.');
    }
    throw error;
  }
  if (data) {
    const user = normalizeUser({ ...(data as LocalUser), email });
    if (isBanned(user)) {
      await supabase.auth.signOut();
      throw new Error('This account is banned.');
    }
    return saveLoginStreak(user);
  }

  const today = getTodayKey();
  const profile = {
    user_id: userId,
    role: 'student' as Role,
    display_name: email.split('@')[0] || 'Player',
    coins: 0,
    xp: 0,
    last_daily_bonus: null,
    login_streak: 1,
    last_seen_date: today,
    banned_until: null,
    earned_badge_ids: [],
    owned_skin_ids: ['classic'],
    active_skin_id: 'classic',
    owned_name_frame_ids: ['plain'],
    active_name_frame_id: 'plain',
  };

  const { data: created, error: createError } = await supabase
    .from('profiles')
    .insert(profile)
    .select(profileColumns)
    .single();

  if (createError) {
    if (isMissingProfilesTable(createError)) {
      throw new Error('Database tables are missing. Run npm run db:push, then try logging in again.');
    }
    throw createError;
  }
  return normalizeUser({ ...(created as LocalUser), email });
}

async function saveLoginStreak(user: LocalUser) {
  const nextUser = updateLoginStreakForToday(user);
  if (
    nextUser.login_streak === user.login_streak &&
    nextUser.last_seen_date === user.last_seen_date
  ) {
    return user;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      login_streak: nextUser.login_streak,
      last_seen_date: nextUser.last_seen_date,
    })
    .eq('user_id', user.user_id)
    .select(profileColumns)
    .single();

  if (error) throw error;
  const savedUser = normalizeUser({ ...(data as LocalUser), email: user.email });
  if (savedUser.login_streak > user.login_streak && savedUser.login_streak > 1) {
    markStreakAnimation(savedUser);
  }
  return savedUser;
}

export function isGuestUser(user: LocalUser | null) {
  return !!user && ['guest-local', 'teacher4-local'].includes(user.user_id);
}

export function saveGuestProfile(user: LocalUser, role: Role, displayName: string) {
  const updatedUser = normalizeUser({ ...user, role, display_name: displayName });
  writeGuestUser(updatedUser);
  return updatedUser;
}

export function continueAsGuest() {
  const today = getTodayKey();
  const guestUser: LocalUser = {
    user_id: 'guest-local',
    role: 'student',
    display_name: 'Guest',
    email: 'guest@local',
    coins: 0,
    xp: 0,
    last_daily_bonus: null,
    login_streak: 1,
    last_seen_date: today,
    banned_until: null,
    earned_badge_ids: [],
    owned_skin_ids: ['classic'],
    active_skin_id: 'classic',
    owned_name_frame_ids: ['plain'],
    active_name_frame_id: 'plain',
  };
  writeGuestUser(guestUser);
  return guestUser;
}

export function continueAsTeacher() {
  const today = getTodayKey();
  const teacherUser: LocalUser = {
    user_id: 'teacher4-local',
    role: 'teacher',
    display_name: 'Teacher',
    email: 'teacher@local',
    coins: 0,
    xp: 0,
    last_daily_bonus: null,
    login_streak: 1,
    last_seen_date: today,
    banned_until: null,
    earned_badge_ids: [],
    owned_skin_ids: ['classic'],
    active_skin_id: 'classic',
    owned_name_frame_ids: ['plain'],
    active_name_frame_id: 'plain',
  };
  writeGuestUser(teacherUser);
  return teacherUser;
}

export async function getCurrentUser() {
  const guestUser = readGuestUser();
  if (guestUser) return guestUser;

  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const sessionUser = data.session?.user;
  if (!sessionUser?.email) return null;
  return ensureProfile(sessionUser.id, sessionUser.email);
}

export async function createAccount(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (!data.session || !data.user?.email) {
    throw new Error('Check your email to finish signup, then sign in.');
  }
  return ensureProfile(data.user.id, data.user.email);
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user.email) throw new Error('Email is missing.');
  return ensureProfile(data.user.id, data.user.email);
}

export async function signInWithGoogle() {
  clearGuestUser();
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(welcomeSeenKey, 'true');
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: { prompt: 'select_account' },
      redirectTo: getAuthRedirectUrl(),
    },
  });
  if (error) throw error;
}

export async function signOut() {
  clearGuestUser();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function saveProfile(userId: string, role: Role, displayName: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role, display_name: displayName })
    .eq('user_id', userId)
    .select(profileColumns)
    .single();

  if (error) throw error;
  const email = (await supabase.auth.getUser()).data.user?.email ?? '';
  return normalizeUser({ ...(data as LocalUser), email });
}
