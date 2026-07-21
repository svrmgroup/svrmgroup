## Goal

Make the WhatsApp entry point instantly recognizable and readable against any hero image or background, without changing link logic or per-page messages.

## Changes

### 1. Floating WhatsApp button — `src/components/svrm/WhatsAppFab.tsx`

- Replace the current `MessageCircle` (generic chat) with the official WhatsApp glyph as an inline SVG (speech bubble + handset), so it's unmistakably WhatsApp at small sizes. Keep the palette gold-on-black (not WhatsApp green).
- Solid background fill `#1A1613` (black), gold icon `#C9A961`, thin `1px` gold border at ~60% opacity.
- Size: `h-14 w-14` (56px) on desktop, `h-12 w-12` (48px) on mobile.
- Soft drop shadow: `shadow-[0_10px_30px_-8px_rgba(0,0,0,0.55)]` plus a subtle gold glow ring on hover, so it lifts off busy photo backgrounds.
- Keep fixed `bottom-6 right-6`, `z-40`, `target="_blank"`, and continue using `whatsappUrlFor(pathname)` — link behavior unchanged.
- Desktop-only "Chat with us" pill label:
  - Rendered to the left of the button, Jost font, gold text on black pill matching the FAB style.
  - Shown on first render, auto-hides after 3.5s or on first `scroll` event (whichever comes first).
  - Hidden on mobile (`hidden md:flex`).
  - Uses `prefers-reduced-motion` to skip the fade transition.
  - No persistence — appears once per page load, no localStorage flag.

### 2. Nav bar WhatsApp icon — `src/components/svrm/Nav.tsx`

- Add a dedicated WhatsApp icon button next to the EN / ZAR / ENQUIRE cluster (desktop) — currently there is no WhatsApp icon in the nav, only the text "Enquire" link.
- Same solid-black circular chip with gold WhatsApp glyph and thin gold border, sized to match sibling controls (approx `h-9 w-9`), so it reads as strongly as EN / ZAR / ENQUIRE.
- Uses the same `waHref` already computed in `Nav.tsx`, `target="_blank"`, `aria-label="Chat with SVRM on WhatsApp"`.
- Keep the existing text "Enquire" link untouched — the icon is an additional, obvious tap target.
- Mobile sheet's "Enquire on WhatsApp" CTA stays as-is (already high-contrast inside the sheet).

### 3. Shared WhatsApp glyph — `src/components/svrm/WhatsAppGlyph.tsx` (new)

- Small reusable SVG component for the official WhatsApp mark (speech bubble + handset), colored via `currentColor` so both FAB and nav icon reuse it.
- Accepts `className` and `size` props; default `strokeWidth`/fill tuned for legibility at 20-28px.

## Out of scope

- No changes to `src/lib/whatsappMessages.ts` or route mappings.
- No changes to the "Enquire" text link, footer CTAs, or any other page CTAs.
- No changes to hero images, homepage layout, or z-index of other overlays.

## Verification

- Load `/` (light-sky hero) and confirm FAB reads clearly with gold-on-black + shadow.
- Load `/tours/aquila-safari` (dark hero) and `/rentals` (mixed) and confirm same clarity.
- Confirm "Chat with us" label appears on desktop, disappears after ~3.5s or on scroll, and never appears on mobile.
- Confirm nav WhatsApp icon is visible on desktop next to EN / ZAR / ENQUIRE at the same visual weight.
- Confirm `href` still resolves to the correct per-page message via `whatsappUrlFor`.
