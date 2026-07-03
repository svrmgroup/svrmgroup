// Single source of truth for SVRM contact endpoints.
export const WHATSAPP_NUMBER = "27730641481";
export const CONCIERGE_EMAIL = "concierge@svrm.group";
export const SOCIAL_HANDLE = "@SVRMGROUP";
export const INSTAGRAM_URL = "https://www.instagram.com/svrmgroup/";
export const TIKTOK_URL = "https://www.tiktok.com/@svrmgroup";

const WA_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;

/** Standard enquiry link — wraps `subject` in "Hi SVRM, I'd like to enquire about <subject>." */
export const buildWhatsAppUrl = (subject?: string) => {
  if (!subject) return WA_BASE;
  const text = `Hi SVRM, I'd like to enquire about ${subject}.`;
  return `${WA_BASE}?text=${encodeURIComponent(text)}`;
};

/** Use when the caller wants to supply the full message verbatim (no "enquire about" prefix). */
export const buildWhatsAppUrlRaw = (fullMessage: string) =>
  `${WA_BASE}?text=${encodeURIComponent(fullMessage)}`;

