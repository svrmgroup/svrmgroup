// Minimal admin-only worker: exists solely so the installed SVRM Admin app can
// display notifications via registration.showNotification (required on iOS).
// It deliberately does NOT cache anything — no offline behaviour, no app shell.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const existing = clients.find((c) => c.url.includes("/admin"));
      if (existing) return existing.focus();
      return self.clients.openWindow("/admin");
    })(),
  );
});
