# Phase 2 — B2B Supplier Directory

Phase 1 (logo swap + circular mark across admin) is done. Next up per the approved 10-phase roadmap: a proper global supplier directory, kept separate from the existing `suppliers` table (which is used for payouts).

## Database

New table `public.suppliers_directory`:

- `id uuid pk default gen_random_uuid()`
- `company_name text not null`
- `category` enum: `transport, accommodation, tours, yachts, aviation, security, wellness, dining, events, photography, staffing, other`
- `country text`, `city text`
- `contact_name text`, `email text`, `phone text`, `whatsapp text`, `website text`
- `services_offered text[]`
- `rate_notes text`
- `rating smallint` (1–5)
- `status` enum: `active, pending, inactive` (default `active`)
- `preferred boolean default false`
- `last_contacted_at timestamptz`
- `notes text`
- `created_by uuid references auth.users(id)`
- `created_at`, `updated_at` timestamps + `updated_at` trigger

Security:
- `GRANT SELECT, INSERT, UPDATE, DELETE ON public.suppliers_directory TO authenticated`
- `GRANT ALL ... TO service_role`
- Enable RLS
- Policies: admin-only (`has_role(auth.uid(),'admin')`) for select/insert/update/delete

## Admin page: `/admin/directory`

New route + nav entry ("Directory") in `AdminLayout` under the Growth group.

Features:
- Table view: company, category, country/city, contact, rating, preferred pin, status, last contacted
- Filters: category, country, status, rating (min), preferred-only toggle
- Full-text search across company/contact/email/services
- Add / Edit / Delete modal (form covers all fields, `services_offered` as tag input)
- Preferred-partner pin (sorts to top)
- Copy buttons for email, phone, WhatsApp
- "Log contact" button → sets `last_contacted_at = now()`
- CSV import with duplicate detection (match on email OR company_name, case-insensitive) — shows preview + skip/overwrite choice
- CSV export of the currently filtered view
- Empty / loading / error states with toasts on every Supabase call

## Technical notes

- New file: `src/pages/admin/AdminDirectory.tsx`
- Route added in `src/App.tsx` under the admin layout
- Nav link added in `src/pages/admin/AdminLayout.tsx`
- CSV parse/emit inline (no new dependencies; small parser is fine)
- Reuses existing black+gold admin theme tokens — no new styles
- Types regenerated via migration (auto-updates `src/integrations/supabase/types.ts`)

## Out of scope this phase

- Emailing suppliers directly from the directory (comes with Phase 9 templates)
- Linking suppliers to bookings / assignments (Phase 6)
- Supplier response-time metrics (Phase 10 extras)

Stopping for your review at the end of Phase 2 before starting Phase 3 (analytics + expenses overhaul).
