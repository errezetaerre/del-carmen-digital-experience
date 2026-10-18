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

interface DustBurstOptions {
  delayMs?: number;
  sweepMs?: number;
  glintMs?: number;
}

function perimeterPoint(distance: number, width: number, height: number) {
  if (distance <= width) return { x: distance, y: 0, nx: 0, ny: -1 };
  distance -= width;
  if (distance <= height) return { x: width, y: distance, nx: 1, ny: 0 };
  distance -= height;
  if (distance <= width) return { x: width - distance, y: height, nx: 0, ny: 1 };
  return { x: 0, y: height - (distance - width), nx: -1, ny: 0 };
}

function drawPerimeterGlint(
  context: CanvasRenderingContext2D,
  width: number, height: number, inset: number,
  elapsed: number, sweepMs: number, glintMs: number,
) {
  // Each point catches the moving light for 50ms; the tail follows the edge,
  // including its corners, instead of cutting diagonally across the painting.
  const from = Math.max(0, elapsed - glintMs);
  const to = Math.min(sweepMs, elapsed);
  if (to <= from) return;
  const length = 2 * (width + height);
  const corners = [width, width + height, 2 * width + height];
  context.save();
  context.lineCap = "round";
  context.lineJoin = "round";
  for (let step = from; step < to; step += 5) {
    const end = Math.min(to, step + 5);
    const startDistance = (step / sweepMs) * length;
    const endDistance = (end / sweepMs) * length;
    const alpha = Math.max(0, 1 - (elapsed - (step + end) / 2) / glintMs);
    const color = DUST_COLORS[2];
    const point = perimeterPoint(startDistance, width, height);
    context.beginPath();
    context.moveTo(point.x + inset, point.y + inset);
    for (const distance of [...corners.filter(corner => corner > startDistance && corner < endDistance), endDistance]) {
      const next = perimeterPoint(distance, width, height);
      context.lineTo(next.x + inset, next.y + inset);
    }
    context.strokeStyle = `rgb(${color})`;
    context.shadowColor = `rgba(${color}, .9)`;
    context.shadowBlur = 13;
    context.lineWidth = 1.15;
    context.globalAlpha = alpha * .9;
    context.stroke();
    context.strokeStyle = `rgb(${DUST_COLORS[3]})`;
    context.shadowBlur = 5;
    context.lineWidth = .45;
    context.globalAlpha = alpha;
    context.stroke();
  }
  context.restore();
}

