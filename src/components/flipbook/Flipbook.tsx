import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Ref,
  type MouseEvent,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Artifact } from "@/content/artifacts";
import { ArtifactPlate, ArtifactStory, CoverLeft, CoverRight, EndLeft, EndRight } from "./pages";

type Spread = { key: string; label: string; left: ReactNode; right: ReactNode };

/** Lets the story player turn pages with Space / Enter / click. */
export type FlipbookHandle = {
  /** Turns forward; returns false when already on the last page. */
  next: () => boolean;
  /** Turns back; returns false when already on the first page. */
  prev: () => boolean;
};

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
const clickedControl = (e: MouseEvent) => !!(e.target as HTMLElement).closest("a, button");

export function Flipbook({ items, ref }: { items: Artifact[]; ref?: Ref<FlipbookHandle> }) {
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

  const pages = useMemo(() => spreads.flatMap((s) => [s.left, s.right]), [spreads]);
  const at = (i: number): Spread => spreads[i] ?? spreads[0]!;

  const go = useCallback(
    (dir: 1 | -1): boolean => {
      if (turn) return true; // swallow input mid-turn
      const to = spread + dir;
      if (to < 0 || to >= spreads.length) return false;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setSpread(to);
        setMobilePage(to * 2);
      } else {
        setTurn({ dir, to });
      }
      return true;
    },
    [spread, spreads.length, turn],
  );

  const goMobile = useCallback(
    (dir: 1 | -1): boolean => {
      const to = mobilePage + dir;
      if (to < 0 || to >= pages.length) return false;
      setMobilePage(to);
      setSpread(Math.floor(to / 2));
      return true;
    },
    [mobilePage, pages.length],
  );

  useImperativeHandle(
    ref,
    () => ({
      next: () => (isMobile() ? goMobile(1) : go(1)),
      prev: () => (isMobile() ? goMobile(-1) : go(-1)),
    }),
    [go, goMobile],
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

  const lower = turn ? (turn.dir === 1 ? spread : turn.to) : spread;
  const higher = turn ? (turn.dir === 1 ? turn.to : spread) : spread;

  return (
    <div
      data-no-advance
      className="w-full"
      role="region"
      aria-roledescription="flipbook"
      aria-label="NASA archive flipbook. Press Space or Enter, or click a page, to turn it."
    >
      {/* Desktop: two-page spread with a turning leaf. Click a page to turn it. */}
      <div className="hidden md:block">
        <div
          className="relative mx-auto aspect-[8/5] [perspective:2400px]"
          style={{ width: "min(100%, calc((100dvh - 17rem) * 1.6))" }}
        >
          <div className="book-shadow absolute inset-0 rounded-sm" />
          <div
            className="absolute inset-y-0 left-0 w-1/2 cursor-w-resize overflow-hidden rounded-l-sm"
            onClick={(e) => !clickedControl(e) && go(-1)}
          >
            {at(lower).left}
          </div>
          <div
            className="absolute inset-y-0 right-0 w-1/2 cursor-e-resize overflow-hidden rounded-r-sm"
            onClick={(e) => !clickedControl(e) && go(1)}
          >
            {at(higher).right}
          </div>
          {turn && (
            <div
              ref={leafRef}
              className="absolute inset-y-0 right-0 z-10 w-1/2 origin-left [transform-style:preserve-3d]"
              style={{ transform: turn.dir === 1 ? "rotateY(0deg)" : "rotateY(-180deg)" }}
            >
              <div className="backface-hidden absolute inset-0 overflow-hidden rounded-r-sm">{at(lower).right}</div>
              <div className="backface-hidden absolute inset-0 overflow-hidden rounded-l-sm [transform:rotateY(180deg)]">
                {at(higher).left}
              </div>
            </div>
          )}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-ink/20 to-transparent"
          />
        </div>
        <Controls
          label={at(spread).label}
          position={`${spread + 1} / ${spreads.length}`}
          canPrev={spread > 0 && !turn}
          canNext={spread < spreads.length - 1 && !turn}
          onPrev={() => go(-1)}
          onNext={() => go(1)}
        />
      </div>

      {/* Mobile: one page at a time. Tap the right side to go on, the left side to go back. */}
      <div className="md:hidden">
        <div
          key={mobilePage}
          className="page-in book-shadow mx-auto w-full max-w-md overflow-hidden rounded-sm"
          style={{ height: "calc(100dvh - 17rem)" }}
          onClick={(e) => {
            if (clickedControl(e)) return;
            const box = e.currentTarget.getBoundingClientRect();
            goMobile(e.clientX - box.left < box.width / 3 ? -1 : 1);
          }}
        >
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
  const btn =
    "flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition hover:border-primary hover:text-primary disabled:opacity-30";
  return (
    <div className="mx-auto mt-4 flex max-w-md items-center justify-between gap-4">
      <button
        type="button"
        onClick={(e) => {
          e.currentTarget.blur();
          onPrev();
        }}
        disabled={!canPrev}
        aria-label="Previous page"
        className={btn}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div className="text-center" aria-live="polite">
        <p className="font-display text-lg leading-tight text-foreground">{label}</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{position}</p>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.currentTarget.blur();
          onNext();
        }}
        disabled={!canNext}
        aria-label="Next page"
        className={btn}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
