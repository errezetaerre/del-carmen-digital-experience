// Match the existing portrait reading layouts, including viewport emulation
// and larger touch tablets. Landscape never satisfies this query.
export const PORTRAIT_ARTBOOK_QUERY = "(orientation: portrait) and (max-width: 1366px), (orientation: portrait) and (any-pointer: coarse)";

export function subscribePortraitViewport(onChange: () => void) {
    const media = window.matchMedia(PORTRAIT_ARTBOOK_QUERY);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
}

export function portraitViewportSnapshot(): "portrait" | "other" {
    return window.matchMedia(PORTRAIT_ARTBOOK_QUERY).matches ? "portrait" : "other";
}

export function serverPortraitSnapshot(): "checking" { return "checking"; }
