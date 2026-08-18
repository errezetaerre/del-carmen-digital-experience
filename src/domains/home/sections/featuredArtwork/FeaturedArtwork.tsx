import { getFeaturedWorkArtwork } from "@/domains/home/services";
import { Container } from "@/shared/layout";
import {
  ArtworkFrame,
  ArtworkImage,
} from "@/shared/ui/artwork";

export default function FeaturedArtwork() {
  const artwork = getFeaturedWorkArtwork();

  if (!artwork) {
    return null;
  }

  const primaryImage =
    artwork.images.primary;

  const techniqueLabel = `${artwork.medium} on ${artwork.support}`;

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-background-alternate
        text-white

        lg:min-h-screen
      "
    >
      <Container
        className="
          relative
          z-10
          flex
          flex-col
          items-center
          justify-start

          pt-0
          pb-16

          md:py-20

          lg:min-h-screen
          lg:justify-center
          lg:py-24
          lg:pb-14
        "
      >
        {/* Section heading */}
        <div
          className="
            mb-12
            text-center

            md:mb-14
          "
        >
          <p
            className="
              mb-4
              font-sans
              text-xs
              uppercase
              tracking-[0.35em]
              text-brand-gold
            "
          >
            Featured Work
          </p>

          <h2
            className="
              font-display
              text-4xl
              font-light
              leading-[1]
              tracking-[0.02em]
              text-white

              md:text-5xl
              lg:text-6xl
            "
          >
            {artwork.title}
          </h2>
        </div>

        {/* Artwork */}
        <div className="flex w-full flex-col items-center">
          <ArtworkFrame
            aspectRatio={`${artwork.dimensions.width} / ${artwork.dimensions.height}`}
            className="
    mb-10
    w-[340px]

    md:w-[500px]
    lg:w-[560px]
    xl:w-[620px]
  "
          >
            <ArtworkImage
              src={primaryImage.src}
              alt={primaryImage.alt}
              fill
              sizes="
      (min-width: 1280px) 620px,
      (min-width: 1024px) 560px,
      (min-width: 768px) 500px,
      340px
    "
              className="object-contain"
            />
          </ArtworkFrame>

          {/* Artwork information */}
          <div className="flex max-w-xl flex-col items-center text-center">
            <p
              className="
                mb-3
                font-sans
                text-xs
                uppercase
                tracking-[0.3em]
                text-white/55
              "
            >
              {techniqueLabel} · {artwork.year}
            </p>

            {artwork.description && (
              <p
                className="
                  max-w-lg
                  font-sans
                  text-sm
                  font-light
                  leading-7
                  text-white/55

                  md:text-base
                "
              >
                {artwork.description}
              </p>
            )}

            <button
              type="button"
              className="
                mt-8
                font-sans
                text-xs
                font-medium
                uppercase
                tracking-[0.28em]
                text-brand-gold
                transition-opacity
                duration-300
                hover:opacity-70
              "
            >
              Discover the work →
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}