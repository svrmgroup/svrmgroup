# Admin & Content Overhaul — Founder Edition

## 1. Founder super-admin access
- Add `salim@svrm.group` to `user_roles` as `admin` (and any higher `super_admin` role if present) via migration. Idempotent upsert keyed on the auth user id, resolved from `auth.users` by email; if the user hasn't signed up yet, insert a pending row that a signup trigger promotes on first login.
- Ensure `has_role` and every admin RLS policy already grants full CRUD — audit and patch any admin-only tables missing `admin` policies (bookings, clients, CMS, staff, suppliers, settings, email templates, activity, expenses, leads).

## 2. CMS — seed with real site content + media library
- Seed migration inserts every existing static item from `src/data/*` (tours, vehicles, stays, aviation, yachts, security, experiences, blog posts, offers, home hero/intro) into `cms_items` / `cms_tours` / `cms_vehicles` / `cms_stays` with current titles, slugs, summaries, descriptions, prices, categories and existing image URLs. Marked `published=true` so nothing changes visually until edited.
- Frontend pages (`Tours`, `Rentals`, `Stays`, `Aviation`, `Yachts`, `Security`, `CustomExperiences`, `Blog`, `Index` offers/hero/intro) switch to "CMS-first, static fallback" via `useCmsItems` so edits in admin reflect live.
- AdminCMS gets:
  - Multi-image upload (drag/drop or picker) → `cms-media` bucket, stored as `gallery_urls` array on each row.
  - Rich price editing (from/original/prefix/suffix, per-day/night/tour).
  - Inline publish/hide, sort, duplicate, delete.
  - Blog category filter tabs (Travel, Tours, Lifestyle, Properties, Insights) with per-category create.
- New **Media Library** page (`/admin/media`): grid of everything in `cms-media`, upload, copy URL, delete, filter by folder. Reusable picker component used by CMS + email templates + settings.

## 3. Editable business info (single source of truth)
- Extend `app_settings` with: `company_name`, `tagline`, `logo_url`, `email`, `phone_whatsapp`, `phone_office`, `website`, `address`, `banking_details`, `vat_number`, `registration_number`, `invoice_prefix`, `invoice_footer`, `confirmation_footer`, `thank_you_message`, `portal_expiry_days`.
- New Admin → Settings tab "Business Identity" edits all of the above. Used by invoices, confirmations, emails, client portal, footer.

## 4. Invoice + Confirmation + Thank-you PDFs (branded)
- Rebuild `src/lib/invoicePdf.ts` to match the uploaded template exactly:
  - Cream `#F8F1E4` background, centered SVRM logo watermark, gold `#D4B876` accents, dark serif headings.
  - Sections: header (logo + tagline), Invoice meta (No/Date/Booking dates), Client + Lead Organiser two-column, Package title + italic subtitle, "Package Includes" bullet list with gold dots, "Important Note" tinted callout, dark price panel (total + deposit + balance), Payment Terms, footer (email · phone · website).
- Add `generateConfirmationPdf()` — same shell, swaps price panel for confirmation summary and adds a **Thank-You** block using the editable `thank_you_message`.
- Both pull every booking field (dates, guests, package items, extras, driver, vehicle, notes, totals, deposit, balance) and every business detail from `app_settings`.
- Downloadable + auto-attached filename `SVRM-<type>-<ref>.pdf`.

## 5. Email templates (auth + transactional, editable)
- Restyle all six auth templates (signup, magic-link, recovery, invite, email-change, reauthentication) to match brand: cream body, gold CTA, serif headings, logo header, footer with editable contact info.
- Scaffold transactional email infra and create templates: `booking-confirmation`, `booking-thank-you`, `enquiry-received`, `client-portal-invite`, `change-request-received`, `payment-reminder`. Each pulls dynamic booking data + business identity from `app_settings`.
- Admin → Email Templates page becomes editable: subject + body copy overrides stored in `email_templates` table, merged into React Email components at render time. WhatsApp/phone/website tokens like `{{whatsapp}}` `{{website}}` resolve from settings.

## 6. Client portal — private expiring link
- Add `portal_token`, `portal_expires_at`, `portal_completed_at` to `manual_bookings` / `admin_bookings`. Token auto-generated on create; expiry defaults to trip end date + `portal_expiry_days`.
- Route stays at `/portal/:token` on the main site (not admin subdomain). Page shows: countdown "This private link expires on <date>", booking summary, downloadable invoice + confirmation PDFs, change-request form, WhatsApp concierge button.
- Server-side check blocks access after expiry or when `portal_completed_at` set; shows "This booking is complete — thank you" screen.
- Admin booking row shows the portal URL with copy button and "Send via Email/WhatsApp" actions using the new templates.

## 7. iPhone-app-like PWA polish
- Refresh `manifest.webmanifest` for whole site (not just `/admin`): standalone display, brand theme color, maskable icons from logo, apple-touch-icon set (180/152/120), splash screens, `apple-mobile-web-app-*` meta.
- Add iOS-style touches: safe-area padding, tap-highlight off, momentum scrolling, larger 44pt tap targets on admin, bottom-tab admin nav on mobile, page transitions, sticky headers, pull-to-refresh feel on lists.
- Install prompt banner on both public site + admin.

## 8. QA
- Regenerate a sample invoice + confirmation + thank-you PDF and visually diff vs the uploaded template.
- Send a test of each email template via the preview tool.
- Log in with founder email → verify access to every admin route.

---

## Technical notes
- Migrations: one for founder role grant, one for CMS seed, one for `app_settings` columns, one for booking portal fields.
- Storage: reuse `cms-media` bucket; add `gallery_urls text[]` to `cms_items` and legacy CMS tables.
- Types file regenerates after each migration; code that reads new columns lands in follow-up edits.
- Uploaded screenshot is used as a **layout reference only** for the PDF renderer — not embedded.

## Out of scope (ask if you want them)
- Multi-language email templates.
- Automated payment collection (Stripe/Paddle) — currently manual bank transfer per template.
- Guest-facing account/login (portal stays token-only).
