## Goal

Expand SVRM from a single homepage into a small multi-page site with proper navigation, a tabbed Services hub, individual service detail pages, and an editorial structure for Business, Concierge, and About — all wired to a single WhatsApp booking handler.

## Routes

```text
/                           Homepage (existing)
/services                   Services hub (4 tabs)
/services/:category/:slug   Service detail page
/business                   Business page (placeholder copy)
/concierge                  Concierge page (placeholder copy)
/about                      About page (placeholder copy)
```

`App.tsx` gets new routes above the catch-all.

## Navigation

Update `Nav.tsx`:
- Replace the single anchor link with primary nav: Services · Business · Concierge · About
- Keep the gold "Enquire" button on the right (now opens WhatsApp)
- Mobile: collapse links into a hamburger sheet (using existing shadcn `Sheet`)
- Active route gets a thin gold underline
- Logo links to `/`

`Footer.tsx` mirrors the same links.

## Services hub (`/services`)

Layout:
1. Slim hero — eyebrow "Our world", serif headline, gold divider
2. Tab bar (4 tabs): **Lifestyle**, **Transport**, **Stays**, **Experiences**
   - Built with shadcn `Tabs`, restyled to fit the dark/gold system (uppercase, letter-spaced labels, gold underline on active)
   - Selected tab is reflected in the URL via `?tab=transport` so tabs are linkable
3. For each active tab, render a grid of service cards **side-by-side** with images:
   - 2 columns on desktop, 1 on mobile
   - Each card: landscape image left / copy right (alternating on larger screens for editorial rhythm), title, one-line teaser, "Discover →"
   - Whole card links to `/services/:category/:slug`

Example data shape (single source of truth in `src/data/services.ts`):
```text
Lifestyle: Personal Shopping, Private Chef, Wellness & Spa
Transport: Chauffeur, Airport Transfers, Helicopter & Charter
Stays:     Boutique Villas, Private Estates, Signature Hotels
Experiences: Wine Routes, Yacht Days, Safari Add-ons
```
(Placeholder names — easy to edit later.)

## Service detail page (`/services/:category/:slug`)

Editorial layout:
- Full-width hero image with title overlay
- Two-column body: left = long-form description, right = sticky "What's included" + "Book on WhatsApp" gold button
- "Related signatures" strip at the bottom linking to other services in the same tab
- Breadcrumb back to `/services`

Reuses placeholder copy until real content arrives.

## WhatsApp booking

Single helper `src/lib/whatsapp.ts`:
```text
WHATSAPP_NUMBER = "27000000000"  // placeholder, swap in one place later
buildWhatsAppUrl(serviceTitle) => https://wa.me/27000000000?text=...
```

Used by:
- Nav "Enquire" button
- Each service detail "Book on WhatsApp" CTA (pre-fills message: "Hi SVRM, I'd like to enquire about {service}.")
- Homepage hero + ClosingCTA buttons (replace existing `#enquire` anchors)

## Business / Concierge / About

Each gets its own page component with the same shell (Nav + Footer) and a clean structural skeleton ready for your copy:
- Hero (eyebrow, headline, divider)
- Two or three content sections with placeholder lorem
- Closing WhatsApp CTA

Marked with a `{/* TODO: replace placeholder copy */}` comment so it's easy to find later.

## Files

New:
- `src/pages/Services.tsx`
- `src/pages/ServiceDetail.tsx`
- `src/pages/Business.tsx`
- `src/pages/Concierge.tsx`
- `src/pages/About.tsx`
- `src/data/services.ts` (categories, services, slugs, copy, image refs)
- `src/lib/whatsapp.ts`
- `src/components/svrm/ServicesTabs.tsx` (tab bar + grid)
- `src/components/svrm/ServiceCard.tsx` (side-by-side image card)
- A handful of new placeholder service images in `src/assets/` (generated to match the existing luxe palette)

Edited:
- `src/App.tsx` — register new routes
- `src/components/svrm/Nav.tsx` — primary nav + mobile sheet, WhatsApp enquire
- `src/components/svrm/Footer.tsx` — mirror nav links
- `src/components/svrm/Hero.tsx`, `ClosingCTA.tsx` — point CTAs at WhatsApp helper
- `src/components/svrm/Services.tsx` (homepage section) — keep as a 3-card teaser, "View all services" link to `/services`

## Notes

- Placeholder WhatsApp number lives in one constant — swap when you have the real one.
- Business / Concierge / About ship with structural placeholder copy; send your text and I'll drop it in.
- Tabs categories chosen: Lifestyle / Transport / Stays / Experiences.
