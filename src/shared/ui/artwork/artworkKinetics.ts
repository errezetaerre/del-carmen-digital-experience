/** Approved Standard-detail motion, shared by routed scenes and gallery pages. */
export type ArtworkDirection = -1 | 1;

export const ARTWORK_KINETICS = {
    axisLockRatio: 1.05,
    intentDistance: 8,
    edgeResistance: .18,
    momentumFactor: .24,
    snapDistanceRatio: .12,
    snapVelocity: 420,
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
    return previous * .72 + ((delta / Math.max(elapsedMs, 1)) * 1000) * .28;
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
    hasPrevious: boolean, hasNext: boolean): ArtworkDirection | null {
    const projected = displacement + velocity * ARTWORK_KINETICS.momentumFactor;
    const threshold = width * ARTWORK_KINETICS.snapDistanceRatio;
    if (hasNext && (projected <= -threshold || velocity <= -ARTWORK_KINETICS.snapVelocity)) return 1;
    if (hasPrevious && (projected >= threshold || velocity >= ARTWORK_KINETICS.snapVelocity)) return -1;
    return null;
}
