Switch every WhatsApp link to the `wa.me/27730641481?text=<encoded>` format, and make sure the buttons that currently send generic or empty text get a message tailored to their button/context.

## Endpoint change

`src/lib/whatsapp.ts` — update `buildWhatsAppUrl`:

- Base URL becomes `https://wa.me/27730641481`.
- With a subject: `https://wa.me/27730641481?text=<encoded>`.
- Remove any `api.whatsapp.com` references (no shortlink, no `/send`).

## Per-button prefilled messages

Most call sites already pass a good subject. Fix the ones that pass nothing (`buildWhatsAppUrl()`) or a vague label so every button opens WhatsApp with a message that reflects exactly where the user clicked:

| Location | New prefilled message |
|---|---|
| `Hero.tsx` "Enquire" | "Hi SVRM, I saw your homepage and would like to learn more about your services." |
| `WhatsAppFab.tsx` (floating button, every page) | "Hi SVRM, I'd like to start a conversation." |
| `Nav.tsx` desktop + mobile WhatsApp links | "Hi SVRM, I'd like to enquire about your services." |
| `Footer.tsx` WhatsApp link | "Hi SVRM, I'd like to get in touch." |
| `ClosingCTA.tsx` "Begin on WhatsApp" | "Hi SVRM, I'd like to plan something with your concierge." |
| `Contact.tsx` WhatsApp button | "Hi SVRM, I'd like to speak with your team." |
| `PromoBar.tsx` (already good) | "Hi SVRM, I'd like to enquire about the BMW X3 self-drive special at R2,000 / day." |
| `Rentals.tsx` header WhatsApp | "Hi SVRM, I'd like to enquire about a car rental." (already good) |
| `Stays.tsx` header WhatsApp | "Hi SVRM, I'd like to enquire about a stay in Cape Town." (already good) |
| `Security.tsx` main + per-offer | Already good ("Security enquiry" / "`<name>` — security enquiry") |
| `Tours` category cards (`CategoryCard.tsx`) | Already receives a specific `enquirySubject` per tour |
| `PricingCard.tsx` fallback "Book dates" | Uses the tour's `subject` prop — already good |
| `BookingSheet.tsx`, `RentalBookingSheet.tsx` | Already build a full structured `waMessage` from user selections |
| `LongTermStayForm.tsx`, `BuySellPropertyForm.tsx`, `CustomStayBar.tsx`, `CustomRentalRequest.tsx`, `WellnessCustomBuilder.tsx`, `EnquiryForm.tsx`, `StaySearchBar.tsx` | Already build structured briefs — no change |
| `BlogPost.tsx` | Already good (post title in message) |

For the generic-subject calls (Hero, Fab, Nav, Footer, ClosingCTA, Contact) I'll pass the specific strings above so each button carries its own context.

Because `buildWhatsAppUrl` already prefixes `"Hi SVRM, I'd like to enquire about "` + subject + `"."`, I'll either:
- pass a subject that reads naturally after that prefix (simplest), or
- extend `buildWhatsAppUrl` to accept a raw full message option so buttons like the Fab / Footer read cleanly ("Hi SVRM, I'd like to start a conversation.") instead of "…enquire about I'd like to start a conversation.".

I'll add a second helper `buildWhatsAppUrlRaw(fullMessage)` so buttons needing a fully custom sentence bypass the "enquire about" template. Enquiry-style buttons keep using `buildWhatsAppUrl(subject)` as today.

## Files touched

- `src/lib/whatsapp.ts` — endpoint back to `wa.me`, add `buildWhatsAppUrlRaw` helper.
- `src/components/svrm/Hero.tsx`
- `src/components/svrm/WhatsAppFab.tsx`
- `src/components/svrm/Nav.tsx` (two links)
- `src/components/svrm/Footer.tsx`
- `src/components/svrm/ClosingCTA.tsx`
- `src/pages/Contact.tsx`

All other 15+ call sites keep working unchanged because they already pass a meaningful subject.

## Note on the earlier "API blocked" error

`wa.me` was one of the endpoints that previously showed the "API blocked" page for your number. Meta serves that page based on the phone number's WhatsApp Business API enrollment, not the URL host — `wa.me` and `api.whatsapp.com/send` are both affected the same way. If it reappears after this change, the fix has to happen inside your WhatsApp Business account (disable click-to-chat blocking / re-enable the number for direct chats). I'll implement the URL change as you asked; happy to walk through the Business Manager side if the block persists.