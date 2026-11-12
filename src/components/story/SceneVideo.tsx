import { useEffect, useRef, useState } from "react";
import { RotateCcw, Film } from "lucide-react";
import type { VideoScene } from "@/content/story";
import { artifacts } from "@/content/artifacts";
import { HologramFrame } from "./HologramFrame";

const insight = artifacts.find((a) => a.id === "insight")!;

/**
 * A full-screen scene: the clip (or its placeholder) covers the whole
 * viewport, with only a small scene label in the corner. No captions.
 */
export function SceneVideo({ scene, soundOn }: { scene: VideoScene; soundOn: boolean }) {
  const media = scene.video ? (
    <ScenePlayer scene={scene} soundOn={soundOn} />
  ) : (
    <ScenePlaceholder scene={scene} />
  );

  return (
    <div className="absolute inset-0">
      {scene.hologram ? (
        <div className="flex h-full w-full items-center justify-center px-4 pb-20 pt-10 md:px-10">
          <div className="w-full" style={{ width: "min(94vw, calc((100dvh - 14rem) * 16 / 9))" }}>
            <HologramFrame>{media}</HologramFrame>
          </div>
        </div>
      ) : (
        media
      )}
      <p className="pointer-events-none absolute left-4 top-4 z-10 flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/70 md:left-8 md:top-6 md:text-xs">
        <span className={scene.hologram ? "text-hologram" : "text-primary"}>
          Scene {String(scene.number).padStart(2, "0")}
        </span>
        <span>{scene.title}</span>
      </p>
    </div>
  );
}

/**
 * The final frame of a scene, frozen, so a text card can appear over it.
 * Uses the same framing as the playing scene so the cut is seamless.
 */
export function LastFrame({ scene }: { scene: VideoScene }) {
  const media = scene.video ? <FrozenEnd scene={scene} /> : <ScenePlaceholder scene={scene} still />;
  return (
    <div aria-hidden className="absolute inset-0">
      {scene.hologram ? (
        <div className="flex h-full w-full items-center justify-center px-4 pb-20 pt-10 md:px-10">
          <div className="w-full" style={{ width: "min(94vw, calc((100dvh - 14rem) * 16 / 9))" }}>
            <HologramFrame>{media}</HologramFrame>
          </div>
        </div>
      ) : (
        media
      )}
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
      className="h-full w-full bg-background object-cover"
      onLoadedMetadata={(e) => {
        const v = e.currentTarget;
        if (Number.isFinite(v.duration)) v.currentTime = Math.max(0, v.duration - 0.05);
      }}
    />
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
    <div className="relative h-full w-full bg-background">
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
          className="absolute bottom-16 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 bg-background/70 text-foreground backdrop-blur transition hover:border-primary md:bottom-6 md:right-8"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function ScenePlaceholder({ scene, still }: { scene: VideoScene; still?: boolean }) {
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
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-[radial-gradient(ellipse_at_center,var(--color-secondary),var(--color-background))] px-6 text-center">
      {scene.poster && (
        <>
          <img src={scene.poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-background/20" />
        </>
      )}
      {!still && (
        <>
          <Film className="relative h-7 w-7 text-primary/80" aria-hidden />
          <p className="relative max-w-xl font-display text-xl italic leading-snug text-foreground md:text-3xl">
            {scene.direction}
          </p>
          <p className="relative font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:text-xs">
            Clip coming soon
          </p>
        </>
      )}
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
