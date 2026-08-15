import type { ArtworkMetadataProps } from "./types";

export default function ArtworkMetadata({
  artwork,
}: ArtworkMetadataProps) {
  return (
    <div className="space-y-2 text-center">

      <h2 className="text-xl font-light tracking-wide">
        {artwork.title}
      </h2>

      <p className="text-sm uppercase tracking-[0.25em] text-white/60">
        {artwork.technique}
      </p>

      <p className="text-sm text-white/50">
        {artwork.year}
      </p>

    </div>
  );
}