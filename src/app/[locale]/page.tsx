import { activateLocale } from "@/i18n/server";
import { createPageMetadata } from "@/shared/lib/metadata";
import { homeCuration } from "@/domains/home/curation/homeCuration";
import { getArtworkById } from "@/domains/artworks/services/getArtworkById";
import { localizeArtwork } from "@/i18n/artworkCopy";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await activateLocale(params);
  const source = getArtworkById(homeCuration.hero.artworkId);
  const artwork = source ? localizeArtwork(source, locale) : undefined;
  return createPageMetadata({ locale, pathname: "/",
    image: artwork?.creationStatus === "completed" ? artwork.images.primary : undefined });
}

import Home from "@/domains/home";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  await activateLocale(params);
  return <Home />;
}
