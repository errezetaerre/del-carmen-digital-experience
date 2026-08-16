import HeroArtwork from "./HeroArtwork";
import HeroBackground from "./HeroBackground";
import HeroBrand from "./HeroBrand";
import HeroAtmosphere from "./HeroAtmosphere";
import HeroLighting from "./HeroLighting";

import { Container } from "@/shared/layout";
import { Navigation } from "@/domains/navigation";

export default function Hero() {
  return (
    <section
      className="
        relative
        w-full
        min-w-0
        overflow-hidden

        [--hero-height:100svh]
        h-[var(--hero-height)]

        md:[--hero-height:100vh]


        [@media(min-width:768px)_and_(max-width:1366px)_and_(min-height:700px)_and_(orientation:portrait)]:[--hero-height:650px]

        [@media(min-width:768px)_and_(max-width:1366px)_and_(min-height:700px)_and_(orientation:landscape)]:[--hero-height:600px]

        [@media(orientation:landscape)_and_(max-height:600px)]:[--hero-height:100svh]
      "
    >
      {/* Mobile portrait artwork environment */}
      <div
        className="
          absolute
          inset-0
          z-0

          md:hidden
        "
      >
        <HeroArtwork mode="mobile" />
      </div>

      <HeroBackground />
      <HeroAtmosphere />
      <HeroLighting />

      <Navigation />

      {/* Mobile portrait */}
      <div
        className="
          relative
          z-20
          h-[var(--hero-height)]

          md:hidden
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

      {/* Tablet / Desktop / Mobile Landscape */}
      <Container
        className="
          relative
          z-10
          hidden
          h-[var(--hero-height)]

          md:block
        "
      >
        <div
          className="
            grid
            h-full
            w-full
            min-w-0
            items-center

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

              [@media(orientation:landscape)_and_(max-height:600px)]:!pt-16
              [@media(orientation:landscape)_and_(max-height:600px)]:!justify-center
              [@media(orientation:landscape)_and_(max-height:600px)]:!translate-y-[8svh]
            "
          >
            <HeroBrand />
          </div>

          {/* Artwork */}
          <div
            className="
              relative
              h-full
              w-full
              min-w-0
            "
          >
            <HeroArtwork mode="desktop" />
          </div>
        </div>
      </Container>
    </section>
  );
}