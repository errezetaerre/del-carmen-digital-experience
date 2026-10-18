import { createPageMetadata } from "@/shared/lib/metadata";

export const metadata = createPageMetadata({title: "Rolando Del Carmen", description: "Meet Rolando Del Carmen, a Costa Rican artist exploring memory, light and the human experience through painting.", });

import Artist from "@/domains/artist";

export default function ArtistPage() {
    return <Artist />;
}