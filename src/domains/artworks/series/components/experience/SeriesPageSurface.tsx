"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Artwork, ArtworkSeries } from "@/domains/artworks";
import type { SiteLocale } from "@/i18n/config";
import { formatSeriesStatus, seriesTextLocale } from "@/i18n/seriesCopy";
import { isFeaturedArtworkSeries } from "@/domains/artworks/presentation/getArtworkPresentation";
import FeaturedSeriesBadge from "@/shared/ui/artwork/FeaturedSeriesBadge";
import CollectionArtwork from "@/domains/home/sections/collection/CollectionArtwork";
import { glassRimMarkup } from "@/shared/ui/artwork/glassAccents";
import { bindSeriesGalleryRail } from "./seriesGalleryMotion";
import type { SeriesGlassReflection } from "./seriesGlassReflection";
import styles from "./SeriesExperience.module.css";

export interface SeriesExperienceEntry { series: ArtworkSeries; artworks: Artwork[] }

function SeriesMaterial({ material, enabled }: { material: SeriesGlassReflection; enabled: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const id = `series-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
    useLayoutEffect(() => {
        const element = ref.current, page = element?.parentElement;
        if (!element || !page) return;
        let signature = "";
        const measure = () => {
            const { width, height } = page.getBoundingClientRect(), next = `${width}/${height}`;
            if (!width || !height || next === signature) return;
            signature = next;
            element.innerHTML = glassRimMarkup(`${id}-left`, width, height, -1) + glassRimMarkup(`${id}-right`, width, height, 1);
            if (enabled) material.render(page);
        };
        const observer = new ResizeObserver(measure); observer.observe(page); measure();
        return () => observer.disconnect();
    }, [id, enabled, material]);
    return <><div className={styles.reflection} aria-hidden="true">
        <span className={styles.pageGlow} data-series-glow="left" />
        <span className={styles.pageGlow} data-series-glow="right" />
    </div><div ref={ref} className={styles.rim} aria-hidden="true" /></>;
}

function SeriesArtworkGallery({ artworks, wide, active, openingId, onOpen }: {
    artworks: Artwork[]; wide: boolean; active: boolean; openingId: string | null; onOpen(artwork: Artwork): void;
}) {
    const t = useTranslations("Series"), experience = useTranslations("SeriesExperience");
    const host = useRef<HTMLElement>(null), rail = useRef<HTMLDivElement>(null);
    const controller = useRef<ReturnType<typeof bindSeriesGalleryRail> | null>(null);
    const [position, setPosition] = useState({ index: 0, total: 1 });
    const carousel = artworks.length > (wide ? 2 : 4);
    const groups = Array.from({ length: Math.ceil(artworks.length / 2) }, (_, index) => artworks.slice(index * 2, index * 2 + 2));
    useLayoutEffect(() => {
        const element = host.current, viewport = rail.current;
        if (!element || !viewport) return;
        function measure() {
            if (!element || !viewport) return;
            const page = element.closest<HTMLElement>("[data-series-page]");
            const columns = Math.min(2, artworks.length) || 1;
            const width = (element.clientWidth - 16 - (columns - 1) * 20) / columns;
            const height = (element.clientHeight - 28 - 16) / 1.25;
            page?.style.setProperty("--series-card-width", `${Math.max(90, Math.min(260, width, height))}px`);
            page?.style.setProperty("--series-columns", String(columns));
            viewport.style.setProperty("--series-group-width", `${viewport.clientWidth}px`);
        }
        const observer = new ResizeObserver(measure); observer.observe(element); measure();
        if (active && carousel) controller.current = bindSeriesGalleryRail(viewport, wide, (index, total) => {
            setPosition(previous => previous.index === index && previous.total === total ? previous : { index, total });
        });
        return () => { observer.disconnect(); controller.current?.dispose(); controller.current = null; };
    }, [active, artworks.length, wide, carousel]);
    const first = position.index * 2 + 1, last = Math.min(artworks.length, first + 1);
    return <section ref={host} className={styles.gallery} data-lightbox-native-scroll data-series-gallery aria-label={t("worksInCollection")}
        style={{ "--series-count": Math.min(4, artworks.length), "--series-mobile-columns": Math.min(2, artworks.length) || 1 } as React.CSSProperties}>
        <div ref={rail} data-series-gallery-viewport className={`${styles.galleryViewport} ${artworks.length > 4 ? styles.singleCarousel : styles.singleGrid} ${artworks.length > 2 ? styles.spreadCarousel : ""}`}
            tabIndex={active && carousel ? 0 : -1} aria-label={experience("galleryHint")}>
            <div className={styles.galleryTrack}>
                {groups.map((group, index) => <div className={styles.galleryGroup} data-series-group key={index}>
                    {group.map(artwork => <div className={styles.card} key={artwork.id}>
                        <CollectionArtwork artwork={artwork} presentation="series" loading={openingId === artwork.id}
                            onOpen={() => onOpen(artwork)} />
                    </div>)}
                </div>)}
            </div>
        </div>
        {carousel && <div className={styles.galleryControls}>
            <button type="button" onClick={() => controller.current?.navigate(-1)} disabled={position.index === 0} aria-label={t("previousArtworks")}>‹</button>
            <p>{wide ? first === last ? experience("singleWork", { index: first, total: artworks.length }) : experience("workRange", { first, last, total: artworks.length }) : experience("galleryHint")}</p>
            <button type="button" onClick={() => controller.current?.navigate(1)} disabled={position.index >= position.total - 1} aria-label={t("nextArtworks")}>›</button>
        </div>}
    </section>;
}

export default function SeriesPageSurface({ entry, active, wide, openingId, onOpen, material, glass }: {
    entry: SeriesExperienceEntry; active: boolean; wide: boolean; openingId: string | null; onOpen(artwork: Artwork): void;
    material: SeriesGlassReflection; glass: boolean;
}) {
    const locale = useLocale() as SiteLocale, t = useTranslations("Series"), { series, artworks } = entry;
    const background = series.atmosphere;
    return <div className={styles.page} data-series-page data-portrait-page={series.id}>
        <div className={styles.reading} data-series-reading data-lenis-prevent tabIndex={active ? 0 : -1} role="region" aria-label={series.title}>
            <div className={styles.editorial}>
                {background && <div className={styles.atmosphere} data-series-atmosphere aria-hidden="true">
                    {/* One panorama is clipped into the two glass halves after full-width layout. */}
                    <picture><source media="(orientation:portrait)" srcSet={background.portraitSrc ?? background.src} />
                        {/* Decorative full-spread panorama, with an orientation-specific native source. */}
                        <img src={background.src} alt="" draggable={false} decoding="async" loading={active ? "eager" : "lazy"} />
                    </picture>
                </div>}
                <header className={styles.intro}>
                    <p className={styles.eyebrow}>{isFeaturedArtworkSeries(series.id) ? <FeaturedSeriesBadge seriesId={series.id} /> : t("label")}</p>
                    <h1 className={styles.collectionTitle}>{series.title}</h1>
                    <div className={styles.workStatus}><span>{t("workCount", { count: artworks.length })}</span><i>·</i><span>{formatSeriesStatus(series.status, locale)}</span></div>
                </header>
                <SeriesArtworkGallery artworks={artworks} wide={wide} active={active} openingId={openingId} onOpen={onOpen} />
                <section className={styles.statementSection} data-series-statement tabIndex={active ? 0 : -1} aria-label={t("statement")}>
                    <div className={styles.statementContent} lang={seriesTextLocale(series, locale)}>
                        {series.statement && <><p className={styles.sectionLabel}>{t("statement")}</p><p className={styles.statement}>{series.statement}</p></>}
                        {series.statement && series.description && <span className={styles.statementDivider} aria-hidden="true" />}
                        {series.description && <p className={styles.description}>{series.description}</p>}
                    </div>
                </section>
            </div>
        </div>
        <SeriesMaterial material={material} enabled={glass} />
    </div>;
}
