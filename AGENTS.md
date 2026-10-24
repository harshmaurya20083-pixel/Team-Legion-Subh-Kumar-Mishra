<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Sample data lives in `src/data/*` separate from UI; swap sources there without touching components.
- Search/filter logic is pure functions in `src/lib/filters.ts` (tested), so it can move server-side later.
- Saved state is one React context (`src/lib/saved.tsx`) mirrored to localStorage — keeps pages consistent with no backend in Round 1.
- Never invent external/invite URLs; cards disable links unless `isValidUrl` passes.
