import EnglishContent from "@/i18n/EnglishContent";
import { activateLocale } from "@/i18n/server";
import { createPageMetadata } from "@/shared/lib/metadata";

export const metadata = createPageMetadata({title: "Rolando Del Carmen", description: "Meet Rolando Del Carmen, a Costa Rican artist exploring memory, light and the human experience through painting.", });

import Artist from "@/domains/artist";

export default async function ArtistPage({ params }: { params: Promise<{ locale: string }> }) {
  await activateLocale(params);
    return <EnglishContent>{<Artist />}</EnglishContent>;
}
