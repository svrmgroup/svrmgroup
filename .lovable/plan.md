# SVRM — SEO, Maybach & Experience Update

No redesign. Existing pages, routes, branding, forms, WhatsApp, booking and currency logic stay exactly as they are. Everything below is additive or a content/metadata improvement.

## 1. Mercedes-Maybach S-Class (flagship)

- Add a `mercedes-maybach-s-class` entry to the vehicle data as the first Signature/chauffeur vehicle: R22,000/day in ZAR base, chauffeur-only (not self-drive), tagline in the existing house voice.
- Your uploaded Maybach photograph becomes the vehicle image, cropped to the same 16:10 framing and colour treatment as the rest of the fleet photography, alt text: "Mercedes-Maybach S-Class chauffeur service in Cape Town — SVRM Group".
- Chauffeur (Travel → cars) page: a dedicated flagship block at the very top, above the existing grid — headline "Mercedes-Maybach S-Class", subheading "SVRM's Flagship Chauffeur Experience", concise positioning copy (VIP, executive, airport and hotel transfers, private events, corporate travel, honeymoons, anniversaries, long-distance), price shown through the existing currency formatter so USD/GBP/EUR convert from the ZAR base, and the existing booking sheet as the CTA.
- Price displays via the current `useCurrency().format` helper — no hard-coded conversions. Verified after the change.

## 2. Homepage offers

Same carousel and card design, updated content set:

1. Mercedes-Maybach S-Class — R22,000 / day — "Request Maybach"
2. Luxury Honeymoon in Cape Town — "Plan Your Honeymoon"
3. Luxury Anniversary Experience — "Plan Your Anniversary"
4. Cape Peninsula — One Day Private Tour — "Book Private Tour"
5. Security & Protection — "Request Security"

The BMW X3 special and existing entries stay in rotation behind these. Homepage copy also gains a short line promoting villas/stays and bespoke build-your-own experiences, linking to `/stays` and `/experiences`.

## 3. New pages and tour

- `/tours/cape-peninsula` — One Day Private Tour, added to the tours data with the full route (Camps Bay, Clifton, Hout Bay, Chapman's Peak, Noordhoek, Cape Point, Cape of Good Hope, Boulders Beach, Simon's Town), an enquiry/booking CTA, and links to Chauffeur, Concierge and the Maybach (so the Maybach can be requested for the tour). Prominent on the Tours page.
- `/honeymoon-cape-town` — luxury honeymoon concierge page (chauffeur, private stays, romantic experiences, private tours, yacht, Cape Peninsula, bespoke arrangements). No invented hotels or suppliers.
- `/anniversary-cape-town` — luxury anniversary experience page, same structure.
- Security: improve the existing `/security` page copy and metadata for the target terms, and add `/security-services-cape-town` as a canonical-safe alias pointing at it (no duplicate content).

## 4. Journal articles

Flagship article first: "Mercedes-Maybach S-Class Chauffeur Service in Cape Town" — full SEO treatment, R22,000/day mention, strong request-the-Maybach CTA, internal links to chauffeur, concierge, Cape Peninsula tour, honeymoon and anniversary.

Then the remaining articles from your list across Chauffeur, Concierge, Security, Honeymoon & Anniversary, Tours and Vehicles. Each one: unique SEO title, meta description, single H1, H2 structure, alt text, internal links to the matching commercial page, and a CTA. All existing blog posts stay untouched.

Because that is ~24 articles, I'll write them in batches — the Maybach article plus the chauffeur and concierge sets first, then security, honeymoon/anniversary, tours and vehicles — so you can review tone before the rest land.

## 5. Keyword mapping (no stuffing)

Each page owns a small keyword cluster rather than repeating everything sitewide: home = luxury concierge Cape Town / lifestyle management; travel = chauffeur, S-Class, Maybach, private driver; airport transfers = luxury airport transfer; rentals = luxury car rental/hire, Range Rover, G-Class, luxury SUV; security = VIP/executive/close protection; tours = Cape Peninsula private tour, luxury private tours; honeymoon and anniversary pages own their own terms.

## 6. Technical SEO

- Sitemap updated with the new routes (Cape Peninsula tour, honeymoon, anniversary, security alias, all new articles).
- Canonicals self-reference every route via the existing `Seo` component; robots.txt reviewed and left crawlable — nothing gets noindex.
- Schema: Service and Offer markup on the Maybach and new service pages, Article on new posts, BreadcrumbList on tour and blog detail pages.
- Internal linking blocks added at the foot of the service pages following the map you gave (Concierge → Chauffeur/Maybach/Security/Villas/Honeymoon/Anniversary/Tours/Yachts, etc.), with natural anchor text.
- Alt text audit on the pages touched.

## 7. Verification before I hand back

Build passes, then a browser pass over home, travel, rentals, tours, the new tour, security, honeymoon, anniversary and one blog post: Maybach shows at the top of chauffeur at R22,000/day, currency switching converts correctly, enquiry forms and WhatsApp links still fire, existing vehicles and blogs all still render, and new internal links resolve.

## Technical notes

- Vehicle added to `src/data/vehicles.ts`; flagship block rendered in `src/pages/Travel.tsx` reusing `BookingSheet`.
- Homepage offers edited in `src/components/svrm/Offers.tsx`; the CMS override path (`useCmsItems("offers")`) still wins when rows exist, so the same offers get seeded through `src/lib/cmsSeed.ts` to keep admin editing working.
- New tour appended to `src/data/tours.ts` (renders through the existing `/tours/:slug` route).
- New pages registered in `src/App.tsx`; metadata through `src/components/Seo.tsx`.
- Posts appended to `src/data/blog.ts`.
- Maybach image uploaded as a CDN asset pointer, matching the existing asset pattern.
