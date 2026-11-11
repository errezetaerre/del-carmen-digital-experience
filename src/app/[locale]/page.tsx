import { activateLocale } from "@/i18n/server";
import { createPageMetadata } from "@/shared/lib/metadata";
import { getHomeCatalogue } from "@/server/catalogue/homeSource";
import { localizeArtwork } from "@/i18n/artworkCopy";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await activateLocale(params);
  const source = (await getHomeCatalogue()).hero;
  const artwork = source ? localizeArtwork(source, locale) : undefined;
  return createPageMetadata({ locale, pathname: "/",
    image: artwork?.creationStatus === "completed" ? artwork.images.primary : undefined });
}

import Home from "@/domains/home";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  await activateLocale(params);
  const catalogue = await getHomeCatalogue();
  return <Home catalogue={catalogue} />;
}
