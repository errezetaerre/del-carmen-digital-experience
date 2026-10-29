"use client";

import { useId, useLayoutEffect, useRef } from "react";
import { glassRimMarkup } from "@/shared/ui/artwork/glassAccents";
import type { SeriesGlassReflection } from "@/domains/artworks/series/components/experience/seriesGlassReflection";

export default function HomeBookMaterial({ material }: { material: SeriesGlassReflection }) {
    const ref = useRef<HTMLDivElement>(null), id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
    useLayoutEffect(() => {
        const rim = ref.current, page = rim?.parentElement;
        if (!rim || !page) return;
        let previous = "";
        const measure = () => {
            const { width, height } = page.getBoundingClientRect(), signature = `${width}/${height}`;
            if (!width || !height || previous === signature) return;
            previous = signature;
            rim.innerHTML = glassRimMarkup(`home-${id}-left`, width, height, -1) + glassRimMarkup(`home-${id}-right`, width, height, 1);
            material.render(page);
        };
        const observer = new ResizeObserver(measure); observer.observe(page); measure();
        return () => observer.disconnect();
    }, [id, material]);
    return <><div className="reflection" aria-hidden="true"><span className="page-glow" data-series-glow="left" /><span className="page-glow" data-series-glow="right" /></div>
        <div className="rim" ref={ref} aria-hidden="true" /></>;
}
