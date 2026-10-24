export type ImagePoint = { x: number; y: number };
export interface ArtworkImageGestureActions {
    isOpen(): boolean;
    scale(): number;
    pan(): ImagePoint;
    open(scale: number): void;
    zoom(scale: number): void;
    move(point: ImagePoint): void;
    activity(active: boolean): void;
}

const photos = "[data-artwork-detail-photo], [data-artwork-arrival-photo], img.ga-image";
const clampScale = (value: number) => Math.max(1, Math.min(3, value));

/** Preview gestures open the existing image viewer; its own canvas keeps pan/pinch. */
export function bindArtworkImageGestures(root: HTMLElement, actions: ArtworkImageGestureActions, preview = true) {
    const doc = root.ownerDocument, view = doc.defaultView!;
    const pointers = new Map<number, ImagePoint>();
    let image: HTMLElement | null = null;
    let started = false, pinchDistance = 0, pinchScale = 1, gestureScale = 1, quiet = 0;
    let wheelScale: number | null = null, wheelPan: ImagePoint | null = null;
    const previous = new Map<HTMLElement, { marker: string | null; cursor: string; touch: string }>();
    function mark() {
        if (!preview) return;
        previous.forEach((saved, photo) => {
            if (root.contains(photo)) return;
            if (saved.marker === null) photo.removeAttribute("data-artwork-zoom-surface"); else photo.setAttribute("data-artwork-zoom-surface", saved.marker);
            photo.style.cursor = saved.cursor; photo.style.touchAction = saved.touch;
            previous.delete(photo);
        });
        root.querySelectorAll<HTMLElement>(photos).forEach(photo => {
            if (previous.has(photo)) return;
            previous.set(photo, { marker: photo.getAttribute("data-artwork-zoom-surface"), cursor: photo.style.cursor, touch: photo.style.touchAction });
            photo.setAttribute("data-artwork-zoom-surface", "");
            photo.style.touchAction = "pan-y";
        });
    }
    mark();
    const observer = preview ? new MutationObserver(mark) : null;
    observer?.observe(root, { childList: true, subtree: true });
    function target(event: Event): HTMLElement | null {
        if (!preview) return root;
        const photo = (event.target as Element | null)?.closest<HTMLElement>(photos);
        return photo && root.contains(photo) && !photo.closest("[inert], [aria-hidden='true']") ? photo : null;
    }
    function claim() {
        if (!actions.isOpen()) {
            root.dispatchEvent(new CustomEvent("artwork-image-zoom", { bubbles: true }));
        }
        actions.activity(true);
    }
    function liveZoom(value: number) {
        const scale = clampScale(value);
        claim();
        if (actions.isOpen()) actions.zoom(scale); else actions.open(scale);
    }
    function finishActivity() {
        view.clearTimeout(quiet);
        quiet = view.setTimeout(() => { quiet = 0; wheelScale = null; wheelPan = null; actions.activity(false); }, 100);
    }
    function wheel(event: WheelEvent) {
        if (!target(event)) return;
        if (!event.ctrlKey) {
            if (!preview && actions.isOpen()) {
                event.preventDefault(); event.stopPropagation();
                const pan = wheelPan ?? actions.pan();
                actions.activity(true);
                wheelPan = { x: pan.x - event.deltaX, y: pan.y - event.deltaY };
                actions.move(wheelPan); finishActivity();
            }
            return;
        }
        event.preventDefault(); event.stopPropagation();
        const units = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? root.clientHeight : 1;
        const value = clampScale((wheelScale ?? (actions.isOpen() ? actions.scale() : 1)) * Math.exp(-event.deltaY * units * .005));
        wheelScale = value;
        // Pinching outward opens the viewer; pinching inward on a closed photo does nothing.
        if (actions.isOpen() || value > 1) liveZoom(value);
        finishActivity();
    }
    function down(event: PointerEvent) {
        if (!preview || event.button !== 0 || event.pointerType === "mouse") return;
        const photo = target(event);
        if (!photo) return;
        if (!pointers.size) started = false;
        image = photo;
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (pointers.size === 2) {
            event.preventDefault(); event.stopPropagation();
            const [a, b] = Array.from(pointers.values());
            pinchDistance = Math.max(1, Math.hypot(a.x - b.x, a.y - b.y));
            pinchScale = actions.isOpen() ? actions.scale() : 1;
            started = false;
        }
    }
    function move(event: PointerEvent) {
        if (!preview || !pointers.has(event.pointerId)) return;
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (pointers.size >= 2 && pinchDistance > 0) {
            const [a, b] = Array.from(pointers.values());
            const value = pinchScale * Math.hypot(a.x - b.x, a.y - b.y) / pinchDistance;
            if (!actions.isOpen() && value < 1.025) return;
            event.preventDefault(); event.stopPropagation(); started = true; liveZoom(value);
        }
    }
    function end(event: PointerEvent) {
        if (!pointers.delete(event.pointerId)) return;
        try { if (image?.hasPointerCapture(event.pointerId)) image.releasePointerCapture(event.pointerId); } catch { /* Already released. */ }
        if (started) { event.preventDefault(); event.stopPropagation(); }
        if (pointers.size < 2) pinchDistance = 0;
        if (!pointers.size) { image = null; started = false; finishActivity(); }
    }
    function touch(event: TouchEvent) {
        if (event.touches.length >= 2 && target(event)) event.preventDefault();
    }
    type ScaleEvent = Event & { scale?: number };
    function gestureStart(event: Event) {
        if (!target(event)) return;
        event.preventDefault(); gestureScale = actions.isOpen() ? actions.scale() : 1;
    }
    function gestureChange(event: Event) {
        if (!target(event)) return;
        event.preventDefault(); event.stopPropagation();
        const value = gestureScale * ((event as ScaleEvent).scale ?? 1);
        if (actions.isOpen() || value > 1) liveZoom(value);
    }
    root.addEventListener("wheel", wheel, { capture: true, passive: false });
    root.addEventListener("gesturestart", gestureStart, { capture: true, passive: false });
    root.addEventListener("gesturechange", gestureChange, { capture: true, passive: false });
    root.addEventListener("gestureend", finishActivity, true);
    if (preview) {
        root.addEventListener("pointerdown", down, true);
        doc.addEventListener("pointermove", move, { capture: true, passive: false });
        doc.addEventListener("pointerup", end, true); doc.addEventListener("pointercancel", end, true);
        root.addEventListener("touchstart", touch, { capture: true, passive: false });
        root.addEventListener("touchmove", touch, { capture: true, passive: false });
    }
    return () => {
        observer?.disconnect(); view.clearTimeout(quiet);
        root.removeEventListener("wheel", wheel, true); root.removeEventListener("gesturestart", gestureStart, true);
        root.removeEventListener("gesturechange", gestureChange, true); root.removeEventListener("gestureend", finishActivity, true);
        root.removeEventListener("pointerdown", down, true); doc.removeEventListener("pointermove", move, true);
        doc.removeEventListener("pointerup", end, true); doc.removeEventListener("pointercancel", end, true);
        root.removeEventListener("touchstart", touch, true); root.removeEventListener("touchmove", touch, true);
        previous.forEach((saved, photo) => {
            if (saved.marker === null) photo.removeAttribute("data-artwork-zoom-surface"); else photo.setAttribute("data-artwork-zoom-surface", saved.marker);
            photo.style.cursor = saved.cursor; photo.style.touchAction = saved.touch;
        });
        pointers.clear();
    };
}
