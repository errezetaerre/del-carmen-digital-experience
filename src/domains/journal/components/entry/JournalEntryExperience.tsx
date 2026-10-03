import Link from "next/link";

import JournalCollection from "./JournalCollection";

import { Container } from "@/shared/layout";

import type {
    JournalEntry,
    JournalScene,
    JournalStory,
} from "../../types";

import JournalEntryMotion from "./JournalEntryMotion";

interface JournalEntryExperienceProps {
    entry: JournalEntry;
    story: JournalStory;
    entries: JournalEntry[];
}

function SceneCopy({
    scene,
    index,
    centered = false,
}: {
    scene: JournalScene;
    index: number;
    centered?: boolean;
}) {
    return (
        <>
            <div
                className={[
                    "mb-7 flex items-center gap-4 font-sans text-[10px] font-medium uppercase tracking-[0.3em]",
                    centered ? "justify-center" : "",
                ].join(" ")}
            >
                {scene.eyebrow && (
                    <span className="text-brand-gold">
                        {scene.eyebrow}
                    </span>
                )}

                <span
                    aria-hidden="true"
                    className="h-px w-8 bg-white/20"
                />

                <span className="text-white/30">
                    {String(index + 1).padStart(2, "0")}
                </span>
            </div>

            {scene.title && (
                <h2
                    className={[
                        "max-w-3xl font-display text-4xl font-light leading-[1] tracking-[0.01em] text-white md:text-5xl lg:text-6xl",
                        centered
                            ? "mx-auto text-center"
                            : "",
                    ].join(" ")}
                >
                    {scene.title}
                </h2>
            )}

            {scene.text && (
                <p
                    className={[
                        "mt-8 max-w-xl font-sans text-base font-light leading-[1.85] text-white/55 md:text-lg",
                        centered
                            ? "mx-auto text-center"
                            : "",
                    ].join(" ")}
                >
                    {scene.text}
                </p>
            )}
        </>
    );
}

function SceneMedia({
    media,
}: {
    media?: JournalScene["media"];
}) {
    if (!media) {
        return null;
    }

    if (media.type === "video") {
        return (
            <video
                autoPlay
                muted
                loop
                playsInline
                poster={media.poster}
                className="h-full w-full object-cover"
            >
                <source
                    src={media.src}
                    type="video/mp4"
                />
            </video>
        );
    }

    return (
        <img
            src={media.src}
            alt=""
            className="h-full w-full object-cover"
        />
    );
}

/*
 * LUMINOUS ACCENT
 *
 * Two extremely soft light fields:
 * a warm Del Carmen accent and a quieter
 * ivory haze.
 *
 * Motion is controlled by JournalEntryMotion.
 */
function SceneLight({
    contained = false,
}: {
    contained?: boolean;
}) {
    return (
        <div
            aria-hidden="true"
            data-journal-scene-light
            className={[
                `
                    pointer-events-none
                    absolute
                    inset-0
                    z-[1]
                    overflow-hidden
                `,
                contained ? "mix-blend-screen" : "",
            ].join(" ")}
        >
            <div
                data-journal-scene-light-core
                className="
                    absolute
                    left-[8%]
                    top-[12%]
                    h-[min(46vw,680px)]
                    w-[min(46vw,680px)]
                    rounded-full
                    bg-brand-gold/[0.065]
                    blur-[120px]
                    will-change-transform
                "
            />

            <div
                data-journal-scene-light-haze
                className="
                    absolute
                    -right-[8%]
                    bottom-[4%]
                    h-[min(32vw,480px)]
                    w-[min(32vw,480px)]
                    rounded-full
                    bg-white/[0.035]
                    blur-[140px]
                    will-change-transform
                "
            />
        </div>
    );
}

