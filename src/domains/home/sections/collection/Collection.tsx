import { getArtworks } from "@/domains/artworks";
import { Container } from "@/shared/layout";
import { LinkButton } from "@/shared/ui/button";
import CollectionGallery from "./CollectionGallery";

import CollectionArtwork from "./CollectionArtwork";

export default function Collection() {
  const artworks = getArtworks();

  if (!artworks.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-surface-deep text-white">
      <Container
        size="wide"
        className="
          py-24
          md:py-32
          lg:py-14
          [@media(orientation:landscape)_and_(max-height:600px)]:!py-16
        "
      >
        <div
          className="
            grid
            gap-16
            lg:grid-cols-[38%_62%]
            lg:items-stretch
            lg:gap-12

            [@media(orientation:landscape)_and_(max-height:600px)]:!grid-cols-[34%_66%]
            [@media(orientation:landscape)_and_(max-height:600px)]:!items-start
            [@media(orientation:landscape)_and_(max-height:600px)]:!gap-8
          "
        >
          {/* Editorial introduction */}
          <div className="lg:flex lg:flex-col lg:justify-between">
            <div className="max-w-[320px] xl:max-w-[360px]">
              <p
                className="
        mb-5
        font-sans
        text-[10px]
        font-medium
        uppercase
        tracking-[0.38em]
        text-brand-gold
      "
              >
                Featured Collection
              </p>

              <h2
                className="
        font-display
        text-3xl
        font-light
        leading-[1.05]
        tracking-[0.01em]
        text-white

        md:text-[2.15rem]
        lg:text-5xl
      "
              >
                Works that speak
                <br />
                in silence
              </h2>

              <p
                className="
        mt-6
        max-w-[280px]
        font-sans
        text-sm
        font-light
        leading-[1.8]
        tracking-[0.01em]
        text-white/55
      "
              >
                Each painting is a threshold. Each gaze, a story.
              </p>

              <div className="mt-8 w-fit">
                <LinkButton
                  href="/collection"
                  variant="bronzeUnderline"
                  className="
          mt-10
          font-sans
          text-xs
          font-medium
          tracking-[0.28em]
        "
                >
                  View the collection →
                </LinkButton>
              </div>
            </div>
          </div>

          {/* Artwork collection */}
          <CollectionGallery artworks={artworks} />
        </div>
      </Container>
    </section>
  );
}