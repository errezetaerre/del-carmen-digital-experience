"use client";

import { useEffect, useLayoutEffect, useRef, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import Link from "@/i18n/navigation";
import { artworkExperienceHref } from "../../presentation/artworkExperience";
import type { Artwork } from "../../model/artwork";
import GlassArtworkFrame from "@/shared/ui/artwork/GlassArtworkFrame";
import BookThumbnail from "./BookThumbnail";
import { bindArtworkDockPointer } from "./artworkBookDockPointer";
import styles from "./ArtworkBookDock.module.css";

interface Props {
    works: Artwork[];
    selected: number;
    query: string;
    onFollow?(slug: string): void;
}

function revealSlot(nav: HTMLElement, slot: HTMLElement) {
    const top = slot.offsetTop;
    if (top < nav.scrollTop || top + slot.offsetHeight > nav.scrollTop + nav.clientHeight) {
        nav.scrollTop = top - (nav.clientHeight - slot.offsetHeight) / 2;
    }
}

export default function ArtworkBookDock({ works, selected, query, onFollow }: Props) {
    const t = useTranslations("ArchiveBook");
    const rail = useRef<HTMLElement>(null);
    const active = Math.max(0, selected);

    useLayoutEffect(() => {
        const nav = rail.current;
        const slot = nav?.querySelector<HTMLElement>('a[aria-current="true"]')?.parentElement;
        if (nav && slot) revealSlot(nav, slot);
    }, [active, works]);

    useEffect(() => {
        if (rail.current) return bindArtworkDockPointer(rail.current);
    }, [works]);

    function navigateIndex(event: KeyboardEvent<HTMLElement>) {
        const links = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>("a"));
        const current = links.indexOf(event.target as HTMLAnchorElement);
        const next = { ArrowDown: current + 1, ArrowUp: current - 1, Home: 0, End: links.length - 1 }[event.key];
        if (next === undefined) return;
        event.preventDefault();
        event.stopPropagation();
        const link = links[Math.max(0, Math.min(links.length - 1, next))];
        const slot = link?.parentElement;
        if (slot) revealSlot(event.currentTarget, slot);
        link?.focus({ preventScroll: true });
    }

    if (!works.length) return null;
    return <aside className={styles.dock} data-artwork-dock="">
        <GlassArtworkFrame className={styles.glass} aria-hidden="true" />
        <nav ref={rail} className={styles.rail} aria-label={t("index")} onKeyDown={navigateIndex} data-lightbox-native-scroll="" data-lenis-prevent="">
            <ol>{works.map((work, i) => <li key={work.id}>
                <Link prefetch={false} href={artworkExperienceHref(work.slug, query, "glass")}
                    aria-label={t("plus", { title: work.title })} aria-current={i === active || undefined}
                    tabIndex={i === active ? 0 : -1} onNavigate={() => onFollow?.(work.slug)}>
                    <BookThumbnail artwork={work} sizes="150px" />
                    <span className={styles.caption} aria-hidden="true">{work.title}</span>
                </Link>
            </li>)}</ol>
        </nav>
    </aside>;
}
