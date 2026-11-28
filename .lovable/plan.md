# Tour packages: "View package" button and a page for each package

## What changes for visitors
- On each tour page (e.g. Cape Peninsula), every package card keeps its current photo, title, price and inclusions. Only the button changes: "Book dates" becomes "View package".
- "View package" opens a new page for that one package, e.g. `/tours/cape-peninsula/<package-name>`.
- Each package page shows:
  - A scrollable photo gallery (swipe on phone, arrows on desktop) of several real, credit-free photos matching that tour's places and activities.
  - Package name, duration, price (or "On enquiry"), a short description and the full "What's included" list.
  - Vehicle choice shown as categories (Classic, Executive, Luxury, Group), with vehicle photos shown uncropped.
  - Book dates / WhatsApp enquiry for that exact package, so the message names the package.
  - A "Back to all packages" link.
- Nothing else on the tour pages, tours list, stays, vehicles or homepage changes. Nothing is published until you review.

## Photos
- Reuse the 24 credit-free real photos already reviewed earlier (Bo-Kaap, Cape Point, Chapman's Peak, Table Mountain, Boulders, safari, etc.), grouped by tour.
- Where a package has fewer than 3 matching photos, fill with existing SVRM photos of the same place or activity. No photo credits, no outside links.

## Technical details
- `PricingCard.tsx`: add optional `href` prop; when set, render a `Link` labelled "View package" instead of the booking button. Only `TourDetail.tsx` passes it, so stays/vehicles/rentals keep "Book dates".
- Restore `src/data/tourPackages.ts`, `tourPhotos.ts`, `tourPhotoLibrary.json` and `src/pages/TourPackageDetail.tsx` from commit `8d1a65d`, adjusted to the current tour data; strip any credit/source fields from rendering.
- Route `/tours/:slug/:packageSlug` in `src/App.tsx`; unknown package goes to 404.
- Gallery uses the shared carousel; enquiry uses `src/lib/listingEnquiry.ts` with `data-wa-source`.
- Add package routes to static heads and sitemap via `scripts/generate-listing-routes.ts`; keep `tourPackages.test.ts` passing.
- Check in browser: card button text, package page gallery scrolls, enquiry message names the package, mobile layout.
