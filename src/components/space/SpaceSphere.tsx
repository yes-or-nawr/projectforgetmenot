import { useEffect, useRef } from "react";
import earthDay from "@/assets/media/earth-day.jpg.asset.json";
import earthClouds from "@/assets/media/earth-clouds.jpg.asset.json";

/**
 * A full 360° sky for the title screen. Move the cursor to look around
 * (holding it near an edge keeps turning), scroll to spin, or drag on touch.
 * Colours come from the --space-* tokens in styles.css (as "L C H" triples).
 */

type V3 = [number, number, number];
type Star = { d: V3; r: number; a: number; t: number; tint: number };
type Cloud = { d: V3; size: number; color: string; alpha: number };
type Body = { d: V3; size: number; kind: "moon" | "earth" | "giant" | "sun" };

const TAU = Math.PI * 2;

function dirFrom(yaw: number, pitch: number): V3 {
  return [Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch)];
}

function randomDir(): V3 {
  const z = Math.random() * 2 - 1;
  const phi = Math.random() * TAU;
  const s = Math.sqrt(1 - z * z);
  return [s * Math.cos(phi), z, s * Math.sin(phi)];
}

/** A point near a tilted great circle — the band of the galaxy. */
function bandDir(spread: number): V3 {
  const a = Math.random() * TAU;
  const off = (Math.random() + Math.random() + Math.random() - 1.5) * spread;
  const [x, y, z]: V3 = [Math.cos(a), off, Math.sin(a)];
  const tilt = 0.5;
  const ny = y * Math.cos(tilt) - z * Math.sin(tilt);
  const nz = y * Math.sin(tilt) + z * Math.cos(tilt);
  const len = Math.hypot(x, ny, nz);
  return [x / len, ny / len, nz / len];
}

