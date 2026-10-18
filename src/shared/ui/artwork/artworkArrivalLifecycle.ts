import { burstArtworkDust, type ArtworkDustRect } from "@/shared/ui/particle-field/dust";

// Preserve Standard portrait eligibility and include the existing tablet landscape layouts.
export const STANDARD_ARTWORK_ACCENT_QUERY = "(orientation: portrait) and (max-width:1366px), (orientation: portrait) and (any-pointer:coarse), (orientation: landscape) and (min-width:768px) and (min-height:480px) and (max-width:1366px), (orientation: landscape) and (min-width:768px) and (min-height:480px) and (any-pointer:coarse)";

function paintingBounds(image: HTMLImageElement, origin: DOMRect): ArtworkDustRect | null {
    const box = image.getBoundingClientRect();
    if (!box.width || !box.height || !image.naturalWidth || !image.naturalHeight) return null;
    const contained = image.ownerDocument.defaultView?.getComputedStyle(image).objectFit === "contain";
    const scale = Math.min(box.width / image.naturalWidth, box.height / image.naturalHeight);
    const width = contained ? image.naturalWidth * scale : box.width;
    const height = contained ? image.naturalHeight * scale : box.height;
    return { x: box.left - origin.left + (box.width - width) / 2,
        y: box.top - origin.top + (box.height - height) / 2, width, height };
}

