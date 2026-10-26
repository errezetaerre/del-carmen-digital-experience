import { NextResponse } from "next/server";
import { Resend } from "resend";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getContactMailSettings, getRedisSettings, logMailConfigurationError } from "@/config/mail";
import { getFormPrivacy, resolveFormLocale } from "@/i18n/formPrivacyCopy";
import { readFormJson } from "@/shared/lib/server/readFormJson";

const SUBJECTS = ["artworks", "collaboration", "general"] as const;
const SUBJECT_LABELS = {
    en: { artworks: "Artworks Inquiry", collaboration: "Collaboration Inquiry", general: "General Inquiry" },
    es: { artworks: "Consulta sobre obras", collaboration: "Consulta de colaboración", general: "Consulta general" },
} as const;

export async function POST(request: Request) {
    const payload = await readFormJson(request);
    if (!payload.ok) return NextResponse.json({ error: payload.error, code: payload.code }, { status: payload.status });
    const body = payload.body;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const honeypot = typeof body.contactField === "string" ? body.contactField.trim() : "";
    if (honeypot) return NextResponse.json({ success: true });
    const locale = resolveFormLocale(body.locale);
    if (!locale) return NextResponse.json({ error: "Invalid language.", code: "invalid_locale" }, { status: 400 });
    const privacy = getFormPrivacy(locale);
    if (!name || name.length > 100 || /[\r\n]/.test(name)) return NextResponse.json({ error: "Invalid name." }, { status: 400 });
    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    if (!SUBJECTS.includes(subject as (typeof SUBJECTS)[number])) return NextResponse.json({ error: "Invalid subject." }, { status: 400 });
    if (!message || message.length > 5000) return NextResponse.json({ error: "Invalid message." }, { status: 400 });
    if (body.consent !== true) return NextResponse.json({ error: "Consent is required to send this enquiry.", code: "consent_required" }, { status: 400 });
    if (body.consentVersion !== privacy.version) return NextResponse.json({ error: "Please reload the form and review the current privacy notice.", code: "consent_outdated" }, { status: 400 });

    // Construct clients only after validating the request. A missing mail
    // configuration must not break the page build or create a subscription.
    let settings: ReturnType<typeof getContactMailSettings>;
    let redis: Redis;
    try {
        settings = getContactMailSettings();
        redis = new Redis(getRedisSettings());
    } catch (error) {
        logMailConfigurationError("Contact", error);
        return NextResponse.json({ error: "Contact service is temporarily unavailable." }, { status: 503 });
    }
    const ratelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "10 m"), analytics: false, prefix: "del-carmen:contact" });
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    try {
        const { success, limit, remaining, reset } = await ratelimit.limit(ip);
        if (!success) return NextResponse.json({ error: "Too many requests. Please try again later." }, {
            status: 429, headers: { "X-RateLimit-Limit": String(limit), "X-RateLimit-Remaining": String(remaining), "X-RateLimit-Reset": String(reset) },
        });
        const subjectLabel = SUBJECT_LABELS[locale][subject as (typeof SUBJECTS)[number]];
        const { error } = await new Resend(settings.apiKey).emails.send({
            from: settings.from,
            to: [settings.to],
            replyTo: email,
            subject: `[Rolando Del Carmen] ${subjectLabel} — ${name}`,
            text: [
                `Name: ${name}`, `Email: ${email}`, `Subject: ${subjectLabel}`, "", message, "",
                "--- Consent record ---",
                `Statement: ${privacy.contact.consentLabel}`, `Purpose: ${privacy.contact.purpose}`,
                `Notice version: ${privacy.version}`, `Consent language: ${locale}`,
                `Accepted at (server UTC): ${new Date().toISOString()}`,
                "Source: Contact form " + (locale === "es" ? "/es/contact" : "/contact"),
            ].join("\n"),
        });
        if (error) {
            console.error("Contact: email provider rejected delivery.");
            return NextResponse.json({ error: "Message could not be delivered." }, { status: 502 });
        }
        return NextResponse.json({ success: true });
    } catch {
        console.error("Contact: service request failed.");
        return NextResponse.json({ error: "Contact service is temporarily unavailable." }, { status: 503 });
    }
}
