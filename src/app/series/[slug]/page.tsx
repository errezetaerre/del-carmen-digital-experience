import { notFound } from "next/navigation";

import {
    getArtworkSeries,
    getArtworkSeriesBySlug,
    getArtworksBySeriesId,
} from "@/domains/artworks";

import { SeriesGallery } from "@/domains/artworks/series/components";
import { Container } from "@/shared/layout";

interface SeriesPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export function generateStaticParams() {
    return getArtworkSeries().map(
        (series) => ({
            slug: series.slug,
        }),
    );
}

export default async function SeriesPage({
    params,
}: SeriesPageProps) {
    const { slug } = await params;

    const series =
        getArtworkSeriesBySlug(slug);

    if (!series) {
        notFound();
    }

    const artworks =
        getArtworksBySeriesId(
            series.id,
        );

    return (
        <main
            className="
        min-h-screen
        bg-background
        text-white
      "
        >
            {/* =====================================================
          SERIES INTRO
         ===================================================== */}

            <section
                className="
          relative
          overflow-hidden
          bg-background-alternate
          py-20

          md:py-28
          lg:py-32
        "
            >
                <Container>
                    <div
                        className="
              mx-auto
              max-w-4xl
              text-center
            "
                    >
                        <p
                            className="
                mb-5
                font-sans
                text-[10px]
                uppercase
                tracking-[0.38em]
                text-brand-gold
              "
                        >
                            Artwork Series
                        </p>

                        <h1
                            className="
                font-display
                text-5xl
                font-light
                leading-[0.95]
                tracking-[0.01em]

                md:text-7xl
                lg:text-8xl
              "
                        >
                            {series.title}
                        </h1>

                        {series.description && (
                            <p
                                className="
                  mx-auto
                  mt-8
                  max-w-2xl
                  font-sans
                  text-sm
                  font-light
                  leading-7
                  text-white/55

                  md:text-base
                "
                            >
                                {series.description}
                            </p>
                        )}

                        <div
                            className="
                mt-7
                flex
                items-center
                justify-center
                gap-3
                font-sans
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-white/35
              "
                        >
                            <span>
                                {artworks.length}{" "}
                                {artworks.length === 1
                                    ? "work"
                                    : "works"}
                            </span>

                            <span className="text-brand-gold/40">
                                ·
                            </span>

                            <span>
                                {series.status}
                            </span>
                        </div>
                    </div>
                </Container>
            </section>

            {/* =====================================================
          SERIES GALLERY
         ===================================================== */}

            <section
                className="
          py-16

          md:py-24
        "
            >
                <Container>
                    <SeriesGallery
                        artworks={artworks}
                    />
                </Container>
            </section>

            {/* =====================================================
          SERIES STATEMENT
         ===================================================== */}

            {series.statement && (
                <section
                    className="
            bg-background-alternate
            py-20

            md:py-28
          "
                >
                    <Container>
                        <div
                            className="
                mx-auto
                max-w-3xl
                text-center
              "
                        >
                            <p
                                className="
                  mb-5
                  font-sans
                  text-[10px]
                  uppercase
                  tracking-[0.35em]
                  text-brand-gold
                "
                            >
                                Series Statement
                            </p>

                            <p
                                className="
                  font-display
                  text-2xl
                  font-light
                  leading-[1.5]
                  text-white/75

                  md:text-3xl
                "
                            >
                                {series.statement}
                            </p>
                        </div>
                    </Container>
                </section>
            )}
        </main>
    );
}