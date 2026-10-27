import { useTranslations } from "next-intl";
import Image from "next/image";
import { Container } from "@/shared/layout/container";
import ThePracticeMotion from "./ThePracticeMotion";

const hasPracticeImages = true;

export default function ThePractice() {
    const t = useTranslations("Artist");


    return (
        <section
            id="the-practice"
            className="
                relative
                overflow-hidden
                bg-neutral-950

                pb-28
                pt-16

                md:pb-36
                md:pt-20

                lg:pb-44
                lg:pt-24

                xl:pb-52
                xl:pt-8
            "
            aria-labelledby="the-practice-title"
        >
            <Container>
                {/* =================================================
                    INTRO
                ================================================== */}

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-12

                        lg:grid-cols-12
                        lg:gap-x-8
                    "
                >
                    {/* LEFT */}

                    <header
                        className="
                            lg:col-span-5
                        "
                    >
                        <p
                            data-practice-eyebrow
                            className="
                                practice-motion
                                font-sans
                                text-[0.65rem]
                                font-medium
                                uppercase
                                tracking-[0.28em]
                                text-brand-gold/70
                            "
                        >
                            {t("practice.eyebrow")}
                        </p>

                        <h2
                            id="the-practice-title"
                            className="
                                mt-7
                                max-w-[10ch]
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
                                data-practice-title-line
                                className="practice-motion block"
                            >
                                {t("practice.titleFirst")}
                            </span>

                            <span
                                data-practice-title-line
                                className="practice-motion block"
                            >
                                {t("practice.titleSecond")}
                            </span>

                            <span
                                data-practice-title-line
                                className="practice-motion block"
                            >
                                {t("practice.titleThird")}{" "}
                                <span className="text-brand-gold">
                                    {t("practice.canvas")}
                                </span>
                            </span>
                        </h2>
                    </header>

                    {/* RIGHT */}

                    <div
                        className="
                            max-w-[39rem]

                            lg:col-span-6
                            lg:col-start-7
                            lg:pt-12
                        "
                    >
                        <p
                            data-practice-intro
                            className="
                                practice-motion
                                font-display
                                text-2xl
                                font-light
                                leading-[1.25]
                                text-[#F5EFE6]/90

                                md:text-3xl
                            "
                        >
                            {t("practice.intro")}
                        </p>

                        <p
                            data-practice-copy
                            className="
                                practice-motion
                                mt-7
                                font-sans
                                text-[0.98rem]
                                font-light
                                leading-[1.9]
                                text-[#F5EFE6]/65
                                md:text-base
                            "
                        >
                            {t("practice.looking")}
                        </p>

                        <p
                            data-practice-copy
                            className="
                                practice-motion
                                mt-7
                                font-sans
                                text-[0.98rem]
                                font-light
                                leading-[1.9]
                                text-[#F5EFE6]/65

                                md:text-base
                            "
                        >
                            {t("practice.training")}
                        </p>
                    </div>
                </div>

                {/* =================================================
                    PRIMARY PRACTICE MEDIA
                ================================================== */}

                <div
                    className="
                        relative
                        mt-20

                        md:mt-28
                        lg:mt-36

                        mx-auto

                        lg:ml-auto
                        lg:mr-0
                        "
                >
                    <div
                        data-practice-environment
                        className="
                            practice-media
                            relative

                            mx-auto
                            aspect-[16/10]
                            w-full

                            overflow-hidden
                            bg-neutral-900

                            lg:ml-auto
                            lg:mr-0
                        "
                    >
                        {hasPracticeImages ? (
                            <Image
                                src="/artist/practice/rolando_at_easel.webp"
                                alt={t("practice.easelAlt")}
                                fill
                                sizes="
                                    (max-width: 1024px) 100vw,
                                    82vw
                                "
                                className="
                                    object-cover
                                    object-center
                                "
                            />
                        ) : (
                            <PracticePlaceholder label={t("practice.environment")} />
                        )}

                        {/* subtle photographic treatment */}

                        <div
                            className="
                                pointer-events-none
                                absolute
                                inset-0
                                bg-gradient-to-t
                                from-neutral-950/35
                                via-transparent
                                to-transparent
                            "
                            aria-hidden="true"
                        />
                    </div>

                    {/* MEDIA LABEL */}

                    <div
                        data-practice-label
                        className="
                            practice-motion
                            mt-5
                            flex
                            items-center
                            justify-end
                            gap-3
                        "
                    >
                        <span
                            className="
                                h-px
                                w-8
                                bg-brand-gold/35
                            "
                        />

                        <span
                            className="
                                font-sans
                                text-[0.6rem]
                                uppercase
                                tracking-[0.26em]
                                text-[#F5EFE6]/35
                            "
                        >
                            {t("practice.environment")}
                        </span>
                    </div>
                </div>

                {/* =================================================
                    MATERIAL DETAIL
                ================================================== */}

                <div
                    className="
                        mt-20

                        md:mt-28
                        lg:mt-22
                        lg:ml-[-10rem]
                    "
                >
                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-6

                            md:grid-cols-12
                            md:gap-x-8
                        "
                    >
                        {/* IMAGE */}

                        <div
                            className="
                                md:col-span-7
                                md:col-start-4

                                lg:col-span-6
                                lg:col-start-5
                            "
                        >
                            <div
                                data-practice-material
                                className="
                                    practice-media
                                    relative
                                    aspect-[16/9]
                                    overflow-hidden
                                    bg-neutral-900
                                "
                            >
                                <Image
                                    src="/artist/practice/palette_color_study.webp"
                                    alt={t("practice.paletteAlt")}
                                    fill
                                    sizes="
                                        (max-width: 768px) 100vw,
                                        (max-width: 1200px) 60vw,
                                        50vw
                                    "
                                    className="
                                        object-cover
                                        object-center
                                    "
                                />

                                <div
                                    className="
                                        pointer-events-none
                                        absolute
                                        inset-0
                                        bg-gradient-to-t
                                        from-neutral-950/20
                                        via-transparent
                                        to-transparent
                                    "
                                    aria-hidden="true"
                                />
                            </div>

                            {/* LABEL */}

                            <div
                                data-practice-label
                                className="
                                    practice-motion
                                    mt-5
                                    flex
                                    items-center
                                    justify-end
                                    gap-3
                                "
                            >
                                <span
                                    className="
                                        h-px
                                        w-8
                                        bg-brand-gold/35
                                    "
                                    aria-hidden="true"
                                />

                                <span
                                    className="
                                        font-sans
                                        text-[0.6rem]
                                        uppercase
                                        tracking-[0.26em]
                                        text-[#F5EFE6]/35
                                    "
                                >
                                    {t("practice.material")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    WORK / PROCESS
                ================================================== */}

                <div
                    className="
                        mt-20
                        grid
                        grid-cols-1
                        gap-14

                        md:mt-28
                        md:grid-cols-12
                        md:gap-x-8

                        lg:mt-26
                    "
                >
                    {/* SECONDARY IMAGE */}

                    <div
                        className="
                            md:col-span-5
                            lg:col-span-4
                            lg:col-start-2
                        "
                    >
                        <div
                            data-practice-work
                            className="
                                practice-media
                                relative
                                aspect-[4/5]
                                overflow-hidden
                                bg-neutral-900
                            "
                        >
                            {hasPracticeImages ? (
                                <Image
                                    src="/artist/practice/portrait_in_progress.webp"
                                    alt={t("practice.portraitAlt")}
                                    fill
                                    sizes="
                                        (max-width: 768px) 100vw,
                                        40vw
                                    "
                                    className="
                                        object-cover
                                        object-center
                                    "
                                />
                            ) : (
                                <PracticePlaceholder label="Work" />
                            )}
                        </div>

                        <div
                            data-practice-label
                            className="
                                practice-motion
                                mt-5
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <span
                                className="
                                    font-sans
                                    text-[0.6rem]
                                    uppercase
                                    tracking-[0.26em]
                                    text-[#F5EFE6]/35
                                "
                            >
                                {t("practice.work")}
                            </span>

                            <span
                                className="
                                    h-px
                                    w-8
                                    bg-brand-gold/35
                                "
                            />
                        </div>
                    </div>

                    {/* PROCESS COPY */}

                    <div
                        className="
                            md:col-span-6
                            md:col-start-7

                            lg:col-span-5
                            lg:col-start-8
                            lg:pt-16
                        "
                    >
                        <p
                            data-practice-process
                            className="
                                practice-motion
                                font-sans
                                text-[0.98rem]
                                font-light
                                leading-[1.9]
                                text-[#F5EFE6]/65

                                md:text-base
                            "
                        >
                            {t("practice.process")}
                        </p>

                        {/* =========================================
                            EDITORIAL PAUSE
                        ========================================== */}

                        <div
                            className="
                                my-14
                                md:my-16
                                lg:my-20
                            "
                        >
                            <span
                                data-practice-pause-line
                                className="
                                    practice-motion
                                    mb-7
                                    block
                                    h-px
                                    w-10
                                    bg-brand-gold/45
                                "
                                aria-hidden="true"
                            />

                            <p
                                className="
                                    max-w-[13ch]
                                    font-display
                                    text-3xl
                                    font-light
                                    leading-[1.08]
                                    text-[#F5EFE6]

                                    md:text-4xl
                                "
                            >
                                <span
                                    data-practice-highlight-line
                                    className="practice-motion block"
                                >
                                    {t("practice.highlightFirst")}
                                </span>

                                <span
                                    data-practice-highlight-line
                                    className="practice-motion block"
                                >
                                    {t("practice.highlightSecond")}
                                </span>

                                <span
                                    data-practice-highlight-line
                                    className="
                                        practice-motion
                                        block
                                        text-brand-gold
                                    "
                                >
                                    {t("practice.highlightThird")}
                                </span>
                            </p>
                        </div>

                        <p
                            data-practice-process
                            className="
                                practice-motion
                                font-sans
                                text-[0.98rem]
                                font-light
                                leading-[1.9]
                                text-[#F5EFE6]/65

                                md:text-base
                            "
                        >
                            {t("practice.objective")}
                        </p>

                        <p
                            data-practice-process
                            className="
                                practice-motion
                                mt-7
                                font-sans
                                text-[0.98rem]
                                font-light
                                leading-[1.9]
                                text-[#F5EFE6]/65

                                md:text-base
                            "
                        >
                            {t("practice.attention")}
                        </p>

                        <p
                            data-practice-process
                            className="
                                practice-motion
                                mt-7
                                font-sans
                                text-[0.98rem]
                                font-light
                                leading-[1.9]
                                text-[#F5EFE6]/65

                                md:text-base
                            "
                        >
                            {t("practice.continuity")}
                        </p>
                    </div>
                </div>
            </Container>
            <ThePracticeMotion />
        </section>
    );
}

/* =====================================================
    TEMPORARY MEDIA PLACEHOLDER
===================================================== */

function PracticePlaceholder({
    label,
}: {
    label: string;
}) {
    const t = useTranslations("Artist");

    return (
        <div
            className="
                absolute
                inset-0

                flex
                items-center
                justify-center

                bg-gradient-to-br
                from-neutral-900
                to-neutral-950
            "
        >
            <div className="text-center">
                <span
                    className="
                        font-sans
                        text-[0.6rem]
                        uppercase
                        tracking-[0.3em]
                        text-brand-gold/35
                    "
                >
                    {t("practice.placeholder")}
                </span>

                <p
                    className="
                        mt-3
                        font-display
                        text-xl
                        font-light
                        text-[#F5EFE6]/25
                    "
                >
                    {label}
                </p>
            </div>
        </div>
    );
}