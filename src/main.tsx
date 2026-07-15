import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { registerPWA } from "./pwa/register";

// The web app can only be installed from the admin console. On /admin, inject
// the manifest, apple-touch-icon, and app-capable meta tags. Off /admin, make
// sure none of them exist so iOS/Android never offer "Add to Home Screen".
if (typeof window !== "undefined") {
  const isAdmin = window.location.pathname.startsWith("/admin");

  const ensure = (selector: string, create: () => HTMLElement) => {
    if (isAdmin) {
      if (!document.head.querySelector(selector)) document.head.appendChild(create());
    } else {
      document.head.querySelectorAll(selector).forEach((el) => el.remove());
    }
  };

  ensure('link[rel="manifest"]', () => {
    const el = document.createElement("link");
    el.rel = "manifest"; el.href = "/admin-manifest.webmanifest"; return el;
  });
  ensure('link[rel="apple-touch-icon"]', () => {
    const el = document.createElement("link");
    el.rel = "apple-touch-icon"; el.setAttribute("sizes", "180x180"); el.href = "/svrm-icon-180.png"; return el;
  });
  ensure('meta[name="apple-mobile-web-app-capable"]', () => {
    const el = document.createElement("meta");
    el.setAttribute("name", "apple-mobile-web-app-capable"); el.content = "yes"; return el;
  });
  ensure('meta[name="mobile-web-app-capable"]', () => {
    const el = document.createElement("meta");
    el.setAttribute("name", "mobile-web-app-capable"); el.content = "yes"; return el;
  });
  ensure('meta[name="apple-mobile-web-app-status-bar-style"]', () => {
    const el = document.createElement("meta");
    el.setAttribute("name", "apple-mobile-web-app-status-bar-style"); el.content = "black-translucent"; return el;
  });
  ensure('meta[name="apple-mobile-web-app-title"]', () => {
    const el = document.createElement("meta");
    el.setAttribute("name", "apple-mobile-web-app-title"); el.content = "SVRM Admin"; return el;
  });
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

registerPWA();
