import Image from "next/image";

import type { ArtworkImageProps } from "./types";

export default function ArtworkImage({
  priority = false,
  ...props
}: ArtworkImageProps) {
  return (
    <Image
      {...props}
      priority={priority}
      quality={75}
    />
  );
}