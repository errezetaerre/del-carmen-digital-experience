import gsap from "gsap";

interface ThumbnailDimensions {
    width: number;
    height: number;
    naturalWidth: number;
    naturalHeight: number;
}

export interface ArtworkThumbnailPanPlan {
    axis: "x" | "y";
    overflow: number;
    rest: string;
    far: string;
    near: string;
}

// Measure the replaced image at its layout size, independently of the approved
// hover scale. Only object-fit: cover crops are eligible; contain stays still.
export function getArtworkThumbnailPanPlan(
    { width, height, naturalWidth, naturalHeight }: ThumbnailDimensions,
    position = "50% 50%",
): ArtworkThumbnailPanPlan | null {
    if (![width, height, naturalWidth, naturalHeight].every(value => Number.isFinite(value) && value > 0)) return null;
    const coordinates = position.trim().split(/\s+/);
    if (coordinates.length !== 2 || !coordinates.every(value => /^-?\d+(?:\.\d+)?%$/.test(value))) return null;
    const scale = Math.max(width / naturalWidth, height / naturalHeight);
    const x = Math.max(0, naturalWidth * scale - width);
    const y = Math.max(0, naturalHeight * scale - height);
    if (Math.max(x, y) <= 2) return null;
    const axis = x > y ? "x" : "y";
    return {
        axis, overflow: Math.max(x, y), rest: position,
        far: axis === "x" ? "100% " + coordinates[1] : coordinates[0] + " 100%",
        near: axis === "x" ? "0% " + coordinates[1] : coordinates[0] + " 0%",
    };
}

export function bindArtworkThumbnailPan(root: HTMLElement): () => void {
    const image = root.querySelector<HTMLImageElement>("[data-artwork-thumbnail-image]");
    const doc = root.ownerDocument, view = doc.defaultView;
    if (!image || !view) return () => {};
    const reduced = view.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = view.matchMedia("(hover: hover) and (pointer: fine)");
    const original = image.style.getPropertyValue("object-position");
    const priority = image.style.getPropertyPriority("object-position");
    const cleanups: Array<() => void> = [];
    let plan: ArtworkThumbnailPanPlan | null = null;
    let pan: gsap.core.Timeline | null = null;
    let returning: gsap.core.Tween | null = null;
    let visible = false, hovered = root.matches(":hover"), focused = root.contains(doc.activeElement), disposed = false;
    let resizeTimer = 0;

    function restore() {
        if (original) image!.style.setProperty("object-position", original, priority);
        else image!.style.removeProperty("object-position");
    }
    function stop() {
        pan?.kill(); returning?.kill();
        pan = null; returning = null;
    }
    function sync() {
        if (disposed) return;
        if (reduced.matches || !plan) { stop(); restore(); return; }
        // Page clones inherit the current inline object-position. Pause originals
        // in the same task's mutation checkpoint, keeping the turning sheet exact.
        const blocked = root.closest('[inert], [hidden], [aria-hidden="true"], [data-portrait-turning]');
        if (!visible || doc.hidden || blocked) { pan?.pause(); returning?.pause(); return; }
        if (fine.matches && !hovered && !focused) {
            if (returning) { returning.play(); return; }
            if (!pan) return;
            pan.pause();
            returning = gsap.to(image, {
                objectPosition: plan.rest, duration: .65, ease: "power2.out",
                onComplete() { stop(); restore(); },
            });
            return;
        }
        if (returning) { stop(); }
        if (!pan) {
            pan = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: "sine.inOut" } })
                .to(image, { objectPosition: plan.far, duration: 4 })
                .to(image, { objectPosition: plan.far, duration: .8, ease: "none" })
                .to(image, { objectPosition: plan.near, duration: 8 })
                .to(image, { objectPosition: plan.near, duration: .8, ease: "none" })
                .to(image, { objectPosition: plan.rest, duration: 4 });
        }
        pan.play();
    }
    function measure() {
        if (disposed) return;
        view!.clearTimeout(resizeTimer);
        stop(); restore();
        const style = view!.getComputedStyle(image!);
        plan = image!.complete && style.objectFit === "cover"
            ? getArtworkThumbnailPanPlan({
                width: image!.clientWidth, height: image!.clientHeight,
                naturalWidth: image!.naturalWidth, naturalHeight: image!.naturalHeight,
            }, style.objectPosition)
            : null;
        sync();
    }
    function resize() {
        // A collection rail also expands on hover. Wait for its geometry to settle
        // instead of restarting a pan on every frame of that approved transition.
        stop(); restore();
        plan = null;
        view!.clearTimeout(resizeTimer);
        resizeTimer = view!.setTimeout(measure, 120);
    }
    function listen(target: EventTarget, name: string, listener: EventListener) {
        target.addEventListener(name, listener);
        cleanups.push(() => target.removeEventListener(name, listener));
    }
    listen(root, "pointerenter", event => {
        if ((event as PointerEvent).pointerType !== "touch") { hovered = true; sync(); }
    });
    listen(root, "pointerleave", () => { hovered = false; sync(); });
    listen(root, "focusin", () => { focused = true; sync(); });
    listen(root, "focusout", event => {
        focused = root.contains((event as FocusEvent).relatedTarget as Node | null); sync();
    });
    listen(image, "load", measure);
    listen(image, "error", measure);
    listen(doc, "visibilitychange", sync);
    listen(reduced, "change", sync);
    listen(fine, "change", sync);

    const intersection = typeof view.IntersectionObserver === "function" ? new view.IntersectionObserver(entries => {
        const entry = entries.find(entry => entry.target === image);
        if (entry) { visible = entry.isIntersecting && entry.intersectionRatio >= .3; sync(); }
    }, { threshold: [0, .3, 1] }) : null;
    if (intersection) intersection.observe(image);
    // Browsers without visibility observation retain the static approved crop.
    const size = typeof view.ResizeObserver === "function" ? new view.ResizeObserver(resize) : null;
    size?.observe(image);
    if (!size) listen(view, "resize", resize);
    const ancestry = typeof view.MutationObserver === "function" ? new view.MutationObserver(sync) : null;
    for (let node: HTMLElement | null = root; node; node = node.parentElement) {
        ancestry?.observe(node, { attributes: true, attributeFilter: ["inert", "hidden", "aria-hidden", "data-portrait-turning"] });
    }
    measure();
    return () => {
        disposed = true;
        view.clearTimeout(resizeTimer);
        intersection?.disconnect(); size?.disconnect(); ancestry?.disconnect();
        for (const cleanup of cleanups) cleanup();
        stop(); restore();
    };
}
