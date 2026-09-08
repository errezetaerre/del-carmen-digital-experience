"use client";

import {
    FormEvent,
    useEffect,
    useState,
} from "react";

import { useSearchParams } from "next/navigation";

import { Button } from "@/shared/ui/button";

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

export default function NewsletterForm() {
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [contactField, setContactField] = useState("");
    const [status, setStatus] =
        useState<NewsletterStatus>("idle");

    const isSubmitting = status === "submitting";

    /*
     * ======================================================
     * URL FEEDBACK
     * ======================================================
     */

    useEffect(() => {
        const result = searchParams.get("newsletter");

        if (result === "success") {
            setStatus("confirmed");
        }

        if (result === "invalid") {
            setStatus("invalidConfirmation");
        }

        if (result === "unsubscribed") {
            setStatus("unsubscribed");
        }

        if (result === "invalid-unsubscribe") {
            setStatus("invalidUnsubscribe");
        }
    }, [searchParams]);

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
                setStatus("error");
                return;
            }

            setEmail("");
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
                    Website
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

            <div
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-xl
                    flex-col
                    gap-5
                    sm:flex-row
                    sm:items-end
                "
            >
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
                        Email
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
                        placeholder="you@example.com"
                    />
                </div>

                <Button
                    type="submit"
                    variant="outline"
                    disabled={isSubmitting}
                    className="group shrink-0 gap-5"
                >
                    <span>
                        {isSubmitting
                            ? "Subscribing..."
                            : "Subscribe"}
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
                        Occasional notes about new works,
                        exhibitions and studio updates. You
                        can unsubscribe at any time.
                    </p>
                )}

                {status === "pendingConfirmation" && (
                    <p className="text-success">
                        Check your inbox to confirm your
                        subscription.
                    </p>
                )}

                {status === "confirmed" && (
                    <p className="text-success">
                        Your subscription is confirmed.
                        Welcome to the journey.
                    </p>
                )}

                {status === "unsubscribed" && (
                    <p className="text-success">
                        You&apos;ve been unsubscribed
                        successfully.
                    </p>
                )}

                {status === "invalidConfirmation" && (
                    <p className="text-error">
                        This confirmation link is invalid or
                        has expired.
                    </p>
                )}

                {status === "invalidUnsubscribe" && (
                    <p className="text-error">
                        This unsubscribe link is invalid or
                        no longer available.
                    </p>
                )}

                {status === "alreadySubscribed" && (
                    <p className="text-brand-gold">
                        This email is already subscribed.
                    </p>
                )}

                {status === "error" && (
                    <p className="text-error">
                        Something went wrong. Please try
                        again.
                    </p>
                )}

                {status === "rateLimited" && (
                    <p className="text-error">
                        Too many attempts. Please wait a few
                        minutes before trying again.
                    </p>
                )}
            </div>
        </form>
    );
}