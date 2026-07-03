Revert `buildWhatsAppUrl` in `src/lib/whatsapp.ts` to use the phone-number API endpoint so every button opens WhatsApp with a context-specific pre-typed message.

## What changes

- `buildWhatsAppUrl(subject?)` returns:
  - No subject → `https://api.whatsapp.com/send?phone=27730641481`
  - With subject → `https://api.whatsapp.com/send?phone=27730641481&text=Hi%20SVRM%2C%20I'd%20like%20to%20enquire%20about%20<subject>.`
- Remove the `WHATSAPP_SHORTLINK` constant (no longer used).
- All existing callers (Hero, PromoBar, WhatsAppFab, ClosingCTA, BuySellPropertyForm, LongTermStayForm, CategoryCard, etc.) already pass meaningful subjects, so prefill will work everywhere automatically — no component edits needed.

## Files touched

- `src/lib/whatsapp.ts` — single-file change.

## Note

The `api.whatsapp.com/send` endpoint is functionally equivalent to `wa.me` but avoids the "API blocked" landing page you saw earlier.