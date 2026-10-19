import { activateLocale } from "@/i18n/server";
import { getSiteMessages } from "@/i18n/messages";
import { localizeArtworkSeries } from "@/i18n/seriesCopy";
import { createPageMetadata } from "@/shared/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const locale = await activateLocale(params);
    const copy = getSiteMessages(locale).Collections;
    return createPageMetadata({ locale, title: copy.metadataTitle, description: copy.metadataDescription });
}

import {
    CollectionHero,
    CollectionsIntro,
    getCollections,
} from "@/domains/collections";

import Footer from "@/shared/layout/footer";

export default async function CollectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await activateLocale(params);
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
                        series={localizeArtworkSeries(series, locale)}
                        artworks={artworks}
                    />
                ),
            )}

            <Footer />
        </main>
    );
}
