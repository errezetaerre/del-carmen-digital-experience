import { Container } from "@/shared/layout/container";
import TheArtistMotion from "./TheArtistMotion";

export default function TheArtist() {
    return (
        <section
            id="the-artist"
            className="
                relative
                overflow-hidden
                bg-neutral-950
                pb-28
                pt-18

                md:pb-36
                md:pt-24

                lg:pb-44
                lg:pt-24

                xl:pb-52
                xl:pt-28
            "
            aria-labelledby="the-artist-title"
        >
            <Container>
                <div
                    data-the-artist-divider
                    className="
                        the-artist-motion
                        relative
                        h-px
                        w-full
                        overflow-hidden

                        mb-24
                        md:mb-24
                        lg:mb-28
                    "
                    aria-hidden="true"
                >
                    <div
                        className="
                            absolute inset-0
                            bg-gradient-to-r
                            from-transparent
                            via-brand-gold/40
                            to-transparent
                        "
                    />

                    <div
                        className="
                            absolute
                            left-1/2
                            top-1/2
                            h-[3px]
                            w-20
                            -translate-x-1/2
                            -translate-y-1/2
                            bg-brand-gold/15
                            blur-sm
                        "
                    />
                </div>
                <div
                    className="
                        grid
                        gap-14

                        md:grid-cols-12
                        md:gap-x-8

                        lg:gap-x-12
                    "
                >
                    {/* =============================================
                        INTRO / EDITORIAL ANCHOR
                    ============================================== */}

                    <header
                        className="
                            md:col-span-4
                            lg:col-span-4
                        "
                    >
                        <div
                            data-the-artist-eyebrow
                            className="
                            the-artist-motion 
                            flex items-center gap-4">
                            <p
                                className="
                                    font-sans
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-[0.25em]
                                    text-[#F5EFE6]/50
                                "
                            >
                                The Artist
                            </p>

                            <span
                                className="h-px w-10 bg-brand-gold/50"
                                aria-hidden="true"
                            />
                        </div>

                        <h2
                            id="the-artist-title"
                            className="
                                mt-7
                                max-w-[9ch]
                                font-display
                                text-4xl
                                font-light
                                leading-[0.98]
                                tracking-[0.01em]
                                text-[#F5EFE6]

                                md:text-5xl

                                lg:text-6xl

                                xl:text-7xl
                            "
                        >
                            <span
                                data-the-artist-title-line
                                className="the-artist-motion block"
                            >
                                Long before painting
                            </span>

                            <span
                                data-the-artist-title-line
                                className="the-artist-motion block"
                            >
                                became a practice,
                            </span>

                            <span
                                data-the-artist-title-line
                                className="the-artist-motion block"
                            >
                                there was{" "}
                                <span className="text-brand-gold">
                                    observation.
                                </span>
                            </span>
                        </h2>
                    </header>

                    {/* =============================================
                        NARRATIVE
                    ============================================== */}

                    <div
                        className="
                            md:col-span-7
                            md:col-start-6

                            lg:col-span-6
                            lg:col-start-7
                        "
                    >
                        <div
                            className="
                                max-w-[42rem]
                                space-y-7
                                font-sans
                                text-[0.98rem]
                                font-light
                                leading-[1.85]
                                text-[#F5EFE6]/68

                                md:text-base

                                lg:space-y-8
                                lg:text-[1.05rem]
                                lg:leading-[1.9]
                            "
                        >
                            <p
                                data-the-artist-paragraph
                                className="the-artist-motion"
                            >
                                Growing up in El Carmen, Puntarenas, Costa Rica,
                                Rolando Rojas would sit on a bench facing the sea
                                and draw palm trees, boats and sunsets. At the
                                time, drawing was simply curiosity — a quiet
                                fascination with the world and with those who
                                seemed naturally capable of translating it onto
                                paper.
                            </p>

                            <p
                                data-the-artist-paragraph
                                className="the-artist-motion"
                            >
                                For many years, that fascination remained
                                dormant. His professional path led instead
                                toward computer science, programming and
                                eventually digital design. Yet through
                                multimedia, animation, color and composition,
                                the visual world quietly returned. What appeared
                                to be a different path was already shaping
                                another way of seeing.
                            </p>

                            <p
                                data-the-artist-paragraph
                                className="the-artist-motion"
                            >
                                It was not until adulthood that drawing
                                re-entered his life with intention. An interest
                                in the intricate illustrations of Johanna
                                Basford led him to pen-and-ink work and to a
                                short course that would become unexpectedly
                                decisive. After only a few weeks, his teacher
                                recognized a progression he had never imagined
                                in himself and encouraged him to continue.
                            </p>

                            <p
                                data-the-artist-highlight
                                className="
                                    the-artist-motion
                                    font-display
                                    text-2xl
                                    font-normal
                                    leading-[1.35]
                                    text-[#F5EFE6]/90

                                    md:text-[1.7rem]

                                    lg:my-12
                                    lg:text-[2rem]
                                    lg:leading-[1.3]
                                "
                            >
                                That encounter changed the question. It was no
                                longer whether he had been born knowing how to
                                draw, but how far curiosity, discipline and time
                                might take him.
                            </p>

                            <p
                                data-the-artist-paragraph
                                className="the-artist-motion"
                            >
                                The search eventually led to academic realism
                                and to Atelier del Sol in San José, where he
                                trained under Emilia Cantor and immersed himself
                                in drawing and painting methods rooted in the
                                academic tradition. He later graduated as an
                                academic painter — not as the conclusion of a
                                journey, but as the foundation for a more
                                personal one.
                            </p>

                            <p
                                data-the-artist-paragraph
                                className="the-artist-motion"
                            >
                                Today, his practice exists between discipline
                                and discovery: between everything technique can
                                teach and everything that can only emerge
                                through experience.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
            <TheArtistMotion />
        </section>
    );
}