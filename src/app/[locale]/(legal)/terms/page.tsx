import EnglishContent from "@/i18n/EnglishContent";
import { activateLocale } from "@/i18n/server";
import type { Metadata } from "next";
import Link from "@/i18n/navigation";

import { brand } from "@/config/brand";
import { legalContact } from "@/config/legal";

export const metadata: Metadata = {
    title: "Terms of Use | Del Carmen",
    description: "Draft terms for viewing artwork, making enquiries and using the Del Carmen website.",
};

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  await activateLocale(params);
    return <EnglishContent>{(
        <article aria-labelledby="terms-title">
            <header>
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-gold">
                    Del Carmen · Legal
                </p>
                <h1 id="terms-title" className="mt-6 font-display text-5xl font-light leading-[1.02] md:text-7xl">
                    Terms of Use
                </h1>
                <p className="mt-8 max-w-2xl font-sans text-base font-light leading-8 text-white/65 md:text-lg">
                    Viewing the work, making enquiries and respecting the content of this digital space.
                </p>
                <p className="mt-8 border-l border-brand-gold/50 pl-4 font-sans text-xs leading-6 text-white/60">
                    Draft for review · 15 October 2026
                    <span className="block">These terms are being prepared for publication. Questions are welcome through our Contact page.</span>
                </p>
            </header>

            <section aria-labelledby="terms-experience">
                <h2 id="terms-experience">The experience</h2>
                <p>
                    Del Carmen Digital Experience is a space for discovering the work of Rolando Del Carmen,
                    reading editorial material and contacting the studio. These draft terms concern browsing and enquiries.
                </p>
            </section>

            <section aria-labelledby="terms-operator">
                <h2 id="terms-operator">Website operator</h2>
                <p>
                    The website is operated by {legalContact.responsibleName} as an individual.
                    The artistic and commercial identities used for this project are {brand.name} and {brand.parentBrand}.
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

            <section aria-labelledby="terms-images">
                <h2 id="terms-images">Artwork and digital presentation</h2>
                <p>
                    Photographs and digital displays can differ from the physical artwork in colour, scale and surface detail.
                    If you are considering an artwork, ask us to confirm its medium, dimensions, condition and availability.
                </p>
            </section>

            <section aria-labelledby="terms-rights">
                <h2 id="terms-rights">Content and permissions</h2>
                <p>
                    Artwork, photographs, film, text and other content may be protected by intellectual-property rights.
                    Rights in works by other artists remain with their respective rights holders.
                </p>
                <p>
                    Viewing the website does not grant a licence to reproduce, modify or commercially use its content
                    beyond what applicable law permits. Please <Link href="/contact">contact us</Link> about permission requests.
                </p>
            </section>

            <section aria-labelledby="terms-enquiries">
                <h2 id="terms-enquiries">Enquiries and future purchases</h2>
                <p>
                    A message about an artwork is an enquiry. Availability, the item being offered, its price,
                    payment and delivery arrangements need to be confirmed before an order is accepted.
                </p>
                <p>
                    A physical painting and a printed reproduction are different offerings. Where either is offered,
                    its description and any applicable edition or reproduction rights must be confirmed separately.
                </p>
                <p>
                    Sale, commission, shipping and return conditions will be specified for the relevant offering.
                    Any purchase or commission requires its own confirmed terms.
                </p>
            </section>

            <section aria-labelledby="terms-use">
                <h2 id="terms-use">Responsible use</h2>
                <p>
                    Please use the website and its forms respectfully. Do not submit spam, attempt unauthorised access
                    or interfere with the experience or its security controls.
                </p>
            </section>

            <section aria-labelledby="terms-privacy">
                <h2 id="terms-privacy">Privacy and external links</h2>
                <p>
                    Our <Link href="/privacy">Privacy Notice</Link> describes contact and newsletter information.
                    External websites and social platforms have their own terms and privacy practices.
                </p>
            </section>

            <section aria-labelledby="terms-contact">
                <h2 id="terms-contact">Questions</h2>
                <p>
                    For questions about the website, artwork or permissions, please email{" "}
                    <a href={`mailto:${legalContact.email}`}>{legalContact.email}</a> or use our <Link href="/contact">Contact page</Link>.
                </p>
            </section>
        </article>
    )}</EnglishContent>;
}
