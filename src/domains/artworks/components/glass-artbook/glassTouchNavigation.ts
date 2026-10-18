"use client";

import type { ArtworkDragInput } from "../artworkTouchNavigation";

interface Handlers {
    start(input: ArtworkDragInput): boolean;
    move(input: ArtworkDragInput): void;
    end(input: ArtworkDragInput): void;
}

// Touch feeds the same drag/release physics as mouse. The native non-passive
// move listener owns only a committed horizontal gesture, leaving reading native.
export function bindGlassTouchNavigation(viewport: HTMLDivElement, handlers: Handlers) {
    let active: ArtworkDragInput | null = null;
    let horizontal = false;
    let origin: EventTarget | null = null;
    const retained = true;
    const seen = new WeakSet<TouchEvent>();
    const options = { passive: false, capture: true };
    const once = (event: TouchEvent) => {
        if (!retained) return true;
        if (seen.has(event)) return false;
        seen.add(event);
        return true;
    };
    const releaseOrigin = () => {
        if (!origin) return;
        origin.removeEventListener("touchmove", move as EventListener, true);
        origin.removeEventListener("touchend", end as EventListener, true);
        origin.removeEventListener("touchcancel", onCancel as EventListener, true);
        origin = null;
    };
    const input = (event: TouchEvent, touch: Touch, type: string): ArtworkDragInput => ({
        type, pointerId: touch.identifier, pointerType: "touch", button: 0,
        clientX: touch.clientX, clientY: touch.clientY,
        target: event.target, currentTarget: viewport,
        preventDefault: () => { if (event.cancelable) event.preventDefault(); },
    });
    const cancel = () => {
        const previous = active;
        active = null;
        horizontal = false;
        releaseOrigin();
        if (previous) handlers.end({ ...previous, type: "pointercancel", preventDefault() {} });
    };
    const start = (event: TouchEvent) => {
        if (event.touches.length !== 1) { cancel(); return; }
        // Recover in one press if a browser never delivered the previous end.
        if (retained && active) cancel();
        if (active) return;
        const next = input(event, event.touches[0], "pointerdown");
        if (handlers.start(next)) {
            active = next;
            if (retained && event.target && event.target !== viewport) {
                origin = event.target;
                origin.addEventListener("touchmove", move as EventListener, options);
                origin.addEventListener("touchend", end as EventListener, options);
                origin.addEventListener("touchcancel", onCancel as EventListener, options);
            }
        }
    };
    const move = (event: TouchEvent) => {
        if (!once(event) || !active) return;
        if (event.touches.length !== 1) { cancel(); return; }
        const touch = Array.from(event.touches).find((item) => item.identifier === active?.pointerId);
        if (!touch) { cancel(); return; }
        active = input(event, touch, "pointermove");
        handlers.move(active);
        horizontal ||= event.defaultPrevented;
    };
    const end = (event: TouchEvent) => {
        if (!once(event) || !active) return;
        const touch = Array.from(event.changedTouches).find((item) => item.identifier === active?.pointerId);
        if (!touch) return;
        const last = input(event, touch, "pointerup");
        active = null;
        releaseOrigin();
        if (horizontal && event.cancelable) event.preventDefault();
        horizontal = false;
        handlers.end(last);
    };
    const onCancel = (event: TouchEvent) => { if (once(event)) cancel(); };
    viewport.addEventListener("touchstart", start, options);
    viewport.addEventListener("touchmove", move, options);
    viewport.addEventListener("touchend", end, options);
    viewport.addEventListener("touchcancel", onCancel, options);
    return () => {
        viewport.removeEventListener("touchstart", start, true);
        viewport.removeEventListener("touchmove", move, true);
        viewport.removeEventListener("touchend", end, true);
        viewport.removeEventListener("touchcancel", onCancel, true);
        cancel();
    };
}
