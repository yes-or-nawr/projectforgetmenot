import { createFileRoute, Link } from "@tanstack/react-router";
import { artifacts } from "@/content/artifacts";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the project | The Memory Cube" },
      {
        name: "description",
        content:
          "Why we made The Memory Cube for the NASA Space Apps 2026 challenge Abandoned but not Forgotten, and where every fact comes from.",
      },
      { property: "og:title", content: "About The Memory Cube" },
      {
        property: "og:description",
        content: "A storytelling project for NASA Space Apps 2026 about the machines left on the Moon and Mars.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="min-h-screen pb-24 pt-28">
      <article className="mx-auto max-w-2xl px-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">About the project</p>
        <h1 className="mt-3 font-display text-5xl leading-none text-foreground md:text-6xl">
          Why a girl, a garage, and a dusty cube?
        </h1>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-foreground/85">
          <p>
            NASA has left landers, rovers, and instruments across the Moon and Mars. Most kids only hear about
            the missions that are running today. We wanted to tell the story of the ones that went quiet.
          </p>
          <p>
            So we told it the way a kid would find it: by accident, in a dusty garage. The dust connects
            everything. It's what she's cleaning, and it's what slowly covered InSight's solar panels on Mars.
          </p>
          <p>
            The story is a short series of film scenes. In the middle, the girl and her mom open a flipbook
            archive with one page for each machine. Every fact on those pages comes from an official NASA source,
            and every page links back to it.
          </p>
        </div>

        <h2 className="mt-14 font-display text-3xl text-foreground">The challenge</h2>
        <p className="mt-3 text-foreground/85">
          Built for the 2026 NASA Space Apps Challenge,{" "}
          <a
            className="text-primary underline underline-offset-2"
            href="https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/"
            target="_blank"
            rel="noreferrer"
          >
            Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars
          </a>
          . It's made for school-age space fans.
        </p>

        <h2 className="mt-14 font-display text-3xl text-foreground">Sources</h2>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {artifacts.map((a) => (
            <li key={a.id} className="py-3">
              <p className="font-display text-xl text-foreground">
                {a.name}{" "}
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{a.world}</span>
              </p>
              <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {a.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noreferrer" className="text-muted-foreground underline decoration-dotted underline-offset-2 hover:text-primary">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">
          Mission photos are courtesy of NASA and its partners, via the NASA Image and Video Library. This is a
          student hackathon project, not an official NASA website.
        </p>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link to="/" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
            Watch the story
          </Link>
          <Link to="/archive" className="rounded-full border border-foreground/25 px-5 py-2.5 text-sm text-foreground/85 hover:border-foreground/60">
            Open the archive
          </Link>
        </div>
      </article>
    </main>
  );
}
