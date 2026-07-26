// Imported into the generated service worker (see vite.config.ts workbox.importScripts).
// Handles clicks on SVRM admin notifications: focus an open admin tab, or open one.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.href) || "/admin";
  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const existing = clients.find((c) => c.url.includes("/admin"));
      if (existing) {
        await existing.focus();
        if ("navigate" in existing) { try { await existing.navigate(target); } catch (e) { /* ignore */ } }
        return;
      }
      await self.clients.openWindow(target);
    })(),
  );
});