export function burstDust(
  container: HTMLElement,
  placement: "ribbon" | "perimeter" = "ribbon",
  options: DustBurstOptions = {},
): () => void {
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
  const delayMs = perimeter ? Math.max(0, options.delayMs ?? 0) : 0;
  const sweepMs = Math.max(50, options.sweepMs ?? 450);
  const glintMs = Math.max(1, Math.min(sweepMs, options.glintMs ?? 50));
  const duration = perimeter ? sweepMs + 800 : 1050;
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
      const point = perimeterPoint(length * (index + .5) / count, pageWidth, pageHeight);
      x = point.x + inset; y = point.y + inset;
      const outward = 6 + Math.random() * 10;
      const tangent = (Math.random() - .5) * 10;
      dx = point.nx * outward - point.ny * tangent;
      dy = point.ny * outward + point.nx * tangent;
    }
    return {
      x, y, dx, dy,
      size: .45 + Math.random() * 1.15,
      delay: perimeter ? ((index + .5) / count) * sweepMs : (index % 4) * .035 * duration,
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
    const elapsed = time - start - delayMs;
    const progress = elapsed / duration;
    if (progress >= 1) { stop(); return; }
    context.clearRect(0, 0, width, height);
    if (elapsed < 0) { frame = view!.requestAnimationFrame(draw); return; }
    if (perimeter) drawPerimeterGlint(context, pageWidth, pageHeight, inset, elapsed, sweepMs, glintMs);
    for (const particle of particles) {
      const p = Math.max(0, Math.min(1, (elapsed - particle.delay) / (perimeter ? 800 : duration * .85)));
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

type DustPoint = { x: number; y: number };
type GlassDustPath = { points: DustPoint[]; outerNormal: number };
const GLASS_DUST_PHASES = [0, .14, .42, .56, .78, 1] as const;
const GLASS_DUST_SWEEP_MS = 720;
const GLASS_DUST_TAIL_MS = 160;

function glassDustPath(leaf: HTMLElement, left: boolean): GlassDustPath {
  const inner = leaf.offsetLeft + (left ? leaf.clientWidth : 0);
  const outer = leaf.offsetLeft + (left ? 0 : leaf.clientWidth);
  const top = leaf.offsetTop, bottom = top + leaf.clientHeight;
  return { outerNormal: left ? -1 : 1, points: [
    { x: inner, y: top }, { x: outer, y: top },
    { x: outer, y: bottom }, { x: inner, y: bottom },
    { x: inner, y: top }, { x: inner, y: bottom },
  ] };
}

function glassDustPoint(path: GlassDustPath, progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  let segment = 0;
  while (segment < GLASS_DUST_PHASES.length - 2 && p > GLASS_DUST_PHASES[segment + 1]) segment++;
  const local = (p - GLASS_DUST_PHASES[segment]) / (GLASS_DUST_PHASES[segment + 1] - GLASS_DUST_PHASES[segment]);
  const from = path.points[segment], to = path.points[segment + 1];
  return { x: from.x + (to.x - from.x) * local, y: from.y + (to.y - from.y) * local,
    nx: segment === 1 ? path.outerNormal : segment >= 3 ? -path.outerNormal : 0,
    ny: segment === 0 ? -1 : segment === 2 ? 1 : 0 };
}

function drawGlassDustGlint(context: CanvasRenderingContext2D, path: GlassDustPath, elapsed: number, inset: number) {
  const sweepMs = GLASS_DUST_SWEEP_MS, glintMs = 50, tailMs = GLASS_DUST_TAIL_MS;
  const from = Math.max(0, elapsed - tailMs), to = Math.min(sweepMs, elapsed);
  if (to <= from) return;
  context.save();context.lineCap = "round";context.lineJoin = "round";
  for (let step = from; step < to; step += 5) {
    const end = Math.min(to, step + 5), point = glassDustPoint(path, step / sweepMs);
    context.beginPath();context.moveTo(point.x + inset, point.y + inset);
    const corners = GLASS_DUST_PHASES.slice(1, -1).map(p => p * sweepMs).filter(time => time > step && time < end);
    for (const time of [...corners, end]) {
      const next = glassDustPoint(path, time / sweepMs);context.lineTo(next.x + inset, next.y + inset);
    }
    const age = elapsed - (step + end) / 2;
    const alpha = Math.pow(Math.max(0, 1 - age / tailMs), 1.8);
    context.strokeStyle = `rgb(${DUST_COLORS[2]})`;context.shadowColor = `rgba(${DUST_COLORS[2]}, .9)`;
    context.shadowBlur = 13;context.lineWidth = 1.15;context.globalAlpha = alpha * .55;context.stroke();
    context.strokeStyle = `rgb(${DUST_COLORS[3]})`;context.shadowBlur = 5;
    context.lineWidth = .45;context.globalAlpha = Math.max(0, 1 - age / glintMs);
    if (age < glintMs) context.stroke();
  }
  context.restore();
  if (elapsed > 0 && elapsed < sweepMs) {
    const head = glassDustPoint(path, elapsed / sweepMs);
    drawDustMote(context, head.x + inset, head.y + inset, .95, 3, .9);
  }
}

// One native book canvas and one clock keep unequal-width leaves in phase.
export function burstGlassDust(book: HTMLElement, left: HTMLElement, right: HTMLElement): () => void {
  const document = book.ownerDocument, view = document.defaultView;
  if (!view || document.hidden || !book.clientWidth || !book.clientHeight ||
    !left.clientWidth || !left.clientHeight || !right.clientWidth || !right.clientHeight) return () => {};
  const reducedMotion = view.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) return () => {};
  const canvas = document.createElement("canvas"), candidate = canvas.getContext("2d");
  if (!candidate) return () => {};
  const context: CanvasRenderingContext2D = candidate;
  const inset = 32, width = book.clientWidth + inset * 2, height = book.clientHeight + inset * 2;
  const dpr = Math.min(view.devicePixelRatio || 1, 2), sweepMs = GLASS_DUST_SWEEP_MS, fadeMs = 800, duration = sweepMs + 900;
  canvas.width = Math.ceil(width * dpr);canvas.height = Math.ceil(height * dpr);
  Object.assign(canvas.style, { position: "absolute", left: "-32px", top: "-32px", width: `${width}px`, height: `${height}px`,
    pointerEvents: "none", userSelect: "none", zIndex: "7" });
  canvas.setAttribute("aria-hidden", "true");canvas.setAttribute("data-artwork-dust", "");
  canvas.setAttribute("data-artwork-dust-placement", "spread");
  context.setTransform(dpr, 0, 0, dpr, 0, 0);book.appendChild(canvas);
  const paths = [glassDustPath(left, true), glassDustPath(right, false)];
  const particles = paths.flatMap((path, side) => {
    const leaf = side === 0 ? left : right;
    const count = Math.max(48, Math.min(96, Math.round((2 * leaf.clientWidth + 3 * leaf.clientHeight) / 28)));
    return Array.from({ length: count }, (_, i) => {
      const progress = (i + .5) / count, point = glassDustPoint(path, progress);
      const outward = 6 + Math.random() * 10, tangent = (Math.random() - .5) * 10;
      return { x: point.x, y: point.y, dx: point.nx * outward - point.ny * tangent, dy: point.ny * outward + point.nx * tangent,
        delay: progress * sweepMs, size: .45 + Math.random() * 1.15, color: i % DUST_COLORS.length };
    });
  });
  for (let i = 0; i < 24; i++) {
    const progress = .78 + ((i + .5) / 24) * .22;
    const a = glassDustPoint(paths[0], progress), b = glassDustPoint(paths[1], progress);
    particles.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2,
      dx: (Math.random() - .5) * 28, dy: -(12 + Math.random() * 28),
      delay: progress * sweepMs, size: .45 + Math.random() * 1.15, color: i % DUST_COLORS.length });
  }
  let frame: number | null = null, start: number | null = null, stopped = false;
  function stop() {
    if (stopped) return;stopped = true;
    if (frame !== null) view!.cancelAnimationFrame(frame);frame = null;
    document.removeEventListener("visibilitychange", onVisibility);reducedMotion.removeEventListener("change", onMotion);canvas.remove();
  }
  function onVisibility() { if (document.hidden) stop(); }
  function onMotion() { if (reducedMotion.matches) stop(); }
  function draw(time: number) {
    frame = null;if (stopped) return;
    if (document.hidden || reducedMotion.matches || !book.isConnected || !left.isConnected || !right.isConnected) { stop(); return; }
    if (start === null) start = time;
    const elapsed = time - start;if (elapsed >= duration) { stop(); return; }
    context.clearRect(0, 0, width, height);
    for (const path of paths) drawGlassDustGlint(context, path, elapsed, inset);
    for (const particle of particles) {
      const p = Math.max(0, Math.min(1, (elapsed - particle.delay) / fadeMs));
      // Unborn/faded motes must not leave a shadow or a stationary spine dot.
      if (p <= 0 || p >= 1) continue;
      drawDustMote(context, inset + particle.x + particle.dx * p, inset + particle.y + particle.dy * p,
        particle.size * (1 - .2 * p), particle.color, Math.sin(Math.PI * p) * .8);
    }
    frame = view!.requestAnimationFrame(draw);
  }
  document.addEventListener("visibilitychange", onVisibility);reducedMotion.addEventListener("change", onMotion);
  frame = view.requestAnimationFrame(draw);return stop;
}

