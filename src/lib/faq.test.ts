import { describe, expect, it } from "vitest";
import { completeFaq, FAQ_WHATSAPP_NUMBER, FAQ_WHATSAPP_URL, faqSchema } from "./faq";
import { faqGroups } from "@/data/faq";

describe("FAQ contact requirements", () => {
  it("uses the approved international WhatsApp destination", () => {
    expect(FAQ_WHATSAPP_URL).toBe("https://wa.me/27730641481");
    expect(FAQ_WHATSAPP_NUMBER).toBe("+27 73 064 1481");
  });
  it("adds the approved contact to each answer without duplication", () => {
    const once = completeFaq({ q: "Sample", a: "An availability enquiry." });
    expect(once.a.split("+27 73 064 1481")).toHaveLength(2);
    expect(completeFaq(once).a).toBe(once.a);
    expect(faqGroups.length).toBeGreaterThan(5);
    for (const group of faqGroups) for (const item of group.items) {
      expect(item.a.includes("+27 73 064 1481")).toBe(true);
    }
  });
  it("shares the actual answers with structured data", () => {
    const item = completeFaq({ q: "Sample", a: "An availability enquiry." });
    expect(faqSchema([item]).mainEntity[0].acceptedAnswer.text).toBe(item.a);
  });
});