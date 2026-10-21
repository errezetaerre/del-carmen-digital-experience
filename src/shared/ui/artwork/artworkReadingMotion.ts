import gsap from "gsap";

/** The same paragraph travels between its preview slot and the reading surface. */
export function bindArtworkReadingMotion(panel: HTMLElement, slot: HTMLElement, onClose: () => void, onActive: (active: boolean) => void) {
    const parent = panel.parentElement!, doc = panel.ownerDocument, view = doc.defaultView!;
    const scroll = panel.querySelector<HTMLElement>("[data-artwork-reading-scroll]")!;
    const backdrop = panel.querySelector<HTMLElement>("[data-artwork-reading-backdrop]")!;
    const copy = scroll.querySelector<HTMLElement>("[data-artwork-description]")!;
    const reduced = view.matchMedia("(prefers-reduced-motion: reduce)");
    const viewport = parent.closest<HTMLElement>("[data-lightbox-interior], [data-portrait-reading]");
    let phase: "preview" | "opening" | "open" | "closing" = "preview", wanted = false, disposed = false;
    let timeline: gsap.core.Timeline | null = null, originalOverflow: string | null = null;
    let covered: Array<{ node: HTMLElement; inert: boolean; hidden: string | null }> = [];
    let pointer: { id: number; x: number; y: number } | null = null, travelled = false;
    function preview() {
        const origin = parent.getBoundingClientRect(), box = slot.getBoundingClientRect();
        return { left: box.left - origin.left, top: box.top - origin.top, width: box.width, height: box.height };
    }
    function reading() {
        const origin = parent.getBoundingClientRect(), visible = viewport?.getBoundingClientRect() ?? origin;
        const image = parent.querySelector<HTMLImageElement>("[data-artwork-reading-boundary] img");
        const boundary = parent.querySelector<HTMLElement>("[data-artwork-reading-boundary]")?.getBoundingClientRect();
        let bottom = boundary?.bottom ?? visible.top;
        if (image?.naturalWidth && image.naturalHeight && view.getComputedStyle(image).objectFit === "contain") {
            const box = image.getBoundingClientRect();
            const scale = Math.min(box.width / image.naturalWidth, box.height / image.naturalHeight);
            bottom = box.top + (box.height + image.naturalHeight * scale) / 2;
        }
        const top = Math.max(visible.top, Math.min(bottom, visible.bottom - 44)) - origin.top;
        return { left: 0, top, width: parent.clientWidth, height: Math.max(44, visible.bottom - origin.top - top) };
    }
    function place(box: ReturnType<typeof preview>) { gsap.set(panel, { ...box, right: "auto", bottom: "auto" }); }
    function setActive(active: boolean) {
        parent.toggleAttribute("data-artwork-reading-open", active);
        scroll.toggleAttribute("data-lightbox-native-scroll", active);
        scroll.tabIndex = active ? 0 : -1;
        if (active && !covered.length) {
            covered = Array.from(parent.querySelectorAll<HTMLElement>("[data-artwork-highlights]")).map(node => ({ node, inert: node.inert, hidden: node.getAttribute("aria-hidden") }));
            covered.forEach(({ node }) => { node.inert = true; node.setAttribute("aria-hidden", "true"); });
        } else if (!active) {
            covered.forEach(({ node, inert, hidden }) => { node.inert = inert; if (hidden === null) node.removeAttribute("aria-hidden"); else node.setAttribute("aria-hidden", hidden); });
            covered = [];
        }
        onActive(active);
    }
    function freeze() {
        if (viewport && originalOverflow === null) {
            originalOverflow = viewport.style.overflowY;
            // Preserve the exact scroll position and the painting's screen position.
            viewport.style.overflowY = "hidden";
        }
    }
    function thaw() {
        if (viewport && originalOverflow !== null) viewport.style.overflowY = originalOverflow;
        originalOverflow = null;
    }
    function rest() {
        phase = "preview"; panel.dataset.readingState = phase;
        place(preview());
        gsap.set(scroll, { x: 0, y: 0, width: "100%", height: "100%", padding: 0, scrollTop: 0, overflowY: "hidden" });
        gsap.set(copy, { lineHeight: "24px", color: "rgba(255,255,255,.45)" });
        gsap.set(backdrop, { scaleY: 0, opacity: 0 });
        setActive(false); thaw();
    }
    function open() {
        if (disposed || phase === "open" || phase === "opening") return;
        timeline?.kill();
        const from = preview(), to = reading();
        freeze(); setActive(true); phase = "opening"; panel.dataset.readingState = phase; place(to);
        const origin = Math.max(0, Math.min(to.height, from.top + from.height / 2 - to.top));
        gsap.set(backdrop, { transformOrigin: `50% ${origin}px`, scaleY: 0, opacity: 1 });
        gsap.set(scroll, { x: from.left - to.left, y: from.top - to.top, width: from.width, height: from.height, padding: 0, overflowY: "hidden" });
        const duration = reduced.matches ? 0 : .46;
        timeline = gsap.timeline({ onComplete() {
            if (disposed) return;
            phase = "open"; panel.dataset.readingState = phase; scroll.style.overflowY = "auto";
            scroll.focus({ preventScroll: true });
        } });
        timeline.to(backdrop, { scaleY: 1, duration, ease: "power3.inOut" }, 0)
            .to(scroll, { x: 0, y: 0, width: to.width, height: to.height, padding: 20, duration, ease: "power3.inOut" }, 0)
            .to(copy, { lineHeight: "28px", color: "rgba(255,255,255,.75)", duration, ease: "power2.inOut" }, 0);
    }
    function close() {
        if (disposed || phase === "preview" || phase === "closing") return;
        timeline?.kill();
        phase = "closing"; panel.dataset.readingState = phase;
        const to = preview(), origin = panel.getBoundingClientRect(), parentBox = parent.getBoundingClientRect();
        scroll.style.overflowY = "hidden";
        const duration = reduced.matches ? 0 : .42;
        timeline = gsap.timeline({ onComplete() { if (!disposed) rest(); } });
        timeline.to(backdrop, { scaleY: 0, duration, ease: "power3.inOut" }, 0)
            .to(scroll, { x: to.left - (origin.left - parentBox.left), y: to.top - (origin.top - parentBox.top),
                width: to.width, height: to.height, padding: 0, scrollTop: 0, duration, ease: "power3.inOut" }, 0)
            .to(copy, { lineHeight: "24px", color: "rgba(255,255,255,.45)", duration, ease: "power2.inOut" }, 0);
    }
    function geometry() {
        if (phase === "preview") place(preview());
        else if (phase === "open") { const to = reading(); place(to); gsap.set(scroll, { width: to.width, height: to.height }); }
    }
    function resize() {
        if (phase === "opening" || phase === "closing") {
            timeline?.kill();
            if (wanted) { phase = "open"; panel.dataset.readingState = phase; gsap.set(backdrop, { scaleY: 1 }); gsap.set(scroll, { x: 0, y: 0, padding: 20, overflowY: "auto" }); }
            else rest();
        }
        geometry();
    }
    function down(event: PointerEvent) { if (phase !== "preview") { travelled = false; pointer = { id: event.pointerId, x: event.clientX, y: event.clientY }; } }
    function move(event: PointerEvent) { if (pointer?.id === event.pointerId && Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) > 8) travelled = true; }
    function click(event: MouseEvent) {
        if (phase === "preview" || !wanted || travelled || event.defaultPrevented) return;
        const target = event.target as Element | null;
        if (target?.closest('[role="dialog"]') !== parent.closest('[role="dialog"]')) return;
        if (target?.closest("button,a,input,textarea,select,[contenteditable]")) return;
        const selection = doc.getSelection();
        if (selection?.toString() && panel.contains(selection.anchorNode)) return;
        event.preventDefault(); event.stopPropagation(); onClose();
    }
    const observer = new ResizeObserver(geometry);
    observer.observe(parent); observer.observe(slot);
    viewport?.addEventListener("scroll", geometry, { passive: true });
    view.addEventListener("resize", resize);
    doc.addEventListener("pointerdown", down, true); doc.addEventListener("pointermove", move, true);
    doc.addEventListener("click", click, true);
    rest();
    return {
        setExpanded(expanded: boolean) { wanted = expanded; if (expanded) open(); else close(); },
        dispose() {
            disposed = true; timeline?.kill(); observer.disconnect(); thaw();
            delete parent.dataset.artworkReadingOpen;
            covered.forEach(({ node, inert, hidden }) => { node.inert = inert; if (hidden === null) node.removeAttribute("aria-hidden"); else node.setAttribute("aria-hidden", hidden); });
            viewport?.removeEventListener("scroll", geometry); view.removeEventListener("resize", resize);
            doc.removeEventListener("pointerdown", down, true); doc.removeEventListener("pointermove", move, true); doc.removeEventListener("click", click, true);
        },
    };
}
