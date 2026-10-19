import { activateLocale } from "@/i18n/server";
import { getSiteMessages } from "@/i18n/messages";
import { createPageMetadata } from "@/shared/lib/metadata";
import About from "@/domains/about";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const locale = await activateLocale(params);
    const copy = getSiteMessages(locale).About;
    return createPageMetadata({ locale, title: copy.metadataTitle, description: copy.metadataDescription });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
    await activateLocale(params);
    return <About />;
}
