## Goal
Give every blog post and every main page stronger, unique SEO metadata so Google (and social platforms) rank and preview them well.

## What changes

### 1. Extend `Seo.tsx` to support Open Graph images
Add optional `image` prop. When passed, it renders:
- `<meta property="og:image">` (absolute URL)
- `<meta name="twitter:image">`
- `<meta name="twitter:card" content="summary_large_image">`

Also add optional `type` prop (`"website"` default, `"article"` for blog posts) and optional `article` metadata (published date, author, section) for blog posts.

### 2. Per-post SEO on the blog
Extend the `Post` type in `src/data/blog.ts` with three optional fields:
- `seoTitle` — <60 chars, keyword-forward (falls back to `${post.title} — SVRM Journal`)
- `seoDescription` — <160 chars, distinct from excerpt when useful (falls back to `excerpt`)
- `ogImage` — absolute URL for social preview (falls back to the post's hero `image` resolved to an absolute `https://svrm.group/...` URL)

Fill these in for every existing post (~12+ entries) with hand-written, keyword-rich titles and descriptions targeting terms like "Cape Town private jet charter", "Garden Route luxury itinerary", "helicopter winelands transfer", etc.

Update `BlogPost.tsx` to pass `seoTitle`, `seoDescription`, `ogImage`, `type="article"`, and JSON-LD `Article` schema (headline, image, datePublished, author = "SVRM") to `<Seo>`.

Update `Blog.tsx` to add JSON-LD `Blog` + `ItemList` schema listing the posts.

### 3. Sharper SEO on every main page
Rewrite `title` + `description` on each page to be tighter (<60 / <160 chars), keyword-led, and add page-appropriate JSON-LD + an `ogImage` where a strong hero exists:

- `/` (Index) — Organization + WebSite schema, hero og:image
- `/travel` — Service schema (Chauffeur, Jets, Helicopters, Yachts)
- `/rentals` — Service schema + ItemList of vehicle categories
- `/stays` — LodgingBusiness schema + ItemList of featured properties
- `/tours` — TouristTrip / ItemList schema for tour categories
- `/tours/:slug` — per-tour TouristTrip schema, unique title/description, hero og:image
- `/security` — Service schema (armoured transport, close protection)
- `/lifestyle` — Service schema (yachting, private chef)
- `/experiences` — Service schema (bespoke)
- `/contact` — ContactPage + LocalBusiness schema, FAQPage schema for the FAQ block

### 4. Sitewide fallback og:image in `index.html`
Add a single absolute-URL `og:image` + `twitter:image` (SVRM hero) in `index.html` as the fallback for crawlers that don't execute JS or hit routes without their own image.

## Technical notes
- All og:image URLs must be absolute `https://svrm.group/...`. For imported assets (Vite hashes filenames), resolve at runtime via `new URL(imgImport, 'https://svrm.group').toString()` — or pin OG images to files placed under `public/og/` so their paths are stable.
- Recommended approach: create `public/og/` and drop 1200×630 versions of the hero images used for OG (blog posts + main pages), then reference them by stable path.
- JSON-LD is emitted via existing `jsonLd` prop on `<Seo>`; already supported.
- No layout/UI changes — metadata only.

## Out of scope
- No new visual design or copy on the visible pages
- No sitemap.xml regeneration (can be a follow-up)
- No SSR migration; per-route tags rely on `react-helmet-async` (already in use), which is fine for Googlebot but limited for non-JS social crawlers — sitewide fallback in `index.html` covers that.

## Question before I build
Do you want me to generate fresh 1200×630 OG images for each page/post (cleaner social previews, ~1 min per image), or reuse the existing hero images resolved to absolute URLs (faster, uses what's already there)?
