## 1. Logo: circle only, no black square

Upload the new logo file as a Lovable Asset and replace the current `svrm-logo` pointer used by both the PDFs and the site `Logo` component.

Fix the crop so no black border ever shows:
- In `src/lib/invoicePdf.ts`, extend the existing canvas masking step (`loadLogoDataUrl`) to first auto-detect the logo's real bounding box by scanning for non-black/non-transparent pixels, then clip a circle to that box instead of the full square.
- Result: only the cream/gold circular mark is drawn on the PDF page — no dark ring, no square edge.
- Same helper is used by invoice, confirmation, and thank-you PDFs plus the live preview in Admin Settings, so all three stay consistent.
- Apply the same tight circular asset to `src/components/svrm/Logo.tsx` (nav, footer, admin) and the favicon so branding matches.

## 2. Remove the client portal concept

- Delete `src/pages/ClientPortal.tsx` and its two routes (`/portal/:token`, `/booking/:token`) from `App.tsx`.
- Remove portal UI from `AdminManualBookings.tsx`: "Copy portal link", "Mark complete" (portal wording), and the expiry/completed status line.
- Remove the "Client portal expiry (days)" field and portal wording from `AdminSettings.tsx`.
- PDFs become admin-generated only: drop the `portalToken` path from `src/lib/invoicePdf.ts` so settings are always read directly (admin session), and delete the now-unused `portal-data` edge function.
- Database columns (`client_token`, `portal_expires_at`, `portal_completed_at`) stay in place, unused — no destructive migration. Change-request table stays too; nothing writes to it from the public site anymore.

Admins keep full PDF generation for every booking (invoice / confirmation / thank-you) with the manual edit dialog before download.

## 3. Smoother website

Frontend-only performance pass, no behaviour change:
- Lazy-load the jsPDF bundle only when a PDF is actually generated (currently pulled into the admin bundle eagerly).
- Add `loading="lazy"` / `decoding="async"` and explicit dimensions to remaining gallery and card images that lack them, to stop layout shift.
- Make hero/section videos `preload="metadata"` + `playsInline` and only autoplay when in viewport, so scroll stays smooth on mobile.
- Memoise the heavy tour/stay list filtering and sorting so tab switching doesn't re-sort on every render.

## Technical notes

Files touched: `src/lib/invoicePdf.ts`, `src/components/svrm/Logo.tsx`, `src/App.tsx`, `src/pages/admin/AdminManualBookings.tsx`, `src/pages/admin/AdminSettings.tsx`, new `src/assets/svrm-logo.png.asset.json`, plus deletion of `src/pages/ClientPortal.tsx` and `supabase/functions/portal-data/`.
