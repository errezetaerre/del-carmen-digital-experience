/** Approved Standard-detail motion, shared by routed scenes and gallery pages. */
export type ArtworkDirection = -1 | 1;

export const ARTWORK_KINETICS = {
    axisLockRatio: 1.05,
    intentDistance: 8,
    edgeResistance: .18,
    momentumFactor: .24,
    snapDistanceRatio: .12,
    snapVelocity: 420,
    releaseVelocityWindowMs: 120,
    wheelTrigger: 72,
    wheelPreviewMultiplier: 1,
    wheelPreviewRatio: .42,
    wheelGestureEndMs: 140,
    resetDuration: .55,
} as const;

const clamp = (min: number, max: number, value: number) => Math.min(max, Math.max(min, value));

export function artworkKineticTween(remainingDistance: number, releaseVelocity = 0, preserveReleaseVelocity = false) {
    const speed = Math.abs(releaseVelocity);
    return {
        duration: preserveReleaseVelocity && speed > 1
            ? clamp(.14, .95, (2 * remainingDistance) / speed)
            : clamp(.38, .72, remainingDistance / 1500 + .28),
        ease: preserveReleaseVelocity ? "power1.out" : "power3.out",
    };
}

export function artworkPointerVelocity(previous: number, delta: number, elapsedMs: number) {
    const recent = elapsedMs <= ARTWORK_KINETICS.releaseVelocityWindowMs ? previous : 0;
    return recent * .72 + ((delta / Math.max(elapsedMs, 1)) * 1000) * .28;
}

export function artworkWheelVelocity(previous: number, delta: number, elapsedMs: number) {
    return previous * .68 + ((-delta * ARTWORK_KINETICS.wheelPreviewMultiplier * 1000) / Math.max(elapsedMs, 8)) * .32;
}

export function artworkPointerOffset(distance: number, hasPrevious: boolean, hasNext: boolean) {
    return (distance > 0 && !hasPrevious) || (distance < 0 && !hasNext)
        ? distance * ARTWORK_KINETICS.edgeResistance : distance;
}

export function artworkWheelOffset(distance: number, width: number, hasDestination: boolean) {
    const limit = width * ARTWORK_KINETICS.wheelPreviewRatio;
    const offset = clamp(-limit, limit, -distance * ARTWORK_KINETICS.wheelPreviewMultiplier);
    return hasDestination ? offset : offset * ARTWORK_KINETICS.edgeResistance;
}

export function artworkPointerDirection(displacement: number, velocity: number, width: number,
    hasPrevious: boolean, hasNext: boolean, idleMs = 0): ArtworkDirection | null {
    const threshold = width * ARTWORK_KINETICS.snapDistanceRatio;
    // A completed drag must not be vetoed by a few reverse pixels at release.
    if (displacement <= -threshold) return hasNext ? 1 : null;
    if (displacement >= threshold) return hasPrevious ? -1 : null;
    if (Math.abs(displacement) < ARTWORK_KINETICS.intentDistance) return null;

    // A short flick is valid only while moving toward that same neighbour.
    // Holding still before release must not reuse an earlier burst of speed.
    const releaseVelocity = idleMs <= ARTWORK_KINETICS.releaseVelocityWindowMs && displacement * velocity > 0
        ? velocity : 0;
    const projected = displacement + releaseVelocity * ARTWORK_KINETICS.momentumFactor;
    if (hasNext && (projected <= -threshold || releaseVelocity <= -ARTWORK_KINETICS.snapVelocity)) return 1;
    if (hasPrevious && (projected >= threshold || releaseVelocity >= ARTWORK_KINETICS.snapVelocity)) return -1;
    return null;
}
