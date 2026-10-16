// Increment this revision when the notice or consent wording changes. Preserve earlier wording in docs.
export const formPrivacy = {
    version: "2026-10-15.1",
    contact: {
        purpose: "contact-enquiry",
        summary: "Your details are used to receive and respond to your enquiry.",
        requiredSummary: "All four fields and consent are required to send this optional form.",
        collection: "Your name, email, subject and message are sent to the studio inbox through Resend. Upstash uses a request identifier for form protection.",
        requirement: "All four fields and your consent are needed to send this form. Providing them is voluntary; without them, the form cannot be sent. Sending a message does not subscribe you to the newsletter.",
        retention: "Ordinary closed enquiries are kept for up to 12 months after the last substantive exchange or closure, as applicable. Ongoing transactions and disputes are assessed separately.",
        consentLabel: "I consent to the use of these details to respond to my enquiry.",
    },
    newsletter: {
        purpose: "studio-newsletter",
        summary: "Your email is used to send occasional artwork, exhibition and studio updates after confirmation.",
        requiredSummary: "Email and consent are required. Subscribing is optional.",
        collection: "Your email, subscription source, consent record, dates and status are stored in Upstash. Resend delivers confirmation emails; Upstash also handles form protection.",
        requirement: "Your email and consent are needed to request a subscription. Providing them is voluntary; without them, you will not be subscribed. You must also confirm through the email link and can unsubscribe at any time.",
        retention: "Unconfirmed requests expire after 24 hours. Active records are reviewed annually. A minimal unsubscribe record expires after 30 days.",
        consentLabel: "I consent to receive artwork, exhibition and studio updates by email.",
    },
} as const;

export type PrivacyForm = "contact" | "newsletter";
