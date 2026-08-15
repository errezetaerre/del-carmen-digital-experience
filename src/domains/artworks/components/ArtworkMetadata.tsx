import type { ArtworkProps } from "./types";

export default function ArtworkMetadata({
  artwork,
}: ArtworkProps) {
  return (
    <div className="mt-8 space-y-3 text-center">

      <h2 className="text-2xl font-light tracking-wide">
        {artwork.title}
      </h2>

      <p className="text-xs uppercase tracking-[0.35em] text-white/60">
        {artwork.quote}
      </p>

      <p className="text-xs uppercase tracking-[0.35em] text-white/60">
        {artwork.technique}
      </p>

      <p className="text-sm text-white/45">
        {artwork.year}
      </p>

      <p className="text-sm text-white/40">
        {artwork.dimensions.width} × {artwork.dimensions.height}{" "}
        {artwork.dimensions.unit}
      </p>

    </div>
  );
}