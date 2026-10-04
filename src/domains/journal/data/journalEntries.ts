import type { JournalEntry } from "../types";

export const JOURNAL_ENTRIES: JournalEntry[] = [
    {
        slug: "the-art-of-remembering",
        category: "Reflections",
        year: 2026,
        title: "The Art of Remembering",
        excerpt:
            "A reflection on memory, beauty and the invisible essence that remains within us.",
        image: "/images/journal/placeholder-01.jpg",
        featured: true,
    },
    {
        slug: "inside-the-studio",
        category: "Studio",
        year: 2026,
        title: "Inside the Studio",
        excerpt:
            "Notes from the quiet space where observation becomes painting.",
        image: "/images/journal/placeholder-02.jpg",
    },
    {
        slug: "painting-always-a-conversation",
        category: "Conversation",
        year: 2026,
        title: "Painting: Always a Conversation",
        excerpt:
            "On the relationship between contemplation, silence and the act of creating.",
        image: "/images/journal/placeholder-03.jpg",
    },
    {
        slug: "painting-what-cannot-be-seen",
        category: "Thoughts",
        year: 2026,
        title: "Painting What Cannot Be Seen",
        excerpt:
            "Every painting responds to an inner image, to a way of looking that seeks to preserve a certain atmosphere, a color relationship or a moment of light.",
        image: "/images/journal/placeholder-04.jpg",
    },
    {
        slug: "interview-of-painting",
        category: "Interview",
        year: 2026,
        title: "Enterview: Painting",
        excerpt:
            "i'm always surprised by how uncertain the dialogue becomes when you try to define something that lives in the realm of sensation, intuition and color",
        image: "/images/journal/placeholder-03.jpg",
    },
    {
        slug: "children-as-teachers",
        category: "Reflection",
        year: 2026,
        title: "Children as Teachers",
        excerpt:
            "How children’s ability to be present and curious can guide us in our own creative practice.",
        image: "/images/journal/placeholder-03.jpg",
    },

    {
        slug: "how-to-talk-about-art",
        category: "Conversation",
        year: 2026,
        title: "How to Talk About Art",
        excerpt:
            "On the relationship between contemplation, silence and the act of creating.",
        image: "/images/journal/placeholder-03.jpg",
    },
];

export function getJournalEntries() {
    return JOURNAL_ENTRIES;
}

export function getJournalEntryBySlug(
    slug: string,
): JournalEntry | undefined {
    return JOURNAL_ENTRIES.find(
        (entry) => entry.slug === slug,
    );
}

export function getAdjacentJournalEntries(
    slug: string,
) {
    const index = JOURNAL_ENTRIES.findIndex(
        (entry) => entry.slug === slug,
    );

    if (index === -1) {
        return {
            previous: undefined,
            next: undefined,
        };
    }

    return {
        previous:
            index > 0
                ? JOURNAL_ENTRIES[index - 1]
                : undefined,

        next:
            index < JOURNAL_ENTRIES.length - 1
                ? JOURNAL_ENTRIES[index + 1]
                : undefined,
    };
}