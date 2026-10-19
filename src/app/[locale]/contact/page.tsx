import { getSiteMessages } from "@/i18n/messages";
import { activateLocale } from "@/i18n/server";
import { createPageMetadata } from "@/shared/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const locale = await activateLocale(params);
    const copy = getSiteMessages(locale).Contact;
    return createPageMetadata({ locale, title: copy.metadataTitle, description: copy.metadataDescription });
}

import Contact from "@/domains/contact";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  await activateLocale(params);
    return <Contact />;
}
