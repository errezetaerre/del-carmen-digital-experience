import type { ImageProps } from "next/image";
import type { ReactNode } from "react";

export type ArtworkImageProps = ImageProps;

export interface ArtworkFrameProps {
  children: React.ReactNode;
  className?: string;
  aspectRatio?: string;
}

import type { Artwork } from "@/domains/artworks";

export interface ArtworkMetadataProps {
  artwork: Artwork;
}