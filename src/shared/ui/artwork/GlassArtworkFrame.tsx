"use client";

import { useId, useLayoutEffect, useRef, useState, type HTMLAttributes } from "react";
import { glassRimMarkup } from "./glassAccents";
import styles from "./ArtworkLightbox.module.css";

export default function GlassArtworkFrame({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
    const frameRef = useRef<HTMLDivElement>(null);
    const instanceId = `frame${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
    const [size, setSize] = useState({ width: 624, height: 940 });
    useLayoutEffect(() => {
        const frame = frameRef.current;
        if (!frame) return;
        const measure = () => {
            const width = frame.clientWidth;
            const height = frame.clientHeight;
            if (width > 0 && height > 0) setSize((previous) => previous.width === width && previous.height === height ? previous : { width, height });
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(frame);
        return () => { observer.disconnect(); };
    }, []);
    return (
        <div {...props} ref={frameRef} className={`${styles.glassPanel} ${className}`}>
            {children}
            <div aria-hidden="true" className={styles.rim} dangerouslySetInnerHTML={{ __html: glassRimMarkup(instanceId + "-left", size.width, size.height, -1) + glassRimMarkup(instanceId + "-right", size.width, size.height, 1) }} />
        </div>
    );
}
