"use client";



import Link from "next/link";

import {

    useEffect,

    useMemo,

    useRef,

    useState,

} from "react";



import gsap from "gsap";



import type { JournalEntry } from "../../types";



interface JournalCollectionProps {

    entries: JournalEntry[];

    currentSlug: string;

}



const EDGE_RESISTANCE = 0.18;

const MOMENTUM_FACTOR = 0.24;

const MAX_MOMENTUM = 700;



export default function JournalCollection({

    entries,

    currentSlug,

}: JournalCollectionProps) {

    const viewportRef = useRef<HTMLDivElement>(null);

    const trackRef = useRef<HTMLDivElement>(null);



    const positionRef = useRef(0);

    const minXRef = useRef(0);



    const draggingRef = useRef(false);

    const movedRef = useRef(false);



    const pointerStartRef = useRef(0);

    const positionStartRef = useRef(0);



    const lastPointerRef = useRef(0);

    const lastTimeRef = useRef(0);

    const velocityRef = useRef(0);



    const momentumRef = useRef<gsap.core.Tween | null>(

        null,

    );



    const [dragging, setDragging] = useState(false);



    const [canMoveLeft, setCanMoveLeft] =

        useState(false);



    const [canMoveRight, setCanMoveRight] =

        useState(false);



    const collection = useMemo(

        () =>

            entries.filter(

                (entry) => entry.slug !== currentSlug,

            ),

        [entries, currentSlug],

    );



    function updateDirectionState(position: number) {

        const tolerance = 2;



        setCanMoveLeft(position < -tolerance);



        setCanMoveRight(

            position >

            minXRef.current + tolerance,

        );

    }



    useEffect(() => {

        const viewport = viewportRef.current;

        const track = trackRef.current;



        if (!viewport || !track) {

            return;

        }



        const updateBounds = () => {

            const viewportWidth =

                viewport.getBoundingClientRect().width;



            const trackWidth = track.scrollWidth;



            minXRef.current = Math.min(

                0,

                viewportWidth - trackWidth,

            );



            const next = gsap.utils.clamp(

                minXRef.current,

                0,

                positionRef.current,

            );



            positionRef.current = next;



            gsap.set(track, {

                x: next,

            });



            updateDirectionState(next);

        };



        updateBounds();



        const observer = new ResizeObserver(

            updateBounds,

        );



        observer.observe(viewport);

        observer.observe(track);



        return () => {

            observer.disconnect();

            momentumRef.current?.kill();

        };

    }, [collection.length]);



    function stopMomentum() {

        momentumRef.current?.kill();

        momentumRef.current = null;

    }



    function renderPosition(

        nextPosition: number,

        allowResistance = false,

    ) {

        const track = trackRef.current;



        if (!track) {

            return;

        }



        let next = nextPosition;



        if (allowResistance) {

            if (next > 0) {

                next *= EDGE_RESISTANCE;

            }



            if (next < minXRef.current) {

                const overflow =

                    next - minXRef.current;



                next =

                    minXRef.current +

                    overflow * EDGE_RESISTANCE;

            }

        } else {

            next = gsap.utils.clamp(

                minXRef.current,

                0,

                next,

            );

        }



        positionRef.current = next;



        gsap.set(track, {

            x: next,

        });



        updateDirectionState(next);

    }



    function settle() {

        const track = trackRef.current;



        if (!track) {

            return;

        }



        const destination = gsap.utils.clamp(

            minXRef.current,

            0,

            positionRef.current,

        );



        momentumRef.current = gsap.to(track, {

            x: destination,

            duration: 0.55,

            ease: "power3.out",



            onUpdate() {

                const current =

                    Number(

                        gsap.getProperty(track, "x"),

                    ) || destination;



                positionRef.current = current;

                updateDirectionState(current);

            },



            onComplete() {

                positionRef.current = destination;

                updateDirectionState(destination);



                momentumRef.current = null;

            },

        });

    }



    function releaseWithMomentum() {

        const track = trackRef.current;



        if (!track) {

            return;

        }



        const projectedVelocity =

            gsap.utils.clamp(

                -MAX_MOMENTUM,

                MAX_MOMENTUM,

                velocityRef.current *

                MOMENTUM_FACTOR,

            );



        const projected =

            positionRef.current +

            projectedVelocity;



        const destination = gsap.utils.clamp(

            minXRef.current,

            0,

            projected,

        );



        const distance = Math.abs(

            destination - positionRef.current,

        );



        if (distance < 2) {

            settle();

            return;

        }



        const duration = gsap.utils.clamp(

            0.45,

            1.15,

            distance / 850 + 0.45,

        );



        momentumRef.current = gsap.to(track, {

            x: destination,

            duration,

            ease: "power3.out",



            onUpdate() {

                const current =

                    Number(

                        gsap.getProperty(track, "x"),

                    ) || destination;



                positionRef.current = current;

                updateDirectionState(current);

            },



            onComplete() {

                positionRef.current = destination;

                updateDirectionState(destination);



                momentumRef.current = null;

            },

        });

    }



    function moveCollection(direction: -1 | 1) {

        const viewport = viewportRef.current;

        const track = trackRef.current;



        if (!viewport || !track) {

            return;

        }



        stopMomentum();



        const distance =

            viewport.getBoundingClientRect().width *

            0.72;



        const destination = gsap.utils.clamp(

            minXRef.current,

            0,

            positionRef.current -

            distance * direction,

        );



        momentumRef.current = gsap.to(track, {

            x: destination,

            duration: 0.85,

            ease: "power3.out",



            onUpdate() {

                const current =

                    Number(

                        gsap.getProperty(track, "x"),

                    ) || destination;



                positionRef.current = current;

                updateDirectionState(current);

            },



            onComplete() {

                positionRef.current = destination;

                updateDirectionState(destination);



                momentumRef.current = null;

            },

        });

    }



    function handlePointerDown(

        event: React.PointerEvent<HTMLDivElement>,

    ) {

        if (

            event.pointerType === "mouse" &&

            event.button !== 0

        ) {

            return;

        }



        stopMomentum();



        draggingRef.current = true;

        movedRef.current = false;



        setDragging(true);



        pointerStartRef.current = event.clientX;

        positionStartRef.current =

            positionRef.current;



        lastPointerRef.current = event.clientX;

        lastTimeRef.current = performance.now();



        velocityRef.current = 0;



        event.currentTarget.setPointerCapture(

            event.pointerId,

        );

    }



    function handlePointerMove(

        event: React.PointerEvent<HTMLDivElement>,

    ) {

        if (!draggingRef.current) {

            return;

        }



        const delta =

            event.clientX -

            pointerStartRef.current;



        if (Math.abs(delta) > 8) {

            movedRef.current = true;

        }



        renderPosition(

            positionStartRef.current + delta,

            true,

        );



        const now = performance.now();



        const elapsed = Math.max(

            now - lastTimeRef.current,

            1,

        );



        const pointerDelta =

            event.clientX -

            lastPointerRef.current;



        const instantaneousVelocity =

            (pointerDelta / elapsed) * 1000;



        velocityRef.current =

            velocityRef.current * 0.72 +

            instantaneousVelocity * 0.28;



        lastPointerRef.current = event.clientX;

        lastTimeRef.current = now;

    }



    function handlePointerUp(

        event: React.PointerEvent<HTMLDivElement>,

    ) {

        if (!draggingRef.current) {

            return;

        }



        draggingRef.current = false;

        setDragging(false);



        if (

            event.currentTarget.hasPointerCapture(

                event.pointerId,

            )

        ) {

            event.currentTarget.releasePointerCapture(

                event.pointerId,

            );

        }



        releaseWithMomentum();

    }



    function handleWheel(

        event: React.WheelEvent<HTMLDivElement>,

    ) {

        if (minXRef.current === 0) {

            return;

        }



        const horizontalIntent =

            Math.abs(event.deltaX) >

            Math.abs(event.deltaY) * 1.25 ||

            event.shiftKey;



        if (!horizontalIntent) {

            return;

        }



        event.preventDefault();



        stopMomentum();



        const delta = event.shiftKey

            ? event.deltaY

            : event.deltaX;



        renderPosition(

            positionRef.current - delta * 0.65,

        );

    }



    function handleClickCapture(

        event: React.MouseEvent<HTMLDivElement>,

    ) {

        if (!movedRef.current) {

            return;

        }



        event.preventDefault();

        event.stopPropagation();



        movedRef.current = false;

    }



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

                        lg:py-2

                        lg:pl-[clamp(4rem,7vw,8rem)]

                        lg:pr-0

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

                    <div

                        className="

                            mb-5

                            flex

                            min-h-5

                            items-center

                            justify-end

                            pr-5

                        "

                    >

                        <p

                            className="

                                font-sans

                                text-[8px]

                                font-medium

                                uppercase

                                tracking-[0.3em]

                                text-white/25

                            "

                        >

                            Drag or swipe to explore ↔

                        </p>

                    </div>

                    <div

                        ref={viewportRef}



                        data-journal-collection-viewport
                        onPointerDown={

                            handlePointerDown

                        }

                        onPointerMove={

                            handlePointerMove

                        }

                        onPointerUp={

                            handlePointerUp

                        }

                        onPointerCancel={

                            handlePointerUp

                        }

                        onWheel={handleWheel}

                        onClickCapture={

                            handleClickCapture

                        }

                        className={[

                            `

                                relative

                                select-none

                                overflow-hidden

                                overscroll-x-contain

                                touch-pan-y

                            `,

                            dragging

                                ? "cursor-grabbing"

                                : "cursor-grab",

                        ].join(" ")}

                    >

                        <div

                            ref={trackRef}

                            className="

                                flex

                                w-max

                                items-start

                                gap-5

                                will-change-transform

                                lg:gap-5

                            "

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

                                            w-[32vw]

                                            sm:w-[32vw]

                                            md:w-[150px]

                                            lg:w-[190px]

                                            xl:w-[250px]

                                            2xl:w-[215px]

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

                        </div>

                    </div>



                    {/* Left direction indicator */}

                    <button

                        type="button"

                        aria-label="Explore previous journals"

                        onClick={() =>

                            moveCollection(-1)

                        }

                        className={[

                            `

                            absolute

                            left-3

                            top-[40%]

                            z-20

                            flex

                            h-11

                            w-11

                            -translate-y-1/2

                            items-center

                            justify-center

                            rounded-full

                            border

                            border-white/10

                            bg-black/20

                            font-display

                            text-2xl

                            text-white/55

                            backdrop-blur-md

                            transition-all

                            duration-500

                            hover:border-brand-gold/30

                            hover:bg-black/35

                            hover:text-brand-gold

                            `,

                            canMoveLeft

                                ? "pointer-events-auto opacity-100"

                                : "pointer-events-none opacity-0",

                        ].join(" ")}

                    >

                        ‹

                    </button>



                    {/* Right direction indicator */}

                    <button

                        type="button"

                        aria-label="Explore more journals"

                        onClick={() =>

                            moveCollection(1)

                        }

                        className={[

                            `

                            absolute

                            right-5

                            top-[40%]

                            z-20

                            flex

                            h-11

                            w-11

                            -translate-y-1/2

                            items-center

                            justify-center

                            rounded-full

                            border

                            border-white/10

                            bg-black/20

                            font-display

                            text-2xl

                            text-white/55

                            backdrop-blur-md

                            transition-all

                            duration-500

                            hover:border-brand-gold/30

                            hover:bg-black/35

                            hover:text-brand-gold

                            `,

                            canMoveRight

                                ? "pointer-events-auto opacity-100"

                                : "pointer-events-none opacity-0",

                        ].join(" ")}

                    >

                        ›

                    </button>

                </div>

            </div>

        </section>

    );

}