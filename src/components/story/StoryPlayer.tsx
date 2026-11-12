import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, Volume2, VolumeX } from "lucide-react";
import { story, endingNotes, type Scene, type TextScene, type FlipbookScene, type VideoScene } from "@/content/story";
import { artifacts } from "@/content/artifacts";
import { Starfield } from "@/components/space/Starfield";
import { Planets } from "@/components/space/Planets";
import { MemoryCube } from "@/components/space/MemoryCube";
import { SpaceSphere } from "@/components/space/SpaceSphere";
import { Flipbook, type FlipbookHandle } from "@/components/flipbook/Flipbook";
import { SceneVideo, LastFrame } from "./SceneVideo";

type Step = { kind: "intro" } | Scene | { kind: "ending" } | { kind: "credits" };

export const steps: Step[] = [{ kind: "intro" }, ...story, { kind: "ending" }, { kind: "credits" }];

/** The video just before a text card: the card is shown over its final frame. */
function previousVideo(i: number): VideoScene | undefined {
  for (let k = i - 1; k >= 0; k--) {
    const s = steps[k];
    if (s?.kind === "video") return s;
    if (s?.kind !== "text") return undefined;
  }
  return undefined;
}

const FORWARD_KEYS = [" ", "Enter", "ArrowRight", "PageDown"];
const BACK_KEYS = ["ArrowLeft", "Backspace", "PageUp"];

/**
 * Full-screen, one-step-at-a-time story. Space / Enter / click moves forward,
 * ← / Backspace goes back, M toggles sound. Inside the archive, the same
 * inputs turn pages until the last one.
 */
export function StoryPlayer() {
  const [index, setIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const bookRef = useRef<FlipbookHandle>(null);
  const step = steps[index] ?? steps[0]!;
  const frozen = step.kind === "text" ? previousVideo(index) : undefined;

  const forward = useCallback(() => {
    if (step.kind === "flipbook" && bookRef.current?.next()) return;
    setIndex((i) => (i + 1 >= steps.length ? 0 : i + 1));
  }, [step.kind]);

  const back = useCallback(() => {
    if (step.kind === "flipbook" && bookRef.current?.prev()) return;
    setIndex((i) => Math.max(0, i - 1));
  }, [step.kind]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (FORWARD_KEYS.includes(e.key)) {
        e.preventDefault();
        (document.activeElement as HTMLElement | null)?.blur?.();
        if (!e.repeat) forward();
      } else if (BACK_KEYS.includes(e.key)) {
        e.preventDefault();
        if (!e.repeat) back();
      } else if (e.key.toLowerCase() === "m") {
        setSoundOn((s) => !s);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [forward, back]);

  return (
    <div
      className="relative h-dvh w-full cursor-pointer touch-none select-none overflow-hidden bg-background"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("[data-no-advance]")) return;
        forward();
      }}
    >
      {step.kind === "intro" ? (
        <SpaceSphere />
      ) : (
        <>
          <div aria-hidden className="absolute inset-0 bg-[image:var(--gradient-nebula)]" />
          <Starfield warp={index} />
          <Planets step={index} dim />
        </>
      )}

      {frozen && (
        <div className="absolute inset-0 z-[5]">
          <LastFrame scene={frozen} />
          <div aria-hidden className="absolute inset-0 bg-background/60" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent,var(--color-background))]" />
        </div>
      )}

      <main
        className={
          step.kind === "video"
            ? "absolute inset-0 z-10"
            : "relative z-10 flex h-full w-full items-center justify-center px-4 pb-16 pt-8 md:px-8"
        }
      >
        <div key={index} className={`scene-in flex w-full justify-center ${step.kind === "video" ? "h-full" : ""}`}>
          <StepView step={step} soundOn={soundOn} bookRef={bookRef} />
        </div>
      </main>

      {step.kind !== "intro" && (
        <Hud
          index={index}
          soundOn={soundOn}
          onBack={back}
          onToggleSound={() => setSoundOn((s) => !s)}
          isBook={step.kind === "flipbook"}
        />
      )}
    </div>
  );
}

function StepView({
  step,
  soundOn,
  bookRef,
}: {
  step: Step;
  soundOn: boolean;
  bookRef: React.RefObject<FlipbookHandle | null>;
}) {
  switch (step.kind) {
    case "intro":
      return <TitleCard />;
    case "text":
      return <TextCard scene={step} />;
    case "video":
      return <SceneVideo scene={step} soundOn={soundOn} />;
    case "flipbook":
      return <BookCard scene={step} bookRef={bookRef} />;
    case "ending":
      return <EndingCard />;
    case "credits":
      return <CreditsCard />;
  }
}

function TitleCard() {
  return (
    <div className="flex flex-col items-center text-center">
      <p className="rise font-mono text-[11px] uppercase tracking-[0.35em] text-primary">NASA Space Apps Challenge 2026</p>
      <div className="rise mt-10" style={{ animationDelay: "200ms" }}>
        <MemoryCube size={104} />
      </div>
      <h1
        className="rise mt-12 font-display text-6xl leading-[0.9] text-foreground md:text-8xl"
        style={{ animationDelay: "400ms" }}
      >
        The Memory <em className="text-primary">Cube</em>
      </h1>
      <p
        className="rise mt-5 max-w-md text-base leading-relaxed text-foreground/75 md:text-lg"
        style={{ animationDelay: "600ms" }}
      >
        A story about the machines we left on the Moon, Mars and beyond, and the people who built them.
      </p>
      <p
        className="rise hint-pulse mt-12 font-mono text-[11px] uppercase tracking-[0.3em] text-foreground"
        style={{ animationDelay: "900ms" }}
      >
        Press Space · Enter · or click to begin
      </p>
      <p className="rise mt-3 text-xs text-muted-foreground" style={{ animationDelay: "1000ms" }}>
        Move your cursor, scroll or drag to look around · press M to mute
      </p>
    </div>
  );
}

