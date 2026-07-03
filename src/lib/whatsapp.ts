// Single source of truth for SVRM contact endpoints.
export const WHATSAPP_NUMBER = "27730641481";
export const CONCIERGE_EMAIL = "concierge@svrm.group";
export const SOCIAL_HANDLE = "@SVRMGROUP";
export const INSTAGRAM_URL = "https://www.instagram.com/svrmgroup/";
export const TIKTOK_URL = "https://www.tiktok.com/@svrmgroup";

const WA_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;

/** Standard enquiry link — wraps `subject` in "Hi SVRM Group, I'd like to enquire about <subject>. Please confirm availability and booking details." */
export const buildWhatsAppUrl = (subject?: string) => {
  if (!subject) {
    const fallback = "Hi SVRM Group, I'd like to make a concierge enquiry. Please assist me with availability and booking details.";
    return `${WA_BASE}?text=${encodeURIComponent(fallback)}`;
  }
  const text = `Hi SVRM Group, I'd like to enquire about ${subject}. Please confirm availability and booking details.`;
  return `${WA_BASE}?text=${encodeURIComponent(text)}`;
};

/** Use when the caller wants to supply the full message verbatim (no "enquire about" prefix). */
export const buildWhatsAppUrlRaw = (fullMessage: string) =>
  `${WA_BASE}?text=${encodeURIComponent(fullMessage)}`;

