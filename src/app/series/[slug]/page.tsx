import { notFound } from "next/navigation";
import Link from "next/link";

import {
    getArtworkSeries,
    getArtworkSeriesBySlug,
    getArtworksBySeriesId,
} from "@/domains/artworks";

import {
    SeriesAtmosphere,
    SeriesGallery,
} from "@/domains/artworks/series/components";
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
                    isolate
                    overflow-hidden
                    bg-background
                    pt-20

                    md:pt-28
                    lg:pt-32
                "
            >
                {series.atmosphere && (
                    <SeriesAtmosphere
                        src={series.atmosphere.src}
                    />
                )}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        z-[1]
                        bg-gradient-to-b
                        from-black/10
                        via-black/25
                        to-background
                    "
                />
                <Container
                    className="
                        relative
                        z-10
                    "
                >
                    <div
                        className="
                            mx-auto
    w-full
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
                                mx-auto
                                font-display
                                text-5xl
                                font-light
                                leading-[0.95]
                                tracking-[0.01em]

                                md:whitespace-nowrap
                                md:text-[clamp(3.5rem,7vw,6rem)]
                            "
                        >
                            {series.title}
                        </h1>

                        <div
                            className="
                                mx-auto
                                mt-8
                                flex
                                max-w-md
                                items-center
                                justify-center
                                gap-4

                                md:gap-6
                            "
                        >
                            <span
                                aria-hidden="true"
                                className="
                                    h-px
                                    min-w-8
                                    flex-1
                                    bg-gradient-to-r
                                    from-transparent
                                    to-white/20
                                "
                            />

                            <div
                                className="
                                    flex
                                    shrink-0
                                    items-center
                                    gap-3
                                    font-sans
                                    text-[10px]
                                    uppercase
                                    tracking-[0.25em]
                                    text-white/40
                                "
                            >
                                <span>
                                    {artworks.length}{" "}
                                    {artworks.length === 1
                                        ? "work"
                                        : "works"}
                                </span>

                                <span
                                    className="
                                        text-brand-gold/50
                                    "
                                >
                                    ·
                                </span>

                                <span>
                                    {series.status}
                                </span>
                            </div>

                            <span
                                aria-hidden="true"
                                className="
                                    h-px
                                    min-w-8
                                    flex-1
                                    bg-gradient-to-l
                                    from-transparent
                                    to-white/20
                                "
                            />
                        </div>
                    </div>
                </Container>

                {/* The gallery intentionally crosses the visual
                    boundary between the introductory surface and
                    the darker curatorial atmosphere. */}
                <div
                    className="
                        relative
                        mt-44

                        md:mt-48
                    "
                >
                    <Container
                        className="
                            relative
                            z-10
                        "
                    >
                        <SeriesGallery
                            artworks={artworks}
                            seriesSlug={series.slug}
                            initialArtworkSlug={
                                initialArtworkSlug
                            }
                        />
                    </Container>
                </div>
            </section>

            {/* =====================================================
                SERIES STATEMENT / ATMOSPHERE
                ===================================================== */}

            {
                (series.statement ||
                    series.description) && (
                    <section
                        className="
                        relative
                        isolate
                        overflow-hidden
                        bg-background
                        py-28

                        md:py-36
                        lg:py-40
                    "
                    >

                        <Container
                            className="
                            relative
                            z-10
                        "
                        >
                            <div
                                className="
                                mx-auto
                                max-w-3xl
                                text-center
                            "
                            >
                                {series.statement && (
                                    <>
                                        <p
                                            className="
                                            mb-6
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
                                            text-white/80

                                            md:text-3xl
                                        "
                                        >
                                            {
                                                series.statement
                                            }
                                        </p>
                                    </>
                                )}

                                {series.description && (
                                    <>
                                        {series.statement && (
                                            <span
                                                aria-hidden="true"
                                                className="
                                                mx-auto
                                                my-10
                                                block
                                                h-px
                                                w-12
                                                bg-brand-gold/35
                                            "
                                            />
                                        )}

                                        <p
                                            className="
                                            mx-auto
                                            max-w-2xl
                                            font-sans
                                            text-sm
                                            font-light
                                            leading-7
                                            text-white/50

                                            md:text-base
                                            md:leading-8
                                        "
                                        >
                                            {
                                                series.description
                                            }
                                        </p>
                                    </>
                                )}
                            </div>
                        </Container>
                    </section>
                )
            }

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
w-full
text-center
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
