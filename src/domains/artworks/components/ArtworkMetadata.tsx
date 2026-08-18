import type { ArtworkProps } from "./types";

export default function ArtworkMetadata({
  artwork,
}: ArtworkProps) {
  const techniqueLabel = `${artwork.medium} on ${artwork.support}`;

  return (
    <div className="mt-8 space-y-3 text-center">
      <h2 className="text-2xl font-light tracking-wide">
        {artwork.title}
      </h2>

      {artwork.quote && (
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">
          {artwork.quote}
        </p>
      )}

      <p className="text-xs uppercase tracking-[0.35em] text-white/60">
        {techniqueLabel}
      </p>

      <p className="text-sm text-white/45">
        {artwork.year}
      </p>

      <p className="text-sm text-white/40">
        {artwork.dimensions.width} ×{" "}
        {artwork.dimensions.height}{" "}
        {artwork.dimensions.unit}
      </p>
    </div>
  );
}