import { getArtworks } from "@/domains/artworks";
import { Container } from "@/shared/layout";
import { LinkButton } from "@/shared/ui/button";

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
        className="py-24 md:py-32 lg:py-14"
      >
        <div className="grid gap-16 lg:grid-cols-[38%_62%] lg:items-stretch lg:gap-12">
          {/* Editorial introduction */}
          <div className="lg:flex lg:flex-col lg:justify-between">
            {/* Section Label */}
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

            {/* Editorial Heading */}
            <h2
              className="
                whitespace-nowrap
                font-display
                text-3xl
                font-light
                leading-[1.05]
                tracking-[0.01em]
                text-white
                md:text-[2.15rem]
                lg:whitespace-normal
                lg:text-5xl
              "
            >
              Works that speak
              <br className="hidden lg:block" />
              <span className="lg:hidden"> </span>
              in silence
            </h2>

            {/* Description */}
            <p
              className="
                mt-6
                max-w-xs
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

            {/* CTA */}
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

          {/* Artwork collection */}
          <div className="grid grid-cols-2 items-start justify-items-center gap-x-6 gap-y-14 md:grid-cols-4 md:gap-x-5 xl:gap-x-8">
            {artworks.map((artwork) => (
              <CollectionArtwork
                key={artwork.id}
                artwork={artwork}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}