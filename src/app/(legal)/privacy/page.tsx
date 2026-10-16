import type { Metadata } from "next";
import Link from "next/link";

import { brand } from "@/config/brand";
import { legalContact } from "@/config/legal";

export const metadata: Metadata = {
    title: "Privacy Notice | Del Carmen",
    description: "A draft notice about contact enquiries, newsletter subscriptions and personal data at Del Carmen.",
};

export default function PrivacyPage() {
    return (
        <article aria-labelledby="privacy-title">
            <header>
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-gold">
                    Del Carmen · Legal
                </p>
                <h1 id="privacy-title" className="mt-6 font-display text-5xl font-light leading-[1.02] md:text-7xl">
                    Privacy Notice
                </h1>
                <p className="mt-8 max-w-2xl font-sans text-base font-light leading-8 text-white/65 md:text-lg">
                    Information about the details you share when you contact us or subscribe to studio updates.
                </p>
                <p className="mt-8 border-l border-brand-gold/50 pl-4 font-sans text-xs leading-6 text-white/60">
                    Draft for review · 15 October 2026
                    <span className="block">This notice is being prepared for publication. For questions about your personal data, please contact us.</span>
                </p>
            </header>

            <section aria-labelledby="privacy-about">
                <h2 id="privacy-about">About this notice</h2>
                <p>
                    Del Carmen Digital Experience presents the work of Rolando Del Carmen under {brand.name} and {brand.parentBrand}.
                    This draft describes the contact and newsletter features of the website.
                </p>
            </section>

            <section aria-labelledby="privacy-responsible">
                <h2 id="privacy-responsible">Who is responsible</h2>
                <p>
                    {legalContact.responsibleName} is the individual responsible for the contact and newsletter
                    information described in this notice. {brand.name} and {brand.parentBrand} are the project&apos;s artistic and commercial identities.
                </p>
                <address className="mt-5 not-italic">
                    <p>
                        {legalContact.addressLines.map((line) => (
                            <span key={line} className="block">{line}</span>
                        ))}
                    </p>
                    <p>
                        <a href={`mailto:${legalContact.email}`}>{legalContact.email}</a>
                    </p>
                </address>
            </section>

            <section aria-labelledby="privacy-information">
                <h2 id="privacy-information">Information you share</h2>
                <ul>
                    <li>Contact enquiries: your name, email address, enquiry topic and message.</li>
                    <li>Newsletter requests: your email address, subscription source, request and confirmation dates, and subscription status.</li>
                    <li>Consent records: the statement you agree to, its version and the date of your request, kept with the corresponding enquiry or subscription.</li>
                    <li>Form protection: an IP address or request identifier is used to limit repeated requests and protect the forms from abuse.</li>
                </ul>
                <p className="mt-4">
                    Both forms are voluntary. Contact requires your name, email, subject, message and consent;
                    Newsletter requires your email and consent. Without the required details and consent, the requested
                    form cannot be processed. You can browse the artwork without completing either form.
                </p>
            </section>

            <section aria-labelledby="privacy-consent">
                <h2 id="privacy-consent">Your consent and choices</h2>
                <p>
                    Each form explains its purpose before asking for your details and includes a consent checkbox
                    that starts unselected. Consent to an enquiry covers responding to that enquiry; newsletter consent
                    covers occasional artwork, exhibition and studio updates. A newsletter request still requires email
                    confirmation before the subscription becomes active.
                </p>
                <p>
                    You can withdraw consent or ask us about your information by emailing{" "}
                    <a href={`mailto:${legalContact.email}`}>{legalContact.email}</a>.
                    Consent records follow the retention period of the corresponding enquiry or subscription.
                </p>
            </section>

            <section aria-labelledby="privacy-purpose">
                <h2 id="privacy-purpose">How the information is used</h2>
                <p>
                    Contact details and messages are used to receive and respond to your enquiry.
                    Newsletter details are used to confirm and manage your subscription.
                    Request identifiers help protect the contact and newsletter forms.
                </p>
                <p>Sending a contact enquiry does not subscribe you to the newsletter.</p>
            </section>

            <section aria-labelledby="privacy-retention">
                <h2 id="privacy-retention">Contact enquiries and retention</h2>
                <p>
                    Ordinary closed enquiries are kept for up to 12 months after the last substantive exchange or closure,
                    as applicable. Correspondence needed for an ongoing transaction, accounting requirement or dispute is
                    assessed separately. A valid personal-data request is handled independently of these routine retention periods.
                </p>
                <p>
                    These periods concern the records we manage. Email-service and infrastructure providers may retain
                    separate copies under their applicable terms; contact us if you need information about a specific record.
                </p>
            </section>

            <section aria-labelledby="privacy-providers">
                <h2 id="privacy-providers">Services involved</h2>
                <p>
                    Email delivery uses Resend. Newsletter records and form-protection controls use Upstash.
                    These providers process information under their respective service and data-processing terms.
                </p>
                <p>
                    You can read the <a href="https://resend.com/legal/privacy-policy">Resend privacy policy</a> and the{" "}
                    <a href="https://upstash.com/trust/privacy.pdf">Upstash privacy policy</a> for information about their services.
                    Contact us if you have questions about processing locations or recipients of your information.
                </p>
            </section>

            <section aria-labelledby="privacy-newsletter">
                <h2 id="privacy-newsletter">Newsletter choices and records</h2>
                <p>
                    A subscription becomes active after email confirmation. An unconfirmed request and its confirmation
                    link expire after 24 hours from the latest valid request. A new request requires a new confirmation.
                </p>
                <p>
                    We keep active subscription details while the subscription and its purpose continue, with an annual
                    review of whether they are still needed. Unsubscribing immediately removes the address from the active list.
                    We retain only the email address, unsubscribe date and status for up to 30 days to resolve unsubscribe
                    incidents; that record then expires. Unsubscribing and requesting deletion are separate actions.
                </p>
                <p>
                    To withdraw a subscription or ask about an existing record, email{" "}
                    <a href={`mailto:${legalContact.email}`}>{legalContact.email}</a> or use our <Link href="/contact">Contact page</Link>.
                </p>
            </section>

            <section aria-labelledby="privacy-requests">
                <h2 id="privacy-requests">Questions and personal-data requests</h2>
                <p>
                    You can contact us about access to your information, correction, deletion or withdrawal of consent.
                    Tell us which request you would like us to review. We may need to confirm that the request concerns your own information.
                </p>
                <p>
                    Please email <a href={`mailto:${legalContact.email}`}>{legalContact.email}</a> or use the{" "}
                    <Link href="/contact">Contact page</Link> for these enquiries.
                </p>
            </section>

            <section aria-labelledby="privacy-links">
                <h2 id="privacy-links">External websites</h2>
                <p>
                    Links to social platforms and other websites lead to services with their own privacy practices.
                    Review their notices when you choose to visit them.
                </p>
            </section>
        </article>
    );
}
