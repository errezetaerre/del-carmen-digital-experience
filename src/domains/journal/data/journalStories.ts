
import type { JournalStory } from "../types";

export const JOURNAL_STORIES: JournalStory[] = [
    {
        slug: "the-art-of-remembering",

        scenes: [
            {
                id: "memory",
                layout: "centered",
                media: {
                    type: "video",
                    src: "/videos/journal/light_revealing_wooden_palette.mp4",
                    poster: "/images/journal/placeholder-01.jpg",
                },
                eyebrow: "I — Memory",
                title: "What remains when a moment disappears?",
                text:
                    "Memory does not preserve life exactly as it happened. It transforms fragments, sensations and absences into something that continues to live within us.",
            },

            {
                id: "presence",
                layout: "split-left",
                media: {
                    type: "image",
                    src: "/images/journal/placeholder-02.jpg",
                },
                eyebrow: "II — Presence",
                title: "Some things remain without being seen.",
                text:
                    "A gesture, a place, a face or a certain quality of light can return unexpectedly. Painting becomes a way of giving those invisible presences another form.",
            },

            {
                id: "light",
                layout: "immersive",
                media: {
                    type: "image",
                    src: "/images/journal/placeholder-03.jpg",
                },
                eyebrow: "III — Light",
                title: "Perhaps remembering is another way of illuminating.",
                text:
                    "Not to reconstruct what has vanished, but to recognize the trace it has left behind.",
            },
        ],
    },
];

export function getJournalStoryBySlug(
    slug: string,
): JournalStory | undefined {
    return JOURNAL_STORIES.find(
        (story) => story.slug === slug,
    );
}