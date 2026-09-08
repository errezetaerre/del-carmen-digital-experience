"use client";

import { Button } from "@/shared/ui/button";

import { FormEvent, useEffect, useState } from "react";

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

type FormErrors = Partial<Record<keyof FormData, string>>;

const INITIAL_FORM: FormData = {
    name: "",
    email: "",
    subject: "",
    message: "",
};

const SUBJECTS = [
    {
        value: "artworks",
        label: "Artworks",
        description:
            "Questions about original works, availability, collecting or commissions.",
    },
    {
        value: "collaboration",
        label: "Collaboration",
        description:
            "Exhibitions, creative partnerships, editorial projects or professional proposals.",
    },
    {
        value: "general",
        label: "General",
        description:
            "Questions or messages that do not fit the categories above.",
    },
] as const;

export default function ContactForm() {
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
    const [errors, setErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<FormStatus>("idle");
    const [contactField, setContactField] = useState("");
    const [subjectPreview, setSubjectPreview] = useState<string | null>(null);

    useEffect(() => {
        if (status !== "success") {
            return;
        }

        const timeout = window.setTimeout(() => {
            setStatus("idle");
        }, 5000);

        return () => {
            window.clearTimeout(timeout);
        };
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
            nextErrors.name = "Please enter your name.";
        }

        if (!formData.email.trim()) {
            nextErrors.email = "Please enter your email.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
        ) {
            nextErrors.email = "Please enter a valid email address.";
        }

        if (!formData.subject) {
            nextErrors.subject = "Please select a subject.";
        }

        if (!formData.message.trim()) {
            nextErrors.message = "Please enter your message.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
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
                }),
            });

            if (response.status === 429) {
                setStatus("rateLimited");
                return;
            }

            if (!response.ok) {
                throw new Error("Request failed.");
            }


            setStatus("success");
            setFormData(INITIAL_FORM);
            setContactField("")
            setErrors({});
        } catch (error) {
            console.error("Contact form error:", error);
            setStatus("error");
        }
    };

    const isSubmitting = status === "submitting";

    return (
        <form
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
                    Website
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
                        Your name
                    </label>

                    <input
                        id="name"
                        name="name"
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
                            {errors.name}
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
                        Email
                    </label>

                    <input
                        id="email"
                        name="email"
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
                            {errors.email}
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
                        I&apos;m writing about
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
                                        Choose the option that best matches your reason for writing.
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
                            {errors.subject}
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
                        Message
                    </label>

                    <textarea
                        id="message"
                        name="message"
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
                            {errors.message}
                        </p>
                    )}
                </div>
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
                    disabled={isSubmitting}
                    className="group gap-5"
                >
                    <span>
                        {isSubmitting ? "Sending..." : "Send message"}
                    </span>

                    {!isSubmitting && (
                        <span
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                            →
                        </span>
                    )}
                </Button>

                <div className="font-sans text-xs leading-5 text-stone-600">
                    <p>For direct correspondence</p>
                    <p className="mt-1 text-stone-400">
                        rolando@delcarmen.art
                    </p>
                </div>
            </div>

            {/* Form feedback */}
            <div
                aria-live="polite"
                className="min-h-8 pt-5 font-sans text-sm"
            >
                {status === "success" && (
                    <p className="text-success">
                        Thank you. Your message has been received.
                    </p>
                )}

                {status === "rateLimited" && (
                    <p className="text-error">
                        Too many messages have been sent. Please wait a few minutes before trying again.
                    </p>
                )}

                {status === "error" && (
                    <p className="text-error">
                        Your message could not be sent. Please try again.
                    </p>
                )}
            </div>
        </form>
    );
}