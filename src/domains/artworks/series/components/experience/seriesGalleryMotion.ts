import gsap from "gsap";

/** Native touch scrolling and the same bounded drag/settle used in the approved preview. */
export function bindSeriesGalleryRail(rail: HTMLDivElement, grouped: boolean, onPosition: (index: number, total: number) => void) {
    const view = rail.ownerDocument.defaultView!;
    const reduced = view.matchMedia("(prefers-reduced-motion: reduce)");
    const groupCount = rail.querySelectorAll("[data-series-group]").length;
    let grip: { id: number; x: number; y: number; start: number; last: number; time: number; velocity: number; moved: boolean } | null = null;
    let guard = 0, wheelTimer = 0, wheelStart: number | null = null, width = rail.clientWidth;
    const maximum = () => Math.max(0, rail.scrollWidth - rail.clientWidth);
    const current = () => grouped ? Math.min(groupCount - 1, Math.max(0, Math.round(rail.scrollLeft / Math.max(1, rail.clientWidth)))) : rail.scrollLeft < 2 ? 0 : rail.scrollLeft >= maximum() - 2 ? 2 : 1;
    const update = () => onPosition(current(), grouped ? groupCount : maximum() > 1 ? 3 : 1);
    function animateTo(index: number) {
        gsap.killTweensOf(rail); rail.style.scrollSnapType = "none";
        const target = grouped ? Math.max(0, Math.min(groupCount - 1, index)) * rail.clientWidth : Math.max(0, Math.min(maximum(), index));
        gsap.to(rail, { scrollLeft: target, duration: reduced.matches ? 0 : .65, ease: "power3.out", onUpdate: update,
            onComplete() { rail.style.scrollSnapType = grouped ? "x mandatory" : "none"; update(); } });
    }
    function destination(start: number, velocity = 0) {
        const delta = rail.scrollLeft - start;
        let index = Math.round((rail.scrollLeft - Math.max(-700, Math.min(700, velocity * .24))) / Math.max(1, rail.clientWidth));
        const origin = Math.round(start / Math.max(1, rail.clientWidth));
        if (index === origin && Math.abs(delta) > rail.clientWidth * .12) index = origin + Math.sign(delta);
        return index;
    }
    function down(event: PointerEvent) {
        if (event.pointerType !== "mouse" || event.button !== 0) return;
        gsap.killTweensOf(rail); view.clearTimeout(wheelTimer); wheelStart = null; guard = 0;
        rail.style.scrollSnapType = "none";
        grip = { id: event.pointerId, x: event.clientX, y: event.clientY, start: rail.scrollLeft, last: event.clientX, time: view.performance.now(), velocity: 0, moved: false };
    }
    function move(event: PointerEvent) {
        if (!grip || event.pointerId !== grip.id) return;
        const dx = event.clientX - grip.x, dy = event.clientY - grip.y;
        if (!grip.moved && Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx) * 1.1) { grip = null; return; }
        if (Math.abs(dx) > 8) grip.moved = true;
        if (!grip.moved) return;
        event.preventDefault();
        try { rail.setPointerCapture(event.pointerId); } catch { /* Detached during navigation. */ }
        rail.ownerDocument.getSelection()?.removeAllRanges();
        const now = view.performance.now();
        grip.velocity = grip.velocity * .72 + (event.clientX - grip.last) / Math.max(1, now - grip.time) * 1000 * .28;
        grip.last = event.clientX; grip.time = now; rail.scrollLeft = grip.start - dx;
    }
    function up() {
        if (!grip) return;
        const ended = grip; grip = null;
        try { rail.releasePointerCapture(ended.id); } catch { /* Already released. */ }
        if (ended.moved) {
            guard = view.performance.now() + 350;
            const velocity = view.performance.now() - ended.time > 120 ? 0 : ended.velocity;
            animateTo(grouped ? destination(ended.start, velocity) : rail.scrollLeft - Math.max(-700, Math.min(700, velocity * .24)));
        } else rail.style.scrollSnapType = grouped ? "x mandatory" : "none";
    }
    function wheel(event: WheelEvent) {
        if (event.ctrlKey || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
        event.preventDefault(); gsap.killTweensOf(rail); rail.style.scrollSnapType = "none";
        if (wheelStart === null) wheelStart = rail.scrollLeft;
        rail.scrollLeft += event.deltaX * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rail.clientWidth : 1);
        view.clearTimeout(wheelTimer); wheelTimer = view.setTimeout(() => {
            const start = wheelStart ?? rail.scrollLeft; wheelStart = null;
            if (grouped) animateTo(destination(start)); else update();
        }, 140);
    }
    function click(event: MouseEvent) { if (view.performance.now() < guard) { event.preventDefault(); event.stopImmediatePropagation(); } }
    const navigate = (direction: -1 | 1) => animateTo(grouped ? current() + direction : rail.scrollLeft + direction * rail.clientWidth * .72);
    function key(event: KeyboardEvent) {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault(); event.stopPropagation(); navigate(event.key === "ArrowRight" ? 1 : -1);
    }
    const observer = new ResizeObserver(() => {
        const next = rail.clientWidth;
        if (grouped && Math.abs(next - width) > .5) {
            const index = Math.round(rail.scrollLeft / Math.max(1, width)); gsap.killTweensOf(rail);
            width = next; rail.style.setProperty("--series-group-width", `${width}px`); rail.scrollLeft = index * width;
        }
        update();
    });
    observer.observe(rail);
    rail.addEventListener("scroll", update, { passive: true }); rail.addEventListener("wheel", wheel, { passive: false });
    rail.addEventListener("pointerdown", down); view.addEventListener("pointermove", move, { passive: false });
    view.addEventListener("pointerup", up); view.addEventListener("pointercancel", up);
    rail.addEventListener("click", click, true); rail.addEventListener("keydown", key); update();
    return { navigate, dispose() {
        view.clearTimeout(wheelTimer); observer.disconnect(); gsap.killTweensOf(rail);
        rail.removeEventListener("scroll", update); rail.removeEventListener("wheel", wheel); rail.removeEventListener("pointerdown", down);
        view.removeEventListener("pointermove", move); view.removeEventListener("pointerup", up); view.removeEventListener("pointercancel", up);
        rail.removeEventListener("click", click, true); rail.removeEventListener("keydown", key);
    } };
}
