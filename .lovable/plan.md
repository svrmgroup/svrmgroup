## 1. Per-page WhatsApp messages

Add a single config so both the floating FAB and the nav "Enquire" button pull a route-specific pre-filled message.

**New file `src/lib/whatsappMessages.ts`**

```ts
export const WHATSAPP_MESSAGES: Record<string, string> = {
  "/":                  "Hi SVRM Group, I'd like to enquire about your services.",
  "/travel":            "Hi SVRM Group, I'd like to enquire about travel arrangements.",
  "/rentals":           "Hi SVRM Group, I'd like to enquire about vehicle rentals.",
  "/stays":             "Hi SVRM Group, I'd like to enquire about accommodation and villa stays.",
  "/tours":             "Hi SVRM Group, I'd like to enquire about a private tour.",
  "/security":          "Hi SVRM Group, I'd like to enquire about security services.",
  "/custom":            "Hi SVRM Group, I'd like to enquire about a custom itinerary.",
  "/airport-transfers": "Hi SVRM Group, I'd like to book an airport transfer.",
  "/chauffeur":         "Hi SVRM Group, I'd like to enquire about chauffeur service.",
  "/aquila-safari":     "Hi SVRM Group, I'd like to enquire about the Aquila safari day trip.",
};

export const WHATSAPP_BASE = "https://wa.me/27730641481"; // svrmgroup short link not guaranteed to resolve

export function whatsappUrlFor(pathname: string): string {
  // Exact match first, then first-segment fallback, then generic Home.
  const exact = WHATSAPP_MESSAGES[pathname];
  const seg = "/" + pathname.split("/").filter(Boolean)[0];
  const msg = exact ?? WHATSAPP_MESSAGES[seg] ?? WHATSAPP_MESSAGES["/"];
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(msg)}`;
}
```

- Uses `encodeURIComponent` at runtime — no hardcoded encoded strings.
- Contact (`/contact`) and Journal (`/blog`) aren't in the map, so they fall through to the generic Home message per the brief.

**Wire into buttons** via `useLocation()`:

- `src/components/svrm/WhatsAppFab.tsx` — replace the hardcoded `buildWhatsAppUrlRaw(...)` with `whatsappUrlFor(useLocation().pathname)`. Style, position, colour, `target="_blank"` unchanged.
- `src/components/svrm/Nav.tsx` — same swap for both the desktop "Enquire" pill and the mobile sheet's "Enquire on WhatsApp" button.

The legacy `buildWhatsAppUrl` / `buildWhatsAppUrlRaw` helpers in `src/lib/whatsapp.ts` stay put (they're referenced from ~30 other components — enquiry forms, PDFs, etc.) so this change is scoped to the two buttons the brief calls out.

## 2. Aquila Safari as a tour

Create a new sub-tour under Tours rather than a standalone page (matches how every other tour is modelled, keeps routing clean).

- Add an `aquila-safari` entry in `src/data/tours.ts` with `duration: "1 day"`, hero image, description, inclusions (game drive, lunch, hotel pickup), and a WhatsApp-first CTA.
- Add it to the Tours nav dropdown in `src/lib/navCategories.ts` under a new **"Day trips"** heading (or as a top-level Tours item — see Q1 below).
- Route already exists via the dynamic `/tours/:slug` — no `App.tsx` change needed.
- Image: use `imagegen` (standard tier) to produce a photograph of white lions / a game-drive vehicle in Karoo landscape, saved as an `.asset.json` under `src/assets/tours/`.

The brief's `/aquila-safari` route in the WhatsApp map is kept as-is — anyone landing there (e.g. from a marketing link) still gets the Aquila-specific message thanks to the exact-match config. If we redirect `/aquila-safari` → `/tours/aquila-safari`, the fallback logic still picks the Aquila message because `/tours` is the first-segment fallback… but Aquila is more specific, so I'll also add `/tours/aquila-safari` to the map.

## 3. Sort tours by duration

Every category in `src/data/tours.ts` has a `packages[]` array with a `duration` string like `"3 days"`, `"30 min"`, `"1 day"`. Add a `durationToHours()` helper and sort each category's packages ascending. Where `Tours.tsx` / `TourDetail.tsx` render packages, they'll pick up the pre-sorted array automatically (no component change needed).

Parser handles: `N min`, `N hour(s)`, `N day(s)`, `N week(s)`. Unknown strings sort last.

## 4. WhatsApp as primary contact

Audit human-name / phone / email CTAs on public pages and replace with the WhatsApp button where they duplicate contact intent. Concretely:

- `Footer.tsx`, `ClosingCTA.tsx`, `Contact.tsx`, `Hero.tsx`, category cards: swap `"Call our concierge"` / `"Email"` style CTAs to the route-aware WhatsApp button. Keep one small email + phone line in the footer for legitimacy, but demote it — WhatsApp becomes the primary call-to-action colour/size.
- No admin pages touched (they already have their own tooling).

Full list of files to touch will come from a `rg` sweep during build — locked to public routes only.

## 5. Menu reorganisation

Update `src/components/svrm/Nav.tsx` `links` order so "Custom" sits with service pages, not between Journal/Contact:

```
Home · Travel · Rentals · Stays · Tours · Security · Custom · Journal · Contact
```

It's already in that position 👍 — but visually "Custom" points at `/experiences`, which is inconsistent with everything else being top-level. Two options in Q2.

**Add Airport Transfers under Travel** in `src/lib/navCategories.ts`:

```ts
"/travel": [
  { label: "Chauffeured Cars",     to: "/travel?cat=cars" },
  { label: "Airport Transfers — Small",  to: "/airport-transfers?size=small" },
  { label: "Airport Transfers — Medium", to: "/airport-transfers?size=medium" },
  { label: "Airport Transfers — Large / Van", to: "/airport-transfers?size=large" },
  { label: "Private Jets",         to: "/travel?cat=jets" },
  { label: "Helicopters",          to: "/travel?cat=helicopters" },
  { label: "Yachts",               to: "/travel?cat=yachts" },
],
```

New minimal page `src/pages/AirportTransfers.tsx` + route in `App.tsx`:
- Reads `?size=` from the URL, shows a single enquiry card ("Small / Medium / Large / Van — enquire on WhatsApp") — **no per-vehicle listings**, per the brief.
- Primary CTA is the route-aware WhatsApp button, which auto-fills the Aquila-style message.

## Technical notes

- No database or edge-function changes.
- No new dependencies.
- `useLocation()` is already used elsewhere; safe inside `Nav` and `WhatsAppFab` since they render inside `<BrowserRouter>`.
- Sorting is done at module load time in `tours.ts`, so it costs nothing at render.

## Open questions

1. **Aquila nav placement** — add it as a plain Tours-dropdown item (`{ label: "Aquila Safari (Day)", to: "/tours/aquila-safari" }`) or split the dropdown into a "Day trips" subsection with Aquila under it? I'd default to plain item unless you want the subsection.
2. **"Custom" label** — keep as `Custom` pointing at `/experiences`, or rename the route to `/custom` (redirect old URL) so nav slug and label match? Renaming is cleaner but requires updating internal links.

I'll assume plain item + keep `/experiences` route (with `/custom` as an alias redirect) unless you say otherwise.
