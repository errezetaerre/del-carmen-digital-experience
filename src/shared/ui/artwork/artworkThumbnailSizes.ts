type ThumbnailPresentation = "default" | "series" | "archive";
type ImageDimensions = { width?: number; height?: number };
type SizeRule = readonly [media: string, size: string];

// Delivery hints follow the existing card widths; they do not set CSS dimensions.
const sizeRules: Record<ThumbnailPresentation, readonly SizeRule[]> = {
    default: [
        ["(max-width: 471px)", "calc((100vw - 72px) / 2)"],
        ["", "200px"],
    ],
    series: [["", "260px"]],
    archive: [
        ["(min-width: 1700px)", "304px"],
        ["(min-width: 1100px)", "360px"],
        ["(min-width: 900px)", "calc((100vw - 112px) / 3)"],
        ["(min-width: 601px)", "calc((100vw - 91px) / 2)"],
        ["(min-width: 361px)", "calc((100vw - 58px) / 2)"],
        ["", "calc((100vw - 44px) / 2)"],
    ],
};

export function getArtworkThumbnailSizes(
    presentation: ThumbnailPresentation,
    image: ImageDimensions,
): string {
    const ratio = image.width && image.width > 0 && image.height && image.height > 0
        ? image.width / image.height
        : 0;
    // The approved 4:5 frame uses object-fit: cover. A landscape painting needs
    // extra source pixels to keep its cropped center sharp on dense displays.
    const scale = Number.isFinite(ratio) ? Math.ceil(Math.max(1, ratio / (4 / 5)) * 1000) / 1000 : 1;

    return sizeRules[presentation].map(([media, size]) => {
        const coveredSize = scale === 1 ? size : size.endsWith("px")
            ? `${Math.ceil(Number.parseFloat(size) * scale)}px`
            : `calc(${size} * ${scale})`;
        return media ? `${media} ${coveredSize}` : coveredSize;
    }).join(", ");
}
