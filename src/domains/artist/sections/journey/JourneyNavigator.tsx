"use client";
import { useTranslations } from "next-intl";

import {
    useEffect,
    useRef,
    useState,
} from "react";

const MAX_DISTANCE = 82;

export default function JourneyNavigator() {
    const t = useTranslations("Artist");
    const JOURNEY_ITEMS = [
        {
            index: 0,
            number: "01",
            date: t("journey.navigation.item1.date"),
            label: t("journey.navigation.item1.label"),
        },
        {
            index: 1,
            number: "02",
            date: t("journey.navigation.item2.date"),
            label: t("journey.navigation.item2.label"),
        },
        {
            index: 2,
            number: "03",
            date: t("journey.navigation.item3.date"),
            label: t("journey.navigation.item3.label"),
        },
        {
            index: 3,
            number: "04",
            date: t("journey.navigation.item4.date"),
            label: t("journey.navigation.item4.label"),
        },
        {
            index: 4,
            number: "05",
            date: t("journey.navigation.item5.date"),
            label: t("journey.navigation.item5.label"),
        },
    ];

    const [activeIndex, setActiveIndex] =
        useState<number | null>(0);

    const [pointerY, setPointerY] =
        useState<number | null>(null);

    const navigatorRef =
        useRef<HTMLDivElement | null>(null);

    const buttonRefs =
        useRef<
            Array<HTMLButtonElement | null>
        >([]);

    /* ==========================================
       ACTIVE CHAPTER
    ========================================== */

    useEffect(() => {
        const handleProgress = (
            event: Event,
        ) => {
            const customEvent =
                event as CustomEvent<{
                    index: number | null;
                }>;

            setActiveIndex(
                customEvent.detail.index,
            );
        };

        window.addEventListener(
            "journey:progress",
            handleProgress,
        );

        return () => {
            window.removeEventListener(
                "journey:progress",
                handleProgress,
            );
        };
    }, []);

    /* ==========================================
       NAVIGATION
    ========================================== */

    const navigateTo = (
        index: number,
    ) => {
        window.dispatchEvent(
            new CustomEvent(
                "journey:navigate",
                {
                    detail: {
                        index,
                    },
                },
            ),
        );
    };

    /* ==========================================
       POINTER PROXIMITY
    ========================================== */

    const handlePointerMove = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        setPointerY(event.clientY);
    };

    const handlePointerLeave = () => {
        setPointerY(null);
    };

    const getProximity = (
        index: number,
    ) => {
        if (pointerY === null) {
            return 0;
        }

        const button =
            buttonRefs.current[index];

        if (!button) {
            return 0;
        }

        const rect =
            button.getBoundingClientRect();

        const centerY =
            rect.top +
            rect.height / 2;

        const distance =
            Math.abs(
                pointerY - centerY,
            );

        return Math.max(
            0,
            1 -
            distance /
            MAX_DISTANCE,
        );
    };

    return (
        <div
            ref={navigatorRef}
            data-journey-navigator
            aria-label={t("journey.navigationLabel")}
            onPointerMove={
                handlePointerMove
            }
            onPointerLeave={
                handlePointerLeave
            }
            className="
        pointer-events-auto
        absolute
        right-3
        top-1/2
        z-20
        hidden
        -translate-y-1/2
        lg:block
        xl:right-[-6%]
      "
        >
            <div
                className="
          relative
          flex
          flex-col
          items-center
          px-2
          py-5
        "
            >
                {/* Vertical guide */}
                <div
                    aria-hidden="true"
                    className="
            absolute
            bottom-7
            left-1/2
            top-7
            w-px
            -translate-x-1/2
            bg-gradient-to-b
            from-transparent
            via-white/15
            to-transparent
          "
                />

                <ol
                    className="
            relative
            flex
            flex-col
            items-center
            gap-7
          "
                >
                    {JOURNEY_ITEMS.map(
                        (item) => {
                            const isActive =
                                item.index ===
                                activeIndex;

                            const proximity =
                                getProximity(
                                    item.index,
                                );

                            /*
                             * 1.00 → 1.90
                             *
                             * The closest dot grows the most.
                             * Neighbouring dots inherit a
                             * progressively smaller scale.
                             */
                            const scale =
                                1 +
                                proximity * 0.9;

                            const opacity =
                                0.35 +
                                proximity * 0.5;

                            return (
                                <li
                                    key={item.number}
                                    className="
                                        relative
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    <button
                                        ref={(element) => {
                                            buttonRefs.current[
                                                item.index
                                            ] = element;
                                        }}
                                        type="button"
                                        onClick={() =>
                                            navigateTo(
                                                item.index,
                                            )
                                        }
                                        aria-label={`${item.date} — ${item.label}`}
                                        aria-current={
                                            isActive
                                                ? "step"
                                                : undefined
                                        }
                                        className="
                                            group
                                            relative
                                            flex
                                            h-7
                                            w-7
                                            items-center
                                            justify-center
                                            rounded-full
                                            outline-none
                                            "
                                    >
                                        {/* Date */}
                                        <span
                                            style={{
                                                opacity:
                                                    isActive
                                                        ? 1
                                                        : Math.max(
                                                            0,
                                                            proximity,
                                                        ),
                                                transform: `
                                                translateX(${isActive
                                                        ? 0
                                                        : -6 +
                                                        proximity * 6
                                                    }px)
                                            `,
                                            }}
                                            className={`
                                                pointer-events-none
                                                absolute
                                                left-full
                                                ml-5
                                                whitespace-nowrap
                                                font-sans
                                                text-[9px]
                                                uppercase
                                                tracking-[0.16em]
                                                transition-[opacity,transform,color]
                                                duration-300

                                                ${isActive
                                                    ? "text-brand-gold/85"
                                                    : "text-white/45"
                                                }
                                            `}
                                        >
                                            {item.date}
                                        </span>

                                        {/* Active halo */}
                                        <span
                                            aria-hidden="true"
                                            style={{
                                                transform: `
                          scale(${1 +
                                                    proximity *
                                                    0.18
                                                    })
                        `,
                                            }}
                                            className={`
                        absolute
                        rounded-full
                        border
                        transition-[width,height,border-color,opacity]
                        duration-500

                        ${isActive
                                                    ? "h-5 w-5 border-brand-gold/30 opacity-100"
                                                    : "h-3 w-3 border-transparent opacity-0"
                                                }
                      `}
                                        />

                                        {/* Dot */}
                                        <span
                                            aria-hidden="true"
                                            style={{
                                                transform: `
                          scale(${scale})
                        `,
                                                opacity:
                                                    isActive
                                                        ? 1
                                                        : opacity,
                                            }}
                                            className={`
                        relative
                        block
                        h-1.5
                        w-1.5
                        rounded-full
                        transition-[transform,opacity,background-color,box-shadow]
                        duration-150
                        ease-out
                        will-change-transform

                        ${isActive
                                                    ? "bg-brand-gold shadow-[0_0_12px_rgba(201,163,90,0.35)]"
                                                    : "bg-white"
                                                }
                      `}
                                        />
                                    </button>
                                </li>
                            );
                        },
                    )}
                </ol>
            </div>
        </div>
    );
}