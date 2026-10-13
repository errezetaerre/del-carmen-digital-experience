"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { GLASS_BOOK_AUTO_QUERY } from "./glass-artbook/runtime.mjs";

/** Touch landscape opens the book; an explicit standard choice stays standard. */
export default function ArtworkDetailResponsiveEntry({
    children, glassHref, enabled,
}: { children: ReactNode; glassHref: string; enabled: boolean }) {
    const router = useRouter();
    useEffect(() => {
        if (!enabled) return;
        const viewport = window.matchMedia(GLASS_BOOK_AUTO_QUERY);
        let pendingDialog: MutationObserver | null = null;
        let requested = false;
        const update = () => {
            if (!viewport.matches) {
                requested = false;
                pendingDialog?.disconnect();
                pendingDialog = null;
                return;
            }
            if (requested) return;
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
