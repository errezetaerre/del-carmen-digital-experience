import { legalContact } from "@/config/legal";
import type { SiteLocale } from "./config";
import spanish from "./content/legalContact.es.json";

export function getLegalContact(locale: SiteLocale) {
    return locale === "es" ? { ...legalContact, addressLines: spanish.addressLines } : legalContact;
}
