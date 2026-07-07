import { useState } from 'react';
import type { LocalUser } from '../lib/quizTypes';
import type { NameFrame } from '../lib/nameFrameCatalog';
import { skinPacks } from '../lib/packCatalog';
import type { Skin } from '../lib/skinCatalog';
import { skins } from '../lib/skinCatalog';
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
  packResult: { skin: Skin; duplicateRefund: number } | null;
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
  packResult,
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
      {openingPack ? <PackOpeningOverlay pack={openingPack} /> : null}
      <div>
        <p className="eyebrow">Shop</p>
        <h2>Skins</h2>
        <p className="message">You have {user.coins} coins.</p>
      </div>

      <div className="pack-grid">
        {skinPacks.map((pack) => (
          <article className={openingPackId === pack.id ? 'pack-card opening' : 'pack-card'} key={pack.id}>
            <PackArt opening={openingPackId === pack.id} pack={pack} />
            <div>
              <p className="eyebrow">{pack.name}</p>
              <h3>{pack.price} coins</h3>
              <p>{pack.description}</p>
              <small>
                Rare {pack.weights.rare}% | Epic {pack.weights.epic}% | Legend {pack.weights.legendary}%
              </small>
            </div>
            <button
              disabled={busy || user.coins < pack.price}
              onClick={() => void openPack(pack.id)}
              type="button"
            >
              {openingPackId === pack.id ? 'Opening' : 'Open'}
            </button>
          </article>
        ))}
      </div>

      {packResult ? (
        <article className="pack-result">
          <SkinBadge skinId={packResult.skin.id} />
          <div>
            <p className="eyebrow">{packResult.skin.rarity}</p>
            <h3>You got {packResult.skin.name}</h3>
            {packResult.duplicateRefund > 0 ? (
              <p>Duplicate reward: +{packResult.duplicateRefund} coins back.</p>
            ) : (
              <p>New character added to your skins.</p>
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
              <SkinBadge skinId={skin.id} />
              <div>
                <h3>{skin.name}</h3>
                {skin.ability ? <p className="skin-ability">Ability: {skin.ability.description}</p> : null}
                <p>
                  {skin.rarity} | {skin.packOnly ? 'Pack only' : skin.price === 0 ? 'Free' : `${skin.price} coins`}
                </p>
              </div>
              {owned ? (
                <button disabled={busy || active} onClick={() => void runAction(() => onEquip(skin.id))} type="button">
                  {active ? 'Equipped' : 'Equip'}
                </button>
              ) : packOnly ? (
                <button disabled type="button">
                  Pack only
                </button>
              ) : (
                <button disabled={busy || !canBuy} onClick={() => void runAction(() => onBuy(skin.id))} type="button">
                  Buy
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
