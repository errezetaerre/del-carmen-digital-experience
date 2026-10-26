type BackgroundState = {
    roots: HTMLElement[];
    original: Map<HTMLElement, boolean>;
    observer: MutationObserver;
};

const states = new WeakMap<Document, BackgroundState>();

// Only the top dialog stays interactive. Walk its ancestor chain so this also
// works for a menu inside the app, nested dialogs and portals added afterwards.
function updateBackground(document: Document, state: BackgroundState) {
    const root = state.roots.findLast(element => element.isConnected);
    const outside = new Set<HTMLElement>();
    const HTMLElement = document.defaultView!.HTMLElement;
    if (root) {
        for (let branch = root; branch.parentElement; branch = branch.parentElement) {
            for (const sibling of branch.parentElement.children) {
                if (sibling !== branch && sibling instanceof HTMLElement &&
                    !["SCRIPT", "STYLE", "LINK"].includes(sibling.tagName)) outside.add(sibling);
            }
            if (branch.parentElement === document.body) break;
        }
    }

    for (const [element, inert] of state.original) {
        if (!outside.has(element)) {
            element.inert = inert;
            state.original.delete(element);
        }
    }
    for (const element of outside) {
        if (!state.original.has(element)) state.original.set(element, element.inert);
        element.inert = true;
    }
}

export function isolateDialog(root: HTMLElement): () => void {
    const document = root.ownerDocument;
    const view = document.defaultView;
    if (!view || !root.isConnected) return () => {};
    let state = states.get(document);
    if (!state) {
        const next: BackgroundState = {
            roots: [],
            original: new Map(),
            observer: new view.MutationObserver(() => updateBackground(document, next)),
        };
        state = next;
        states.set(document, state);
        state.observer.observe(document.body, { childList: true, subtree: true });
    }
    const current = state;
    current.roots.push(root);
    updateBackground(document, current);
    let disposed = false;
    return () => {
        if (disposed) return;
        disposed = true;
        const index = current.roots.lastIndexOf(root);
        if (index >= 0) current.roots.splice(index, 1);
        if (!current.roots.length) {
            current.observer.disconnect();
            states.delete(document);
        }
        updateBackground(document, current);
    };
}