export type ArtworkDustRect = { x: number; y: number; width: number; height: number; radius?: number };

function artworkDustPath(rect: ArtworkDustRect) {
  const radius = Math.max(0, Math.min(rect.radius || 0, rect.width / 2, rect.height / 2));
  if (!radius) return { length: 2 * (rect.width + rect.height),
    stops: [rect.width, rect.width + rect.height, 2 * rect.width + rect.height],
    point: (distance: number) => perimeterPoint(distance, rect.width, rect.height) };
  const horizontal = rect.width - 2 * radius, vertical = rect.height - 2 * radius, arc = Math.PI * radius / 2;
  const lengths = [horizontal, arc, vertical, arc, horizontal, arc, vertical, arc];
  const stops: number[] = [];
  let length = 0;
  lengths.forEach((segment, index) => {
    const steps = index % 2 ? 12 : 1;
    for (let step = 1; step <= steps; step++) stops.push(length + segment * step / steps);
    length += segment;
  });
  const corner = (x: number, y: number, angle: number) => ({
    x: x + Math.cos(angle) * radius, y: y + Math.sin(angle) * radius,
    nx: Math.cos(angle), ny: Math.sin(angle),
  });
  function point(distance: number) {
    let d = ((distance % length) + length) % length;
    if (d <= horizontal) return { x: radius + d, y: 0, nx: 0, ny: -1 };
    d -= horizontal;
    if (d <= arc) return corner(rect.width - radius, radius, -Math.PI / 2 + d / radius);
    d -= arc;
    if (d <= vertical) return { x: rect.width, y: radius + d, nx: 1, ny: 0 };
    d -= vertical;
    if (d <= arc) return corner(rect.width - radius, rect.height - radius, d / radius);
    d -= arc;
    if (d <= horizontal) return { x: rect.width - radius - d, y: rect.height, nx: 0, ny: 1 };
    d -= horizontal;
    if (d <= arc) return corner(radius, rect.height - radius, Math.PI / 2 + d / radius);
    d -= arc;
    if (d <= vertical) return { x: 0, y: rect.height - radius - d, nx: -1, ny: 0 };
    d -= vertical;
    return corner(radius, radius, Math.PI + d / radius);
  }
  return { length, stops, point };
}

