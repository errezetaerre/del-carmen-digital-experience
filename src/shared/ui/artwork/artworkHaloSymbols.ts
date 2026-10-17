import type { ArtworkBadge } from "@/domains/artworks/presentation/getArtworkPresentation";

// Shared local vectors keep the same symbol family in React and the book.
const shapes = {
    cover: '<path d="M12 6v15M3 4c3-1 6-.5 9 2 3-2.5 6-3 9-2v15c-3-1-6-.5-9 2-3-2.5-6-3-9-2V4Z"/>',
    featured: '<path d="m12 3 2.78 5.63 6.22.91-4.5 4.38 1.06 6.2L12 17.19l-5.56 2.93 1.06-6.2L3 9.54l6.22-.91Z"/>',
    "honourable-mention": '<circle cx="12" cy="8" r="5"/><path d="m8.5 12-1 9 4.5-2.5 4.5 2.5-1-9"/>',
    award: '<path d="M8 3h8v5a4 4 0 0 1-8 0V3Zm4 9v6m-4 3h8m-7-3h6M8 5H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4"/>',
    selection: '<circle cx="12" cy="12" r="8"/><path d="m8.5 12 2.3 2.3 4.7-4.7"/>',
    planned: '<path d="M6 3h12M6 21h12M7 3v4c0 2 5 3 5 5s-5 3-5 5v4M17 3v4c0 2-5 3-5 5s5 3 5 5v4"/>',
    "in-progress": '<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
} satisfies Record<ArtworkBadge["kind"] | "cover", string>;

export function artworkHaloSymbol(kind: ArtworkBadge["kind"] | "cover"): string {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${shapes[kind]}</svg>`;
}
