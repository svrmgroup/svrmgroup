import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { registerPWA } from "./pwa/register";

// Inject the PWA manifest only for admin visitors so the public site never
// shows "Add to Home Screen" or gets a service worker.
if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
  const link = document.createElement("link");
  link.rel = "manifest";
  link.href = "/manifest.webmanifest";
  document.head.appendChild(link);
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

registerPWA();
