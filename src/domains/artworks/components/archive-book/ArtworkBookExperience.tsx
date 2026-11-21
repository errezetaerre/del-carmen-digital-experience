"use client";

import { useCallback, useId, useMemo, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { setArtworkExperiencePreference } from "@/shared/ui/artwork/artworkExperiencePreference";
import type { Artwork } from "../../model/artwork";
import { artworkArchiveQuery, readArtworkArchiveFilters, selectArtworkArchive, type ArtworkArchiveFilters } from "../../presentation/artworkArchive";
import ArtworkExperienceToolbar from "@/shared/ui/artwork/ArtworkExperienceToolbar";
import ArchiveGlassBook from "./ArchiveGlassBook";
import BookFilterIndex from "./BookFilterIndex";
import { isGallerySpread, subscribeGallerySpread } from "./galleryBookNavigation";
import styles from "./GalleryBook.module.css";

const single = () => false;

export default function ArtworkBookExperience({ artworks }: { artworks: Artwork[] }) {
    const locale = useLocale(), archive = useTranslations("Archive");
    const search = useSearchParams(), dialogId = useId();
    const params = new URLSearchParams(search);
    for (const key of ["artwork", "perPage", "experience"]) params.delete(key);
    const filterSearch = params.toString();
    const filters = useMemo(() => readArtworkArchiveFilters(artworks, new URLSearchParams(filterSearch)), [artworks, filterSearch]);
    const query = artworkArchiveQuery(filters).toString();
    const selection = useMemo(() => selectArtworkArchive(artworks, filters, locale), [artworks, filters, locale]);
    const cover = artworks.find(work => work.id === "epifania_nupcial" && work.creationStatus === "completed");
    const [indexOpen, setIndexOpen] = useState(false);
    const density = search.get("perPage") === "1" ? 1 : 2;
    const detailQuery = [query, density === 1 ? "perPage=1" : ""].filter(Boolean).join("&");
    const [edition, setEdition] = useState(0);
    const spread = useSyncExternalStore(subscribeGallerySpread, isGallerySpread, single);
    const exit = useCallback(() => setArtworkExperiencePreference("standard"), []);

    function apply(next: ArtworkArchiveFilters, perLeaf: number, work?: Artwork) {
        const params = artworkArchiveQuery(next);
        if (perLeaf === 1) params.set("perPage", "1");
        if (work) params.set("artwork", work.slug);
        const nextQuery = params.toString();
        window.history.replaceState(null, "", window.location.pathname + (nextQuery ? "?" + nextQuery : ""));
        if (!work) {
            setEdition(value => value + 1);
            setIndexOpen(false);
        }
    }

    return <main className={styles.screen}>
        <header className={styles.masthead}>
            <h1 className={styles.galleryTitle}>{archive("gallery")}</h1>
            <ArtworkExperienceToolbar onExit={exit}
                leadingControl={<button type="button" className={styles.filterTrigger} aria-haspopup="dialog" aria-expanded={indexOpen}
                    aria-controls={indexOpen ? dialogId : undefined} onClick={() => setIndexOpen(true)}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"><path d="M3 7h6m4 0h8M3 17h10m4 0h4"/><circle cx="11" cy="7" r="2"/><circle cx="15" cy="17" r="2"/></svg>
                    {archive("filters")}
                </button>} />
        </header>
        {selection.length ? <ArchiveGlassBook key={query + "/" + edition} artworks={selection} cover={cover} query={detailQuery} initialSlug={search.get("artwork")}
            density={density} spread={spread} startOnFolio={Boolean(query) || edition > 0} onExit={exit} /> :
            <section className={styles.empty}><h2>{archive("emptyTitle")}</h2><p>{archive("emptyDescription")}</p>
                <button type="button" onClick={() => setIndexOpen(true)}>{archive("filters")}</button>
                <span role="status">{archive("resultCount", { count: 0 })}</span>
            </section>}
        {indexOpen && <BookFilterIndex id={dialogId} artworks={artworks} filters={filters} density={density} spread={spread}
            onClose={() => setIndexOpen(false)} onApply={apply} />}
    </main>;
}
