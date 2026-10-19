import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { SiteLocale } from "@/i18n/config";

// Titles are supplied without a brand suffix; route metadata owns one complete title.
export function createPageMetadata({ title, description, type = "website", locale = "en" }: {
    title?: string;
    description?: string;
    type?: "website" | "article";
    locale?: SiteLocale;
} = {}): Metadata {
    const pageTitle = title?.replace(/\s+/g, " ").trim() || siteConfig.name;
    const fullTitle = pageTitle === siteConfig.name ? pageTitle : `${pageTitle} | ${siteConfig.shortName}`;
    const summary = description?.replace(/\s+/g, " ").trim() || (locale === "es" ? "La plataforma digital oficial del universo artístico de Del Carmen." : siteConfig.description);
    const social = { title: fullTitle, description: summary, siteName: siteConfig.name, locale: locale === "es" ? "es_CR" : siteConfig.locale.replace(/-/g, "_") };
    return {
        title: fullTitle,
        description: summary,
        openGraph: type === "article" ? { ...social, type: "article" } : { ...social, type: "website" },
        twitter: { card: "summary", title: fullTitle, description: summary },
    };
}
