import Image from "next/image";

import { ArtworkImage } from "@/shared/ui/artwork";
import { getFeaturedArtwork } from "@/domains/home/services";
import { Button } from "@/shared/ui/button";

import ArtworkInfo from "./ArtworkInfo";
import { HERO_CTA } from "./constants";

type HeroArtworkMode =
  | "mobile"
  | "mobileInfo"
  | "desktop";

interface HeroArtworkProps {
  mode?: HeroArtworkMode;
}

export default function HeroArtwork({
  mode = "desktop",
}: HeroArtworkProps) {
  const artwork = getFeaturedArtwork();

  if (!artwork) {
    return null;
  }

  /* =========================================================
     MOBILE PORTRAIT — ARTWORK ENVIRONMENT
     ========================================================= */

  if (mode === "mobile") {
    return (
      <div className="absolute inset-0">
        <Image
          src="/artworks/epifania_nupcial_mobile.png"
          alt={artwork.image.alt}
          fill
          priority
          sizes="100vw"
          className="
            object-cover
            object-center
          "
        />

        {/* Top reading gradient */}
        <div
          aria-hidden
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            h-[46%]
            bg-gradient-to-b
            from-black/95
            via-black/65
            to-transparent
          "
        />

        {/* Bottom integration gradient */}
        <div
          aria-hidden
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-[48%]
            bg-gradient-to-t
            from-black/95
            via-black/60
            to-transparent
          "
        />

        {/* Soft vignette */}
        <div
          aria-hidden
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.30)_100%)]
          "
        />
      </div>
    );
  }

  /* =========================================================
     MOBILE PORTRAIT — INFO + CTA
     ========================================================= */

  if (mode === "mobileInfo") {
    return (
      <div className="relative z-30 w-full">
        <ArtworkInfo artwork={artwork} />

        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            variant="bronzeUnderline"
          >
            {HERO_CTA}
          </Button>
        </div>
      </div>
    );
  }

  /* =========================================================
     TABLET / DESKTOP / LANDSCAPE
     ========================================================= */

  return (
    <div
      className="
        relative
        h-full
        w-full
        min-w-0

        md:min-h-screen

        [@media(orientation:landscape)_and_(max-height:600px)]:!min-h-0
      "
    >
      {/* Artwork visual layer */}
      <div
        className="
          pointer-events-none
          absolute
          top-0

          md:right-[-6vw]
          md:h-screen
          md:w-[min(118vw,1060px)]

          lg:right-[-11vw]

          [@media(orientation:landscape)_and_(max-height:600px)]:!right-[-4vw]
          [@media(orientation:landscape)_and_(max-height:600px)]:!h-full
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

      {/* Artwork information UI layer */}
      <div
        className="
          absolute
          z-30

          md:bottom-16
          md:right-4

          lg:bottom-10
          lg:right-6

          xl:right-8

          [@media(orientation:landscape)_and_(max-height:600px)]:!bottom-4
          [@media(orientation:landscape)_and_(max-height:600px)]:!right-2
        "
      >
        <ArtworkInfo artwork={artwork} />
      </div>
    </div>
  );
}