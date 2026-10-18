import { createPageMetadata } from "@/shared/lib/metadata";

export const metadata = createPageMetadata({title: "Collections", description: "Explore the artwork series of Del Carmen: connected paintings, shared themes and the stories behind each collection.", });

import {
    CollectionHero,
    CollectionsIntro,
    getCollections,
} from "@/domains/collections";

import Footer from "@/shared/layout/footer";

export default function CollectionsPage() {
    const collections =
        getCollections();

    return (
        <main
            className="
                relative
                w-full
                min-w-0
                overflow-x-clip
                bg-background
                text-white
            "
        >
            <CollectionsIntro />

            {collections.map(
                ({
                    series,
                    artworks,
                }) => (
                    <CollectionHero
                        key={series.id}
                        series={series}
                        artworks={artworks}
                    />
                ),
            )}

            <Footer />
        </main>
    );
}