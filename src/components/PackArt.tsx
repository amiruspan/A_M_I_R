type PackArtProps = {
  opening: boolean;
  pack: {
    coverColor: string;
    accentColor: string;
  };
};

export function PackArt({ opening, pack }: PackArtProps) {
  return (
    <span
      aria-hidden="true"
      className={opening ? 'pack-art opening' : 'pack-art'}
      style={{ backgroundColor: pack.coverColor, borderColor: pack.accentColor }}
    >
      <span className="pack-lid" style={{ backgroundColor: pack.accentColor }} />
      <span className="pack-star">?</span>
      <span className="pack-eye pack-eye-left" />
      <span className="pack-eye pack-eye-right" />
      <span className="pack-spark pack-spark-one" />
      <span className="pack-spark pack-spark-two" />
    </span>
  );
}
