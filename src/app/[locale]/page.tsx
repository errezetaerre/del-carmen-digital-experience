import { activateLocale } from "@/i18n/server";
import { createPageMetadata } from "@/shared/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await activateLocale(params);
  return createPageMetadata({ locale });
}

import Home from "@/domains/home";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  await activateLocale(params);
  return <Home />;
}
