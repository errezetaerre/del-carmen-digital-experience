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
        h-full
        w-full
        min-w-0
        md:min-h-screen

        [@media(orientation:landscape)_and_(max-height:600px)]:min-h-[100svh]
      "
    >
      <Navigation />

      <HeroBackground />
      <HeroAtmosphere />
      <HeroLighting />

      <Container
        className="
          relative
          z-10
          min-h-screen

          [@media(orientation:landscape)_and_(max-height:600px)]:min-h-[100svh]
        "
      >
        <div
          className="
            grid
            w-full
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

              max-md:-mx-[var(--page-gutter)]
              max-md:w-[calc(100%+(var(--page-gutter)*2))]

              md:min-h-screen

              [@media(orientation:landscape)_and_(max-height:600px)]:!min-h-0
              [@media(orientation:landscape)_and_(max-height:600px)]:!mx-0
              [@media(orientation:landscape)_and_(max-height:600px)]:!w-full
            "
          >
            <HeroArtwork />
          </div>
        </div>
      </Container>
    </section>
  );
}