import { NextResponse } from "next/server";
import { Resend } from "resend";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { getFormPrivacy, resolveFormLocale } from "@/i18n/formPrivacyCopy";
import { readFormJson } from "@/shared/lib/server/readFormJson";

const resend = new Resend(process.env.RESEND_API_KEY);

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    analytics: false,
    prefix: "del-carmen:contact",
});

const SUBJECTS = ["artworks", "collaboration", "general"] as const;

type ContactPayload = {
    name?: unknown;
    email?: unknown;
    subject?: unknown;
    message?: unknown;
    contactField?: unknown;
    consent?: unknown;
    consentVersion?: unknown;
    locale?: unknown;
};

export async function POST(request: Request) {
    try {
        const payload = await readFormJson(request);
        if (!payload.ok) {
            return NextResponse.json({ error: payload.error, code: payload.code }, { status: payload.status });
        }
        const body: ContactPayload = payload.body;

        const forwardedFor = request.headers.get("x-forwarded-for");

        const ip =
            forwardedFor?.split(",")[0]?.trim() ||
            request.headers.get("x-real-ip") ||
            "unknown";

        const { success, limit, remaining, reset } =
            await ratelimit.limit(ip);

        if (!success) {
            return NextResponse.json(
                {
                    error: "Too many requests. Please try again later.",
                },
                {
                    status: 429,
                    headers: {
                        "X-RateLimit-Limit": limit.toString(),
                        "X-RateLimit-Remaining": remaining.toString(),
                        "X-RateLimit-Reset": reset.toString(),
                    },
                }
            );
        }

        const name =
            typeof body.name === "string" ? body.name.trim() : "";

        const email =
            typeof body.email === "string" ? body.email.trim() : "";

        const subject =
            typeof body.subject === "string" ? body.subject.trim() : "";

        const message =
            typeof body.message === "string" ? body.message.trim() : "";

        const contactField =
            typeof body.contactField === "string"
                ? body.contactField.trim()
                : "";

        // Honeypot: bots often populate hidden fields.
        if (contactField) {
            return NextResponse.json({ success: true });
        }

        const locale = resolveFormLocale(body.locale);
        if (!locale) return NextResponse.json({ error: "Invalid language.", code: "invalid_locale" }, { status: 400 });
        const privacy = getFormPrivacy(locale);

        if (!name || name.length > 100) {
            return NextResponse.json(
                { error: "Invalid name." },
                { status: 400 }
            );
        }

        if (
            !email ||
            email.length > 254 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            return NextResponse.json(
                { error: "Invalid email." },
                { status: 400 }
            );
        }

        if (
            !SUBJECTS.includes(
                subject as (typeof SUBJECTS)[number]
            )
        ) {
            return NextResponse.json(
                { error: "Invalid subject." },
                { status: 400 }
            );
        }

        if (!message || message.length > 5000) {
            return NextResponse.json(
                { error: "Invalid message." },
                { status: 400 }
            );
        }

        if (body.consent !== true) {
            return NextResponse.json(
                { error: "Consent is required to send this enquiry.", code: "consent_required" },
                { status: 400 },
            );
        }

        if (body.consentVersion !== privacy.version) {
            return NextResponse.json(
                { error: "Please reload the form and review the current privacy notice.", code: "consent_outdated" },
                { status: 400 },
            );
        }

        const consentAcceptedAt = new Date().toISOString();

        if (!process.env.CONTACT_EMAIL_TO) {
            console.error("CONTACT_EMAIL_TO is not configured.");

            return NextResponse.json(
                { error: "Contact service is not configured." },
                { status: 500 }
            );
        }

        const subjectLabel =
            subject === "artworks"
                ? "Artworks"
                : subject === "collaboration"
                    ? "Collaboration"
                    : "General";

        const { error } = await resend.emails.send({
            from: "Del Carmen <onboarding@resend.dev>",
            to: [process.env.CONTACT_EMAIL_TO],
            replyTo: email,
            subject: `[Del Carmen] ${subjectLabel} — ${name}`,
            text: [
                `Name: ${name}`,
                `Email: ${email}`,
                `Subject: ${subjectLabel}`,
                "",
                message,
                "",
                "--- Consent record ---",
                `Statement: ${privacy.contact.consentLabel}`,
                `Purpose: ${privacy.contact.purpose}`,
                `Notice version: ${privacy.version}`,
                `Consent language: ${locale}`,
                `Accepted at (server UTC): ${consentAcceptedAt}`,
                "Source: Contact form " + (locale === "es" ? "/es/contact" : "/contact"),
            ].join("\n"),
        });

        if (error) {
            console.error("Resend error:", error);

            return NextResponse.json(
                { error: "Message could not be delivered." },
                { status: 502 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact API error:", error);

        return NextResponse.json(
            { error: "Unexpected server error." },
            { status: 500 }
        );
    }
}
