export interface JournalEntry {
    slug: string;
    category: string;
    year: number;
    title: string;
    excerpt: string;

    /**
     * Canonical clean/original image.
     * Used by Home and journal entry experiences.
     */
    image: string;

    /**
     * Editorial image prepared specifically
     * for the Journal Index presentation.
     */
    journalImage?: string;

    featured?: boolean;
}

export type JournalSceneLayout =
    | "centered"
    | "split-left"
    | "split-right"
    | "immersive";

export type JournalSceneMedia =
    | {
        type: "image";
        src: string;
    }
    | {
        type: "video";
        src: string;
        poster?: string;
    };

export interface JournalScene {
    id: string;
    layout: JournalSceneLayout;
    media?: JournalSceneMedia;
    eyebrow?: string;
    title?: string;
    text?: string;
}

export interface JournalStory {
    slug: string;
    scenes: JournalScene[];
}