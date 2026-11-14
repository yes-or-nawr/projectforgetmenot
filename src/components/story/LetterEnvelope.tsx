import { useCallback, useEffect, useImperativeHandle, useRef, useState, type CSSProperties, type Ref } from "react";
import { ChevronDown } from "lucide-react";
import type { LetterScene } from "@/content/story";
import type { StepHandle } from "./step-handle";
import { personalize, usePlayerName } from "./PlayerName";

/** How long the envelope takes to open before the letter unrolls. */
const OPEN_MS = 2300;

/**
 * A sealed envelope opens and a formal parchment scroll unrolls. Reading down
 * (scroll, drag, arrow keys, or Space / Enter / click) winds the read part of
 * the paper onto the top roller while the bottom roller gets thinner.
 */
export function LetterEnvelope({ letter, ref }: { letter: LetterScene; ref?: Ref<StepHandle> }) {
  const [open, setOpen] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(true);
      return;
    }
    const t = window.setTimeout(() => setOpen(true), OPEN_MS);
    return () => window.clearTimeout(t);
  }, []);

  // Keep the envelope on screen while it fades out under the unrolling letter.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => setShowEnvelope(false), 700);
    return () => window.clearTimeout(t);
  }, [open]);

  const update = useCallback(() => {
    const s = scrollerRef.current;
    const root = rootRef.current;
    if (!s || !root) return;
    const max = s.scrollHeight - s.clientHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, s.scrollTop / max)) : 1;
    root.style.setProperty("--roll", p.toFixed(3));
    setAtEnd(max <= 2 || s.scrollTop >= max - 2);
  }, []);

  useEffect(() => {
    if (!open) return;
    const s = scrollerRef.current;
    // Wheel anywhere on screen reads the letter; arrow keys too.
    const onWheel = (e: WheelEvent) => {
      if (!s || s.contains(e.target as Node)) return;
      s.scrollBy({ top: e.deltaY });
    };
    const onKey = (e: KeyboardEvent) => {
      if (!s) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        s.scrollBy({ top: 90, behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        s.scrollBy({ top: -90, behavior: "smooth" });
      }
    };
    const raf = requestAnimationFrame(update);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", update);
    };
  }, [open, update]);

  useImperativeHandle(
    ref,
    () => ({
      next: () => {
        if (!open) {
          setOpen(true);
          return true;
        }
        const s = scrollerRef.current;
        if (!s) return false;
        if (s.scrollTop >= s.scrollHeight - s.clientHeight - 2) return false;
        s.scrollBy({ top: s.clientHeight * 0.75, behavior: "smooth" });
        return true;
      },
      prev: () => {
        const s = scrollerRef.current;
        if (!open || !s || s.scrollTop <= 2) return false;
        s.scrollBy({ top: -s.clientHeight * 0.75, behavior: "smooth" });
        return true;
      },
    }),
    [open],
  );

  return (
    <div
      ref={rootRef}
      className="relative flex h-full w-full items-center justify-center px-3 pb-16 pt-6"
      style={{ "--roll": 0 } as CSSProperties}
    >
      {showEnvelope && (
        <div
          aria-hidden={open}
          className={`absolute inset-0 flex items-center justify-center px-3 pb-16 pt-6 transition-opacity duration-700 ${
            open ? "opacity-0" : "opacity-100"
          }`}
        >
          <Envelope seal={letter.seal} />
        </div>
      )}
      {open && (
        <div
          className="letter-unfurl relative flex flex-col items-center"
          style={{ width: "min(700px, 94vw)" }}
          role="document"
          aria-label="Letter"
          onAnimationEnd={update}
        >
          <Roller where="top" />
          <div className="parchment relative min-h-0 w-[calc(100%-1.75rem)] flex-1 overflow-hidden">
            <div
              ref={scrollerRef}
              onScroll={update}
              className="letter-scroller h-full touch-pan-y overflow-y-auto overscroll-contain"
            >
              <LetterBody letter={letter} />
            </div>
            <div aria-hidden className="letter-curl-top pointer-events-none absolute inset-x-0 top-0 h-10" />
            <div aria-hidden className="letter-curl-bottom pointer-events-none absolute inset-x-0 bottom-0 h-8" />
          </div>
          <Roller where="bottom" />
          <ChevronDown
            aria-hidden
            className={`absolute -bottom-9 h-5 w-5 text-parchment transition-opacity duration-500 ${
              atEnd ? "opacity-0" : "hint-pulse"
            }`}
          />
        </div>
      )}
    </div>
  );
}

