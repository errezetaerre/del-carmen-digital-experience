"use client";

import { useEffect, useRef, type RefObject } from "react";

type FocusOptions = { initialFocus?: HTMLElement | null; onEscape?: () => void };
type DialogEntry = { root: HTMLElement };
const dialogs = new WeakMap<Document, DialogEntry[]>();
const controls = 'a[href], area[href], button, input:not([type="hidden"]), select, textarea, iframe, [tabindex], [contenteditable="true"]';

export function bindDialogFocus(root: HTMLElement, options: FocusOptions = {}): () => void {
    const document = root.ownerDocument, view = document?.defaultView;
    if (!view || !root.isConnected) return () => {};
    const previous = document.activeElement instanceof view.HTMLElement ? document.activeElement : null;
    const stack = dialogs.get(document) ?? [];
    const entry = { root };
    stack.push(entry); dialogs.set(document, stack);
    const originalTabIndex = root.getAttribute("tabindex");
    let disposed = false;
    const top = () => !disposed && root.isConnected && stack[stack.length - 1] === entry;
    function visible(element: HTMLElement) {
        const style = view!.getComputedStyle(element);
        return element.isConnected && !element.matches(":disabled") &&
            !element.closest('[hidden], [inert], [aria-hidden="true"]') &&
            style.visibility !== "hidden" && style.visibility !== "collapse" && element.getClientRects().length > 0;
    }
    function tabbable() {
        return Array.from(root.querySelectorAll<HTMLElement>(controls)).filter(element => element.tabIndex >= 0 && visible(element))
            .sort((a, b) => (a.tabIndex || Number.MAX_SAFE_INTEGER) - (b.tabIndex || Number.MAX_SAFE_INTEGER));
    }
    function focusInside() {
        const requested = options.initialFocus;
        const target = requested && root.contains(requested) && visible(requested) ? requested : tabbable()[0];
        if (target) target.focus({ preventScroll: true });
        else { root.setAttribute("tabindex", "-1"); root.focus({ preventScroll: true }); }
    }
    function keyboard(event: KeyboardEvent) {
        if (!top()) return;
        if (event.key === "Escape" && options.onEscape) {
            event.preventDefault(); event.stopPropagation(); options.onEscape(); return;
        }
        if (event.key !== "Tab") return;
        const candidates = tabbable(), first = candidates[0], last = candidates[candidates.length - 1];
        const active = document.activeElement;
        if (!first) { event.preventDefault(); focusInside(); return; }
        if (!root.contains(active) || active === root || !candidates.some(element => element === active)) {
            event.preventDefault(); (event.shiftKey ? last : first).focus({ preventScroll: true });
        } else if (event.shiftKey && active === first) {
            event.preventDefault(); last.focus({ preventScroll: true });
        } else if (!event.shiftKey && active === last) {
            event.preventDefault(); first.focus({ preventScroll: true });
        }
    }
    function escaped(event: FocusEvent) {
        if (top() && !root.contains(event.target as Node | null)) focusInside();
    }
    document.addEventListener("keydown", keyboard, true);
    document.addEventListener("focusin", escaped, true);
    focusInside();
    return () => {
        if (disposed) return;
        const wasTop = stack[stack.length - 1] === entry;
        disposed = true;
        document.removeEventListener("keydown", keyboard, true);
        document.removeEventListener("focusin", escaped, true);
        const index = stack.indexOf(entry); if (index >= 0) stack.splice(index, 1);
        if (!stack.length) dialogs.delete(document);
        if (originalTabIndex === null) root.removeAttribute("tabindex"); else root.setAttribute("tabindex", originalTabIndex);
        if (!wasTop) return;
        const parent = stack[stack.length - 1]?.root;
        if (previous && visible(previous) && (!parent || parent.contains(previous))) previous.focus({ preventScroll: true });
        else if (parent?.isConnected) {
            const target = Array.from(parent.querySelectorAll<HTMLElement>(controls)).find(element => element.tabIndex >= 0 && visible(element));
            target?.focus({ preventScroll: true });
        }
    };
}

export default function useDialogFocus(
    dialogRef: RefObject<HTMLElement | null>,
    open: boolean,
    options: { initialFocusRef?: RefObject<HTMLElement | null>; onEscape?: () => void } = {},
) {
    const latest = useRef(options);
    latest.current = options;
    const handlesEscape = Boolean(options.onEscape);
    useEffect(() => {
        const root = dialogRef.current;
        if (!open || !root) return;
        return bindDialogFocus(root, { initialFocus: latest.current.initialFocusRef?.current,
            onEscape: handlesEscape ? () => latest.current.onEscape?.() : undefined });
    }, [dialogRef, open, handlesEscape]);
}
