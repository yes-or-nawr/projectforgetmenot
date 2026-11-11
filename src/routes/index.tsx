import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowDown, Volume2, VolumeX } from "lucide-react";
import heroImage from "@/assets/garage-cube.jpg";
import { story, endingNotes, type Scene } from "@/content/story";
import { artifacts } from "@/content/artifacts";
import { StoryContext } from "@/components/story/story-context";
import { SceneVideo } from "@/components/story/SceneVideo";
import { Reveal } from "@/components/story/Reveal";
import { DustMotes } from "@/components/story/DustMotes";
import { Flipbook } from "@/components/flipbook/Flipbook";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Memory Cube: a story of NASA machines left on Mars and the Moon" },
      {
        name: "description",
        content:
          "A girl finds a glowing cube in the garage and learns the story of InSight and the other NASA explorers left behind on the Moon and Mars.",
      },
      { property: "og:title", content: "The Memory Cube" },
      {
        property: "og:description",
        content:
          "A short film-style story about NASA's abandoned rovers and landers, and the people who built them. NASA Space Apps 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StoryPage,
});

function StoryPage() {
  const [started, setStarted] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  const begin = (withSound: boolean) => {
    setSoundOn(withSound);
    setStarted(true);
    document.getElementById(story[0]?.id ?? "")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const goNext = (i: number) => {
    const nextId = story[i + 1]?.id ?? "ending";
    document.getElementById(nextId)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <StoryContext.Provider value={{ started, soundOn }}>
      <main>
        <Intro onBegin={begin} />
        {story.map((scene, i) => (
          <SceneSection key={scene.id} scene={scene} onEnded={() => goNext(i)} />
        ))}
        <Ending />
        <Credits />
      </main>
      <ProgressRail />
      {started && (
        <button
          type="button"
          onClick={() => setSoundOn((s) => !s)}
          aria-label={soundOn ? "Mute story" : "Turn sound on"}
          className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-foreground backdrop-blur transition hover:border-primary"
        >
          {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          {soundOn ? "Sound on" : "Muted"}
        </button>
      )}
    </StoryContext.Provider>
  );
}

function Intro({ onBegin }: { onBegin: (withSound: boolean) => void }) {
  return (
    <section className="relative flex min-h-screen items-end overflow-hidden pb-20 pt-24 md:items-center md:pb-0">
      <img
        src={heroImage}
        alt="A dusty garage workbench in morning light, with a small metal cube and a glowing blue button"
        width={1600}
        height={912}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      <DustMotes />
      <div className="relative mx-auto w-full max-w-6xl px-5">
        <div className="max-w-xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
            NASA Space Apps Challenge 2026
          </p>
          <h1 className="mt-4 font-display text-6xl leading-[0.92] text-foreground md:text-8xl">
            The Memory
            <br />
            <em className="text-primary">Cube</em>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-foreground/80">
            A story about the machines we left on the Moon and Mars, and the people who built them.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onBegin(true)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Volume2 className="h-4 w-4" />
              Begin the story
            </button>
            <button
              type="button"
              onClick={() => onBegin(false)}
              className="rounded-full border border-foreground/25 px-5 py-3 text-sm text-foreground/85 transition hover:border-foreground/60"
            >
              Watch without sound
            </button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Best with headphones · about 5 minutes</p>
        </div>
      </div>
      <ArrowDown aria-hidden className="absolute bottom-6 left-1/2 h-5 w-5 -translate-x-1/2 animate-bounce text-muted-foreground" />
    </section>
  );
}

function SceneSection({ scene, onEnded }: { scene: Scene; onEnded: () => void }) {
  if (scene.kind === "text") {
    return (
      <section id={scene.id} className="relative flex min-h-screen items-center overflow-hidden py-24">
        <div aria-hidden className="absolute inset-0 bg-[image:var(--gradient-dust)]" />
        <DustMotes className="opacity-60" />
        <div className="relative mx-auto max-w-3xl px-5">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">{scene.eyebrow}</p>
          </Reveal>
          <div className="mt-8 space-y-8">
            {scene.paragraphs.map((p, i) => (
              <Reveal key={i} delay={200 + i * 350}>
                <p
                  className={`font-display leading-tight text-foreground ${
                    i === scene.paragraphs.length - 1 ? "text-4xl italic text-primary md:text-6xl" : "text-3xl md:text-5xl"
                  }`}
                >
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (scene.kind === "flipbook") {
    return (
      <section id={scene.id} className="relative py-28">
        <div aria-hidden className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-hologram/10 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-hologram">{scene.eyebrow}</p>
            <h2 className="mt-3 font-display text-5xl leading-none text-foreground md:text-7xl">{scene.title}</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{scene.intro}</p>
          </Reveal>
          <Reveal className="mt-14" delay={200}>
            <Flipbook items={artifacts} />
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id={scene.id} className="flex min-h-screen items-center py-24">
      <Reveal className={`mx-auto w-full px-5 ${scene.hologram ? "max-w-4xl" : "max-w-5xl"}`}>
        <SceneVideo scene={scene} onEnded={onEnded} />
      </Reveal>
    </section>
  );
}

function Ending() {
  return (
    <section id="ending" className="relative flex min-h-[80vh] items-center py-24">
      <div aria-hidden className="absolute inset-0 bg-[image:var(--gradient-dust)]" />
      <div className="relative mx-auto max-w-2xl px-5">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">The end</p>
          <h2 className="mt-3 font-display text-5xl leading-none text-foreground md:text-6xl">{endingNotes.title}</h2>
        </Reveal>
        <div className="mt-8 space-y-5">
          {endingNotes.paragraphs.map((p, i) => (
            <Reveal key={i} delay={150 + i * 150}>
              <p className="text-lg leading-relaxed text-foreground/85">{p}</p>
            </Reveal>
          ))}
          <Reveal delay={400}>
            <p className="font-display text-2xl italic text-primary">{endingNotes.signature}</p>
          </Reveal>
        </div>
        <Reveal delay={500} className="mt-12 flex flex-wrap gap-3">
          <Link
            to="/archive"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110"
          >
            Open the full archive
          </Link>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-full border border-foreground/25 px-5 py-2.5 text-sm text-foreground/85 transition hover:border-foreground/60"
          >
            Watch again
          </button>
        </Reveal>
      </div>
    </section>
  );
}

function Credits() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 text-xs text-muted-foreground md:flex-row md:justify-between">
        <p>
          Made for the 2026 NASA Space Apps Challenge:{" "}
          <a
            className="underline underline-offset-2 hover:text-foreground"
            href="https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/"
            target="_blank"
            rel="noreferrer"
          >
            Abandoned but not Forgotten
          </a>
          .
        </p>
        <p>Mission photos: NASA Image and Video Library. Not an official NASA website.</p>
      </div>
    </footer>
  );
}

const railItems = story.map((s) => ({
  id: s.id,
  label: s.kind === "video" ? `${s.number}. ${s.title}` : s.kind === "text" ? s.eyebrow : s.title,
}));

function ProgressRail() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const item of railItems) {
      const el = document.getElementById(item.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Story scenes"
      className={`fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 transition-opacity lg:flex ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      {railItems.map((item) => (
        <a key={item.id} href={`#${item.id}`} className="group flex items-center justify-end gap-3" aria-label={item.label}>
          <span className="pointer-events-none font-mono text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 transition group-hover:opacity-100">
            {item.label}
          </span>
          <span
            className={`block rounded-full transition-all ${
              active === item.id ? "h-2.5 w-2.5 bg-primary" : "h-1.5 w-1.5 bg-foreground/30 group-hover:bg-foreground/70"
            }`}
          />
        </a>
      ))}
    </nav>
  );
}
