import type { ReactNode } from "react";
import type { Artifact } from "@/content/artifacts";

export type PageSide = "left" | "right";

function PageShell({
  side,
  number,
  children,
}: {
  side: PageSide;
  number?: number;
  children: ReactNode;
}) {
  return (
    <div
      className={`paper ${side === "left" ? "paper-left" : "paper-right"} relative flex h-full w-full flex-col overflow-hidden`}
    >
      <div className="flex-1 overflow-y-auto px-6 pb-4 pt-6 md:px-8 md:pt-8">{children}</div>
      {number !== undefined && (
        <div
          className={`px-6 pb-4 font-mono text-[10px] tracking-widest text-ink-muted md:px-8 ${
            side === "left" ? "text-left" : "text-right"
          }`}
        >
          {number}
        </div>
      )}
    </div>
  );
}

export function CoverLeft({ items, onJump }: { items: Artifact[]; onJump?: (i: number) => void }) {
  return (
    <PageShell side="left">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">Contents</p>
      <h3 className="mt-2 font-display text-3xl leading-none text-ink">Machines we left behind</h3>
      <ol className="mt-5 space-y-1.5">
        {items.map((a, i) => (
          <li key={a.id}>
            <button
              type="button"
              onClick={() => onJump?.(i + 1)}
              className="group flex w-full items-baseline gap-2 text-left text-sm text-ink hover:text-rust focus-visible:text-rust focus-visible:outline-none"
            >
              <span className="font-display text-lg">{a.name}</span>
              <span className="mb-1 flex-1 border-b border-dotted border-ink-muted/50" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                {a.world} · {a.arrived.slice(-4)}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}

export function CoverRight() {
  return (
    <PageShell side="right">
      <div className="flex h-full flex-col justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">
          NASA archive · curated edition
        </p>
        <div>
          <h3 className="font-display text-5xl leading-[0.95] text-ink md:text-6xl">
            Abandoned,
            <br />
            <em className="text-rust">but not</em>
            <br />
            forgotten
          </h3>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-muted">
            Every page is one machine still resting on the Moon or Mars. Each one was built by people who
            hoped it would do great things, and it did.
          </p>
        </div>
        <p className="text-sm text-ink-muted">Turn the page →</p>
      </div>
    </PageShell>
  );
}

export function ArtifactPlate({ a, number }: { a: Artifact; number: number }) {
  return (
    <PageShell side="left" number={number}>
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">
        <span>{a.kind}</span>
        <span className={a.world === "Mars" ? "text-rust" : "text-ink"}>{a.world}</span>
      </div>
      <h3 className="mt-1 font-display text-4xl leading-none text-ink">{a.name}</h3>
      <figure className="mt-4">
        <div className="overflow-hidden rounded-sm border border-paper-edge bg-ink/10 p-1.5 shadow-sm">
          <img
            src={a.image.src}
            alt={a.image.alt}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
        <figcaption className="mt-1 font-mono text-[9px] uppercase tracking-wider text-ink-muted">
          {a.image.credit} · {a.image.nasaId}
        </figcaption>
      </figure>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <Fact label="Resting at" value={a.resting} wide />
        <Fact label="Arrived" value={a.arrived} />
        <Fact label="Last heard" value={a.lastHeard} />
        <Fact label="Built to last" value={a.plannedLife} />
        <Fact label="Actually lasted" value={a.actualLife} highlight />
      </dl>
    </PageShell>
  );
}

function Fact({ label, value, wide, highlight }: { label: string; value: string; wide?: boolean; highlight?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">{label}</dt>
      <dd className={`leading-snug ${highlight ? "font-semibold text-rust" : "text-ink"}`}>{value}</dd>
    </div>
  );
}

export function ArtifactStory({ a, number }: { a: Artifact; number: number }) {
  return (
    <PageShell side="right" number={number}>
      <p className="font-display text-2xl italic leading-tight text-ink md:text-[1.7rem]">{a.hook}</p>
      <div className="mt-4 space-y-3 text-[13px] leading-relaxed text-ink">
        <Section title="Why it was sent">{a.builtTo}</Section>
        <Section title="What it found">{a.discovered}</Section>
        <Section title="How its story ended">{a.ending}</Section>
        <Section title="The people behind it">{a.engineers}</Section>
      </div>
      <aside className="mt-4 -rotate-1 rounded-sm border border-primary/40 bg-primary/25 px-3 py-2 text-[13px] leading-snug text-ink shadow-sm">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">Did you know? </span>
        {a.didYouKnow}
      </aside>
      <div className="mt-4 border-t border-paper-edge pt-2">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">Sources</p>
        <ul className="mt-1 space-y-0.5 text-[11px]">
          {a.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer" className="text-ink-muted underline decoration-dotted underline-offset-2 hover:text-rust">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] text-rust">{title}</h4>
      <p>{children}</p>
    </section>
  );
}

export function EndLeft() {
  return (
    <PageShell side="left">
      <div className="flex h-full flex-col justify-center">
        <p className="font-display text-3xl leading-tight text-ink">
          Behind every machine on these pages are thousands of people who designed, built, tested, and
          drove it.
        </p>
      </div>
    </PageShell>
  );
}

export function EndRight() {
  return (
    <PageShell side="right">
      <div className="flex h-full flex-col justify-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">About this archive</p>
        <p className="mt-3 text-sm leading-relaxed text-ink">
          Facts and photos come from official NASA sources: science.nasa.gov, nasa.gov, and the NASA Image and
          Video Library. Each page links to where its facts came from.
        </p>
      </div>
    </PageShell>
  );
}
