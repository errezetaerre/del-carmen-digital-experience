import Image from "next/image";
import type { Artwork } from "../../model/artwork";
import ArtworkComingSoon from "@/shared/ui/artwork/ArtworkComingSoon";
import motion from "@/shared/ui/artwork/ArtworkThumbnailMotion.module.css";
import styles from "./GalleryBook.module.css";

export default function BookThumbnail({ artwork, sizes, pan = false }: { artwork: Artwork; sizes: string; pan?: boolean }) {
    const image = artwork.images.thumbnail ?? artwork.images.primary;
    const completed = artwork.creationStatus === "completed";
    return <div className={styles.imageWindow}>
        {completed ? <Image fill src={image.src} alt="" sizes={sizes} draggable={false}
            className={pan ? motion.image : undefined} data-artwork-thumbnail-image={pan ? "" : undefined} /> :
            <ArtworkComingSoon artwork={artwork} variant="thumbnail" imageSizes={sizes} />}
    </div>;
}
