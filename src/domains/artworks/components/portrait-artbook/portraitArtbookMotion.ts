import { hasBlockingArtworkDialog } from "@/shared/ui/artwork/hasBlockingArtworkDialog";
import gsap from "gsap";
import { bindArtworkTouchNavigation, type ArtworkDragInput } from "../artworkTouchNavigation";
import type { GlassArtbookLoadState } from "../glass-artbook/types";
import styles from "./ArtworkPortraitArtbook.module.css";

type Direction = -1 | 1;
interface Options {
    root: HTMLElement;
    frame: HTMLDivElement;
    overlay: HTMLDivElement;
    current: HTMLElement;
    previous: HTMLElement | null;
    next: HTMLElement | null;
    onLoad(state: GlassArtbookLoadState): void;
    onActivity(): void;
    onInteraction(): void;
    onLand(direction: Direction): void;
    onExit(): void;
    onArrival(): void;
}
export interface PortraitArtbookController {
    navigate(direction: Direction): void;
    retry(): void;
    dispose(): void;
}
interface Grip {
    id: number; x: number; y: number; lastX: number; lastTime: number;
    delta: number; velocity: number; direction: Direction | null; ended: boolean;
}
interface Turn {
    direction: Direction; leaf: HTMLElement; left: HTMLElement; right: HTMLElement;
    halfWidth: number; perspective: number; progress: number;
}

// A route/history update must not reinterpret the momentum tail as a new turn.
let wheelLocked = false;
let wheelUnlock: ReturnType<typeof setTimeout> | undefined;
function holdWheelTail() {
    wheelLocked = true;
    clearTimeout(wheelUnlock);
    wheelUnlock = setTimeout(() => { wheelLocked = false; }, 140);
}

// One full-width layout per artwork, clipped after layout. Never render text
// into half-width columns: words crossing the hinge must stay on their sheet.
function clonePage(source: HTMLElement, width: number, prefix: string) {
    const clone = source.cloneNode(true) as HTMLElement;
    clone.classList.add(styles.canvas);
    clone.style.width = `${width}px`;
    clone.style.visibility = "visible";
    clone.style.opacity = "1";
    clone.inert = true;
    clone.setAttribute("aria-hidden", "true");
    const originals = [source, ...source.querySelectorAll<HTMLElement>("*")];
    const copies = [clone, ...clone.querySelectorAll<HTMLElement>("*")];
    const ids = new Map<string, string>();
    copies.forEach((node) => { if (node.id) { ids.set(node.id, `${prefix}-${node.id}`); node.id = ids.get(node.id)!; } });
    copies.forEach((node) => {
        for (const attribute of Array.from(node.attributes)) {
            if (attribute.name === "id") continue;
            let value = attribute.value.replace(/url\(["']?#([^\s)"']+)["']?\)/g, (match, id: string) => ids.has(id) ? `url(#${ids.get(id)})` : match);
            if ((attribute.name === "href" || attribute.name === "xlink:href") && value.startsWith("#")) value = `#${ids.get(value.slice(1)) ?? value.slice(1)}`;
            if (["aria-labelledby", "aria-describedby", "aria-controls", "for"].includes(attribute.name)) value = value.split(" ").map(id => ids.get(id) ?? id).join(" ");
            if (value !== attribute.value) node.setAttribute(attribute.name, value);
        }
    });
    // Canvas pixels are transient decoration, not editorial content.
    clone.querySelectorAll("canvas").forEach(canvas => canvas.remove());
    return { clone, restoreScroll() {
        originals.forEach((node, i) => {
            if (node.scrollTop || node.scrollLeft) {
                copies[i].scrollTop = node.scrollTop;
                copies[i].scrollLeft = node.scrollLeft;
            }
        });
    } };
}

