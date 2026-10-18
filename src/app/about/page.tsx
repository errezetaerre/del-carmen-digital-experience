import { createPageMetadata } from "@/shared/lib/metadata";

export const metadata = createPageMetadata({title: "About", description: "Discover the artistic vision behind Del Carmen: painting, memory, contemplation and the human experience.", });

// src/app/about/page.tsx

import About from "@/domains/about";

export default function AboutPage() {
    return <About />;
}