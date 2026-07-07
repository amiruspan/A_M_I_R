import type { Texts } from '../lib/language';
import { PackArt } from './PackArt';

type PackOpeningOverlayProps = {
  pack: {
    name: string;
    coverColor: string;
    accentColor: string;
  };
  texts: Texts;
  title?: string;
};

export function PackOpeningOverlay({ pack, texts, title }: PackOpeningOverlayProps) {
  return (
    <div className="pack-overlay" role="status" aria-live="polite">
      <div className="pack-overlay-burst" />
      <div className="pack-overlay-card">
        <PackArt opening pack={pack} />
        <p className="eyebrow">{texts.opening}</p>
        <h2>{title ?? pack.name}</h2>
      </div>
      <span className="overlay-spark overlay-spark-one" />
      <span className="overlay-spark overlay-spark-two" />
      <span className="overlay-spark overlay-spark-three" />
    </div>
  );
}
