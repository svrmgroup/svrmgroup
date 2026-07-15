import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { registerPWA } from "./pwa/register";

// Inject the PWA manifest based on the current path so installs from /admin
// launch into the admin dashboard, while public installs open the main site.
if (typeof window !== "undefined" && !document.querySelector('link[rel="manifest"]')) {
  const isAdmin = window.location.pathname.startsWith("/admin");
  const link = document.createElement("link");
  link.rel = "manifest";
  link.href = isAdmin ? "/admin-manifest.webmanifest" : "/manifest.webmanifest";
  document.head.appendChild(link);
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

registerPWA();
