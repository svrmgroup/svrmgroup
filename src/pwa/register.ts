// App-shell service workers are gone: the old Workbox worker was serving
// returning visitors a stale build. `public/sw.js` is now a one-shot
// kill-switch worker that evicts itself, so nothing registers a new one here.
//
// Admin home-screen installability is unaffected — it comes from the
// admin manifest + icon meta tags (see adminInstallSignals.ts).

const VERSION_STORAGE_KEY = "svrm-build-version";
const RELOAD_QUERY_KEY = "svrm-build";

async function clearAppCaches() {
  if (!("caches" in window)) return;
  const keys = await caches.keys();
  const stale = keys.filter(
    (key) => key.startsWith("svrm-") || key.startsWith("workbox-") || key.includes("precache"),
  );
  await Promise.allSettled(stale.map((key) => caches.delete(key)));
}

async function removeLegacyWorkers() {
  if (!("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  for (const registration of registrations) {
    const url = registration.active?.scriptURL
      || registration.waiting?.scriptURL
      || registration.installing?.scriptURL
      || "";
    if (url.endsWith("/sw.js")) {
      // Fetch the same-path kill-switch and let its activate handler finish.
      await registration.update().catch(() => undefined);
    } else if (url.endsWith("/service-worker.js")) {
      await registration.unregister().catch(() => false);
    }
  }
}

function reloadCurrentBuild(version: string) {
  localStorage.setItem(VERSION_STORAGE_KEY, version);
  const url = new URL(window.location.href);
  url.searchParams.set(RELOAD_QUERY_KEY, version);
  window.location.replace(url.toString());
}

async function checkBuildVersion() {
  const response = await fetch(`/build-version.json?t=${Date.now()}`, {
    cache: "no-store",
    headers: { "Cache-Control": "no-cache" },
  });
  if (!response.ok) return;

  const payload = await response.json() as { version?: string };
  const liveVersion = payload.version;
  if (!liveVersion) return;

  const savedVersion = localStorage.getItem(VERSION_STORAGE_KEY);
  localStorage.setItem(VERSION_STORAGE_KEY, liveVersion);
  if (liveVersion === __BUILD_VERSION__ || savedVersion === liveVersion) return;

  await removeLegacyWorkers();
  await clearAppCaches();
  reloadCurrentBuild(liveVersion);
}

/**
 * Removes any leftover app-shell registration and its caches. Returning
 * browsers still holding the old worker fetch /sw.js again, receive the
 * kill-switch worker, and update to the live build.
 */
export function registerPWA() {
  if (typeof window === "undefined") return;

  void (async () => {
    try { await removeLegacyWorkers(); } catch { /* ignore */ }
    try { await clearAppCaches(); } catch { /* ignore */ }
    try { await checkBuildVersion(); } catch { /* retry on next page load */ }
  })();
}
