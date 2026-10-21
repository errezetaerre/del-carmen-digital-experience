/** Delegated controls survive the native book replacing its information faces. */
export function bindArtworkReadingPanels(root: HTMLElement) {
    const positions = new WeakMap<HTMLElement, number>();
    function click(event: MouseEvent) {
        const button = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-artwork-reading-toggle]");
        const information = button?.closest<HTMLElement>("[data-gallery-information]");
        if (!button || !information || !root.contains(information)) return;
        const expanded = !information.hasAttribute("data-reader-expanded");
        const normal = information.querySelector<HTMLElement>("[data-reader-normal]");
        const panel = information.querySelector<HTMLElement>("[data-artwork-reading-panel]");
        const pane = information.closest<HTMLElement>(".info");
        event.preventDefault(); event.stopPropagation();
        if (!normal || !panel || !pane) return;
        if (expanded) { positions.set(information, pane.scrollTop); pane.scrollTop = 0; }
        information.toggleAttribute("data-reader-expanded", expanded);
        normal.inert = expanded; normal.setAttribute("aria-hidden", String(expanded));
        panel.hidden = !expanded;
        normal.querySelector<HTMLButtonElement>("[data-artwork-reading-toggle]")?.setAttribute("aria-expanded", String(expanded));
        if (expanded) panel.querySelector<HTMLElement>("[data-lightbox-native-scroll]")?.focus({ preventScroll: true });
        else {
            pane.scrollTop = positions.get(information) ?? 0;
            normal.querySelector<HTMLButtonElement>("[data-artwork-reading-toggle]")?.focus({ preventScroll: true });
        }
    }
    root.addEventListener("click", click);
    return () => root.removeEventListener("click", click);
}
