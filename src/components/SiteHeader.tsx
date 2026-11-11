import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Story" },
  { to: "/archive", label: "Archive" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <span aria-hidden className="flex h-6 w-6 items-center justify-center rounded-[3px] border border-foreground/30 bg-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-hologram shadow-[var(--shadow-holo)]" />
          </span>
          <span className="whitespace-nowrap font-display text-lg leading-none text-foreground sm:text-xl">The Memory Cube</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              className="rounded-full px-2 py-1.5 font-mono text-[10px] sm:px-3 sm:text-[11px] uppercase tracking-widest text-muted-foreground transition hover:text-foreground data-[status=active]:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