export function SpaceSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const loadImg = (src: string) => {
      const im = new Image();
      im.crossOrigin = "anonymous";
      im.src = src;
      return im;
    };
    const dayImg = loadImg(earthDay.url);
    const cloudImg = loadImg(earthClouds.url);
    const t0 = performance.now();
    /** Orthographic globe: draw each screen column from the matching texture longitude. */
    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d")!;
    let ctxRef: CanvasRenderingContext2D = ctx;
    const drawGlobe = (img: HTMLImageElement, x: number, y: number, r: number, spin: number, alpha: number) => {
      if (!img.complete || !img.naturalWidth) return false;
      const W = img.naturalWidth;
      const H = img.naturalHeight;
      const step = Math.max(1, r / 70);
      ctxRef.globalAlpha = alpha;
      for (let dx = -r; dx < r; dx += step) {
        const mid = dx + step / 2;
        const half = Math.sqrt(Math.max(0, r * r - mid * mid));
        const lon = Math.asin(Math.max(-1, Math.min(1, mid / r)));
        const lon2 = Math.asin(Math.max(-1, Math.min(1, (dx + step) / r)));
        let sx = ((((spin + Math.asin(Math.max(-1, dx / r))) / TAU) % 1) + 1) % 1 * W;
        const sw = Math.max(1, ((lon2 - Math.asin(Math.max(-1, dx / r))) / TAU) * W);
        if (sx + sw > W) sx = W - sw;
        void lon;
        ctxRef.drawImage(img, sx, 0, sw, H, Math.floor(x + dx), y - half, Math.ceil(step) + 2, half * 2);
      }
      ctxRef.globalAlpha = 1;
      return true;
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(document.documentElement);
    const tok = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
    const c = {
      star: tok("--space-star", "0.97 0.02 250"),
      warm: tok("--space-star-warm", "0.9 0.06 80"),
      cool: tok("--space-star-cool", "0.88 0.07 220"),
      band: tok("--space-band", "0.8 0.03 250"),
      moon: tok("--space-moon", "0.82 0.012 260"),
      earth: tok("--space-earth", "0.62 0.13 235"),
      earthLand: tok("--space-earth-land", "0.7 0.1 150"),
      giant: tok("--space-giant", "0.85 0.08 80"),
      sun: tok("--space-sun", "0.97 0.05 90"),
      nebula: [
        tok("--space-nebula-1", "0.55 0.12 205"),
        tok("--space-nebula-2", "0.5 0.15 300"),
        tok("--space-nebula-3", "0.55 0.1 250"),
      ],
    };
    const col = (lch: string, a = 1) => `oklch(${lch} / ${a})`;
    const dim = (lch: string, f: number) => {
      const [l = "0.5", ...rest] = lch.split(/\s+/);
      return `oklch(${(parseFloat(l) * f).toFixed(3)} ${rest.join(" ")})`;
    };

    // --- the sky ---
    const stars: Star[] = [];
    for (let i = 0; i < 2600; i++)
      stars.push({ d: randomDir(), r: Math.random() ** 3 * 1.6 + 0.35, a: Math.random() * 0.7 + 0.3, t: Math.random() * TAU, tint: Math.random() });
    for (let i = 0; i < 3800; i++)
      stars.push({ d: bandDir(0.16), r: Math.random() ** 4 * 1.1 + 0.25, a: Math.random() * 0.5 + 0.15, t: Math.random() * TAU, tint: Math.random() });

    const clouds: Cloud[] = [];
    for (let i = 0; i < 46; i++)
      clouds.push({ d: bandDir(0.1), size: 0.18 + Math.random() * 0.35, color: c.band, alpha: 0.05 + Math.random() * 0.05 });
    const nebulaSpots: [number, number][] = [[0.9, 0.35], [2.6, -0.3], [4.3, 0.55], [5.4, -0.6]];
    nebulaSpots.forEach(([yaw, pitch], i) => {
      for (let k = 0; k < 6; k++)
        clouds.push({
          d: dirFrom(yaw + (Math.random() - 0.5) * 0.35, pitch + (Math.random() - 0.5) * 0.25),
          size: 0.2 + Math.random() * 0.25,
          color: c.nebula[i % c.nebula.length]!,
          alpha: 0.08 + Math.random() * 0.08,
        });
    });

    const bodies: Body[] = [
      { d: dirFrom(-0.75, 0.32), size: 0.07, kind: "moon" },
      { d: dirFrom(Math.PI * 0.85, -0.18), size: 0.16, kind: "earth" },
      { d: dirFrom(Math.PI * 0.4, 0.42), size: 0.045, kind: "giant" },
      { d: dirFrom(-Math.PI * 0.55, -0.05), size: 0.03, kind: "sun" },
    ];

    // --- camera ---
    let yaw = 0;
    let pitch = 0;
    let baseYaw = 0;
    let spin = 0;
    let mx = 0;
    let my = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let dragPitch = 0;

    let w = 0;
    let h = 0;
    let focal = 1;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const fov = (w > h ? 75 : 95) * (Math.PI / 180);
      focal = w / 2 / Math.tan(fov / 2);
    };
    resize();

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        mx = (e.clientX / w) * 2 - 1;
        my = (e.clientY / h) * 2 - 1;
      } else if (dragging) {
        baseYaw -= ((e.clientX - lastX) / focal) * 1.2;
        dragPitch += ((e.clientY - lastY) / focal) * 1.2;
        dragPitch = Math.max(-1.2, Math.min(1.2, dragPitch));
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => {
      dragging = false;
    };
    const onLeave = () => {
      mx = 0;
      my = 0;
    };
    const onWheel = (e: WheelEvent) => {
      spin += (e.deltaY + e.deltaX) * 0.00012;
      spin = Math.max(-0.08, Math.min(0.08, spin));
    };
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("wheel", onWheel, { passive: true });

    const project = (d: V3, cy: number, sy: number, cp: number, sp: number) => {
      const x1 = d[0] * cy - d[2] * sy;
      const z1 = d[0] * sy + d[2] * cy;
      const y2 = d[1] * cp - z1 * sp;
      const z2 = d[1] * sp + z1 * cp;
      if (z2 <= 0.05) return null;
      return { x: w / 2 + (x1 * focal) / z2, y: h / 2 - (y2 * focal) / z2, z: z2 };
    };

    const drawBody = (b: Body, x: number, y: number, r: number) => {
      if (b.kind === "sun") {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 6);
        g.addColorStop(0, col(c.sun, 1));
        g.addColorStop(0.12, col(c.sun, 0.9));
        g.addColorStop(0.3, col(c.sun, 0.18));
        g.addColorStop(1, col(c.sun, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r * 6, 0, TAU);
        ctx.fill();
        return;
      }
      const base = b.kind === "moon" ? c.moon : b.kind === "earth" ? c.earth : c.giant;
      // glow
      const glow = ctx.createRadialGradient(x, y, r * 0.9, x, y, r * 1.6);
      glow.addColorStop(0, col(base, b.kind === "earth" ? 0.35 : 0.15));
      glow.addColorStop(1, col(base, 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.6, 0, TAU);
      ctx.fill();
      // ring (back half)
      if (b.kind === "giant") {
        ctx.strokeStyle = col(base, 0.55);
        ctx.lineWidth = Math.max(1, r * 0.12);
        ctx.beginPath();
        ctx.ellipse(x, y, r * 2, r * 0.5, -0.32, Math.PI, TAU);
        ctx.stroke();
      }
      // sphere, lit from the upper left
      const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
      g.addColorStop(0, col(base, 1));
      g.addColorStop(0.6, dim(base, 0.6));
      g.addColorStop(1, dim(base, 0.22));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
      if (b.kind === "earth") {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.clip();
        const spin = ((performance.now() - t0) / 1000) * (reduce ? 0 : 0.02);
        const drew = drawGlobe(dayImg, x, y, r, spin + 1.2, 1);
        if (drew && cloudImg.complete && cloudImg.naturalWidth) {
          // Clouds go through an offscreen canvas so overlapping columns don't stack alpha into stripes.
          const size = Math.ceil(r * 2) + 4;
          if (off.width !== size) off.width = off.height = size;
          offCtx.clearRect(0, 0, size, size);
          const main = ctx;
          ctxRef = offCtx;
          drawGlobe(cloudImg, size / 2, size / 2, r, spin * 1.25 + 1.2, 1);
          ctxRef = main;
          ctx.save();
          ctx.globalCompositeOperation = "screen";
          ctx.globalAlpha = 0.7;
          ctx.drawImage(off, x - size / 2, y - size / 2);
          ctx.restore();
        }
        else {
          ctx.fillStyle = col(c.earthLand, 0.45);
          ctx.beginPath();
          ctx.ellipse(x - 0.3 * r, y - 0.2 * r, 0.3 * r, 0.2 * r, 0.4, 0, TAU);
          ctx.fill();
        }
        const shade = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.3, x, y, r * 1.05);
        shade.addColorStop(0, "oklch(0 0 0 / 0)");
        shade.addColorStop(1, "oklch(0 0 0 / 0.75)");
        ctx.fillStyle = shade;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
        ctx.restore();
        const rim = ctx.createRadialGradient(x, y, r * 0.92, x, y, r * 1.12);
        rim.addColorStop(0, col(c.earth, 0));
        rim.addColorStop(0.45, col(c.earth, 0.55));
        rim.addColorStop(1, col(c.earth, 0));
        ctx.fillStyle = rim;
        ctx.beginPath();
        ctx.arc(x, y, r * 1.12, 0, TAU);
        ctx.fill();
      }
      if (b.kind === "giant") {
        ctx.strokeStyle = col(base, 0.7);
        ctx.beginPath();
        ctx.ellipse(x, y, r * 2, r * 0.5, -0.32, 0, Math.PI);
        ctx.stroke();
      }
    };

    let raf = 0;
    let last = performance.now();
    const draw = (now: number) => {
      const dt = Math.min(50, now - last) / 16.67;
      last = now;

      // Cursor near an edge keeps turning; elsewhere it just tilts the view.
      const edge = Math.max(0, Math.abs(mx) - 0.55) / 0.45;
      baseYaw += Math.sign(mx) * edge * edge * 0.025 * dt;
      baseYaw += spin * dt;
      spin *= 0.94;
      if (!reduce && !dragging) baseYaw += 0.0006 * dt;
      const targetYaw = baseYaw + mx * 0.45;
      const targetPitch = Math.max(-1.25, Math.min(1.25, dragPitch - my * 0.7));
      yaw += (targetYaw - yaw) * 0.08 * dt;
      pitch += (targetPitch - pitch) * 0.08 * dt;

      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);

      ctx.clearRect(0, 0, w, h);

      for (const cl of clouds) {
        const p = project(cl.d, cy, sy, cp, sp);
        if (!p) continue;
        const r = (cl.size * focal) / p.z;
        if (p.x < -r || p.x > w + r || p.y < -r || p.y > h + r) continue;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, col(cl.color, cl.alpha));
        g.addColorStop(1, col(cl.color, 0));
        ctx.fillStyle = g;
        ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
      }

      const tints = [c.star, c.warm, c.cool];
      for (let k = 0; k < 3; k++) {
        ctx.fillStyle = col(tints[k]!);
        for (const s of stars) {
          const ti = s.tint < 0.7 ? 0 : s.tint < 0.85 ? 1 : 2;
          if (ti !== k) continue;
          const p = project(s.d, cy, sy, cp, sp);
          if (!p || p.x < 0 || p.x > w || p.y < 0 || p.y > h) continue;
          s.t += 0.02 * dt;
          ctx.globalAlpha = s.a * (0.75 + 0.25 * Math.sin(s.t));
          ctx.beginPath();
          ctx.arc(p.x, p.y, s.r, 0, TAU);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      for (const b of bodies) {
        const p = project(b.d, cy, sy, cp, sp);
        if (!p) continue;
        const r = (b.size * focal) / p.z;
        if (p.x < -r * 6 || p.x > w + r * 6 || p.y < -r * 6 || p.y > h + r * 6) continue;
        drawBody(b, p.x, p.y, r);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("wheel", onWheel);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
