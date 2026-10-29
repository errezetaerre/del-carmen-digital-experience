import { HOME_BOOK_CHAPTERS, type HomeBookPageId } from "./homeBookChapters";

const chapterEvent = "del-carmen:home-book-chapter";
export function homeBookChapter(): HomeBookPageId {
    const value = new URL(window.location.href).searchParams.get("chapter");
    if (value && /^journal:[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) return value as HomeBookPageId;
    return HOME_BOOK_CHAPTERS.find(chapter => chapter === value) ?? "cover";
}
export function subscribeHomeBookChapter(listener: () => void) {
    window.addEventListener(chapterEvent, listener);
    window.addEventListener("popstate", listener);
    return () => { window.removeEventListener(chapterEvent, listener); window.removeEventListener("popstate", listener); };
}
export function selectHomeBookChapter(chapter: HomeBookPageId) {
    const url = new URL(window.location.href);
    url.searchParams.set("chapter", chapter);
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    window.dispatchEvent(new Event(chapterEvent));
}
export function clearHomeBookLocation() {
    const url = new URL(window.location.href);
    url.searchParams.delete("chapter");
    if (url.searchParams.get("experience") === "glass") url.searchParams.delete("experience");
    if (url.searchParams.get("view") === "glass") url.searchParams.delete("view");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    window.dispatchEvent(new Event(chapterEvent));
}

export const HOME_BOOK_SPREAD_QUERY = "(orientation: landscape)";
export const HOME_BOOK_PHONE_QUERY = "(orientation: portrait) and (max-width:767px)";
export function homeBookLayout() {
    return window.matchMedia(HOME_BOOK_SPREAD_QUERY).matches ? "spread" : window.matchMedia(HOME_BOOK_PHONE_QUERY).matches ? "phone" : "portrait";
}
export function subscribeHomeBookLayout(listener: () => void) {
    const queries = [HOME_BOOK_SPREAD_QUERY, HOME_BOOK_PHONE_QUERY].map(query => window.matchMedia(query));
    queries.forEach(query => query.addEventListener("change", listener));
    return () => queries.forEach(query => query.removeEventListener("change", listener));
}
