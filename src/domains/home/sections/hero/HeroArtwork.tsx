import { ArtworkImage } from "@/shared/ui/artwork";
import { getFeaturedArtwork } from "@/domains/home/services";

import ArtworkInfo from "./ArtworkInfo";

export default function HeroArtwork() {
  const artwork = getFeaturedArtwork();

  if (!artwork) {
    return null;
  }

  return (
    <div className="relative w-full">
      {/* Artwork canvas */}
      <div
        className="
          relative
          right-0
          top-0
          aspect-[16/9]
          w-full

          md:right-[40vw]
          md:min-h-screen
          md:w-[min(166vw,1060px)]

          lg:right-[10vw]

          [@media(orientation:landscape)_and_(max-height:600px)]:!right-[-4vw]
          [@media(orientation:landscape)_and_(max-height:600px)]:!min-h-0
          [@media(orientation:landscape)_and_(max-height:600px)]:!w-[110%]
        "
      >
        <ArtworkImage
          src={artwork.image.src}
          alt={artwork.image.alt}
          fill
          sizes="
            (min-width: 1920px) 66vw,
            (min-width: 1024px) 66vw,
            (min-width: 768px) 60vw,
            100vw
          "
          className="
            origin-top-right
            object-contain
            object-right-top
            scale-120

            md:scale-[1.08]

            lg:scale-[1.28]

            [@media(orientation:landscape)_and_(max-height:600px)]:!scale-[1.02]
            [@media(orientation:landscape)_and_(max-height:600px)]:!object-right
          "
        />

        {/* Tablet integration */}
        <div
          aria-hidden
          className="
            pointer-events-none
            absolute
            left-0
            top-0
            hidden
            h-screen
            w-[52%]
            bg-gradient-to-r
            from-black
            via-black/75
            to-transparent

            md:block
            lg:hidden

            [@media(orientation:landscape)_and_(max-height:600px)]:!hidden
          "
        />
      </div>

      {/* Artwork information */}
      <div
        className="
          absolute
          bottom-1
          left-0
          top-5
          z-20
          w-full
          px-20

          md:bottom-20
          md:left-auto
          md:right-[0.1vw]
          md:w-auto
          md:px-0

          lg:bottom-1
          lg:right-0

          [@media(orientation:landscape)_and_(max-height:600px)]:!bottom-4
          [@media(orientation:landscape)_and_(max-height:600px)]:!left-auto
          [@media(orientation:landscape)_and_(max-height:600px)]:!right-4
          [@media(orientation:landscape)_and_(max-height:600px)]:!top-auto
          [@media(orientation:landscape)_and_(max-height:600px)]:!w-auto
          [@media(orientation:landscape)_and_(max-height:600px)]:!px-0
        "
      >
        <ArtworkInfo artwork={artwork} />
      </div>
    </div>
  );
}