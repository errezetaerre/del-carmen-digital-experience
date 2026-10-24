import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { SiteLocale } from "@/i18n/config";
import { isIndexableDeployment, siteOrigin } from "@/config/seo";
import { isIndexablePage, pageLanguageAlternates, publicPageUrl } from "./seo";

// Titles are supplied without a brand suffix; route metadata owns one complete title.
export function createPageMetadata({ pathname, title, description, image, type = "website", locale = "en" }: {
    pathname: string;
    title?: string;
    description?: string;
    image?: { src: string; alt: string; width?: number; height?: number };
    type?: "website" | "article";
    locale?: SiteLocale;
}): Metadata {
    const pageTitle = title?.replace(/\s+/g, " ").trim() || siteConfig.name;
    const fullTitle = pageTitle === siteConfig.name ? pageTitle : `${pageTitle} | ${siteConfig.shortName}`;
    const summary = description?.replace(/\s+/g, " ").trim() || (locale === "es" ? "La plataforma digital oficial del universo artístico de Del Carmen." : siteConfig.description);
    const canonical = publicPageUrl(pathname, locale);
    const languages = pageLanguageAlternates(pathname);
    const socialImage = image ? { url: new URL(image.src, siteOrigin).href, alt: image.alt,
        ...(image.width ? { width: image.width } : {}), ...(image.height ? { height: image.height } : {}) } : undefined;
    const social = { title: fullTitle, description: summary, url: canonical, siteName: siteConfig.name,
        locale: locale === "es" ? "es_CR" : siteConfig.locale.replace(/-/g, "_"),
        ...(socialImage ? { images: [socialImage] } : {}) };
    return {
        title: fullTitle,
        description: summary,
        alternates: { canonical, ...(languages ? { languages } : {}) },
        robots: { index: isIndexablePage(pathname, locale), follow: isIndexableDeployment },
        openGraph: type === "article" ? { ...social, type: "article" } : { ...social, type: "website" },
        twitter: { card: socialImage ? "summary_large_image" : "summary", title: fullTitle, description: summary,
            ...(socialImage ? { images: [{ url: socialImage.url, alt: socialImage.alt }] } : {}) },
    };
}
