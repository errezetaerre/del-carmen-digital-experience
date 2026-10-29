/**
 * Only already-public editorial routes belong in aggregate page statistics.
 * Query strings and fragments may carry newsletter or deployment share tokens.
 */
const indexPaths = new Set(["/", "/about", "/artist", "/artworks", "/collections", "/contact", "/journal", "/privacy", "/terms"]);
const editorialDetail = /^\/(?:artworks|series|journal)\/[a-z0-9]+(?:[-_][a-z0-9]+)*$/;

/** @param {string} value @returns {string | null} */
export function publicAnalyticsUrl(value) {
    try {
        const url = new URL(value);
        if (!/^https?:$/.test(url.protocol) || url.username || url.password) return null;
        const path = url.pathname.replace(/\/$/, "") || "/";
        const unprefixed = path.replace(/^\/(?:en|es)(?=\/|$)/, "") || "/";
        if (!indexPaths.has(unprefixed) && !editorialDetail.test(unprefixed)) return null;
        url.search = "";
        url.hash = "";
        return url.href;
    } catch {
        return null;
    }
}

/**
 * Query-only filters, chapter turns and mode changes remain one page view.
 * A real route change or a document reload can still count as another visit.
 * @returns {(event: import("@vercel/analytics/next").BeforeSendEvent) => import("@vercel/analytics/next").BeforeSendEvent | null}
 */
export function createAnalyticsFilter() {
    let previousPage = "";
    return function beforeSend(event) {
        if (event.type !== "pageview") return null;
        const url = publicAnalyticsUrl(event.url);
        if (!url || url === previousPage) return null;
        previousPage = url;
        return { ...event, url };
    };
}
