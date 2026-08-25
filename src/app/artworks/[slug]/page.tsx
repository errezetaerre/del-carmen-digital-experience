import Link from "next/link";
import { notFound } from "next/navigation";

import {
    getArtworks,
    getArtworkBySlug,
} from "@/domains/artworks";

import ArtworkDetailViewer from "@/domains/artworks/components/ArtworkDetailViewer";

import { Container } from "@/shared/layout";

interface ArtworkPageProps {
    params: Promise<{
        slug: string;
    }>;

    searchParams: Promise<{
        category?: string;
    }>;
}

function formatLabel(value: string) {
    return value
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase(),
        );
}

function formatAuthorship(
    authorship: string,
) {
    switch (authorship) {
        case "original":
            return "Original Artwork";

        case "master-copy":
            return "Master Copy";

        case "study-after":
            return "Study After";

        default:
            return formatLabel(authorship);
    }
}

export function generateStaticParams() {
    return getArtworks().map((artwork) => ({
        slug: artwork.slug,
    }));
}

export default async function ArtworkPage({
    params,
    searchParams,
}: ArtworkPageProps) {
    const { slug } = await params;

    const {
        category,
    } = await searchParams;

    const artwork =
        getArtworkBySlug(slug);

    if (!artwork) {
        notFound();
    }

    const techniqueLabel =
        `${formatLabel(artwork.medium)} on ${formatLabel(artwork.support)}`;

    const availabilityLabel =
        formatLabel(artwork.availability);

    const authorshipLabel =
        formatAuthorship(artwork.authorship);

    const artworks =
        getArtworks();

    const activeCategory =
        category &&
            artwork.categories.includes(
                category,
            )
            ? category
            : undefined;

    const navigationArtworks =
        activeCategory
            ? artworks.filter(
                (item) =>
                    item.categories.includes(
                        activeCategory,
                    ),
            )
            : artworks;

    const currentIndex =
        navigationArtworks.findIndex(
            (item) =>
                item.id === artwork.id,
        );

    const previousArtwork =
        currentIndex > 0
            ? navigationArtworks[
            currentIndex - 1
            ]
            : undefined;

    const nextArtwork =
        currentIndex >= 0 &&
            currentIndex <
            navigationArtworks.length - 1
            ? navigationArtworks[
            currentIndex + 1
            ]
            : undefined;
    const artworksBackHref =
        activeCategory
            ? `/artworks?category=${encodeURIComponent(
                activeCategory,
            )}`
            : "/artworks";
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
    pb-20
    pt-10

    md:py-20
    lg:py-28
  "
            >
                {/* ================================================
            BACK
           ================================================ */}

                <Link
                    href={artworksBackHref}
                    className="
            inline-block
            translate-y-4
            font-sans
            text-[10px]
            uppercase
            tracking-[0.28em]
            text-white/40
            transition-colors
            duration-300
            hover:text-brand-gold
          "
                >
                    ← Back to artworks
                </Link>

                {/* ================================================
            ARTWORK
           ================================================ */}

                <div
                    className="
    mt-7
    grid
    gap-8

    md:mt-10
    md:gap-10

    lg:mt-12
    lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]
    lg:items-center
    lg:gap-20
  "
                >
                    {/* ==============================================
                        IMAGE
                    ============================================== */}

                    <ArtworkDetailViewer
                        artwork={artwork}
                        previousArtwork={
                            previousArtwork
                        }
                        nextArtwork={
                            nextArtwork
                        }
                        activeCategory={
                            activeCategory
                        }
                    />

                    {/* ==============================================
                            INFORMATION
                        ============================================== */}

                    <div
                        className="
                            max-w-xl
                            -translate-y-1

                            md:-translate-y-2

                            lg:max-w-md
                            lg:translate-y-0
                        "
                    >
                        <p
                            className="
                                font-sans
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-[0.34em]
                                text-brand-gold
                            "
                        >
                            {authorshipLabel}
                        </p>

                        <h1
                            className="
                                mt-5
                                font-display
                                text-4xl
                                font-light
                                leading-[0.98]
                                tracking-[0.01em]

                                md:text-5xl
                                xl:text-6xl
                            "
                        >
                            {artwork.title}
                        </h1>

                        {artwork.quote && (
                            <p
                                className="
                                    mt-6
                                    font-display
                                    text-lg
                                    font-light
                                    italic
                                    leading-relaxed
                                    text-white/65

                                    md:text-xl
                                    "
                            >
                                &ldquo;{artwork.quote}&rdquo;
                            </p>
                        )}

                        <div
                            className="
                                my-8
                                h-px
                                w-full
                                bg-gradient-to-r
                                from-brand-gold/70
                                via-brand-gold/20
                                to-transparent
                            "
                        />

                        {/* Metadata */}

                        <dl
                            className="
                                grid
                                grid-cols-[110px_1fr]
                                gap-x-6
                                gap-y-4
                                font-sans
                                text-sm
                            "
                        >
                            <dt className="text-white/35">
                                Year
                            </dt>

                            <dd className="text-white/75">
                                {artwork.year}
                            </dd>

                            <dt className="text-white/35">
                                Medium
                            </dt>

                            <dd className="text-white/75">
                                {techniqueLabel}
                            </dd>

                            <dt className="text-white/35">
                                Dimensions
                            </dt>

                            <dd className="text-white/75">
                                {artwork.dimensions.width} ×{" "}
                                {artwork.dimensions.height}{" "}
                                {artwork.dimensions.unit}
                            </dd>

                            <dt className="text-white/35">
                                Status
                            </dt>

                            <dd className="text-white/75">
                                {availabilityLabel}
                            </dd>
                        </dl>

                        {/* Description */}

                        {artwork.description && (
                            <p
                                className="
                                    mt-10
                                    font-sans
                                    text-sm
                                    font-light
                                    leading-[1.9]
                                    text-white/55

                                    md:text-[15px]
                                    "
                            >
                                {artwork.description}
                            </p>
                        )}

                        {/* Categories */}

                        {artwork.categories.length >
                            0 && (
                                <div
                                    className="
                                    mt-10
                                    flex
                                    flex-wrap
                                    gap-x-5
                                    gap-y-3
                                    "
                                >
                                    {artwork.categories.map(
                                        (category) => (
                                            <span
                                                key={category}
                                                className="
                                                    font-sans
                                                    text-[9px]
                                                    uppercase
                                                    tracking-[0.24em]
                                                    text-white/35
                                                "
                                            >
                                                {formatLabel(
                                                    category,
                                                )}
                                            </span>
                                        ),
                                    )}
                                </div>
                            )}
                        {/* ==============================================
    PREVIOUS / NEXT ARTWORK
============================================== */}

                        {navigationArtworks.length > 1 && (
                            <div
                                className="
            mt-14
            border-t
            border-white/[0.08]
            pt-7

            md:mt-16
            md:pt-8
        "
                            >
                                <div
                                    className="
                grid
                grid-cols-2
                gap-6
            "
                                >
                                    {/* Previous */}

                                    {previousArtwork ? (
                                        <Link
                                            href={`/artworks/${previousArtwork.slug}${activeCategory
                                                ? `?category=${encodeURIComponent(
                                                    activeCategory,
                                                )}`
                                                : ""
                                                }`}
                                            className="
                        group
                        min-w-0
                        text-left
                    "
                                        >
                                            <span
                                                className="
                            block
                            font-sans
                            text-[9px]
                            uppercase
                            tracking-[0.28em]
                            text-white/30
                            transition-colors
                            duration-300

                            group-hover:text-brand-gold/60
                        "
                                            >
                                                ← Previous
                                            </span>

                                            <span
                                                className="
                            mt-2
                            block
                            truncate
                            font-display
                            text-base
                            font-light
                            text-white/60
                            transition-colors
                            duration-300

                            group-hover:text-white
                        "
                                            >
                                                {previousArtwork.title}
                                            </span>
                                        </Link>
                                    ) : (
                                        <div />
                                    )}

                                    {/* Next */}

                                    {nextArtwork ? (
                                        <Link
                                            href={`/artworks/${nextArtwork.slug}${activeCategory
                                                ? `?category=${encodeURIComponent(
                                                    activeCategory,
                                                )}`
                                                : ""
                                                }`}
                                            className="
                        group
                        min-w-0
                        text-right
                    "
                                        >
                                            <span
                                                className="
                            block
                            font-sans
                            text-[9px]
                            uppercase
                            tracking-[0.28em]
                            text-white/30
                            transition-colors
                            duration-300

                            group-hover:text-brand-gold/60
                        "
                                            >
                                                Next →
                                            </span>

                                            <span
                                                className="
                            mt-2
                            block
                            truncate
                            font-display
                            text-base
                            font-light
                            text-white/60
                            transition-colors
                            duration-300

                            group-hover:text-white
                        "
                                            >
                                                {nextArtwork.title}
                                            </span>
                                        </Link>
                                    ) : (
                                        <div />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </main>
    );
}