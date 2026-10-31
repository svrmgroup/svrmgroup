# Phone required, email optional + send PDFs to WhatsApp

## 1. Phone number required on every enquiry
Applies to every public form: general enquiry, chauffeur/booking sheet, airport transfers, rentals booking + custom rental request, stays (long-term, custom stay, buy/sell property, property management), tours, security, wellness builder, AI itinerary planner.
- Phone field marked required (with country code), clear "Phone / WhatsApp number required" message, blocks submit if empty or too short.
- Email label becomes "Email (optional)"; still checked for a valid format if typed.

## 2. Saving enquiries without an email
- Enquiries and rental requests can be saved with no email; phone becomes required at the database level for new entries (old entries untouched).
- The admin Contacts list matches people by email when given, otherwise by phone number, so repeat enquirers still merge and country is still detected from the phone.
- Admin screens that show/email clients handle a missing email gracefully (email button hidden, WhatsApp shown).

## 3. Send PDFs to the client's WhatsApp from the admin (iPhone)
- Wherever a PDF is created (invoices, quotes, booking confirmations, thank-you letters, rental agreements, itineraries), add a "Send via WhatsApp" button.
- On your iPhone admin app this opens the iPhone share sheet with the PDF attached, so you choose WhatsApp and the client's chat — the PDF goes from your own phone's WhatsApp.
- A short message with the client's name and booking code is copied alongside. If the share sheet isn't available (e.g. desktop), it downloads the PDF and opens WhatsApp chat to the client's number instead.
- Note: WhatsApp doesn't allow a website to drop a file directly into a specific chat, so you'll tap the client's name once in WhatsApp.

## Technical details
- Migration: `enquiries.email` and `rental_requests.email` DROP NOT NULL; add CHECK `phone is not null and length(trim(phone))>=7` as NOT VALID; contacts.email nullable, add unique index on normalized phone, update `upsert_contact_from_enquiry()` to match by email else phone.
- Zod schemas in each form: phone required, email `.optional().or(z.literal(""))`; insert `null` for blank email.
- New `src/lib/sharePdf.ts`: `navigator.canShare({files})` + `navigator.share` with File from the generated jsPDF blob; fallback download + `wa.me/<digits>?text=`. Wire into `PdfEditorDialog`, `AdminManualBookings`, `RentalAgreementDialog`, itinerary PDF actions.
- Add a test for the phone-required / email-optional schema rule.
