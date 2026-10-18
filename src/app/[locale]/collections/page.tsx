import EnglishContent from "@/i18n/EnglishContent";
import { activateLocale } from "@/i18n/server";
import { createPageMetadata } from "@/shared/lib/metadata";

export const metadata = createPageMetadata({title: "Collections", description: "Explore the artwork series of Del Carmen: connected paintings, shared themes and the stories behind each collection.", });

import {
    CollectionHero,
    CollectionsIntro,
    getCollections,
} from "@/domains/collections";

import Footer from "@/shared/layout/footer";

export default async function CollectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  await activateLocale(params);
    const collections =
        getCollections();

    return <EnglishContent>{(
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
    )}</EnglishContent>;
}
