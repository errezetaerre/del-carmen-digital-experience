"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { GLASS_BOOK_AUTO_QUERY } from "./glass-artbook/runtime.mjs";

// Exit defers only the immediately following standard visit. A later visit
// or rotation can open the book again; no preference is written to the URL.
let deferredEntryHref: string | null = null;
export function deferAutomaticArtbookEntry(glassHref: string) {
    deferredEntryHref = glassHref;
}

/** Touch landscape opens the book without interrupting the image viewer. */
export default function ArtworkDetailResponsiveEntry({
    children, glassHref, enabled,
}: { children: ReactNode; glassHref: string; enabled: boolean }) {
    const router = useRouter();
    const entryRef = useRef<{ href: string; deferred: boolean } | null>(null);
    useEffect(() => {
        if (!enabled) return;
        if (entryRef.current?.href !== glassHref) {
            entryRef.current = { href: glassHref, deferred: deferredEntryHref === glassHref };
            if (deferredEntryHref === glassHref) deferredEntryHref = null;
        }
        const viewport = window.matchMedia(GLASS_BOOK_AUTO_QUERY);
        let pendingDialog: MutationObserver | null = null;
        let requested = false;
        const update = () => {
            if (!viewport.matches) {
                if (entryRef.current) entryRef.current.deferred = false;
                requested = false;
                pendingDialog?.disconnect();
                pendingDialog = null;
                return;
            }
            if (requested || entryRef.current?.deferred) return;
            if (document.querySelector('[role="dialog"][aria-modal="true"]')) {
                if (!pendingDialog) {
                    pendingDialog = new MutationObserver(update);
                    pendingDialog.observe(document.body, { childList: true, subtree: true });
                }
                return;
            }
            pendingDialog?.disconnect();
            pendingDialog = null;
            requested = true;
            router.replace(glassHref, { scroll: false });
        };
        update();
        viewport.addEventListener("change", update);
        return () => {
            viewport.removeEventListener("change", update);
            pendingDialog?.disconnect();
        };
    }, [enabled, glassHref, router]);
    return children;
}
