"use client";

import { useEffect, type RefObject } from "react";

type SavedBoundary = { count: number; html: string; body: string };
const boundaries = new WeakMap<Document, SavedBoundary>();

/** Keep horizontal overscroll inside an active artwork experience. */
export function bindArtworkGestureBoundary(root: HTMLElement): () => void {
    const doc = root.ownerDocument;
    let saved = boundaries.get(doc);
    if (!saved) {
        saved = { count: 0, html: doc.documentElement.style.overscrollBehaviorX, body: doc.body.style.overscrollBehaviorX };
        boundaries.set(doc, saved);
        doc.documentElement.style.overscrollBehaviorX = "none";
        doc.body.style.overscrollBehaviorX = "none";
    }
    saved.count++;
    const stopHistorySwipe = (event: WheelEvent) => {
        if (!root.contains(event.target as Node) || event.ctrlKey) return;
        if (event.cancelable && (event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY))) event.preventDefault();
    };
    doc.addEventListener("wheel", stopHistorySwipe, { capture: true, passive: false });
    let disposed = false;
    return () => {
        if (disposed) return;
        disposed = true;
        doc.removeEventListener("wheel", stopHistorySwipe, true);
        const current = boundaries.get(doc);
        if (current && --current.count === 0) {
            doc.documentElement.style.overscrollBehaviorX = current.html;
            doc.body.style.overscrollBehaviorX = current.body;
            boundaries.delete(doc);
        }
    };
}

export default function useArtworkGestureBoundary(root: RefObject<HTMLElement | null>, enabled = true) {
    useEffect(() => {
        if (enabled && root.current) return bindArtworkGestureBoundary(root.current);
    }, [root, enabled]);
}
