## Goal

The main site (svrm.group) still triggers "Add to Home Screen" / install-app prompts on phones and desktop Chrome. Make it fully un-installable there — the installable web app must only be reachable from inside the admin console, and its icon must be the SVRM logo.

## Why it still installs from the public site

The manifest is already runtime-gated to `/admin` (good), but `index.html` still ships iOS/Android "app-capable" signals that make phones offer "Add to Home Screen" on every page:

- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-status-bar-style" ...>`
- `<meta name="apple-mobile-web-app-title" content="SVRM">`
- `<link rel="apple-touch-icon" ...>` at the document root

These tags are what iOS Safari and Android Chrome use to render the site as a standalone app even without a manifest. They need to move to admin-only.

## Changes

1. **`index.html`** — remove all four `apple-mobile-web-app-*` / `mobile-web-app-capable` meta tags and the root-level `apple-touch-icon` link. Keep the favicon links (tab icon) untouched.

2. **`src/main.tsx`** — extend the existing admin-only manifest injector so, when the visitor is on `/admin`, it also injects the four app-capable meta tags and the `apple-touch-icon` link (pointing at `/svrm-icon-180.png`, which is derived from the SVRM logo). Off `/admin`, none of them exist, so neither iOS nor Chrome offers install.

3. **`public/admin-manifest.webmanifest`** — switch the icon entries from `svrm-admin-*.png` to the SVRM-logo icons already generated in the last turn (`/svrm-icon-192.png`, `/svrm-icon-512.png`, `/svrm-icon-180.png`) so the installed admin app shows the SVRM circular logo on the home screen.

4. **Cleanup** — delete the now-unused `public/svrm-admin-180.png`, `public/svrm-admin-192.png`, `public/svrm-admin-512.png` files.

## Caveat to communicate to the user

If the app was previously installed to a phone from the public URL, iOS/Android cache the manifest fields (name, icon, start_url) at install time. Those users need to delete the existing icon from their home screen and re-add it from `/admin` to pick up the new SVRM-logo admin app. New installs after this ship will only work from `/admin`.
