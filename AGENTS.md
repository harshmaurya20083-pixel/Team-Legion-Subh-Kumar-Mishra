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
- PersonalProvider owns preferences, saved IDs, follows and preparation marks; account data uses authenticated Cloud functions with owner-only policies, while signed-out browser state stays separate and legacy browser saves are imported once into the signed-in account.
- Never invent external/invite URLs; cards disable links unless `isValidUrl` passes.
- Preserve public URLs; the shared AppShell owns six desktop destinations and four mobile tabs plus an accessible More sheet, so navigation remains consistent without crowding small screens.
- Use the shared Button and semantic CSS tokens for controls; internship fixtures and requirement-mapped preparation guides live separately in src/data/internships.ts, with existing resource IDs reused and all illustrative listings labelled Sample.
- Event fixtures are separate from legacy information records, use namespaced IDs in the existing saved context, and expose only published/approved records; event filter state lives in URL search parameters so links and reloads preserve selections.
- Explore at /explore is event-specific; legacy resource discovery remains available at /resources and existing /item/$id links remain intact to preserve earlier saved content.
- Event submissions and moderation persist in Lovable Cloud, with private contacts separated from public event payloads; authenticated server functions and database RPCs enforce validation and admin roles, so browser state cannot grant publication rights.
- Published event queries merge preserved sample fixtures with approved shared records across Home, Explore, details and Saved; never seed or overwrite browser saves when connecting Cloud.
- Recommendation rules are pure functions in src/lib/personalization.ts and src/lib/internships.ts with concrete tests; explain each preference or listing match without assessing ability, and community feeds use only explicit community IDs.
- Duplicate RPCs redact unpublished details unless the caller owns the submission or is an admin; unavailable saved IDs stay removable without fetching private listings.
- Communities are admin-managed: `community_records` (status published/archived, admin-only writes via has_role, public read of published rows) merges with sample fixtures through listPublishedCommunities; join URLs are allowlisted to official WhatsApp/Discord/Telegram/Reddit domains in both the zod schema and the validate_community_record trigger.
