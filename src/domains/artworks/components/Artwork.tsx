import {
  ArtworkFrame,
  ArtworkImage,
  ArtworkPlaceholder,
} from "@/shared/ui/artwork";

import ArtworkMetadata from "./ArtworkMetadata";

import type { ArtworkProps } from "./types";

export default function Artwork({
  artwork,
}: ArtworkProps) {
  return (
    <article className="flex flex-col items-center">

      <ArtworkFrame>

        {artwork.image.src ? (

          <ArtworkImage
            src={artwork.image.src}
            alt={artwork.image.alt}
            width={artwork.dimensions.width}
            height={artwork.dimensions.height}
            priority
            className="h-full w-full object-cover"
          />

        ) : (

          <ArtworkPlaceholder />

        )}

      </ArtworkFrame>

      <ArtworkMetadata artwork={artwork} />

    </article>
  );
}