import { notFound } from "next/navigation";
import Link from "next/link";

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

    searchParams: Promise<{
        artwork?: string | string[];
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
    searchParams,
}: SeriesPageProps) {
    const { slug } = await params;
    const resolvedSearchParams =
        await searchParams;

    const series =
        getArtworkSeriesBySlug(slug);

    if (!series) {
        notFound();
    }

    const artworks =
        getArtworksBySeriesId(
            series.id,
        );

    const requestedArtworkSlug =
        typeof resolvedSearchParams.artwork ===
            "string"
            ? resolvedSearchParams.artwork
            : undefined;

    const initialArtworkSlug =
        requestedArtworkSlug &&
            artworks.some(
                (artwork) =>
                    artwork.slug ===
                    requestedArtworkSlug,
            )
            ? requestedArtworkSlug
            : undefined;

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
                        seriesSlug={series.slug}
                        initialArtworkSlug={
                            initialArtworkSlug
                        }
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

            {/* =====================================================
                SERIES CONTINUE
            ===================================================== */}
            <section
                className="
                    border-t
                    border-white/[0.06]
                    bg-background
                    py-16

                    md:py-20
                "
            >
                <Container>
                    <div
                        className="
                            mx-auto
                            max-w-4xl
                        "
                    >
                        <p
                            className="
                                text-center
                                font-sans
                                text-[10px]
                                uppercase
                                tracking-[0.35em]
                                text-white/30
                            "
                        >
                            Continue Exploring
                        </p>

                        <div
                            className="
                                mt-8
                                flex
                                flex-col
                                items-center
                                justify-between
                                gap-6

                                sm:flex-row
                            "
                        >
                            <Link
                                href="/collections"
                                className="
                                    font-sans
                                    text-[11px]
                                    uppercase
                                    tracking-[0.18em]
                                    text-white/50
                                    transition-colors
                                    duration-300
                                    hover:text-brand-gold
                                "
                            >
                                ← Back to Collections
                            </Link>

                            <Link
                                href="/"
                                className="
                                    font-sans
                                    text-[11px]
                                    uppercase
                                    tracking-[0.18em]
                                    text-white/50
                                    transition-colors
                                    duration-300
                                    hover:text-brand-gold
                                "
                            >
                                Return Home →
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}