export function bindArtworkArrivalAccent(host: HTMLElement, surface: "standard" | "lightbox" = "standard"): () => void {
    const root = host.parentElement;
    const panel = root?.closest<HTMLElement>("[data-artwork-kinetic-panel]");
    const image = root?.querySelector<HTMLImageElement>("[data-artwork-detail-photo], [data-artwork-arrival-photo]");
    const ribbon = root?.querySelector<HTMLElement>("[data-artwork-highlights]");
    const dialog = surface === "lightbox" ? root?.closest<HTMLElement>('[role="dialog"][aria-modal="true"]') : null;
    const viewerPanel = surface === "lightbox" ? root?.closest<HTMLElement>("[data-lightbox-panel]") : null;
    const glassFrame = surface === "lightbox" ? viewerPanel : root?.closest<HTMLElement>("[data-artwork-detail-layout]");
    const zoomLayer = surface === "lightbox" ? root?.querySelector<HTMLElement>("[data-artwork-arrival-zoom]") : null;
    const viewport = surface === "lightbox" ? dialog : panel?.parentElement?.parentElement;
    const document = host.ownerDocument, browserView = document.defaultView;
    if (!root || !image || !ribbon || !glassFrame || !viewport || !browserView ||
        (surface === "standard" && panel?.dataset.artworkKineticPanel !== "current")) return () => {};
    const view: Window = browserView;
    const eligibleViewport = view.matchMedia(surface === "lightbox" ? "(min-width:0px)" : STANDARD_ARTWORK_ACCENT_QUERY);
    const reducedMotion = view.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false, played = false, mediaReady = false, generation = 0;
    let frame: number | null = null, geometry = "", stopDust: (() => void) | null = null;

    function stop() { stopDust?.(); stopDust = null; }
    function interrupt() { played = true; stop(); }
    function queue() {
        if (disposed || frame !== null) return;
        frame = view.requestAnimationFrame(check);
    }
    function check() {
        frame = null;
        if (disposed) return;
        const entry = root!.closest<HTMLElement>("[data-entry-phase]");
        const modalBlocked = Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]')).some(modal => modal !== dialog);
        const zoomed = zoomLayer && (zoomLayer.getBoundingClientRect().width > zoomLayer.offsetWidth * 1.01 ||
            zoomLayer.getBoundingClientRect().height > zoomLayer.offsetHeight * 1.01);
        if (!eligibleViewport.matches || reducedMotion.matches || document.hidden || !host.isConnected || !glassFrame!.isConnected ||
            (surface === "standard" && panel!.dataset.artworkKineticPanel !== "current") || viewport!.hasAttribute("data-artwork-dragging") ||
            (entry && entry.dataset.entryPhase !== "standard") ||
            document.querySelector("[data-artwork-navigation-snapshot]") || modalBlocked || zoomed ||
            viewerPanel?.querySelector("[data-lightbox-native-scroll]")) {
            stop(); return;
        }
        if (!mediaReady || root!.dataset.haloReady !== "true") return;
        const origin = glassFrame!.getBoundingClientRect(), picture = paintingBounds(image!, origin);
        const badge = ribbon!.getBoundingClientRect(), panelBox = panel?.getBoundingClientRect();
        const viewportBox = viewport!.getBoundingClientRect();
        // A neighbouring/partially sliding scene is not a landing.
        if (!picture || !badge.width || !badge.height || (surface === "standard" && Math.abs(panelBox!.left - viewportBox.left) > 1) ||
            origin.top + picture.y >= view.innerHeight || origin.top + picture.y + picture.height <= 0) {
            stop(); return;
        }
        const border = { x: 1, y: 1, width: glassFrame!.clientWidth - 2, height: glassFrame!.clientHeight - 2,
            radius: Math.max(0, (parseFloat(view.getComputedStyle(glassFrame!).borderTopLeftRadius) || 0) - 1) };
        if (border.width <= 0 || border.height <= 0) { stop(); return; }
        const badgeBounds = { x: badge.left - origin.left, y: badge.top - origin.top, width: badge.width, height: badge.height };
        const signature = [border.x, border.y, border.width, border.height, border.radius,
            picture.x, picture.y, picture.width, picture.height,
            badgeBounds.x, badgeBounds.y, badgeBounds.width, badgeBounds.height].map(n => n.toFixed(1)).join("/");
        if (played) { if (signature !== geometry) stop(); return; }
        played = true; geometry = signature;
        // Draw above the complete glass panel, outside the image mask and its stacking context.
        stopDust = burstArtworkDust(glassFrame!, border, badgeBounds);
    }
    function prepare() {
        const token = ++generation;
        mediaReady = false;
        if (!image!.complete || !image!.naturalWidth || !image!.naturalHeight) return;
        const decoded = typeof image!.decode === "function" ? image!.decode() : Promise.resolve();
        Promise.all([decoded, document.fonts?.ready]).then(() => {
            if (disposed || token !== generation) return;
            mediaReady = true; queue();
        }, () => { if (!disposed && token === generation) stop(); });
    }
    function failed() { generation++; mediaReady = false; stop(); }
    function wheel(event: WheelEvent) {
        if ((event.target as Element | null)?.closest("[data-artwork-highlights]")) return;
        if (event.shiftKey || (Math.abs(event.deltaX) > 0 && Math.abs(event.deltaX) >= Math.abs(event.deltaY) * 1.05)) interrupt();
    }
    function navigation(event: MouseEvent) {
        if ((event.target as Element | null)?.closest("[data-artwork-navigation], [data-artwork-arrival-navigation]")) interrupt();
    }
    function keyboard(event: KeyboardEvent) {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") interrupt();
    }
    function visibility() { if (document.hidden) interrupt(); else queue(); }
    const resize = new ResizeObserver(queue);
    resize.observe(root); resize.observe(image); resize.observe(ribbon);
    resize.observe(glassFrame);
    const mutations = new MutationObserver(queue);
    mutations.observe(document.body, { childList: true, subtree: true, attributes: true,
        attributeFilter: ["data-entry-phase", "data-artwork-kinetic-panel", "data-artwork-dragging", "data-halo-ready", "aria-modal"] });
    if (zoomLayer) mutations.observe(zoomLayer, { attributes: true, attributeFilter: ["style"] });
    const capture = { capture: true, passive: true };
    viewport.addEventListener("pointerdown", interrupt, capture);
    viewport.addEventListener("touchstart", interrupt, capture);
    viewport.addEventListener("wheel", wheel, capture);
    viewport.addEventListener("click", navigation, capture);
    viewport.addEventListener("scroll", queue, capture);
    image.addEventListener("load", prepare); image.addEventListener("error", failed);
    eligibleViewport.addEventListener("change", queue); reducedMotion.addEventListener("change", queue);
    document.addEventListener("visibilitychange", visibility);
    view.addEventListener("blur", interrupt); view.addEventListener("resize", queue);
    view.addEventListener("keydown", keyboard);
    prepare(); queue();
    return () => {
        disposed = true; generation++; stop();
        if (frame !== null) view.cancelAnimationFrame(frame);
        resize.disconnect(); mutations.disconnect();
        viewport.removeEventListener("pointerdown", interrupt, true);
        viewport.removeEventListener("touchstart", interrupt, true);
        viewport.removeEventListener("wheel", wheel, true);
        viewport.removeEventListener("click", navigation, true);
        viewport.removeEventListener("scroll", queue, true);
        image.removeEventListener("load", prepare); image.removeEventListener("error", failed);
        eligibleViewport.removeEventListener("change", queue); reducedMotion.removeEventListener("change", queue);
        document.removeEventListener("visibilitychange", visibility);
        view.removeEventListener("blur", interrupt); view.removeEventListener("resize", queue);
        view.removeEventListener("keydown", keyboard);
    };
}
