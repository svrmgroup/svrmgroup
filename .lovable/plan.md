## Why your logo isn't showing in Google search

The screenshot shows Google's **search result favicon**, which is different from the browser tab favicon. Two issues are likely at play:

1. **Google hasn't re-crawled yet** — Google caches favicons for days/weeks. Even with a correct setup, the new icon only appears after Googlebot reprocesses the site.
2. **Transparent PNG on dark mode** — your current `/favicon.png` is transparent. On Google's dark-mode search UI (visible in your screenshot), a transparent logo with no contrasting backdrop can render as invisible, causing Google to fall back to the default globe.

## Plan

### 1. Add a Google-optimised favicon variant
Generate a second favicon, `public/favicon-google.png`, that is **48×48 with a solid dark circular background** matching the brand (deep charcoal `#0F0F0F` or similar) so the gold/white SVRM emblem stays visible on both light and dark Google backgrounds. Keep the existing transparent `favicon.png` for the browser tab (where transparency looks better against varied tab-bar colours).

### 2. Update `index.html` link order
Google picks the **largest declared icon** that meets its rules. Update the icon links so:
- `favicon.png` (512×512, transparent) → primary for browser tabs / Apple touch
- `favicon-google.png` (48×48, solid bg) → declared as an additional `rel="icon"` with explicit `sizes="48x48"` so Google has a clean, opaque option

```html
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-google.png" />
<link rel="icon" type="image/png" sizes="512x512" href="/favicon.png" />
<link rel="apple-touch-icon" sizes="512x512" href="/favicon.png" />
```

### 3. Update JSON-LD `logo` field
Point the `Organization` schema `logo` to the solid version (`/favicon-google.png`) — Google's Knowledge Panel and search result favicon both consult this schema field.

### 4. Tell you how to trigger re-indexing
After publishing, you'll need to:
- Open **Google Search Console** → URL Inspection → enter `https://svrm.group/` → click **Request Indexing**
- Wait 3–14 days; Google reprocesses favicons on its own schedule, no faster path exists
- Confirm `https://svrm.group/favicon-google.png` loads in a browser and is not blocked by `robots.txt` (it isn't — yours allows everything)

### What I will NOT change
No design, copy, colours, phone, email, domain, services, or layout changes. Only the favicon asset for Google + the `<link>` tags + the JSON-LD `logo` URL.

## Open question
Do you want the Google favicon backdrop to be **deep charcoal/black** (matches site bg, most subtle) or **brushed gold** (most eye-catching in search results)? I'll default to deep charcoal if you don't specify.