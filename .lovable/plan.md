## 1. Social handles → @SVRMGROUP

Only one file references the old handle. Update it; every component (Footer icons, mobile + desktop) reads from this constant, so nothing else needs touching.

- `src/lib/whatsapp.ts`
  - `INSTAGRAM_URL` → `https://www.instagram.com/svrmgroup/`
  - `TIKTOK_URL` → `https://www.tiktok.com/@svrmgroup`
  - Add `SOCIAL_HANDLE = "@SVRMGROUP"`
- `src/components/svrm/Footer.tsx`: add a small `@SVRMGROUP` label next to the IG/TikTok icons (currently icon-only). Keep layout/colour the same.
- `aria-label`s updated to "SVRM Group on Instagram / TikTok".

No other files mention `svrmcpt`. Header has no social icons today — leaving as-is (not adding new UI you didn't have).

## 2. Pricing → "On request" everywhere

Hide all numeric prices on the four commercial pages while keeping the underlying data (so we can restore later without re-typing).

- **Tours** (`PricingCard`, `TourBuilder`, `TourDetail`): replace ZAR/GBP/USD numbers with the gold label **"Price on request"**. Per-person / duration / inclusions stay.
- **Tours → Custom builder**: instead of a live total, show a **"Rough estimate: from R X,XXX pp"** band that updates as options change, with a clear note that the final quote is on request. Uses the existing builder maths, just relabeled.
- **Stays** (`StayCard`, enquiry sheets): remove `fromZAR / per night`; show **"Rates on request"**.
- **Rentals** (`RentalCard`, `RentalBookingSheet`, `CustomRentalRequest`): remove daily rates; show **"Rates on request"**. Calendar + tier picker stay.
- **Travel** (`VehicleCard`, tier sections): remove daily rates; show **"Rates on request"**.
- `CurrencySwitch` stays mounted (still used by the rough-estimate band in the tour builder) but is hidden on pages where no prices remain.

## 3. Travel — add category switcher

Add a top-level tab row on `/travel`: **Cars · Private Jets · Helicopters · Yachts**.

- Refactor `src/pages/Travel.tsx` to wrap the current fleet view in a `Tabs` (matching the Rentals page styling).
- New data file `src/data/aviation.ts` for jets/helicopters and `src/data/yachts.ts` for yachts. Each entry: name, tagline, image, capacity, "Price on request", Enquire-via-WhatsApp CTA.
- Seed 3–4 cards per new category (e.g. Light Jet / Midsize / Heavy; Robinson R44 / AS350 / EC130; 60ft Sailing / 80ft Motor / Superyacht charter). Generate matching cinematic images.

## 4. Stays — add category switcher

Replace the current Villa / Apartment / Hotel tab with a two-level structure:

- **Top tabs**: Short-term · Long-term · Buy & Sell
  - **Short-term** keeps the existing Villa / Apartment / Hotel sub-tabs and the StaySearchBar + CustomStayBar.
  - **Long-term** shows a brief intro + a lead form (months, area, budget bracket → WhatsApp). New small section, no listings yet.
  - **Buy & Sell** shows an intro + lead form (buy or sell, area, bedroom count, budget) → WhatsApp. New small section, no listings yet.

## 5. Publish

After you approve the above, publish to https://svrm.group and https://www.svrm.group. Head metadata is already accurate; I'll verify the title/description/OG tags before clicking publish.

## What is NOT being changed

Design, layout, colours, logo, services list, phone, email, domain, WhatsApp button. Pricing data is kept in source (just hidden) so it can be re-enabled later.

## Open question

For **Long-term stays** and **Buy & Sell properties** — do you want me to keep them as lead-capture forms only (recommended for launch), or seed a few placeholder listings now? If you want listings, please send a source (rough property list, or a site to model them on like the noxrentals stays).
