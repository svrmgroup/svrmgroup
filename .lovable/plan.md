# SVRM Admin Console — Full Rebuild Plan

Scope is the `/admin` section only. Public site stays as-is except for removing the site-wide PWA install prompt (phase 4). Brand palette sampled from your logo: cream `#F5E6C8`, gold `#C9A961`, deep charcoal `#1F1B18`, ink black `#0A0A0A`. Logo is used as a bare circle (no square card/border) everywhere in admin. Email: Lovable built-in.

Delivery: 10 phases, pausing after each for your review.

---

## Phase 1 — Stabilize existing admin + logo/brand pass

- Audit every `/admin/*` route: fix broken links, dead buttons, forms that don't persist, unresolved spinners, blank error states.
- Harden auth: unauthenticated → `/admin/login`, session-expiry warning toast, `has_role('admin')` guard on every route.
- Standardize error handling: every Supabase call surfaces a toast on failure; no silent fails.
- Replace admin logo usage with bare circular SVRM mark (no square ring/border), sourced from the uploaded logo.
- Apply black+gold admin theme (dark sidebar `#0A0A0A`, gold `#C9A961` active states, cream text).

## Phase 2 — Global B2B Supplier Directory

New `suppliers_directory` table (kept separate from existing `suppliers` used for payouts):
`company_name, category (enum), country, city, contact_name, email, phone, whatsapp, website, services_offered (text[]), rate_notes, rating (1–5), status (active/pending/inactive), preferred (bool), last_contacted_at, notes, created_by`.

`/admin/directory` page: table with filters (category, country, status, rating), full-text search, add/edit/delete modal, CSV import (with duplicate detection on email + company), CSV export, copy buttons for email/phone/WhatsApp, "Log contact" button, preferred-partner pinning.

## Phase 3 — Analytics + expenses overhaul (all-time capable)

- Date range picker on `/admin` analytics: Today, 7d, 30d, Quarter, Year, **All Time (default)**, Custom.
- Charts: bookings/requests by category, revenue vs expenses over time, clients by country/source, top suppliers by referral count, avg request-to-fulfillment time.
- Confirm/extend `expenses` schema to include `supplier_id` and `currency`; add filterable all-time view.
- Net profit (revenue − expenses) computed for the selected range.
- Export current view as CSV and PDF.

## Phase 4 — PWA scoped to admin only

- Remove `manifest.webmanifest` link + PWA registration from public routes.
- Register service worker only when `location.pathname.startsWith('/admin')`.
- Manifest `scope: /admin`, `start_url: /admin`.
- Public visitors never see "Add to Home Screen".

## Phase 5 — Staff profiles (drivers & concierge)

New `staff` table: `full_name, role (driver/concierge/both), photo_url, phone, whatsapp, email, status, license_number, pdp_expiry_date, assigned_vehicle_id, languages_spoken[], specialties[], notes`.

`/admin/staff` page: list + add/edit/deactivate with photo upload to `staff-photos` bucket. Per-staff schedule view. Dashboard widget for PDP/license expiries within 30 days.

## Phase 6 — Job assignment on bookings

- `booking_assignments` table linking bookings ↔ staff with status pipeline: unassigned → assigned → confirmed → en_route/in_progress → completed.
- Assign 1+ staff per booking; overlap detection warns before double-booking.
- Auto-notify staff via email (+ WhatsApp deep-link) on assignment using phase-9 templates.
- Day/week roster view showing all staff jobs side by side.

## Phase 7 — Branded PDF documents

- Refresh existing `invoicePdf.ts` to match new brand (circular logo, cream/gold/charcoal, premium layout).
- Add booking-confirmation PDF generator (auto-created on status → confirmed).
- Sequential invoice numbering, VAT support, itemized lines, bank details, payment instructions.
- PDFs downloadable and attachable to outgoing emails from admin.

## Phase 8 — Client booking portal + change requests

- Public route `svrm.group/booking/:token` (long random UUID token stored on booking).
- Branded thank-you page: client name, service, date/time, location, reference, no login required.
- "Request a change" form: guests, date/time, pickup, free-text notes.
- New `booking_change_requests` table with old/new value diff, status.
- Admin notifications page shows pending change requests in real-time.
- Approve → auto-updates booking + re-issues confirmation. Decline → templated email back to client.
- Full change-request history per booking. Read-only view after service date.

## Phase 9 — Transactional email templates (Lovable built-in)

Editable templates stored in `email_templates` table (subject + body with `{{placeholders}}`), managed from `/admin/settings/emails`:

- Booking confirmation (with PDF)
- Invoice sent (with PDF)
- Payment received / overdue reminder
- Staff job assignment (internal)
- New inquiry / quote response
- Welcome
- Change request received (internal)
- Change request approved / declined

Uses Lovable's transactional email infrastructure. Same circular-logo + black/gold styling as the PDFs.

## Phase 10 — Remaining admin pages: Clients CRM, CMS (hybrid), Users & roles, Activity log, Settings, Invoicing

- **Clients CRM** — every public inquiry lands as a client/lead automatically; profiles, contact history, VIP flag, past bookings.
- **CMS (hybrid)** — keep `src/data/*.ts` catalogs, add DB tables `cms_tours`, `cms_vehicles`, `cms_stays` that merge in at runtime; admin can add/edit/hide listings and upload photos.
- **Users & roles** — extend `user_roles` with `super_admin`, `ops_manager`, `viewer`; role-gated routes.
- **Activity log** — audit table populated by triggers on major tables.
- **Invoicing/Payments** — status pipeline + linkage to bookings.
- **Settings** — company details, brand assets, integration keys via secure secrets.
- **Extras** — lead source tracking, document storage bucket per client (passports/NDAs) with restricted access, multi-currency handling, supplier response-time metrics.

---

## Technical notes

- All new tables get `GRANT` + RLS + `has_role(auth.uid(),'admin')` policies + `updated_at` triggers, per project convention.
- File uploads (staff photos, client docs, receipts) go to dedicated Supabase Storage buckets with RLS.
- Realtime already wired via `useAdminNotifications`; extended to cover change requests + assignments.
- PDF generation stays client-side with `jspdf` (already installed).
- No new dependencies unless required (recharts + jspdf already present).
- Phase order matches your requested numbering; I will stop and wait for your OK after each phase before starting the next.

---

## Out of scope this build

- True background web push (needs VAPID + push edge function; foreground realtime works today).
- Hosting invoice PDFs on public URLs (local download + email attachment only).
- Migrating public site styling — only admin gets restyled.
