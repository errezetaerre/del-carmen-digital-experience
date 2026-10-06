"use client";

import Link from "next/link";
import { useMemo } from "react";

import { KineticCarousel } from "@/shared/ui/kinetic-carousel";

import type { JournalEntry } from "../../types";

interface JournalCollectionProps {
    entries: JournalEntry[];
    currentSlug: string;
}

export default function JournalCollection({
    entries,
    currentSlug,
}: JournalCollectionProps) {
    const collection = useMemo(
        () => entries.filter((entry) => entry.slug !== currentSlug),
        [entries, currentSlug],
    );

    if (collection.length === 0) {
        return null;
    }

    return (
        <section
            data-journal-collection
            className="
                relative
                w-full
                overflow-hidden
                border-t
                border-white/10
                bg-background
                py-20
                md:py-24
                lg:py-28
            "
        >
            {/* End-of-story / Journal Collection divider */}
            <div
                aria-hidden="true"
                className="
                    absolute
                    left-0
                    top-0
                    z-20
                    flex
                    w-full
                    items-center
                "
            >
                <div
                    className="
                        h-px
                        w-[clamp(4rem,8vw,9rem)]
                        bg-brand-gold/80
                    "
                />
                <div
                    className="
                        h-px
                        flex-1
                        bg-white/25
                    "
                />
            </div>
            <div
                className="
                    grid
                    gap-12
                    lg:grid-cols-[300px_minmax(0,1fr)]
                    lg:gap-14
                    xl:grid-cols-[340px_minmax(0,1fr)]
                "
            >
                {/* Heading */}
                <div
                    className="
                        flex
                        flex-col
                        justify-between
                        px-7
                        md:px-12
                        lg:min-h-[440px]
                        lg:pt-14
                        lg:pb-2
                        lg:pl-[clamp(4rem,7vw,8rem)]
                        lg:pr-0
                        xl:pt-16
                    "
                >
                    <div>
                        <p
                            className="
                                mb-5
                                font-sans
                                text-[9px]
                                font-medium
                                uppercase
                                tracking-[0.32em]
                                text-brand-gold
                            "
                        >
                            Journal
                        </p>
                        <h2
                            className="
                                max-w-xs
                                font-display
                                text-4xl
                                font-light
                                leading-[0.95]
                                text-white
                                md:text-5xl
                            "
                        >
                            Journal
                            <br />
                            Collection
                        </h2>
                        <p
                            className="
                                mt-7
                                max-w-[15rem]
                                font-sans
                                text-sm
                                font-light
                                leading-[1.7]
                                text-white/35
                            "
                        >
                            Continue through the
                            remaining reflections.
                        </p>
                    </div>
                    <Link
                        href="/journal"
                        className="
                            mt-10
                            inline-flex
                            w-fit
                            font-sans
                            text-[9px]
                            font-medium
                            uppercase
                            tracking-[0.3em]
                            text-white/35
                            transition-colors
                            duration-300
                            hover:text-brand-gold
                            lg:mt-0
                        "
                    >
                        Journal Index →
                    </Link>
                </div>
                {/* Kinetic collection */}
                <div className="relative min-w-0">
                    <div className="mb-5 flex min-h-5 items-center justify-end pr-5">
                        <p className="font-sans text-[8px] font-medium uppercase tracking-[0.3em] text-white/25">
                            Drag or swipe to explore ↔
                        </p>
                    </div>
                    <KineticCarousel
                        itemCount={collection.length}
                        viewportProps={{ "data-journal-collection-viewport": "" }}
                        trackClassName="gap-5 lg:gap-5"
                        previousLabel="Explore previous journals"
                        nextLabel="Explore more journals"
                    >
                        {collection.map(
                            (journal) => (
                                <Link
                                    key={
                                        journal.slug
                                    }
                                    href={`/journal/${journal.slug}`}
                                    draggable={false}
                                    className="
                                            group
                                            block
                                            shrink-0
                                            w-[72vw]
                                            sm:w-[58vw]
                                            md:w-[46vw]
                                            lg:w-[calc((100vw-390px)/2)]
                                            xl:w-[calc((100vw-440px)/2)]
                                        "
                                >
                                    {/* Fixed thumbnail geometry */}
                                    <div
                                        className="
                                                relative
                                                aspect-[4/5]
                                                w-full
                                                overflow-hidden
                                                bg-white/[0.025]
                                            "
                                    >
                                        <img
                                            src={
                                                journal.image
                                            }
                                            alt=""
                                            draggable={
                                                false
                                            }
                                            className="
                                                    absolute
                                                    inset-0
                                                    h-full
                                                    w-full
                                                    object-cover
                                                    transition-transform
                                                    duration-[1400ms]
                                                    ease-out
                                                    group-hover:scale-[1.025]
                                                "
                                        />
                                        <div
                                            aria-hidden="true"
                                            className="
                                                    absolute
                                                    inset-0
                                                    bg-black/0
                                                    transition-colors
                                                    duration-700
                                                    group-hover:bg-black/15
                                                "
                                        />
                                        <div
                                            className="
                                                    absolute
                                                    inset-x-0
                                                    bottom-0
                                                    translate-y-3
                                                    bg-gradient-to-t
                                                    from-black/80
                                                    via-black/30
                                                    to-transparent
                                                    px-6
                                                    pb-6
                                                    pt-20
                                                    opacity-0
                                                    transition-all
                                                    duration-700
                                                    ease-out
                                                    group-hover:translate-y-0
                                                    group-hover:opacity-100
                                                "
                                        >
                                            <p
                                                className="
                                                        font-sans
                                                        text-[9px]
                                                        font-medium
                                                        uppercase
                                                        tracking-[0.28em]
                                                        text-brand-gold
                                                    "
                                            >
                                                Explore
                                                →
                                            </p>
                                        </div>
                                    </div>
                                    {/* Copy always aligned */}
                                    <div className="pt-6">
                                        <div
                                            className="
                                                    mb-3
                                                    flex
                                                    items-center
                                                    gap-3
                                                    font-sans
                                                    text-[9px]
                                                    font-medium
                                                    uppercase
                                                    tracking-[0.28em]
                                                "
                                        >
                                            <span className="text-brand-gold">
                                                {
                                                    journal.category
                                                }
                                            </span>
                                            <span
                                                aria-hidden="true"
                                                className="h-px w-6 bg-white/20"
                                            />
                                            <span className="text-white/35">
                                                {
                                                    journal.year
                                                }
                                            </span>
                                        </div>
                                        <h3
                                            className="
                                                    min-h-[2em]
                                                    max-w-sm
                                                    font-display
                                                    text-3xl
                                                    font-light
                                                    leading-[1]
                                                    text-white/80
                                                    transition-colors
                                                    duration-500
                                                    group-hover:text-white
                                                    md:text-4xl
                                                "
                                        >
                                            {
                                                journal.title
                                            }
                                        </h3>
                                    </div>
                                </Link>
                            ),
                        )}
                    </KineticCarousel>
                </div>
            </div>
        </section>
    );
}
