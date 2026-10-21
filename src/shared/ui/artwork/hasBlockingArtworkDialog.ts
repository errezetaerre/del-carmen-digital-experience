// A gallery dialog contains its book. A nested image zoom or an unrelated
// modal pauses that book, while its own gallery dialog must allow gestures.
export function hasBlockingArtworkDialog(root: HTMLElement) {
    return Array.from(root.ownerDocument.querySelectorAll('[role="dialog"][aria-modal="true"]'))
        .some(dialog => !dialog.contains(root));
}
