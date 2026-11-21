"use client";

import Image from "next/image";
import Link from "@/i18n/navigation";
import { brand } from "@/config/brand";
import { artworkExperienceHref } from "../../presentation/artworkExperience";
import motion from "@/shared/ui/artwork/ArtworkThumbnailMotion.module.css";
import { useRef, type CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Artwork } from "../../model/artwork";
import { getArtworkYear } from "../../model/artworkDate";
import { getArtworkPresentation } from "../../presentation/getArtworkPresentation";
import { formatArtworkTechnique, localizeArtwork } from "@/i18n/artworkCopy";
import BookThumbnail from "./BookThumbnail";
import useArtworkThumbnailPan from "@/shared/ui/artwork/useArtworkThumbnailPan";
import GlassBookMaterial from "../glass-artbook/GlassBookMaterial";
import type { SeriesGlassReflection } from "../../series/components/experience/seriesGlassReflection";
import styles from "./GalleryBook.module.css";

function thumbnailRatio(work: Artwork) {
    const image = work.images.thumbnail ?? work.images.primary;
    if (image.width && image.height) return image.width / image.height;
    return work.dimensions.width / work.dimensions.height;
}

function WorkCard({ artwork, query, onFollow }: { artwork: Artwork; query: string; onFollow(slug: string): void }) {
    const locale = useLocale(), t = useTranslations("ArchiveBook");
    const work = localizeArtwork(artwork, locale);
    const badge = getArtworkPresentation(work, locale).badges.at(-1);
    const image = work.images.thumbnail ?? work.images.primary;
    const ref = useRef<HTMLAnchorElement>(null);
    useArtworkThumbnailPan(ref, work.creationStatus === "completed" ? image.src : undefined);
    return <Link ref={ref} href={artworkExperienceHref(work.slug, query, "glass")} prefetch={false}
        className={`${styles.tile} ${motion.card}`} data-artbook-card={work.id}
        data-upright={thumbnailRatio(work) < 1 || undefined}
        aria-label={t("plus", { title: work.title })} onNavigate={() => onFollow(work.slug)}>
        <BookThumbnail artwork={work} sizes="(max-width: 600px) 92vw, (max-width: 1149px) 58vw, 43vw" pan />
        <span className={styles.caption}>
            <span className={styles.tileEdition}>{getArtworkYear(work.date)}{badge && <span> · {badge.label}</span>}</span>
            <strong>{work.title}</strong>
            <span className={styles.captionFoot}>
                <span>{formatArtworkTechnique(work, locale)}</span>
                <svg className={styles.openMark} aria-hidden="true" viewBox="0 0 16 16" fill="none">
                    <path d="M4 12 12 4M6 4h6v6" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </span>
        </span>
    </Link>;
}

function BookCover({ artwork, onStart }: { artwork?: Artwork; onStart(): void }) {
    const t = useTranslations("ArchiveBook"), archive = useTranslations("Archive");
    const landscape = artwork?.images.heroLandscape, portrait = artwork?.images.heroPortrait;
    return <div className={styles.cover}>
        {landscape && portrait && <>
            <div aria-hidden="true" className={styles.coverTexture} style={{ "--painting": 'url("' + landscape.src + '")' } as CSSProperties} />
            <picture className={styles.coverPainting}>
                <source media="(orientation: portrait) and (max-width: 1149px)" srcSet={portrait.src} />
                <Image unoptimized priority src={landscape.src} width={2560} height={1429} alt={artwork.title} draggable={false} />
            </picture>
            <span className={styles.coverShade} aria-hidden="true" />
            <span className={styles.credit}>{artwork.title}</span>
        </>}
        <div className={styles.coverCopy}>
            <span className={styles.coverImprint}>{archive("eyebrow")}</span>
            <h2>{archive("titleFirst")} <em>{archive("titleSecond")}</em></h2>
            <i aria-hidden="true" /><p>{archive("description")}</p>
            <button type="button" onClick={onStart}>{t("open")} <span aria-hidden="true">→</span></button>
            <small>Rolando Del Carmen · Rō Visual</small>
        </div>
    </div>;
}

function Signature() {
    return <span className={styles.signature}>{brand.name} <small>by Rõ Visual</small></span>;
}

function Folio({ works, number, last, query, onFollow }: {
    works: Artwork[]; number: number; last: boolean; query: string; onFollow(slug: string): void;
}) {
    const t = useTranslations("ArchiveBook");
    const wideArt = works.some(work => thumbnailRatio(work) > 1.13);
    const label = t("folio") + " " + String(number).padStart(2, "0");
    if (!works.length) return <section className={styles.blank} aria-label={label}><Signature /></section>;
    return <section className={styles.folio} aria-label={label} data-final={last || undefined}>
        <div className={styles.tiles} data-count={works.length} data-ledger={wideArt && works.length === 2 || undefined}>
            {works.map(work => <WorkCard key={work.id} artwork={work} query={query} onFollow={onFollow} />)}
        </div>
        <footer>{last ? <Signature /> : <span>Del Carmen · Rō Visual</span>}<span>{label}</span></footer>
    </section>;
}

interface PageProps {
    index: number; artworks: Artwork[]; cover?: Artwork; perLeaf: number; spread: boolean;
    material: SeriesGlassReflection; query: string; onFollow(slug: string): void; onStart(): void;
}

export default function GalleryBookPage({ index, artworks, cover, perLeaf, spread, material, query, onFollow, onStart }: PageProps) {
    const leaves = spread ? 2 : 1;
    const start = (index - 1) * leaves * perLeaf;
    return <div className={styles.page} data-portrait-page={index} data-spread={spread || undefined}>
        {index === 0 ? <BookCover artwork={cover} onStart={onStart} /> :
            Array.from({ length: leaves }, (_, side) => {
                const offset = start + side * perLeaf;
                return <Folio key={side} number={(index - 1) * leaves + side + 1} works={artworks.slice(offset, offset + perLeaf)}
                    last={side === leaves - 1 && offset + perLeaf >= artworks.length} query={query} onFollow={onFollow} />;
            })}
        <GlassBookMaterial material={material} />
    </div>;
}
