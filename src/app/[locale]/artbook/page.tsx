import ArchiveModeRoute from "@/domains/artworks/components/archive-book/ArchiveModeRoute";
import { Suspense } from "react";
import { activateLocale } from "@/i18n/server";
import { getSiteMessages } from "@/i18n/messages";
import { createPageMetadata } from "@/shared/lib/metadata";
import { getArtworkArchiveArtworks } from "@/server/catalogue/archiveSource";
import ArtworkBookExperience from "@/domains/artworks/components/archive-book/ArtworkBookExperience";
import ArtworkLoading from "@/shared/ui/artwork/ArtworkLoading";
import portraitStyles from "@/domains/artworks/components/portrait-artbook/ArtworkPortraitArtbook.module.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
    const locale = await activateLocale(params);
    const { Archive } = getSiteMessages(locale);
    return createPageMetadata({ locale, pathname: "/artbook", title: Archive.eyebrow, description: Archive.description });
}

export default async function ArtbookPage({ params }: Props) {
    const locale = await activateLocale(params);
    const artworks = await getArtworkArchiveArtworks();
    return <Suspense fallback={<main className={portraitStyles.entryLoading}><ArtworkLoading label={getSiteMessages(locale).Glass.preparing} /></main>}>
        <ArchiveModeRoute mode="glass"><ArtworkBookExperience artworks={artworks} /></ArchiveModeRoute>
    </Suspense>;
}
