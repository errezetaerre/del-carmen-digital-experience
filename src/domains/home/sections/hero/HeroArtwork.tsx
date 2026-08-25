import Image from "next/image";

import { ArtworkImage } from "@/shared/ui/artwork";
import { getHeroArtwork } from "@/domains/home/services";

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
  const artwork = getHeroArtwork();

  if (!artwork) {
    return null;
  }

  const primaryImage =
    artwork.images.primary;

  const heroPortraitImage =
    artwork.images.heroPortrait ??
    primaryImage;

  const heroLandscapeImage =
    artwork.images.heroLandscape ??
    primaryImage;



  /* =========================================================
     MOBILE PORTRAIT — ARTWORK
     ========================================================= */

  if (mode === "mobile") {
    return (
      <div
        className="
          absolute
          inset-0
          h-full
          w-full
        "
      >
        <Image
          src={heroPortraitImage.src}
          alt={heroPortraitImage.alt}
          fill
          priority
          sizes="100vw"
          className="
            object-cover
            object-left-center
            -translate-y-[2%]
            scale-[1.08]
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
            h-[34%]
            bg-gradient-to-b
            from-black/90
            via-black/45
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

        {/* Vignette */}
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
      <div
        className="
          relative
          z-30
          w-full
        "
      >
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
     TABLET / DESKTOP / MOBILE LANDSCAPE
     ========================================================= */

  return (
    <div
      className="
        relative
        h-[var(--hero-height)]
        w-full
        min-w-0
      "
    >
      {/* Artwork visual layer */}
      <div
        className="
          pointer-events-none
          absolute
          top-0
          h-[var(--hero-height)]

         md:right-[-6vw]
md:w-[min(118vw,1060px)]

lg:right-0
lg:w-[min(68vw,1180px)]

          [@media(orientation:landscape)_and_(max-height:600px)]:!right-[-6vw]
          [@media(orientation:landscape)_and_(max-height:600px)]:!w-[150%]
        "
      >
        <ArtworkImage
          src={heroLandscapeImage.src}
          alt={heroLandscapeImage.alt}
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

            md:scale-[1.04]

            lg:scale-[1.06]

            [@media(min-width:768px)_and_(max-width:1366px)_and_(min-height:700px)]:!scale-100
            [@media(min-width:768px)_and_(max-width:1366px)_and_(min-height:700px)]:!object-cover
            [@media(min-width:768px)_and_(max-width:1366px)_and_(min-height:700px)]:!object-right-top

            [@media(orientation:landscape)_and_(max-height:600px)]:!scale-[1.02]
            [@media(orientation:landscape)_and_(max-height:600px)]:!object-cover
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
            h-full
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
    z-30

    md:right-10
    md:top-[60%]
    md:-translate-y-1/2

    xl:right-12
xl:top-[52%]
xl:bottom-auto
xl:-translate-y-1/2

    [@media(min-width:768px)_and_(max-width:1366px)_and_(min-height:700px)_and_(orientation:portrait)]:!right-12 
    [@media(min-width:768px)_and_(max-width:1366px)_and_(min-height:700px)_and_(orientation:portrait)]:!top-[68%]
    [@media(min-width:768px)_and_(max-width:1366px)_and_(min-height:700px)_and_(orientation:portrait)]:!bottom-auto
    [@media(min-width:768px)_and_(max-width:1366px)_and_(min-height:700px)_and_(orientation:portrait)]:!-translate-y-1/2

    [@media(min-width:768px)_and_(max-width:1366px)_and_(min-height:700px)_and_(orientation:landscape)]:!right-12
    [@media(min-width:768px)_and_(max-width:1366px)_and_(min-height:700px)_and_(orientation:landscape)]:!top-[70%]
    [@media(min-width:768px)_and_(max-width:1366px)_and_(min-height:700px)_and_(orientation:landscape)]:!bottom-auto
    [@media(min-width:768px)_and_(max-width:1366px)_and_(min-height:700px)_and_(orientation:landscape)]:!-translate-y-1/2

    [@media(orientation:landscape)_and_(max-height:600px)]:!right-8
    [@media(orientation:landscape)_and_(max-height:600px)]:!bottom-6
    [@media(orientation:landscape)_and_(max-height:600px)]:!top-auto
    [@media(orientation:landscape)_and_(max-height:600px)]:!translate-y-0
  "
      >
        <ArtworkInfo artwork={artwork} />
      </div>
    </div>
  );
}