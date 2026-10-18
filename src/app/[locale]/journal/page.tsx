import EnglishContent from "@/i18n/EnglishContent";
import { activateLocale } from "@/i18n/server";
import { createPageMetadata } from "@/shared/lib/metadata";

export const metadata = createPageMetadata({title: "Journal", description: "Reflections, studio notes and conversations about painting, memory and the creative practice of Del Carmen.", });

import Journal from "@/domains/journal";

export default async function JournalPage({ params }: { params: Promise<{ locale: string }> }) {
  await activateLocale(params);
    return <EnglishContent>{<Journal />}</EnglishContent>;
}
