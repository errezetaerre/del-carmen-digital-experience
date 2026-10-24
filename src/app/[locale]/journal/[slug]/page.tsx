import { activateLocale } from "@/i18n/server";
import { localizeJournalEntry } from "@/i18n/journalCopy";
import { localizeJournalStory } from "@/i18n/journalStoryCopy";
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
        locale: string;
        slug: string;
    }>;
}

export async function generateMetadata({ params }: JournalEntryPageProps) {
    const locale = await activateLocale(params);
    const { slug } = await params;
    const entry = getJournalEntryBySlug(slug);
    const story = getJournalStoryBySlug(slug);
    if (!entry || !story) notFound();
    const localizedEntry = localizeJournalEntry(entry, locale);
    return createPageMetadata({ locale, pathname: `/journal/${entry.slug}`, title: localizedEntry.title,
        description: localizedEntry.excerpt, image: { src: entry.image, alt: localizedEntry.title }, type: "article" });
}

export default async function JournalEntryPage({
    params,
}: JournalEntryPageProps) {
    const locale = await activateLocale(params);
    const { slug } = await params;

    const entry = getJournalEntryBySlug(slug);
    const story = getJournalStoryBySlug(slug);
    const entries = getJournalEntries().map((item) => localizeJournalEntry(item, locale));

    if (!entry || !story) {
        notFound();
    }

    return (
        <main className="relative w-full min-w-0 overflow-x-clip bg-background text-white">
            <JournalEntryExperience
                entry={localizeJournalEntry(entry, locale)}
                story={localizeJournalStory(story, locale)}
                entries={entries}
            />

            <Footer />
        </main>
    );
}
