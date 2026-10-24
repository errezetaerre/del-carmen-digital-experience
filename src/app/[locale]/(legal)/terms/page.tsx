import { getTranslations } from "next-intl/server";
import { getSiteMessages } from "@/i18n/messages";
import { activateLocale } from "@/i18n/server";
import type { Metadata } from "next";
import { createPageMetadata } from "@/shared/lib/metadata";
import Link from "@/i18n/navigation";

import { brand } from "@/config/brand";
import { getLegalContact } from "@/i18n/legalCopy";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const locale = await activateLocale(params);
    const copy = getSiteMessages(locale).Terms;
    return createPageMetadata({ locale, pathname: "/terms", title: copy.metadataTitle, description: copy.metadataDescription });
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await activateLocale(params);
    const t = await getTranslations({ locale, namespace: "Terms" });
    const legalContact = getLegalContact(locale);
    return (
        <article aria-labelledby="terms-title">
            <header>
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-gold">
                    {t("label")}
                </p>
                <h1 id="terms-title" className="mt-6 font-display text-5xl font-light leading-[1.02] md:text-7xl">
                    {t("title")}
                </h1>
                <p className="mt-8 max-w-2xl font-sans text-base font-light leading-8 text-white/65 md:text-lg">
                    {t("description")}
                </p>
                <p className="mt-8 border-l border-brand-gold/50 pl-4 font-sans text-xs leading-6 text-white/60">
                    {t("draftDate")}
                    <span className="block">{t("draft")}</span>
                </p>
            </header>

            <section aria-labelledby="terms-experience">
                <h2 id="terms-experience">{t("experienceTitle")}</h2>
                <p>
                    {t("experienceDescription")}
                </p>
            </section>

            <section aria-labelledby="terms-operator">
                <h2 id="terms-operator">{t("operatorTitle")}</h2>
                <p>
                    {t("operatorFirst")} {legalContact.responsibleName} {t("operatorMiddle")} {brand.name} {t("operatorAnd")} {brand.parentBrand}.
                </p>
                <address className="mt-5 not-italic">
                    <p>
                        {legalContact.addressLines.map((line) => (
                            <span key={line} className="block">{line}</span>
                        ))}
                    </p>
                    <p>
                        <a href={`mailto:${legalContact.email}`}>{legalContact.email}</a>
                    </p>
                </address>
            </section>

            <section aria-labelledby="terms-images">
                <h2 id="terms-images">{t("imagesTitle")}</h2>
                <p>
                    {t("imagesDescription")}
                </p>
            </section>

            <section aria-labelledby="terms-rights">
                <h2 id="terms-rights">{t("rightsTitle")}</h2>
                <p>
                    {t("rightsDescription")}
                </p>
                <p>
                    {t("permissionsFirst")} <Link href="/contact">{t("permissionsContact")}</Link> {t("permissionsLast")}
                </p>
            </section>

            <section aria-labelledby="terms-enquiries">
                <h2 id="terms-enquiries">{t("enquiriesTitle")}</h2>
                <p>
                    {t("enquiriesDescription")}
                </p>
                <p>
                    {t("offerings")}
                </p>
                <p>
                    {t("conditions")}
                </p>
            </section>

            <section aria-labelledby="terms-use">
                <h2 id="terms-use">{t("useTitle")}</h2>
                <p>
                    {t("useDescription")}
                </p>
            </section>

            <section aria-labelledby="terms-privacy">
                <h2 id="terms-privacy">{t("privacyTitle")}</h2>
                <p>
                    {t("privacyFirst")} <Link href="/privacy">{t("privacyLink")}</Link> {t("privacyLast")}
                </p>
            </section>

            <section aria-labelledby="terms-contact">
                <h2 id="terms-contact">{t("questionsTitle")}</h2>
                <p>
                    {t("questionsFirst")}{" "}
                    <a href={`mailto:${legalContact.email}`}>{legalContact.email}</a> {t("questionsOr")} <Link href="/contact">{t("questionsContact")}</Link>.
                </p>
            </section>
        </article>
    );
}
