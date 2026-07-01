import type { Skin } from './skinCatalog';
import { skins } from './skinCatalog';

export type SkinPack = {
  id: string;
  name: string;
  price: number;
  description: string;
  coverColor: string;
  accentColor: string;
  weights: Record<Skin['rarity'], number>;
};

export const skinPacks: SkinPack[] = [
  {
    id: 'starter-pack',
    name: 'Lucky Pack',
    price: 80,
    description: 'Opens one pack-only character.',
    coverColor: '#1f6b8f',
    accentColor: '#9ee6ff',
    weights: { common: 0, rare: 75, epic: 20, legendary: 5 },
  },
  {
    id: 'rare-pack',
    name: 'Rare Hunter Pack',
    price: 180,
    description: 'Higher chance for epic and legendary characters.',
    coverColor: '#6d3bb8',
    accentColor: '#ffd36e',
    weights: { common: 0, rare: 55, epic: 35, legendary: 10 },
  },
];

export function getPack(packId: string) {
  return skinPacks.find((pack) => pack.id === packId) ?? skinPacks[0];
}

export function pickSkinFromPack(pack: SkinPack) {
  const availableSkins = skins.filter((skin) => skin.packOnly);
  const weightedSkins = availableSkins.flatMap((skin) =>
    Array.from({ length: pack.weights[skin.rarity] }, () => skin),
  );
  return weightedSkins[Math.floor(Math.random() * weightedSkins.length)];
}
