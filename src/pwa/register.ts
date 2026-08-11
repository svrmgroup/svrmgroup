// Guarded PWA registration. Admin-only scope.
// Registers only when the visitor is inside /admin, on the real published origin, in production.

const SW_URL = "/sw.js";
const PURGE_FLAG = "svrm-sw-purged-v1";

function shouldRefuse(): boolean {
  if (!import.meta.env.PROD) return true;
  if (typeof window === "undefined") return true;
  try { if (window.self !== window.top) return true; } catch { return true; }

  // Only register when the user is inside the admin console.
  if (!window.location.pathname.startsWith("/admin")) return true;

  const host = window.location.hostname;
  if (host.startsWith("id-preview--") || host.startsWith("preview--")) return true;
  if (host === "lovableproject.com" || host.endsWith(".lovableproject.com")) return true;
  if (host === "lovableproject-dev.com" || host.endsWith(".lovableproject-dev.com")) return true;
  if (host === "beta.lovable.dev" || host.endsWith(".beta.lovable.dev")) return true;
  if (new URL(window.location.href).searchParams.get("sw") === "off") return true;
  return false;
}

/**
 * Returning visitors can be pinned to an old build by a service worker or
 * Cache Storage entry left behind by an earlier version of the site. Remove
 * every registration + cache once, then reload so they land on the live build.
 */
async function purgeStaleRuntime(keepAdminSw: boolean) {
  if (typeof window === "undefined") return;
  let removedSomething = false;

  if ("serviceWorker" in navigator) {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) {
        const url = r.active?.scriptURL || r.installing?.scriptURL || r.waiting?.scriptURL || "";
        // On admin we keep the current admin worker; everywhere else drop all of them.
        if (keepAdminSw && url.endsWith(SW_URL)) continue;
        const ok = await r.unregister();
        removedSomething = removedSomething || ok;
      }
    } catch { /* ignore */ }
  }

  if ("caches" in window) {
    try {
      const keys = await caches.keys();
      for (const k of keys) {
        if (keepAdminSw && k.startsWith("svrm-admin")) continue;
        const ok = await caches.delete(k);
        removedSomething = removedSomething || ok;
      }
    } catch { /* ignore */ }
  }

  if (!removedSomething) return;
  try {
    if (sessionStorage.getItem(PURGE_FLAG) === "1") return;
    sessionStorage.setItem(PURGE_FLAG, "1");
  } catch { /* ignore */ }
  window.location.reload();
}

export function registerPWA() {
  if (typeof window === "undefined") return;

  if (shouldRefuse()) {
    void purgeStaleRuntime(false);
    return;
  }
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", async () => {
    // Clear anything left over from older, wider-scoped workers first.
    await purgeStaleRuntime(true);
    try {
      const reg = await navigator.serviceWorker.register(SW_URL, { scope: "/admin" });
      // Always pull the newest worker so the console never serves a stale build.
      reg.update().catch(() => { /* ignore */ });
      reg.addEventListener("updatefound", () => {
        const next = reg.installing;
        if (!next) return;
        next.addEventListener("statechange", () => {
          if (next.state === "installed" && navigator.serviceWorker.controller) {
            window.location.reload();
          }
        });
      });
    } catch { /* ignore */ }
  });
}
