import type { Artwork } from "../model/artwork";
import { compareArtworkDates } from "../model/artworkDate";
import type { ArtworkSeries } from "../series/types";

// Approved presentation preferences, not entities or membership. Series-local
// navigation was editorial before PostgreSQL; newest applies to /artworks only.
// Missing preferences do not create records; unlisted records are never hidden.
const seriesCycle = ["yasemi", "epifanias", "the_inner_treasury", "the_discipline_of_seeing"];
const workSequence = [
    "yasemi_i", "yasemi_ii", "yasemi_iii", "yasemi_iv",
    "epifania_nupcial", "sendero_del_sol", "margarita", "recordando_mi_puerto", "la_mujer_del_bosque",
    "el_baul_de_los_tesoros", "buda",
    "el_carnero", "la_chercheuse", "parthenon", "torso_de_bevedere", "victoria_de_samotracia", "psyche_de_naples",
];
const seriesRank = new Map(seriesCycle.map((id, index) => [id, index]));
const workRank = new Map(workSequence.map((id, index) => [id, index]));
const titles = new Intl.Collator("en", { sensitivity: "base", numeric: true });
function titleAndId(a: { id: string; title: string }, b: { id: string; title: string }) {
    return titles.compare(a.title, b.title) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}
function preference(a: string, b: string, ranks: ReadonlyMap<string, number>) {
    return (ranks.get(a) ?? Number.MAX_SAFE_INTEGER) - (ranks.get(b) ?? Number.MAX_SAFE_INTEGER);
}

// Called only AFTER membership is selected using the supplied seriesId FK.
// New works follow the reviewed sequence, newest/date precision/title/ID stable.
export function orderSeriesArtworks<T extends Artwork>(artworks: readonly T[]): T[] {
    return [...artworks].sort((a, b) => preference(a.id, b.id, workRank) ||
        compareArtworkDates(a.date, b.date, "newest") || titleAndId(a, b));
}

// New published series follow the reviewed cycle: start year descending,
// original title, then ID. Publication filtering belongs to the caller.
export function orderArtworkSeries<T extends ArtworkSeries>(series: readonly T[]): T[] {
    return [...series].sort((a, b) => preference(a.id, b.id, seriesRank) ||
        (b.yearStart ?? 0) - (a.yearStart ?? 0) || titleAndId(a, b));
}
