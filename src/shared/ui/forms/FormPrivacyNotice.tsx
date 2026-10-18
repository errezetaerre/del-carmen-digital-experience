import Link from "@/i18n/navigation";

import { formPrivacy, type PrivacyForm } from "@/config/formPrivacy";
import { brand } from "@/config/brand";
import { legalContact } from "@/config/legal";

type Props = {
    form: PrivacyForm;
    id: string;
};

export default function FormPrivacyNotice({ form, id }: Props) {
    const notice = formPrivacy[form];

    return (
        <div className="font-sans text-xs leading-6 text-stone-400">
            <p id={id}>
                {legalContact.responsibleName} handles these details for {brand.name}. {notice.summary}{" "}
                <Link
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-brand-gold/50 underline-offset-4 transition-colors hover:text-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
                >
                    Privacy notice (opens in a new tab)
                </Link>.
            </p>

            <p className="mt-2">{notice.requiredSummary}</p>

            <details className="mt-2">
                <summary className="w-fit cursor-pointer text-stone-300 transition-colors hover:text-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold">
                    How your details are handled
                </summary>
                <div className="mt-3 space-y-3 border-l border-brand-gold/30 pl-4">
                    <p>{notice.collection}</p>
                    <p>{notice.requirement}</p>
                    <p>{notice.retention}</p>
                    <p>
                        You can browse the artwork without using this form. For access, correction, deletion or
                        withdrawal, email{" "}
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
