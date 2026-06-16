// Single source of truth for SVRM contact endpoints.
// Replace WHATSAPP_NUMBER with the real number when ready (digits only, country code, no +).
export const WHATSAPP_NUMBER = "27000000000";
export const CONCIERGE_EMAIL = "concierge@svrm.group";

export const buildWhatsAppUrl = (subject?: string) => {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!subject) return base;
  const text = `Hi SVRM, I'd like to enquire about ${subject}.`;
  return `${base}?text=${encodeURIComponent(text)}`;
};
