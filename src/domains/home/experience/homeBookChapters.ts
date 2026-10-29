export const HOME_BOOK_CHAPTERS = ["cover", "featured", "artist", "collections", "artworks", "journal", "invitation", "credits"] as const;
export type HomeBookChapter = typeof HOME_BOOK_CHAPTERS[number];
export type HomeBookPageId = HomeBookChapter | `journal:${string}`;

export function journalPageSlug(page: HomeBookPageId): string | null {
    return page.startsWith("journal:") ? page.slice("journal:".length) : null;
}

/** Portrait retains the editorial list; a spread gives each real story its own turn. */
export function homeBookPages(chapters: readonly HomeBookChapter[], journal: readonly { slug: string }[], spread: boolean): HomeBookPageId[] {
    return chapters.flatMap<HomeBookPageId>(chapter => chapter === "journal" && spread
        ? [chapter, ...journal.map(entry => `journal:${entry.slug}` as const)] : [chapter]);
}

export function resolveHomeBookPage(requested: HomeBookPageId, pages: readonly HomeBookPageId[]): HomeBookPageId {
    if (pages.includes(requested)) return requested;
    return journalPageSlug(requested) && pages.includes("journal") ? "journal" : pages[0] ?? "cover";
}
