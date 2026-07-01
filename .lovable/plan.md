
## Goals
1. Replace the single hero image per Nox property with a **scrollable photo carousel** (arrows + swipe on mobile).
2. Use only real interior/exterior photos of each villa / apartment. No "Guest Guarantee" promo banners, no text overlays.
3. Fix the truncated text in the card (property name currently gets clipped).
4. Remove the "Managed with Nox Rentals" line from each card.
5. Reorder the **Short-term** tab so the layout, top to bottom, is:
   1. Check‑in search bar (dates, guests, rooms)
   2. Sub‑tabs (Villas / Apartments / Hotel Rooms) + property grid
   3. "Tell us your budget" custom stay bar
6. Leave the top-level tabs — **Short‑term · Long‑term · Buy & Sell** — exactly where they are.

## What I'll do

### 1. Pull real gallery photos per property
For each of the 24 Nox listings, fetch the property page on `noxrentals.com` and read the JSON payload embedded by Guesty (the array of listing photos on `assets.guesty.com/image.../...`). I'll take the first 6–8 photos per property, drop any that are:
- Marketing banners (filenames containing `guest-guarantee`, `banner`, `promo`, `logo`, `hero`, `cover-text`).
- Non-photo mime types.
- Images whose dominant text region is detected (very small, quick heuristic — cheap safety net).

Each kept photo is downloaded, resized to 1600px wide JPEG, and uploaded via `lovable-assets`. The pointer `url`s are stored on each stay as `images: string[]`.

### 2. Data model change (`src/data/stays.ts`)
```ts
export interface Stay {
  slug: string;
  name: string;
  area: string;
  beds: string;
  fromZAR: number;
  image: string;        // kept as cover / fallback
  images?: string[];    // NEW — gallery for Nox properties
  blurb: string;
  type: StayType;
  nox?: boolean;
}
```
Hotels stay as-is (single image).

### 3. New `StayCard`
- Swap the single `KenBurnsImage` for an **embla carousel** (already in the project via shadcn) with:
  - Left / right arrow buttons that appear on hover on desktop.
  - Native touch swipe on mobile.
  - Small dot indicators at the bottom.
  - Same `aspect-[16/10]` frame so grid alignment doesn't shift.
- Text fixes:
  - Property name: allow up to 2 lines (`line-clamp-2`), remove any truncation.
  - Beds / area line: single line with ellipsis.
  - Blurb: `line-clamp-3` so cards stay the same height.
- Remove the "Managed with Nox Rentals" line entirely.

### 4. Reorder short-term tab (`src/pages/Stays.tsx`)
Current order inside `TabsContent value="short"`:
```
StaySearchBar
CustomStayBar
Sub-tabs + grid
```
New order:
```
StaySearchBar                     ← "check in" at the top
Sub-tabs (Villas/Apts/Hotel) + Sort + grid
CustomStayBar                     ← "tell us your budget" at the bottom
```
The three top-level tabs (Short-term, Long-term, Buy & Sell) and the Long-term / Buy & Sell tab contents are untouched.

### 5. Nothing else changes
- Sort control (Popular / Low→High / High→Low) stays.
- Currency switcher behaviour stays.
- Hotel cards keep "On request" and a single photo.
- WhatsApp Enquire button unchanged.

## Technical notes
- Photo scraping runs once, in the sandbox, as a Python script under `/tmp/nox/`. It writes ~150 new `.jpg.asset.json` pointer files under `src/assets/stays/nox/<slug>/NN.jpg.asset.json`. Old single hero pointers are kept (used as cover / for SSR-safe first paint).
- Carousel uses `embla-carousel-react` via the existing `@/components/ui/carousel` wrapper — no new dependency.
- All work stays in frontend / data files. No backend, no schema changes, no route changes.
