/** A slowly spinning 3D cube with a glowing button, for the title card. */
export function MemoryCube({ size = 112 }: { size?: number }) {
  const half = size / 2;
  const faces = [
    `rotateY(0deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ];
  return (
    <div aria-hidden className="cube-float [perspective:800px]" style={{ width: size, height: size }}>
      <div className="cube-3d relative h-full w-full">
        {faces.map((t, i) => (
          <div key={i} className="cube-face flex items-center justify-center" style={{ transform: t }}>
            <span className="absolute inset-3 rounded-[2px] border border-foreground/10" />
            {i < 4 && <span className="h-3 w-3 rounded-full bg-hologram shadow-[var(--shadow-holo)]" />}
          </div>
        ))}
      </div>
    </div>
  );
}
