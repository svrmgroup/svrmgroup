## What's wrong / what's missing (verified)

1. **PDF logo is a plain "SVRM" circle.** The company settings record has `logo_url` pointing at a file in the private `cms-media` bucket. Fetching that URL returns HTTP 400, so the PDF renderer silently falls back to drawing a gold circle with the word "SVRM". The bundled circular logo asset is fine — it's simply never used because the broken settings URL takes priority.
2. **Notifications** already exist as a live subscription (enquiries, rental requests, manual bookings are all broadcasting), but they only appear as a toast in whatever tab is open, and the browser permission is requested without a user gesture — so on most browsers/iPhone it is never actually granted. There is no notification history or bell.
3. **P&L is month-only** — the picker forces a single calendar month, no all-time view.
4. **No quotation PDF** anywhere — only invoice, confirmation, and thank-you variants exist.

## Plan

### 1. Logo on every PDF
- Make the PDF logo loader resilient: try the settings logo, and if it fails to load (private bucket, 404, CORS), automatically fall back to the bundled SVRM circular logo instead of the "SVRM" text circle. The text monogram becomes a last resort that should never be hit.
- Clear the broken `logo_url` in company settings so the correct bundled circular mark is used immediately.
- In Company settings, show a live "logo loaded / could not load" indicator next to the logo field, and make logo uploads go to a publicly readable path so a future upload can't silently break PDFs again.
- Same loader powers invoice, confirmation, thank-you, quotation and the live preview, so all PDFs stay identical.

### 2. Pop-up notifications in the admin console
- Add a bell in the admin header with an unread count, a dropdown list of recent events (enquiry, rental request, manual booking, change request), click-through to the relevant record, and mark-all-read. History persists in local storage so it survives reloads.
- Add an explicit "Enable pop-up notifications" button (a real user gesture, required by Safari/iOS) that requests permission and confirms status; keep the quiet toast for in-tab events.
- Add an optional short chime on new enquiries, toggleable.
- When the admin app is installed to the home screen, register a small service worker so notifications can be shown via the service worker registration (needed for iOS installed PWAs).

### 3. All-time P&L
- Add a period selector: This month / Last month / This quarter / Year to date / All time / Custom range.
- All time drops the date filters entirely; totals, expenses-by-category, per-booking table and the CSV export all follow the selected period, and the CSV filename reflects it.

### 4. Quotation PDF
- Add a `quotation` variant to the PDF renderer: same branding and layout as the invoice, headed "QUOTATION", with quote number, issue date, validity period ("valid for 14 days"), line items and totals, and no bank/deposit payment block (configurable quotation footer in Company settings).
- Add a "Quotation" action on manual bookings (alongside the existing invoice/confirmation buttons) that opens the existing manual PDF editor first, so you can adjust client details, line items and concierge before downloading.
- Add "Send to client" for quotations: generate the PDF and either attach it to the existing email flow or hand off to WhatsApp with a pre-filled message plus a downloaded file to attach.
- Quotations are also available directly from an enquiry, so a quote can be produced without first creating a full booking.

## Technical notes
- Files touched: `src/lib/invoicePdf.ts` (logo fallback chain + quotation variant), `src/pages/admin/AdminLayout.tsx` + `src/hooks/useAdminNotifications.tsx` (bell, history, permission gesture, sound), new `src/components/admin/NotificationBell.tsx`, `src/pages/admin/AdminPnL.tsx` (period selector), `src/pages/admin/AdminManualBookings.tsx` and `AdminEnquiries.tsx` (quotation actions), `src/pages/admin/AdminSettings.tsx` (logo status, quotation footer), plus a small admin service worker in `public/`.
- One data update to clear the broken settings logo URL; one migration only if a `quotation_footer` settings column is added.
