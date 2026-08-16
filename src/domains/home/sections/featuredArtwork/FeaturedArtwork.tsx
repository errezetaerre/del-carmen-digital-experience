import { getFeaturedArtwork } from "@/domains/home/services";
import { Container } from "@/shared/layout";
import { ArtworkFrame, ArtworkImage } from "@/shared/ui/artwork";

export default function FeaturedArtwork() {
  const artwork = getFeaturedArtwork();

  if (!artwork) {
    return null;
  }

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

          py-16

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
            className="
              mb-10
              w-[300px]

              md:w-[420px]

              lg:w-[500px]

              xl:w-[560px]
            "
          >
            <ArtworkImage
              src={artwork.image.src}
              alt={artwork.image.alt}
              width={artwork.dimensions.width}
              height={artwork.dimensions.height}
              className="h-full w-full object-cover"
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
              {artwork.technique} · {artwork.year}
            </p>

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
              A moment suspended between memory, devotion and becoming.
            </p>

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