import { supabase } from './supabase';
import type { LocalUser } from './quizTypes';
import {
  getNameFrame,
  getNameFramePack,
  pickNameFrameFromPack,
  starterNameFrameId,
} from './nameFrameCatalog';
import { getPack, pickSkinFromPack } from './packCatalog';
import { getSkin, starterSkinId } from './skinCatalog';

const guestUserKey = 'quizroom_guest_user';
const profileColumns = `
  user_id,role,display_name,coins,owned_skin_ids,active_skin_id,
  owned_name_frame_ids,active_name_frame_id
`;

export function normalizeUser(user: LocalUser): LocalUser {
  return {
    ...user,
    coins: user.coins ?? 0,
    owned_skin_ids: user.owned_skin_ids?.length ? user.owned_skin_ids : [starterSkinId],
    active_skin_id: user.active_skin_id ?? starterSkinId,
    owned_name_frame_ids: user.owned_name_frame_ids?.length
      ? user.owned_name_frame_ids
      : [starterNameFrameId],
    active_name_frame_id: user.active_name_frame_id ?? starterNameFrameId,
  };
}

function saveGuestUser(user: LocalUser) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(guestUserKey, JSON.stringify(user));
  }
}

function isGuestUserId(userId: string) {
  return ['guest-local', 'teacher4-local'].includes(userId);
}

async function updateRemoteProfile(user: LocalUser, patch: Partial<LocalUser>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('user_id', user.user_id)
    .select(profileColumns)
    .single();

  if (error) throw error;
  return normalizeUser({ ...(data as LocalUser), email: user.email });
}

export async function awardCoins(user: LocalUser, amount: number) {
  const nextUser = normalizeUser({ ...user, coins: user.coins + amount });
  if (isGuestUserId(user.user_id)) {
    saveGuestUser(nextUser);
    return nextUser;
  }
  return updateRemoteProfile(user, { coins: nextUser.coins });
}

export async function buySkin(user: LocalUser, skinId: string) {
  const skin = getSkin(skinId);
  const currentUser = normalizeUser(user);
  if (currentUser.owned_skin_ids.includes(skinId)) return currentUser;
  if (skin.packOnly) throw new Error('This character drops only from packs.');
  if (currentUser.coins < skin.price) throw new Error('Not enough coins yet.');

  const nextUser = normalizeUser({
    ...currentUser,
    coins: currentUser.coins - skin.price,
    owned_skin_ids: [...currentUser.owned_skin_ids, skinId],
    active_skin_id: skinId,
  });

  if (isGuestUserId(user.user_id)) {
    saveGuestUser(nextUser);
    return nextUser;
  }
  return updateRemoteProfile(user, {
    active_skin_id: nextUser.active_skin_id,
    coins: nextUser.coins,
    owned_skin_ids: nextUser.owned_skin_ids,
  });
}

export async function openSkinPack(user: LocalUser, packId: string) {
  const pack = getPack(packId);
  const currentUser = normalizeUser(user);
  if (currentUser.coins < pack.price) throw new Error('Not enough coins for this pack.');

  const skin = pickSkinFromPack(pack);
  const alreadyOwned = currentUser.owned_skin_ids.includes(skin.id);
  const duplicateRefund = alreadyOwned ? Math.floor(pack.price / 2) : 0;
  const nextOwnedSkinIds = alreadyOwned
    ? currentUser.owned_skin_ids
    : [...currentUser.owned_skin_ids, skin.id];

  const nextUser = normalizeUser({
    ...currentUser,
    coins: currentUser.coins - pack.price + duplicateRefund,
    owned_skin_ids: nextOwnedSkinIds,
    active_skin_id: skin.id,
  });

  if (isGuestUserId(user.user_id)) {
    saveGuestUser(nextUser);
    return { user: nextUser, skin, duplicateRefund };
  }

  const updatedUser = await updateRemoteProfile(user, {
    active_skin_id: nextUser.active_skin_id,
    coins: nextUser.coins,
    owned_skin_ids: nextUser.owned_skin_ids,
  });
  return { user: updatedUser, skin, duplicateRefund };
}

export async function equipSkin(user: LocalUser, skinId: string) {
  const currentUser = normalizeUser(user);
  if (!currentUser.owned_skin_ids.includes(skinId)) throw new Error('Buy this skin first.');
  const nextUser = normalizeUser({ ...currentUser, active_skin_id: skinId });

  if (isGuestUserId(user.user_id)) {
    saveGuestUser(nextUser);
    return nextUser;
  }
  return updateRemoteProfile(user, { active_skin_id: skinId });
}

export async function buyNameFrame(user: LocalUser, frameId: string) {
  const frame = getNameFrame(frameId);
  const currentUser = normalizeUser(user);
  if (currentUser.owned_name_frame_ids.includes(frameId)) return currentUser;
  if (frame.packOnly) throw new Error('This nickname border drops only from packs.');
  if (currentUser.coins < frame.price) throw new Error('Not enough coins yet.');

  const nextUser = normalizeUser({
    ...currentUser,
    coins: currentUser.coins - frame.price,
    owned_name_frame_ids: [...currentUser.owned_name_frame_ids, frameId],
    active_name_frame_id: frameId,
  });

  if (isGuestUserId(user.user_id)) {
    saveGuestUser(nextUser);
    return nextUser;
  }
  return updateRemoteProfile(user, {
    active_name_frame_id: nextUser.active_name_frame_id,
    coins: nextUser.coins,
    owned_name_frame_ids: nextUser.owned_name_frame_ids,
  });
}

export async function openNameFramePack(user: LocalUser, packId: string) {
  const pack = getNameFramePack(packId);
  const currentUser = normalizeUser(user);
  if (currentUser.coins < pack.price) throw new Error('Not enough coins for this pack.');

  const frame = pickNameFrameFromPack(pack);
  const alreadyOwned = currentUser.owned_name_frame_ids.includes(frame.id);
  const duplicateRefund = alreadyOwned ? Math.floor(pack.price / 2) : 0;
  const nextOwnedFrameIds = alreadyOwned
    ? currentUser.owned_name_frame_ids
    : [...currentUser.owned_name_frame_ids, frame.id];

  const nextUser = normalizeUser({
    ...currentUser,
    coins: currentUser.coins - pack.price + duplicateRefund,
    owned_name_frame_ids: nextOwnedFrameIds,
    active_name_frame_id: frame.id,
  });

  if (isGuestUserId(user.user_id)) {
    saveGuestUser(nextUser);
    return { user: nextUser, frame, duplicateRefund };
  }

  const updatedUser = await updateRemoteProfile(user, {
    active_name_frame_id: nextUser.active_name_frame_id,
    coins: nextUser.coins,
    owned_name_frame_ids: nextUser.owned_name_frame_ids,
  });
  return { user: updatedUser, frame, duplicateRefund };
}

export async function equipNameFrame(user: LocalUser, frameId: string) {
  const currentUser = normalizeUser(user);
  if (!currentUser.owned_name_frame_ids.includes(frameId)) {
    throw new Error('Buy this nickname border first.');
  }
  const nextUser = normalizeUser({ ...currentUser, active_name_frame_id: frameId });

  if (isGuestUserId(user.user_id)) {
    saveGuestUser(nextUser);
    return nextUser;
  }
  return updateRemoteProfile(user, { active_name_frame_id: frameId });
}
