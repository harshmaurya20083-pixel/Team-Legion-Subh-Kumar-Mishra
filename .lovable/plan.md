# Add communities from the admin panel

## Goal
Let the admin add real communities (including WhatsApp join links) from /admin, stored in the shared database so every visitor sees them alongside the existing sample communities.

## How it works
- Admin-only: only accounts with the admin role can add, edit, or archive communities. The server checks the role on every action — the button in the browser is never the protection.
- No public submission form: communities come from the admin only (unlike events, which anyone can submit). This keeps invite links trustworthy.
- Sample communities stay untouched; real ones are merged into the same list, exactly like published events already work.

## Changes

1. **Database** — new `community_records` table: name, platform, category, description, tags, audience, location, optional join URL, status (published / archived), timestamps. Anyone can read published rows; only admins can write. Row-level security enforced, same pattern as events.

2. **Server functions** (`src/lib/communities.functions.ts`, new):
   - `listPublishedCommunities` — public; merges sample fixtures with published database records.
   - `saveCommunity` — admin-only; create or update a community (validates name, description length, URL format).
   - `archiveCommunity` — admin-only; hides a community without deleting it.

3. **Admin panel** (`/admin`) — new "Communities" section next to the moderation queues:
   - "Add a community" form: name, platform (WhatsApp/Discord/Telegram/Reddit), topic, description, tags, audience, location, and an optional join link (WhatsApp, Discord, Telegram or Reddit URLs accepted; anything else rejected).
   - List of added communities with Edit and Archive actions.

4. **Communities page** — shows sample + admin-added communities together. Added ones are real, so their join button works immediately (WhatsApp links open the chat directly, per the existing rule).

5. **Tests** — small rule tests for the community validation (URL allowlist, required fields), matching the existing test style.

## What stays the same
- Event submission and moderation, follows, saves, preferences — untouched.
- Sample communities remain labelled "Sample" with links off.
