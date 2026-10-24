import { activateLocale } from "@/i18n/server";
import { getSiteMessages } from "@/i18n/messages";
import { createPageMetadata } from "@/shared/lib/metadata";
import Journal from "@/domains/journal";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const locale = await activateLocale(params);
    const copy = getSiteMessages(locale).Journal;
    return createPageMetadata({ locale, pathname: "/journal", title: copy.metadataTitle, description: copy.metadataDescription });
}

export default async function JournalPage({ params }: { params: Promise<{ locale: string }> }) {
    await activateLocale(params);
    return <Journal />;
}
