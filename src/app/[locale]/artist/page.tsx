import { activateLocale } from "@/i18n/server";
import { getSiteMessages } from "@/i18n/messages";
import { createPageMetadata } from "@/shared/lib/metadata";
import Artist from "@/domains/artist";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const locale = await activateLocale(params);
    const copy = getSiteMessages(locale).Artist;
    return createPageMetadata({ locale, title: copy.metadataTitle, description: copy.metadataDescription });
}

export default async function ArtistPage({ params }: { params: Promise<{ locale: string }> }) {
    await activateLocale(params);
    return <Artist />;
}
