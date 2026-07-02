
## Goal

Every enquiry submitted on the site (contact form, booking sheets, rental requests, custom stay/rental, tour builder, etc.) should:
1. Send an email to **concierge@svrm.group** with all details.
2. Send a **WhatsApp message** to your number (+27 73 064 1481) so you get an instant notification.

Enquiries will still be saved in the backend database as a record, but the primary delivery is now email + WhatsApp — nothing lives only in "Lovable storage".

## How it will work

```text
User submits form
      │
      ▼
Edge Function: notify-enquiry
      │
      ├──► Save row to database (audit trail)
      ├──► Send email → concierge@svrm.group  (via Lovable Emails)
      └──► Send WhatsApp → +27 73 064 1481    (via Twilio WhatsApp)
```

## Steps

1. **Email domain setup**
   - Configure `svrm.group` as a verified sender domain so `concierge@svrm.group` can send/receive transactional email from the app. You'll add a few DNS records (I'll guide you through the dialog).

2. **WhatsApp channel**
   - Connect **Twilio** (recommended) with a WhatsApp-enabled sender. You'll need a Twilio account and to enable WhatsApp on a number. I'll request the API credentials via the secure secrets form once you confirm.
   - Alternative: skip WhatsApp notifications and just use email if you'd rather not set up Twilio yet.

3. **Backend edge function `notify-enquiry`**
   - Accepts submissions from the site.
   - Inserts row into the existing `enquiries` / `rental_requests` tables (kept as backup log).
   - Sends a formatted email to `concierge@svrm.group` with subject like `New enquiry — {subject} from {name}` and full details (name, email, phone, message, source page, extras, dates, vehicle, etc.).
   - Sends a short WhatsApp message like:  
     `New SVRM enquiry · Tours · John Smith · +44… · "Looking for 3-day Garden Route" · sent from /tours`
   - Replies with success/failure to the frontend.

4. **Frontend wiring**
   - Update `EnquiryForm`, `BookingSheet`, `RentalBookingSheet`, `CustomStayBar`, `CustomRentalRequest`, `LongTermStayForm`, `BuySellPropertyForm`, `TourBuilder`, `WellnessCustomBuilder` to call the new edge function instead of writing directly to the database.
   - Keep the same UX (toast success, WhatsApp fallback button, thank-you state).

5. **Confirmation**
   - Send a test enquiry and verify: email lands in `concierge@svrm.group` inbox, WhatsApp notification arrives on your phone, row is still saved as backup.

## What I need from you before building

1. Confirm you want to proceed with **Twilio for WhatsApp** (you'll need an account + WhatsApp sender). Say **"skip WhatsApp"** if you'd rather have email only for now.
2. Confirm sender address — I'll use `concierge@svrm.group` as both the **from** and **to** address (so replies go back to you). OK?
