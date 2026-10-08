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

    {
        slug: "inside-the-studio",

        scenes: [
            {
                id: "the-studio",
                layout: "immersive",
                media: {
                    type: "image",
                    src: "/images/journal/inside-the-studio-01.png",
                },
                eyebrow: "I — The Studio",
                title: "Before a painting begins, there is a place waiting for it.",
                text:
                    "The studio is quiet before the first gesture. Light enters, objects remain where they were left, and an empty canvas holds no answers yet. For a moment, everything exists only as possibility.",
            },

            {
                id: "the-ritual",
                layout: "split-right",
                media: {
                    type: "image",
                    src: "/images/journal/inside-the-studio-02.png",
                },
                eyebrow: "II — The Ritual",
                title: "Creation often begins with ordinary gestures.",
                text:
                    "Preparing the palette. Choosing a brush. Mixing color. Adjusting the light. These small repetitions are not separate from painting; they are part of the ritual that allows attention to settle and the work to begin.",
            },

            {
                id: "the-conversation",
                layout: "split-left",
                media: {
                    type: "image",
                    src: "/images/journal/inside-the-studio-03.png",
                },
                eyebrow: "III — The Conversation",
                title: "At some point, the painting begins to answer back.",
                text:
                    "I step closer, then farther away. I change something, wait, observe and return. Painting becomes less an act of imposing an image and more a conversation with something slowly revealing its own presence.",
            },

            {
                id: "what-remains",
                layout: "centered",
                media: {
                    type: "video",
                    src: "/videos/journal/DelCarmen_Digital_Experience_the_studio.mp4",
                    poster: "/images/journal/inside-the-studio-01.png",
                },
                eyebrow: "IV — What Remains",
                title: "The work stops. The studio remembers.",
                text:
                    "Paint remains on the palette. Brushes carry traces of color. The canvas is no longer what it was that morning, and neither is the person who stood before it. Tomorrow the conversation will begin again.",
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