import {
  ArtworkFrame,
  ArtworkImage,
  ArtworkPlaceholder,
} from "@/shared/ui/artwork";

import ArtworkMetadata from "./ArtworkMetadata";

import type { ArtworkProps } from "./types";

export default function ArtworkHero({
  artwork,
}: ArtworkProps) {
  return (
    <article className="
      flex 
      flex-col 
      items-center 
      lg:items-end 
      lg:-translate-y-4
      
      "
    >

      <ArtworkFrame>

        {artwork.image.src ? (
        <ArtworkImage
          src={artwork.image.src}
          alt={artwork.image.alt}
          fill
          sizes="(min-width: 1280px) 520px, (min-width: 768px) 460px, 340px"
          className="object-contain"
        />
        ) : (
          <ArtworkPlaceholder />
        )}

      </ArtworkFrame>

      <ArtworkMetadata artwork={artwork} />

    </article>
  );
}