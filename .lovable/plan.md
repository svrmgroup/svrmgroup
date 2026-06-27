## Overview

Expand SVRM beyond the current 5-item limits: many more vehicles and stays across budget tiers, hotel rooms, stay extras (chauffeur/chef/etc.), a new Car Rental page with a booking calendar, a drone-style cinematic home hero, and a global scroll-to-top on every route change.

## 1. Scroll to top on navigation

New `src/components/ScrollToTop.tsx` — listens to React Router's `pathname` and scrolls the window to (0,0) on every change. Mounted once inside `<BrowserRouter>` in `App.tsx`. Fixes the issue where new pages open scrolled to wherever the previous page was.

## 2. Fleet — ~14 vehicles, grouped by tier

Expand `src/data/vehicles.ts` and split the Travel page into tier sections:

- **Signature**: Rolls-Royce Cullinan, Rolls-Royce Ghost, Lamborghini Urus, Bentley Bentayga
- **Premium SUV**: Mercedes-AMG G63, Range Rover Autobiography, Range Rover Sport, Porsche Cayenne, BMW X5
- **Executive**: Mercedes-Benz S-Class, BMW 7 Series, Mercedes V-Class (chauffeur van)
- **Everyday / Budget**: BMW X3, Mercedes C-Class, Audi Q5

Each card keeps Ken Burns motion, ZAR/day price (currency-switch aware), and Enquire-on-WhatsApp.

## 3. Stays — ~12 properties + Hotel Rooms tab

Expand `src/data/stays.ts` across tiers and split Stays into three tabs:

- **Villas**: Camps Bay, Clifton, Bantry Bay, Llandudno, Bishopscourt, Constantia
- **Apartments**: V&A Waterfront, Sea Point, De Waterkant, Green Point, Woodstock loft
- **Hotel Rooms** (new): Cape Grace, One&Only, Mount Nelson, Silo, Table Bay, The Bay Hotel — indicative rates, booked through SVRM concierge

Adds `type: 'villa' | 'apartment' | 'hotel'` to the stay record.

### Stay extras

Each stay enquiry includes an Extras chip selector:
add chauffeur · add private chef · add daily housekeeping · add airport transfer · add yacht day · add tour package. Selections are appended to the WhatsApp message and to the enquiry record.

## 4. New page — Car Rental with booking calendar

New route `/rentals` + nav link.

- Grid of self-drive rentals (a subset of the fleet flagged `selfDrive: true`).
- Each card opens a booking sheet with:
  - shadcn `Calendar` (range mode) for pickup → return
  - Pickup location (CT International / V&A Waterfront / Custom)
  - Add-ons (child seat, additional driver, delivery)
  - Estimated total in the selected currency (days × daily rate)
  - "Request booking" → writes to `rental_requests` and opens WhatsApp pre-filled.

Backend: new `public.rental_requests` table (vehicle, date range, pickup, extras, contact, currency, estimated_total) — insert-only for anon, full access for service_role, same pattern as `enquiries`.

## 5. Home — drone-style cinematic hero

Replace the current single stock clip in `Hero.tsx` with a generated drone-style video of a luxury car on a Cape Town coastal road (Chapman's Peak vibe), ~8s loop with poster fallback. Add a second motion still lower on the page.

## 6. Files touched

- New: `src/components/ScrollToTop.tsx`, `src/pages/Rentals.tsx`, `src/components/svrm/RentalCard.tsx`, `src/components/svrm/RentalBookingSheet.tsx`, `src/components/svrm/ExtrasPicker.tsx`, `src/data/extras.ts`.
- Edit: `src/data/vehicles.ts`, `src/data/stays.ts`, `src/pages/Travel.tsx` (tier sections), `src/pages/Stays.tsx` (tabs + extras), `src/components/svrm/StayCard.tsx`, `src/components/svrm/EnquiryForm.tsx` (extras prop), `src/components/svrm/Hero.tsx` (drone clip), `src/components/svrm/Nav.tsx` (Rentals link), `src/App.tsx` (route + ScrollToTop).
- Assets: ~9 new vehicle images (already generated this turn), ~6 villa images, ~6 hotel images, 1 drone-style video.
- DB migration: `rental_requests` table (already applied this turn).

## Trade-offs

- **Drone footage**: generated via the AI video tool — styled as aerial Cape Town. Real licensed drone footage can be dropped in later.
- **Hotel rooms**: request-only, no live inventory.
- **Calendar**: captures requested dates only; availability is confirmed by the concierge.
