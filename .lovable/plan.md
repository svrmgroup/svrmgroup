# Circular SVRM logo for Google search results

Google shows a site icon next to your listing. Right now it's rendering as a square with a border because the favicon/logo you serve is a square image. To make it appear as a clean circle with no square background, the source image needs to be a **transparent PNG** where everything outside the circle is transparent — then Google crops it into its rounded shape and only the disc shows.

## Steps

1. **Prepare the circular logo (preview first, no upload yet).**
   - Take the uploaded `logo_2.jpeg` (the sunset/Table Mountain SVRM circle).
   - Cut out the exact circle, discard everything outside it, save as a transparent PNG at 512×512.
   - Save it to `/mnt/documents/svrm-logo-circle.png` so you can review it in chat before anything ships.
   - Pause here for your approval.

2. **On approval, wire it into the site so Google picks it up.**
   - Replace `public/favicon.ico` and add `public/favicon-32.png`, `public/favicon-192.png`, `public/favicon-512.png` (all transparent circles from the same source).
   - Update `<link rel="icon">` and `<link rel="apple-touch-icon">` in `index.html` to point at the new files.
   - Update the Organization JSON-LD `logo` field in `index.html` to the 512px transparent PNG URL.
   - Update the sitewide `og:image` (only if you already had one — Google sometimes falls back to it).
   - Do NOT touch the admin `/admin` PWA icons — those were locked to the admin console last turn and stay as they are.

3. **Tell Google to refresh.**
   - Google re-crawls on its own schedule (days to weeks). To speed it up, submit the homepage URL via Search Console → URL Inspection → Request indexing after publish.

## Out of scope

- No layout, copy, or navigation changes.
- No changes to the admin console icons.
- No new logo variants (dark mode, monochrome, etc.) unless you ask.

## Technical notes

- Google's site-icon spec: square, ≥ 48×48, same origin as the page, referenced from `<link rel="icon">` or `schema.org` Organization `logo`. Transparent PNG lets Google's own circular crop show only the disc, which is what removes the "square border" look.
- Favicon replacement usually takes 1–4 weeks to appear in search results even after re-indexing.
