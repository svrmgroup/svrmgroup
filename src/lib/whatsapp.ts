// Single source of truth for SVRM contact endpoints.
export const WHATSAPP_NUMBER = "27730641481";
export const WHATSAPP_DISPLAY_NUMBER = "+27 73 064 1481";
export const CONCIERGE_EMAIL = "concierge@svrm.group";
export const SOCIAL_HANDLE = "@SVRMGROUP";
export const INSTAGRAM_URL = "https://www.instagram.com/svrmgroup/";
export const TIKTOK_URL = "https://www.tiktok.com/@svrmgroup";

/**
 * Default WhatsApp link used across the site. On tap, WhatsAppClickTracker swaps this
 * generic prefill for the page's service message and adds an enquiry reference
 * (owner request, Dec 2026 campaigns). Never put prices in prefilled messages.
 */
export const WHATSAPP_URL =
  "https://wa.me/27730641481?text=Hi%20SVRM%20Group%2C%20I%27d%20like%20to%20make%20an%20enquiry.%20Please%20assist%20me%20with%20availability%20and%20booking%20details";

/** Kept for backwards compatibility with existing call sites. Always returns the single WhatsApp URL. */
export const buildWhatsAppUrl = (_subject?: string) => WHATSAPP_URL;

/** Kept for backwards compatibility with existing call sites. Always returns the single WhatsApp URL. */
export const buildWhatsAppUrlRaw = (_fullMessage?: string) => WHATSAPP_URL;
