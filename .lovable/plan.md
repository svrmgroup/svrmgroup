# Smoother site + admin modal fix

## 1. Fix "Add staff" dialog (and all admin modals with the same issue)

The Add Staff modal uses a hand-rolled overlay that centers the card vertically on desktop while the outer element handles the scroll. When the card is taller than the viewport (which it is on a laptop with dev tools open, or on a short window), the top of the card gets clipped and there is no way to scroll up to reach the "Full name" field.

Apply the same fix to the other three admin pages using the identical pattern: `AdminClients`, `AdminCalendar`, `AdminCMS`.

Fix pattern for each:
- Overlay: always top-aligned, scrollable, with generous top/bottom padding.
- Card: capped at `max-h-[calc(100vh-4rem)]`, header and footer sticky, body scrolls inside the card.
- Close on backdrop click and on `Esc`.
- Lock background scroll while the modal is open.

## 2. Faster page loads & lighter bundle

Every admin page is currently statically imported into `src/App.tsx`, so visiting the public homepage still downloads the entire admin console. Split it:

- Convert all `Admin*` route components to `React.lazy` + `Suspense` with a minimal fallback that matches the admin shell.
- Also lazy-load heavy public pages that most visitors do not open on first load: `TourBuilderPage`, `Blog`, `BlogPost`, `ClientPortal`, `Security`.
- Keep `Index`, layout, and above-the-fold components eager so the landing page still renders instantly.
- Add a route-level prefetch on hover for the primary nav links so navigation still feels instant.

## 3. Smoother scrolling & animations

- Add a global `@media (prefers-reduced-motion: reduce)` rule that disables non-essential transitions and long animations.
- Audit long-running CSS animations (marquees, hero parallax) and ensure they use `transform`/`opacity` only, with `will-change` set only while animating.
- Replace any layout-triggering hover effects (width/height/margin transitions) with `transform` equivalents.
- Ensure images have explicit `width`/`height` or `aspect-ratio` so scroll does not jump as they load, and add `loading="lazy"` + `decoding="async"` to any below-the-fold images that are missing it.

## 4. Bug & broken-interaction sweep

- Walk the public site and the admin console, capture console errors and failed network calls via Playwright, and fix any that surface (dead buttons, 404 assets, misrouted links, form submit errors).
- Verify the fixed staff modal end-to-end: open, scroll, upload photo, save, close on Esc, close on backdrop.

## Out of scope

- No backend/schema changes.
- No visual redesign — spacing and typography stay as-is; only layout/overflow bugs are corrected.
- No new features.

## Technical notes

- Modal cleanup can be extracted into a small `AdminModal` wrapper in `src/components/admin/AdminModal.tsx` so the fix is applied once and reused; each page swaps its hand-rolled overlay for `<AdminModal open={show} onClose={() => setShow(false)} title="…">…</AdminModal>`.
- Code-splitting is a mechanical `React.lazy(() => import("./pages/admin/AdminX"))` change in `src/App.tsx` plus one `<Suspense fallback={…}>` around `<Routes>` (or scoped around the admin subtree).
- Reduced-motion + animation polish lives in `src/index.css`.
- Playwright sweep runs from `/tmp/browser/` and does not add anything to the repo.
