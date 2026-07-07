export type Skin = {
  id: string;
  name: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string;
  accentColor: string;
  shape: 'round' | 'bean' | 'squircle' | 'drop';
  mood: 'smile' | 'focus' | 'spark' | 'cool';
  ability?: SkinAbility;
  packOnly?: boolean;
};

export type SkinAbility = {
  id: 'remove_wrong_answer';
  name: string;
  description: string;
};

export const removeWrongAnswerAbility: SkinAbility = {
  id: 'remove_wrong_answer',
  name: 'Hint spark',
  description: 'Once per quiz, remove one wrong answer.',
};

export const starterSkinId = 'classic';

export const skins: Skin[] = [
  {
    id: starterSkinId,
    name: 'Classic Blue',
    price: 0,
    rarity: 'common',
    color: '#1f4f82',
    accentColor: '#8fd3ff',
    shape: 'round',
    mood: 'smile',
  },
  {
    id: 'mint',
    name: 'Mint Focus',
    price: 40,
    rarity: 'common',
    color: '#16856a',
    accentColor: '#9ff3d7',
    shape: 'bean',
    mood: 'focus',
  },
  {
    id: 'sunset',
    name: 'Sunset Gold',
    price: 70,
    rarity: 'common',
    color: '#b45f06',
    accentColor: '#ffd36e',
    shape: 'drop',
    mood: 'spark',
  },
  {
    id: 'berry',
    name: 'Berry Quiz',
    price: 100,
    rarity: 'common',
    color: '#8b2f6b',
    accentColor: '#ff9bd2',
    shape: 'squircle',
    mood: 'cool',
  },
  {
    id: 'ocean',
    name: 'Ocean Wink',
    price: 120,
    rarity: 'rare',
    color: '#0f6f8c',
    accentColor: '#7ee7ff',
    shape: 'bean',
    mood: 'smile',
  },
  {
    id: 'lime',
    name: 'Lime Spark',
    price: 140,
    rarity: 'rare',
    color: '#5b8f18',
    accentColor: '#d9ff7a',
    shape: 'drop',
    mood: 'spark',
  },
  {
    id: 'ruby',
    name: 'Ruby Focus',
    price: 160,
    rarity: 'rare',
    color: '#a83246',
    accentColor: '#ff9aa8',
    shape: 'squircle',
    mood: 'focus',
  },
  {
    id: 'midnight',
    name: 'Midnight Cool',
    price: 190,
    rarity: 'rare',
    color: '#26324f',
    accentColor: '#a7b7ff',
    shape: 'round',
    mood: 'cool',
  },
  {
    id: 'coral',
    name: 'Coral Smile',
    price: 220,
    rarity: 'epic',
    color: '#d6533c',
    accentColor: '#ffc0a8',
    shape: 'bean',
    mood: 'smile',
  },
  {
    id: 'royal',
    name: 'Royal Spark',
    price: 260,
    rarity: 'epic',
    color: '#5842a6',
    accentColor: '#c8b8ff',
    shape: 'squircle',
    mood: 'spark',
  },
  {
    id: 'forest',
    name: 'Forest Focus',
    price: 300,
    rarity: 'epic',
    color: '#1f6b3a',
    accentColor: '#9ee6a8',
    shape: 'drop',
    mood: 'focus',
    ability: removeWrongAnswerAbility,
  },
  {
    id: 'gold',
    name: 'Gold Legend',
    price: 360,
    rarity: 'legendary',
    color: '#c48a14',
    accentColor: '#ffe28a',
    shape: 'round',
    mood: 'cool',
    ability: removeWrongAnswerAbility,
  },
  {
    id: 'crystal',
    name: 'Crystal Blink',
    price: 0,
    rarity: 'rare',
    color: '#2f80a8',
    accentColor: '#c5f4ff',
    shape: 'drop',
    mood: 'smile',
    packOnly: true,
  },
  {
    id: 'ember',
    name: 'Ember Buddy',
    price: 0,
    rarity: 'rare',
    color: '#a83b1f',
    accentColor: '#ffb27a',
    shape: 'bean',
    mood: 'focus',
    packOnly: true,
  },
  {
    id: 'plasma',
    name: 'Plasma Pop',
    price: 0,
    rarity: 'epic',
    color: '#6d3bb8',
    accentColor: '#e3b7ff',
    shape: 'squircle',
    mood: 'spark',
    packOnly: true,
  },
  {
    id: 'jade',
    name: 'Jade Genius',
    price: 0,
    rarity: 'epic',
    color: '#22705a',
    accentColor: '#a9f0c8',
    shape: 'round',
    mood: 'cool',
    ability: removeWrongAnswerAbility,
    packOnly: true,
  },
  {
    id: 'cosmo',
    name: 'Cosmo Crown',
    price: 0,
    rarity: 'legendary',
    color: '#33245f',
    accentColor: '#f4d35e',
    shape: 'drop',
    mood: 'spark',
    packOnly: true,
  },
  {
    id: 'aurora',
    name: 'Aurora Ace',
    price: 0,
    rarity: 'legendary',
    color: '#126b77',
    accentColor: '#b8ffd9',
    shape: 'squircle',
    mood: 'cool',
    ability: removeWrongAnswerAbility,
    packOnly: true,
  },
];

export function getSkin(skinId: string) {
  return skins.find((skin) => skin.id === skinId) ?? skins[0];
}
