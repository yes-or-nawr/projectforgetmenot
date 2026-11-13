import { useEffect, useRef, type ReactNode } from "react";
import type { VideoScene } from "@/content/story";
import { artifacts } from "@/content/artifacts";
import { HologramFrame } from "./HologramFrame";

const insight = artifacts.find((a) => a.id === "insight")!;

/** Wide screens fill edge to edge; tall screens show the whole frame. */
const fit = "h-full w-full object-cover [@media(max-aspect-ratio:4/3)]:object-contain";

/** A scene covering the whole screen. Nothing is written over it. */
export function SceneVideo({ scene, soundOn }: { scene: VideoScene; soundOn: boolean }) {
  const media = scene.video ? <ScenePlayer scene={scene} soundOn={soundOn} /> : <ScenePlaceholder scene={scene} />;
  return <div className="absolute inset-0 bg-background">{scene.hologram ? <HoloStage>{media}</HoloStage> : media}</div>;
}

/** The scene's final frame, frozen, so a letter can appear over it. */
export function LastFrame({ scene }: { scene: VideoScene }) {
  const media = scene.video ? <FrozenEnd scene={scene} /> : <ScenePlaceholder scene={scene} />;
  return (
    <div aria-hidden className="absolute inset-0 bg-background">
      {scene.hologram ? <HoloStage>{media}</HoloStage> : media}
    </div>
  );
}

function HoloStage({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center px-4 pb-20 pt-10 md:px-10">
      <div className="w-full" style={{ width: "min(94vw, calc((100dvh - 14rem) * 16 / 9))" }}>
        <HologramFrame>{children}</HologramFrame>
      </div>
    </div>
  );
}

function FrozenEnd({ scene }: { scene: VideoScene }) {
  return (
    <video
      src={scene.video}
      poster={scene.poster}
      muted
      playsInline
      preload="auto"
      className={fit}
      onLoadedMetadata={(e) => {
        const v = e.currentTarget;
        if (Number.isFinite(v.duration)) v.currentTime = Math.max(0, v.duration - 0.05);
      }}
    />
  );
}

function ScenePlayer({ scene, soundOn }: { scene: VideoScene; soundOn: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

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
    <video
      ref={videoRef}
      src={scene.video}
      poster={scene.poster}
      playsInline
      preload="auto"
      className={fit}
      aria-label={scene.description}
    />
  );
}

/** Shown until a clip is added. No words on screen. */
function ScenePlaceholder({ scene }: { scene: VideoScene }) {
  if (scene.hologram) {
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-background" role="img" aria-label={scene.description}>
        <img src={insight.image.src} alt="" className="h-full w-full object-cover saturate-50" />
        <div aria-hidden className="insight-dust absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <dl className="absolute inset-x-4 bottom-4 grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-widest text-hologram-foreground md:inset-x-8 md:bottom-6 md:grid-cols-4 md:text-xs">
          <Readout label="Landed" value="2018-11-26" />
          <Readout label="Marsquakes" value="1,319" />
          <Readout label="Power" value="Falling" />
          <Readout label="Last contact" value="2022-12-15" />
        </dl>
      </div>
    );
  }
  return (
    <div className="relative h-full w-full bg-background" role="img" aria-label={scene.description}>
      {scene.poster && <img src={scene.poster} alt="" className={fit} />}
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
