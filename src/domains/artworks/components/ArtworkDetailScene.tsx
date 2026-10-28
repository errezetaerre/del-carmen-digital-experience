import Link from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { artworkTextLocale, formatArtworkCategory, formatArtworkAuthorship, formatArtworkTechnique, localizeArtwork } from "@/i18n/artworkCopy";
import ArtworkImageHighlights from "@/shared/ui/artwork/ArtworkImageHighlights";
import ArtworkOpenArtbook from "@/shared/ui/artwork/ArtworkOpenArtbook";
import ArtworkLinkFeedback from "@/shared/ui/artwork/ArtworkLinkFeedback";
import { getArtworkPresentation } from "../presentation/getArtworkPresentation";
import glassStyles from "./glass-artbook/ArtworkGlassArtbook.module.css";
import sceneStyles from "./ArtworkDetailScene.module.css";
import ArtworkStandardPortraitAccent from "./ArtworkStandardPortraitAccent";

import type { Artwork } from "@/domains/artworks";
import ArtworkDetailViewer from "@/domains/artworks/components/ArtworkDetailViewer";
import { Container } from "@/shared/layout";

interface ArtworkDetailSceneProps {
    artwork: Artwork;
    previousArtwork?: Artwork;
    nextArtwork?: Artwork;
    navigationQuery: string;
    priority?: boolean;
    editorialOnly?: boolean;
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
    artwork: sourceArtwork,
    previousArtwork,
    nextArtwork,
    navigationQuery,
    editorialOnly = false,
}: ArtworkDetailSceneProps) {
    const locale = useLocale();
    const t = useTranslations("Artwork");
    const artwork = localizeArtwork(sourceArtwork, locale);
    const textLocale = artworkTextLocale(artwork, locale);
    const artbookParams = new URLSearchParams(navigationQuery);
    artbookParams.set("experience", "glass");
    const artbookHref = `/artworks/${artwork.slug}?${artbookParams.toString()}`;

    const techniqueLabel =
        formatArtworkTechnique(artwork, locale);

    const presentation = getArtworkPresentation(artwork, locale);
    const availabilityLabel = presentation.statusLabel;

    const authorshipLabel =
        formatArtworkAuthorship(artwork, locale);

    const hasHighlights = presentation.badges.some((badge) => badge.kind !== "planned" && badge.kind !== "in-progress");
    const SceneElement = editorialOnly ? "section" : "main";

    return (
        <SceneElement
            data-artwork-editorial={editorialOnly || undefined}
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
                        {!editorialOnly && hasHighlights && artwork.creationStatus === "completed" && <ArtworkStandardPortraitAccent artworkId={artwork.id} />}
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
                            {presentation.yearLabel} · {authorshipLabel}
                        </p>

                            {!editorialOnly && <><ArtworkOpenArtbook
                                href={artbookHref}
                                data-artwork-kinetic-ignore
                                data-artwork-open-artbook
                                aria-label={t("openArtworkArtbook", { title: artwork.title })}
                                className={`${glassStyles.entryLink} relative font-sans text-[9px] uppercase tracking-[0.20em] text-white/60 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold/60`}
                            >
                                {t("openArtbook")}
                                <ArtworkLinkFeedback label={t("openingArtbook")} />
                            </ArtworkOpenArtbook>
                            <span data-artwork-orientation-hint className={`${glassStyles.orientationHint} font-sans text-[9px] uppercase tracking-[0.20em] text-white/35`}>{t("orientationHint")}</span></>}
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

                        <div key={artwork.id} className={sceneStyles.reading} data-artwork-detail-reading data-lenis-prevent tabIndex={0} role="region" aria-label={t("information", { title: artwork.title })}>

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
                                <span lang={textLocale}>“{artwork.quote}”</span>
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
                                {t("medium")}
                            </dt>
                            <dd className="text-white/75">
                                {techniqueLabel}
                            </dd>

                            <dt className="text-white/35">
                                {t("dimensions")}
                            </dt>
                            <dd className="text-white/75">
                                {artwork.dimensions.width} ×{" "}
                                {artwork.dimensions.height}{" "}
                                {artwork.dimensions.unit}
                            </dd>

                            <dt className="text-white/35">
                                {t("status")}
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
                                <span lang={textLocale}>{artwork.description}</span>
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
                                            {formatArtworkCategory(category, locale)}
                                        </span>
                                    ),
                                )}
                            </div>
                        )}
                        </div>

                        {!editorialOnly && (previousArtwork || nextArtwork) && (
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
                                            data-artwork-navigation="previous"
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
                                                ← {t("previous")}
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
                                            data-artwork-navigation="next"
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
                                                {t("next")} →
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
        </SceneElement>
    );
}
