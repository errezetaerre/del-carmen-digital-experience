export type PageDirection = -1 | 1;

// Intent is relative to the last requested page, including reversals while a sheet is in flight.
export function createGalleryTurnQueue() {
    const waiting: number[] = [];
    let flying: number | undefined;
    const end = (page: number) => waiting.at(-1) ?? flying ?? page;
    return {
        end,
        request(page: number, last: number, direction: PageDirection) {
            const next = end(page) + direction;
            if (next < 0 || next > last) return false;
            waiting.push(next);
            return true;
        },
        dispatch(page: number, navigate: (direction: PageDirection) => boolean) {
            if (flying === page) flying = undefined;
            if (flying !== undefined) return;
            while (waiting[0] === page) waiting.shift();
            const next = waiting[0];
            if (next === undefined) return;
            flying = next;
            if (navigate(next > page ? 1 : -1)) waiting.shift();
            else flying = undefined;
        },
        clear() { flying = undefined; waiting.length = 0; },
    };
}

const spreadQuery = "(orientation: landscape) and (min-height: 556px), (orientation: landscape) and (min-width: 1050px), (min-width: 1150px)";
export const isGallerySpread = () => window.matchMedia(spreadQuery).matches;
export function subscribeGallerySpread(listener: () => void) {
    const media = window.matchMedia(spreadQuery);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
}
