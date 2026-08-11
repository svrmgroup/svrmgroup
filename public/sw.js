// KILL-SWITCH SERVICE WORKER
// Replaces the previous Workbox app-shell worker that was pinning returning
// visitors (e.g. Safari) to an old cached build. It deletes this app's own
// caches, reloads open tabs, then unregisters itself. Other workers
// (notify-sw.js) and their caches are left untouched.

const APP_CACHES = ["svrm-pages", "svrm-assets", "svrm-images"];

function isWorkboxCacheForThisRegistration(name) {
  const hasWorkboxBucket = /(^|-)precache-v\d+-|(^|-)runtime-|(^|-)googleAnalytics-/.test(name);
  return hasWorkboxBucket && name.endsWith(self.registration.scope);
}

function isAppCache(name) {
  return APP_CACHES.includes(name) || isWorkboxCacheForThisRegistration(name);
}

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        await Promise.allSettled(cacheNames.filter(isAppCache).map((name) => caches.delete(name)));
        await self.clients.claim();
        const windowClients = await self.clients.matchAll({ type: "window" });
        await Promise.allSettled(windowClients.map((client) => client.navigate(client.url)));
      } finally {
        await self.registration.unregister();
      }
    })(),
  ),
);
