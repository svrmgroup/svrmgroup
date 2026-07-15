import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { registerPWA } from "./pwa/register";
import { applyAdminInstallSignals } from "./pwa/adminInstallSignals";

// The web app can only be installed from the admin console. Strip every
// install-prompt signal off the public site; add them under /admin.
if (typeof window !== "undefined") {
  applyAdminInstallSignals(document, window.location.pathname);
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

registerPWA();
