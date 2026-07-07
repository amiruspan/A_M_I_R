import { useState } from 'react';
import type { Language, Texts } from '../lib/language';
import type { NameFrame } from '../lib/nameFrameCatalog';
import {
  getNameFrameName,
  getNameFramePackDescription,
  getNameFramePackName,
  nameFramePacks,
  nameFrames,
} from '../lib/nameFrameCatalog';
import type { LocalUser } from '../lib/quizTypes';
import { PackArt } from './PackArt';
import { PackOpeningOverlay } from './PackOpeningOverlay';

type NameFrameShopProps = {
  busy: boolean;
  frameResult: { frame: NameFrame; duplicateRefund: number } | null;
  onBuyFrame: (frameId: string) => Promise<void>;
  onEquipFrame: (frameId: string) => Promise<void>;
  onOpenFramePack: (packId: string) => Promise<void>;
  language: Language;
  texts: Texts;
  user: LocalUser;
};

export function NameFrameShop({
  busy,
  frameResult,
  onBuyFrame,
  onEquipFrame,
  onOpenFramePack,
  language,
  texts,
  user,
}: NameFrameShopProps) {
  const [openingPackId, setOpeningPackId] = useState<string | null>(null);
  const openingPack = nameFramePacks.find((pack) => pack.id === openingPackId) ?? null;

  async function openPack(packId: string) {
    if (busy) return;
    setOpeningPackId(packId);
    try {
      await onOpenFramePack(packId);
    } finally {
      setOpeningPackId(null);
    }
  }

  return (
    <>
      {openingPack ? (
        <PackOpeningOverlay pack={openingPack} texts={texts} title={getNameFramePackName(openingPack, language)} />
      ) : null}
      <div>
        <p className="eyebrow">{texts.nicknameBorders}</p>
        <h2>{texts.nameStyles}</h2>
      </div>

      <div className="pack-grid">
        {nameFramePacks.map((pack) => (
          <article className={openingPackId === pack.id ? 'pack-card opening' : 'pack-card'} key={pack.id}>
            <PackArt opening={openingPackId === pack.id} pack={pack} />
            <div>
              <p className="eyebrow">{getNameFramePackName(pack, language)}</p>
              <h3>{pack.price} {texts.coins}</h3>
              <p>{getNameFramePackDescription(pack, language)}</p>
              <small>{texts.rare} {pack.weights.rare}% | {texts.epic} {pack.weights.epic}% | {texts.legend} {pack.weights.legendary}%</small>
            </div>
            <button disabled={busy || !!openingPackId || user.coins < pack.price} onClick={() => void openPack(pack.id)} type="button">
              {openingPackId === pack.id ? texts.opening : texts.open}
            </button>
          </article>
        ))}
      </div>

      {frameResult ? (
        <article className="pack-result">
          <span className={`name-frame ${frameResult.frame.className}`}>{user.display_name}</span>
          <div>
            <p className="eyebrow">{getRarityLabel(frameResult.frame.rarity, texts)}</p>
            <h3>{texts.youGot} {getNameFrameName(frameResult.frame, language)}</h3>
            {frameResult.duplicateRefund > 0 ? (
              <p>{texts.duplicateReward}: +{frameResult.duplicateRefund} {texts.coins}.</p>
            ) : (
              <p>{texts.newNameFrameAdded}</p>
            )}
          </div>
        </article>
      ) : null}

      <div className="frame-grid">
        {nameFrames.map((frame) => (
          <FrameCard
            frame={frame}
            busy={busy}
            key={frame.id}
            language={language}
            onBuyFrame={onBuyFrame}
            onEquipFrame={onEquipFrame}
            texts={texts}
            user={user}
          />
        ))}
      </div>
    </>
  );
}

function FrameCard({
  frame,
  busy,
  language,
  onBuyFrame,
  onEquipFrame,
  texts,
  user,
}: {
  frame: NameFrame;
  busy: boolean;
  language: Language;
  onBuyFrame: (frameId: string) => Promise<void>;
  onEquipFrame: (frameId: string) => Promise<void>;
  texts: Texts;
  user: LocalUser;
}) {
  const owned = user.owned_name_frame_ids.includes(frame.id);
  const active = user.active_name_frame_id === frame.id;
  const canBuy = user.coins >= frame.price;
  const packOnly = frame.packOnly && !owned;

  return (
    <article className={active ? 'frame-card active' : 'frame-card'}>
      <span className={`name-frame ${frame.className}`}>{user.display_name}</span>
      <div>
        <h3>{getNameFrameName(frame, language)}</h3>
        <p>{getRarityLabel(frame.rarity, texts)} | {frame.packOnly ? texts.packOnly : frame.price === 0 ? texts.free : `${frame.price} ${texts.coins}`}</p>
      </div>
      {owned ? (
        <button disabled={busy || active} onClick={() => void onEquipFrame(frame.id)} type="button">
          {active ? texts.equipped : texts.equip}
        </button>
      ) : packOnly ? (
        <button disabled type="button">{texts.packOnly}</button>
      ) : (
        <button disabled={busy || !canBuy} onClick={() => void onBuyFrame(frame.id)} type="button">{texts.buy}</button>
      )}
    </article>
  );
}

function getRarityLabel(rarity: NameFrame['rarity'], texts: Texts) {
  if (rarity === 'common') return texts.common;
  if (rarity === 'rare') return texts.rare;
  if (rarity === 'epic') return texts.epic;
  return texts.legendary;
}
