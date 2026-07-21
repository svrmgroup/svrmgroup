// Per-route WhatsApp pre-filled messages. Extend by adding a new route key.
// Messages are encoded at runtime via encodeURIComponent — never hardcode encoded strings here.

export const WHATSAPP_MESSAGES: Record<string, string> = {
  "/": "Hi SVRM Group, I'd like to enquire about your services.",
  "/travel": "Hi SVRM Group, I'd like to enquire about travel arrangements.",
  "/rentals": "Hi SVRM Group, I'd like to enquire about vehicle rentals.",
  "/stays": "Hi SVRM Group, I'd like to enquire about accommodation and villa stays.",
  "/tours": "Hi SVRM Group, I'd like to enquire about a private tour.",
  "/security": "Hi SVRM Group, I'd like to enquire about security services.",
  "/custom": "Hi SVRM Group, I'd like to enquire about a custom itinerary.",
  "/experiences": "Hi SVRM Group, I'd like to enquire about a custom itinerary.",
  "/airport-transfers": "Hi SVRM Group, I'd like to book an airport transfer.",
  "/chauffeur": "Hi SVRM Group, I'd like to enquire about chauffeur service.",
  "/aquila-safari": "Hi SVRM Group, I'd like to enquire about the Aquila safari day trip.",
  "/tours/aquila-safari": "Hi SVRM Group, I'd like to enquire about the Aquila safari day trip.",
};

// wa.me/svrmgroup is not a guaranteed vanity resolver — the numeric E.164 form is stable.
export const WHATSAPP_BASE = "https://wa.me/27730641481";

export function whatsappMessageFor(pathname: string): string {
  const exact = WHATSAPP_MESSAGES[pathname];
  if (exact) return exact;
  const seg = "/" + (pathname.split("/").filter(Boolean)[0] ?? "");
  return WHATSAPP_MESSAGES[seg] ?? WHATSAPP_MESSAGES["/"];
}

export function whatsappUrlFor(pathname: string): string {
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(whatsappMessageFor(pathname))}`;
}
