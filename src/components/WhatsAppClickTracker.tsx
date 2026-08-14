import { useEffect } from "react";
import { trackWhatsAppClick } from "@/lib/whatsappAnalytics";

/** Google Ads Contact conversion destination (AW-18245038892 / rByJCMiI39QcEKzm9PtD). */
const GADS_CONTACT_CONVERSION = "AW-18245038892/rByJCMiI39QcEKzm9PtD";

/**
 * Fire the Google Ads Contact conversion exactly once per genuine WhatsApp click.
 * Guarded so it never throws and never fires on page load / visibility — only on click.
 */
const fireContactConversion = () => {
  try {
    const gtag = (window as any).gtag;
    if (typeof gtag === "function") {
      gtag("event", "conversion", { send_to: GADS_CONTACT_CONVERSION });
    }
  } catch {
    /* tracking must never break UX */
  }
};

/**
 * Global capture-phase click delegation: any click on an <a href="https://wa.me/..."> anywhere
 * in the app is logged to Lovable Cloud and fires the Google Ads Contact conversion before
 * the browser follows the link. No per-component wiring required.
 */
const WhatsAppClickTracker = () => {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (!href.includes("wa.me/")) return;
      const sourceLabel =
        anchor.getAttribute("data-wa-source") ||
        anchor.getAttribute("aria-label") ||
        (anchor.textContent || "").trim().slice(0, 80) ||
        null;
      trackWhatsAppClick({ sourceLabel: sourceLabel || undefined });
      // Fire the Google Ads Contact conversion once for this click.
      fireContactConversion();
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true } as EventListenerOptions);
  }, []);

  return null;
};

export default WhatsAppClickTracker;
