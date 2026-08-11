# Edit manual bookings + track amount paid

## What you get

1. **Edit any existing booking** — open a booking in Manual Bookings and click Edit to change client details, dates, line items and prices, deposit, currency and notes. Totals recalculate and save back to the booking (the confirmation message regenerates too).
2. **Amount paid field** — each booking stores how much the client has actually paid. Balance = total minus amount paid, updated automatically.
3. **Paid-in-full on invoices** — when the amount paid covers the total, the invoice PDF shows a "PAID IN FULL" stamp instead of deposit/balance lines. Partial payments show "Amount paid" and the remaining balance. Nothing paid keeps today's deposit wording.
4. The PDF editor dialog gets an "Amount paid" field so you can override it per document before downloading.

## Technical notes

- **Database**: add `amount_paid numeric not null default 0` to `manual_bookings` (migration).
- **`src/pages/admin/AdminManualBookings.tsx`**: reuse the existing create form as an edit form (`editingId` state) prefilled from the row; on save `update()` the row plus regenerate `confirmation_message`. Add an Amount paid input in both create and edit, and display Paid / Balance in the expanded row summary. Balance derives as `max(0, subtotal - amount_paid)`.
- **`src/lib/invoicePdf.ts`**: extend `InvoiceBooking` with `amount_paid`. In the dark price panel for `kind === "invoice"`: if `amount_paid >= subtotal` render a gold "PAID IN FULL" badge and hide deposit/balance; else render `Amount paid` and `Remaining balance`. Quotation and thank-you output unchanged.
- **`src/components/svrm/PdfEditorDialog.tsx`**: add Amount paid next to Deposit / Balance, feeding the same payload.
- **`src/lib/confirmationMessage.ts`**: if fully paid, replace the deposit/balance lines with a "Paid in full — thank you" line.
