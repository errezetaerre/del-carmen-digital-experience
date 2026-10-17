"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Artwork } from "@/domains/artworks/model/artwork";
import { getArtworkPresentation } from "@/domains/artworks/presentation/getArtworkPresentation";
import { artworkHaloSymbol } from "./artworkHaloSymbols";
import styles from "./ArtworkBadges.module.css";

interface Props {
    artwork: Artwork;
    variant?: "ribbon" | "thumbnail";
    expanded?: boolean;
    passive?: boolean;
    className?: string;
}

export default function ArtworkBadges({ artwork, variant = "ribbon", expanded = false, passive = false, className = "" }: Props) {
    const { badges: allBadges } = getArtworkPresentation(artwork);
    const badges = allBadges.filter((badge) => badge.kind !== "planned" && badge.kind !== "in-progress");
    const id = useId();
    const trackRef = useRef<HTMLDivElement>(null);
    const [openId, setOpenId] = useState<string | null>(null);
    const [overflow, setOverflow] = useState(false);
    const [paused, setPaused] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const [dragging, setDragging] = useState(false);
    const pan = useRef<{ id: number; x: number; left: number } | null>(null);
    const suppressClick = useRef(false);
    const direction = useRef(1);
    const selected = badges.find((badge) => badge.id === openId);
    const expandedThumbnail = variant === "thumbnail" && (expanded || !!selected);
    const signature = badges.map((badge) => badge.id).join("|");

    useEffect(() => {
        setOpenId(null); setPaused(false); direction.current = 1;
        if (trackRef.current) trackRef.current.scrollLeft = 0;
    }, [artwork.id, signature]);

    useEffect(() => {
        const track = trackRef.current;
        if (variant !== "ribbon" || !track) return;
        let active = true;
        const measure = () => { if (active) setOverflow(track.scrollWidth > track.clientWidth + 1); };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(track);
        if (track.firstElementChild) observer.observe(track.firstElementChild);
        document.fonts?.ready.then(measure);
        return () => { active = false; observer.disconnect(); };
    }, [variant, artwork.id, signature]);

    useEffect(() => {
        const track = trackRef.current;
        if (variant !== "ribbon" || !overflow || !track || paused || hovered || focused || dragging || selected) return;
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let frame = 0, last = 0;
        const tick = (now: number) => {
            if (!motion.matches && !document.hidden && !track.closest("[inert]") && last) {
                const limit = Math.max(0, track.scrollWidth - track.clientWidth);
                const next = track.scrollLeft + direction.current * Math.min(now - last, 40) * .016;
                track.scrollLeft = Math.max(0, Math.min(limit, next));
                if (next >= limit) direction.current = -1;
                else if (next <= 0) direction.current = 1;
            }
            last = now; frame = window.requestAnimationFrame(tick);
        };
        const restart = () => {
            window.cancelAnimationFrame(frame); last = 0;
            if (!motion.matches && !document.hidden) frame = window.requestAnimationFrame(tick);
        };
        motion.addEventListener("change", restart);
        document.addEventListener("visibilitychange", restart); restart();
        return () => { window.cancelAnimationFrame(frame); motion.removeEventListener("change", restart); document.removeEventListener("visibilitychange", restart); };
    }, [variant, overflow, paused, hovered, focused, dragging, selected]);

    if (!badges.length) return null;

    // The enclosing thumbnail link/button owns the single artwork action.
    // Descriptive insignias preserve the rollover without nested controls.
    if (passive) return <div className={`${styles.root} ${styles.thumbnail} ${styles.passive} ${className}`} data-expanded={expanded || undefined} role="img" aria-label={badges.map((badge) => [badge.label, badge.detail].filter(Boolean).join(": ")).join(". ")}>
        <ul className={styles.list}>{badges.map((badge) => <li key={badge.id}><span className={styles.badge}>
            <span className={styles.symbol} dangerouslySetInnerHTML={{ __html: artworkHaloSymbol(badge.kind) }} />
            <span className={styles.copy}><span className={styles.label}>{badge.label}</span>{badge.detail && <span className={styles.detail}>{badge.detail}</span>}</span>
        </span></li>)}</ul>
    </div>;

    return (
        <div className={`${styles.root} ${variant === "thumbnail" ? styles.thumbnail : styles.ribbon} ${className}`}
            data-expanded={expandedThumbnail || undefined} data-artwork-kinetic-ignore data-artwork-highlights
            onPointerDown={(event) => event.stopPropagation()} onClick={(event) => event.stopPropagation()}
            onPointerMove={(event) => event.stopPropagation()} onWheel={(event) => event.stopPropagation()}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            onFocusCapture={() => setFocused(true)}
            onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}
            onKeyDown={(event) => {
                if (event.key === "Escape" && selected) {
                    event.preventDefault(); event.stopPropagation(); setOpenId(null);
                    trackRef.current?.querySelectorAll<HTMLButtonElement>("button")[badges.findIndex((badge) => badge.id === selected.id)]?.focus();
                }
                if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                    event.preventDefault(); event.stopPropagation();
                    if (trackRef.current) trackRef.current.scrollLeft += event.key === "ArrowRight" ? 80 : -80;
                }
            }}>
            <div className={styles.track} ref={trackRef} data-lenis-prevent
                onPointerDown={(event) => {
                    suppressClick.current = false;
                    if (variant === "ribbon" && overflow && event.pointerType !== "mouse") {
                        pan.current = { id: event.pointerId, x: event.clientX, left: event.currentTarget.scrollLeft }; setDragging(true);
                    }
                }}
                onPointerMove={(event) => {
                    if (pan.current?.id !== event.pointerId) return;
                    const dx = event.clientX - pan.current.x;
                    if (Math.abs(dx) > 6) suppressClick.current = true;
                    event.currentTarget.scrollLeft = pan.current.left - dx;
                }}
                onPointerUp={() => { pan.current = null; setDragging(false); }}
                onPointerCancel={() => { pan.current = null; setDragging(false); }}
                onClickCapture={(event) => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}>
                <ul className={styles.list} aria-label="Artwork distinctions">
                    {badges.map((badge, index) => (
                        <li key={badge.id}>
                            <button type="button" className={styles.badge} data-badge-id={badge.id}
                                aria-label={[badge.label, badge.detail].filter(Boolean).join(" — ")}
                                aria-expanded={variant === "thumbnail" ? expandedThumbnail : selected?.id === badge.id}
                                aria-controls={variant === "thumbnail" ? `${id}-${index}` : selected?.id === badge.id ? `${id}-detail` : undefined}
                                onClick={() => setOpenId((current) => current === badge.id ? null : badge.id)}>
                                <span className={styles.symbol} dangerouslySetInnerHTML={{ __html: artworkHaloSymbol(badge.kind) }} />
                                <span className={styles.copy} id={variant === "thumbnail" ? `${id}-${index}` : undefined}>
                                    <span className={styles.label}>{badge.label}</span>
                                    {variant === "thumbnail" && badge.detail && <span className={styles.detail}>{badge.detail}</span>}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {variant === "ribbon" && overflow && <button type="button" className={styles.pause} aria-label={paused ? "Resume distinction ribbon" : "Pause distinction ribbon"} aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? "▷" : "Ⅱ"}</button>}
            {variant === "ribbon" && selected && <div id={`${id}-detail`} role="region" aria-label={selected.label} className={styles.popover} data-artwork-highlight-detail>
                <p>{selected.label}</p><span>{selected.detail ?? "Curatorial selection"}</span>
                <button type="button" aria-label="Close distinction details" onClick={() => {
                    setOpenId(null); trackRef.current?.querySelectorAll<HTMLButtonElement>("button")[badges.findIndex((badge) => badge.id === selected.id)]?.focus();
                }}>×</button>
            </div>}
        </div>
    );
}
