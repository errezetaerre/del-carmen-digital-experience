import {
    getSelectedWorks,
} from "@/domains/home/services";

import { Container } from "@/shared/layout";

import CollectionGallery from "../collection/CollectionGallery";

export default function SelectedWorks() {
    const artworks =
        getSelectedWorks();

    if (!artworks.length) {
        return null;
    }

    return (
        <section
            className="
        relative
        overflow-hidden
        bg-background-alternate
        text-white
      "
        >
            <Container
                size="wide"
                className="
          py-24

          md:py-32

          lg:py-20

          [@media(orientation:landscape)_and_(max-height:600px)]:!py-16
        "
            >
                {/* =================================================
            SECTION INTRO
           ================================================= */}

                <div
                    className="
            mb-14
            max-w-xl

            md:mb-16

            lg:mb-20
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
                        Selected Works
                    </p>

                    <h2
                        className="
              font-display
              text-4xl
              font-light
              leading-[1]
              tracking-[0.01em]
              text-white

              md:text-5xl
              lg:text-6xl
            "
                    >
                        Works that speak
                        <br />
                        in silence
                    </h2>

                    <p
                        className="
              mt-6
              max-w-md
              font-sans
              text-sm
              font-light
              leading-[1.8]
              tracking-[0.01em]
              text-white/55

              md:text-base
            "
                    >
                        Each painting is a threshold.
                        Each gaze, a story.
                    </p>
                </div>

                {/* =================================================
            ARTWORK GRID
           ================================================= */}

                <CollectionGallery
                    artworks={artworks}
                />
            </Container>
        </section>
    );
}