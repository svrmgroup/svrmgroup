# Project rules
- Vehicle galleries are optional vehicle data and use the shared carousel; ordinary fleet cards retain their existing image presentation.
- Persist CDN image URLs in CMS seed data only when stable; never persist build-hashed import URLs.
- Keep FAQ answers in typed data with shared contact enrichment and rendering; generate FAQ schema from the same answers so visible content and search data cannot diverge.
- Main public routes get static head + summary HTML at build via `src/seo/prerenderRoutes.ts` and the Vite plugin; keep that table in sync with each page's `<Seo>` so non-JS crawlers see the same metadata.
- Business contact constants live in `src/lib/whatsapp.ts`; reuse them instead of re-typing contact details.
- Google Ads loading and conversions go through `src/lib/adsConsent.ts` (regional consent banner route, both Ads accounts); never add static Ads tags to index.html.
