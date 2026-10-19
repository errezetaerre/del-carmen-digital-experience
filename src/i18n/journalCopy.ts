import type { JournalEntry } from "@/domains/journal/types";
import type { SiteLocale } from "./config";
import translations from "./content/journal.es.json";

type JournalEntryTranslation = Pick<JournalEntry, "title" | "category" | "excerpt">;
const spanishJournalCopy: Readonly<Record<string, JournalEntryTranslation>> = translations;

export function journalEntryTextLocale(entry: JournalEntry, locale: SiteLocale): SiteLocale {
    return locale === "es" && Object.prototype.hasOwnProperty.call(spanishJournalCopy, entry.slug) ? "es" : "en";
}

// Shared editorial titles, categories and excerpts; narrative scenes live in journalStoryCopy.
export function localizeJournalEntry(entry: JournalEntry, locale: SiteLocale): JournalEntry {
    return journalEntryTextLocale(entry, locale) === "es" ? { ...entry, ...spanishJournalCopy[entry.slug] } : entry;
}