function JournalSceneBlock({
    scene,
    index,
}: {
    scene: JournalScene;
    index: number;
}) {
    /*
     * CENTERED
     *
     * Media becomes the atmosphere of the scene.
     * Copy floats over it instead of appearing above
     * a separate image.
     */
    if (scene.layout === "centered") {
        return (
            <section
                data-journal-scene
                className="
                    relative
                    flex
                    min-h-[88svh]
                    items-center
                    justify-center
                    overflow-hidden
                    border-t
                    border-white/10
                "
            >
                {scene.media && (
                    <div
                        data-journal-scene-media
                        className="absolute inset-0"
                    >
                        <SceneMedia
                            media={scene.media}
                        />

                        <div
                            aria-hidden="true"
                            className="
                                absolute
                                inset-0
                                bg-black/55
                            "
                        />

                        <div
                            aria-hidden="true"
                            className="
                                absolute
                                inset-0
                                bg-gradient-to-b
                                from-black/40
                                via-black/10
                                to-black/60
                            "
                        />

                        <div
                            aria-hidden="true"
                            className="
                                absolute
                                inset-0
                                bg-gradient-to-r
                                from-black/20
                                via-transparent
                                to-black/20
                            "
                        />
                    </div>
                )}

                <SceneLight />

                <Container className="relative z-10">
                    <div
                        data-journal-scene-copy
                        className="
                            mx-auto
                            max-w-4xl
                            text-center
                        "
                    >
                        <SceneCopy
                            scene={scene}
                            index={index}
                            centered
                        />
                    </div>
                </Container>
            </section>
        );
    }

    /*
     * IMMERSIVE
     *
     * Full atmospheric media with the copy anchored
     * toward the bottom.
     */
    if (scene.layout === "immersive") {
        return (
            <section
                data-journal-scene
                className="
                    relative
                    flex
                    min-h-[92svh]
                    items-end
                    overflow-hidden
                    border-t
                    border-white/10
                "
            >
                {scene.media && (
                    <div
                        data-journal-scene-media
                        className="absolute inset-0"
                    >
                        <SceneMedia
                            media={scene.media}
                        />

                        <div
                            aria-hidden="true"
                            className="
                                absolute
                                inset-0
                                bg-gradient-to-t
                                from-black
                                via-black/35
                                to-black/10
                            "
                        />
                    </div>
                )}

                <SceneLight />

                <Container
                    className="
                        relative
                        z-10
                        pb-20
                        pt-40
                        md:pb-28
                        lg:pb-32
                    "
                >
                    <div
                        data-journal-scene-copy
                        className="max-w-3xl"
                    >
                        <SceneCopy
                            scene={scene}
                            index={index}
                        />
                    </div>
                </Container>
            </section>
        );
    }

    /*
     * SPLIT
     *
     * Media and copy remain independent editorial
     * surfaces. The light remains contained inside
     * the media side.
     */
    if (
        scene.layout === "split-left" ||
        scene.layout === "split-right"
    ) {
        const mediaFirst =
            scene.layout === "split-left";

        return (
            <section
                data-journal-scene
                className="
                    grid
                    min-h-[86svh]
                    border-t
                    border-white/10
                    lg:grid-cols-2
                "
            >
                <div
                    data-journal-scene-media
                    className={[
                        "relative min-h-[55svh] overflow-hidden bg-black",
                        mediaFirst
                            ? "lg:order-1"
                            : "lg:order-2",
                    ].join(" ")}
                >
                    <div className="absolute inset-0">
                        <SceneMedia
                            media={scene.media}
                        />
                    </div>

                    <SceneLight contained />

                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            bg-black/5
                        "
                    />
                </div>

                <div
                    className={[
                        "flex items-center",
                        mediaFirst
                            ? "lg:order-2"
                            : "lg:order-1",
                    ].join(" ")}
                >
                    <div
                        data-journal-scene-copy
                        className="
                            w-full
                            px-7
                            py-20
                            md:px-12
                            lg:px-[clamp(4rem,7vw,8rem)]
                        "
                    >
                        <SceneCopy
                            scene={scene}
                            index={index}
                        />
                    </div>
                </div>
            </section>
        );
    }

    return null;
}

export default function JournalEntryExperience({
    entry,
    story,
    entries,
}: JournalEntryExperienceProps) {
    return (
        <article
            data-journal-entry-experience
            className="
                relative
                overflow-hidden
                bg-background
                text-white
            "
        >
            <JournalEntryMotion />

            {/* Hero */}
            <header
                className="
                    flex
                    min-h-[78svh]
                    items-end
                    pb-20
                    pt-40
                    md:pb-28
                "
            >
                <Container>
                    <div
                        data-journal-entry-hero
                        className="max-w-5xl"
                    >
                        <div
                            className="
                                mb-8
                                flex
                                items-center
                                gap-4
                                font-sans
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-[0.32em]
                            "
                        >
                            <Link
                                href="/journal"
                                className="
                                    text-brand-gold
                                    transition-opacity
                                    hover:opacity-70
                                "
                            >
                                Journal
                            </Link>

                            <span
                                aria-hidden="true"
                                className="h-px w-8 bg-white/20"
                            />

                            <span className="text-white/45">
                                {entry.category}
                            </span>

                            <span className="text-white/25">
                                {entry.year}
                            </span>
                        </div>

                        <h1
                            className="
                                max-w-5xl
                                font-display
                                text-5xl
                                font-light
                                leading-[0.94]
                                tracking-[0.01em]
                                md:text-7xl
                                lg:text-[7rem]
                            "
                        >
                            {entry.title}
                        </h1>

                        <p
                            className="
                                mt-10
                                max-w-xl
                                font-sans
                                text-base
                                font-light
                                leading-[1.8]
                                text-white/50
                                md:text-lg
                            "
                        >
                            {entry.excerpt}
                        </p>

                        <p
                            className="
                                mt-14
                                font-sans
                                text-[9px]
                                uppercase
                                tracking-[0.32em]
                                text-white/30
                            "
                        >
                            Scroll to explore ↓
                        </p>
                    </div>
                </Container>
            </header>

            {/* Story */}
            {story.scenes.map((scene, index) => (
                <JournalSceneBlock
                    key={scene.id}
                    scene={scene}
                    index={index}
                />
            ))}

            {/* Journal navigation */}
            <JournalCollection
                entries={entries}
                currentSlug={entry.slug}
            />
        </article>
    );
}