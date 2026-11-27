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
- The order-lookup app lives in src/jastip (ported from the barisstd/jastipootb Vite app) and is rendered by the / route; keep its legacy token class names (paper, ink, cloth, marigold...) mapped in src/styles.css.
- Order requests use CloudOrdersApi and a same-origin server function with APPS_SCRIPT_URL/APPS_SCRIPT_CLIENT_TOKEN secrets; never silently fall back to mocks, so publication cannot switch real orders to sample data.
- Initialize browser device IDs only inside order request events, not constructors or module scope, to keep SSR compatible.
- Generate invoice PDFs from order data with jsPDF/AutoTable, loaded after hydration and prepared before download clicks; data-driven pagination avoids screenshot artifacts and preserves mobile download activation.
