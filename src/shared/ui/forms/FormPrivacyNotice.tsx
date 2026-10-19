import { useLocale, useTranslations } from "next-intl";
import Link from "@/i18n/navigation";

import type { PrivacyForm } from "@/config/formPrivacy";
import { getFormPrivacy } from "@/i18n/formPrivacyCopy";
import { brand } from "@/config/brand";
import { getLegalContact } from "@/i18n/legalCopy";

type Props = {
    form: PrivacyForm;
    id: string;
};

export default function FormPrivacyNotice({ form, id }: Props) {
    const locale = useLocale();
    const t = useTranslations("FormPrivacy");

    const notice = getFormPrivacy(locale)[form];
    const legalContact = getLegalContact(locale);

    return (
        <div className="font-sans text-xs leading-6 text-stone-400">
            <p id={id}>
                {legalContact.responsibleName} {t("handler")} {brand.name}. {notice.summary}{" "}
                <Link
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-brand-gold/50 underline-offset-4 transition-colors hover:text-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
                >
                    {t("privacyLink")}
                </Link>.
            </p>

            <p className="mt-2">{notice.requiredSummary}</p>

            <details className="mt-2">
                <summary className="w-fit cursor-pointer text-stone-300 transition-colors hover:text-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold">
                    {t("details")}
                </summary>
                <div className="mt-3 space-y-3 border-l border-brand-gold/30 pl-4">
                    <p>{notice.collection}</p>
                    <p>{notice.requirement}</p>
                    <p>{notice.retention}</p>
                    <p>
                        {t("rights")}{" "}
                        <a href={`mailto:${legalContact.email}`} className="break-words underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold">
                            {legalContact.email}
                        </a>.
                    </p>
                    <address className="not-italic">
                        {legalContact.responsibleName}
                        {legalContact.addressLines.map((line) => (
                            <span key={line} className="block">{line}</span>
                        ))}
                    </address>
                </div>
            </details>
        </div>
    );
}