function drawArtworkDustGlint(context: CanvasRenderingContext2D, rect: ArtworkDustRect, elapsed: number, inset: number) {
  const sweepMs = 900, tailMs = 140, glintMs = 40;
  const path = artworkDustPath(rect), length = path.length;
  const from = Math.max(0, elapsed - tailMs), to = Math.min(sweepMs, elapsed);
  if (to <= from) return;
  context.save(); context.lineCap = "round"; context.lineJoin = "round";
  for (let step = from; step < to; step += 5) {
    const end = Math.min(to, step + 5), start = step / sweepMs * length, finish = end / sweepMs * length;
    const point = path.point(start), age = elapsed - (step + end) / 2;
    context.beginPath(); context.moveTo(inset + rect.x + point.x, inset + rect.y + point.y);
    for (const distance of [...path.stops.filter(c => c > start && c < finish), finish]) {
      const next = path.point(distance);
      context.lineTo(inset + rect.x + next.x, inset + rect.y + next.y);
    }
    const opacity = Math.pow(Math.max(0, 1 - age / tailMs), 1.8);
    context.strokeStyle = `rgb(${DUST_COLORS[2]})`; context.shadowColor = `rgba(${DUST_COLORS[2]}, .8)`;
    context.shadowBlur = 9; context.lineWidth = .85; context.globalAlpha = opacity * .42; context.stroke();
    if (age < glintMs) {
      context.strokeStyle = `rgb(${DUST_COLORS[3]})`; context.shadowBlur = 4;
      context.lineWidth = .35; context.globalAlpha = Math.max(0, 1 - age / glintMs) * .75; context.stroke();
    }
  }
  context.restore();
  if (elapsed > 0 && elapsed < sweepMs) {
    const head = path.point(elapsed / sweepMs * length);
    drawDustMote(context, inset + rect.x + head.x, inset + rect.y + head.y, .75, 3, .75);
  }
}

