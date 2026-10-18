import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "@/i18n/navigation";

import { Container } from "@/shared/layout";
import Footer from "@/shared/layout/footer";

// These documents remain drafts until the operator details and text are reviewed.
export const metadata: Metadata = {
    robots: {
        index: false,
        follow: true,
    },
};

export default function LegalLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <main lang="en" className="relative w-full min-w-0 overflow-x-clip bg-background text-white">
                <Container className="pb-20 pt-36 md:pb-28 md:pt-44">
                    <div className="mx-auto max-w-3xl">
                        <Link
                            href="/"
                            className="inline-flex font-sans text-[10px] uppercase tracking-[0.24em] text-white/50 transition-colors hover:text-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
                        >
                            ← Back to Home
                        </Link>

                        <div
                            className="
                                mt-12 md:mt-16
                                [&_article_section]:mt-10
                                [&_article_section_h2]:mb-4
                                [&_article_section_h2]:font-display
                                [&_article_section_h2]:text-3xl
                                [&_article_section_h2]:font-light
                                [&_article_section_h2]:leading-tight
                                [&_article_section_h2]:text-white/90
                                [&_article_section_p]:font-sans
                                [&_article_section_p]:text-sm
                                [&_article_section_p]:font-light
                                [&_article_section_p]:leading-7
                                [&_article_section_p]:text-white/65
                                md:[&_article_section_p]:text-base
                                md:[&_article_section_p]:leading-8
                                [&_article_section_p+p]:mt-4
                                [&_article_section_ul]:mt-4
                                [&_article_section_ul]:list-disc
                                [&_article_section_ul]:space-y-3
                                [&_article_section_ul]:pl-5
                                [&_article_section_ul]:font-sans
                                [&_article_section_ul]:text-sm
                                [&_article_section_ul]:font-light
                                [&_article_section_ul]:leading-7
                                [&_article_section_ul]:text-white/65
                                md:[&_article_section_ul]:text-base
                                [&_article_a]:text-brand-gold
                                [&_article_a]:underline
                                [&_article_a]:underline-offset-4
                                [&_article_a:hover]:text-white
                                [&_article_a:focus-visible]:outline
                                [&_article_a:focus-visible]:outline-2
                                [&_article_a:focus-visible]:outline-offset-4
                                [&_article_a:focus-visible]:outline-brand-gold
                            "
                        >
                            {children}
                        </div>

                        <nav
                            aria-label="Legal and contact pages"
                            className="mt-16 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-8 font-sans text-[10px] uppercase tracking-[0.2em] text-white/55 [&_a]:transition-colors [&_a:hover]:text-brand-gold [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-brand-gold"
                        >
                            <Link href="/privacy">Privacy</Link>
                            <Link href="/terms">Terms</Link>
                            <Link href="/contact">Contact</Link>
                        </nav>
                    </div>
                </Container>
            </main>
            <Footer />
        </>
    );
}
