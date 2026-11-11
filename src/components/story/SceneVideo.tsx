import { useEffect, useRef, useState, type CSSProperties } from "react";
import { RotateCcw, Film } from "lucide-react";
import type { VideoScene } from "@/content/story";
import { artifacts } from "@/content/artifacts";
import { HologramFrame } from "./HologramFrame";

const insight = artifacts.find((a) => a.id === "insight")!;

/** Width that keeps a 16:9 frame plus its captions inside the viewport. */
function frameWidth(scene: VideoScene): CSSProperties {
  const reserve = 11 + (scene.hologram ? 8 : 0) + scene.lines.length * 3.6;
  return { width: `min(92vw, calc((100dvh - ${reserve}rem) * 16 / 9))` };
}

export function SceneVideo({ scene, soundOn }: { scene: VideoScene; soundOn: boolean }) {
  const media = scene.video ? (
    <ScenePlayer scene={scene} soundOn={soundOn} />
  ) : (
    <ScenePlaceholder scene={scene} />
  );

  return (
    <figure className="mx-auto" style={frameWidth(scene)}>
      <figcaption className="mb-3 flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:text-xs">
        <span className={scene.hologram ? "text-hologram" : "text-primary"}>
          Scene {String(scene.number).padStart(2, "0")}
        </span>
        <span className="h-px flex-1 bg-border" />
        <span>{scene.title}</span>
      </figcaption>
      {scene.hologram ? (
        <HologramFrame>{media}</HologramFrame>
      ) : (
        <div className="overflow-hidden rounded-md bg-card shadow-[var(--shadow-frame)]">{media}</div>
      )}
      {scene.lines.length > 0 && <Captions scene={scene} />}
    </figure>
  );
}

function ScenePlayer({ scene, soundOn }: { scene: VideoScene; soundOn: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ended, setEnded] = useState(false);

  // The scene mounts when it becomes the current step, so start playing right away.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !soundOn;
    v.currentTime = 0;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
    // soundOn is handled by the effect below; only restart on a new clip.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.video]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = !soundOn;
  }, [soundOn]);

  return (
    <div className="relative aspect-video w-full bg-background">
      <video
        ref={videoRef}
        src={scene.video}
        poster={scene.poster}
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
        onPlay={() => setEnded(false)}
        onEnded={() => setEnded(true)}
        aria-label={`Scene ${scene.number}: ${scene.title}. ${scene.direction}`}
      />
      {ended && (
        <button
          type="button"
          data-no-advance
          onClick={(e) => {
            e.currentTarget.blur();
            const v = videoRef.current;
            if (v) {
              v.currentTime = 0;
              void v.play();
            }
          }}
          aria-label="Replay scene"
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 bg-background/70 text-foreground backdrop-blur transition hover:border-primary"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function ScenePlaceholder({ scene }: { scene: VideoScene }) {
  if (scene.hologram) {
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-background">
        <img src={insight.image.src} alt={insight.image.alt} className="h-full w-full object-cover saturate-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <dl className="absolute inset-x-4 bottom-4 grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-widest text-hologram-foreground md:inset-x-8 md:bottom-6 md:grid-cols-4 md:text-xs">
          <Readout label="Landed" value="2018-11-26" />
          <Readout label="Marsquakes" value="1,319" />
          <Readout label="Power" value="Falling" />
          <Readout label="Last contact" value="2022-12-15" />
        </dl>
        <p className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-widest text-hologram md:left-8 md:top-6 md:text-xs">
          Clip coming soon
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex aspect-video w-full flex-col items-center justify-center gap-4 overflow-hidden bg-[radial-gradient(ellipse_at_center,var(--color-secondary),var(--color-background))] px-6 text-center">
      {scene.poster && (
        <>
          <img src={scene.poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-background/20" />
        </>
      )}
      <Film className="relative h-7 w-7 text-primary/80" aria-hidden />
      <p className="relative max-w-xl font-display text-xl italic leading-snug text-foreground md:text-3xl">
        {scene.direction}
      </p>
      <p className="relative font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:text-xs">
        Clip coming soon
      </p>
    </div>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-hologram/70">{label}</dt>
      <dd className="text-sm md:text-base">{value}</dd>
    </div>
  );
}

function Captions({ scene }: { scene: VideoScene }) {
  return (
    <div className="mx-auto mt-5 max-w-3xl space-y-2">
      {scene.lines.map((line, i) => (
        <p
          key={i}
          className="rise flex flex-col gap-0.5 md:flex-row md:items-baseline md:gap-4"
          style={{ animationDelay: `${400 + i * 500}ms` }}
        >
          <span
            className={`shrink-0 font-mono text-[10px] uppercase tracking-[0.25em] md:w-20 md:text-right ${
              line.speaker === "InSight" ? "text-hologram" : line.speaker === "Narrator" ? "text-muted-foreground" : "text-primary"
            }`}
          >
            {line.speaker}
          </span>
          <span
            className={`font-display text-lg leading-snug md:text-xl xl:text-2xl ${
              line.speaker === "InSight" ? "italic text-hologram-foreground" : line.speaker === "Narrator" ? "text-foreground/80" : "text-foreground"
            }`}
          >
            {line.speaker === "Narrator" ? line.text : `“${line.text}”`}
          </span>
        </p>
      ))}
    </div>
  );
}
