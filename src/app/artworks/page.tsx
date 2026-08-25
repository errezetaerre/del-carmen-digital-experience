import {
  getArtworks,
} from "@/domains/artworks";

import {
  Container,
} from "@/shared/layout";

import ArtworkArchive from "./ArtworkArchive";

export default function ArtworksPage() {
  const artworks =
    getArtworks();

  return (
    <main
      className="
        min-h-screen
        bg-surface-deep
        text-white
      "
    >
      <Container
        size="wide"
        className="
          py-24

          md:py-32
        "
      >
        {/* ===================================================
            ARCHIVE INTRODUCTION
           =================================================== */}

        <div
          className="
            mb-16
            max-w-2xl

            md:mb-20
          "
        >
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
            Artwork Archive
          </p>

          <h1
            className="
              font-display
              text-5xl
              font-light
              leading-[0.95]
              tracking-[0.01em]

              md:text-7xl
            "
          >
            The complete
            <br />
            body of work
          </h1>

          <p
            className="
              mt-6
              max-w-lg
              font-sans
              text-sm
              font-light
              leading-[1.8]
              text-white/55

              md:text-base
            "
          >
            An evolving archive of original
            works, studies and selected pieces
            across different periods and
            subjects.
          </p>
        </div>

        {/* ===================================================
            ARCHIVE
           =================================================== */}

        <ArtworkArchive
          artworks={artworks}
        />
      </Container>
    </main>
  );
}