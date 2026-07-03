
## Goal

No sign-ups, no accounts. Every enquiry form on the site sends an email to `concierge@svrm.group` (your Gmail Workspace inbox). You reply manually from Gmail.

## What changes

1. **Drop auth emails from scope.** No sign-up/login flow is being added. The auth email templates already scaffolded stay in the repo but are unused — harmless. No user-facing auth UI.

2. **Scaffold the app-email sender** on the already-configured `info.svrm.group` domain. This creates one shared `send-transactional-email` edge function plus a branded `enquiry-notification` template (SVRM serif + champagne gold styling, matching the site).
   - From: `concierge@info.svrm.group`
   - To: `concierge@svrm.group`
   - Reply-To: the enquirer's email (so replying from Gmail goes straight to them)
   - Subject: `New enquiry · {formType} · {name}`
   - Body: all form fields, formatted cleanly.

3. **Wire every enquiry surface** to call the sender in addition to the existing WhatsApp handoff. Forms covered:
   - `EnquiryForm` (Contact page)
   - `BuySellPropertyForm`
   - `LongTermStayForm`
   - `CustomRentalRequest`
   - `CustomStayBar`
   - `WellnessCustomBuilder`
   - `TourBuilder`
   - `BookingSheet` / `RentalBookingSheet` (stay + vehicle booking requests)

   Each form gets a light validation pass (name + email or phone required) and an inline success/error state. WhatsApp button behaviour stays as-is for users who prefer that channel.

4. **Gmail delivery.** You'll need `concierge@svrm.group` to exist in your Google Workspace (either as a mailbox or an alias/group that lands in your inbox). The site sends from `info.svrm.group` so it does not conflict with Workspace MX on `svrm.group`.

## Not included

- No Twilio / WhatsApp notifications (you asked to hold on that).
- No accounts, login, password reset, or protected pages.
- No dashboard for enquiries — everything lives in your Gmail inbox.

## Technical notes

- Uses Lovable's built-in email infra already set up on `info.svrm.group`; no third-party provider or API key needed.
- Idempotency key per submission prevents duplicate emails on retry.
- `email_send_log` records each send; if a delivery ever fails I can query it for you.

## Confirm before I build

- OK to skip auth entirely and only wire enquiry → email?
- Is `concierge@svrm.group` live in your Google Workspace and landing in your Gmail inbox?
