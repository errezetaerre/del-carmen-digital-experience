import { Container } from "@/shared/layout/container";
import ArtistPhilosophyMotion from "./ArtistPhilosophyMotion";

const philosophyParagraphs = [
    <>
        A sunset dissolving into violet and orange. The unguarded smile
        of a child. A face marked by years of struggle and wisdom.
        Light entering a room and transforming, for a moment,
        everything it touches.
    </>,
    <>
        These passing encounters are at the center of
        Rolando&apos;s way of seeing.
    </>,
    <>
        Painting becomes a means of remaining with them a little
        longer — of exploring the point where the exterior world
        awakens something within us, and where observation becomes
        contemplation.
    </>,
    <>
        Light is therefore more than illumination. It reveals,
        conceals, expands and draws the viewer inward. The human
        figure becomes more than anatomy. A gesture, a posture or a
        face can carry memory, silence, vulnerability and presence.
    </>,
    <>
        The search is not for a fixed style, but for an increasingly
        authentic language: a way of painting in which technique
        gradually becomes invisible and something more intimate can
        emerge.
    </>,
    <>
        Perhaps this is why the journey continues to feel unfinished.
    </>,
    <>
        Not because something is missing, but because discovery itself
        is part of the work.
    </>,
];

export default function ArtistPhilosophy() {
    return (
        <section
            id="artist-philosophy"
            className="
                relative
                overflow-clip
                bg-neutral-950
            "
            aria-labelledby="artist-philosophy-title"
        >
            {/* =====================================================
                MOTION EXPERIENCE
            ====================================================== */}

            <div
                data-philosophy-stage
                className="
                    relative
                    hidden
                    motion-safe:block
                    "
            >
                {/* =================================================
                    STICKY VIEWPORT
                ================================================== */}

                <div
                    data-philosophy-sticky
                    className="
                        sticky
                        top-0
                        h-[100svh]
                        overflow-hidden
                        "
                >
                    {/* =============================================
                        AMBIENT FIELD
                    ============================================== */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            left-1/2
                            top-[46%]
                            h-[34rem]
                            w-[34rem]
                            -translate-x-1/2
                            -translate-y-1/2
                            rounded-full
                            bg-brand-gold/[0.022]
                            blur-[130px]

                            md:h-[44rem]
                            md:w-[44rem]

                            lg:h-[52rem]
                            lg:w-[52rem]
                        "
                        aria-hidden="true"
                    />

                    <Container className="relative h-full">
                        <div
                            className="
                                relative
                                flex
                                h-full
                                flex-col
                                items-center
                            "
                        >
                            {/* =====================================
                                PHILOSOPHY HEADER
                            ====================================== */}

                            <header
                                className="
                                    absolute
                                    left-0
                                    right-0
                                    top-[9svh]

                                    md:top-[9svh]
                                    lg:top-[10svh]
                                "
                            >
                                {/* =================================
                                    EYEBROW
                                ================================== */}

                                <div
                                    data-philosophy-eyebrow
                                    className="
                                        artist-philosophy-motion
                                        flex
                                        items-center
                                        justify-center
                                        gap-4
                                    "
                                >
                                    <span
                                        data-philosophy-eyebrow-line
                                        className="
                                            h-px
                                            w-8
                                            origin-right
                                            bg-brand-gold/45

                                            md:w-10
                                        "
                                        aria-hidden="true"
                                    />

                                    <p
                                        className="
                                            font-sans
                                            text-[0.65rem]
                                            font-medium
                                            uppercase
                                            tracking-[0.28em]
                                            text-[#F5EFE6]/50
                                        "
                                    >
                                        Artistic Philosophy
                                    </p>

                                    <span
                                        data-philosophy-eyebrow-line
                                        className="
                                            h-px
                                            w-8
                                            origin-left
                                            bg-brand-gold/45

                                            md:w-10
                                        "
                                        aria-hidden="true"
                                    />
                                </div>

                                {/* =================================
                                    PRIMARY STATEMENT
                                ================================== */}

                                <h2
                                    id="artist-philosophy-title"
                                    data-philosophy-statement
                                    className="
                                        artist-philosophy-motion

                                        mx-auto
                                        mt-9
                                        max-w-[72rem]
                                        text-center
                                        font-display
                                        text-[2.35rem]
                                        font-light
                                        leading-[0.98]
                                        tracking-[-0.01em]
                                        text-[#F5EFE6]

                                        md:mt-11
                                        md:text-6xl
                                        md:leading-[0.96]

                                        lg:text-7xl

                                        xl:text-[5.5rem]
                                    "
                                >
                                    To observe is to discover
                                    <br className="hidden md:block" />
                                    {" "}that nothing is truly{" "}
                                    <span className="text-brand-gold">
                                        ordinary.
                                    </span>
                                </h2>
                            </header>

                            {/* =====================================
                                VERTICAL PAUSE
                            ====================================== */}

                            <div
                                data-philosophy-line
                                className="
                                    artist-philosophy-motion

                                    absolute
                                    left-1/2
                                    top-[40svh]
                                    h-[7svh]
                                    w-px
                                    -translate-x-1/2
                                    origin-top
                                    bg-gradient-to-b
                                    from-brand-gold/45
                                    to-transparent

                                    md:top-[39svh]
                                    md:h-[9svh]

                                    lg:top-[40svh]
                                    [@media(orientation:landscape)_and_(max-width:767px)_and_(max-height:600px)]:top-[43svh]
                                "
                                aria-hidden="true"
                            />

                            {/* =====================================
                                    READING CHAMBER
                                ====================================== */}

                            <div
                                data-philosophy-reading-window
                                className="
                                    absolute
                                    left-1/2
                                    top-[67svh]

                                    h-[44svh]
                                    min-h-[18rem]
                                    w-full
                                    max-w-[48rem]

                                    -translate-x-1/2
                                    -translate-y-1/2

                                    overflow-hidden

                                    md:top-[61svh]
                                    md:h-[30svh]
                                    lg:top-[66svh]
                                    lg:h-[28svh]
                                    lg:min-h-0
                                    lg:max-w-[52rem]

                                    [@media(orientation:landscape)_and_(max-width:767px)_and_(max-height:600px)]:top-[62svh]
                                    [@media(orientation:landscape)_and_(max-width:767px)_and_(max-height:600px)]:h-[30svh]
                                    [@media(orientation:landscape)_and_(max-width:767px)_and_(max-height:600px)]:min-h-0
                                "
                            >
                                {/* =================================
                                    PARAGRAPH COLUMN
                                ================================== */}

                                <div
                                    data-philosophy-column
                                    className="
                                        absolute
                                        left-0
                                        top-0
                                        w-full
                                        will-change-transform
                                    "
                                >
                                    {philosophyParagraphs.map((paragraph, index) => (
                                        <div
                                            key={index}
                                            data-philosophy-paragraph
                                            data-philosophy-index={index}
                                            className="
                                                artist-philosophy-motion

                                                flex
                                                min-h-[34svh]
                                                w-full
                                                items-center
                                                justify-center

                                                px-5
                                                py-8

                                                md:min-h-[21svh]
                                                md:px-10
                                                md:py-9
                                            "
                                        >
                                            <p
                                                className={`
                                                    text-center
                                                    font-sans
                                                    text-[0.98rem]
                                                    font-light
                                                    leading-[1.85]
                                                    text-[#F5EFE6]/80

                                                    md:text-base
                                                    md:leading-[1.9]

                                                    lg:text-[1.05rem]
                                                    lg:leading-[2]

                                                    ${index >= 5
                                                        ? "max-w-[39rem]"
                                                        : "max-w-[44rem]"
                                                    }
                                                `}
                                            >
                                                {paragraph}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* =================================
                                    TOP ATMOSPHERIC MASK
                                ================================== */}

                                <div
                                    data-philosophy-top-mask
                                    className="
                                        pointer-events-none
                                        absolute
                                        inset-x-0
                                        top-0
                                        z-20

                                        h-[30%]

                                        bg-gradient-to-b
                                        from-neutral-950
                                        via-neutral-950/75
                                        to-transparent

                                        lg:h-[14%]

                                        [@media(orientation:landscape)_and_(max-width:767px)_and_(max-height:600px)]:h-[10%]
                                    "
                                    aria-hidden="true"
                                />

                                {/* =================================
                                    BOTTOM ATMOSPHERIC MASK
                                ================================== */}

                                <div
                                    data-philosophy-bottom-mask
                                    className="
                                        pointer-events-none
                                        absolute
                                        inset-x-0
                                        bottom-0
                                        z-20

                                        h-[30%]

                                        bg-gradient-to-t
                                        from-neutral-950
                                        via-neutral-950/75
                                        to-transparent

                                        lg:h-[22%]

                                        [@media(orientation:landscape)_and_(max-width:767px)_and_(max-height:600px)]:h-[22%]
                                    "
                                    aria-hidden="true"
                                />
                            </div>
                        </div>
                    </Container>
                </div>

                {/* =================================================
                    PHYSICAL SCROLL DISTANCE
                ================================================== */}

                <div
                    data-philosophy-scroll-space
                    className="
                    h-[520svh]

                    md:h-[390svh]

                    lg:h-[360svh]
                "
                    aria-hidden="true"
                />
            </div>

            {/* =====================================================
                REDUCED MOTION FALLBACK

                All content remains readable without sticky or
                animated transitions.
            ====================================================== */}

            <div
                className="
                    hidden
                    motion-reduce:block

                    py-28
                    md:py-36
                    lg:py-44
                    xl:py-52
                "
            >
                <Container>
                    <div
                        className="
                            flex
                            items-center
                            justify-center
                            gap-4
                        "
                    >
                        <span
                            className="h-px w-8 bg-brand-gold/45"
                            aria-hidden="true"
                        />

                        <p
                            className="
                                font-sans
                                text-[0.65rem]
                                font-medium
                                uppercase
                                tracking-[0.28em]
                                text-[#F5EFE6]/50
                            "
                        >
                            Artistic Philosophy
                        </p>

                        <span
                            className="h-px w-8 bg-brand-gold/45"
                            aria-hidden="true"
                        />
                    </div>

                    <h2
                        className="
                            mx-auto
                            mt-12
                            max-w-[72rem]
                            text-center
                            font-display
                            text-[2.75rem]
                            font-light
                            leading-[0.98]
                            text-[#F5EFE6]

                            md:mt-16
                            md:text-6xl

                            lg:text-7xl

                            xl:text-[5.5rem]
                        "
                    >
                        To observe is to discover
                        <br className="hidden md:block" />
                        {" "}that nothing is truly{" "}
                        <span className="text-brand-gold">
                            ordinary.
                        </span>
                    </h2>

                    <div
                        className="
                            mx-auto
                            my-16
                            h-16
                            w-px
                            bg-gradient-to-b
                            from-brand-gold/45
                            to-transparent

                            md:my-20
                        "
                        aria-hidden="true"
                    />

                    <div
                        className="
                            mx-auto
                            max-w-[44rem]
                            space-y-8
                            text-center
                            font-sans
                            text-[0.98rem]
                            font-light
                            leading-[1.9]
                            text-[#F5EFE6]/70

                            md:text-base

                            lg:text-[1.05rem]
                            lg:leading-[2]
                        "
                    >
                        {philosophyParagraphs.map(
                            (paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            )
                        )}
                    </div>
                </Container>
            </div>

            <ArtistPhilosophyMotion />
        </section>
    );
}