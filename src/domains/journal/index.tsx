import { useLocale } from "next-intl";
import Footer from "@/shared/layout/footer";
import { localizeJournalEntry } from "@/i18n/journalCopy";

import JournalIndex from "./components/JournalIndex";
import { getJournalEntries } from "./data/journalEntries";

export default function Journal() {
    const locale = useLocale();
    const entries = getJournalEntries().map((entry) => localizeJournalEntry(entry, locale));

    return (
        <main
            className="
        relative
        w-full
        min-w-0
        overflow-x-clip
        bg-background
        text-white
      "
        >
            <JournalIndex entries={entries} />

            <Footer />
        </main>
    );
}

export { JOURNAL_ENTRIES } from "./data/journalEntries";
export { getJournalEntries } from "./data/journalEntries";

export type { JournalEntry } from "./types";
