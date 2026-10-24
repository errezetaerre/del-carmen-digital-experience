"use client";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/shared/ui/button";
import { legalContact } from "@/config/legal";
import { getFormPrivacy } from "@/i18n/formPrivacyCopy";
import FormPrivacyNotice from "@/shared/ui/forms/FormPrivacyNotice";
import PrivacyConsentField from "@/shared/ui/forms/PrivacyConsentField";

import { FormEvent, useEffect, useRef, useState } from "react";

type FormStatus =
    | "idle"
    | "submitting"
    | "success"
    | "error"
    | "rateLimited";

type FormData = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

type FormErrorCode = "nameRequired" | "emailRequired" | "emailInvalid" | "subjectRequired" | "messageRequired" | "consentRequired" | "consentOutdated";
type FormErrors = Partial<Record<keyof FormData | "consent", FormErrorCode>>;

const INITIAL_FORM: FormData = {
    name: "",
    email: "",
    subject: "",
    message: "",
};

export default function ContactForm() {
    const locale = useLocale();
    const t = useTranslations("Contact");
    const privacy = getFormPrivacy(locale);
    const SUBJECTS = [
        {
            value: "artworks",
            label: t("subjectArtworks"),
            description:
                t("subjectArtworksDescription"),
        },
        {
            value: "collaboration",
            label: t("subjectCollaboration"),
            description:
                t("subjectCollaborationDescription"),
        },
        {
            value: "general",
            label: t("subjectGeneral"),
            description:
                t("subjectGeneralDescription"),
        },
    ] as const;

    const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
    const [errors, setErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<FormStatus>("idle");
    const [contactField, setContactField] = useState("");
    const [acceptedNotice, setAcceptedNotice] = useState<string | null>(null);
    const noticeKey = locale + ":" + privacy.version;
    const consent = acceptedNotice === noticeKey;
    const setConsent = (checked: boolean) => setAcceptedNotice(checked ? noticeKey : null);
    const [subjectPreview, setSubjectPreview] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const feedbackRef = useRef<HTMLDivElement>(null);

    function focusInvalidField() {
        requestAnimationFrame(() => {
            formRef.current?.querySelector<HTMLElement>(
                'input[aria-invalid="true"], textarea[aria-invalid="true"], fieldset[aria-invalid="true"] input',
            )?.focus();
        });
    }

    useEffect(() => {
        if (status === "success") {
            feedbackRef.current?.scrollIntoView({ block: "nearest" });
        }
    }, [status]);

    function updateField(field: keyof FormData, value: string) {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));

        if (errors[field]) {
            setErrors((current) => ({
                ...current,
                [field]: undefined,
            }));
        }

        if (
            status === "success" ||
            status === "error" ||
            status === "rateLimited"
        ) {
            setStatus("idle");
        }
        setStatus("idle");
    }


    function validateForm() {
        const nextErrors: FormErrors = {};

        if (!formData.name.trim()) {
            nextErrors.name = "nameRequired";
        }

        if (!formData.email.trim()) {
            nextErrors.email = "emailRequired";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
        ) {
            nextErrors.email = "emailInvalid";
        }

        if (!formData.subject) {
            nextErrors.subject = "subjectRequired";
        }

        if (!formData.message.trim()) {
            nextErrors.message = "messageRequired";
        }

        if (!consent) {
            nextErrors.consent = "consentRequired";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (status === "submitting") return;

        if (!validateForm()) {
            focusInvalidField();
            return;
        }

        setStatus("submitting");

        /*
         * Real frontend simulation.
         * Server-side contact endpoint.
         */
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    contactField,
                    consent,
                    locale,
                    consentVersion: privacy.version,
                }),
            });

            if (response.status === 429) {
                setStatus("rateLimited");
                return;
            }

            if (!response.ok) {
                const result = await response.json().catch(() => null);

                if (result?.code === "consent_required" || result?.code === "consent_outdated") {
                    setErrors((current) => ({
                        ...current,
                        consent: result.code === "consent_outdated"
                            ? "consentOutdated"
                            : "consentRequired",
                    }));
                    setConsent(false);
                    setStatus("idle");
                    focusInvalidField();
                    return;
                }

                throw new Error("Request failed.");
            }


            setStatus("success");
            setFormData(INITIAL_FORM);
            setContactField("");
            setConsent(false);
            setErrors({});
        } catch (error) {
            console.error("Contact form error:", error);
            setStatus("error");
        }
    };

    const isSubmitting = status === "submitting";

    return (
        <form
            ref={formRef}
            aria-busy={isSubmitting}
            className="w-full"
            noValidate
            onSubmit={handleSubmit}
            autoComplete="on"
        >

            <div
                aria-hidden="true"
                className="absolute left-[-9999px] h-px w-px overflow-hidden"
            >
                <label htmlFor="contact-field">
                    {t("website")}
                </label>

                <input
                    id="contact-field"
                    name="contactField"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={contactField}
                    onChange={(event) => setContactField(event.target.value)}
                />
            </div>

            <div className="mb-8">
                <FormPrivacyNotice form="contact" id="contact-privacy-notice" />
            </div>

            <div className="space-y-7">
                {/* Name */}
                <div>
                    <label
                        htmlFor="name"
                        className="
                            block font-sans text-[0.65rem] font-medium
                            uppercase tracking-[0.22em]
                            text-stone-500
                        "
                    >
                        {t("name")}
                    </label>

                    <input
                        id="name"
                        name="name"
                        maxLength={100}
                        required
                        type="text"
                        autoComplete="name"
                        value={formData.name}
                        onChange={(event) =>
                            updateField("name", event.target.value)
                        }
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={
                            errors.name ? "name-error" : undefined
                        }
                        disabled={isSubmitting}
                        className="
                            mt-3 w-full border-0 border-b
                            border-stone-700/70 bg-transparent
                            px-0 py-1
                            font-sans text-base text-stone-100
                            outline-none
                            transition-colors duration-300
                            placeholder:text-stone-700
                            focus:border-brand-gold/60
                            disabled:cursor-wait disabled:opacity-50
                            "
                    />

                    {errors.name && (
                        <p
                            id="name-error"
                            className="mt-2 font-sans text-xs text-error"
                        >
                            {t(errors.name)}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label
                        htmlFor="email"
                        className="
                            block font-sans text-[0.65rem] font-medium
                            uppercase tracking-[0.22em]
                            text-stone-500
                        "
                    >
                        {t("email")}
                    </label>

                    <input
                        id="email"
                        name="email"
                        maxLength={254}
                        required
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={(event) =>
                            updateField("email", event.target.value)
                        }
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                            errors.email ? "email-error" : undefined
                        }
                        disabled={isSubmitting}
                        className="
                            mt-3 w-full border-0 border-b
                            border-stone-700/70 bg-transparent
                            px-0 py-1
                            font-sans text-base text-stone-100
                            outline-none
                            transition-colors duration-300
                            focus:border-brand-gold/60
                            disabled:cursor-wait disabled:opacity-50
                            "
                    />

                    {errors.email && (
                        <p
                            id="email-error"
                            className="mt-2 font-sans text-xs text-error"
                        >
                            {t(errors.email)}
                        </p>
                    )}
                </div>

                {/* Subject */}
                <fieldset
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={
                        errors.subject ? "subject-error" : "subject-description"
                    }
                >
                    <legend
                        className="
                        font-sans text-[0.65rem] font-medium
                        uppercase tracking-[0.22em]
                        text-stone-500
                        "
                    >
                        {t("subject")}
                    </legend>

                    <div className="mt-5 flex flex-wrap gap-x-7 gap-y-4">
                        {SUBJECTS.map((option) => {
                            const isSelected = formData.subject === option.value;

                            return (
                                <label
                                    key={option.value}
                                    onMouseEnter={() => setSubjectPreview(option.value)}
                                    onMouseLeave={() => setSubjectPreview(null)}
                                    onFocus={() => setSubjectPreview(option.value)}
                                    onBlur={() => setSubjectPreview(null)}
                                    className="
                                        group relative cursor-pointer
                                        font-sans text-sm text-stone-400
                                    "
                                >
                                    <input
                                        type="radio"
                                        name="subject"
                                        required
                                        value={option.value}
                                        checked={isSelected}
                                        onChange={(event) => {
                                            updateField("subject", event.target.value);
                                            setSubjectPreview(event.target.value);
                                        }}
                                        disabled={isSubmitting}
                                        className="peer sr-only"
                                    />

                                    <span
                                        className="
              transition-colors duration-300
                                            group-hover:text-stone-100
                                            peer-focus-visible:text-stone-100
                                            peer-checked:text-brand-gold
                                            peer-disabled:cursor-wait
                                            peer-disabled:opacity-50
                                        "
                                    >
                                        {option.label}
                                    </span>

                                    <span
                                        aria-hidden="true"
                                        className="
                                            absolute -bottom-2 left-0
                                            h-px w-full
                                            origin-left scale-x-0
                                            bg-brand-gold/70
                                            transition-transform duration-300
                                            peer-checked:scale-x-100
                                            "
                                    />
                                </label>
                            );
                        })}
                    </div>

                    <div
                        id="subject-description"
                        aria-live="polite"
                        className="
                            mt-5 min-h-[2.75rem]
                            max-w-lg
                            font-sans text-xs leading-5
                            text-stone-500
                            "
                    >
                        {(() => {
                            const activeValue = subjectPreview ?? formData.subject;

                            if (!activeValue) {
                                return (
                                    <span className="text-stone-600">
                                        {t("subjectHint")}
                                    </span>
                                );
                            }

                            const activeSubject = SUBJECTS.find(
                                (option) => option.value === activeValue
                            );

                            return activeSubject?.description ?? null;
                        })()}
                    </div>

                    {errors.subject && (
                        <p
                            id="subject-error"
                            className="mt-2 font-sans text-xs text-error"
                        >
                            {t(errors.subject)}
                        </p>
                    )}
                </fieldset>

                {/* Message */}
                <div>
                    <label
                        htmlFor="message"
                        className="
                            block font-sans text-[0.65rem] font-medium
                            uppercase tracking-[0.22em]
                            text-stone-500
                        "
                    >
                        {t("message")}
                    </label>

                    <textarea
                        id="message"
                        name="message"
                        maxLength={5000}
                        required
                        rows={3}
                        value={formData.message}
                        onChange={(event) =>
                            updateField("message", event.target.value)
                        }
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={
                            errors.message ? "message-error" : undefined
                        }
                        disabled={isSubmitting}
                        className="
                            mt-3 w-full resize-none
                            border-0 border-b
                            border-stone-700/70 bg-transparent
                            px-0 py-3
                            font-sans text-base leading-7
                            text-stone-100
                            outline-none
                            transition-colors duration-300
                            focus:border-brand-gold/60
                            disabled:cursor-wait disabled:opacity-50
                            "
                    />

                    {errors.message && (
                        <p
                            id="message-error"
                            className="mt-2 font-sans text-xs text-error"
                        >
                            {t(errors.message)}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-6 mb-4">
                <PrivacyConsentField
                    form="contact"
                    noticeId="contact-privacy-notice"
                    checked={consent}
                    disabled={isSubmitting}
                    error={errors.consent ? t(errors.consent) : undefined}
                    onChange={(checked) => {
                        setConsent(checked);
                        setErrors((current) => ({ ...current, consent: undefined }));
                        setStatus("idle");
                    }}
                />
            </div>

            {/* Feedback stays visible until the visitor starts another enquiry. */}
            <div
                ref={feedbackRef}
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="font-sans text-sm leading-6"
            >
                {status === "success" && (
                    <p className="mb-6 border-l border-brand-gold/50 pl-4 text-success">
                        {t("success")}
                    </p>
                )}

                {status === "rateLimited" && (
                    <p className="mb-6 text-error">
                        {t("rateLimited")}
                    </p>
                )}

                {status === "error" && (
                    <p className="mb-6 text-error">
                        {t("error")}
                    </p>
                )}
            </div>

            {/* Action */}
            <div
                className="
                    mt-1 flex flex-col gap-8
                    border-t border-stone-800/80
                    pt-6
                    sm:flex-row sm:items-end sm:justify-between
                    "
            >
                <Button
                    type="submit"
                    variant="outline"
                    disabled={isSubmitting || status === "success"}
                    className="group gap-5"
                >
                    <span>
                        {isSubmitting ? t("sending") : status === "success" ? t("sent") : t("send")}
                    </span>

                    {!isSubmitting && status !== "success" && (
                        <span
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                            →
                        </span>
                    )}
                </Button>

                <div className="font-sans text-xs leading-5 text-stone-600">
                    <p>{t("direct")}</p>
                    <p className="mt-1 text-stone-400">
                        <a href={`mailto:${legalContact.email}`} className="transition-colors hover:text-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold">
                            {legalContact.email}
                        </a>
                    </p>
                </div>
            </div>

        </form>
    );
}
