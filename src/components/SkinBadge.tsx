import { getSkin } from '../lib/skinCatalog';
import type { Language } from '../lib/language';
import { getSkinName } from '../lib/skinCatalog';

type SkinBadgeProps = {
  language?: Language;
  skinId: string;
};

export function SkinBadge({ language = 'en', skinId }: SkinBadgeProps) {
  const skin = getSkin(skinId);
  const skinName = getSkinName(skin, language);

  return (
    <span
      aria-label={`${skinName} skin`}
      className={`skin-badge skin-badge--${skin.shape} skin-badge--${skin.mood}`}
      style={{ backgroundColor: skin.color, borderColor: skin.accentColor }}
      title={skinName}
    >
      <span className="skin-shine" style={{ backgroundColor: skin.accentColor }} />
      <span className="skin-eyes">
        <span />
        <span />
      </span>
      <span className="skin-mouth" />
    </span>
  );
}
