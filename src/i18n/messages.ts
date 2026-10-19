import en from "./messages/en.json";
import es from "./messages/es.json";
import type { SiteLocale } from "./config";

export type SiteMessages = typeof en;
const spanish: SiteMessages = es;

export function getSiteMessages(locale: SiteLocale): SiteMessages {
    return locale === "es" ? spanish : en;
}
