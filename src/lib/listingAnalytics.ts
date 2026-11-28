// Listing views and WhatsApp handoffs, by listing id, category and service type only —
// never message text or trip details. A handoff is not a lead or a booking.

type Gtag = (...args: unknown[]) => void;
const gtag = (): Gtag | undefined => (typeof window !== "undefined" ? (window as unknown as { gtag?: Gtag }).gtag : undefined);

export function trackListingView(id: string, category: string, service: string) {
  try { gtag()?.("event", "view_item", { item_id: id, item_category: category, service_type: service }); } catch { /* ignore */ }
}

export function trackListingHandoff(id: string, category: string, service: string, method: "whatsapp" | "copy" | "email") {
  try { gtag()?.("event", "listing_enquiry_handoff", { item_id: id, item_category: category, service_type: service, method }); } catch { /* ignore */ }
  // WhatsApp taps are also logged (with the listing id via data-wa-source) by the global WhatsAppClickTracker.
}
