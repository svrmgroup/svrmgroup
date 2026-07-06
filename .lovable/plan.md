## Plan: Admin PWA + Full Operations Suite

Turn the admin console into an installable iPhone home-screen app with offline support and notifications, and add the operational modules a rental business actually runs on: money in/out, who to pay, what to do next, and paperwork.

### 1. iPhone Web App (PWA)

- Add a web manifest scoped to `/admin` — name "SVRM Admin", standalone display, brand theme color, `start_url: /admin`.
- Generate iOS-friendly app icons (180×180 apple-touch-icon + 192/512 maskable) with the SVRM mark.
- Add iOS meta tags (`apple-mobile-web-app-capable`, status bar style, splash color) so it opens fullscreen when launched from the Home Screen.
- Install `vite-plugin-pwa` with `generateSW` and a guarded registration wrapper (skips Lovable preview/iframe/dev per PWA rules). HTML uses NetworkFirst, hashed assets CacheFirst. `/~oauth` excluded.
- Add an "Install to iPhone" helper card on the admin login screen with a one-time Safari instruction (Share → Add to Home Screen).
- Notifications:
  - Realtime subscribe (Supabase realtime) to inserts on `enquiries`, `rental_requests`, `manual_bookings` while the admin app is open → toast + native `Notification` (permission requested on first admin login).
  - True background web push (iOS 16.4+ home-screen install required) needs VAPID keys and a push edge function — noted as phase 2; not shipped in this round to keep scope tight.

### 2. Spend Tracking + Full P&L

New table `expenses`:
- `date`, `category` (fuel, cleaning, supplier payout, marketing, staff, other), `amount`, `currency`, `note`, optional `manual_booking_id`, `receipt_url`, `created_by`.

New admin page `/admin/expenses`:
- Quick-add form (date, category, amount, note, optional booking link, optional receipt upload → Supabase storage bucket `receipts`).
- Filterable ledger table + CSV export.
- Monthly total + category donut chart.

New admin page `/admin/pnl`:
- Month picker + currency toggle.
- Rows: Revenue (sum of `manual_bookings.subtotal` for month), Expenses (sum by category), Net Profit, Margin %.
- Per-booking profit view: booking revenue − linked expenses.
- CSV export.

### 3. Suppliers & Payouts

Two tables:
- `suppliers` (name, category [owner/driver/guide/cleaner/other], phone, email, notes, whatsapp).
- `supplier_payouts` (supplier_id, optional manual_booking_id, amount, currency, due_date, status [pending/paid], paid_at, note).

New admin page `/admin/suppliers`:
- Supplier list with running balance owed.
- Click supplier → detail with payout history, add-payout form, mark-paid, one-click WhatsApp to supplier.

### 4. Tasks / Checklist

New table `booking_tasks`:
- optional `manual_booking_id`, optional `admin_booking_id`, `title`, `due_date`, `status` [todo/doing/done], `assignee`, `notes`.

New admin page `/admin/tasks`:
- Today / Upcoming / Overdue columns.
- Quick-add task, filter by booking, mark done.
- When creating a manual booking, auto-seed default tasks (Confirm deposit, Prepare check-in, Handover keys, Check-out inspection).

### 5. Invoices / Receipts (PDF)

- Install `jspdf` + `jspdf-autotable`.
- On any manual booking row, add a "Download PDF" and "Send PDF via WhatsApp" button.
- Branded template: SVRM logo, booking code, client, line items table, deposit / balance / total, payment terms footer, contact block.
- PDF generated client-side; WhatsApp share opens `wa.me/<phone>?text=<message with public link>` (Phase 2 note: hosting the PDF requires a storage bucket step — for now, PDF downloads locally and admin sends manually).

### 6. Admin Navigation

Refresh `AdminLayout` sidebar with grouped sections:
- Overview: Analytics
- Bookings: Enquiries, Rental Requests, Manual Bookings, Calendar
- Money: Expenses, P&L, Suppliers
- Growth: Leads, WhatsApp
- Operations: Tasks

Header gets install-app hint on iOS Safari.

### Technical notes

- Migrations run first (four tables + storage bucket `receipts` + RLS admin-only via `has_role`).
- `vite-plugin-pwa` config: `registerType: 'autoUpdate'`, `injectRegister: null`, guarded wrapper in `src/pwa/register.ts`.
- Manifest served from `public/manifest.webmanifest`. Head tags added in `index.html`.
- Realtime notifications: `supabase.channel(...).on('postgres_changes', ...)` mounted inside `AdminLayout`.
- PDF template lives in `src/lib/invoicePdf.ts`.
- iOS push (VAPID + edge push function + `web-push` subscription table) is deferred to a follow-up because it needs the app installed to the Home Screen first and adds ~300 lines of infra; called out here so it's not silently dropped.

### Out of scope (this round)

- True background web push (needs VAPID setup + push edge function; foreground realtime notifications work today).
- Multi-currency FX conversion inside P&L (currency toggle filters; no auto-conversion).
- Hosting invoice PDFs on a public URL (local download only; WhatsApp share sends message text, admin attaches PDF).
