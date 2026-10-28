"use client";

import type { ComponentProps } from "react";
import Link from "@/i18n/navigation";
import { setArtworkExperiencePreference } from "./artworkExperiencePreference";

export default function ArtworkOpenArtbook(props: ComponentProps<typeof Link>) {
    return <Link {...props} onClick={event => {
        props.onClick?.(event);
        if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
            setArtworkExperiencePreference("glass");
        }
    }} />;
}
