import Image from "next/image";

import type { ArtworkImageProps } from "./types";

export default function ArtworkImage({
  alt,
  priority = false,
  ...props
}: ArtworkImageProps) {
  return (
    <Image
      {...props}
      alt={alt}
      priority={priority}
      quality={75}
    />
  );
}
