import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isSiteLocale, locales, spanishReleaseReady } from "@/i18n/config";
import { getSiteMessages } from "@/i18n/messages";
import { Navigation } from "@/domains/navigation";
import SiteAnalytics from "@/shared/analytics/SiteAnalytics";

import {
  Cormorant_Garamond,
  Geist,
  Geist_Mono,
} from "next/font/google";

import "../globals.css";

import { siteConfig } from "@/config/site";
import { isIndexableDeployment, siteOrigin } from "@/config/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  return {
    metadataBase: new URL(siteOrigin),
    title: siteConfig.name,
    description: siteConfig.description,
    ...(!isIndexableDeployment || (locale === "es" && !spanishReleaseReady)
      ? { robots: { index: false, follow: isIndexableDeployment } } : {}),
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  setRequestLocale(locale);
  return (
    <html
      lang={locale}
      className={[
        geistSans.variable,
        geistMono.variable,
        cormorant.variable,
        "h-full",
        "antialiased",
      ].join(" ")}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={getSiteMessages(locale)}>
          <a href="#main-content" className="skip-to-content">{getSiteMessages(locale).Navigation.skipToContent}</a>
          <Navigation />
          <div id="main-content" tabIndex={-1} />
          {children}
          {process.env.VERCEL_ENV === "production" && <SiteAnalytics />}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
