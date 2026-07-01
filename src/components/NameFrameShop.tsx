import { useState } from 'react';
import type { NameFrame } from '../lib/nameFrameCatalog';
import { nameFramePacks, nameFrames } from '../lib/nameFrameCatalog';
import type { LocalUser } from '../lib/quizTypes';
import { PackArt } from './PackArt';
import { PackOpeningOverlay } from './PackOpeningOverlay';

type NameFrameShopProps = {
  busy: boolean;
  frameResult: { frame: NameFrame; duplicateRefund: number } | null;
  onBuyFrame: (frameId: string) => Promise<void>;
  onEquipFrame: (frameId: string) => Promise<void>;
  onOpenFramePack: (packId: string) => Promise<void>;
  user: LocalUser;
};

export function NameFrameShop({
  busy,
  frameResult,
  onBuyFrame,
  onEquipFrame,
  onOpenFramePack,
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
      {openingPack ? <PackOpeningOverlay pack={openingPack} /> : null}
      <div>
        <p className="eyebrow">Nickname borders</p>
        <h2>Name styles</h2>
      </div>

      <div className="pack-grid">
        {nameFramePacks.map((pack) => (
          <article className={openingPackId === pack.id ? 'pack-card opening' : 'pack-card'} key={pack.id}>
            <PackArt opening={openingPackId === pack.id} pack={pack} />
            <div>
              <p className="eyebrow">{pack.name}</p>
              <h3>{pack.price} coins</h3>
              <p>{pack.description}</p>
              <small>Rare {pack.weights.rare}% | Epic {pack.weights.epic}% | Legend {pack.weights.legendary}%</small>
            </div>
            <button disabled={busy || !!openingPackId || user.coins < pack.price} onClick={() => void openPack(pack.id)} type="button">
              {openingPackId === pack.id ? 'Opening' : 'Open'}
            </button>
          </article>
        ))}
      </div>

      {frameResult ? (
        <article className="pack-result">
          <span className={`name-frame ${frameResult.frame.className}`}>{user.display_name}</span>
          <div>
            <p className="eyebrow">{frameResult.frame.rarity}</p>
            <h3>You got {frameResult.frame.name}</h3>
            {frameResult.duplicateRefund > 0 ? (
              <p>Duplicate reward: +{frameResult.duplicateRefund} coins back.</p>
            ) : (
              <p>New nickname border added to your styles.</p>
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
            onBuyFrame={onBuyFrame}
            onEquipFrame={onEquipFrame}
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
  onBuyFrame,
  onEquipFrame,
  user,
}: {
  frame: NameFrame;
  busy: boolean;
  onBuyFrame: (frameId: string) => Promise<void>;
  onEquipFrame: (frameId: string) => Promise<void>;
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
        <h3>{frame.name}</h3>
        <p>{frame.rarity} | {frame.packOnly ? 'Pack only' : frame.price === 0 ? 'Free' : `${frame.price} coins`}</p>
      </div>
      {owned ? (
        <button disabled={busy || active} onClick={() => void onEquipFrame(frame.id)} type="button">
          {active ? 'Equipped' : 'Equip'}
        </button>
      ) : packOnly ? (
        <button disabled type="button">Pack only</button>
      ) : (
        <button disabled={busy || !canBuy} onClick={() => void onBuyFrame(frame.id)} type="button">Buy</button>
      )}
    </article>
  );
}
