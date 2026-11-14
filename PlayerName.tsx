import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Holds the name the viewer types on the title screen so any scene
 * (letters, for now) can use it.
 *
 * In story.ts, write {name} anywhere inside a letter's text and it is replaced
 * with the viewer's name, e.g. salutation: "Dear {name},".
 */

type PlayerNameValue = { name: string; setName: (name: string) => void };

const PlayerNameContext = createContext<PlayerNameValue>({ name: "", setName: () => {} });

export function PlayerNameProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState("");
  const value = useMemo(() => ({ name, setName }), [name]);
  return <PlayerNameContext.Provider value={value}>{children}</PlayerNameContext.Provider>;
}

export function usePlayerName() {
  return useContext(PlayerNameContext);
}

/** Replaces every {name} in `text`. Falls back to a friendly word if no name was given. */
export function personalize(text: string, name: string) {
  return text.replace(/\{name\}/gi, name || "friend");
}

/**
 * The name box on the title screen. Pressing Enter or the button saves the name
 * and calls `onSubmit` so the story can begin.
 * `data-no-advance` stops clicks inside it from advancing the story.
 */
export function NameForm({ onSubmit }: { onSubmit: () => void }) {
  const { name, setName } = usePlayerName();
  const [draft, setDraft] = useState(name);
  const [showHint, setShowHint] = useState(false);

  return (
    <form
      data-no-advance
      className="rise mt-10 flex w-full max-w-sm cursor-default flex-col items-center gap-3"
      style={{ animationDelay: "900ms" }}
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = draft.trim();
        if (!trimmed) {
          setShowHint(true);
          return;
        }
        setName(trimmed);
        onSubmit();
      }}
    >
      <label
        htmlFor="player-name"
        className="font-mono text-[11px] uppercase tracking-[0.3em] text-foreground"
      >
        What is your name?
      </label>
      <input
        id="player-name"
        type="text"
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          setShowHint(false);
        }}
        maxLength={24}
        autoFocus
        autoComplete="given-name"
        spellCheck={false}
        placeholder="Type your name"
        className="w-full rounded-full border border-border bg-background/50 px-5 py-3 text-center text-base text-foreground placeholder:text-muted-foreground/70 backdrop-blur focus:border-primary focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-full border border-primary px-6 py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-primary transition hover:bg-primary hover:text-primary-foreground"
      >
        Begin
      </button>
      <p
        role="status"
        className={`h-4 text-xs text-muted-foreground transition-opacity ${showHint ? "opacity-100" : "opacity-0"}`}
      >
        Please enter your name to begin.
      </p>
    </form>
  );
}
