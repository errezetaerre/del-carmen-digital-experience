import { createPageMetadata } from "@/shared/lib/metadata";

export const metadata = createPageMetadata({title: "Journal", description: "Reflections, studio notes and conversations about painting, memory and the creative practice of Del Carmen.", });

import Journal from "@/domains/journal";

export default function JournalPage() {
    return <Journal />;
}