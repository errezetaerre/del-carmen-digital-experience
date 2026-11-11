import "server-only";
import { artworkArchiveSource } from "./archiveSource";
import { readFileCatalogue } from "./fileReader";

// PostgreSQL paths resolve on request, including future slugs not known at
// build time. Never connect during generateStaticParams. Production keeps its
// existing file-backed enumeration until separately reviewed activation.
export function artworkStaticParams(): { slug: string }[] {
    if (artworkArchiveSource(process.env) === "postgres") return [];
    return readFileCatalogue().getArtworks().map(({ slug }) => ({ slug }));
}
export function seriesStaticParams(): { slug: string }[] {
    if (artworkArchiveSource(process.env) === "postgres") return [];
    return readFileCatalogue().getSeries().map(({ slug }) => ({ slug }));
}
