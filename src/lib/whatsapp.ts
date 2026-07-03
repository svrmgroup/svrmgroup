// Single source of truth for SVRM contact endpoints.
export const WHATSAPP_NUMBER = "27730641481";
export const CONCIERGE_EMAIL = "concierge@svrm.group";
export const SOCIAL_HANDLE = "@SVRMGROUP";
export const INSTAGRAM_URL = "https://www.instagram.com/svrmgroup/";
export const TIKTOK_URL = "https://www.tiktok.com/@svrmgroup";

export const buildWhatsAppUrl = (subject?: string) => {
  const base = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`;
  if (!subject) return base;
  const text = `Hi SVRM, I'd like to enquire about ${subject}.`;
  return `${base}&text=${encodeURIComponent(text)}`;
};
