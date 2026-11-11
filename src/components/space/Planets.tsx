/** Moon, Mars and a distant ringed world, drifting a little with each scene. */
export function Planets({ step, dim }: { step: number; dim?: boolean }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${dim ? "opacity-35" : "opacity-90"}`}>
      <div
        className="planet planet-moon left-[6%] top-[10%] h-20 w-20 md:h-32 md:w-32"
        style={{ transform: `translateX(${-step * 6}px)` }}
      />
      <div
        className="planet planet-mars -bottom-24 -right-20 h-64 w-64 md:-bottom-40 md:-right-32 md:h-[26rem] md:w-[26rem]"
        style={{ transform: `translateX(${-step * 14}px)` }}
      />
      <div
        className="planet planet-giant right-[14%] top-[12%] h-8 w-8 opacity-70 md:h-12 md:w-12"
        style={{ transform: `translateX(${-step * 3}px)` }}
      >
        <span className="planet-ring" />
      </div>
    </div>
  );
}
