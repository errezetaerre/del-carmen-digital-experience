import type { ReactNode } from "react";

/** Compatibility wrapper: the standard scene never opens the book automatically. */
export default function ArtworkDetailResponsiveEntry({
    children,
}: { children: ReactNode; glassHref?: string; enabled?: boolean }) {
    return children;
}
