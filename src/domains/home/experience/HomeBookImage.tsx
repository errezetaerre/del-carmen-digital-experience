"use client";

import { useRef, type ReactNode } from "react";

/** A click opens the work; a horizontal drag still reaches the approved page engine. */
export default function HomeBookImage({ children, label, className, onOpen }: {
    children: ReactNode; label: string; className?: string; onOpen(): void;
}) {
    const grip = useRef<{ x: number; y: number; moved: boolean } | null>(null);
    return <div role="button" tabIndex={0} className={className} data-home-book-image aria-label={label}
        onPointerDown={event => { grip.current = { x: event.clientX, y: event.clientY, moved: false }; }}
        onPointerMove={event => { const start = grip.current; if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) start.moved = true; }}
        onPointerCancel={() => { if (grip.current) grip.current.moved = true; }}
        onClick={event => { if (grip.current?.moved) { grip.current = null; event.preventDefault(); return; } grip.current = null; onOpen(); }}
        onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); grip.current = null; onOpen(); } }}>
        {children}
    </div>;
}
