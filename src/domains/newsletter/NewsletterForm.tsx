"use client";
import { useLocale, useTranslations } from "next-intl";

import {
    FormEvent,
    useState,
} from "react";

import { useSearchParams } from "next/navigation";

import { Button } from "@/shared/ui/button";
import { getFormPrivacy } from "@/i18n/formPrivacyCopy";
import FormPrivacyNotice from "@/shared/ui/forms/FormPrivacyNotice";
import PrivacyConsentField from "@/shared/ui/forms/PrivacyConsentField";

type NewsletterStatus =
    | "idle"
    | "submitting"
    | "pendingConfirmation"
    | "confirmed"
    | "unsubscribed"
    | "invalidConfirmation"
    | "invalidUnsubscribe"
    | "error"
    | "alreadySubscribed"
    | "rateLimited";

function statusFromQuery(result: string | null): NewsletterStatus | undefined {
    switch (result) {
        case "success": return "confirmed";
        case "invalid": return "invalidConfirmation";
        case "unsubscribed": return "unsubscribed";
        case "invalid-unsubscribe": return "invalidUnsubscribe";
        default: return undefined;
    }
}

export default function NewsletterForm() {
    const locale = useLocale();
    const t = useTranslations("Newsletter");
    const privacy = getFormPrivacy(locale);

    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [contactField, setContactField] = useState("");
    const [acceptedNotice, setAcceptedNotice] = useState<string | null>(null);
    const noticeKey = locale + ":" + privacy.version;
    const consent = acceptedNotice === noticeKey;
    const setConsent = (checked: boolean) => setAcceptedNotice(checked ? noticeKey : null);
    const [consentError, setConsentError] = useState<"consentRequired" | "consentOutdated">();
    const result = searchParams.get("newsletter");
    const [previousResult, setPreviousResult] = useState(result);
    const [status, setStatus] =
        useState<NewsletterStatus>(() => statusFromQuery(result) ?? "idle");

    if (previousResult !== result) {
        setPreviousResult(result);
        const feedback = statusFromQuery(result);
        if (feedback) setStatus(feedback);
    }

    const isSubmitting = status === "submitting";

    /*
     * ======================================================
     * CLEAR FEEDBACK
     * ======================================================
     */

    function clearFeedback() {
        if (
            status === "pendingConfirmation" ||
            status === "confirmed" ||
            status === "unsubscribed" ||
            status === "invalidConfirmation" ||
            status === "invalidUnsubscribe" ||
            status === "error" ||
            status === "alreadySubscribed" ||
            status === "rateLimited"
        ) {
            setStatus("idle");
        }
    }

    /*
     * ======================================================
     * SUBMIT
     * ======================================================
     */

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        if (!consent) {
            setConsentError("consentRequired");
            return;
        }

        setConsentError(undefined);
        setStatus("submitting");

        try {
            const response = await fetch(
                "/api/newsletter",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        contactField,
                        source: "home",
                        consent,
                        locale,
                        consentVersion: privacy.version,
                    }),
                },
            );

            if (response.status === 409) {
                setStatus("alreadySubscribed");
                return;
            }

            if (response.status === 429) {
                setStatus("rateLimited");
                return;
            }

            if (!response.ok) {
                const result = await response.json().catch(() => null);

                if (result?.code === "consent_required" || result?.code === "consent_outdated") {
                    setConsentError(result.code === "consent_outdated"
                        ? "consentOutdated"
                        : "consentRequired");
                    setConsent(false);
                    setStatus("idle");
                    return;
                }

                setStatus("error");
                return;
            }

            setEmail("");
            setConsent(false);
            setStatus("pendingConfirmation");
        } catch {
            setStatus("error");
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            autoComplete="on"
            className="mt-8 w-full"
        >
            {/* Honeypot */}
            <div
                aria-hidden="true"
                className="
                    absolute
                    left-[-9999px]
                    h-px
                    w-px
                    overflow-hidden
                "
            >
                <label htmlFor="newsletter-contact-field">
                    {t("website")}
                </label>

                <input
                    id="newsletter-contact-field"
                    name="contactField"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={contactField}
                    onChange={(event) =>
                        setContactField(
                            event.target.value,
                        )
                    }
                />
            </div>

            <div className="mx-auto mb-6 max-w-xl text-left">
                <FormPrivacyNotice form="newsletter" id="newsletter-privacy-notice" />
            </div>

            <div className="mx-auto grid w-full max-w-xl gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <div className="min-w-0 flex-1 text-left">
                    <label
                        htmlFor="newsletter-email"
                        className="
                            font-sans
                            text-[0.65rem]
                            font-medium
                            uppercase
                            tracking-[0.28em]
                            text-white/45
                        "
                    >
                        {t("email")}
                    </label>

                    <input
                        id="newsletter-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        value={email}
                        disabled={isSubmitting}
                        onChange={(event) => {
                            setEmail(
                                event.target.value,
                            );

                            clearFeedback();
                        }}
                        className="
                            mt-3
                            w-full
                            border-0
                            border-b
                            border-white/20
                            bg-transparent
                            px-0
                            pb-3
                            font-sans
                            text-base
                            text-white
                            outline-none
                            transition-colors
                            duration-300
                            placeholder:text-white/25
                            focus:border-brand-gold
                            disabled:cursor-wait
                            disabled:opacity-60
                        "
                        placeholder={t("emailPlaceholder")}
                    />
                </div>

                <div className="text-left sm:col-span-2 sm:row-start-2">
                    <PrivacyConsentField
                        form="newsletter"
                        noticeId="newsletter-privacy-notice"
                        checked={consent}
                        disabled={isSubmitting}
                        error={consentError ? t(consentError) : undefined}
                        onChange={(checked) => {
                            setConsent(checked);
                            setConsentError(undefined);
                            clearFeedback();
                        }}
                    />
                </div>

                <Button
                    type="submit"
                    variant="outline"
                    disabled={isSubmitting}
                    className="group shrink-0 gap-5 sm:col-start-2 sm:row-start-1"
                >
                    <span>
                        {isSubmitting
                            ? t("subscribing")
                            : t("subscribe")}
                    </span>

                    {!isSubmitting && (
                        <span
                            aria-hidden="true"
                            className="
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                            "
                        >
                            →
                        </span>
                    )}
                </Button>
            </div>

            <div
                aria-live="polite"
                className="
                    mx-auto
                    mt-5
                    min-h-10
                    max-w-xl
                    text-left
                    font-sans
                    text-xs
                    leading-5
                "
            >
                {status === "idle" && (
                    <p className="text-white/35">
                        {t("idle")}
                    </p>
                )}

                {status === "pendingConfirmation" && (
                    <p className="text-success">
                        {t("pending")}
                    </p>
                )}

                {status === "confirmed" && (
                    <p className="text-success">
                        {t("confirmed")}
                    </p>
                )}

                {status === "unsubscribed" && (
                    <p className="text-success">
                        {t("unsubscribed")}
                    </p>
                )}

                {status === "invalidConfirmation" && (
                    <p className="text-error">
                        {t("invalidConfirmation")}
                    </p>
                )}

                {status === "invalidUnsubscribe" && (
                    <p className="text-error">
                        {t("invalidUnsubscribe")}
                    </p>
                )}

                {status === "alreadySubscribed" && (
                    <p className="text-brand-gold">
                        {t("alreadySubscribed")}
                    </p>
                )}

                {status === "error" && (
                    <p className="text-error">
                        {t("error")}
                    </p>
                )}

                {status === "rateLimited" && (
                    <p className="text-error">
                        {t("rateLimited")}
                    </p>
                )}
            </div>
        </form>
    );
}
