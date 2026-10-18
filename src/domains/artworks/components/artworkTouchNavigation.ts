"use client";

export interface ArtworkDragInput {
    type: string;
    pointerId: number;
    pointerType: string;
    button: number;
    clientX: number;
    clientY: number;
    target: EventTarget | null;
    currentTarget: HTMLDivElement;
    preventDefault(): void;
}

interface Handlers {
    start(input: ArtworkDragInput): boolean;
    move(input: ArtworkDragInput): void;
    end(input: ArtworkDragInput): void;
}

// Touch feeds the same drag/release physics as mouse. The native non-passive
// move listener owns only a committed horizontal gesture, leaving reading native.
export function bindArtworkTouchNavigation(viewport: HTMLDivElement, handlers: Handlers) {
    let active: ArtworkDragInput | null = null;
    let horizontal = false;
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
        if (previous) handlers.end({ ...previous, type: "pointercancel", preventDefault() {} });
    };
    const start = (event: TouchEvent) => {
        if (event.touches.length !== 1) { cancel(); return; }
        if (active) return;
        const next = input(event, event.touches[0], "pointerdown");
        if (handlers.start(next)) active = next;
    };
    const move = (event: TouchEvent) => {
        if (!active) return;
        if (event.touches.length !== 1) { cancel(); return; }
        const touch = Array.from(event.touches).find((item) => item.identifier === active?.pointerId);
        if (!touch) { cancel(); return; }
        active = input(event, touch, "pointermove");
        handlers.move(active);
        horizontal ||= event.defaultPrevented;
    };
    const end = (event: TouchEvent) => {
        if (!active) return;
        const touch = Array.from(event.changedTouches).find((item) => item.identifier === active?.pointerId);
        if (!touch) return;
        const last = input(event, touch, "pointerup");
        active = null;
        if (horizontal && event.cancelable) event.preventDefault();
        horizontal = false;
        handlers.end(last);
    };
    const options = { passive: false, capture: true };
    viewport.addEventListener("touchstart", start, options);
    viewport.addEventListener("touchmove", move, options);
    viewport.addEventListener("touchend", end, options);
    viewport.addEventListener("touchcancel", cancel, options);
    return () => {
        viewport.removeEventListener("touchstart", start, true);
        viewport.removeEventListener("touchmove", move, true);
        viewport.removeEventListener("touchend", end, true);
        viewport.removeEventListener("touchcancel", cancel, true);
        cancel();
    };
}
