import { getSkin } from '../lib/skinCatalog';

type SkinBadgeProps = {
  skinId: string;
};

export function SkinBadge({ skinId }: SkinBadgeProps) {
  const skin = getSkin(skinId);

  return (
    <span
      aria-label={`${skin.name} skin`}
      className={`skin-badge skin-badge--${skin.shape} skin-badge--${skin.mood}`}
      style={{ backgroundColor: skin.color, borderColor: skin.accentColor }}
      title={skin.name}
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
