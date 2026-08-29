import HeroArtwork from "./HeroArtwork";
import HeroBackground from "./HeroBackground";
import HeroBrand from "./HeroBrand";
import HeroAtmosphere from "./HeroAtmosphere";
import HeroLighting from "./HeroLighting";

import { Container } from "@/shared/layout";

export default function Hero() {
  return (
    <section
      className="
        relative
        h-[var(--hero-height)]
        w-full
        min-w-0
        overflow-hidden

        [--hero-height:100svh]

        md:[--hero-height:100vh]

        // [@media(min-width:768px)_and_(max-width:1366px)_and_(min-height:700px)_and_(orientation:portrait)]:[--hero-height:950px]

        // [@media(min-width:768px)_and_(max-width:1366px)_and_(min-height:700px)_and_(orientation:landscape)]:[--hero-height:900px]

        // [@media(orientation:landscape)_and_(max-height:600px)]:[--hero-height:100svh]

        [--hero-height:100svh]

        md:[--hero-height:100dvh]

        [@media(orientation:landscape)_and_(max-height:600px)]:[--hero-height:100svh]
      "
    >
      {/* =====================================================
          MOBILE PORTRAIT — ARTWORK ENVIRONMENT
         ===================================================== */}

      <div
        className="
          absolute
          inset-0
          z-0

          md:hidden

          [@media(orientation:landscape)_and_(max-height:600px)]:!hidden
        "
      >
        <HeroArtwork mode="mobile" />
      </div>

      {/* =====================================================
          TABLET / DESKTOP — FULL-BLEED ARTWORK

          Important:
          This visual layer belongs to the viewport,
          not to Container.
         ===================================================== */}

      <div
        className="
          absolute
          inset-0
          z-0
          hidden

          md:block

          [@media(orientation:landscape)_and_(max-height:600px)]:!block
        "
      >
        <HeroArtwork mode="desktop" />
      </div>

      {/* =====================================================
          GLOBAL ENVIRONMENT
         ===================================================== */}

      <HeroBackground />
      <HeroAtmosphere />
      <HeroLighting />

      {/* =====================================================
          MOBILE PORTRAIT — CONTENT
         ===================================================== */}

      <div
        className="
          relative
          z-20
          h-[var(--hero-height)]

          md:hidden

          [@media(orientation:landscape)_and_(max-height:600px)]:!hidden
        "
      >
        <Container className="relative h-full">
          {/* Brand */}

          <div className="pt-24">
            <HeroBrand />
          </div>

          {/* Artwork info + CTA */}

          <div
            className="
              absolute
              bottom-[12svh]
              left-[var(--page-gutter)]
              right-[var(--page-gutter)]
              z-30
            "
          >
            <HeroArtwork mode="mobileInfo" />
          </div>
        </Container>
      </div>

      {/* =====================================================
          TABLET / DESKTOP / MOBILE LANDSCAPE — CONTENT

          Container now controls content only.
         ===================================================== */}

      <Container
        className="
          relative
          z-20
          hidden
          h-[var(--hero-height)]

          md:block

          [@media(orientation:landscape)_and_(max-height:600px)]:!block
        "
      >
        <div
          className="
            grid
            h-full
            w-full
            min-w-0

            md:grid-cols-[42%_58%]

            lg:grid-cols-[38%_62%]

            [@media(orientation:landscape)_and_(max-height:600px)]:!grid-cols-[38%_62%]
          "
        >
          {/* Brand */}

          <div
            className="
              relative
              z-30
              flex
              h-full
              min-w-0
              flex-col
              pt-24

              lg:pt-28

              [@media(orientation:landscape)_and_(max-height:600px)]:!justify-center
              [@media(orientation:landscape)_and_(max-height:600px)]:!pt-16
              [@media(orientation:landscape)_and_(max-height:600px)]:!translate-y-[8svh]
            "
          >
            <HeroBrand />
          </div>

          {/* Structural empty column.

              The artwork itself is now rendered
              outside Container as a full-bleed layer.
          */}

          <div
            aria-hidden
            className="
              relative
              h-full
              min-w-0
            "
          />
        </div>
      </Container>
    </section>
  );
}