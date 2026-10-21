import { useEffect } from "react";
import { trackWhatsAppClick } from "@/lib/whatsappAnalytics";
import { reportConversion } from "@/lib/adsConsent";

const fireContactConversion = () => { void reportConversion("whatsapp"); };

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
