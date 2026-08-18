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
  const primaryImage = artwork.images.primary;

  return (
    <article className="flex flex-col items-center">
      <ArtworkFrame>
        {primaryImage.src ? (
          <ArtworkImage
            src={primaryImage.src}
            alt={primaryImage.alt}
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