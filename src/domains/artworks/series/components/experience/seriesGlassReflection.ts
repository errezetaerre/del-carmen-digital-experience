import { createGlassMaterial, paintGlassMaterial, disposeGlassMaterial, type GlassMaterial } from "@/domains/artworks/components/glass-artbook/glassMaterial.mjs";

// The approved shared WebGL material is the primary renderer. The small 2D
// sampler below preserves a warm reflection when WebGL2 is unavailable.
const WIDTH = 64, HEIGHT = 80;
const LIGHT_ANGLE = 35 * Math.PI / 180;
const LIGHT_LENGTH = Math.hypot(Math.sin(LIGHT_ANGLE), .3, Math.cos(LIGHT_ANGLE));
const lightY = .3 / LIGHT_LENGTH, lightZ = Math.cos(LIGHT_ANGLE) / LIGHT_LENGTH;

export function sampleSeriesGlassReflection(u: number, v: number, degrees: number, side: -1 | 1, strength = .6) {
    const a = degrees * Math.PI / 180, sine = Math.sin(a), cosine = Math.cos(a);
    const x = ((u * 2 - 1) + side) * .59, y = (v * 2 - 1) * .76;
    const vx = -x * cosine, vy = -y, vz = 3.5 + x * sine;
    const length = Math.hypot(vx, vy, vz), viewX = vx / length, viewY = vy / length, viewZ = vz / length;
    const normalView = sine * viewX + cosine * viewZ;
    const fresnel = (1 - Math.abs(normalView)) ** 4;
    let energy = strength * fresnel * .48;
    for (const sign of side < 0 ? [1] : [1, -1]) {
        const lightX = sign * Math.sin(LIGHT_ANGLE) / LIGHT_LENGTH;
        const hx = lightX + viewX, hy = lightY + viewY, hz = lightZ + viewZ;
        const halfLength = Math.hypot(hx, hy, hz);
        const normalHalf = Math.max(0, (sine * hx + cosine * hz) / halfLength);
        const normalLight = sine * lightX + cosine * lightZ;
        const reflectedView = (2 * normalLight * sine - lightX) * viewX - lightY * viewY +
            (2 * normalLight * cosine - lightZ) * viewZ;
        energy += strength * (normalHalf ** 180 * 2.8 + Math.max(0, reflectedView) ** 26 * .28 + normalHalf ** 30 * .15);
    }
    const spine = Math.exp(-(side > 0 ? u : 1 - u) * 18) * strength * (.07 + .13 * fresnel);
    return 1 - Math.exp(-Math.max(0, energy + spine));
}

export interface SeriesGlassReflection {
    render(page: HTMLElement, degrees?: number, moving?: boolean): void;
    dispose(): void;
}

/** Two bounded GPU contexts: a still-image painter and the one visible moving face. */
export function createSeriesGlassReflection(): SeriesGlassReflection {
    let surfaces = new WeakMap<HTMLElement, { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D; pixels: ImageData; signature: string }>();
    const pools: Array<{ canvas: HTMLCanvasElement; material: GlassMaterial | null } | undefined> = [];
    function pool(document: Document, moving: boolean) {
        const slot = moving ? 1 : 0;
        if (!pools[slot]) {
            const canvas = document.createElement("canvas");
            canvas.setAttribute("aria-hidden", "true");
            let material: GlassMaterial | null = null;
            try { material = createGlassMaterial(canvas); } catch { /* Static fallback keeps the collection usable. */ }
            pools[slot] = { canvas, material };
        }
        return pools[slot]!;
    }
    function render(page: HTMLElement, degrees = 0, moving = false) {
    const visibleHalf = page.closest<HTMLElement>("[data-portrait-half]")?.dataset.portraitHalf;
    const angle = Math.round(degrees * 4) / 4;
    // Backface visibility hides these surfaces; shade them when they face us.
    if (Math.cos(angle * Math.PI / 180) < -.001) return;
    for (const holder of page.querySelectorAll<HTMLElement>("[data-series-glow]")) {
        const half = holder.dataset.seriesGlow;
        if (visibleHalf && half !== visibleHalf) continue;
        const width = holder.clientWidth, height = holder.clientHeight;
        if (!width || !height) continue;
        const gpu = pool(page.ownerDocument, moving);
        const pixelRatio = Math.min(page.ownerDocument.defaultView?.devicePixelRatio || 1, 2);
        const painted = gpu.material && paintGlassMaterial(gpu.material, gpu.canvas, { width, height, pixelRatio,
            angle, side: half === "left" ? -1 : 1, artwork: half === "left", strength: .6, cornerStrength: .9 });
        holder.dataset.seriesRenderer = painted ? "webgl" : "fallback";
        if (painted && moving) {
            gpu.canvas.dataset.seriesReflection = half;
            if (gpu.canvas.parentElement !== holder) holder.replaceChildren(gpu.canvas);
            continue;
        }
        let surface = surfaces.get(holder);
        if (!surface) {
            const canvas = page.ownerDocument.createElement("canvas"), context = canvas.getContext("2d");
            if (!context) continue;
            canvas.width = WIDTH; canvas.height = HEIGHT;
            canvas.setAttribute("aria-hidden", "true");
            canvas.dataset.seriesReflection = half;
            holder.replaceChildren(canvas);
            surface = { canvas, context, pixels: context.createImageData(WIDTH, HEIGHT), signature: "" };
            surfaces.set(holder, surface);
        }
        if (surface.canvas.parentElement !== holder) holder.replaceChildren(surface.canvas);
        const signature = `${angle}/${width}/${height}/${painted ? pixelRatio : "fallback"}`;
        if (surface.signature === signature) continue;
        surface.signature = signature;
        if (painted) {
            surface.canvas.width = gpu.canvas.width; surface.canvas.height = gpu.canvas.height;
            surface.context.drawImage(gpu.canvas, 0, 0);
            continue;
        }
        if (surface.canvas.width !== WIDTH || surface.canvas.height !== HEIGHT) { surface.canvas.width = WIDTH; surface.canvas.height = HEIGHT; }
        const side = half === "left" ? -1 : 1;
        for (let y = 0; y < HEIGHT; y++) for (let x = 0; x < WIDTH; x++) {
            // WebGL's texture Y axis starts at the bottom.
            const reflection = sampleSeriesGlassReflection((x + .5) / WIDTH, 1 - (y + .5) / HEIGHT, angle, side);
            const alpha = .05 + reflection * .95, tint = reflection / alpha;
            const offset = (y * WIDTH + x) * 4;
            surface.pixels.data[offset] = 255 * Math.pow(tint, .94);
            surface.pixels.data[offset + 1] = 255 * Math.pow(.86 * tint, .94);
            surface.pixels.data[offset + 2] = 255 * Math.pow(.64 * tint, .94);
            surface.pixels.data[offset + 3] = alpha * 255;
        }
        surface.context.putImageData(surface.pixels, 0, 0);
    }
    }
    return { render, dispose() {
        for (const item of pools) { if (item) { disposeGlassMaterial(item.material); item.canvas.remove(); } }
        pools.length = 0; surfaces = new WeakMap();
    } };
}
