## Goal
When installing the web app from an `/admin` page, the installed app should launch into `/admin` (not the public homepage).

## Root cause
`src/main.tsx` currently injects a single site-wide manifest (`/manifest.webmanifest`) whose `start_url` and `scope` are `/`. So no matter where you install from, the installed app opens `/`.

## Changes

1. **Create `public/admin-manifest.webmanifest`** — an admin-specific manifest:
   - `name`: "SVRM Admin"
   - `short_name`: "SVRM Admin"
   - `id`: `/admin`
   - `start_url`: `/admin`
   - `scope`: `/admin`
   - `display`: `standalone`
   - Same theme/background colors and icons as the public manifest.

2. **Update `src/main.tsx` manifest injection** — pick which manifest to link based on the current path:
   - If `location.pathname` starts with `/admin` → inject `/admin-manifest.webmanifest`.
   - Otherwise → inject the existing `/manifest.webmanifest`.
   - Keep the guard so we don't double-inject.

3. **No changes to `index.html`** (the comment there already says the manifest is injected at runtime).

## Notes for the user
- iOS/Android cache manifest fields (`start_url`, `scope`, `id`) at install time. If you've already installed the app from the public site, you'll need to **uninstall it and reinstall from `/admin`** for it to launch into the admin dashboard. Future installs from `/admin` will correctly open the admin app.
- Installing from a public page will still launch the public site — behavior unchanged there.

## Out of scope
- No service worker, no offline caching (project is manifest-only today; keeping it that way).
- No auth/route changes.