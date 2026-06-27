## Overview

A focused upgrade to SVRM across Travel, Stays, Tours, Home and the global layout — adding cinematic Ken Burns motion on photos, 5 luxury vehicles and 5 villas with indicative pricing in ZAR/GBP/USD, your real WhatsApp number, and social links.

## 1. Contact & global

- Update `src/lib/whatsapp.ts` → `WHATSAPP_NUMBER = "27730641481"`.
- Add `INSTAGRAM = "https://instagram.com/svrmcpt"` and `TIKTOK = "https://tiktok.com/@svrmcpt"`.
- Add a **floating WhatsApp button** (bottom-right, gold circle, persistent) on every page via a new `WhatsAppFab.tsx` mounted in `App.tsx`. Includes a top-of-page sticky "WhatsApp" pill on Stays as requested.
- Footer: add Instagram + TikTok icon links.

## 2. Currency switcher (ZAR default, GBP, USD)

- New `src/lib/currency.tsx` — React context + `useCurrency()` hook, persisted to localStorage. Static FX rates table (ZAR base) with a note "Indicative — final quote on enquiry."
- `<CurrencySwitch />` component (small segmented control: R · £ · $) placed in the top nav (desktop + mobile sheet).
- `formatPrice(zar)` helper returns the converted, symbol-prefixed string.

## 3. Travel page — 5 luxury vehicles in the sun

Replace the current 3 long blocks with a **vehicle grid** of 5 cards (image, name, "from R X,XXX / day", Enquire on WhatsApp). Vehicles:

1. Rolls-Royce Cullinan — from R 24,500/day
2. Rolls-Royce Ghost — from R 22,000/day
3. Mercedes-AMG G63 — from R 14,500/day
4. BMW 7 Series — from R 9,500/day
5. Lamborghini Urus — from R 19,500/day

- Generate 5 new AI hero images (each car parked in Cape Town golden-hour sunlight, mountain/coast backdrop).
- Each card uses a new `<KenBurnsImage>` component (slow CSS `transform: scale + translate` over 18–22s, alternating direction) for the "moving picture" feel — no video credits, smooth, works on mobile.
- Keep the existing Jets / Chauffeur intro blocks above the grid, condensed.

## 4. Stays page — 5 villas/apartments

Replace the 3 blocks with a 5-card grid of properties in Camps Bay, Clifton, Bantry Bay, Sea Point, V&A Waterfront:

1. Camps Bay Cliff Villa — from R 38,000/night
2. Clifton Beachfront Penthouse — from R 28,000/night
3. Bantry Bay Ocean Villa — from R 32,000/night
4. V&A Marina Apartment — from R 12,000/night
5. Sea Point Sky Residence — from R 9,500/night

- Generate 5 original AI villa images (we cannot scrape noxrentals.com — copyright; you confirmed AI imagery).
- Each card uses `<KenBurnsImage>` and an "Enquire on WhatsApp" button pre-filled with the property name.
- Sticky **"WhatsApp the concierge"** button at the top of the Stays page.

## 5. Tours page + Home

- Convert tour cards and home hero secondary imagery to `<KenBurnsImage>` so the page feels alive.
- Home hero video stays. Add a Ken Burns "experience strip" below the services preview with 3 motion stills (safari, coast drive, villa).

## 6. Files touched

- New: `src/lib/currency.tsx`, `src/components/svrm/CurrencySwitch.tsx`, `src/components/svrm/WhatsAppFab.tsx`, `src/components/svrm/KenBurnsImage.tsx`, `src/components/svrm/VehicleCard.tsx`, `src/components/svrm/StayCard.tsx`, `src/data/vehicles.ts`, `src/data/stays.ts`.
- Edit: `src/lib/whatsapp.ts`, `src/App.tsx`, `src/components/svrm/Nav.tsx`, `src/components/svrm/Footer.tsx`, `src/pages/Travel.tsx`, `src/pages/Stays.tsx`, `src/pages/Tours.tsx`, `src/pages/Index.tsx`, `src/components/svrm/Services.tsx`, `src/index.css` (Ken Burns keyframes).
- Assets: 5 vehicle JPGs + 5 villa JPGs + 1–2 tour/home motion stills generated via `imagegen`.

## Notes

- **noxrentals.com**: their property photos are copyrighted and watermarked — using them on a commercial site is a legal risk. Per your selection, we'll generate original luxury imagery in the same style.
- All prices marked "Indicative · final quote on enquiry" — booking stays request-only.
- Currency rates are hardcoded constants; we can wire a live FX API later if you want.