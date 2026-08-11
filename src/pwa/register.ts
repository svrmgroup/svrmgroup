// App-shell service workers are gone: the old Workbox worker was serving
// returning visitors a stale build. `public/sw.js` is now a one-shot
// kill-switch worker that evicts itself, so nothing registers a new one here.
//
// Admin home-screen installability is unaffected — it comes from the
// admin manifest + icon meta tags (see adminInstallSignals.ts).

const LEGACY_SW_PATHS = ["/sw.js", "/service-worker.js"];

/**
 * Removes any leftover app-shell registration and its caches. Returning
 * browsers still holding the old worker fetch /sw.js again, receive the
 * kill-switch worker, and update to the live build.
 */
export function registerPWA() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  void (async () => {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) {
        const url = r.active?.scriptURL || r.waiting?.scriptURL || r.installing?.scriptURL || "";
        if (!LEGACY_SW_PATHS.some((p) => url.endsWith(p))) continue;
        // Pull /sw.js again so the kill-switch worker installs and cleans up,
        // then drop the registration outright.
        await r.update().catch(() => { /* ignore */ });
        await r.unregister().catch(() => { /* ignore */ });
      }
    } catch { /* ignore */ }

    if (!("caches" in window)) return;
    try {
      const keys = await caches.keys();
      const stale = keys.filter(
        (k) => k.startsWith("svrm-") || k.startsWith("workbox-") || k.includes("precache"),
      );
      await Promise.allSettled(stale.map((k) => caches.delete(k)));
    } catch { /* ignore */ }
  })();
}
