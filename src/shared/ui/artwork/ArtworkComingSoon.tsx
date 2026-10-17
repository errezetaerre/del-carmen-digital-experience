import type { Artwork } from "@/domains/artworks/model/artwork";
import { artworkPreviewMarkup } from "./artworkPreviewMarkup";
import styles from "./ArtworkComingSoon.module.css";

export default function ArtworkComingSoon({ artwork, className = "", variant = "default" }: { artwork: Artwork; className?: string; variant?: "default" | "thumbnail" }) {
    if (artwork.creationStatus === "completed") return null;
    return <div className={`h-full w-full ${variant === "thumbnail" ? styles.thumbnail : ""} ${className}`} dangerouslySetInnerHTML={{ __html: artworkPreviewMarkup(artwork) }} />;
}
