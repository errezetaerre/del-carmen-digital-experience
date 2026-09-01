import Image from "next/image";
import LinkButton from "@/shared/ui/button/LinkButton";
import { Container } from "@/shared/layout/container/Container";
import TheWorkMotion from "./TheWorkMotion";

export default function TheWork() {
    return (
        <section
            id="the-work"
            aria-labelledby="the-work-title"
            className="
                relative
                overflow-hidden
                bg-neutral-950
                pb-32
                pt-28

                md:pb-40
                md:pt-36

                lg:pb-52
                lg:pt-10
            "
        >
            <Container>
                <div
                    className="
                        grid
                        grid-cols-1
                        gap-16

                        lg:grid-cols-12
                        lg:items-center
                        lg:gap-x-8
                    "
                >
                    {/* =========================================
                        TEXT
                    ========================================== */}

                    <div
                        className="
                            relative
                            z-10
                            lg:col-span-5
                        "
                    >
                        <p
                            data-work-eyebrow
                            className="
                                font-sans
                                text-[0.65rem]
                                font-medium
                                uppercase
                                tracking-[0.28em]
                                text-brand-gold/70
                            "
                        >
                            The Work
                        </p>

                        <h2
                            data-work-title
                            id="the-work-title"
                            className="
                                mt-8
                                max-w-[10ch]

                                font-display
                                text-[3rem]
                                font-normal
                                leading-[0.98]
                                tracking-[-0.025em]
                                text-[#F5EFE6]

                                sm:text-[3.8rem]
                                md:text-[4.5rem]
                                lg:text-[5rem]
                                xl:text-[5.6rem]
                            "
                        >
                            The journey continues
                            <span className="block text-brand-gold">
                                on the canvas.
                            </span>
                        </h2>

                        <div
                            className="
                                mt-12
                                max-w-[34rem]
                                space-y-7

                                font-sans
                                text-[0.98rem]
                                font-light
                                leading-[1.9]
                                text-[#F5EFE6]/62

                                md:text-base
                            "
                        >
                            <p data-work-copy>
                                Every painting carries something from
                                what came before — observation, memory,
                                discipline, questions — while opening
                                the possibility of something not yet
                                discovered.
                            </p>

                            <p data-work-copy>
                                The story of the artist is only one way
                                into the work.
                            </p>

                            <p data-work-copy>
                                The rest belongs to the encounter between
                                the painting and the viewer.
                            </p>
                        </div>

                        <div
                            data-work-cta
                            className="mt-12">
                            <LinkButton
                                href="/artworks"
                                variant="bronzeUnderline"
                            >
                                Explore the Works
                            </LinkButton>
                        </div>
                    </div>

                    {/* =========================================
                        ARTWORK DETAIL
                    ========================================== */}

                    <div
                        className="
                            relative
                            lg:col-span-6
                            lg:col-start-7
                        "
                    >
                        <div
                            data-work-artwork
                            className="
                                relative
                                mx-auto
                                aspect-[4/5]
                                w-[82%]
                                max-w-[34rem]

                                overflow-hidden

                                lg:ml-auto
                                lg:mr-0
                            "
                        >
                            <Image
                                src="/artworks/epifania_nupcial_hero_portrait.png"
                                alt="Detail from Epifanía Nupcial"
                                fill
                                sizes="
                                    (max-width: 1024px) 82vw,
                                    42vw
                                "
                                className="
                                    object-cover
                                    object-center
                                    scale-[1.22]
                                "
                            />

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-0
                                    bg-gradient-to-r
                                    from-neutral-950/30
                                    via-transparent
                                    to-transparent
                                "
                                aria-hidden="true"
                            />

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-x-0
                                    bottom-0
                                    h-[28%]
                                    bg-gradient-to-t
                                    from-neutral-950
                                    to-transparent
                                "
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                </div>
            </Container>
            <TheWorkMotion />
        </section>
    );
}