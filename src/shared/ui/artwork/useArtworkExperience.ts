"use client";

import { useEffect, useSyncExternalStore } from "react";
import { artworkExperiencePreference, setArtworkExperiencePreference, subscribeArtworkExperiencePreference } from "./artworkExperiencePreference";

const serverPreference = () => null;

export default function useArtworkExperience() {
    const preference = useSyncExternalStore(subscribeArtworkExperiencePreference, artworkExperiencePreference, serverPreference);
    useEffect(() => {
        if (preference) setArtworkExperiencePreference(preference);
    }, [preference]);
    return preference;
}
