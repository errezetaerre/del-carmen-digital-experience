import { Container } from "@/shared/layout/container";
import ContactForm from "./ContactForm";
import ContactMotion from "./ContactMotion";

export default function ContactExperience() {
    return (
        <section className="contact-motion relative min-h-[calc(100svh-5rem)] overflow-hidden">
            <ContactMotion />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute inset-0
                    bg-[radial-gradient(circle_at_72%_38%,rgba(180,145,82,0.055),transparent_32%)]
                "
            />

            <Container className="relative z-10">
                <div
                    className="
                    grid min-h-[calc(100svh-5rem)]
                    grid-cols-1 gap-y-16
                    py-16 md:py-20
                    lg:grid-cols-12 lg:items-start lg:gap-x-12 lg:py-16
                    xl:py-20
          "
                >
                    <header className="lg:col-span-5 lg:pr-8 lg:pt-28 xl:pt-32">
                        <p
                            className="
                                contact-eyebrow
                                font-sans text-[0.68rem] font-medium
                                uppercase tracking-[0.28em]
                                text-brand-gold/65
                            "
                        >
                            Contact
                        </p>

                        <h1
                            className="
                                mt-7 max-w-[9ch]
                                font-display
                                text-[clamp(3.4rem,7vw,6.8rem)]
                                font-light leading-[0.88]
                                tracking-[-0.045em]
                                text-stone-100
                            "
                        >
                            <span className="contact-title-line-1 block">
                                Begin a
                            </span>

                            <span className="contact-title-line-2 block italic text-stone-300">
                                conversation.
                            </span>
                        </h1>

                        <p
                            className="
                                contact-intro
                                mt-8 max-w-md
                                font-sans text-sm leading-7
                                text-stone-400
                                md:text-[0.95rem]
                            "
                        >
                            Whether you are interested in an artwork, a collaboration,
                            or simply wish to connect, you are welcome to write.
                        </p>
                    </header>

                    <div className="contact-form-motion lg:col-span-6 lg:col-start-7">
                        <ContactForm />
                    </div>
                </div>
            </Container>
        </section>
    );
}