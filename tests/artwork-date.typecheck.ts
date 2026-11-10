import type { Artwork, ArtworkDate } from "../src/domains/artworks";
import { getArtworkYear, isArtworkDate } from "../src/domains/artworks/model/artworkDate";

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Expect<T extends true> = T;

export type ArtworkDateContract = [
    Expect<Equal<Artwork["date"], ArtworkDate>>,
    Expect<Equal<Extract<"year", keyof Artwork>, never>>,
    Expect<Equal<ReturnType<typeof getArtworkYear>, number>>,
];

const year: ArtworkDate = "2025";
const exact: ArtworkDate = "2025-11-09"; // format fixture, not a real artwork date
getArtworkYear(year);
getArtworkYear(exact);
// @ts-expect-error The persisted value is a string, never a number.
const numericDate: ArtworkDate = 2025;
// @ts-expect-error Slash-separated dates are not an authoring shape.
const slashDate: ArtworkDate = "2025/11/09";
// @ts-expect-error The old persisted year attribute no longer exists.
export type RemovedYear = Artwork["year"];
// @ts-expect-error Callers pass Artwork.date to the shared getter.
getArtworkYear(2025);

export function validateIncomingDate(value: unknown): ArtworkDate | undefined {
    return isArtworkDate(value) ? value : undefined;
}

void numericDate;
void slashDate;
