"use client";

import {
    useEffect,
    useState,
} from "react";
import useClientReady from "@/shared/hooks/useClientReady";

interface InteractionHintProps {
    active: boolean;
    dismissed?: boolean;
    label: string;
    className?: string;
    visibility?: "all" | "coarse";
}

type HintPhase =
    | "primary"
    | "reminder"
    | null;

export default function InteractionHint({
    active,
    dismissed = false,
    label,
    className = "",
    visibility = "all",
}: InteractionHintProps) {
    const clientReady = useClientReady();
    const showHint = clientReady && active && !dismissed;
    const [phase, setPhase] =
        useState<HintPhase>(null);
    const [previousActive, setPreviousActive] = useState(showHint);
    if (previousActive !== showHint) {
        setPreviousActive(showHint);
        setPhase(showHint ? "primary" : null);
    }

    useEffect(() => {
        if (!showHint) return;

        const hidePrimary =
            window.setTimeout(() => {
                setPhase(null);
            }, 3200);

        const showReminder =
            window.setTimeout(() => {
                setPhase("reminder");
            }, 9000);

        const hideReminder =
            window.setTimeout(() => {
                setPhase(null);
            }, 11400);

        return () => {
            window.clearTimeout(
                hidePrimary,
            );

            window.clearTimeout(
                showReminder,
            );

            window.clearTimeout(
                hideReminder,
            );
        };
    }, [
        showHint,
    ]);

    if (!phase) {
        return null;
    }

    const visibilityClass =
        visibility === "coarse"
            ? "hidden [@media(pointer:coarse)]:flex"
            : "flex";

    const animationClass =
        phase === "primary"
            ? "animate-[interactionHintPrimary_3.2s_cubic-bezier(0.22,1,0.36,1)_both]"
            : "animate-[interactionHintReminder_2.4s_ease-in-out_both]";

    return (
        <div
            aria-hidden="true"
            className={[
                "pointer-events-none",
                "absolute",
                "inset-0",
                "z-40",
                "items-center",
                "justify-center",
                visibilityClass,
                animationClass,
                className,
            ].join(" ")}
        >
            <div
                className="
                    flex
                    items-center
                    gap-5
                    rounded-full
                    bg-black/30
                    px-5
                    py-3
                    backdrop-blur-md
                "
            >
                <span
                    className="
                        font-display
                        text-lg
                        text-white/40
                    "
                >
                    ‹
                </span>

                <span
                    className="
                        font-sans
                        text-[9px]
                        font-medium
                        uppercase
                        tracking-[0.3em]
                        text-white/70
                    "
                >
                    {label}
                </span>

                <span
                    className="
                        font-display
                        text-lg
                        text-white/40
                    "
                >
                    ›
                </span>
            </div>
        </div>
    );
}
