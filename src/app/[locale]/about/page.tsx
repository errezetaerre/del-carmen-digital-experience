import EnglishContent from "@/i18n/EnglishContent";
import { activateLocale } from "@/i18n/server";
import { createPageMetadata } from "@/shared/lib/metadata";

export const metadata = createPageMetadata({title: "About", description: "Discover the artistic vision behind Del Carmen: painting, memory, contemplation and the human experience.", });

// src/app/about/page.tsx

import About from "@/domains/about";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  await activateLocale(params);
    return <EnglishContent>{<About />}</EnglishContent>;
}
