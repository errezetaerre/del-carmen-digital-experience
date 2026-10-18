import EnglishContent from "@/i18n/EnglishContent";
import { activateLocale } from "@/i18n/server";
import { createPageMetadata } from "@/shared/lib/metadata";

export const metadata = createPageMetadata({title: "Contact", description: "Contact Del Carmen about artworks, exhibitions, collaborations and other enquiries.", });

import Contact from "@/domains/contact";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  await activateLocale(params);
    return <EnglishContent>{<Contact />}</EnglishContent>;
}
