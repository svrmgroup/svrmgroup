## 1. Homepage tab title & meta (keep BMW X3 offer visible on the page)

In `src/pages/Index.tsx` `<Seo>`:
- **title** → `SVRM Group | Luxury Concierge & Chauffeur — Cape Town`
- **description** → rewrite lead so it opens with brand positioning ("SVRM is Cape Town's private lifestyle management group — luxury chauffeur, private tours, villas, car rental, armed security and bespoke concierge.") — drop the "BMW X3 R2,000/day" lead from the meta.
- Keep the `<Offers>` section on the page (BMW X3 promo stays visible on the homepage itself).
- Keep the BMW X3 `Offer` in JSON-LD (it's structured data, doesn't affect the tab title).

Also mirror the new title in `index.html`:
- `<meta property="og:title">` and `<meta name="twitter:title">` → same new brand-first title.

## 2. Circular favicon from the uploaded SVRM logo

- Save uploaded `user-uploads://logo-3.png` into `public/svrm-logo-source.png` (temp working file).
- Use Python/PIL to generate a **circular-masked** favicon in three sizes:
  - `public/favicon-32.png` (32×32) — small size Chrome uses in tabs
  - `public/favicon-192.png` (192×192)
  - `public/favicon.ico` (multi-size 16/32/48) — legacy `/favicon.ico` fallback browsers auto-request
- Delete the temp `svrm-logo-source.png` afterwards.
- Rewrite the icon `<link>` block in `index.html` so a small size comes first:
  ```html
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/svrm-icon-180.png" />
  ```
  Remove the two oversized (1024/1254px) `favicon.png` / `favicon-google.png` references from the icon links (the files themselves stay because JSON-LD `logo` still points at `favicon-google.png`).

## 3. Also swap the in-app logo to the uploaded SVRM logo

`src/components/svrm/Logo.tsx` currently reads `@/assets/svrm-logo.png.asset.json`. Replace that asset with the new upload via the `lovable-assets` CLI so every place that already uses `<Logo />` (Nav, mobile sheet, footer, admin) updates in one step. No component code changes needed.

## 4. Fully kill "Open in app" on the public site

Even though `src/main.tsx` only injects the manifest on `/admin`, `public/manifest.webmanifest` still exists at `/manifest.webmanifest` and older visits may have cached install eligibility.

- **Delete `public/manifest.webmanifest`** — the only manifest that ships is now `public/admin-manifest.webmanifest` (admin-only).
- Leave `main.tsx` admin-injection logic as-is.
- Note for user: if Chrome already offers "Open in app" from a previous visit, they'll need to (a) hard-refresh or (b) uninstall the previously-installed PWA — Chrome caches install prompts locally.

## Notes to relay
- Browsers cache favicons hard — a hard refresh or private window may be needed to see the new circle icon.
- The BMW X3 special offer stays fully visible on the homepage (Offers section + JSON-LD); only the browser tab text changes to be brand-first.

## Out of scope
No routing, RLS, admin PWA, or JSON-LD offer changes.
