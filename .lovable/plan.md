## Goal

Rebuild the short-term section of `/stays` around your Nox Rentals partnership: 20-24 real Nox properties across the full price spectrum, with real Nox photos hosted on SVRM (downloaded, not hotlinked), a "from ZAR X / night" starter price shown per card, and a Sort control (Popular / Price low→high / Price high→low). "Enquire" still goes to WhatsApp — no outbound links to Nox.

## Property selection (20-24 across all budgets, all Nox areas)

Curated from Nox's live inventory so we cover budget → ultra-luxury. Each entry gets its **cheapest low-season nightly rate** pulled from its Nox listing page as the "from" price.

Villas (~8, mid → ultra)
- Camps Bay Sunset Sanctuary (3 bed)
- Camps Bay Ithemba (6 bed, pool, views)
- Camps Bay Buddha Retreat (10 bed, 2 pools) — flagship
- Camps Bay Kinvara Villa (5 bed, gym, pool)
- Llandudno Solmara House (5 bed, beach oasis)
- Llandudno Sands 4-bed coastal retreat
- Bantry Bay Hamaya (4 bed, sea + mountain)
- Constantia / Higgovale Sandstone (4 bed, mountain views)

Apartments & penthouses (~10, budget → premium)
- 1-bed Stonewood at The Granger (budget entry)
- Urban Signature 1-bed (budget CBD)
- Old Cape Quarter 1-bed (budget De Waterkant)
- Aquene Bay 2-bed (mid CBD)
- Green Point Azura Atlantic 2-bed
- De Waterkant 116 DWP townhouse w/ pool
- Mouille Point 2-bed w/ Cape views
- Sea Point Alpha Sunsets 2-bed
- Clifton Marella (direct beach access)
- Clifton Dunmore Horizons penthouse (3 bed premium)
- Sea Point Luxurious Penthouse (3 bed)
- V&A Marina Altmore 001

Standout residences (~4, high-end)
- Waterfront Aqua Views (Waterclub)
- Waterfront Amani Views (Waterclub)
- Camps Bay Rock Residence (6 bed, sea view)
- Lobster Villa (Llandudno, 6 bed family retreat)

Final 20-24 confirmed while building based on Nox availability.

## Data & pricing

- Rewrite `src/data/stays.ts` short-term entries (`villa` + `apartment` types). Keep hotel entries as-is.
- Each new stay gets: `name`, `area`, `beds`, `fromZAR` (Nox's low-season nightly rate), `image`, `blurb`, `type`, `noxSlug` (internal only, not shown).
- No outbound Nox links on the card — Enquire button still goes to WhatsApp with the property name and area.

## Photos

Downloaded from each Nox listing's main hero shot, saved to `src/assets/stays/nox/<slug>.jpg`, then externalised via `lovable-assets` (repo stays light). Existing unused stay images that no longer map to a listing get removed.

## UI changes on `/stays`

Short-term tab additions:
1. **Sort dropdown** above the grid: `Popular` (default, curated order) · `Price: Low to High` · `Price: High to Low`.
2. **"From R X,XXX / night"** replaces the current "On request" line on each `StayCard`. Currency switcher (ZAR/GBP/USD) already handles conversion — reuse it.
3. Small "Managed with Nox Rentals" line in the sub-tab header so guests understand the partnership.
4. Villa / Apartment / Hotel sub-tabs stay. Hotels remain "On request".

## Files touched

- `src/data/stays.ts` — replace short-term entries, add `noxSlug`, populate `fromZAR`.
- `src/components/svrm/StayCard.tsx` — show "from R X / night" using currency context; keep hotels on "On request".
- `src/pages/Stays.tsx` — add Sort dropdown state, add partnership subtitle.
- `src/assets/stays/nox/*.jpg.asset.json` — new Nox photos on CDN.
- Remove old unused stay images.

## Out of scope

- Live availability / real-time pricing (Nox doesn't expose an API for this — indicative "from" rates only, quote confirmed on enquiry).
- Outbound "Book on Nox" buttons (you asked to keep WhatsApp as the flow).
- Long-term and Buy & Sell tabs — untouched.
