import "server-only";
import { isDeepStrictEqual } from "node:util";
import { locales } from "@/i18n/config";
import { localizeArtwork } from "@/i18n/artworkCopy";
import { localizeArtworkSeries } from "@/i18n/seriesCopy";
import { getArtworkPresentation } from "@/domains/artworks/presentation/getArtworkPresentation";
import { artworkArchiveSorts, readArtworkArchiveFilters, selectArtworkArchive } from "@/domains/artworks/presentation/artworkArchive";
import { createCatalogueRepository, type CatalogueRepository } from "./reader";
import { createHomeCatalogue } from "./homeCatalogue";
import { createArtworkSeriesCatalogue } from "./seriesCatalogue";
import { catalogueSitemapPaths } from "./sitemapSource";
import { requireCatalogue, type CatalogueSnapshot } from "./snapshot";

// Operator verification only. Its caller already holds the schema/parity-checked
// read repository. This adds no SQL, env reads, writes, timers or HTML rendering.
export function verifyCatalogueReadModel(repository: CatalogueRepository, expected: CatalogueSnapshot) {
    const baseline = createCatalogueRepository(expected);
    const works = repository.getArtworkViews(locales), series = repository.getSeriesViews(locales);
    const expectedWorks = baseline.getArtworkViews(locales), expectedSeries = baseline.getSeriesViews(locales);
    const sorted = <T extends { id: string }>(records: readonly T[]) => [...records].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    const check = (actual: unknown, reference: unknown) => requireCatalogue(isDeepStrictEqual(actual, reference), "catalogue_read_model_not_equivalent");
    check(sorted(works), sorted(expectedWorks)); check(sorted(series), sorted(expectedSeries));
    check(repository.getHomeCuration(), expected.homeCuration);
    check(sorted(repository.getRecognitions()), sorted(expected.recognitions));
    const grouped = createArtworkSeriesCatalogue(works, series), expectedGrouped = createArtworkSeriesCatalogue(expectedWorks, expectedSeries);
    check(grouped.getArtworkSeries(), expectedGrouped.getArtworkSeries());
    check(grouped.getCollections(), expectedGrouped.getCollections());
    check(createHomeCatalogue(works, series, repository.getHomeCuration()), createHomeCatalogue(expectedWorks, expectedSeries, expected.homeCuration));
    check(catalogueSitemapPaths(repository), catalogueSitemapPaths(baseline));
    for (const locale of locales) {
        for (const work of works) {
            const original = expectedWorks.find(item => item.id === work.id)!;
            check(localizeArtwork(work, locale), localizeArtwork(original, locale));
            check(getArtworkPresentation(work, locale), getArtworkPresentation(original, locale));
        }
        for (const item of series) check(localizeArtworkSeries(item, locale), localizeArtworkSeries(expectedSeries.find(record => record.id === item.id)!, locale));
        for (const sort of artworkArchiveSorts) {
            const filters = readArtworkArchiveFilters(works, new URLSearchParams({ sort }));
            check(selectArtworkArchive(works, filters, locale), selectArtworkArchive(expectedWorks, filters, locale));
        }
    }
    return { artworks: works.length, publishedSeries: series.length, recognitions: expected.recognitions.length, locales: [...locales] };
}