// One clock traces the complete glass panel and accents its own Halo ribbon.
export function burstArtworkDust(container: HTMLElement, border: ArtworkDustRect, ribbon: ArtworkDustRect): () => void {
  const document = container.ownerDocument, browserView = document.defaultView;
  if (!browserView || document.hidden || !container.isConnected || !container.clientWidth || !container.clientHeight ||
      border.width <= 0 || border.height <= 0 || !ribbon.width || !ribbon.height) return () => {};
  const view: Window = browserView;
  const reducedMotion = view.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) return () => {};
  const canvas = document.createElement("canvas"), candidate = canvas.getContext("2d");
  if (!candidate) return () => {};
  const context: CanvasRenderingContext2D = candidate;
  const inset = 24, width = Math.max(container.clientWidth, border.x + border.width, ribbon.x + ribbon.width) + inset * 2;
  const height = Math.max(container.clientHeight, border.y + border.height, ribbon.y + ribbon.height) + inset * 2;
  const dpr = Math.min(view.devicePixelRatio || 1, 2), sweepMs = 900, duration = 1550;
  canvas.width = Math.ceil(width * dpr); canvas.height = Math.ceil(height * dpr);
  Object.assign(canvas.style, { position: "absolute", left: "-24px", top: "-24px", width: `${width}px`, height: `${height}px`,
    pointerEvents: "none", userSelect: "none", zIndex: "60" });
  canvas.setAttribute("aria-hidden", "true"); canvas.setAttribute("data-artwork-dust", "");
  canvas.setAttribute("data-artwork-dust-placement", "glass-perimeter");
  context.setTransform(dpr, 0, 0, dpr, 0, 0); container.appendChild(canvas);
  const path = artworkDustPath(border), count = Math.max(48, Math.min(104, Math.round(path.length / 28)));
  const particles = Array.from({ length: count }, (_, i) => {
    const progress = (i + .5) / count, point = path.point(progress * path.length);
    const outward = 6 + Math.random() * 8;
    return { x: border.x + point.x, y: border.y + point.y, dx: point.nx * outward, dy: point.ny * outward,
      delay: progress * sweepMs, fade: 650, size: .45 + Math.random() * .8, color: i % DUST_COLORS.length };
  });
  for (let i = 0; i < 16; i++) particles.push({
    x: ribbon.x + (i + .5) / 16 * ribbon.width, y: ribbon.y + Math.min(14, ribbon.height) * Math.random(),
    dx: (Math.random() - .5) * 18, dy: -(8 + Math.random() * 16), delay: (i % 4) * 28, fade: 900,
    size: .4 + Math.random() * .85, color: i % DUST_COLORS.length,
  });
  let frame: number | null = null, start: number | null = null, stopped = false;
  function stop() {
    if (stopped) return; stopped = true;
    if (frame !== null) view.cancelAnimationFrame(frame); frame = null;
    document.removeEventListener("visibilitychange", visibility); reducedMotion.removeEventListener("change", motion); canvas.remove();
  }
  function visibility() { if (document.hidden) stop(); }
  function motion() { if (reducedMotion.matches) stop(); }
  function draw(time: number) {
    frame = null; if (stopped) return;
    if (document.hidden || reducedMotion.matches || !container.isConnected) { stop(); return; }
    if (start === null) start = time;
    const elapsed = time - start;
    if (elapsed >= duration) { stop(); return; }
    context.clearRect(0, 0, width, height); drawArtworkDustGlint(context, border, elapsed, inset);
    for (const particle of particles) {
      const p = Math.max(0, Math.min(1, (elapsed - particle.delay) / particle.fade));
      if (p <= 0 || p >= 1) continue;
      drawDustMote(context, inset + particle.x + particle.dx * p, inset + particle.y + particle.dy * p,
        particle.size * (1 - .2 * p), particle.color, Math.sin(Math.PI * p) * .8);
    }
    frame = view.requestAnimationFrame(draw);
  }
  document.addEventListener("visibilitychange", visibility); reducedMotion.addEventListener("change", motion);
  frame = view.requestAnimationFrame(draw); return stop;
}
