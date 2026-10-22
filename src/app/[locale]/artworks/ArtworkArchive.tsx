"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { Artwork } from "@/domains/artworks";
import { formatArtworkCategory, formatArtworkMedium } from "@/i18n/artworkCopy";
import {
    artworkArchiveQuery, artworkArchiveSorts, getArtworkArchiveOptions,
    matchesArtworkArchive, readArtworkArchiveFilters, selectArtworkArchive,
    type ArtworkArchiveFilters, type ArtworkArchiveSort,
} from "@/domains/artworks/presentation/artworkArchive";
import CollectionGallery from "@/domains/home/sections/collection/CollectionGallery";
import styles from "./ArtworkArchive.module.css";

type IconName = "search" | "close" | "chevron" | "plus" | "minus" | "star" | "filters";
function Icon({ name }: { name: IconName }) {
    const paths: Record<IconName, ReactNode> = {
        search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
        close: <path d="m6 6 12 12M18 6 6 18" />,
        chevron: <path d="m7 10 5 5 5-5" />,
        plus: <path d="M5 12h14M12 5v14" />,
        minus: <path d="M5 12h14" />,
        star: <path d="m12 3 2.78 5.63 6.22.91-4.5 4.38 1.06 6.2L12 17.19l-5.56 2.93 1.06-6.2L3 9.54l6.22-.91Z" />,
        filters: <path d="M4 7h16M4 17h16M9 4v6M15 14v6" />,
    };
    return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}

function FilterOption({ label, count, active, onSelect }: { label: string; count: number; active: boolean; onSelect: () => void }) {
    return <button type="button" className={styles.option} aria-pressed={active} onClick={onSelect}>
        <span>{label}</span><span className={styles.count}>{count}</span>
    </button>;
}

const sortCopy = { archive: "archiveOrder", newest: "newest", oldest: "oldest", title: "titleOrder" } as const;

