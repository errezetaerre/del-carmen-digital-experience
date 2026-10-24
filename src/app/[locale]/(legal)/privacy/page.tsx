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
    const copy = getSiteMessages(locale).Privacy;
    return createPageMetadata({ locale, pathname: "/privacy", title: copy.metadataTitle, description: copy.metadataDescription });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await activateLocale(params);
    const t = await getTranslations({ locale, namespace: "Privacy" });
    const legalContact = getLegalContact(locale);
    return (
        <article aria-labelledby="privacy-title">
            <header>
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-gold">
                    {t("label")}
                </p>
                <h1 id="privacy-title" className="mt-6 font-display text-5xl font-light leading-[1.02] md:text-7xl">
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

            <section aria-labelledby="privacy-about">
                <h2 id="privacy-about">{t("aboutTitle")}</h2>
                <p>
                    {t("aboutFirst")} {brand.name} {t("aboutAnd")} {brand.parentBrand}{t("aboutLast")}
                </p>
            </section>

            <section aria-labelledby="privacy-responsible">
                <h2 id="privacy-responsible">{t("responsibleTitle")}</h2>
                <p>
                    {legalContact.responsibleName} {t("responsibleFirst")} {brand.name} {t("responsibleAnd")} {brand.parentBrand} {t("responsibleLast")}
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

            <section aria-labelledby="privacy-information">
                <h2 id="privacy-information">{t("informationTitle")}</h2>
                <ul>
                    <li>{t("contactData")}</li>
                    <li>{t("newsletterData")}</li>
                    <li>{t("consentData")}</li>
                    <li>{t("protectionData")}</li>
                </ul>
                <p className="mt-4">
                    {t("voluntary")}
                </p>
            </section>

            <section aria-labelledby="privacy-consent">
                <h2 id="privacy-consent">{t("consentTitle")}</h2>
                <p>
                    {t("consentDescription")}
                </p>
                <p>
                    {t("withdrawFirst")}{" "}
                    <a href={`mailto:${legalContact.email}`}>{legalContact.email}</a>{t("withdrawLast")}
                </p>
            </section>

            <section aria-labelledby="privacy-purpose">
                <h2 id="privacy-purpose">{t("purposeTitle")}</h2>
                <p>
                    {t("purposeDescription")}
                </p>
                <p>{t("separateConsent")}</p>
            </section>

            <section aria-labelledby="privacy-retention">
                <h2 id="privacy-retention">{t("retentionTitle")}</h2>
                <p>
                    {t("contactRetention")}
                </p>
                <p>
                    {t("providerRetention")}
                </p>
            </section>

            <section aria-labelledby="privacy-providers">
                <h2 id="privacy-providers">{t("providersTitle")}</h2>
                <p>
                    {t("providersDescription")}
                </p>
                <p>
                    {t("providersFirst")} <a href="https://resend.com/legal/privacy-policy">{t("resendPrivacy")}</a> {t("providersAnd")}{" "}
                    <a href="https://upstash.com/trust/privacy.pdf">{t("upstashPrivacy")}</a> {t("providersLast")}
                </p>
            </section>

            <section aria-labelledby="privacy-newsletter">
                <h2 id="privacy-newsletter">{t("newsletterTitle")}</h2>
                <p>
                    {t("pendingRetention")}
                </p>
                <p>
                    {t("activeRetention")}
                </p>
                <p>
                    {t("newsletterWithdrawFirst")}{" "}
                    <a href={`mailto:${legalContact.email}`}>{legalContact.email}</a> {t("newsletterWithdrawOr")} <Link href="/contact">{t("newsletterContact")}</Link>.
                </p>
            </section>

            <section aria-labelledby="privacy-requests">
                <h2 id="privacy-requests">{t("requestsTitle")}</h2>
                <p>
                    {t("requestsDescription")}
                </p>
                <p>
                    {t("requestsFirst")} <a href={`mailto:${legalContact.email}`}>{legalContact.email}</a> {t("requestsOr")}{" "}
                    <Link href="/contact">{t("requestsContact")}</Link> {t("requestsLast")}
                </p>
            </section>

            <section aria-labelledby="privacy-links">
                <h2 id="privacy-links">{t("linksTitle")}</h2>
                <p>
                    {t("linksDescription")}
                </p>
            </section>
        </article>
    );
}
