/** Form controls keep their native interaction; editorial links can turn the leaf. */
export function homeBookAllowsDrag(target: Element | null): boolean {
    if (target?.closest("input, textarea, select, summary, form, [contenteditable='true'], [data-home-no-drag]")) return false;
    return !target?.closest("button") || Boolean(target.closest("[data-home-book-card]"));
}

/** Stop native link/image dragging and the click generated after a horizontal page drag. */
export function bindHomeBookLinkDrag(frame: HTMLElement): () => void {
    const view = frame.ownerDocument.defaultView!;
    let grip: { id: number; x: number; y: number; horizontal: boolean } | null = null;
    let suppressUntil = 0;
    const down = (event: PointerEvent) => {
        suppressUntil = 0;
        grip = event.button === 0 && homeBookAllowsDrag(event.target as Element)
            ? { id: event.pointerId, x: event.clientX, y: event.clientY, horizontal: false } : null;
    };
    const move = (event: PointerEvent) => {
        if (!grip || grip.id !== event.pointerId) return;
        const dx = Math.abs(event.clientX - grip.x), dy = Math.abs(event.clientY - grip.y);
        if (dx > 8 && dx > dy * 1.05) grip.horizontal = true;
    };
    const end = (event: PointerEvent) => {
        if (grip?.id !== event.pointerId) return;
        if (grip.horizontal) suppressUntil = view.performance.now() + 500;
        grip = null;
    };
    const click = (event: MouseEvent) => {
        if (view.performance.now() >= suppressUntil) return;
        suppressUntil = 0;
        event.preventDefault(); event.stopImmediatePropagation();
    };
    const nativeDrag = (event: DragEvent) => { if (homeBookAllowsDrag(event.target as Element)) event.preventDefault(); };
    frame.addEventListener("pointerdown", down, true);
    view.addEventListener("pointermove", move, true);
    view.addEventListener("pointerup", end, true);
    view.addEventListener("pointercancel", end, true);
    frame.addEventListener("click", click, true);
    frame.addEventListener("dragstart", nativeDrag);
    return () => {
        frame.removeEventListener("pointerdown", down, true);
        view.removeEventListener("pointermove", move, true);
        view.removeEventListener("pointerup", end, true);
        view.removeEventListener("pointercancel", end, true);
        frame.removeEventListener("click", click, true);
        frame.removeEventListener("dragstart", nativeDrag);
    };
}
