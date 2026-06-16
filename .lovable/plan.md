# SVRM Full Restructure

## New IA & Routes
- `/` Home — hero video, intro, 5 featured service cards, testimonials
- `/travel` — Chauffeuring & Car Rentals, Private Jets & Helicopters, Luxury Car Rentals (sectioned, anchored)
- `/lifestyle` — Yachting & day charters + add-ons
- `/stays` — Short-Stay, Long-Term, Buy & Sell (renamed from Properties)
- `/tours` — hub with 5 subpages:
  - `/tours/safari` (3/5/7/14-day pricing)
  - `/tours/hunting` (7-day pkg)
  - `/tours/cultural` (3/5/7-day)
  - `/tours/adventure` (3/5/7-day)
  - `/tours/builder` — **interactive visual picker** with live USD estimate
- `/experiences` — Custom Experiences + enquiry form
- `/blog` — hub with placeholder posts + category filter
- `/contact` — form, email, WhatsApp

Old `/services`, `/services/:cat/:slug`, `/business`, `/concierge`, `/about` routes are removed (Concierge messaging folds into Home + Contact; About folds into Home intro). Existing service images get remapped into the new pages (transport→travel, stays→stays, experiences/wine/safari/yacht→tours/lifestyle).

## Logo & Brand
- Upload the cream-circle SVRM logo via Lovable Assets.
- Place in `Nav` (replaces wordmark) and `Footer` (smaller). Cream circle on dark nav is accepted.
- Keep deep-black / off-white / brushed-gold palette already in `index.css`.

## Tours Builder (`/tours/builder`)
- Visual icon picker: activities (Safari, Cultural, Adventure, Yacht, Helicopter, Spa, Chef), duration slider (3/5/7/10/14 days), travellers (1–8), accommodation tier (Premium/Luxury/Ultra).
- Live indicative range in USD per person computed from a transparent table:
  - Base/day by tier (Premium 350, Luxury 650, Ultra 1100)
  - Activity adders (Safari +400/day, Heli +900 one-off, Yacht +800 one-off, etc.)
  - Range shown as ±15% band, with "Indicative only — every itinerary personalised" caveat.
- CTA: "Request bespoke itinerary" → opens Enquiry form pre-filled with selections; also a WhatsApp shortcut.

## Enquiry System (requires Lovable Cloud)
- Enable Cloud.
- Table `enquiries` (id, name, email, phone, subject, message, source_page, created_at) with RLS: INSERT for `anon`, SELECT only for `service_role`. Explicit GRANTs.
- Reusable `<EnquiryForm subject="..." />` (zod validated: name 1–100, email, phone optional, message 1–2000).
- Every service/tour page ends with `<EnquiryForm>` + WhatsApp button.
- `/contact` is the canonical form, shows concierge@svrm.group and WhatsApp.
- (Email-to-concierge can be added later via Resend; this pass stores submissions in DB so nothing is lost.)

## Components (new / reused)
- `Nav` — new links: Home / Travel / Lifestyle / Stays / Tours / Experiences / Blog / Contact (collapse to drawer on mobile, 8 items is tight).
- `Footer` — updated link columns, logo.
- `PageHero` (reuse, exists)
- `SectionBlock` — full-bleed image + copy block, used heavily on Travel/Stays/Lifestyle.
- `PricingCard` — for tour packages (duration, from-price, inclusions, Enquire).
- `EnquiryForm` — shared.
- `TourBuilder` — the interactive picker.
- `TestimonialsCarousel` — already partial; ensure carousel behavior.

## Data files
- `src/data/tours.ts` — packages with price ranges per the brief.
- `src/data/travel.ts`, `src/data/stays.ts`, `src/data/lifestyle.ts` — section content + images.
- `src/data/blog.ts` — 5–6 placeholder posts.
- `src/lib/whatsapp.ts` — keep, add `concierge@svrm.group` constant alongside.

## Imagery
Reuse current assets where they map cleanly (chauffeur, airport, heli, villas, estate, hotel, wine→remove/replace, yacht, safari). Generate new images only where missing:
- Travel: S-Class interior, jet exterior, luxury car lineup
- Stays: long-term penthouse interior, Buy&Sell hero
- Tours: cultural/Robben Island, adventure/shark cage (tasteful), hunting (landscape, no graphic content)
- Custom Experiences hero
- Blog cover placeholders (2–3 reused per category)
No nightlife, no wine-focused imagery (per brief).

## Out of scope this pass
- Google Workspace MX/DNS setup (no code change needed; instructions only at end).
- Real email-send (Resend) — deferred; submissions land in DB and WhatsApp.
- Real blog CMS — placeholder posts only.

## Order of execution
1. Enable Lovable Cloud + create `enquiries` table & policies.
2. Upload logo asset.
3. Generate missing images (parallel).
4. Build data files + shared components (`EnquiryForm`, `SectionBlock`, `PricingCard`, `TourBuilder`).
5. Build pages + subpages.
6. Update `Nav`, `Footer`, `App.tsx` routes, `Index.tsx` home composition. Delete obsolete pages/components.
7. Verify routes load, builder math sane, form submits.
