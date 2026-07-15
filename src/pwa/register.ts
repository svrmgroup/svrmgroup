// Guarded PWA registration. Admin-only scope.
// Registers only when the visitor is inside /admin, on the real published origin, in production.

const SW_URL = "/sw.js";

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

async function unregisterMatching() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    for (const r of regs) {
      const url = r.active?.scriptURL || r.installing?.scriptURL || r.waiting?.scriptURL || "";
      if (url.endsWith(SW_URL)) await r.unregister();
    }
  } catch { /* ignore */ }
}

export function registerPWA() {
  if (shouldRefuse()) { void unregisterMatching(); return; }
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(SW_URL, { scope: "/admin" }).catch(() => { /* ignore */ });
  });
}
