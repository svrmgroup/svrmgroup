import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { registerPWA } from "./pwa/register";

// Only expose the PWA manifest on /admin routes so the web app can be
// installed from the admin dashboard — the public site is not installable.
if (typeof window !== "undefined") {
  const isAdmin = window.location.pathname.startsWith("/admin");
  const existing = document.querySelector('link[rel="manifest"]');
  if (isAdmin && !existing) {
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = "/admin-manifest.webmanifest";
    document.head.appendChild(link);
  } else if (!isAdmin && existing) {
    existing.remove();
  }
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

registerPWA();
