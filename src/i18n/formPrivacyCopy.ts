import { formPrivacy } from "@/config/formPrivacy";
import type { SiteLocale } from "./config";
import spanish from "./content/formPrivacy.es.json";

type FormPrivacyCopy = {
    readonly version: string;
    readonly contact: { readonly [Field in keyof typeof formPrivacy.contact]: string };
    readonly newsletter: { readonly [Field in keyof typeof formPrivacy.newsletter]: string };
};

const spanishPrivacy: FormPrivacyCopy = {
    version: spanish.version,
    contact: { ...spanish.contact, purpose: formPrivacy.contact.purpose },
    newsletter: { ...spanish.newsletter, purpose: formPrivacy.newsletter.purpose },
};

export function getFormPrivacy(locale: SiteLocale): FormPrivacyCopy {
    return locale === "es" ? spanishPrivacy : formPrivacy;
}

// Cached English forms predate the locale field. Explicit unsupported values are rejected.
export function resolveFormLocale(value: unknown): SiteLocale | undefined {
    if (value === undefined) return "en";
    return value === "en" || value === "es" ? value : undefined;
}