function LetterBody({ letter }: { letter: LetterScene }) {
  const { name } = usePlayerName();
  const fill = (t: string) => personalize(t, name);
  return (
    <article className="letter-frame mx-4 my-6 px-6 pb-24 pt-8 text-ink md:mx-6 md:my-8 md:px-12 md:pt-10">
      <header className="flex flex-col items-center text-center">
        <Crest />
        <p className="mt-3 font-letter text-sm uppercase tracking-[0.45em] text-ink-muted">Project ForgetMeNot</p>
        <div aria-hidden className="mt-4 flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-ink/30" />
          <span className="h-1.5 w-1.5 rotate-45 bg-wax" />
          <span className="h-px flex-1 bg-ink/30" />
        </div>
      </header>
      {letter.dateline && (
        <p className="mt-6 text-right font-letter text-base italic text-ink-muted md:text-lg">{fill(letter.dateline)}</p>
      )}
      <p className="mt-6 font-letter text-2xl italic md:text-3xl">{fill(letter.salutation)}</p>
      <div className="mt-5 space-y-5">
        {letter.paragraphs.map((p, i) => (
          <p
            key={i}
            className={`font-letter text-xl leading-relaxed md:text-[1.45rem] ${i === 0 ? "letter-dropcap" : ""}`}
          >
            {fill(p)}
          </p>
        ))}
      </div>
      <p className="mt-10 font-letter text-xl italic md:text-2xl">{fill(letter.closing)}</p>
      <p className="mt-2 font-script text-4xl leading-tight text-ink md:text-5xl">{letter.signature}</p>
      <div className="mt-10 flex justify-end">
        <span className="wax-seal h-16 w-16 text-xl">{letter.seal}</span>
      </div>
    </article>
  );
}

function Roller({ where }: { where: "top" | "bottom" }) {
  return (
    <div
      aria-hidden
      className="roller relative z-10 w-full"
      style={{
        height:
          where === "top"
            ? "calc(14px + var(--roll) * 26px)"
            : "calc(14px + (1 - var(--roll)) * 26px)",
      }}
    >
      <span className="roller-paper absolute inset-x-3 inset-y-0 rounded-full" />
      <span className="roller-cap absolute -left-1 top-1/2 h-[18px] w-4 -translate-y-1/2 rounded-sm" />
      <span className="roller-cap absolute -right-1 top-1/2 h-[18px] w-4 -translate-y-1/2 rounded-sm" />
    </div>
  );
}

function Envelope({ seal }: { seal: string }) {
  return (
    <div className="envelope-stage relative" style={{ width: "min(540px, 86vw)" }} aria-label="A sealed envelope opens">
      <div className="relative aspect-[1.6] w-full [perspective:1400px]">
        <div className="env-back absolute inset-0 rounded-[3px]" />
        <div className="env-letter parchment absolute inset-x-[7%] bottom-[6%] top-[7%] rounded-[2px] p-[6%]">
          <div className="space-y-2 opacity-40">
            <span className="mx-auto block h-1 w-1/3 rounded bg-ink/60" />
            <span className="block h-px w-full bg-ink/40" />
            <span className="block h-1 w-5/6 rounded bg-ink/40" />
            <span className="block h-1 w-4/6 rounded bg-ink/40" />
          </div>
        </div>
        <div className="env-pocket absolute inset-0 rounded-[3px]" />
        <div className="env-flap absolute inset-x-0 top-0 h-[56%] origin-top" />
        <span className="env-seal wax-seal absolute left-1/2 top-[56%] h-14 w-14 -translate-x-1/2 -translate-y-1/2 text-lg md:h-16 md:w-16">
          {seal}
        </span>
      </div>
    </div>
  );
}

function Crest() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10 text-ink" aria-hidden>
      <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M24 10 36 17v14l-12 7-12-7V17z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 17l12 7 12-7M24 24v14" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="24" cy="24" r="2.2" className="fill-wax" />
    </svg>
  );
}
