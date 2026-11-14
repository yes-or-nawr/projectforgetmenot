<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Story scenes and dialogue live in `src/content/story.ts`; archive pages live in `src/content/artifacts.ts`. Components render from these files so content can change without touching layout.
- A video scene without a `video` value renders a placeholder, so the story stays watchable while clips are still being made.
- A scene's `video` may be a YouTube link (for clips too big for the repo); it plays as a click-through embed that starts muted and is unmuted by the sound setting.
- The site is a single full-screen player (`StoryPlayer`), not a scrolling website: one step at a time, advanced by Space/Enter/click, with no site header or extra pages. The flipbook exposes next/prev so the same inputs turn its pages.
- Archive facts must cite official NASA sources (nasa.gov hosts) and use NASA image library photos; `src/test/archive-sources.test.ts` enforces this.
