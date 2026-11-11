import type { ReactNode } from "react";

/** The cube's holographic projection: a glowing screen on a beam of light. */
export function HologramFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-full">
      <div className="holo-screen relative overflow-hidden rounded-md border border-hologram/60 bg-hologram/5">
        <div className="relative [&_img]:opacity-85 [&_video]:opacity-90">{children}</div>
        {/* tint + scanlines + sweep sit above the media */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-hologram/10 mix-blend-screen" />
        <div aria-hidden className="holo-scanlines pointer-events-none absolute inset-0" />
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="holo-sweep h-1/3 w-full" />
        </div>
        <Corner className="left-2 top-2" />
        <Corner className="right-2 top-2 rotate-90" />
        <Corner className="bottom-2 right-2 rotate-180" />
        <Corner className="bottom-2 left-2 -rotate-90" />
      </div>
      {/* projection beam and the cube */}
      <div aria-hidden className="holo-beam mx-auto h-16 w-full md:h-24" />
      <div aria-hidden className="mx-auto -mt-1 flex h-10 w-10 items-center justify-center rounded-sm border border-foreground/20 bg-gradient-to-b from-muted to-secondary shadow-[var(--shadow-holo)] md:h-12 md:w-12">
        <span className="h-2.5 w-2.5 rounded-full bg-hologram shadow-[var(--shadow-holo)]" />
      </div>
    </div>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-4 w-4 border-l-2 border-t-2 border-hologram ${className}`}
    />
  );
}
