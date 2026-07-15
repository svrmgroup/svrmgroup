## Simplify client portal change requests

Replace the structured change-request form (guests, pickup, new start/end dates, notes) with a single free-form message field, since every booking is different and preset fields don't fit all cases.

### Changes
- **`src/pages/ClientPortal.tsx`**
  - Remove the `guests`, `start_date`, `end_date`, `pickup` inputs.
  - Keep one large textarea labeled "What would you like to change?" (required, max ~2000 chars).
  - On submit, insert into `booking_change_requests` with `message` set to the free-form text and `changes` as an empty object (kept for schema compatibility).
  - Keep existing success/expired/completed states, WhatsApp fallback, and toast messaging.

### Admin side
- No schema change needed — `booking_change_requests.message` already exists and is displayed in `AdminChangeRequests`.
- Confirm the admin view surfaces `message` prominently (quick read to verify; no code change expected).

### Out of scope
- No database migration.
- No changes to PDFs, staff assignment, or other portal sections.