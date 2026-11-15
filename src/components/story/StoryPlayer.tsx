import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, Volume2, VolumeX } from "lucide-react";
import { story, endingNotes, ambientAudio, type Scene, type FlipbookScene, type VideoScene } from "@/content/story";
import { artifacts } from "@/content/artifacts";
import { Starfield } from "@/components/space/Starfield";
import { Planets } from "@/components/space/Planets";
import { MemoryCube } from "@/components/space/MemoryCube";
import { SpaceSphere } from "@/components/space/SpaceSphere";
import { Flipbook } from "@/components/flipbook/Flipbook";
import { SceneVideo, LastFrame } from "./SceneVideo";
import { LetterEnvelope } from "./LetterEnvelope";
import { Quiz } from "./Quiz";
import type { StepHandle } from "./step-handle";
import { NameForm } from "./PlayerName";

type Step = { kind: "intro" } | Scene | { kind: "ending" } | { kind: "credits" };

export const steps: Step[] = [{ kind: "intro" }, ...story, { kind: "ending" }, { kind: "credits" }];

/** Volume of the first clip's soundtrack when it plays under later scenes. */
const AMBIENT_VOLUME = 0.35;

/** A letter appears over the frozen last frame of the clip just before it. */
function previousVideo(i: number): VideoScene | undefined {
  const s = steps[i - 1];
  return s?.kind === "video" ? s : undefined;
}

const FORWARD_KEYS = [" ", "Enter", "ArrowRight", "PageDown"];
const BACK_KEYS = ["ArrowLeft", "Backspace", "PageUp"];

/**
 * Full-screen, one-step-at-a-time story. Space / Enter / click moves forward,
 * ← / Backspace goes back, M toggles sound. Letters, the archive and the quiz
 * use the same inputs to scroll, turn pages or move between questions first.
 */
export function StoryPlayer() {
  const [index, setIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [hudAwake, setHudAwake] = useState(true);
  const handleRef = useRef<StepHandle>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const step = steps[index] ?? steps[0]!;
  const frozen = step.kind === "letter" ? previousVideo(index) : undefined;
  const hasHandle = step.kind === "letter" || step.kind === "flipbook" || step.kind === "quiz";
  const fullBleed = step.kind === "video" || step.kind === "letter";

  const advance = useCallback(() => setIndex((i) => (i + 1 >= steps.length ? 0 : i + 1)), []);

  const forward = useCallback(() => {
    if (step.kind === "intro") return; // the name form starts the story
    if (hasHandle && handleRef.current?.next()) return;
    advance();
  }, [hasHandle, advance, step.kind]);

  const back = useCallback(() => {
    if (hasHandle && handleRef.current?.prev()) return;
    setIndex((i) => Math.max(0, i - 1));
  }, [hasHandle]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const focused = document.activeElement as HTMLElement | null;
      if (focused?.matches("input, textarea")) return; // let people type their name
      // Let a keyboard-focused button (quiz answers, page controls) work normally.
      if ((e.key === " " || e.key === "Enter") && focused?.matches("[data-no-advance] button, [data-no-advance] a")) return;
      if (FORWARD_KEYS.includes(e.key)) {
        e.preventDefault();
        focused?.blur?.();
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

  // During clips the controls fade away until the pointer moves.
  useEffect(() => {
    let t = 0;
    const wake = () => {
      setHudAwake(true);
      window.clearTimeout(t);
      t = window.setTimeout(() => setHudAwake(false), 2200);
    };
    wake();
    window.addEventListener("pointermove", wake);
    window.addEventListener("pointerdown", wake);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("pointerdown", wake);
    };
  }, [index]);

  // The soundtrack plays once, from the start, under each regular video clip marked
  // `ambient`. It never plays under the hologram scene or anywhere else, and it does not loop.
  const ambientScene = step.kind === "video" && !!step.ambient && !step.hologram;
  const ambientOn = soundOn && ambientScene;
  const ambientDoneRef = useRef(false);

  // Each new step starts the track over, ready for the next ambient clip.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    ambientDoneRef.current = false;
    // Leaving an ambient clip for anything else cuts the track straight away.
    // (Without this it restarts and fades out audibly under the next scene.)
    if (!ambientScene) {
      a.pause();
      a.volume = 0;
    }
    a.currentTime = 0;
    // ambientScene only changes when the step changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const target = ambientOn ? AMBIENT_VOLUME : 0;
    // `ambientDoneRef` stops it replaying if the track already finished (e.g. mute then unmute).
    if (ambientOn && a.paused && !ambientDoneRef.current) {
      a.volume = 0;
      a.play().catch(() => {});
    }
    let raf = 0;
    const tick = () => {
      const v = a.volume + (target - a.volume) * 0.06;
      if (Math.abs(target - v) < 0.005) {
        a.volume = target;
        if (target === 0) a.pause();
        return;
      }
      a.volume = v;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ambientOn, index]);

  return (
    <div
      className="relative h-dvh w-full cursor-pointer touch-none select-none overflow-hidden bg-background"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("[data-no-advance]")) return;
        forward();
      }}
    >
      <audio
        ref={audioRef}
        src={ambientAudio}
        preload="auto"
        onEnded={() => {
          ambientDoneRef.current = true;
        }}
      />

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
          <div aria-hidden className="absolute inset-0 bg-background/55" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent,var(--color-background))]" />
        </div>
      )}

      <main
        className={
          fullBleed
            ? "absolute inset-0 z-10"
            : "relative z-10 flex h-full w-full items-center justify-center px-4 pb-16 pt-8 md:px-8"
        }
      >
        <div key={index} className={`scene-in flex w-full justify-center ${fullBleed ? "h-full" : ""}`}>
          <StepView step={step} soundOn={soundOn} handleRef={handleRef} onDone={advance} />
        </div>
      </main>

      {step.kind === "intro" && (
        <a
          data-no-advance
          href="https://github.com/yes-or-nawr/projectforgetmenot"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Project ForgetMeNot on GitHub"
          onClick={(e) => e.stopPropagation()}
          className="rise hint-pulse absolute right-4 top-4 z-30 flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-hologram)]/70 bg-background/80 px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-hologram)] shadow-[0_0_16px_rgba(34,211,238,0.3)] backdrop-blur-md transition-all hover:scale-105 md:right-6 md:top-6"
          style={{ animationDelay: "800ms" }}
        >
          <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
            <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
          </svg>
          <span className="hidden sm:inline">GitHub</span>
        </a>
      )}

      {step.kind !== "intro" && (
        <Hud
          index={index}
          soundOn={soundOn}
          hidden={step.kind === "video" && !hudAwake}
          onBack={back}
          onToggleSound={() => setSoundOn((s) => !s)}
        />
      )}
    </div>
  );
}

