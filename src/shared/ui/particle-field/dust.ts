// Shared warm light for the mobile menu and the book's brief landing accent.
export const DUST_COLORS = [
  "167, 121, 67",
  "201, 154, 91",
  "225, 187, 128",
  "240, 213, 163",
] as const;

export function drawDustMote(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  colorIndex: number,
  opacity: number,
) {
  const color = DUST_COLORS[colorIndex % DUST_COLORS.length];
  context.save();
  context.globalAlpha = Math.max(0, Math.min(1, opacity));
  context.fillStyle = `rgb(${color})`;
  context.shadowColor = `rgba(${color}, .8)`;
  context.shadowBlur = 5 + radius * 5;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
  // Occasional tiny catches of light, in the same bronze as the dust.
  if (radius > 1.35 && opacity > .5) {
    context.shadowBlur = 4;
    context.strokeStyle = `rgb(${color})`;
    context.lineWidth = .45;
    context.beginPath();
    context.moveTo(x - radius * 2.2, y);
    context.lineTo(x + radius * 2.2, y);
    context.moveTo(x, y - radius * 2.2);
    context.lineTo(x, y + radius * 2.2);
    context.stroke();
  }
  context.restore();
}

export function burstDust(container: HTMLElement, placement: "ribbon" | "perimeter" = "ribbon"): () => void {
  const document = container.ownerDocument;
  const view = document.defaultView;
  if (!view || document.hidden || !container.clientWidth || !container.clientHeight) return () => {};
  const reducedMotion = view.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) return () => {};

  const canvas = document.createElement("canvas");
  const candidate = canvas.getContext("2d");
  if (!candidate) return () => {};
  // An explicitly non-null binding remains safe in the deferred draw callback.
  const context: CanvasRenderingContext2D = candidate;
  const perimeter = placement === "perimeter";
  const inset = perimeter ? 32 : 12;
  const pageWidth = container.clientWidth;
  const pageHeight = container.clientHeight;
  const width = pageWidth + inset * 2;
  const height = perimeter ? pageHeight + inset * 2 : Math.min(160, pageHeight) + 56;
  const duration = perimeter ? 1250 : 1050;
  const dpr = Math.min(view.devicePixelRatio || 1, 2);
  canvas.width = Math.ceil(width * dpr);
  canvas.height = Math.ceil(height * dpr);
  Object.assign(canvas.style, {
    position: "absolute", left: `${-inset}px`, top: perimeter ? `${-inset}px` : "-44px",
    width: `${width}px`, height: `${height}px`,
    pointerEvents: "none", userSelect: "none", zIndex: perimeter ? "7" : "2",
  });
  canvas.setAttribute("aria-hidden", "true");
  canvas.setAttribute("data-artwork-dust", "");
  canvas.setAttribute("data-artwork-dust-placement", placement);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  container.appendChild(canvas);

  const length = 2 * (pageWidth + pageHeight);
  const count = perimeter ? Math.max(48, Math.min(96, Math.round(length / 28))) : 24;
  const particles = Array.from({ length: count }, (_, index) => {
    let x = 12 + (pageWidth * (index + .5)) / count;
    let y = 44 + Math.random() * Math.min(14, pageHeight);
    let dx = (Math.random() - .5) * 28;
    let dy = -(12 + Math.random() * 28);
    if (perimeter) {
      let distance = length * (index + .5) / count;
      let normalX = 0, normalY = 0;
      if (distance < pageWidth) { x = distance; y = 0; normalY = -1; }
      else if ((distance -= pageWidth) < pageHeight) { x = pageWidth; y = distance; normalX = 1; }
      else if ((distance -= pageHeight) < pageWidth) { x = pageWidth - distance; y = pageHeight; normalY = 1; }
      else { distance -= pageWidth; x = 0; y = pageHeight - distance; normalX = -1; }
      x += inset; y += inset;
      const outward = 6 + Math.random() * 10;
      const tangent = (Math.random() - .5) * 10;
      dx = normalX * outward - normalY * tangent;
      dy = normalY * outward + normalX * tangent;
    }
    return {
      x, y, dx, dy,
      size: .45 + Math.random() * 1.15,
      delay: perimeter ? (index / count) * .22 : (index % 4) * .035,
      color: index % DUST_COLORS.length,
    };
  });
  let frame: number | null = null;
  let start: number | null = null;
  let stopped = false;
  function stop() {
    if (stopped) return;
    stopped = true;
    if (frame !== null) view!.cancelAnimationFrame(frame);
    frame = null;
    document.removeEventListener("visibilitychange", onVisibility);
    reducedMotion.removeEventListener("change", onMotion);
    canvas.remove();
  }
  function onVisibility() { if (document.hidden) stop(); }
  function onMotion() { if (reducedMotion.matches) stop(); }
  function draw(time: number) {
    frame = null;
    if (stopped) return;
    if (document.hidden || reducedMotion.matches || !container.isConnected) { stop(); return; }
    if (start === null) start = time;
    const progress = (time - start) / duration;
    if (progress >= 1) { stop(); return; }
    context.clearRect(0, 0, width, height);
    for (const particle of particles) {
      const p = Math.max(0, Math.min(1, (progress - particle.delay) / (perimeter ? .70 : .85)));
      const alpha = Math.sin(Math.PI * p) * .8;
      drawDustMote(context, particle.x + particle.dx * p, particle.y + particle.dy * p, particle.size * (1 - .2 * p), particle.color, alpha);
    }
    frame = view!.requestAnimationFrame(draw);
  }
  document.addEventListener("visibilitychange", onVisibility);
  reducedMotion.addEventListener("change", onMotion);
  frame = view.requestAnimationFrame(draw);
  return stop;
}
