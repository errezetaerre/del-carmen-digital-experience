export type ArtworkExperienceMode = "standard" | "glass";

export const ARTWORK_EXPERIENCE_KEY = "del-carmen:artwork-experience";
const changeEvent = "del-carmen:artwork-experience-change";
let memory: ArtworkExperienceMode | undefined;

function mode(value: string | null): ArtworkExperienceMode | undefined {
    return value === "glass" || value === "standard" ? value : undefined;
}

/** One preference, independent of locale, route, viewport and selected work. */
export function artworkExperiencePreference(): ArtworkExperienceMode {
    if (typeof window === "undefined") return "standard";
    if (memory) return memory;
    const url = new URL(window.location.href);
    const archiveBook = /\/artbook\/?$/.test(url.pathname);
    // An address-bar visit to the dedicated reader explicitly opens it. Traversing
    // browser history or reloading an old tab must respect the last Exit.
    if (archiveBook) {
        const navigation = window.performance?.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
        if (navigation?.type === "navigate" && new URL(navigation.name).pathname === url.pathname) return memory = "glass";
    }
    try { memory = mode(window.localStorage.getItem(ARTWORK_EXPERIENCE_KEY)); } catch { /* Memory also works without storage. */ }
    // A shared deep link may choose the first experience in a fresh browser.
    // Once chosen, old URL parameters cannot silently undo the preference.
    const query = url.searchParams;
    return memory ??= mode(query.get("experience")) ?? mode(query.get("view")) ?? (archiveBook ? "glass" : "standard");
}

export function setArtworkExperiencePreference(value: ArtworkExperienceMode) {
    const changed = memory !== value;
    memory = value;
    try {
        if (window.localStorage.getItem(ARTWORK_EXPERIENCE_KEY) !== value) window.localStorage.setItem(ARTWORK_EXPERIENCE_KEY, value);
    } catch { /* Keep the in-memory choice. */ }
    if (changed) window.dispatchEvent(new Event(changeEvent));
}

export function subscribeArtworkExperiencePreference(listener: () => void) {
    function storage(event: StorageEvent) {
        if (event.key !== null && event.key !== ARTWORK_EXPERIENCE_KEY) return;
        memory = mode(event.newValue) ?? "standard";
        listener();
    }
    window.addEventListener(changeEvent, listener);
    window.addEventListener("storage", storage);
    return () => {
        window.removeEventListener(changeEvent, listener);
        window.removeEventListener("storage", storage);
    };
}
