interface PageViewport { width: number; height: number; fontsLoaded: boolean }
export interface PortraitPageCache {
    ready(page: HTMLElement, images: HTMLImageElement[], viewport: PageViewport): boolean;
    remember(page: HTMLElement, images: HTMLImageElement[], viewport: PageViewport): void;
    invalidate(page: HTMLElement): void;
}

/** Decoded DOM pages can be promoted between slots without another entrance. */
export function createPortraitPageCache(): PortraitPageCache {
    const pages = new WeakMap<HTMLElement, { signature: string; images: HTMLImageElement[] }>();
    const complete = (images: HTMLImageElement[], view: PageViewport) => view.fontsLoaded &&
        view.width > 0 && view.height > 0 && images.every(image => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0);
    const signature = (images: HTMLImageElement[], view: PageViewport) => JSON.stringify([
        view.width, view.height, images.map(image => image.currentSrc || image.src),
    ]);
    return {
        ready(page, images, view) {
            const saved = pages.get(page);
            return Boolean(saved && complete(images, view) && saved.signature === signature(images, view) &&
                saved.images.length === images.length && saved.images.every((image, index) => image === images[index]));
        },
        remember(page, images, view) {
            if (complete(images, view)) pages.set(page, { signature: signature(images, view), images: [...images] });
        },
        invalidate(page) { pages.delete(page); },
    };
}