function StepView({
  step,
  soundOn,
  handleRef,
  onDone,
}: {
  step: Step;
  soundOn: boolean;
  handleRef: React.RefObject<StepHandle | null>;
  onDone: () => void;
}) {
  switch (step.kind) {
    case "intro":
      return <TitleCard onStart={onDone} />;
    case "video":
      return <SceneVideo scene={step} soundOn={soundOn} />;
    case "letter":
      return <LetterEnvelope letter={step} ref={handleRef} />;
    case "flipbook":
      return <BookCard scene={step} handleRef={handleRef} />;
    case "quiz":
      return <Quiz quiz={step} onFinish={onDone} ref={handleRef} />;
    case "ending":
      return <EndingCard />;
    case "credits":
      return <CreditsCard />;
  }
}

function TitleCard({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="rise mt-10" style={{ animationDelay: "200ms" }}>
        <MemoryCube size={104} />
      </div>
      <h1
        className="rise mt-12 font-display text-6xl leading-[0.9] text-foreground md:text-8xl"
        style={{ animationDelay: "400ms" }}
      >
        Project <em className="text-primary">ForgetMeNot</em>
      </h1>
      <p
        className="rise mt-5 max-w-md text-base leading-relaxed text-foreground/75 md:text-lg"
        style={{ animationDelay: "600ms" }}
      >
        
      </p>
      <NameForm onSubmit={onStart} />
      <p className="rise mt-3 text-xs text-muted-foreground" style={{ animationDelay: "1000ms" }}>
        Move your cursor, scroll or drag to look around · press M to mute
      </p>
    </div>
  );
}

function BookCard({ scene, handleRef }: { scene: FlipbookScene; handleRef: React.RefObject<StepHandle | null> }) {
  return (
    <div className="w-full max-w-6xl">
      <div className="rise mb-5 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-hologram">{scene.eyebrow}</p>
        <h2 className="mt-1 font-display text-4xl leading-none text-foreground md:text-5xl">{scene.title}</h2>
        <p className="mt-2 hidden text-sm text-muted-foreground md:block">{scene.intro}</p>
      </div>
      <div className="rise" style={{ animationDelay: "250ms" }}>
        <Flipbook items={artifacts} ref={handleRef} />
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
        Project ForgetMeNot, made for the 2026 NASA Space Apps Challenge "Abandoned but not Forgotten". Archive facts
        come from the official NASA resources listed for the challenge (science.nasa.gov, nasa.gov, NSSDCA and JPL), photos
        from the NASA Image and Video Library, and the Earth on the title screen from NASA Blue Marble imagery. Click a
        machine below to open its NASA source. This is not an official NASA website.
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
  hidden,
  onBack,
  onToggleSound,
}: {
  index: number;
  soundOn: boolean;
  hidden: boolean;
  onBack: () => void;
  onToggleSound: () => void;
}) {
  const iconBtn =
    "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/50 text-foreground/80 backdrop-blur transition hover:border-primary hover:text-primary";
  return (
    <div
      data-no-advance
      className={`absolute inset-x-0 bottom-0 z-20 flex cursor-default items-center justify-between gap-4 px-4 pb-4 transition-opacity duration-700 md:px-6 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
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

      <div className="flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={steps.length - 1} aria-valuenow={index}>
        {steps.slice(1).map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i + 1 === index ? "w-6 bg-primary" : i + 1 < index ? "w-1.5 bg-foreground/50" : "w-1.5 bg-foreground/15"
            }`}
          />
        ))}
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
