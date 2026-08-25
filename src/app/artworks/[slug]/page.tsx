import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
    getArtworks,
    getArtworkBySlug,
} from "@/domains/artworks";

import { Container } from "@/shared/layout";

interface ArtworkPageProps {
    params: Promise<{
        slug: string;
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
}: ArtworkPageProps) {
    const { slug } = await params;

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
                {/* ================================================
            BACK
           ================================================ */}

                <Link
                    href="/artworks"
                    className="
            inline-block
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
            mt-12
            grid
            gap-14

            lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]
            lg:items-center
            lg:gap-20
          "
                >
                    {/* ==============================================
              IMAGE
             ============================================== */}

                    <div
                        className="
              relative
              flex
              min-h-[55svh]
              items-center
              justify-center

              lg:min-h-[70vh]
            "
                    >
                        <div
                            className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-[70%]
                w-[70%]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-brand-gold/[0.06]
                blur-[90px]
              "
                        />

                        <Image
                            src={artwork.images.primary.src}
                            alt={artwork.images.primary.alt}
                            width={
                                artwork.images.primary.width ??
                                1200
                            }
                            height={
                                artwork.images.primary.height ??
                                1200
                            }
                            priority
                            className="
                relative
                z-10
                h-auto
                max-h-[75vh]
                w-auto
                max-w-full
                object-contain
                shadow-[0_35px_100px_rgba(0,0,0,0.45)]
              "
                        />
                    </div>

                    {/* ==============================================
              INFORMATION
             ============================================== */}

                    <div
                        className="
              max-w-xl
              lg:max-w-md
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
                    </div>
                </div>
            </Container>
        </main>
    );
}