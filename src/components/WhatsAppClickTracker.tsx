import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackWhatsAppClick } from "@/lib/whatsappAnalytics";
import { reportConversion } from "@/lib/adsConsent";
import { captureAttribution, newReference, withServiceMessage } from "@/lib/enquiryTracking";
import { getSavedLanguage } from "@/lib/siteTranslator";

/**
 * Global capture-phase click delegation for every <a href="https://wa.me/..."> in the app:
 * swaps the generic prefill for the page's service message, adds a short enquiry reference,
 * logs the tap (with consent-gated ad attribution) and fires the secondary WhatsApp conversion
 * once per tap. Also captures ad landing parameters on every navigation.
 */
const WhatsAppClickTracker = () => {
  const location = useLocation();

  useEffect(() => {
    captureAttribution(location.search, location.pathname);
  }, [location.search, location.pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (!href.includes("wa.me/")) return;
      const path = window.location.pathname;
      const reference = newReference();
      anchor.setAttribute("href", withServiceMessage(href, path, reference, getSavedLanguage()));
      const sourceLabel =
        anchor.getAttribute("data-wa-source") ||
        anchor.getAttribute("aria-label") ||
        (anchor.textContent || "").trim().slice(0, 80) ||
        null;
      trackWhatsAppClick({ sourceLabel: sourceLabel || undefined, path, reference });
      void reportConversion("whatsapp");
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true } as EventListenerOptions);
  }, []);

  return null;
};

export default WhatsAppClickTracker;
