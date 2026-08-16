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
        min-h-[100svh]
        w-full
        min-w-0
        overflow-hidden

        md:min-h-screen

        [@media(orientation:landscape)_and_(max-height:600px)]:min-h-[100svh]
      "
    >
      {/* Mobile portrait artwork environment */}
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

      <HeroBackground />
      <HeroAtmosphere />
      <HeroLighting />

      <Navigation />

      {/* Mobile portrait composition */}
      <div
        className="
          relative
          z-20
          flex
          min-h-[100svh]
          flex-col

          md:hidden

          [@media(orientation:landscape)_and_(max-height:600px)]:!hidden
        "
      >
        <Container className="relative flex min-h-[100svh] flex-col">
          {/* Brand */}
          <div className="pt-24">
            <HeroBrand />
          </div>

          {/* Lower content */}
          <div className="mt-auto pb-10">
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
          min-h-screen

          md:block

          [@media(orientation:landscape)_and_(max-height:600px)]:!block
          [@media(orientation:landscape)_and_(max-height:600px)]:min-h-[100svh]
        "
      >
        <div
          className="
            grid
            w-full
            min-w-0
            items-start

            md:min-h-screen
            md:grid-cols-[40%_60%]
            md:items-center

            lg:grid-cols-[34%_66%]

            [@media(orientation:landscape)_and_(max-height:600px)]:!min-h-[100svh]
            [@media(orientation:landscape)_and_(max-height:600px)]:!grid-cols-[38%_62%]
            [@media(orientation:landscape)_and_(max-height:600px)]:!items-center
          "
        >
          {/* Narrative / Brand */}
          <div
            className="
              relative
              z-30
              flex
              min-w-0
              flex-col
              pt-24

              md:min-h-screen

              lg:pt-28

              [@media(orientation:landscape)_and_(max-height:600px)]:!min-h-0
              [@media(orientation:landscape)_and_(max-height:600px)]:!pt-16
              [@media(orientation:landscape)_and_(max-height:600px)]:!justify-center
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

              md:min-h-screen

              [@media(orientation:landscape)_and_(max-height:600px)]:!min-h-0
              [@media(orientation:landscape)_and_(max-height:600px)]:!mx-0
              [@media(orientation:landscape)_and_(max-height:600px)]:!w-full
            "
          >
            <HeroArtwork mode="desktop" />
          </div>
        </div>
      </Container>
    </section>
  );
}