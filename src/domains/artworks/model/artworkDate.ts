// Serializable authoring shape. Runtime validation enforces exact width and
// calendar validity; template literal types alone cannot validate leap days.
export type ArtworkDate = `${number}` | `${number}-${number}-${number}`;

const dateFormat = /^\d{4}(?:-\d{2}-\d{2})?$/;

export function isArtworkDate(value: unknown): value is ArtworkDate {
    if (typeof value !== "string" || (value.length !== 4 && value.length !== 10) || !dateFormat.test(value)) return false;
    const year = Number(value.slice(0, 4));
    if (year < 1) return false;
    if (value.length === 4) return true;
    const month = Number(value.slice(5, 7));
    const day = Number(value.slice(8, 10));
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return month >= 1 && month <= 12 && day >= 1 && day <= days[month - 1];
}

export function assertArtworkDate(value: unknown): asserts value is ArtworkDate {
    if (!isArtworkDate(value)) throw new RangeError("Artwork.date must be YYYY or a real Gregorian YYYY-MM-DD date, with a year from 0001 to 9999.");
}

export function getArtworkYear(date: ArtworkDate): number {
    assertArtworkDate(date);
    return Number(date.slice(0, 4));
}

// Year first, then known days in the requested chronology. Within the same
// year, year-only records form a separate group AFTER exact dates in BOTH
// directions. They are never assigned an invented month/day. Returning zero
// leaves the caller's original-title / stable-ID tie-breakers in control.
export function compareArtworkDates(first: ArtworkDate, second: ArtworkDate, order: "newest" | "oldest"): number {
    const firstYear = getArtworkYear(first), secondYear = getArtworkYear(second);
    const byYear = order === "newest" ? secondYear - firstYear : firstYear - secondYear;
    if (byYear) return byYear;
    if (first.length !== second.length) return first.length === 10 ? -1 : 1;
    if (first === second) return 0;
    const byDay = first < second ? -1 : 1;
    return order === "newest" ? -byDay : byDay;
}
