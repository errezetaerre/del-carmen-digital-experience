import Image from "next/image";
import { Container } from "@/shared/layout/container";

import ArtistHeroMotion from "./ArtistHeroMotion";

export default function ArtistHero() {
    return (
        <section
            id="artist-hero"
            className="relative min-h-[100svh] overflow-hidden bg-neutral-950"
            aria-labelledby="artist-hero-title"
        >
            {/* =====================================================
                MEDIA
            ====================================================== */}

            <div
                data-artist-hero-media
                className="artist-hero-motion absolute inset-0 bg-neutral-950">
                {/* Mobile Portrait */}
                <Image
                    src="/artist/hero/rolando_epifania_portrait.png"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="
                        object-cover
                        md:hidden
                        landscape:hidden
                    "
                    aria-hidden="true"
                />

                {/* Mobile Landscape */}
                <Image
                    src="/artist/hero/rolando_epifania_landscape.png"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="
                        hidden
                        object-cover
                        object-center
                        landscape:block
                        md:hidden
                    "
                    aria-hidden="true"
                />

                {/* Tablet / Desktop */}
                <Image
                    src="/artist/hero/rolando_epifania_landscape.png"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="
                    hidden
                        object-cover
                        object-[center_42%]
                        md:block
                    "
                    aria-hidden="true"
                />
            </div>

            {/* =====================================================
                ATMOSPHERIC SUPPORT
            ====================================================== */}

            <div
                className="
                    pointer-events-none
                    absolute inset-0

                    bg-gradient-to-t
                    from-neutral-950/55
                    via-transparent
                    to-neutral-950/10

                    landscape:bg-gradient-to-r
                    landscape:from-neutral-950/70
                    landscape:via-neutral-950/20
                    landscape:to-transparent

                    md:bg-gradient-to-r
                    md:from-neutral-950/55
                    md:via-neutral-950/10
                    md:to-transparent
                "
                aria-hidden="true"
            />

            {/* =====================================================
                CONTENT
            ====================================================== */}

            <Container className="relative z-10 min-h-[100svh]">
                <div
                    className="
                        flex min-h-[100svh] flex-col

                        pb-8
                        pt-24

                        landscape:justify-center
                        landscape:py-14

                        md:justify-center
                        md:py-28

                        lg:py-24
                    "
                >
                    <div
                        className="
                            mt-auto
                            max-w-[21rem]

                            landscape:mt-0
                            landscape:w-[45%]
                            landscape:max-w-[20rem]

                            md:mt-0
                            md:w-[48%]
                            md:max-w-[38rem]

                            lg:w-[50%]
                            lg:max-w-[44rem]
                            lg:-translate-y-4

                            xl:w-[52%]
                            xl:max-w-[48rem]

                            [@media(min-width:1400px)_and_(min-height:650px)]:-translate-y-0
                        "
                    >
                        {/* =================================================
                            EYEBROW
                        ================================================== */}

                        <div
                            data-artist-hero-eyebrow
                            className="
                                artist-hero-motion
                                mb-4
                                flex items-center
                                gap-4

                                landscape:mb-3

                                md:mb-

                                lg:mb-7
                            "
                        >
                            <p
                                className="
                                    font-sans
                                    text-[0.62rem]
                                    font-medium
                                    uppercase
                                    tracking-[0.25em]
                                    text-[#F5EFE6]/60

                                    landscape:text-[0.56rem]

                                    md:text-xs

                                    lg:text-[0.72rem]
                                "
                            >
                                The Artist
                            </p>

                            <span
                                className="
                                    h-px
                                    w-9
                                    bg-brand-gold/60

                                    landscape:w-8

                                    md:w-10

                                    lg:w-12
                                "
                                aria-hidden="true"
                            />
                        </div>

                        {/* =================================================
                            ARTIST NAME
                        ================================================== */}

                        <p
                            data-artist-hero-name
                            className="
                                artist-hero-motion
                                mb-4
                                font-display
                                text-[2.9rem]
                                font-light
                                uppercase
                                leading-[0.88]
                                tracking-[0.04em]
                                text-[#F5EFE6]

                                landscape:mb-3
                                landscape:text-5xl
                                

                                md:mb-7
                                md:text-7xl

                                lg:mb-8
                                lg:text-[8.5rem]

                                xl:text-[9.75rem]

                                2xl:text-[12.5rem]

                                [@media(orientation:landscape)_and_(max-width:144px)_and_(max-height:785px)]:text-8xl
                                [@media(min-width:900px)_and_(min-height:650px)]:text-[5.5rem]                                
                                [@media(min-width:700px)_and_(min-height:650px)]:text-[5rem]                                
                            "
                        >
                            <span className="block">Rolando</span>
                            <span className="block">Rojas</span>
                        </p>

                        {/* =================================================
                            MAIN STATEMENT
                        ================================================== */}

                        <h1
                            id="artist-hero-title"
                            data-artist-hero-statement
                            className="
                                artist-hero-motion
                                max-w-[15ch]
                                font-display
                                text-1xl
                                font-normal
                                uppercase
                                leading-[1.15]
                                tracking-[0.06em]
                                text-[#F5EFE6]

                                landscape:max-w-[18ch]
                                landscape:text-base

                                md:max-w-[18ch]
                                md:text-xl

                                lg:max-w-[18ch]
                                lg:text-[2.25rem]
                                lg:leading-[1.14]

                                xl:text-[2.6rem]

                                2xl:text-[2.9rem]

                                mt-[1.5rem]

                                [@media(orientation:landscape)_and_(max-width:750px)_and_(max-height:700px)]:text-base
                                [@media(min-width:1300px)_and_(min-height:650px)]:text-xl
                            "
                        >
                            A life shaped by curiosity, observation and{" "}
                            <span className="text-brand-gold">
                                light.
                            </span>
                        </h1>

                        {/* Editorial divider */}
                        <div
                            data-artist-hero-divider
                            className="
                                artist-hero-motion
                                mt-6
                                h-px
                                w-full
                                max-w-[18rem]
                                bg-gradient-to-r
                                from-brand-gold/65
                                via-brand-gold/25
                                to-transparent

                                landscape:mt-4
                                landscape:max-w-[12rem]

                                md:mt-7
                                md:max-w-[20rem]

                                lg:mt-8
                                lg:max-w-[24rem]
                            "
                            aria-hidden="true"
                        />

                        {/* =================================================
                            SUPPORTING STATEMENT
                        ================================================== */}

                        <p
                            data-artist-hero-supporting
                            className="
                                artist-hero-motion
                                mt-5
                                hidden
                                max-w-[31rem]
                                font-sans
                                text-sm
                                font-light
                                leading-6
                                text-[#F5EFE6]/60

                                [@media(min-height:700px)]:block

                                landscape:hidden

                                md:mt-7
                                md:block
                                md:max-w-[30rem]
                                md:text-[0.95rem]
                                md:leading-7

                                lg:mt-9
                                lg:max-w-[34rem]
                                lg:text-[1.05rem]
                                lg:leading-7

                                xl:text-[1.12rem]
                                "
                        >
                            Nothing arrived all at once. Each encounter became
                            the cause of what came next.
                        </p>

                        {/* =================================================
                            SCROLL CUE
                        ================================================== */}

                        <div
                            data-artist-hero-scroll
                            className="
                                artist-hero-motion
                                mt-8
                                hidden
                                w-fit
                                flex-col
                                items-center
                                gap-3

                                md:mt-12
                                md:flex

                                [@media(pointer:coarse)]:!hidden
                            "
                        >
                            <span
                                className="
                                    font-sans
                                    text-[0.62rem]
                                    font-medium
                                    uppercase
                                    tracking-[0.3em]
                                    text-[#F5EFE6]/45
                                "
                            >
                                Scroll
                            </span>

                            <span
                                className="
                                    font-sans
                                    text-base
                                    font-light
                                    leading-none
                                    text-brand-gold/65
                                "
                                aria-hidden="true"
                            >
                                ↓
                            </span>
                        </div>
                    </div>
                </div>
            </Container>
            <ArtistHeroMotion />
        </section>
    );
}