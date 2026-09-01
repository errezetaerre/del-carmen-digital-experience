import { Container } from "@/shared/layout/container";
import JourneyMedia from "./JourneyMedia";

import JourneyMotion from "./JourneyMotion";

import JourneyNavigator from "./JourneyNavigator";

const milestones = [
    {
        period: "Around 2015–2017",
        title: "Curiosity returns",
        copy: [
            "Years after leaving drawing behind, an unexpected fascination with the intricate illustrations of Johanna Basford brought Rolando back to paper.",
            "Color led to pen and ink. Pen and ink led to a course. And a course of only eight classes became a turning point.",
            "He entered believing that drawing was an ability one was simply born with. He left wondering what might happen if curiosity were given time, discipline and permission to grow.",
        ],
    },
    {
        period: "2017–2018",
        title: "Learning to see",
        copy: [
            "Curiosity soon demanded greater structure.",
            "Rolando entered Atelier del Sol in San José with no previous academic training in drawing or painting. Under the guidance of Emilia Cantor, he began studying the foundations of academic realism: drawing, proportion, value, form, composition and eventually oil painting.",
            "The atelier transformed admiration into practice.",
            "What had once seemed like an inaccessible ability began to reveal itself as something that could be studied, practiced and continually refined.",
        ],
    },
    {
        period: "2018–2021",
        title: "The work enters the world",
        copy: [
            "As study became practice, the work gradually moved beyond the atelier.",
            "In 2018, Rolando participated in Academicismo del Siglo XXI at the Museo del Jade in San José, followed by collective exhibitions in cultural spaces across Costa Rica.",
            "Recognition during these formative years — from drawing and cast studies to portraiture and painting — became less a destination than confirmation that the years of quiet practice were beginning to leave a visible trace.",
        ],
    },
    {
        period: "2022",
        title: "A foundation, not an arrival",
        copy: [
            "In 2022, Rolando became the second student to graduate as an academic painter from Atelier del Sol.",
            "The achievement marked years of disciplined study, but it did not resolve the central question of the practice.",
            "If technique teaches an artist how to see and how to construct an image, what remains when technique is no longer the destination?",
            "Graduation became less an ending than the beginning of another search: for a brushstroke, a language and a visual identity that could become unmistakably his own.",
        ],
    },
    {
        period: "2023 — Present",
        title: "Toward a language of his own",
        copy: [
            "The years that followed brought new exhibitions, new bodies of work and a deeper attention to the relationship between figure, light and inner presence.",
            "In 2024, Sendero del Sol received an Honourable Mention at the fifth edition of La No Bienal — a work in which landscape, figure and light converge around precisely the kind of fleeting human presence that continues to shape Rolando's practice.",
            "Yet recognition remains secondary to the question that has followed the journey from the beginning:",
        ],
        question: "What is still waiting to be discovered?",
        closing: [
            "The answer is not fixed.",
            "It lives somewhere between everything already learned and everything the next painting may reveal.",
        ],
    },
];

export default function TheJourney() {
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
                            The Journey
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
                            Nothing arrived{" "}
                            <span className="text-brand-gold">
                                all at once.
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
                            Looking back, the path toward painting does
                            not appear as a straight line.
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
                            It is a sequence of encounters — some
                            seemingly small at the time — that gradually
                            revealed what the next step could become.
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
                            One experience became the cause of another.
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
                            What began as curiosity became practice.
                            Practice became discipline. And discipline
                            opened the possibility of a more personal
                            search.
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
                            The journey continues.
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
                        Each encounter became the cause of{" "}
                        <span className="text-brand-gold">
                            what came next.
                        </span>
                    </p>
                </div>
            </Container>

            <JourneyMotion />
        </section >
    );
}