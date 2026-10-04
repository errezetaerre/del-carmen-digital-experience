import Link from "next/link";

import { Container } from "@/shared/layout";

import type { JournalEntry } from "../types";

import JournalIndexMotion from "./JournalIndexMotion";

interface JournalIndexProps {
    entries: JournalEntry[];
}

export default function JournalIndex({
    entries,
}: JournalIndexProps) {
    return (
        <section
            data-journal-index
            className="
                relative
                overflow-hidden
                bg-background
                text-white
            "
        >
            <JournalIndexMotion />

            {/* Introduction */}
            <Container
                className="
                    flex
                    min-h-[52svh]
                    pb-16
                    pt-36
                    md:min-h-[56svh]
                    md:pb-20
                    md:pt-40
                    lg:pb-24
                    "
            >
                <div
                    data-journal-index-intro
                    className="max-w-4xl"
                >
                    <p
                        className="
                            mb-7
                            font-sans
                            text-[11px]
                            font-medium
                            uppercase
                            tracking-[0.35em]
                            text-brand-gold
                            "
                    >
                        Journal
                    </p>

                    <h1
                        className="
                            max-w-4xl
                            font-display
                            text-5xl
                            font-light
                            leading-[0.95]
                            tracking-[0.01em]
                            md:text-7xl
                            lg:text-[6.5rem]
                                        "
                    >
                        Thoughts, stories
                        <br />
                        <span className="italic text-white/75">
                            and quiet observations.
                        </span>
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
                        Reflections on art, memory, creation
                        and the quiet moments that shape the
                        work.
                    </p>
                </div>
            </Container>

            {/* Journal catalogue */}
            <div className="border-t border-white/10">
                {entries.map((entry, index) => {
                    const imageLeft = index % 2 === 0;

                    return (
                        <article
                            key={entry.slug}
                            data-journal-index-entry
                            className="
                                group/entry
                                relative
                                grid
                                min-h-[72svh]
                                lg:min-h-[84svh]
                                lg:grid-cols-2
                            "
                        >

                            {/* Media */}
                            <Link
                                href={`/journal/${entry.slug}`}
                                data-journal-index-media
                                className={[
                                    `
                                    group
                                    relative
                                    min-h-[52svh]
                                    overflow-hidden
                                    bg-white/[0.025]
                                    lg:min-h-[84svh]
                                `,
                                    imageLeft
                                        ? "lg:order-1"
                                        : "lg:order-2",
                                ].join(" ")}
                            >
                                <div
                                    data-journal-index-image-plane
                                    className="
                                        pointer-events-none
                                        absolute
                                        -inset-y-[35%]
                                        inset-x-0
                                        will-change-transform
                                    "
                                >
                                    <img
                                        src={entry.journalImage ?? entry.image}
                                        alt=""
                                        draggable={false}
                                        className="
                                            h-full
                                            w-full
                                            object-cover
                                            object-center
                                            transition-transform
                                            duration-1000
                                            ease-out
                                            group-hover:scale-[1.015]
                                        "
                                    />
                                </div>

                                <div
                                    aria-hidden="true"
                                    className="
                                        pointer-events-none
                                        absolute
                                        inset-0
                                        bg-gradient-to-t
                                        from-black/25
                                        via-transparent
                                        to-transparent
                                    "
                                />
                            </Link>

                            {/* Content */}
                            <div
                                data-journal-index-content
                                className={[
                                    "flex items-center",
                                    imageLeft
                                        ? "lg:order-2"
                                        : "lg:order-1",
                                ].join(" ")}
                            >
                                <div
                                    className="
                                        w-full
                                        px-7
                                        py-20
                                        md:px-12
                                        md:py-24
                                        lg:px-[clamp(4rem,7vw,8rem)]
                                        lg:py-28
                                    "
                                >
                                    <div
                                        className="
                                            mb-8
                                            flex
                                            items-center
                                            justify-between
                                            font-sans
                                            text-[10px]
                                            font-medium
                                            uppercase
                                            tracking-[0.3em]
                                        "                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-brand-gold">
                                                {entry.category}
                                            </span>

                                            <span
                                                aria-hidden="true"
                                                className="h-px w-8 bg-white/20"
                                            />

                                            <span className="text-white/40">
                                                {entry.year}
                                            </span>
                                        </div>

                                        <span
                                            className="
                                                text-[9px]
                                                tracking-[0.25em]
                                                text-white/25
                                            "
                                        >
                                            {String(index + 1).padStart(2, "0")} /{" "}
                                            {String(entries.length).padStart(2, "0")}
                                        </span>
                                    </div>

                                    <h2
                                        className="
                                            max-w-xl
                                            font-display
                                            text-4xl
                                            font-light
                                            leading-[0.98]
                                            tracking-[0.01em]
                                            md:text-5xl
                                            xl:text-6xl
                                            "
                                    >
                                        {entry.title}
                                    </h2>

                                    <p
                                        className="
                                            mt-8
                                            max-w-lg
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

                                    <Link
                                        href={`/journal/${entry.slug}`}
                                        className="
                                            mt-12
                                            inline-flex
                                            items-center
                                            gap-5
                                            font-sans
                                            text-[10px]
                                            font-medium
                                            uppercase
                                            tracking-[0.3em]
                                            text-white/65
                                            transition-colors
                                            duration-300
                                            hover:text-brand-gold
                                            "
                                    >
                                        Read Journal

                                        <span
                                            aria-hidden="true"
                                            className="
                                                    transition-transform
                                                    duration-500
                                                    group-hover:translate-x-1
                                                    "
                                        >
                                            →
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}