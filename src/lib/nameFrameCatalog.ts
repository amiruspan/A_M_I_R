import type { Language } from './language';

export type NameFrame = {
  id: string;
  name: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  className: string;
  packOnly?: boolean;
};

export type NameFramePack = {
  id: string;
  name: string;
  price: number;
  description: string;
  coverColor: string;
  accentColor: string;
  weights: Record<NameFrame['rarity'], number>;
};

export const starterNameFrameId = 'plain';

export const nameFrames: NameFrame[] = [
  { id: starterNameFrameId, name: 'Plain', price: 0, rarity: 'common', className: 'name-frame--plain' },
  { id: 'silver', name: 'Silver Line', price: 60, rarity: 'common', className: 'name-frame--silver' },
  { id: 'leaf', name: 'Leaf Glow', price: 90, rarity: 'common', className: 'name-frame--leaf' },
  { id: 'sun', name: 'Sun Border', price: 130, rarity: 'rare', className: 'name-frame--sun' },
  { id: 'berry', name: 'Berry Pop', price: 170, rarity: 'rare', className: 'name-frame--berry' },
  { id: 'royal', name: 'Royal Frame', price: 240, rarity: 'epic', className: 'name-frame--royal' },
  {
    id: 'neon',
    name: 'Neon Pulse',
    price: 0,
    rarity: 'rare',
    className: 'name-frame--neon',
    packOnly: true,
  },
  {
    id: 'frost',
    name: 'Frost Crown',
    price: 0,
    rarity: 'epic',
    className: 'name-frame--frost',
    packOnly: true,
  },
  {
    id: 'mythic',
    name: 'Mythic Halo',
    price: 0,
    rarity: 'legendary',
    className: 'name-frame--mythic',
    packOnly: true,
  },
];

export const nameFramePacks: NameFramePack[] = [
  {
    id: 'border-pack',
    name: 'Border Pack',
    price: 120,
    description: 'Drops one exclusive nickname border.',
    coverColor: '#234f68',
    accentColor: '#b8ffd9',
    weights: { common: 0, rare: 70, epic: 25, legendary: 5 },
  },
];

export function getNameFrame(frameId: string) {
  return nameFrames.find((frame) => frame.id === frameId) ?? nameFrames[0];
}

const russianFrameNames: Record<string, string> = {
  plain: 'Обычный',
  silver: 'Серебряная линия',
  leaf: 'Листовое сияние',
  sun: 'Солнечная рамка',
  berry: 'Ягодный поп',
  royal: 'Королевская рамка',
  neon: 'Неоновый пульс',
  frost: 'Ледяная корона',
  mythic: 'Мифический ореол',
};

const russianFramePackText: Record<string, { name: string; description: string }> = {
  'border-pack': {
    name: 'Пак рамок',
    description: 'Даёт одну эксклюзивную рамку ника.',
  },
};

export function getNameFrameName(frame: NameFrame, language: Language) {
  return language === 'ru' ? russianFrameNames[frame.id] ?? frame.name : frame.name;
}

export function getNameFramePackName(pack: NameFramePack, language: Language) {
  return language === 'ru' ? russianFramePackText[pack.id]?.name ?? pack.name : pack.name;
}

export function getNameFramePackDescription(pack: NameFramePack, language: Language) {
  return language === 'ru' ? russianFramePackText[pack.id]?.description ?? pack.description : pack.description;
}

export function getNameFramePack(packId: string) {
  return nameFramePacks.find((pack) => pack.id === packId) ?? nameFramePacks[0];
}

export function pickNameFrameFromPack(pack: NameFramePack) {
  const availableFrames = nameFrames.filter((frame) => frame.packOnly);
  const weightedFrames = availableFrames.flatMap((frame) =>
    Array.from({ length: pack.weights[frame.rarity] }, () => frame),
  );
  return weightedFrames[Math.floor(Math.random() * weightedFrames.length)];
}
