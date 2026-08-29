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

     Full-bleed visual environment.
     This component now receives the complete Hero viewport.
     ========================================================= */

  return (
    <div
      className="
        relative
        h-[var(--hero-height)]
        w-full
        overflow-hidden
      "
    >
      {/* =====================================================
          ARTWORK VISUAL LAYER
         ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          right-0
          md:-right-[15%]
          md:left-0

          lg:left-[18%]
          [@media(orientation:landscape)_and_(max-height:600px)]:!right-15
          [@media(orientation:landscape)_and_(max-height:600px)]:!left-0
          
        "
      >
        <ArtworkImage
          src={heroLandscapeImage.src}
          alt={heroLandscapeImage.alt}
          fill
          priority
          sizes="
            (min-width: 1440px) 82vw,
            (min-width: 1024px) 82vw,
            (min-width: 768px) 76vw,
            100vw
          "
          className="
            object-cover
            object-right-top

            [@media(orientation:landscape)_and_(max-height:600px)]:!object-right
            
          "
        />
      </div>

      {/* =====================================================
          LEFT ARTWORK INTEGRATION

          This does NOT define the black content column.
          It only blends the artwork into the black environment.

          clamp() prevents the transition from collapsing
          between approximately 768–900px.
         ===================================================== */}

      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          inset-y-0
          left-0
          z-10

          hidden
          w-[clamp(360px,38vw,680px)]

          bg-gradient-to-r
          from-black
          from-[38%]
          via-black/85
          via-[62%]
          to-transparent

          md:block

          [@media(orientation:landscape)_and_(max-height:600px)]:!w-[42vw]
        "
      />

      {/* =====================================================
          ARTWORK INFORMATION
         ===================================================== */}

      <div
        className="
          absolute
          z-30

          md:right-[max(2rem,var(--page-gutter))]
          md:top-[30%]
          md:-translate-y-1/2

          xl:right-[max(2rem,var(--page-gutter))]
          xl:top-[78%]
          xl:bottom-auto
          xl:-translate-y-1/2

          [@media(min-width:768px)_and_(max-width:1366px)_and_(min-height:700px)_and_(orientation:portrait)]:!right-12
          [@media(min-width:768px)_and_(max-width:1366px)_and_(min-height:700px)_and_(orientation:portrait)]:!top-[68%]
          [@media(min-width:768px)_and_(max-width:1366px)_and_(min-height:700px)_and_(orientation:portrait)]:!bottom-auto
          [@media(min-width:768px)_and_(max-width:1366px)_and_(min-height:700px)_and_(orientation:portrait)]:!-translate-y-1/2

          [@media(min-width:768px)_and_(max-width:1366px)_and_(min-height:700px)_and_(orientation:landscape)]:!right-24
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