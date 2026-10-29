"use client";

import Image from "next/image";
import { Suspense } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "@/i18n/navigation";
import type { SiteLocale } from "@/i18n/config";
import { formatArtworkTechnique } from "@/i18n/artworkCopy";
import { formatSeriesStatus, seriesTextLocale } from "@/i18n/seriesCopy";
import { journalEntryTextLocale } from "@/i18n/journalCopy";
import { homeBookCopy } from "@/i18n/homeBookCopy";
import type { Artwork } from "@/domains/artworks";
import type { ArtworkImage } from "@/domains/artworks/model/artwork";
import ArtworkBadges from "@/shared/ui/artwork/ArtworkBadges";
import FeaturedSeriesBadge from "@/shared/ui/artwork/FeaturedSeriesBadge";
import type { SeriesGlassReflection } from "@/domains/artworks/series/components/experience/seriesGlassReflection";
import CoverArtworkBadge from "../sections/hero/CoverArtworkBadge";
import { NewsletterForm } from "@/domains/newsletter";
import { homeVisualAssets } from "../curation/homeVisualAssets";
import type { HomeBookChapter, HomeBookContent } from "./homeBookContent";
import { journalPageSlug, type HomeBookPageId } from "./homeBookChapters";
import HomeBookGallery from "./HomeBookGallery";
import HomeBookMaterial from "./HomeBookMaterial";
import HomeBookImage from "./HomeBookImage";

function BookImage({ image, className, sizes = "(orientation:portrait) 90vw, 50vw", active = false }: {
    image: ArtworkImage; className?: string; sizes?: string; active?: boolean;
}) {
    return <Image src={image.src} alt={image.alt} width={image.width ?? 1400} height={image.height ?? 1000}
        className={className} sizes={sizes} quality={75} loading={active ? "eager" : "lazy"} decoding="async" draggable={false} />;
}
function Cta({ href, children }: { href: string; children: string }) {
    return <Link href={href} prefetch={false} className="cta">{children.replace(/\s*→$/, "")}<span className="arrow" aria-hidden="true">↗</span></Link>;
}
function Signature() {
    return <Image className="real-signature" src={homeVisualAssets.signature.src} alt={homeVisualAssets.signature.alt} width={220} height={60} sizes="220px" loading="lazy" />;
}

