// Single source of truth for SVRM contact endpoints.
export const WHATSAPP_NUMBER = "27730641481";
export const CONCIERGE_EMAIL = "concierge@svrm.group";
export const SOCIAL_HANDLE = "@SVRMGROUP";
export const INSTAGRAM_URL = "https://www.instagram.com/svrmgroup/";
export const TIKTOK_URL = "https://www.tiktok.com/@svrmgroup";

export const WHATSAPP_SHORTLINK =
  "https://api.whatsapp.com/message/CXDCRJ5R6I2JD1?autoload=1&app_absent=0";

// Note: WhatsApp shortlinks (message/<code>) don't support prefilled text.
// The `subject` is accepted for backward compatibility but ignored.
export const buildWhatsAppUrl = (_subject?: string) => WHATSAPP_SHORTLINK;
