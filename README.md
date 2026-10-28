# what-it-shows

The support desk's kb export, with #4471 split into the problems it really holds.

- Tickets: [#1 parser (379)](https://github.com/ossorioapps-ai/what-it-shows/issues/1) · [#2 hint (33)](https://github.com/ossorioapps-ai/what-it-shows/issues/2) · [#3 one-day (5)](https://github.com/ossorioapps-ai/what-it-shows/issues/3) (one-day also counted under parser, as the desk files it) · 412 unique reports
- Page source: [`src/routes/kb/incidents/4471/problems/+page.svx`](src/routes/kb/incidents/4471/problems/+page.svx), table from [`src/lib/kb/problems.ts`](src/lib/kb/problems.ts) and [`ProblemTable.svelte`](src/lib/kb/ProblemTable.svelte)
- The page as the desk sees it: [`rendered/kb/incidents/4471/problems.html`](rendered/kb/incidents/4471/problems.html) (static build of this kb with SvelteKit + mdsvex)

The kb's own README follows.

---

# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.
