import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Film } from "lucide-react";
import type { VideoScene } from "@/content/story";
import { artifacts } from "@/content/artifacts";
import { useStory } from "./story-context";
import { HologramFrame } from "./HologramFrame";

const insight = artifacts.find((a) => a.id === "insight")!;

export function SceneVideo({ scene, onEnded }: { scene: VideoScene; onEnded?: () => void }) {
  const media = scene.video ? (
    <ScenePlayer scene={scene} onEnded={onEnded} />
  ) : (
    <ScenePlaceholder scene={scene} />
  );

  return (
    <figure className="w-full">
      <figcaption className="mb-3 flex items-baseline gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <span className={scene.hologram ? "text-hologram" : "text-primary"}>
          Scene {String(scene.number).padStart(2, "0")}
        </span>
        <span className="h-px flex-1 bg-border" />
        <span>{scene.title}</span>
      </figcaption>
      {scene.hologram ? (
        <HologramFrame>{media}</HologramFrame>
      ) : (
        <div className="overflow-hidden rounded-md border border-border bg-card shadow-2xl">{media}</div>
      )}
      {scene.lines.length > 0 && <Subtitles scene={scene} />}
    </figure>
  );
}

function ScenePlayer({ scene, onEnded }: { scene: VideoScene; onEnded?: (() => void) | undefined }) {
  const { started, soundOn } = useStory();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);

  // Play while most of the clip is on screen, pause when scrolled away.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.intersectionRatio >= 0.6) {
          if (started && !v.ended) {
            v.play().catch(() => {
              v.muted = true;
              v.play().catch(() => {});
            });
          }
        } else {
          v.pause();
        }
      },
      { threshold: [0, 0.6] },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = !soundOn;
  }, [soundOn]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.ended) {
      v.currentTime = 0;
      void v.play();
    } else if (v.paused) {
      void v.play();
    } else {
      v.pause();
    }
  };

  return (
    <div className="group relative aspect-video w-full bg-background">
      <video
        ref={videoRef}
        src={scene.video}
        poster={scene.poster}
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
        onClick={toggle}
        onPlay={() => {
          setPlaying(true);
          setEnded(false);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setEnded(true);
          onEnded?.();
        }}
        aria-label={`Scene ${scene.number}: ${scene.title}. ${scene.direction}`}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={ended ? "Replay scene" : playing ? "Pause scene" : "Play scene"}
        className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 bg-background/70 text-foreground opacity-80 backdrop-blur transition hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-ring"
      >
        {ended ? <RotateCcw className="h-4 w-4" /> : playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
    </div>
  );
}

function ScenePlaceholder({ scene }: { scene: VideoScene }) {
  if (scene.hologram) {
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-background">
        <img
          src={insight.image.src}
          alt={insight.image.alt}
          loading="lazy"
          className="h-full w-full object-cover saturate-50"
        />
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
    <div className="relative flex aspect-video w-full flex-col items-center justify-center gap-4 bg-[radial-gradient(ellipse_at_center,var(--color-secondary),var(--color-background))] px-6 text-center">
      <Film className="h-8 w-8 text-primary/70" aria-hidden />
      <p className="max-w-xl font-display text-xl italic leading-snug text-foreground/90 md:text-3xl">
        {scene.direction}
      </p>
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:text-xs">
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

function Subtitles({ scene }: { scene: VideoScene }) {
  return (
    <div className="mx-auto mt-8 max-w-3xl space-y-4">
      {scene.lines.map((line, i) => (
        <p key={i} className="flex flex-col gap-1 md:flex-row md:gap-5">
          <span
            className={`shrink-0 pt-2 font-mono text-[10px] uppercase tracking-[0.25em] md:w-20 md:text-right ${
              line.speaker === "InSight" ? "text-hologram" : line.speaker === "Narrator" ? "text-muted-foreground" : "text-primary"
            }`}
          >
            {line.speaker}
          </span>
          <span
            className={`font-display text-2xl leading-snug md:text-3xl ${
              line.speaker === "Narrator" ? "text-foreground/80" : "text-foreground"
            } ${line.speaker === "InSight" ? "italic text-hologram-foreground" : ""}`}
          >
            {line.speaker === "Narrator" ? line.text : `“${line.text}”`}
          </span>
        </p>
      ))}
    </div>
  );
}
