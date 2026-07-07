import { useState } from 'react';
import type { Language, Texts } from '../lib/language';
import type { LocalUser } from '../lib/quizTypes';
import type { NameFrame } from '../lib/nameFrameCatalog';
import { getPackDescription, getPackName, skinPacks } from '../lib/packCatalog';
import type { Skin } from '../lib/skinCatalog';
import { getSkinName, skins } from '../lib/skinCatalog';
import { NameFrameShop } from './NameFrameShop';
import { PackArt } from './PackArt';
import { PackOpeningOverlay } from './PackOpeningOverlay';
import { SkinBadge } from './SkinBadge';

type SkinShopProps = {
  user: LocalUser;
  onBuyFrame: (frameId: string) => Promise<void>;
  onBuy: (skinId: string) => Promise<void>;
  onEquipFrame: (frameId: string) => Promise<void>;
  onEquip: (skinId: string) => Promise<void>;
  onOpenFramePack: (packId: string) => Promise<void>;
  onOpenPack: (packId: string) => Promise<void>;
  frameResult: { frame: NameFrame; duplicateRefund: number } | null;
  language: Language;
  packResult: { skin: Skin; duplicateRefund: number } | null;
  texts: Texts;
};

export function SkinShop({
  user,
  onBuy,
  onBuyFrame,
  onEquip,
  onEquipFrame,
  onOpenFramePack,
  onOpenPack,
  frameResult,
  language,
  packResult,
  texts,
}: SkinShopProps) {
  const [openingPackId, setOpeningPackId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const openingPack = skinPacks.find((pack) => pack.id === openingPackId) ?? null;

  async function openPack(packId: string) {
    if (busy) return;
    setBusy(true);
    setOpeningPackId(packId);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 1150));
      await onOpenPack(packId);
    } finally {
      setOpeningPackId(null);
      setBusy(false);
    }
  }

  async function openFramePack(packId: string) {
    if (busy) return;
    setBusy(true);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 1150));
      await onOpenFramePack(packId);
    } finally {
      setBusy(false);
    }
  }

  async function runAction(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel stack">
      {openingPack ? (
        <PackOpeningOverlay pack={openingPack} texts={texts} title={getPackName(openingPack, language)} />
      ) : null}
      <div>
        <p className="eyebrow">{texts.shopTitle}</p>
        <h2>{texts.skins}</h2>
        <p className="message">{texts.youHaveCoins} {user.coins} {texts.coins}.</p>
      </div>

      <div className="pack-grid">
        {skinPacks.map((pack) => (
          <article className={openingPackId === pack.id ? 'pack-card opening' : 'pack-card'} key={pack.id}>
            <PackArt opening={openingPackId === pack.id} pack={pack} />
            <div>
              <p className="eyebrow">{getPackName(pack, language)}</p>
              <h3>{pack.price} {texts.coins}</h3>
              <p>{getPackDescription(pack, language)}</p>
              <small>
                {texts.rare} {pack.weights.rare}% | {texts.epic} {pack.weights.epic}% | {texts.legend} {pack.weights.legendary}%
              </small>
            </div>
            <button
              disabled={busy || user.coins < pack.price}
              onClick={() => void openPack(pack.id)}
              type="button"
            >
              {openingPackId === pack.id ? texts.opening : texts.open}
            </button>
          </article>
        ))}
      </div>

      {packResult ? (
        <article className="pack-result">
          <SkinBadge language={language} skinId={packResult.skin.id} />
          <div>
            <p className="eyebrow">{getRarityLabel(packResult.skin.rarity, texts)}</p>
            <h3>{texts.youGot} {getSkinName(packResult.skin, language)}</h3>
            {packResult.duplicateRefund > 0 ? (
              <p>{texts.duplicateReward}: +{packResult.duplicateRefund} {texts.coins}.</p>
            ) : (
              <p>{texts.newCharacterAdded}</p>
            )}
          </div>
        </article>
      ) : null}

      <NameFrameShop
        frameResult={frameResult}
        busy={busy}
        onBuyFrame={(frameId) => runAction(() => onBuyFrame(frameId))}
        onEquipFrame={(frameId) => runAction(() => onEquipFrame(frameId))}
        onOpenFramePack={openFramePack}
        language={language}
        texts={texts}
        user={user}
      />

      <div className="skin-grid">
        {skins.map((skin) => {
          const owned = user.owned_skin_ids.includes(skin.id);
          const active = user.active_skin_id === skin.id;
          const canBuy = user.coins >= skin.price;
          const packOnly = skin.packOnly && !owned;

          return (
            <article className={active ? 'skin-card active' : 'skin-card'} key={skin.id}>
              <SkinBadge language={language} skinId={skin.id} />
              <div>
                <h3>{getSkinName(skin, language)}</h3>
                {skin.ability ? <p className="skin-ability">{texts.ability}: {texts.removeWrongAnswerAbility}</p> : null}
                <p>
                  {getRarityLabel(skin.rarity, texts)} | {skin.packOnly ? texts.packOnly : skin.price === 0 ? texts.free : `${skin.price} ${texts.coins}`}
                </p>
              </div>
              {owned ? (
                <button disabled={busy || active} onClick={() => void runAction(() => onEquip(skin.id))} type="button">
                  {active ? texts.equipped : texts.equip}
                </button>
              ) : packOnly ? (
                <button disabled type="button">
                  {texts.packOnly}
                </button>
              ) : (
                <button disabled={busy || !canBuy} onClick={() => void runAction(() => onBuy(skin.id))} type="button">
                  {texts.buy}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function getRarityLabel(rarity: Skin['rarity'], texts: Texts) {
  if (rarity === 'common') return texts.common;
  if (rarity === 'rare') return texts.rare;
  if (rarity === 'epic') return texts.epic;
  return texts.legendary;
}
