"use client";

import styles from "@/shared/ui/artwork/ArtworkNavigationFeedback.module.css";
import { stripLocalePrefix } from "@/i18n/config";

type PendingView = {
    element: HTMLElement;
    target: string;
    timer: number;
    observer: MutationObserver;
    onLeave: () => void;
};

let pending: PendingView | null = null;

function clearPendingView() {
    if (!pending) return;
    const view = pending;
    pending = null;
    window.clearTimeout(view.timer);
    view.observer.disconnect();
    window.removeEventListener("popstate", view.onLeave);
    window.removeEventListener("resize", view.onLeave);
    window.removeEventListener("pagehide", view.onLeave);
    view.element.remove();
}

function routeKey(url: URL) {
    const params = new URLSearchParams(url.search);
    params.sort();
    return `${url.pathname}?${params.toString()}`;
}

export function hasStandardNavigationSnapshot() {
    return Boolean(pending);
}

// A short-lived, inert visual copy bridges the already-rendered scene and
// App Router's next payload. It never becomes an interactive second viewer.
export function captureStandardNavigation(viewport: HTMLElement, href: string) {
    const target = new URL(href, window.location.href);
    if (target.origin !== window.location.origin || !stripLocalePrefix(target.pathname).startsWith("/artworks/") || target.searchParams.get("experience") !== "standard") return;
    clearPendingView();
    const source = routeKey(new URL(window.location.href));
    const destination = routeKey(target);
    const rect = viewport.getBoundingClientRect();
    const element = document.createElement("div");
    element.className = styles.snapshot;
    element.dataset.artworkNavigationSnapshot = "";
    element.inert = true;
    element.setAttribute("aria-hidden", "true");
    Object.assign(element.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
    const copy = viewport.cloneNode(true) as HTMLElement;
    copy.removeAttribute("data-artwork-dragging");
    copy.removeAttribute("id");
    copy.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
    element.append(copy);
    document.body.append(element);
    // cloneNode does not copy reading-pane or native portrait scroll offsets.
    const originals = [viewport, ...viewport.querySelectorAll<HTMLElement>("*")];
    const copies = [copy, ...copy.querySelectorAll<HTMLElement>("*")];
    originals.forEach((node, index) => {
        if (node.scrollTop || node.scrollLeft) {
            copies[index].scrollTop = node.scrollTop;
            copies[index].scrollLeft = node.scrollLeft;
        }
    });
    const onLeave = () => clearPendingView();
    const observer = new MutationObserver(() => {
        const current = routeKey(new URL(window.location.href));
        if (current !== source && current !== destination) clearPendingView();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    pending = { element, target: destination, observer, onLeave, timer: window.setTimeout(onLeave, 30000) };
    window.addEventListener("popstate", onLeave);
    window.addEventListener("resize", onLeave);
    window.addEventListener("pagehide", onLeave);
}

export function finishStandardNavigation(viewport: HTMLElement) {
    const view = pending;
    if (!view || routeKey(new URL(window.location.href)) !== view.target) return;
    let cancelled = false;
    const cleanups: Array<() => void> = [];
    const images = viewport.querySelectorAll<HTMLImageElement>('[data-artwork-kinetic-panel="current"] img');
    const ready = Array.from(images, (image) => new Promise<void>((resolve) => {
        let finished = false;
        const done = () => {
            if (finished) return;
            finished = true;
            image.removeEventListener("load", loaded);
            image.removeEventListener("error", done);
            resolve();
        };
        const loaded = () => {
            if (typeof image.decode === "function" && image.naturalWidth) image.decode().then(done, done);
            else done();
        };
        cleanups.push(done);
        image.addEventListener("load", loaded, { once: true });
        image.addEventListener("error", done, { once: true });
        if (image.complete) loaded();
    }));
    Promise.all([...ready, document.fonts?.ready]).then(() => {
        if (!cancelled && pending === view && routeKey(new URL(window.location.href)) === view.target) clearPendingView();
    });
    return () => { cancelled = true; cleanups.forEach((cleanup) => cleanup()); };
}
