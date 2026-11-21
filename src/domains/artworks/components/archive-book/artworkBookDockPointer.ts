// Stationary slots supply the coordinates. Only the artwork inside a slot moves.
export function bindArtworkDockPointer(rail: HTMLElement) {
    const doc = rail.ownerDocument, view = doc.defaultView;
    if (!view) return () => {};
    const fine = view.matchMedia("(any-hover: hover) and (any-pointer: fine)");
    const reduced = view.matchMedia("(prefers-reduced-motion: reduce)");
    const slots = Array.from(rail.querySelectorAll("li"));
    const painted = new Map<HTMLElement, string>();
    let pointerX: number | null = null, pointerY: number | null = null;
    let nativeScroll = false;
    let frame = 0, lastTime = 0, remainder = 0;

    function clearWave() {
        for (const slot of painted.keys()) {
            slot.style.removeProperty("--wave");
            slot.style.removeProperty("--lift");
        }
        painted.clear();
    }

    function updateWave(y: number) {
        if (reduced.matches || !slots.length) { clearWave(); return; }
        const first = slots[0].getBoundingClientRect();
        const pitch = Math.max(1, first.height), center = first.top + pitch / 2;
        const focalY = Math.max(center, Math.min(center + (slots.length - 1) * pitch, y));
        const radius = 2.25;
        slots.forEach((slot, index) => {
            const distance = (center - focalY) / pitch + index;
            const angle = Math.min(1, Math.abs(distance) / radius) * Math.PI;
            const wave = ((1 + Math.cos(angle)) / 2).toFixed(3);
            // Integrate the magnification curve to make room for the enlarged neighbours.
            const lift = (Math.sign(distance) * 1.4 * pitch * radius * (angle + Math.sin(angle)) / (2 * Math.PI)).toFixed(2) + "px";
            const state = wave + "/" + lift;
            if (painted.get(slot) === state) return;
            slot.style.setProperty("--wave", wave);
            slot.style.setProperty("--lift", lift);
            painted.set(slot, state);
        });
    }

    function schedule() {
        if (!frame && pointerY !== null) frame = view!.requestAnimationFrame(tick);
    }
    function tick(time: number) {
        frame = 0;
        if (pointerY === null) return;
        const box = rail.getBoundingClientRect();
        const band = Math.max(1, Math.min(140, box.height * .22));
        const edge = pointerY < box.top + band ? (pointerY - box.top) / band - 1 :
            Math.max(0, 1 - (box.bottom - pointerY) / band);
        const speed = nativeScroll ? 0 : Math.sign(edge) * Math.min(1, Math.abs(edge)) ** 2 * (reduced.matches ? 160 : 620);
        const maxScroll = rail.scrollHeight - rail.clientHeight;
        if ((speed > 0 && rail.scrollTop < maxScroll) || (speed < 0 && rail.scrollTop > 0)) {
            const seconds = lastTime ? Math.min(50, time - lastTime) / 1000 : 0;
            const travel = speed * seconds + remainder, pixels = Math.trunc(travel);
            remainder = travel - pixels;
            if (pixels) rail.scrollTop = Math.max(0, Math.min(maxScroll, rail.scrollTop + pixels));
            lastTime = time;
            schedule();
        } else { lastTime = remainder = 0; }
        updateWave(pointerY);
    }
    function releaseWheel() {
        nativeScroll = false;
        delete rail.dataset.wheel;
    }
    function stop() {
        pointerX = pointerY = null;
        releaseWheel();
        view!.cancelAnimationFrame(frame); frame = lastTime = remainder = 0;
        clearWave();
    }
    function move(event: PointerEvent) {
        if (!fine.matches || event.pointerType === "touch" || event.buttons || doc.hidden) { stop(); return; }
        if (nativeScroll && (pointerX !== event.clientX || pointerY !== event.clientY)) releaseWheel();
        pointerX = event.clientX;
        pointerY = event.clientY;
        schedule();
    }
    function wheel(event: WheelEvent) {
        if (!fine.matches || event.ctrlKey || doc.hidden) return;
        // Keep the native scroll target under the pointer while enlarged
        // thumbnails move through the gaps beyond the narrow resting rail.
        if (!nativeScroll) rail.dataset.wheel = "";
        nativeScroll = true; lastTime = remainder = 0;
        pointerX = event.clientX;
        pointerY = event.clientY;
        schedule(); // The browser owns scrolling, including the trackpad's inertial tail.
    }
    function focus(event: FocusEvent) {
        const link = event.target as HTMLElement | null;
        const slot = link?.closest("li");
        if (!slot || !link?.matches(":focus-visible")) return;
        stop();
        const rect = slot.getBoundingClientRect();
        updateWave(rect.top + rect.height / 2);
    }

    const events = new AbortController(), options = { signal: events.signal };
    rail.addEventListener("pointerenter", move, options);
    rail.addEventListener("pointermove", move, options);
    for (const name of ["pointerleave", "pointercancel", "pointerdown", "focusout"]) rail.addEventListener(name, stop, options);
    rail.addEventListener("focusin", focus, options);
    rail.addEventListener("wheel", wheel, { ...options, passive: true });
    rail.addEventListener("scroll", schedule, { ...options, passive: true });
    doc.addEventListener("visibilitychange", stop, options);
    view.addEventListener("blur", stop, options);
    fine.addEventListener("change", stop, options);
    reduced.addEventListener("change", stop, options);
    return () => { events.abort(); stop(); };
}
