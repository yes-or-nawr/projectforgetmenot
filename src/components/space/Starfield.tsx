import { useEffect, useRef } from "react";

type Star = { x: number; y: number; z: number; r: number; t: number };

/** Drifting, twinkling stars. Changing `warp` sends a short hyperspace streak. */
export function Starfield({ warp }: { warp: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boostRef = useRef(0);

  useEffect(() => {
    boostRef.current = 1;
  }, [warp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const color = getComputedStyle(document.documentElement).getPropertyValue("--star").trim() || "white";
    let w = 0;
    let h = 0;
    let stars: Star[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 2200);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 0.9 + 0.1,
        r: Math.random() * 1.1 + 0.25,
        t: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = performance.now();
    const draw = (now: number) => {
      const dt = Math.min(50, now - last) / 16.67;
      last = now;
      const boost = reduce ? 0 : boostRef.current;
      boostRef.current *= 0.94;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (const s of stars) {
        const speed = (0.04 + boost * 9) * s.z;
        s.x -= speed * dt;
        if (s.x < -20) {
          s.x = w + 2;
          s.y = Math.random() * h;
        }
        s.t += 0.025 * dt;
        ctx.globalAlpha = 0.25 + 0.75 * s.z * (0.7 + 0.3 * Math.sin(s.t));
        if (boost > 0.04) {
          ctx.fillRect(s.x, s.y, s.r + speed * 4, s.r);
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw(last);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