export default function HomeBookPage({ chapter, content, layout, active, material, onOpen, onJump }: {
    chapter: HomeBookPageId; content: HomeBookContent; layout: "spread" | "phone" | "portrait"; active: boolean;
    material: SeriesGlassReflection; onOpen(work: Artwork): void; onJump(chapter: HomeBookChapter): void;
}) {
    const locale = useLocale() as SiteLocale, h = useTranslations("Home"), a = useTranslations("Artwork"), s = useTranslations("Series"), n = useTranslations("Navigation");
    const wide = layout === "spread", { hero, featured, collection } = content;
    const storySlug = journalPageSlug(chapter), story = content.journal.find(entry => entry.slug === storySlug);
    const chapterLabel = story?.title ?? homeBookCopy(locale).chapter[storySlug ? "journal" : chapter as HomeBookChapter];
    const dimensions = (work: Artwork) => `${work.dimensions.width} × ${work.dimensions.height} ${work.dimensions.unit}`;
    const discover = (work: Artwork, className?: string, image = work.images.primary) => <HomeBookImage className={className}
        onOpen={() => onOpen(work)} label={a("viewNamed", { title: work.title })}><BookImage image={image} sizes={className === "cover-image" ? "100vw" : undefined} active={active} /></HomeBookImage>;
    const coverIntroduction = hero && <>
        <p className={`eyebrow${wide ? " cover-brand-line" : ""}`}>{wide ? "by Rõ Visual" : "ROLANDO DEL CARMEN · RŌ VISUAL"}</p>
        <div className="cover-brand-heading"><h1 className="hero-title">Del<br /><em>Carmen</em></h1>
            {wide && <div className="cover-right-badge"><CoverArtworkBadge artworkId={hero.id} /></div>}
        </div>
        {wide && <div className="rule" aria-hidden="true" />}
        <p className="hero-tagline">{h("taglineFirst")}<br />{h("taglineSecond")}</p>
        {!wide && <div className="rule" aria-hidden="true" />}
        {hero.description && <p className="body-copy">{hero.description}</p>}
        <button type="button" className="cta" onClick={() => onJump("collections")}>{h("exploreCollection")}<span className="arrow" aria-hidden="true">→</span></button>
    </>;
    const artistCopy = <><p className="eyebrow">ROLANDO DEL CARMEN</p><h2>{h("artistTitle")}</h2>
        <div className={wide ? "artist-real-copy" : undefined}><p className={wide ? undefined : "large-copy"}>{h("artistParagraphFirst")}</p>
            <p className={wide ? undefined : "body-copy"}>{h("artistParagraphSecond")}</p></div>
        <Signature /><Cta href="/artist">{h("artistStory")}</Cta></>;
    const journalRows = content.journal.map((entry, index) => <article key={entry.slug} lang={journalEntryTextLocale(entry, locale)}
        className={wide ? `journal-row ${index % 2 ? "copy-first" : "image-first"}` : "journal-card"}>
        <Link href={`/journal/${entry.slug}`} prefetch={false} className={wide ? "journal-row-image" : "journal-image"} aria-label={entry.title}>
            <BookImage image={{ src: entry.image, alt: "" }} sizes="(orientation:portrait) 85vw, 28vw" active={active} />
        </Link>
        <div className={wide ? "journal-row-copy" : undefined}>
            <p className={wide ? "journal-row-meta" : "eyebrow"}>{entry.category}<span aria-hidden="true" />{entry.year}</p>
            <h3>{entry.title}</h3><p className={wide ? undefined : "body-copy"}>{entry.excerpt}</p>
            <Cta href={`/journal/${entry.slug}`}>{h("journalRead")}</Cta>
        </div>
    </article>);
    const collectionImage = collection && (wide ? collection.landscapeImage : collection.portraitImage);
    let body;
    if (chapter === "cover" && hero) body = wide ? <div className="spread-sheet cover-sheet cover-split-sheet">
        <div className="cover-art-page">
            {discover(hero, "cover-image", hero.images.heroLandscape ?? hero.images.primary)}<div className="panorama-shade" aria-hidden="true" />
            <div className="cover-info"><div className="cover-info-inner"><h2>{hero.title}</h2>
                {hero.quote && <p className="cover-quote">“{hero.quote}”</p>}<div className="cover-rule" aria-hidden="true" />
                <div className="cover-facts"><span>{formatArtworkTechnique(hero, locale)}</span><span>{hero.year}</span><span>{dimensions(hero)}</span></div>
            </div></div>
        </div><div className="cover-editorial-page"><div className="cover-introduction">{coverIntroduction}</div></div>
    </div> : <div className="split"><div className="art-side"><div className="home-cover-media">
        {discover(hero, "hero-art")}
        <div className="art-caption"><span><strong>{hero.title}</strong><br /><span className="meta">{hero.year} · {formatArtworkTechnique(hero, locale)}</span></span>
            <CoverArtworkBadge artworkId={hero.id} /></div>
    </div></div><div className="editorial-side">{coverIntroduction}</div></div>;
    if (chapter === "featured" && featured) body = <div className="split"><div className="art-side">
        <HomeBookImage className="featured-artwork-media" onOpen={() => onOpen(featured)} label={a("viewNamed", { title: featured.title })}>
            <BookImage className="featured-image" image={featured.images.primary} active={active} />
        </HomeBookImage></div><div className="editorial-side" data-home-native-scroll>
            <p className="eyebrow">{h("featuredWork")}</p><h2>{featured.title}</h2>
            <div className="badge-row" data-badged><ArtworkBadges artwork={featured} /></div>
            {featured.quote && <p className="large-copy">“{featured.quote}”</p>}<div className="rule" aria-hidden="true" />
            <p className="meta">{featured.year} · {formatArtworkTechnique(featured, locale)}</p>
            {featured.description && <p className="body-copy">{featured.description}</p>}
            <button type="button" className="cta" onClick={() => onOpen(featured)}>{h("discoverWork")}<span className="arrow" aria-hidden="true">→</span></button>
        </div></div>;
    if (chapter === "artist") body = wide ? <div className="spread-sheet artist-sheet">
        <BookImage image={{ ...homeVisualAssets.artist, alt: h("artistPortrait"), width: 1672, height: 941 }} className="artist-panorama" sizes="100vw" active={active} />
        <div className="artist-blend" aria-hidden="true" /><div className="artist-editorial" data-home-native-scroll>{artistCopy}</div>
    </div> : <div className="split"><div className="art-side"><BookImage image={{ ...homeVisualAssets.artist, alt: h("artistPortrait"), width: 1672, height: 941 }} className="photo" active={active} /></div>
        <div className="editorial-side">{artistCopy}</div></div>;
    if (chapter === "collections" && collection && collectionImage) {
        const { series, artworkCount } = collection;
        const href = `/series/${series.slug}?view=glass`;
        const years = series.yearStart ? series.yearEnd && series.yearStart !== series.yearEnd ? `${series.yearStart} — ${series.yearEnd}` : String(series.yearStart) : "";
        body = wide ? <div className="spread-sheet collection-sheet" lang={seriesTextLocale(series, locale)}>
            <Link className="collection-image-link" href={href} prefetch={false} aria-label={s("exploreNamed", { title: series.title })}>
                <BookImage image={collectionImage} sizes="100vw" active={active} />
                <span className="collection-rollover"><strong>{series.title}</strong><span>{s("workCount", { count: artworkCount })} · {h("exploreCollection")} ↗</span></span>
            </Link><div className="collection-blend" aria-hidden="true" />
            <div className="collection-editorial"><div className="badge" data-badged><FeaturedSeriesBadge seriesId={series.id} /></div>
                <h2>{series.title}</h2>{series.description && <p className="collection-description">{series.description}</p>}
                <div className="collection-facts"><span>{s("workCount", { count: artworkCount })}</span>{years && <span>{years}</span>}<span>{formatSeriesStatus(series.status, locale)}</span></div>
                <Cta href={href}>{h("exploreCollection")}</Cta>
            </div></div> : <div className="split" lang={seriesTextLocale(series, locale)}>
            <div className="portrait-collection-art"><Link className="portrait-collection-image" href={href} prefetch={false} aria-label={s("exploreNamed", { title: series.title })}>
                <BookImage image={collectionImage} active={active} /></Link></div>
            <div className="editorial-side"><div className="badge" data-badged><FeaturedSeriesBadge seriesId={series.id} /></div><h2>{series.title}</h2>
                {series.statement && <p className="collection-statement">{series.statement}</p>}<div className="rule" aria-hidden="true" />
                {series.description && <p className="body-copy">{series.description}</p>}<p className="collection-mark">{formatSeriesStatus(series.status, locale)}</p>
                <Cta href={href}>{h("exploreCollection")}</Cta>
            </div></div>;
    }
    if (chapter === "artworks") body = <><div className="section-header"><p className="eyebrow">{h("selectedEyebrow")}</p>
        <h2>{h("selectedTitleFirst")} <em>{h("selectedTitleSecond")}</em></h2><p className="body-copy">{h("selectedDescription")}</p></div>
        <HomeBookGallery artworks={content.selected} onOpen={onOpen} /><div className="gallery-all"><Cta href="/artworks">{h("selectedAll")}</Cta></div></>;
    if (chapter === "journal") body = wide ? <div className="spread-sheet journal-title-sheet">
        <header className="journal-title-heading"><p className="eyebrow">{h("journalEyebrow")}</p><h2>{h("journalTitleFirst")}<br /><em>{h("journalTitleSecond")}</em></h2>
            <Cta href="/journal">{h("journalRead")}</Cta></header>
    </div> : <><div className="section-header"><p className="eyebrow">{h("journalEyebrow")}</p><h2>{h("journalTitleFirst")}<br /><em>{h("journalTitleSecond")}</em></h2></div>
        <div className="journal-grid">{journalRows}</div></>;
    if (story) {
        const alternate = content.journal.indexOf(story) % 2 === 1;
        body = <article className={`spread-sheet journal-story-sheet${alternate ? " copy-first" : ""}`} lang={journalEntryTextLocale(story, locale)}>
            <Link href={`/journal/${story.slug}`} prefetch={false} className="journal-story-image" aria-label={story.title}>
                <BookImage image={{ src: story.image, alt: "" }} active={active} sizes="50vw" />
            </Link>
            <div className="journal-story-copy" data-home-native-scroll>
                <p className="eyebrow">{story.category} · {story.year}</p><h2>{story.title}</h2>
                <div className="rule" aria-hidden="true" /><p className="body-copy">{story.excerpt}</p>
                <Cta href={`/journal/${story.slug}`}>{h("journalRead")}</Cta>
            </div>
        </article>;
    }
    if (chapter === "invitation") {
        const introduction = <><p className="eyebrow">DEL CARMEN</p>
            <h2>{h("taglineFirst")}<br /><em>{h("taglineSecond")}</em></h2>
            <p className="large-copy">{h("invitationJourneyFirst")}<br />{h("invitationJourneySecond")}</p><div className="rule" aria-hidden="true" /></>;
        const newsletter = <><p className="eyebrow">{h("newsletterLabel")}</p><p className="body-copy">{h("newsletterDescription")}</p>
            <div className="home-newsletter" data-lightbox-native-scroll>
                <Suspense fallback={<p className="body-copy">{h("newsletterLabel")}…</p>}><NewsletterForm /></Suspense>
            </div><Cta href="/contact">{h("contact")}</Cta></>;
        body = wide ? <div className="spread-sheet invitation-sheet">
            <div className="invitation-leaf" data-home-native-scroll><div className="invitation">{introduction}</div></div>
            <section className="newsletter-leaf" data-home-native-scroll role="region" aria-label={h("newsletterLabel")} tabIndex={active ? 0 : -1}>
                <div className="invitation">{newsletter}</div>
            </section>
        </div> : <div className="invitation">{introduction}{newsletter}</div>;
    }
    if (chapter === "credits") body = <footer className="book-credits">
        <p className="eyebrow">{homeBookCopy(locale).chapter.credits}</p>
        <h2>Rolando Del Carmen</h2><p className="credits-brand">by Rõ Visual</p>
        <div className="rule" aria-hidden="true" />
        <p className="credits-copyright">© {new Date().getFullYear()} ROLANDO DEL CARMEN</p>
        <p className="body-copy">{n("rights")}</p>
        <nav className="credits-links" aria-label={n("legal")}>
            <Cta href="/privacy">{n("privacy")}</Cta><Cta href="/terms">{n("terms")}</Cta>
        </nav>
    </footer>;
    const pageClass = story ? "journal-story-page" : { cover: "hero-page", featured: "featured-page", artist: "artist-page", collections: "collection-page", artworks: "gallery-page", journal: "journal-page", invitation: "invitation-page", credits: "credits-page" }[chapter as HomeBookChapter];
    return <div className="page" data-portrait-page={chapter} data-home-composition={wide ? "spread" : "approved"}>
        <div className="reading" tabIndex={active ? 0 : -1} role="region" aria-label={chapterLabel}>
            <div className={`editorial ${pageClass}`}>{body}</div>
        </div><HomeBookMaterial material={material} />
    </div>;
}
