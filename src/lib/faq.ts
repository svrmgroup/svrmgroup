export const FAQ_WHATSAPP_NUMBER = "+27 73 064 1481";
export const FAQ_WHATSAPP_URL = "https://wa.me/27730641481";

export type FaqLink = { to: string; label: string };
export type FaqAnswerData = { q: string; a: string; link?: FaqLink };

const invitations = [
  "For availability and reservations, contact SVRM Group on WhatsApp at",
  "For a personalised quotation, speak to our concierge on WhatsApp at",
  "Discuss your dates and preferences with SVRM Group on WhatsApp at",
];

export function completeFaq<T extends FaqAnswerData>(item: T, index = 0): T {
  const related = item.link ? ` Explore ${item.link.label}.` : "";
  const contact = item.a.includes(FAQ_WHATSAPP_NUMBER)
    ? ""
    : ` ${invitations[index % invitations.length]} ${FAQ_WHATSAPP_NUMBER}.`;
  return { ...item, a: `${item.a}${related}${contact}` };
}

export function faqSchema(items: FaqAnswerData[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}