export default function ArtworkArchive({ artworks }: { artworks: Artwork[] }) {
    const locale = useLocale();
    const t = useTranslations("Archive");
    const searchParams = useSearchParams();
    const id = useId();
    const filters = useMemo(() => readArtworkArchiveFilters(artworks, searchParams), [artworks, searchParams]);
    const options = useMemo(() => getArtworkArchiveOptions(artworks), [artworks]);
    const filtered = useMemo(() => selectArtworkArchive(artworks, filters, locale), [artworks, filters, locale]);
    const query = artworkArchiveQuery(filters).toString();
    const [pagination, setPagination] = useState({ query, count: 12 });
    const limit = pagination.query === query ? pagination.count : 12;
    const visible = useMemo(() => filtered.slice(0, limit), [filtered, limit]);
    const extraCategoryActive = filters.category !== "all" && options.categories.indexOf(filters.category) >= 5;
    const [disclosure, setDisclosure] = useState({ category: filters.category, expanded: extraCategoryActive });
    const expanded = disclosure.category === filters.category ? disclosure.expanded : extraCategoryActive || disclosure.expanded;
    const [filtersOpen, setFiltersOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const categoryCandidates = artworks.filter((artwork) => matchesArtworkArchive(artwork, filters, "category"));
    const mediumCandidates = artworks.filter((artwork) => matchesArtworkArchive(artwork, filters, "medium"));

    // Native modal supplies inert background, Escape, focus containment and return.
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!filtersOpen || !dialog) return;
        const document = dialog.ownerDocument;
        const previousOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = "hidden";
        if (!dialog.open) dialog.showModal();
        const desktop = window.matchMedia("(min-width: 1100px)");
        const closeOnDesktop = () => { if (desktop.matches) setFiltersOpen(false); };
        desktop.addEventListener("change", closeOnDesktop);
        closeOnDesktop();
        return () => {
            desktop.removeEventListener("change", closeOnDesktop);
            if (dialog.open) dialog.close();
            document.documentElement.style.overflow = previousOverflow;
        };
    }, [filtersOpen]);

    function updateFilters(patch: Partial<ArtworkArchiveFilters>) {
        const current = readArtworkArchiveFilters(artworks, new URLSearchParams(window.location.search));
        const next = artworkArchiveQuery({ ...current, ...patch }).toString();
        // Native history updates useSearchParams without a server request per key.
        window.history.replaceState(null, "", `${window.location.pathname}${next ? `?${next}` : ""}${window.location.hash}`);
    }

    function reset() {
        updateFilters({ category: "all", year: "all", medium: "all", featured: false, search: "", sort: "archive" });
    }

    const chips: Array<{ key: string; label: string; clear: () => void }> = [];
    if (filters.category !== "all") chips.push({ key: "category", label: formatArtworkCategory(filters.category, locale), clear: () => updateFilters({ category: "all" }) });
    if (filters.year !== "all") chips.push({ key: "year", label: String(filters.year), clear: () => updateFilters({ year: "all" }) });
    if (filters.medium !== "all") chips.push({ key: "medium", label: formatArtworkMedium(filters.medium, locale), clear: () => updateFilters({ medium: "all" }) });
    if (filters.featured) chips.push({ key: "featured", label: t("featured"), clear: () => updateFilters({ featured: false }) });
    if (filters.search.trim()) chips.push({ key: "search", label: `“${filters.search.trim()}”`, clear: () => updateFilters({ search: "" }) });

    function filterControls(location: "sidebar" | "drawer") {
        const prefix = `${id}-${location}`;
        return <>
            <div className={styles.filtersHeading}>
                <h2>{t("refine")}</h2><button type="button" className={styles.reset} onClick={reset}>{t("reset")}</button>
            </div>
            <div className={styles.search}>
                <label className={styles.srOnly} htmlFor={`${prefix}-search`}>{t("searchLabel")}</label><Icon name="search" />
                <input id={`${prefix}-search`} type="search" value={filters.search} maxLength={120} autoComplete="off" spellCheck={false}
                    placeholder={t("searchPlaceholder")} onChange={(event) => updateFilters({ search: event.target.value })} />
                {filters.search && <button type="button" className={styles.clearSearch} aria-label={t("clearSearch")} onClick={() => updateFilters({ search: "" })}><Icon name="close" /></button>}
            </div>
            <section className={styles.section} aria-labelledby={`${prefix}-category`}>
                <h3 id={`${prefix}-category`}>{t("category")}</h3>
                <div className={styles.options} role="group" aria-label={t("category")}>
                    <FilterOption label={t("allCategories")} count={categoryCandidates.length} active={filters.category === "all"} onSelect={() => updateFilters({ category: "all" })} />
                    {options.categories.slice(0, 5).map((category) => <FilterOption key={category} label={formatArtworkCategory(category, locale)}
                        count={categoryCandidates.filter((artwork) => artwork.categories.includes(category)).length} active={filters.category === category} onSelect={() => updateFilters({ category })} />)}
                </div>
                <div className={styles.options} id={`${prefix}-extra`} hidden={!expanded}>
                    {options.categories.slice(5).map((category) => <FilterOption key={category} label={formatArtworkCategory(category, locale)}
                        count={categoryCandidates.filter((artwork) => artwork.categories.includes(category)).length} active={filters.category === category} onSelect={() => updateFilters({ category })} />)}
                </div>
                {options.categories.length > 5 && <button type="button" className={styles.moreCategories} aria-expanded={expanded} aria-controls={`${prefix}-extra`}
                    onClick={() => setDisclosure({ category: filters.category, expanded: !expanded })}>
                    <span>{t(expanded ? "fewerCategories" : "moreCategories")}</span><Icon name={expanded ? "minus" : "plus"} />
                </button>}
            </section>
            <section className={styles.section}>
                <h3><label htmlFor={`${prefix}-year`}>{t("year")}</label></h3>
                <div className={styles.select}><select id={`${prefix}-year`} value={filters.year}
                    onChange={(event) => updateFilters({ year: event.target.value === "all" ? "all" : Number(event.target.value) })}>
                    <option value="all">{t("allYears")}</option>{options.years.map((year) => <option key={year} value={year}>{year}</option>)}
                </select><Icon name="chevron" /></div>
            </section>
            <section className={styles.section} aria-labelledby={`${prefix}-medium`}>
                <h3 id={`${prefix}-medium`}>{t("medium")}</h3>
                <div className={styles.options} role="group" aria-label={t("medium")}>
                    <FilterOption label={t("allMediums")} count={mediumCandidates.length} active={filters.medium === "all"} onSelect={() => updateFilters({ medium: "all" })} />
                    {options.mediums.map((medium) => <FilterOption key={medium} label={formatArtworkMedium(medium, locale)}
                        count={mediumCandidates.filter((artwork) => artwork.medium === medium).length} active={filters.medium === medium} onSelect={() => updateFilters({ medium })} />)}
                </div>
            </section>
            <p className={styles.note}>{t("note")}</p>
        </>;
    }

    return <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label={t("filters")}>{filterControls("sidebar")}</aside>
        <section id="archive-gallery" className={styles.gallery} aria-label={t("gallery")} tabIndex={-1}>
            <div className={styles.toolbar}>
                <div className={styles.tabs} role="group" aria-label={t("selection")}>
                    <button type="button" className={styles.tab} aria-pressed={!filters.featured} onClick={() => updateFilters({ featured: false })}>{t("allWorks")}</button>
                    <button type="button" className={styles.tab} aria-pressed={filters.featured} onClick={() => updateFilters({ featured: true })}><Icon name="star" />{t("featured")}</button>
                </div>
                <div className={styles.toolbarRight}>
                    <button type="button" className={styles.mobileFilter} aria-haspopup="dialog" aria-controls={`${id}-filters`} aria-expanded={filtersOpen} onClick={() => setFiltersOpen(true)}>
                        <Icon name="filters" /><span>{t("filters")}</span>{chips.length > 0 && <span className={styles.filterCount}>{chips.length}</span>}
                    </button>
                    <span className={styles.resultCount} role="status" aria-live="polite" aria-atomic="true">{t("resultCount", { count: filtered.length })}</span>
                    <label className={styles.sort}><span className={styles.srOnly}>{t("sortLabel")}</span>
                        <select value={filters.sort} onChange={(event) => updateFilters({ sort: event.target.value as ArtworkArchiveSort })}>
                            {artworkArchiveSorts.map((sort) => <option key={sort} value={sort}>{t(sortCopy[sort])}</option>)}
                        </select><Icon name="chevron" />
                    </label>
                </div>
            </div>
            {chips.length > 0 && <div className={styles.tokens} aria-label={t("activeFilters")}>
                {chips.map((chip) => <button type="button" key={chip.key} className={styles.token} aria-label={t("removeFilter", { label: chip.label })} onClick={chip.clear}>{chip.label}<Icon name="close" /></button>)}
            </div>}
            {filtered.length > 0 ? <>
                <CollectionGallery artworks={visible} interaction="detail" imageVariant="thumbnail" detailQuery={query || undefined}
                    className={styles.grid} artworkPresentation="archive" />
                <div className={styles.bottom}>
                    {visible.length < filtered.length && <button type="button" className={styles.moreWorks} onClick={() => setPagination({ query, count: limit + 12 })}>{t("moreWorks")}</button>}
                    <span className={styles.loadedCount}>{t("loadedCount", { shown: visible.length, total: filtered.length })}</span>
                </div>
            </> : <div className={styles.empty}><h3>{t("emptyTitle")}</h3><p>{t("emptyDescription")}</p><button type="button" className={styles.moreWorks} onClick={reset}>{t("clearFilters")}</button></div>}
        </section>
        <dialog ref={dialogRef} id={`${id}-filters`} className={styles.dialog} aria-labelledby={`${id}-filter-title`}
            onClose={() => setFiltersOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) setFiltersOpen(false); }}>
            <div className={styles.drawerTop}><h2 id={`${id}-filter-title`}>{t("filters")}</h2><button type="button" className={styles.close} aria-label={t("closeFilters")} onClick={() => setFiltersOpen(false)}><Icon name="close" /></button></div>
            <div className={styles.drawerBody}>{filterControls("drawer")}</div>
            <div className={styles.drawerBottom}><button type="button" className={styles.apply} onClick={() => setFiltersOpen(false)}>{t("applyFilters", { count: filtered.length })}</button></div>
        </dialog>
    </div>;
}
