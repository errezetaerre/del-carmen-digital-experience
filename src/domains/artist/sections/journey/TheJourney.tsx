import { useTranslations } from "next-intl";
import { Container } from "@/shared/layout/container";
import JourneyMedia from "./JourneyMedia";

import JourneyMotion from "./JourneyMotion";

import JourneyNavigator from "./JourneyNavigator";

export default function TheJourney() {
    const t = useTranslations("Artist");
    const milestones = [
        {
            period: t("journey.milestones.item1.period"),
            title: t("journey.milestones.item1.title"),
            copy: [
                t("journey.milestones.item1.copy.item1"),
                t("journey.milestones.item1.copy.item2"),
                t("journey.milestones.item1.copy.item3"),
            ],
        },
        {
            period: t("journey.milestones.item2.period"),
            title: t("journey.milestones.item2.title"),
            copy: [
                t("journey.milestones.item2.copy.item1"),
                t("journey.milestones.item2.copy.item2"),
                t("journey.milestones.item2.copy.item3"),
                t("journey.milestones.item2.copy.item4"),
            ],
        },
        {
            period: t("journey.milestones.item3.period"),
            title: t("journey.milestones.item3.title"),
            copy: [
                t("journey.milestones.item3.copy.item1"),
                t("journey.milestones.item3.copy.item2"),
                t("journey.milestones.item3.copy.item3"),
            ],
        },
        {
            period: t("journey.milestones.item4.period"),
            title: t("journey.milestones.item4.title"),
            copy: [
                t("journey.milestones.item4.copy.item1"),
                t("journey.milestones.item4.copy.item2"),
                t("journey.milestones.item4.copy.item3"),
                t("journey.milestones.item4.copy.item4"),
            ],
        },
        {
            period: t("journey.milestones.item5.period"),
            title: t("journey.milestones.item5.title"),
            copy: [
                t("journey.milestones.item5.copy.item1"),
                t("journey.milestones.item5.copy.item2"),
                t("journey.milestones.item5.copy.item3"),
            ],
            question: t("journey.milestones.item5.question"),
            closing: [
                t("journey.milestones.item5.closing.item1"),
                t("journey.milestones.item5.closing.item2"),
            ],
        },
    ];

    return (
        <section
            id="the-journey"
            className="
                relative
                bg-neutral-950

                pb-28
                pt-24

                md:pb-36
                md:pt-32

                lg:pb-10
                lg:pt-10

                xl:pb-52
                xl:pt-18
            "
            aria-labelledby="the-journey-title"
        >
            <Container>
                {/* =================================================
                    INTRO
                ================================================== */}

                <div
                    data-journey-intro
                    className="
                        grid
                        grid-cols-1
                        gap-12

                        lg:grid-cols-12
                        lg:gap-x-8
                    "
                >
                    <header
                        className="
                            lg:col-span-5
                        "
                    >
                        <p
                            data-journey-intro-eyebrow
                            className="
                                font-sans
                                text-[0.65rem]
                                font-medium
                                uppercase
                                tracking-[0.28em]
                                text-brand-gold/70
                            "
                        >
                            {t("journey.eyebrow")}
                        </p>

                        <h2
                            data-journey-intro-title
                            id="the-journey-title"
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
                            {t("journey.titleFirst")}{" "}
                            <span className="text-brand-gold">
                                {t("journey.titleSecond")}
                            </span>
                        </h2>
                    </header>

                    <div
                        className="
                            max-w-[40rem]

                            lg:col-span-6
                            lg:col-start-7
                            lg:pt-12
                        "
                    >
                        <p
                            data-journey-intro-lead
                            className="
                                font-display
                                text-2xl
                                font-light
                                leading-[1.3]
                                text-[#F5EFE6]/90

                                md:text-3xl
                            "
                        >
                            {t("journey.intro")}
                        </p>

                        <p
                            data-journey-intro-copy
                            className="
                                mt-7
                                font-sans
                                text-[0.98rem]
                                font-light
                                leading-[1.9]
                                text-[#F5EFE6]/65

                                md:text-base
                            "
                        >
                            {t("journey.encounters")}
                        </p>

                        <p
                            data-journey-intro-copy
                            className="
                                mt-7
                                font-sans
                                text-[0.98rem]
                                font-light
                                leading-[1.9]
                                text-[#F5EFE6]/65

                                md:text-base
                            "
                        >
                            {t("journey.cause")}
                        </p>

                        <p
                            data-journey-intro-copy
                            className="
                                mt-7
                                font-sans
                                text-[0.98rem]
                                font-light
                                leading-[1.9]
                                text-[#F5EFE6]/65

                                md:text-base
                            "
                        >
                            {t("journey.search")}
                        </p>

                        <p
                            data-journey-intro-copy
                            className="
                                mt-7
                                font-display
                                text-xl
                                font-light
                                italic
                                text-brand-gold/85
                            "
                        >
                            {t("journey.continues")}
                        </p>
                    </div>
                </div>

                {/* =================================================
                    MILESTONES
                ================================================== */}

                <div
                    data-journey-stage
                    className="
                        relative
                        mt-28

                        md:mt-36
                        lg:mt-24
                    "
                >
                    <JourneyNavigator />
                    <div
                        data-journey-pin
                        className="
                            relative
                            h-auto
                            min-h-0
                            w-full
                            overflow-visible

                            lg:h-[80svh]
                            lg:min-h-[38rem]
                            lg:overflow-hidden
                        "
                    >
                        <div
                            data-journey-track
                            className="
                                relative
                                flex
                                h-full
                                w-full
                                flex-col

                                lg:h-full
                            "
                        >
                            {milestones.map((milestone, index) => (
                                <article
                                    key={milestone.title}
                                    data-journey-milestone
                                    className={`
                                        grid
                                        h-auto
                                        min-h-0
                                        w-full
                                        shrink-0
                                        grid-cols-1
                                        border-t
                                        border-[#F5EFE6]/10
                                        py-20

                                        md:py-24

                                        lg:h-full
                                        lg:min-h-full
                                        lg:grid-cols-12
                                        lg:gap-x-8
                                        lg:py-0

                                        ${index === milestones.length - 1
                                            ? "lg:content-start lg:pt-28"
                                            : "lg:content-center"
                                        }
                                    `}
                                >
                                    {/* NUMBER + DATE */}

                                    <div
                                        data-journey-meta
                                        className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-8

                                            lg:col-span-3
                                            lg:block
                                        "
                                    >
                                        <span
                                            className="
                                font-display
                                text-4xl
                                font-light
                                text-[#F5EFE6]/15

                                md:text-5xl
                            "
                                            aria-hidden="true"
                                        >
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        <p
                                            className="
                                pt-2
                                font-sans
                                text-[0.62rem]
                                font-medium
                                uppercase
                                tracking-[0.25em]
                                text-brand-gold/60

                                lg:mt-10
                            "
                                        >
                                            {milestone.period}
                                        </p>
                                    </div>

                                    {/* HEADLINE */}

                                    <div
                                        data-journey-headline
                                        className="
                            mt-8

                            lg:col-span-3
                            lg:mt-0
                        "
                                    >
                                        <h3
                                            className="
                                max-w-[10ch]
                                font-display
                                text-3xl
                                font-light
                                leading-[1.05]
                                text-[#F5EFE6]

                                md:text-4xl
                            "
                                        >
                                            {milestone.title}
                                        </h3>
                                    </div>

                                    {/* COPY */}

                                    <div
                                        className="
                            mt-10
                            max-w-[39rem]
                            space-y-7

                            font-sans
                            text-[0.98rem]
                            font-light
                            leading-[1.9]
                            text-[#F5EFE6]/62

                            md:text-base

                            lg:col-span-5
                            lg:col-start-8
                            lg:mt-0
                        "
                                    >
                                        {milestone.copy.map((paragraph) => (
                                            <p
                                                key={paragraph}
                                                data-journey-copy
                                            >
                                                {paragraph}
                                            </p>
                                        ))}

                                        {milestone.question && (
                                            <p
                                                data-journey-copy
                                                className="
                                    py-5
                                    font-display
                                    text-2xl
                                    font-light
                                    leading-[1.25]
                                    text-[#F5EFE6]

                                    md:text-3xl
                                "
                                            >
                                                {milestone.question}
                                            </p>
                                        )}

                                        {milestone.closing?.map((paragraph) => (
                                            <p
                                                key={paragraph}
                                                data-journey-copy
                                            >
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>

            {/* =====================================================
                JOURNEY MEDIA

                Deliberately escapes the editorial Container.
            ====================================================== */}

            <JourneyMedia />

            {/* =====================================================
                NARRATIVE ANCHOR
            ====================================================== */}

            <Container>
                <div
                    data-journey-closing
                    className="
                        mx-auto
                        mt-24
                        max-w-[46rem]
                        text-center

                        md:mt-32
                        lg:mt-40
                    "
                >
                    <div
                        data-journey-closing-line
                        className="
                            mx-auto
                            mb-8
                            h-px
                            w-10
                            bg-brand-gold/45
                        "
                        aria-hidden="true"
                    />

                    <p
                        data-journey-closing-copy
                        className="
                            font-display
                            text-3xl
                            font-light
                            leading-[1.2]
                            text-[#F5EFE6]

                            md:text-4xl
                            lg:text-5xl
                        "
                    >
                        {t("journey.closingFirst")}{" "}
                        <span className="text-brand-gold">
                            {t("journey.closingSecond")}
                        </span>
                    </p>
                </div>
            </Container>

            <JourneyMotion />
        </section >
    );
}