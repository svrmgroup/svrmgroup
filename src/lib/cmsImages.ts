// Utilities to resolve image URLs coming out of the CMS.
//
// Historical bug: `cmsSeed` used to persist Vite-hashed bundle paths like
// `/assets/bmwx3-C_Rrjik6.jpg` into `cms_items.image_url`. Those hashes change
// on every rebuild, so any DB row seeded from an old build points at a URL
// that no longer exists. `isStaleAssetUrl` detects that shape and
// `resolveImage` falls back to a stable static import when we see one.

/**
 * True when the URL looks like a stale bundler-hashed asset path
 * (e.g. `/assets/bmwx3-C_Rrjik6.jpg`) that will not resolve in the current
 * build. Absolute URLs (http, //, data:, blob:) and CDN pointers
 * (`/__l5e/...`) are always considered fine.
 */
export function isStaleAssetUrl(url: string | null | undefined): boolean {
  if (!url) return true;
  const u = url.trim();
  if (!u) return true;
  if (u.startsWith("http://") || u.startsWith("https://")) return false;
  if (u.startsWith("//") || u.startsWith("data:") || u.startsWith("blob:")) return false;
  if (u.startsWith("/__l5e/")) return false;
  // /assets/<name>-<hash>.<ext> — the Vite build output pattern.
  return /^\/assets\/[^/]+-[A-Za-z0-9_-]{6,}\.[a-z0-9]+$/i.test(u);
}

/**
 * Return the CMS URL when it looks stable, otherwise the provided fallback.
 * Pass `undefined` for the fallback to opt out of rendering an <img> at all.
 */
export function resolveImage(
  url: string | null | undefined,
  fallback?: string,
): string | undefined {
  if (isStaleAssetUrl(url)) return fallback;
  return url ?? fallback;
}
