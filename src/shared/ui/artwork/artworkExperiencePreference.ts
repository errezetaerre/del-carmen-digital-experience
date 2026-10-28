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
    try { memory = mode(window.localStorage.getItem(ARTWORK_EXPERIENCE_KEY)); } catch { /* Memory also works without storage. */ }
    // A shared deep link may choose the first experience in a fresh browser.
    // Once chosen, old URL parameters cannot silently undo the preference.
    const query = new URL(window.location.href).searchParams;
    return memory ??= mode(query.get("experience")) ?? mode(query.get("view")) ?? "standard";
}

export function setArtworkExperiencePreference(value: ArtworkExperienceMode) {
    memory = value;
    try { window.localStorage.setItem(ARTWORK_EXPERIENCE_KEY, value); } catch { /* Keep the in-memory choice. */ }
    window.dispatchEvent(new Event(changeEvent));
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
