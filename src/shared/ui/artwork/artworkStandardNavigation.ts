import gsap from "gsap";
import { ARTWORK_KINETICS as motion, artworkKineticTween, artworkPointerDirection,
    artworkPointerVelocity, artworkWheelOffset, artworkWheelVelocity, type ArtworkDirection } from "./artworkKinetics";

export interface ArtworkStandardNavigation {
    navigate(direction: ArtworkDirection): void;
    begin(): void;
    preview(distance: number): void;
    release(): void;
    reset(): void;
    selectionChanged(): void;
    dispose(): void;
}

/** The gallery adapts the approved detail kinetics to three complete framed pages. */
export function bindArtworkStandardNavigation(viewport: HTMLElement, track: HTMLElement, options: {
    navigate(direction: ArtworkDirection): void; zoomed(): boolean; onInteraction(): void;
}): ArtworkStandardNavigation {
    const view = viewport.ownerDocument.defaultView!;
    const reduced = view.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false, settling = false, queued = 0, suppressClickUntil = 0, queueFrame = 0;
    let pointer: { id: number; x: number; y: number; axis: "pending" | "horizontal" | "vertical" } | null = null;
    let pointerActive = false, pointerDistance = 0, pointerOrigin = 0, pointerVelocity = 0, pointerTime = 0;
    let wheelDistance = 0, wheelVelocity = 0, wheelTime = 0, wheelReset = 0, wheelUnlock = 0, wheelLocked = false;
    const width = () => Math.max(1, viewport.getBoundingClientRect().width);
    gsap.set(track, { force3D: true });
    const setPosition = gsap.quickSetter(track, "x", "px") as (value: number) => void;
    const position = () => Number(gsap.getProperty(track, "x")) || 0;
    const ignored = (target: EventTarget | null) => options.zoomed() || Boolean((target as Element | null)?.closest(
        "a,button,input,textarea,select,[contenteditable],[data-artwork-highlights],[data-lightbox-native-scroll],[data-artwork-kinetic-ignore]"));
    function clearWheel() {
        view.clearTimeout(wheelReset); wheelReset = 0;
        wheelDistance = 0; wheelVelocity = 0; wheelTime = 0;
    }
    function render(x: number) { setPosition(x); viewport.dataset.artworkDragging = ""; }
    function reset() {
        if (disposed || settling) return;
        pointerActive = false; clearWheel();
        gsap.to(track, { x: 0, duration: reduced.matches ? 0 : motion.resetDuration, ease: "power3.out", overwrite: true,
            onComplete() { delete viewport.dataset.artworkDragging; } });
    }
    function begin() {
        if (disposed || settling || options.zoomed()) return;
        clearWheel(); gsap.killTweensOf(track);
        pointerActive = true; pointerDistance = 0; pointerOrigin = position(); pointerVelocity = 0; pointerTime = view.performance.now();
    }
    function preview(distance: number) {
        if (disposed || settling || options.zoomed()) return;
        if (!pointerActive) begin();
        const now = view.performance.now();
        pointerVelocity = artworkPointerVelocity(pointerVelocity, distance - pointerDistance, now - pointerTime);
        pointerDistance = distance; pointerTime = now;
        render(pointerOrigin + distance);
    }
    function navigate(direction: ArtworkDirection, releaseVelocity = 0, preserveReleaseVelocity = false) {
        if (disposed) return;
        options.onInteraction();
        if (settling) { queued = Math.max(-5, Math.min(5, queued + direction)); return; }
        settling = true; pointerActive = false; clearWheel();
        viewport.dataset.artworkDragging = "";
        if (reduced.matches) { options.navigate(direction); return; }
        const destination = -direction * width();
        // The adjacent React page is already visible during the grip. Keep it
        // on screen at landing until React re-centres the new three-page window.
        gsap.to(track, { x: destination, ...artworkKineticTween(Math.abs(destination - position()), releaseVelocity, preserveReleaseVelocity),
            overwrite: true, onComplete() { if (!disposed) options.navigate(direction); } });
    }
    function release() {
        if (disposed || settling || !pointerActive) return;
        pointerActive = false;
        const displacement = position();
        const direction = artworkPointerDirection(displacement, pointerVelocity, width(), true, true,
            view.performance.now() - pointerTime);
        if (Math.abs(displacement) >= motion.intentDistance) suppressClickUntil = view.performance.now() + 350;
        if (direction) navigate(direction, pointerVelocity); else reset();
    }
    function selectionChanged() {
        if (disposed) return;
        pointer = null; pointerActive = false; settling = false; clearWheel();
        gsap.killTweensOf(track); gsap.set(track, { x: 0 }); delete viewport.dataset.artworkDragging;
        if (queued) {
            view.cancelAnimationFrame(queueFrame);
            queueFrame = view.requestAnimationFrame(() => {
                queueFrame = 0;
                if (!disposed && queued) { const direction = queued > 0 ? 1 : -1; queued -= direction; navigate(direction); }
            });
        }
    }
    function down(event: PointerEvent) {
        if (event.pointerType !== "mouse" || event.button !== 0 || settling || ignored(event.target)) return;
        begin();
        pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, axis: "pending" };
        options.onInteraction();
    }
    function move(event: PointerEvent) {
        if (!pointer || event.pointerId !== pointer.id) return;
        const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
        if (pointer.axis === "pending") {
            if (Math.abs(dx) < 1 && Math.abs(dy) < motion.intentDistance) return;
            if (Math.abs(dx) < Math.abs(dy) * motion.axisLockRatio && Math.abs(dy) < motion.intentDistance) return;
            pointer.axis = Math.abs(dx) >= Math.abs(dy) * motion.axisLockRatio ? "horizontal" : "vertical";
            if (pointer.axis === "vertical") { pointerActive = false; return; }
            try { viewport.setPointerCapture(event.pointerId); } catch { /* Outside document. */ }
            viewport.ownerDocument.getSelection()?.removeAllRanges();
        }
        if (pointer.axis !== "horizontal") return;
        event.preventDefault(); preview(dx);
    }
    function end(event: PointerEvent) {
        if (!pointer || event.pointerId !== pointer.id) return;
        if (event.type === "pointerup" && event.clientX - pointer.x !== pointerDistance) move(event);
        const gesture = pointer; pointer = null;
        try { viewport.releasePointerCapture(event.pointerId); } catch { /* Already released. */ }
        if (gesture.axis !== "horizontal") {
            pointerActive = false;
            if (Math.abs(position()) > .5) reset();
            return;
        }
        if (event.type === "pointercancel") reset(); else release();
    }
    function holdWheelTail() {
        wheelLocked = true; view.clearTimeout(wheelUnlock);
        wheelUnlock = view.setTimeout(() => { wheelUnlock = 0; wheelLocked = false; }, motion.wheelGestureEndMs);
    }
    function wheel(event: WheelEvent) {
        if (event.ctrlKey || pointerActive || ignored(event.target)) return;
        const horizontal = event.shiftKey || (Math.abs(event.deltaX) > 0 && Math.abs(event.deltaX) >= Math.abs(event.deltaY) * motion.axisLockRatio);
        if (!horizontal) return;
        event.preventDefault(); options.onInteraction();
        if (wheelLocked) { holdWheelTail(); return; }
        if (settling) return;
        const units = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? width() : 1;
        const delta = (event.shiftKey ? event.deltaY : event.deltaX) * units;
        if (!delta) return;
        const now = view.performance.now();
        if (wheelTime > 0) wheelVelocity = artworkWheelVelocity(wheelVelocity, delta, now - wheelTime);
        wheelTime = now;
        wheelDistance = wheelDistance && Math.sign(wheelDistance) !== Math.sign(delta) ? delta : wheelDistance + delta;
        gsap.killTweensOf(track); render(artworkWheelOffset(wheelDistance, width(), true));
        view.clearTimeout(wheelReset);
        if (Math.abs(wheelDistance) >= motion.wheelTrigger) {
            const direction = wheelDistance > 0 ? 1 : -1, velocity = wheelVelocity;
            holdWheelTail(); navigate(direction, velocity, true);
        } else wheelReset = view.setTimeout(reset, motion.wheelGestureEndMs);
    }
    function click(event: MouseEvent) {
        if (!suppressClickUntil) return;
        const suppress = view.performance.now() <= suppressClickUntil;
        suppressClickUntil = 0;
        if (suppress) { event.preventDefault(); event.stopImmediatePropagation(); }
    }
    function cancel() {
        if (disposed) return;
        const id = pointer?.id; pointer = null; pointerActive = false; queued = 0;
        if (id !== undefined) { try { viewport.releasePointerCapture(id); } catch { /* Already released. */ } }
        view.cancelAnimationFrame(queueFrame); queueFrame = 0;
        settling = false; reset();
    }
    let geometry = width();
    track.style.setProperty("--artwork-kinetic-step", `${geometry}px`);
    const resize = new ResizeObserver(() => {
        if (Math.abs(width() - geometry) < .5) return;
        geometry = width(); track.style.setProperty("--artwork-kinetic-step", `${geometry}px`);
        queued = 0; selectionChanged();
    });
    resize.observe(viewport);
    viewport.addEventListener("pointerdown", down);
    view.addEventListener("pointermove", move, { passive: false });
    view.addEventListener("pointerup", end); view.addEventListener("pointercancel", end);
    viewport.addEventListener("wheel", wheel, { passive: false, capture: true });
    viewport.addEventListener("click", click, true); view.addEventListener("blur", cancel);
    viewport.addEventListener("artwork-image-zoom", cancel);
    return { navigate, begin, preview, release, reset, selectionChanged, dispose() {
        disposed = true; resize.disconnect(); clearWheel(); view.clearTimeout(wheelUnlock); view.cancelAnimationFrame(queueFrame);
        gsap.killTweensOf(track); gsap.set(track, { clearProps: "transform" }); track.style.removeProperty("--artwork-kinetic-step");
        delete viewport.dataset.artworkDragging;
        viewport.removeEventListener("pointerdown", down); view.removeEventListener("pointermove", move);
        view.removeEventListener("pointerup", end); view.removeEventListener("pointercancel", end);
        viewport.removeEventListener("wheel", wheel, true); viewport.removeEventListener("click", click, true); view.removeEventListener("blur", cancel);
        viewport.removeEventListener("artwork-image-zoom", cancel);
    } };
}
