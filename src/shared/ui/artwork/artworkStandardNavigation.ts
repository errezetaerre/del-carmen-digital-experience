import gsap from "gsap";

export interface ArtworkStandardNavigation {
    navigate(direction: -1 | 1): void;
    preview(distance: number): void;
    reset(): void;
    dispose(): void;
}

/** Each artwork and its complete glass frame travel as one surface. */
export function bindArtworkStandardNavigation(viewport: HTMLElement, frame: HTMLElement, options: {
    navigate(direction: -1 | 1): void; zoomed(): boolean; onInteraction(): void;
}): ArtworkStandardNavigation {
    const view = viewport.ownerDocument.defaultView!;
    const reduced = view.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false, settling = false, queued = 0, suppressClick = false;
    let pointer: { id: number; x: number; y: number; dx: number; axis: "pending" | "horizontal" | "vertical" } | null = null;
    let wheelDistance = 0, wheelTimer = 0, wheelLocked = false;
    const ignored = (target: EventTarget | null) => options.zoomed() || Boolean((target as Element | null)?.closest(
        "a,button,input,textarea,select,[contenteditable],[data-artwork-highlights],[data-lightbox-native-scroll]"));
    let outgoing: HTMLElement | null = null;
    let snapshotSerial = 0;
    const width = () => Math.max(1, frame.clientWidth + 32);
    function snapshot(offset: number) {
        const box = frame.getBoundingClientRect(), viewBox = viewport.getBoundingClientRect();
        const copy = frame.cloneNode(true) as HTMLElement;
        copy.inert = true; copy.setAttribute("aria-hidden", "true"); copy.dataset.standardNavigationSnapshot = "";
        copy.querySelectorAll("canvas[data-artwork-dust]").forEach(node => node.remove());
        // Every cloned gradient/description gets a distinct ID while both frames exist.
        const ids = new Map<string, string>();
        copy.querySelectorAll<HTMLElement>("[id]").forEach(node => { const old = node.id; node.id = `slide-${++snapshotSerial}-${old}`; ids.set(old, node.id); });
        copy.querySelectorAll("*").forEach(node => {
            for (const attribute of Array.from(node.attributes)) {
                if (attribute.name === "id") continue;
                let value = attribute.value;
                for (const [old, id] of ids) value = value.replaceAll(`url(#${old})`, `url(#${id})`);
                if (["aria-controls", "aria-labelledby", "aria-describedby"].includes(attribute.name)) value = value.split(" ").map(id => ids.get(id) ?? id).join(" ");
                if (attribute.name === "href" && value.startsWith("#")) value = `#${ids.get(value.slice(1)) ?? value.slice(1)}`;
                if (value !== attribute.value) node.setAttribute(attribute.name, value);
            }
        });
        Object.assign(copy.style, { position: "absolute", left: `${box.left - viewBox.left - offset}px`, top: `${box.top - viewBox.top}px`, width: `${box.width}px`, height: `${box.height}px`, margin: "0", zIndex: "2", pointerEvents: "none" });
        viewport.appendChild(copy); gsap.set(copy, { x: offset });
        return copy;
    }
    function preview(distance: number) {
        if (disposed || settling) return;
        gsap.killTweensOf(frame);
        gsap.set(frame, { x: Math.max(-width(), Math.min(width(), distance)) });
        viewport.dataset.artworkDragging = "";
    }
    function reset() {
        if (!settling) gsap.to(frame, { x: 0, duration: reduced.matches ? 0 : .32, ease: "power3.out", overwrite: true,
            onComplete() { delete viewport.dataset.artworkDragging; } });
    }
    function navigate(direction: -1 | 1) {
        if (disposed) return;
        options.onInteraction();
        if (settling) { queued = Math.max(-5, Math.min(5, queued + direction)); return; }
        view.clearTimeout(wheelTimer); wheelDistance = 0;
        if (reduced.matches) { gsap.set(frame, { x: 0 }); options.navigate(direction); reset(); return; }
        settling = true; viewport.dataset.artworkDragging = "";
        const start = Number(gsap.getProperty(frame, "x")) || 0, distance = width();
        outgoing = snapshot(start);
        options.navigate(direction);
        gsap.set(frame, { x: start + direction * distance });
        gsap.to(outgoing, { x: -direction * distance, duration: .48, ease: "power3.out", overwrite: true });
        gsap.to(frame, { x: 0, duration: .48, ease: "power3.out", overwrite: true, onComplete() {
            outgoing?.remove(); outgoing = null;
            settling = false; delete viewport.dataset.artworkDragging;
            if (queued) { const next = queued > 0 ? 1 : -1; queued -= next; navigate(next); }
        } });
    }
    function down(event: PointerEvent) {
        if (event.pointerType !== "mouse" || event.button !== 0 || settling || ignored(event.target)) return;
        pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, axis: "pending" };
        options.onInteraction();
    }
    function move(event: PointerEvent) {
        if (!pointer || event.pointerId !== pointer.id) return;
        const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
        if (pointer.axis === "pending") {
            if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
            pointer.axis = Math.abs(dx) > Math.abs(dy) * 1.05 ? "horizontal" : "vertical";
            if (pointer.axis === "horizontal") {
                try { viewport.setPointerCapture(event.pointerId); } catch { /* Outside document. */ }
                viewport.ownerDocument.getSelection()?.removeAllRanges();
            }
        }
        if (pointer.axis !== "horizontal") return;
        event.preventDefault(); pointer.dx = dx; preview(dx);
    }
    function end(event: PointerEvent) {
        if (!pointer || event.pointerId !== pointer.id) return;
        const gesture = pointer; pointer = null;
        try { viewport.releasePointerCapture(event.pointerId); } catch { /* Already released. */ }
        if (gesture.axis !== "horizontal") return;
        suppressClick = true;
        if (event.type !== "pointercancel" && Math.abs(gesture.dx) >= 55) navigate(gesture.dx < 0 ? 1 : -1);
        else reset();
    }
    function wheel(event: WheelEvent) {
        if (event.ctrlKey || ignored(event.target)) return;
        const horizontal = event.shiftKey ? event.deltaY || event.deltaX : event.deltaX;
        if (!event.shiftKey && Math.abs(horizontal) <= Math.abs(event.deltaY) * 1.05) return;
        event.preventDefault(); options.onInteraction();
        view.clearTimeout(wheelTimer);
        if (!settling && !wheelLocked) {
            wheelDistance += horizontal * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? width() : 1);
            preview(-wheelDistance);
        }
        wheelTimer = view.setTimeout(() => {
            if (!wheelLocked && Math.abs(wheelDistance) >= 45) { wheelLocked = true; navigate(wheelDistance > 0 ? 1 : -1); }
            else reset();
            wheelDistance = 0;
            wheelTimer = view.setTimeout(() => { wheelLocked = false; }, 160);
        }, 100);
    }
    function click(event: MouseEvent) {
        if (!suppressClick) return;
        suppressClick = false; event.preventDefault(); event.stopImmediatePropagation();
    }
    let geometry = frame.clientWidth;
    const resize = new ResizeObserver(() => {
        if (Math.abs(frame.clientWidth - geometry) < 1) return;
        geometry = frame.clientWidth; pointer = null; settling = false; queued = 0;
        gsap.killTweensOf(frame); if (outgoing) gsap.killTweensOf(outgoing); outgoing?.remove(); outgoing = null;
        gsap.set(frame, { x: 0 }); delete viewport.dataset.artworkDragging;
    });
    resize.observe(frame);
    viewport.addEventListener("pointerdown", down);
    view.addEventListener("pointermove", move, { passive: false });
    view.addEventListener("pointerup", end); view.addEventListener("pointercancel", end);
    viewport.addEventListener("wheel", wheel, { passive: false }); viewport.addEventListener("click", click, true);
    return { navigate, preview, reset, dispose() {
        disposed = true; resize.disconnect(); view.clearTimeout(wheelTimer); gsap.killTweensOf(frame); if (outgoing) gsap.killTweensOf(outgoing); outgoing?.remove(); gsap.set(frame, { clearProps: "transform" });
        delete viewport.dataset.artworkDragging;
        viewport.removeEventListener("pointerdown", down); view.removeEventListener("pointermove", move);
        view.removeEventListener("pointerup", end); view.removeEventListener("pointercancel", end);
        viewport.removeEventListener("wheel", wheel); viewport.removeEventListener("click", click, true);
    } };
}
