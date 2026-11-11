import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Artifact } from "@/content/artifacts";
import { ArtifactPlate, ArtifactStory, CoverLeft, CoverRight, EndLeft, EndRight } from "./pages";
import { cn } from "@/lib/utils";

type Spread = { key: string; label: string; left: ReactNode; right: ReactNode };

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function Flipbook({ items }: { items: Artifact[] }) {
  const [spread, setSpread] = useState(0);
  const [turn, setTurn] = useState<null | { dir: 1 | -1; to: number }>(null);
  const [mobilePage, setMobilePage] = useState(0);
  const leafRef = useRef<HTMLDivElement>(null);

  const jump = useCallback((to: number) => {
    setTurn(null);
    setSpread(to);
    setMobilePage(to * 2);
  }, []);

  const spreads: Spread[] = useMemo(
    () => [
      { key: "cover", label: "Cover", left: <CoverLeft items={items} onJump={jump} />, right: <CoverRight /> },
      ...items.map((a, i) => ({
        key: a.id,
        label: a.name,
        left: <ArtifactPlate a={a} number={i * 2 + 1} />,
        right: <ArtifactStory a={a} number={i * 2 + 2} />,
      })),
      { key: "end", label: "Afterword", left: <EndLeft />, right: <EndRight /> },
    ],
    [items, jump],
  );

  // Mobile reads one page at a time.
  const pages = useMemo(() => spreads.flatMap((s) => [s.left, s.right]), [spreads]);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (turn) return;
      const to = spread + dir;
      if (to < 0 || to >= spreads.length) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        setSpread(to);
        setMobilePage(to * 2);
      } else {
        setTurn({ dir, to });
      }
    },
    [spread, spreads.length, turn],
  );

  useIsoLayoutEffect(() => {
    if (!turn || !leafRef.current) return;
    const frames =
      turn.dir === 1
        ? [{ transform: "rotateY(0deg)" }, { transform: "rotateY(-180deg)" }]
        : [{ transform: "rotateY(-180deg)" }, { transform: "rotateY(0deg)" }];
    const anim = leafRef.current.animate(frames, {
      duration: 900,
      easing: "cubic-bezier(0.45, 0.05, 0.25, 1)",
      fill: "forwards",
    });
    anim.onfinish = () => {
      setSpread(turn.to);
      setMobilePage(turn.to * 2);
      setTurn(null);
    };
    return () => anim.cancel();
  }, [turn]);

  const goMobile = (dir: 1 | -1) => {
    const to = mobilePage + dir;
    if (to < 0 || to >= pages.length) return;
    setMobilePage(to);
    setSpread(Math.floor(to / 2));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    if (window.matchMedia("(max-width: 767px)").matches) goMobile(dir);
    else go(dir);
  };

  const lower = turn ? (turn.dir === 1 ? spread : turn.to) : spread;
  const higher = turn ? (turn.dir === 1 ? turn.to : spread) : spread;
  const at = (i: number): Spread => spreads[i] ?? spreads[0]!;
  const current = at(spread);

  return (
    <div
      className="w-full outline-none"
      tabIndex={0}
      onKeyDown={onKeyDown}
      role="region"
      aria-roledescription="flipbook"
      aria-label="NASA archive flipbook. Use left and right arrow keys to turn pages."
    >
      {/* Desktop: two-page spread with a turning leaf */}
      <div className="hidden md:block">
        <div className="relative mx-auto aspect-[8/5] w-full max-w-5xl [perspective:2400px]">
          <div className="book-shadow absolute inset-0 rounded-sm" />
          <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden rounded-l-sm">{at(lower).left}</div>
          <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden rounded-r-sm">
            {at(higher).right}
          </div>
          {turn && (
            <div
              ref={leafRef}
              className="absolute inset-y-0 right-0 z-10 w-1/2 origin-left [transform-style:preserve-3d]"
              style={{ transform: turn.dir === 1 ? "rotateY(0deg)" : "rotateY(-180deg)" }}
            >
              <div className="backface-hidden absolute inset-0 overflow-hidden rounded-r-sm">
                {at(lower).right}
              </div>
              <div className="backface-hidden absolute inset-0 overflow-hidden rounded-l-sm [transform:rotateY(180deg)]">
                {at(higher).left}
              </div>
            </div>
          )}
          {/* spine */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-ink/20 to-transparent"
          />
        </div>
        <Controls
          label={current.label}
          position={`${spread + 1} / ${spreads.length}`}
          canPrev={spread > 0 && !turn}
          canNext={spread < spreads.length - 1 && !turn}
          onPrev={() => go(-1)}
          onNext={() => go(1)}
        />
      </div>

      {/* Mobile: one page at a time */}
      <div className="md:hidden">
        <div key={mobilePage} className="page-in book-shadow mx-auto min-h-[34rem] w-full max-w-md overflow-hidden rounded-sm [&>div]:min-h-[34rem]">
          {pages[mobilePage]}
        </div>
        <Controls
          label={at(Math.floor(mobilePage / 2)).label}
          position={`${mobilePage + 1} / ${pages.length}`}
          canPrev={mobilePage > 0}
          canNext={mobilePage < pages.length - 1}
          onPrev={() => goMobile(-1)}
          onNext={() => goMobile(1)}
        />
      </div>

      <nav aria-label="Jump to a machine" className="mx-auto mt-6 flex max-w-5xl flex-wrap justify-center gap-2">
        {spreads.map((s, i) => (
          <button
            key={s.key}
            type="button"
            onClick={() => jump(i)}
            aria-current={i === spread ? "page" : undefined}
            className={cn(
              "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition",
              i === spread
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground",
            )}
          >
            {s.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function Controls({
  label,
  position,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: {
  label: string;
  position: string;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mx-auto mt-6 flex max-w-5xl items-center justify-between gap-4">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Previous page"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition hover:border-primary hover:text-primary disabled:opacity-30"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div className="text-center" aria-live="polite">
        <p className="font-display text-xl text-foreground">{label}</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{position}</p>
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Next page"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition hover:border-primary hover:text-primary disabled:opacity-30"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
