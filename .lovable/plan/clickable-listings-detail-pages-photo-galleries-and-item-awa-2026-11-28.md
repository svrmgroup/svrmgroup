# Clickable listings, detail pages, photo galleries and item-aware WhatsApp enquiries

## How you review it, and how to undo it
- Before any change, I note the current version as the restore point ("site as of 28 Nov 2026").
- All work is done in the preview only. Nothing is published to svrm.group until you say so. Live Google Ads campaigns and budgets are not touched.
- You review each part in the preview (links below at the end of each phase).
- If you don't like it, everything is restored to the restore point in one step from version history. The new photo-gallery data is added alongside existing data (nothing deleted), so restoring leaves your current bookings, prices and photos as they are.

## Phase 1 — Every listing gets its own page
- Audit all published vehicles, stays, tours and experiences from current site/admin data.
- One reusable page template per type: vehicle, property, tour, service/experience. New published listings get a page automatically.
- Card image, title and "View details" all link to the same real URL; enquiry buttons enquire about that item.
- Routes like /chauffeur/maybach-v-class, /stays/the-atlantic-villa-camps-bay; existing /tours/... routes kept.
- Old links (?cat=cars&vehicle=...) redirect to the right page, keeping ad tracking parameters. Filters and Back button keep working.

## Phase 2 — Page content
- Vehicles: model, service type (chauffeur vs self-drive clearly labelled), gallery, "Why choose the …?", passengers, luggage, features, hire options, approved price or "Request a quote" (rentals stay "On enquiry"), 3–5 FAQs, 2–3 onward links.
- Stays: Atlantic Villa first; À La Penthouse saved as a draft if it isn't an approved record. Details, amenities, gallery, FAQs, related links.
- Tours (Cape Peninsula first) upgraded in place: route, duration, pickups, highlights, inclusions, extra-cost tickets, vehicle options, FAQs.
- Other services (airport, helicopter, yacht, aviation, honeymoon, anniversary, proposal, security) get their own description, FAQs and tailored enquiry.
- Unknown figures say "Your concierge will confirm" — nothing invented. Approved rates, wording rules (no ownership/partner claims, Phantom flagship) kept.

## Phase 3 — Photos you manage yourself
- In admin, each vehicle/stay/tour/experience gets a gallery: upload several photos, preview, reorder, caption, alt text, choose cover, replace or remove.
- Existing photos are reused; one photo is fine; empty slots hidden. Swipe and full-screen viewing on the site, phone-sized copies for speed.

## Phase 4 — Item-aware WhatsApp enquiry
- Short date-and-party form on each page; sticky "Check availability" on mobile. Fields adapt per type (vehicle, stay, tour, airport, charter, occasion, secure transport), with "My dates are flexible".
- Date checks (no past dates, checkout after check-in, valid ranges); dates shown as "12 December 2026".
- Message built from the selections, blanks omitted, page link at the end, opened as a draft to +27 73 064 1481. "Copy enquiry" and email fallback.
- Homepage promotions, cards, related listings and the floating button use the current item.

## Phase 5 — Search, tracking and testing
- Per-page title, description, canonical, share image, breadcrumb, and item content in the first page response; sitemap includes published pages only.
- Listing views and WhatsApp handoffs measured by listing and category, with no personal trip details; existing Ads conversions unchanged.
- Test all six journeys from your brief on phone and desktop.
- Final report: URLs by category, listings missing photos/details, and exactly where in admin to add photos.

## Technical details
- New `media_galleries`-style table (item kind + id/slug, path, caption, alt, sort, is_cover) with admin-only writes, public read of published items; storage bucket reused. Existing image fields remain the fallback.
- Route params validated; unknown slug → not-found page. Legacy query redirects preserve utm/gclid/gbraid/wbraid.
- Extend `src/seo/prerenderRoutes.ts` and the image sitemap for each detail page; reuse `src/lib/whatsapp.ts` and `src/lib/enquiryTracking.ts` (reference + tracking fields).
- Message builder and date validation get unit tests.
- Restore point = current commit; revert via version history restores code; the added table is left unused (harmless) or dropped on request.