function TextCard({ scene }: { scene: TextScene }) {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="rise font-mono text-[11px] uppercase tracking-[0.3em] text-primary">{scene.eyebrow}</p>
      <div className="mt-8 space-y-7">
        {scene.paragraphs.map((p, i) => {
          const last = i === scene.paragraphs.length - 1;
          return (
            <p
              key={i}
              className={`rise font-display leading-tight ${
                last ? "text-4xl italic text-primary md:text-6xl" : "text-3xl text-foreground md:text-5xl"
              }`}
              style={{ animationDelay: `${300 + i * 900}ms` }}
            >
              {p}
            </p>
          );
        })}
      </div>
    </div>
  );
}

function BookCard({
  scene,
  bookRef,
}: {
  scene: FlipbookScene;
  bookRef: React.RefObject<FlipbookHandle | null>;
}) {
  return (
    <div className="w-full max-w-6xl">
      <div className="rise mb-5 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-hologram">{scene.eyebrow}</p>
        <h2 className="mt-1 font-display text-4xl leading-none text-foreground md:text-5xl">{scene.title}</h2>
        <p className="mt-2 hidden text-sm text-muted-foreground md:block">{scene.intro}</p>
      </div>
      <div className="rise" style={{ animationDelay: "250ms" }}>
        <Flipbook items={artifacts} ref={bookRef} />
      </div>
    </div>
  );
}

function EndingCard() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="rise font-mono text-[11px] uppercase tracking-[0.3em] text-primary">The end</p>
      <h2 className="rise mt-3 font-display text-5xl leading-none text-foreground md:text-6xl" style={{ animationDelay: "150ms" }}>
        {endingNotes.title}
      </h2>
      <div className="mt-8 space-y-5">
        {endingNotes.paragraphs.map((p, i) => (
          <p key={i} className="rise text-lg leading-relaxed text-foreground/85" style={{ animationDelay: `${400 + i * 300}ms` }}>
            {p}
          </p>
        ))}
        <p className="rise font-display text-2xl italic text-primary" style={{ animationDelay: "900ms" }}>
          {endingNotes.signature}
        </p>
      </div>
    </div>
  );
}

function CreditsCard() {
  return (
    <div className="mx-auto w-full max-w-3xl text-center">
      <p className="rise font-mono text-[11px] uppercase tracking-[0.3em] text-primary">Credits &amp; sources</p>
      <h2 className="rise mt-3 font-display text-4xl leading-tight text-foreground md:text-5xl" style={{ animationDelay: "150ms" }}>
        Abandoned, but not forgotten
      </h2>
      <p className="rise mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground" style={{ animationDelay: "300ms" }}>
        Made for the 2026 NASA Space Apps Challenge. Archive facts come from official NASA mission pages, and the photos
        come from the NASA Image and Video Library. This is not an official NASA website.
      </p>
      <ul
        data-no-advance
        className="rise mx-auto mt-8 grid max-w-2xl cursor-default grid-cols-2 gap-x-6 gap-y-2 text-left text-sm md:grid-cols-3"
        style={{ animationDelay: "450ms" }}
      >
        {artifacts.map((a) => (
          <li key={a.id}>
            <a
              href={a.sources[0]?.url}
              target="_blank"
              rel="noreferrer"
              className="text-foreground/80 underline decoration-dotted underline-offset-4 hover:text-primary"
            >
              {a.name}
            </a>
            <span className="ml-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{a.world}</span>
          </li>
        ))}
      </ul>
      <p className="rise hint-pulse mt-10 font-mono text-[11px] uppercase tracking-[0.3em] text-foreground" style={{ animationDelay: "700ms" }}>
        Press Space to watch again
      </p>
    </div>
  );
}

function Hud({
  index,
  soundOn,
  onBack,
  onToggleSound,
  isBook,
}: {
  index: number;
  soundOn: boolean;
  onBack: () => void;
  onToggleSound: () => void;
  isBook: boolean;
}) {
  const iconBtn =
    "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/50 text-foreground/80 backdrop-blur transition hover:border-primary hover:text-primary";
  return (
    <div data-no-advance className="absolute inset-x-0 bottom-0 z-20 flex cursor-default items-center justify-between gap-4 px-4 pb-4 md:px-6">
      <button
        type="button"
        aria-label="Go back"
        className={iconBtn}
        onClick={(e) => {
          e.currentTarget.blur();
          onBack();
        }}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-1.5" aria-label={`Step ${index} of ${steps.length - 1}`}>
          {steps.slice(1).map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i + 1 === index ? "w-6 bg-primary" : i + 1 < index ? "w-1.5 bg-foreground/50" : "w-1.5 bg-foreground/15"
              }`}
            />
          ))}
        </div>
        <p className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:block">
          {isBook ? "Space · Enter · click to turn the page" : "Space · Enter · click to continue"}
        </p>
      </div>

      <button
        type="button"
        aria-label={soundOn ? "Mute (M)" : "Turn sound on (M)"}
        className={iconBtn}
        onClick={(e) => {
          e.currentTarget.blur();
          onToggleSound();
        }}
      >
        {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </button>
    </div>
  );
}
