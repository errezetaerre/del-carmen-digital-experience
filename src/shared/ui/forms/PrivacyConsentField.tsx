import { useLocale } from "next-intl";
import type { PrivacyForm } from "@/config/formPrivacy";
import { getFormPrivacy } from "@/i18n/formPrivacyCopy";

type Props = {
    form: PrivacyForm;
    noticeId: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled: boolean;
    error?: string;
};

export default function PrivacyConsentField({ form, noticeId, checked, onChange, disabled, error }: Props) {
    const locale = useLocale();
    const privacy = getFormPrivacy(locale);
    const id = `${form}-consent`;
    const errorId = `${id}-error`;

    return (
        <div className="font-sans text-xs leading-6 text-stone-300">
            <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3">
                <input
                    id={id}
                    name="consent"
                    type="checkbox"
                    required
                    checked={checked}
                    disabled={disabled}
                    onChange={(event) => onChange(event.target.checked)}
                    aria-invalid={Boolean(error)}
                    aria-describedby={[noticeId, error ? errorId : ""].filter(Boolean).join(" ")}
                    className="mt-1 h-4 w-4 shrink-0 accent-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold disabled:cursor-wait disabled:opacity-50"
                />
                <span>{privacy[form].consentLabel}</span>
            </label>
            {error && <p id={errorId} role="alert" className="mt-2 text-error">{error}</p>}
        </div>
    );
}
