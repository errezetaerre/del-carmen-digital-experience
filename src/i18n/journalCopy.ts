import type { JournalEntry } from "@/domains/journal/types";
import type { SiteLocale } from "./config";
import translations from "./content/journal.es.json";

type JournalEntryTranslation = Pick<JournalEntry, "title" | "category" | "excerpt">;
const spanishJournalCopy: Readonly<Record<string, JournalEntryTranslation>> = translations;

export function journalEntryTextLocale(entry: JournalEntry, locale: SiteLocale): SiteLocale {
    return locale === "es" && Object.prototype.hasOwnProperty.call(spanishJournalCopy, entry.slug) ? "es" : "en";
}

// Home teasers only in this increment; full stories stay English until their block.
export function localizeJournalEntry(entry: JournalEntry, locale: SiteLocale): JournalEntry {
    return journalEntryTextLocale(entry, locale) === "es" ? { ...entry, ...spanishJournalCopy[entry.slug] } : entry;
}
