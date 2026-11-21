"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatArtworkCategory, formatArtworkMedium, localizeArtwork } from "@/i18n/artworkCopy";
import type { Artwork } from "../../model/artwork";
import Link from "@/i18n/navigation";
import { artworkExperienceHref } from "../../presentation/artworkExperience";
import { getArtworkYear } from "../../model/artworkDate";
import { artworkArchiveQuery, artworkArchiveCreationStatuses, artworkArchiveSorts, getArtworkArchiveOptions, readArtworkArchiveFilters,
    selectArtworkArchive, type ArtworkArchiveFilters } from "../../presentation/artworkArchive";
import styles from "./BookFilterIndex.module.css";

interface Props {
    id: string; artworks: Artwork[]; filters: ArtworkArchiveFilters; density: number; spread: boolean;
    onClose(): void; onApply(filters: ArtworkArchiveFilters, density: number, work?: Artwork): void;
}

const statusLabels = { completed: "completed", "in-progress": "inProgress", planned: "comingSoon" } as const;
const sortLabels = { newest: "newest", oldest: "oldest", title: "titleOrder" } as const;

export default function BookFilterIndex({ id, artworks, filters, density, spread, onClose, onApply }: Props) {
    const locale = useLocale(), t = useTranslations("Archive"), book = useTranslations("ArchiveBook");
    const [draft, setDraft] = useState(filters), [perLeaf, setPerLeaf] = useState(density);
    const options = useMemo(() => getArtworkArchiveOptions(artworks), [artworks]);
    const results = useMemo(() => selectArtworkArchive(artworks, draft, locale), [artworks, draft, locale]);
    const detailParams = artworkArchiveQuery(draft);
    if (perLeaf === 1) detailParams.set("perPage", "1");
    const detailQuery = detailParams.toString();
    const perView = (spread ? 2 : 1) * perLeaf;
    const panel = useRef<HTMLDialogElement>(null), search = useRef<HTMLInputElement>(null);
    useLayoutEffect(() => {
        const element = panel.current;
        if (!element) return;
        element.showModal();
        search.current?.focus({ preventScroll: true });
        return () => element.close();
    }, []);
    function patch(value: Partial<ArtworkArchiveFilters>) { setDraft(previous => ({ ...previous, ...value })); }

    return <dialog ref={panel} id={id} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby={id + "-title"}
        onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
        <div className={styles.panel}>
            <header className={styles.heading}><h2 id={id + "-title"}>{book("index")}</h2>
                <button type="button" aria-label={book("close")} onClick={onClose}>×</button></header>
            <div className={styles.columns}>
                <form id={id + "-form"} role="search" className={styles.filters} onSubmit={event => { event.preventDefault(); if (results.length) onApply(draft, perLeaf); }}>
                    <label className={styles.wide}>{t("searchLabel")}<input ref={search} type="search" value={draft.search} maxLength={120} placeholder={t("searchPlaceholder")}
                        onChange={event => patch({ search: event.target.value })} /></label>
                    <label>{t("creationStatus")}<select value={draft.creationStatus} onChange={event => patch({ creationStatus: event.target.value as Artwork["creationStatus"] })}>
                        {artworkArchiveCreationStatuses.map(value => <option key={value} value={value}>{t(statusLabels[value])}</option>)}</select></label>
                    <label>{t("category")}<select value={draft.category} onChange={event => patch({ category: event.target.value })}>
                        <option value="all">{t("allCategories")}</option>{options.categories.map(value => <option key={value} value={value}>{formatArtworkCategory(value, locale)}</option>)}</select></label>
                    <label>{t("year")}<select value={draft.year} onChange={event => patch({ year: event.target.value === "all" ? "all" : Number(event.target.value) })}>
                        <option value="all">{t("allYears")}</option>{options.years.map(value => <option key={value}>{value}</option>)}</select></label>
                    <label>{t("medium")}<select value={draft.medium} onChange={event => patch({ medium: event.target.value as ArtworkArchiveFilters["medium"] })}>
                        <option value="all">{t("allMediums")}</option>{options.mediums.map(value => <option key={value} value={value}>{formatArtworkMedium(value, locale)}</option>)}</select></label>
                    <label>{t("sortLabel")}<select value={draft.sort} onChange={event => patch({ sort: event.target.value as ArtworkArchiveFilters["sort"] })}>
                        {artworkArchiveSorts.map(value => <option key={value} value={value}>{t(sortLabels[value])}</option>)}</select></label>
                    <label>{book("density")}<select value={perLeaf} onChange={event => setPerLeaf(Number(event.target.value))}><option>1</option><option>2</option></select></label>
                    <label className={styles.featured}><input type="checkbox" checked={draft.featured} onChange={event => patch({ featured: event.target.checked })} />{t("featured")}</label>
                    <button type="button" className={styles.reset} onClick={() => { setDraft(readArtworkArchiveFilters(artworks, new URLSearchParams())); setPerLeaf(2); search.current?.focus(); }}>{t("reset")}</button>
                </form>
                <section className={styles.results} aria-label={book("index")}>
                    <p role="status">{t("resultCount", { count: results.length })}</p>
                    {results.length ? <ol data-lenis-prevent="">{results.map((work, index) => <li key={work.id}>
                        <Link href={artworkExperienceHref(work.slug, detailQuery, "glass")} prefetch={false} onNavigate={() => onApply(draft, perLeaf, work)}>
                            <strong>{localizeArtwork(work, locale).title}</strong><small>{book(spread ? "indexSpread" : "indexPage", { page: 1 + Math.floor(index / perView) })} · {getArtworkYear(work.date)}</small>
                        </Link></li>)}</ol> : <p className={styles.empty}>{t("empty")}</p>}
                </section>
            </div>
            <div className={styles.actions}><button type="submit" form={id + "-form"} disabled={!results.length}>{book("showResults")} <span aria-hidden="true">→</span></button></div>
        </div>
    </dialog>;
}
