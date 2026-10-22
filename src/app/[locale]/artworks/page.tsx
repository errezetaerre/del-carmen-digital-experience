import { Suspense } from "react";
import { activateLocale } from "@/i18n/server";
import { getSiteMessages } from "@/i18n/messages";
import { createPageMetadata } from "@/shared/lib/metadata";
import { getArtworks } from "@/domains/artworks";
import { Container } from "@/shared/layout";
import Footer from "@/shared/layout/footer";
import ArtworkArchive from "./ArtworkArchive";
import styles from "./ArtworkArchive.module.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const locale = await activateLocale(params);
    const copy = getSiteMessages(locale).Archive;
    return createPageMetadata({ locale, title: copy.metadataTitle, description: copy.metadataDescription });
}

export default async function ArtworksPage({ params }: { params: Promise<{ locale: string }> }) {
    const locale = await activateLocale(params);
    const copy = getSiteMessages(locale).Archive;
    return <>
        <main className={styles.page}>
            <a className={styles.skipLink} href="#archive-gallery">{copy.skip}</a>
            <Container size="full" className={styles.shell}>
                <section className={styles.intro} aria-labelledby="archive-title">
                    <div><p className={styles.eyebrow}>{copy.eyebrow}</p>
                        <h1 id="archive-title">{copy.titleFirst} {copy.titleSecond}</h1>
                    </div>
                    <p className={styles.description}>{copy.description}</p>
                </section>
                <Suspense fallback={<div className="min-h-[40vh]" />}><ArtworkArchive artworks={getArtworks()} /></Suspense>
            </Container>
        </main>
        <Footer />
    </>;
}