export function createPortraitArtbookMotion(options: Options): PortraitArtbookController {
    const { root, frame, overlay, current } = options;
    const doc = root.ownerDocument;
    const view = doc.defaultView!;
    const reducedMotion = view.matchMedia("(prefers-reduced-motion: reduce)");
    const cleanup: Array<() => void> = [];
    const imageJobs = new WeakMap<HTMLImageElement, Promise<boolean>>();
    const imageCancels = new Set<() => void>();
    let disposed = false, ready = false, settling = false, request = 0;
    let turn: Turn | null = null, grip: Grip | null = null;
    let wheelDistance = 0, wheelTimer: number | undefined;
    let demonstrationTimer: number | undefined;
    let demonstration: gsap.core.Timeline | null = null;
    let failedDirection: Direction | null = null;
    let frameWidth = frame.getBoundingClientRect().width;

    function neighbour(direction: Direction) { return direction === 1 ? options.next : options.previous; }
    function blocked() { return hasBlockingArtworkDialog(root); }
    function load(status: GlassArtbookLoadState["status"], page = current, kind: GlassArtbookLoadState["kind"] = "turn") {
        root.dataset.portraitLoading = String(status === "loading");
        options.onLoad({ status, artworkId: page.dataset.portraitPage ?? "", kind });
    }
    function waitForImage(image: HTMLImageElement): Promise<boolean> {
        const existing = imageJobs.get(image);
        if (existing) return existing;
        const promise = new Promise<boolean>(resolve => {
            let done = false, decoding = false;
            const timer = view.setTimeout(() => finish(false), 30000);
            const cancel = () => finish(false);
            function finish(ok: boolean) {
                if (done) return;
                done = true; view.clearTimeout(timer);
                image.removeEventListener("load", loaded); image.removeEventListener("error", cancel);
                imageCancels.delete(cancel); resolve(ok);
            }
            function loaded() {
                if (done || decoding) return;
                if (!image.naturalWidth || !image.naturalHeight) { finish(false); return; }
                decoding = true;
                Promise.resolve().then(() => typeof image.decode === "function" ? image.decode() : undefined)
                    .then(() => finish(true), () => finish(false));
            }
            imageCancels.add(cancel);
            image.addEventListener("load", loaded); image.addEventListener("error", cancel);
            // Only the current page and its two neighbours are mounted.
            image.loading = "eager";
            if (image.complete) loaded();
        });
        imageJobs.set(image, promise);
        return promise;
    }
    async function prepare(page: HTMLElement) {
        const images = Array.from(page.querySelectorAll<HTMLImageElement>("img"));
        const results = await Promise.all(images.map(waitForImage));
        await doc.fonts?.ready;
        // Halo measurement and the font layout must precede all four copies.
        await new Promise<void>(resolve => view.requestAnimationFrame(() => resolve()));
        return results.every(Boolean);
    }
    function clearWheel() {
        view.clearTimeout(wheelTimer); wheelTimer = undefined; wheelDistance = 0;
    }
    function clearTurn() {
        demonstration?.kill(); demonstration = null;
        if (turn) gsap.killTweensOf(turn);
        turn = null; settling = false;
        overlay.hidden = true; overlay.replaceChildren();
        overlay.style.removeProperty("width"); overlay.style.removeProperty("height");
        current.style.removeProperty("visibility"); current.style.removeProperty("opacity"); current.inert = false;
        delete root.dataset.portraitTurning;
        delete root.dataset.portraitProgress;
        delete root.dataset.portraitDemonstrating;
        delete root.dataset.portraitHintVisible;
    }
    function clearDemonstration() {
        view.clearTimeout(demonstrationTimer); demonstrationTimer = undefined;
        if (demonstration) clearTurn();
        delete root.dataset.portraitHintVisible;
    }
    function activity() {
        clearDemonstration();
        options.onActivity();
        scheduleDemonstration();
    }
    function interact() {
        clearDemonstration();
        options.onInteraction();
    }
    function scheduleDemonstration() {
        view.clearTimeout(demonstrationTimer); demonstrationTimer = undefined;
        if (disposed || !ready || doc.hidden || root.hasAttribute("data-portrait-learned")) return;
        const direction = options.next ? 1 : options.previous ? -1 : null;
        if (!direction) return;
        demonstrationTimer = view.setTimeout(() => {
            demonstrationTimer = undefined;
            if (disposed || root.hasAttribute("data-portrait-learned")) return;
            const selection = doc.getSelection();
            if (doc.hidden || blocked() || grip || turn || settling || current.querySelector("[data-artwork-reading-open]") || root.dataset.portraitLoading === "true" ||
                (selection?.toString() && current.contains(selection.anchorNode))) {
                scheduleDemonstration(); return;
            }
            root.dataset.portraitHintVisible = "";
            if (reducedMotion.matches) {
                demonstrationTimer = view.setTimeout(() => {
                    delete root.dataset.portraitHintVisible;
                    scheduleDemonstration();
                }, 2400);
                return;
            }
            // Teach the actual central hinge without navigating or revealing
            // another artwork. All four faces belong to the current page.
            const preview = build(direction, current);
            if (!preview) { clearDemonstration(); scheduleDemonstration(); return; }
            current.inert = false;
            root.dataset.portraitDemonstrating = "";
            const update = () => {
                if (blocked() || doc.hidden || reducedMotion.matches) { clearDemonstration(); scheduleDemonstration(); return; }
                draw(preview.progress);
            };
            demonstration = gsap.timeline({ onComplete() { clearTurn(); scheduleDemonstration(); } })
                .to(preview, { progress: .16, duration: .8, ease: "power2.out", onUpdate: update })
                .to(preview, { progress: 0, duration: 1, ease: "power3.in", onUpdate: update }, "+=.5");
        }, 5000);
    }
    function draw(progress: number) {
        if (!turn) return;
        turn.progress = Math.max(0, Math.min(1, progress));
        const angle = turn.progress * Math.PI;
        const depth = Math.sin(angle);
        overlay.style.setProperty("--portrait-fold", String(depth));
        turn.leaf.style.setProperty("--portrait-depth", `${depth}px`);
        turn.leaf.style.transform = `rotateY(${-turn.direction * turn.progress * 180}deg)`;
        root.dataset.portraitProgress = turn.progress.toFixed(5);
        // Reveal only the area uncovered by the actual projected glass plane.
        // This avoids ghost text showing through its transparent material.
        const projected = turn.halfWidth * Math.cos(angle) * turn.perspective /
            (turn.perspective - turn.halfWidth * Math.sin(angle));
        const cover = Math.max(0, Math.min(turn.halfWidth, projected));
        const crossed = Math.max(0, Math.min(turn.halfWidth, -projected));
        if (turn.direction === 1) {
            turn.right.style.clipPath = `inset(0 0 0 ${cover}px)`;
            turn.left.style.clipPath = `inset(0 ${crossed}px 0 0)`;
        } else {
            turn.left.style.clipPath = `inset(0 ${cover}px 0 0)`;
            turn.right.style.clipPath = `inset(0 0 0 ${crossed}px)`;
        }
    }
    function build(direction: Direction, destination: HTMLElement): Turn | null {
        const { width, height } = frame.getBoundingClientRect();
        if (!width || !height) return null;
        const half = width / 2;
        frameWidth = width;
        const perspective = Math.max(1040, width * 2.6);
        overlay.style.perspective = `${perspective}px`;
        overlay.style.width = `${width}px`; overlay.style.height = `${height}px`;
        const restores: Array<() => void> = [];
        let sequence = 0;
        const make = (className: string, parent: HTMLElement) => {
            const element = doc.createElement("div"); element.className = className; parent.append(element); return element;
        };
        const canvas = (page: HTMLElement, side: "left" | "right", parent: HTMLElement) => {
            const snapshot = clonePage(page, width, `portrait-${request}-${sequence++}`);
            snapshot.clone.style.left = side === "right" ? `${-half}px` : "0px";
            parent.append(snapshot.clone); restores.push(snapshot.restoreScroll);
            parent.dataset.portraitSource = page.dataset.portraitPage;
            parent.dataset.portraitHalf = side;
        };
        overlay.replaceChildren();
        const left = make(`${styles.half} ${styles.leftHalf}`, overlay);
        const right = make(`${styles.half} ${styles.rightHalf}`, overlay);
        canvas(direction === 1 ? current : destination, "left", left);
        canvas(direction === 1 ? destination : current, "right", right);
        const leaf = make(`${styles.leaf} ${direction === 1 ? styles.leafNext : styles.leafPrevious}`, overlay);
        const front = make(`${styles.face} ${styles.front}`, leaf);
        const back = make(`${styles.face} ${styles.reverse}`, leaf);
        canvas(current, direction === 1 ? "right" : "left", front);
        canvas(destination, direction === 1 ? "left" : "right", back);
        make(styles.edge, leaf);
        make(styles.spine, overlay);
        turn = { direction, leaf, left, right, halfWidth: half, perspective, progress: 0 };
        overlay.hidden = false;
        restores.forEach(restore => restore());
        // The live page remains in place, ready to be restored on cancellation.
        current.style.visibility = "hidden"; current.style.opacity = "0"; current.inert = true;
        root.dataset.portraitTurning = "";
        doc.getSelection()?.removeAllRanges();
        draw(0);
        return turn;
    }
    function settle(commit: boolean) {
        if (!turn) return;
        gsap.killTweensOf(turn);
        settling = true;
        const activeTurn = turn;
        gsap.to(activeTurn, {
            progress: commit ? 1 : 0,
            duration: reducedMotion.matches ? 0 : gsap.utils.clamp(.38, .72, Math.abs((commit ? 1 : 0) - activeTurn.progress) * .5 + .18),
            ease: "power3.out",
            onUpdate: () => draw(activeTurn.progress),
            onComplete() {
                if (disposed || turn !== activeTurn) return;
                if (commit) {
                    draw(1);
                    options.onLand(activeTurn.direction);
                    // Keep B's completed copies until React promotes the same,
                    // already-decoded full-width B node in its layout phase.
                } else { clearTurn(); load("ready"); }
            },
        });
    }
    async function begin(direction: Direction, direct: boolean) {
        const destination = neighbour(direction);
        if (!destination || disposed || settling || !ready || blocked()) return;
        const token = ++request;
        failedDirection = direction;
        interact();
        load("loading", destination);
        const ok = await prepare(destination);
        if (disposed || token !== request) return;
        if (!ok) { grip = null; clearTurn(); load("error", destination); return; }
        if (blocked()) { grip = null; clearTurn(); load("ready"); return; }
        failedDirection = null;
        if (reducedMotion.matches) {
            load("ready");
            if (direct || (grip?.ended && Math.abs(grip.delta) > 24)) { options.onLand(direction); grip = null; }
            return;
        }
        if (!build(direction, destination)) { load("ready"); return; }
        load("ready");
        if (direct) { settle(true); return; }
        if (grip) {
            draw(Math.max(0, -direction * grip.delta) / frameWidth);
            if (grip.ended) finishGrip(false);
        }
    }
    function cancel() {
        clearDemonstration();
        ++request; grip = null; clearWheel();
        if (turn) settle(false);
        else { settling = false; if (ready) load("ready"); }
        scheduleDemonstration();
    }
    function start(input: ArtworkDragInput): boolean {
        if (!ready || settling || grip || blocked() || current.querySelector("[data-artwork-reading-open]") || input.button !== 0) return false;
        activity();
        if (turn) return false;
        const target = input.target as Element | null;
        if (target?.closest("a, button, input, textarea, select, [contenteditable='true'], [data-artwork-highlights], [data-lightbox-native-scroll]")) return false;
        clearWheel(); ++request;
        grip = { id: input.pointerId, x: input.clientX, y: input.clientY, lastX: input.clientX,
            lastTime: performance.now(), delta: 0, velocity: 0, direction: null, ended: false };
        return true;
    }
    function move(input: ArtworkDragInput) {
        if (!grip || grip.id !== input.pointerId || grip.ended || settling) return;
        const dx = input.clientX - grip.x, dy = input.clientY - grip.y;
        if (!grip.direction) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
            // One finger keeps native vertical reading until horizontal intent.
            if (Math.abs(dx) < Math.abs(dy) * 1.05) { grip = null; return; }
            const direction: Direction = dx < 0 ? 1 : -1;
            if (!neighbour(direction)) { grip = null; return; }
            grip.direction = direction;
            void begin(direction, false);
        }
        input.preventDefault();
        const now = performance.now(), elapsed = Math.max(now - grip.lastTime, 1);
        grip.velocity = grip.velocity * .72 + ((input.clientX - grip.lastX) / elapsed * 1000) * .28;
        grip.delta = dx; grip.lastX = input.clientX; grip.lastTime = now;
        if (turn) draw(Math.max(0, -grip.direction * dx) / frameWidth);
    }
    function finishGrip(cancelled: boolean) {
        if (!grip) return;
        if (!grip.direction || cancelled) { cancel(); return; }
        grip.ended = true;
        if (performance.now() - grip.lastTime > 120) grip.velocity = 0;
        const projected = -grip.direction * (grip.delta + grip.velocity * .24);
        const commit = projected > frameWidth * .12 || -grip.direction * grip.velocity > 420;
        // Retain a released grip while decoding. Its release is applied as soon
        // as the prepared faces exist, without requiring another touch.
        if (!turn && !reducedMotion.matches) {
            if (!commit) cancel();
            return;
        }
        const direction = grip.direction;
        grip = null;
        if (reducedMotion.matches) {
            ++request;
            if (commit) void begin(direction, true);
            else load("ready");
        } else settle(commit);
    }
    const unbindTouch = bindArtworkTouchNavigation(frame, {
        start, move,
        end(input) { if (grip?.id === input.pointerId) finishGrip(input.type === "pointercancel"); },
    });
    cleanup.push(unbindTouch);
    const pointerInput = (event: PointerEvent): ArtworkDragInput => ({
        type: event.type, pointerId: event.pointerId, pointerType: event.pointerType, button: event.button,
        clientX: event.clientX, clientY: event.clientY, target: event.target, currentTarget: frame,
        preventDefault: () => { if (event.cancelable) event.preventDefault(); },
    });
    function pointerDown(event: PointerEvent) {
        if (event.button === 0 && ready && !blocked()) activity();
        if (event.pointerType !== "touch") start(pointerInput(event));
    }
    function pointerMove(event: PointerEvent) { if (event.pointerType !== "touch") move(pointerInput(event)); }
    function pointerEnd(event: PointerEvent) {
        if (event.pointerType !== "touch" && grip?.id === event.pointerId) finishGrip(event.type === "pointercancel");
    }
    frame.addEventListener("pointerdown", pointerDown);
    view.addEventListener("pointermove", pointerMove, { passive: false });
    view.addEventListener("pointerup", pointerEnd);
    view.addEventListener("pointercancel", pointerEnd);
    view.addEventListener("blur", cancel);
    root.addEventListener("artwork-image-zoom", cancel);
    cleanup.push(() => {
        frame.removeEventListener("pointerdown", pointerDown); view.removeEventListener("pointermove", pointerMove);
        view.removeEventListener("pointerup", pointerEnd); view.removeEventListener("pointercancel", pointerEnd);
        view.removeEventListener("blur", cancel);
        root.removeEventListener("artwork-image-zoom", cancel);
    });
    function navigate(direction: Direction) {
        if (!ready || settling || grip || blocked()) return;
        activity();
        if (turn) return;
        clearWheel(); void begin(direction, true);
    }
    function keyDown(event: KeyboardEvent) {
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || blocked()) return;
        if (event.key === "Escape") { event.preventDefault(); cancel(); options.onExit(); return; }
        if ((event.target as Element)?.closest("input, textarea, select, [contenteditable='true'], [data-lightbox-native-scroll]")) return;
        const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : null;
        if (direction && neighbour(direction)) { event.preventDefault(); navigate(direction); }
    }
    view.addEventListener("keydown", keyDown);
    cleanup.push(() => view.removeEventListener("keydown", keyDown));
    function wheel(event: WheelEvent) {
        if ((event.target as Element)?.closest("[data-lightbox-native-scroll]")) return;
        if (!event.ctrlKey && ready && !blocked()) activity();
        if (event.ctrlKey || blocked() || Math.abs(event.deltaX) <= Math.abs(event.deltaY) || !event.deltaX) return;
        if (wheelLocked) { event.preventDefault(); holdWheelTail(); return; }
        if (!ready || settling || grip || turn) return;
        const delta = event.deltaX * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? frameWidth : 1);
        const direction: Direction = delta > 0 ? 1 : -1;
        if (!neighbour(direction)) return;
        event.preventDefault();
        wheelDistance = wheelDistance && Math.sign(wheelDistance) !== Math.sign(delta) ? delta : wheelDistance + delta;
        view.clearTimeout(wheelTimer);
        wheelTimer = view.setTimeout(clearWheel, 140);
        if (Math.abs(wheelDistance) >= 72) { clearWheel(); holdWheelTail(); navigate(direction); }
    }
    frame.addEventListener("wheel", wheel, { passive: false });
    cleanup.push(() => frame.removeEventListener("wheel", wheel));
    const focusPage = () => { if (ready && !blocked()) activity(); };
    const readingScrolled = (event: Event) => {
        if (ready && !turn && event.target instanceof Node && current.contains(event.target)) activity();
    };
    const visibilityChanged = () => { if (doc.hidden) clearDemonstration(); else scheduleDemonstration(); };
    const motionChanged = () => { clearDemonstration(); scheduleDemonstration(); };
    frame.addEventListener("focusin", focusPage);
    frame.addEventListener("scroll", readingScrolled, true);
    doc.addEventListener("visibilitychange", visibilityChanged);
    view.addEventListener("focus", scheduleDemonstration);
    reducedMotion.addEventListener("change", motionChanged);
    cleanup.push(() => {
        frame.removeEventListener("focusin", focusPage);
        frame.removeEventListener("scroll", readingScrolled, true);
        doc.removeEventListener("visibilitychange", visibilityChanged);
        view.removeEventListener("focus", scheduleDemonstration);
        reducedMotion.removeEventListener("change", motionChanged);
    });
    const observer = new ResizeObserver(() => {
        const width = frame.getBoundingClientRect().width;
        if (Math.abs(width - frameWidth) > .5) { frameWidth = width; ++request; grip = null; clearTurn(); if (ready) load("ready"); scheduleDemonstration(); }
    });
    observer.observe(frame); cleanup.push(() => observer.disconnect());

    async function initialise() {
        load("loading", current, "entrance");
        const ok = await prepare(current);
        if (disposed) return;
        if (!ok) { load("error", current, "entrance"); return; }
        ready = true; root.dataset.portraitReady = "true";
        load("ready", current, "entrance");
        options.onArrival();
        scheduleDemonstration();
        // Decode adjacent pages without delaying the current view.
        for (const page of [options.previous, options.next]) if (page) void prepare(page);
    }
    void initialise();
    return {
        navigate,
        retry() {
            const destination = failedDirection ? neighbour(failedDirection) : current;
            destination?.querySelectorAll<HTMLImageElement>("img").forEach(image => {
                imageJobs.delete(image);
                if (!image.naturalWidth) image.src = image.currentSrc || image.src;
            });
            if (!ready) void initialise();
            else if (failedDirection) void begin(failedDirection, true);
        },
        dispose() {
            disposed = true; ++request; grip = null; clearWheel(); clearDemonstration(); clearTurn();
            cleanup.forEach(dispose => dispose()); imageCancels.forEach(cancel => cancel());
        },
    };
}
