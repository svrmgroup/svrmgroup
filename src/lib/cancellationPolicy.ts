import { CONCIERGE_EMAIL, WHATSAPP_DISPLAY_NUMBER, WHATSAPP_NUMBER } from "@/lib/whatsapp";

/** Notice is measured in days before the scheduled service, not from booking. */
export const CANCELLATION_REFUND_TIERS = [
  { minDays: 31, maxDays: null, refundPercent: 95 },
  { minDays: 15, maxDays: 30, refundPercent: 85 },
  { minDays: 8, maxDays: 14, refundPercent: 75 },
  { minDays: 0, maxDays: 7, refundPercent: 0 },
] as const;

const tierText = (tier: typeof CANCELLATION_REFUND_TIERS[number]) =>
  `${tier.maxDays === null ? `${tier.minDays}+` : `${tier.minDays}–${tier.maxDays}`} days: ${tier.refundPercent ? `${tier.refundPercent}% refund` : "Non-refundable, subject to applicable law"}`;

export const CANCELLATION_POLICY_FAQ = `At SVRM GROUP, we understand that plans can change. This cancellation and refund policy applies to all bookings with SVRM GROUP, unless an exception is agreed in writing and always subject to applicable law. Refunds are calculated based on the notice provided before your scheduled service:\n\n${CANCELLATION_REFUND_TIERS.map(tier => `• ${tierText(tier)}`).join("\n")}\n\nCancellations must be submitted in writing. Disclosed third-party supplier conditions may apply. Exceptions may be considered at management’s discretion. Approved refunds are generally processed within 7–14 business days. All terms are subject to applicable consumer protection legislation.\n\nFor assistance or to submit a written cancellation, please contact our concierge on WhatsApp at ${WHATSAPP_DISPLAY_NUMBER} or email ${CONCIERGE_EMAIL}, quoting your booking reference.`;

export const CANCELLATION_POLICY_COMPACT = `All SVRM GROUP bookings follow this policy, unless otherwise agreed in writing, subject to applicable consumer protection law. Notice before scheduled service: ${CANCELLATION_REFUND_TIERS.map(tierText).join("; ")}. Cancellations must be in writing. Disclosed third-party supplier conditions may apply; exceptions are at management’s discretion. Approved refunds generally take 7–14 business days.`;

export const CANCELLATION_CONTACT = `Written cancellations: WhatsApp ${WHATSAPP_DISPLAY_NUMBER} or ${CONCIERGE_EMAIL}; please quote your booking reference.`;
export const CANCELLATION_WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;