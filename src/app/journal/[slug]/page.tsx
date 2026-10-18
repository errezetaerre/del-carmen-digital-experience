import { createPageMetadata } from "@/shared/lib/metadata";
import { notFound } from "next/navigation";

import JournalEntryExperience from "@/domains/journal/components/entry/JournalEntryExperience";
import {
    getJournalEntries,
    getJournalEntryBySlug,
} from "@/domains/journal/data/journalEntries";
import { getJournalStoryBySlug } from "@/domains/journal/data/journalStories";
import Footer from "@/shared/layout/footer";

interface JournalEntryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: JournalEntryPageProps) {
    const { slug } = await params;
    const entry = getJournalEntryBySlug(slug);
    const story = getJournalStoryBySlug(slug);
    if (!entry || !story) notFound();
    return createPageMetadata({ title: entry.title, description: entry.excerpt, type: "article" });
}

export default async function JournalEntryPage({
    params,
}: JournalEntryPageProps) {
    const { slug } = await params;

    const entry = getJournalEntryBySlug(slug);
    const story = getJournalStoryBySlug(slug);
    const entries = getJournalEntries();

    if (!entry || !story) {
        notFound();
    }

    // const {
    //     previous,
    //     next,
    // } = getAdjacentJournalEntries(slug);

    return (
        <main className="relative w-full min-w-0 overflow-x-clip bg-background text-white">
            <JournalEntryExperience
                entry={entry}
                story={story}
                entries={entries}
            />

            <Footer />
        </main>
    );
}