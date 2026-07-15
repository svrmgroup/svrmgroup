## Fix broken images across Journal and other pages

### Root cause
The CMS `cms_items.image_url` column holds Vite build-hashed paths like `/assets/bmwx3-C_Rrjik6.jpg` — captured when `cmsSeed` last ran. Those hashes change on every rebuild, so the URLs are permanently stale. This breaks:
- Journal (`/blog`) — CMS-backed blog cards
- Home Offers (`bmwx3`, `romantic`, `svc-travel-sclass`, `svc-exp-safari`, `svc-stays-villa`)
- Security cards (`close-protection`)

Static blog posts (from `src/data/blog.ts`) render fine because their imports are re-hashed at each build; only the DB-persisted copies are broken.

Additionally, `Blog.tsx` maps CMS entries with `image: c.image_url || ""`, so any CMS blog without an image gets an empty `src` (which resolves to the page URL and shows broken).

### Fix

1. **Upload the seed images to the Lovable CDN** so they get permanent immutable URLs:
   - `src/assets/vehicles/bmwx3.jpg`
   - `src/assets/tours/romantic.jpg`
   - `src/assets/svc-travel-sclass.jpg`
   - `src/assets/svc-exp-safari.jpg`
   - `src/assets/svc-stays-villa.jpg`
   - `src/assets/svc-stays-penthouse.jpg`
   - `src/assets/svc-tours-adventure.jpg`
   - `src/assets/svc-lifestyle-wellness.jpg`
   - `src/assets/svc-stays-estate.jpg`
   - `src/assets/svc-lifestyle-shopping.jpg`
   - `src/assets/close-protection.jpg` (if present in security data)
   
   Each becomes a `.asset.json` pointer with a stable `/__l5e/assets-v1/...` URL. Keep the source `.jpg` in the repo (still needed for the static pages that don't read from CMS).

2. **Update `src/lib/cmsSeed.ts`** to import the `.asset.json` pointers and seed rows with `image_url: <pointer>.url`. This replaces the hashed-bundle strings with permanent URLs. Also seed the blog images from stable pointers for the CMS-mirrored blog posts.

3. **Auto-heal stale rows** on next resync: `cmsSeed` will `upsert` in "upsert" mode, so re-running the existing "Resync CMS" button in Admin → CMS overwrites broken URLs. Additionally, run a one-off SQL update to clear known-stale `/assets/*-<hash>.jpg` values so a fresh seed replaces them.

4. **Guard against empty images in `Blog.tsx`**:
   - Change `image: c.image_url || ""` → fall back to a stable placeholder pointer.
   - `SmartImage` already handles undefined gracefully via shimmer, but we'll also render nothing (no `<img>`) when there is truly no URL, so the card doesn't show a broken icon.

5. **Same fallback in `BlogPost.tsx`** for the hero image and related-post thumbnails.

### Out of scope
- Not touching the CDN pointers already used for stays galleries (they work in production; the local dev preview shows them as "text/html" only because dev doesn't proxy `/__l5e/`, which is a dev-only display artefact, not a real bug).
- No schema changes.
- No changes to the actual site copy or layout.

### Verification
- Re-run the resync from Admin → CMS (or the DB update from step 3).
- Check `/blog`, `/`, `/security`, and any page that reads from `cms_items` for `naturalWidth === 0` images via Playwright against the deployed preview URL.