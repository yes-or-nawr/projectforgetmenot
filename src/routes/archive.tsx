import { createFileRoute } from "@tanstack/react-router";
import { artifacts } from "@/content/artifacts";
import { Flipbook } from "@/components/flipbook/Flipbook";

export const Route = createFileRoute("/archive")({
  head: () => ({
    meta: [
      { title: "The Archive: NASA machines left on the Moon and Mars | The Memory Cube" },
      {
        name: "description",
        content:
          "A flipbook of NASA landers, rovers and instruments still resting on the Moon and Mars, from Surveyor 3 to Ingenuity, drawn from official NASA sources.",
      },
      { property: "og:title", content: "The Archive: abandoned, but not forgotten" },
      {
        property: "og:description",
        content: "Turn the pages of a flipbook about the NASA machines left on the Moon and Mars.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArchivePage,
});

function ArchivePage() {
  const moon = artifacts.filter((a) => a.world === "Moon").length;
  const mars = artifacts.filter((a) => a.world === "Mars").length;
  return (
    <main className="min-h-screen pb-24 pt-28">
      <div className="mx-auto max-w-6xl px-5">
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-hologram">The archive</p>
          <h1 className="mt-3 font-display text-5xl leading-none text-foreground md:text-7xl">
            Abandoned, but not forgotten
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            {artifacts.length} machines that never came home: {moon} on the Moon and {mars} on Mars. Each page was
            put together from official NASA sources.
          </p>
        </header>
        <div className="mt-14">
          <Flipbook items={artifacts} />
        </div>
      </div>
    </main>
  );
}
