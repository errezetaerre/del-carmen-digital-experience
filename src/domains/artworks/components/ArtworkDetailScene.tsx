import Link from "next/link";
import ArtworkImageHighlights from "@/shared/ui/artwork/ArtworkImageHighlights";
import ArtworkLinkFeedback from "@/shared/ui/artwork/ArtworkLinkFeedback";
import { getArtworkPresentation } from "../presentation/getArtworkPresentation";
import glassStyles from "./glass-artbook/ArtworkGlassArtbook.module.css";
import sceneStyles from "./ArtworkDetailScene.module.css";

import type { Artwork } from "@/domains/artworks";
import ArtworkDetailViewer from "@/domains/artworks/components/ArtworkDetailViewer";
import { Container } from "@/shared/layout";

interface ArtworkDetailSceneProps {
    artwork: Artwork;
    previousArtwork?: Artwork;
    nextArtwork?: Artwork;
    navigationQuery: string;
    priority?: boolean;
}

function formatLabel(value: string) {
    return value
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatAuthorship(authorship: string) {
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

function createArtworkHref(
    artwork: Artwork,
    navigationQuery: string,
) {
    return `/artworks/${artwork.slug}${
        navigationQuery ? `?${navigationQuery}` : ""
    }`;
}

export default function ArtworkDetailScene({
    artwork,
    previousArtwork,
    nextArtwork,
    navigationQuery,
}: ArtworkDetailSceneProps) {
    const artbookParams = new URLSearchParams(navigationQuery);
    artbookParams.set("experience", "glass");
    const artbookHref = `/artworks/${artwork.slug}?${artbookParams.toString()}`;

    const techniqueLabel =
        `${formatLabel(artwork.medium)} on ${formatLabel(artwork.support)}`;

    const presentation = getArtworkPresentation(artwork);
    const availabilityLabel = presentation.statusLabel;

    const authorshipLabel =
        formatAuthorship(artwork.authorship);

    const hasHighlights = presentation.badges.some((badge) => badge.kind !== "planned" && badge.kind !== "in-progress");

    return (
        <main
            className={`
                ${glassStyles.standardScene}
                ${sceneStyles.scene}
                min-h-screen
                bg-surface-deep
                text-white
            `}
        >
            <Container
                size="wide"
                className={`
                    ${sceneStyles.content}
                    pb-20
                    pt-10

                    md:py-20
                    lg:py-28
                `}
            >
                <div
                    data-artwork-detail-layout
                    className={`
                        ${sceneStyles.spread}
                        mt-7
                        grid
                        gap-8

                        md:mt-10
                        md:gap-10

                        lg:mt-12
                        lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]
                        lg:items-center
                        lg:gap-20
                    `}
                >
                    <div data-artwork-detail-image data-artwork-detail-halo={hasHighlights || undefined} className={sceneStyles.image}>
                        <ArtworkImageHighlights artwork={artwork} className={sceneStyles.imageStage}>
                        <ArtworkDetailViewer
                            artwork={artwork}
                        />
                        </ArtworkImageHighlights>
                    </div>

                    <div
                        data-artwork-detail-info
                        className={`
                            ${sceneStyles.sheet}
                            max-w-xl
                            -translate-y-1

                            md:-translate-y-2

                            lg:max-w-md
                            lg:translate-y-0
                        `}
                    >
                        <header className={sceneStyles.heading}>
                        <div className="flex flex-wrap items-center justify-between gap-4">
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

                            <Link
                                href={artbookHref}
                                data-artwork-kinetic-ignore
                                aria-label={`Open ${artwork.title} in Glass Artbook`}
                                className={`${glassStyles.entryLink} relative font-sans text-[9px] uppercase tracking-[0.20em] text-white/60 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold/60`}
                            >
                                Open Artbook ↗
                                <ArtworkLinkFeedback label="Opening Artbook…" />
                            </Link>
                            <span className={`${glassStyles.orientationHint} font-sans text-[9px] uppercase tracking-[0.20em] text-white/35`}>Artbook in landscape</span>
                        </div>

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
                        </header>

                        <div key={artwork.id} className={sceneStyles.reading} data-artwork-detail-reading data-lenis-prevent tabIndex={0} role="region" aria-label={`${artwork.title} — artwork information`}>

                        {presentation.previewLabel && (
                            <p className="mt-3 font-sans text-xs text-white/50">{presentation.previewLabel}</p>
                        )}

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
                                “{artwork.quote}”
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
                                {artwork.creationStatus === "completed" ? "Year" : "Planned year"}
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

                        {artwork.categories.length > 0 && (
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
                                            {formatLabel(category)}
                                        </span>
                                    ),
                                )}
                            </div>
                        )}
                        </div>

                        {(previousArtwork || nextArtwork) && (
                            <div
                                className={`
                                    ${sceneStyles.navigation}
                                    mt-14
                                    border-t
                                    border-white/[0.08]
                                    pt-7

                                    md:mt-16
                                    md:pt-8
                                `}
                            >
                                <div
                                    className="
                                        grid
                                        grid-cols-2
                                        gap-6
                                    "
                                >
                                    {previousArtwork ? (
                                        <Link
                                            href={createArtworkHref(
                                                previousArtwork,
                                                navigationQuery,
                                            )}
                                            data-artwork-kinetic-ignore
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

                                    {nextArtwork ? (
                                        <Link
                                            href={createArtworkHref(
                                                nextArtwork,
                                                navigationQuery,
                                            )}
                                            data-artwork-kinetic-ignore
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
