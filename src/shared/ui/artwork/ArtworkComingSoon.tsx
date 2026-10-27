import type { Artwork } from "@/domains/artworks/model/artwork";
import { artworkPreviewMarkup } from "./artworkPreviewMarkup";
import styles from "./ArtworkComingSoon.module.css";
import { useLocale } from "next-intl";

export default function ArtworkComingSoon({ artwork, className = "", variant = "default", imageSizes = "260px" }: { artwork: Artwork; className?: string; variant?: "default" | "thumbnail"; imageSizes?: string }) {
    const locale = useLocale();
    if (artwork.creationStatus === "completed") return null;
    return <div lang={locale} className={`h-full w-full ${variant === "thumbnail" ? styles.thumbnail : ""} ${className}`} dangerouslySetInnerHTML={{ __html: artworkPreviewMarkup(artwork, locale, variant === "thumbnail" ? imageSizes : undefined) }} />;
}
