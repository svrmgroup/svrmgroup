import { describe, expect, it } from "vitest";
import { buildEnquiryMessage, enquiryWhatsAppUrl, formatEnquiryDate, validateEnquiry } from "./listingEnquiry";

const vClass = { id: "vehicle:maybach-v-class", name: "Maybach V-Class", kind: "chauffeur" as const, url: "https://svrm.group/chauffeur/maybach-v-class" };

describe("listing enquiries", () => {
  it("formats dates the same for UK and US guests", () => {
    expect(formatEnquiryDate("2026-12-12")).toBe("12 December 2026");
  });

  it("builds the multi-day vehicle message from the brief", () => {
    const msg = buildEnquiryMessage(vClass, { startDate: "2026-12-12", endDate: "2026-12-15", guests: 4, pickup: "Camps Bay", luggage: "3 large suitcases" });
    expect(msg).toContain("Hi SVRM Group, I'd like to check availability for the Maybach V-Class with chauffeur from 12 to 15 December 2026 for 4 passengers. We're staying in Camps Bay.");
    expect(msg).toContain("Luggage: 3 large suitcases.");
    expect(msg.trim().endsWith("https://svrm.group/chauffeur/maybach-v-class")).toBe(true);
  });

  it("omits blank optional fields", () => {
    const msg = buildEnquiryMessage(vClass, { startDate: "2026-12-12", guests: 2, pickup: "  ", luggage: "" });
    expect(msg).not.toContain("staying in");
    expect(msg).not.toContain("Luggage");
  });

  it("builds the property message with adults and children", () => {
    const msg = buildEnquiryMessage({ id: "stay:x", name: "The Atlantic Villa in Camps Bay", kind: "stay", url: "https://svrm.group/stays/the-atlantic-villa-camps-bay" }, { startDate: "2026-12-12", endDate: "2026-12-16", guests: 4, children: 2 });
    expect(msg).toContain("check in on 12 December 2026 and check out on 16 December 2026. There will be 4 adults and 2 children.");
  });

  it("builds the tour message with pickup", () => {
    const msg = buildEnquiryMessage({ id: "tour:cape-peninsula", name: "Cape Peninsula tour", kind: "tour", url: "u" }, { startDate: "2026-12-14", guests: 3, pickup: "the V&A Waterfront" });
    expect(msg).toContain("private Cape Peninsula tour on 14 December 2026 for 3 guests, with pickup at the V&A Waterfront.");
  });

  it("encodes the message for WhatsApp", () => {
    expect(enquiryWhatsAppUrl("A & B\nC")).toBe("https://wa.me/27730641481?text=A%20%26%20B%0AC");
  });

  it("rejects past dates", () => {
    expect(validateEnquiry("chauffeur", { startDate: "2026-01-01", guests: 2 }, "2026-11-28").errors.startDate).toBeTruthy();
  });

  it("requires check-out after check-in", () => {
    expect(validateEnquiry("stay", { startDate: "2026-12-12", endDate: "2026-12-12", guests: 2 }, "2026-11-28").errors.endDate).toBeTruthy();
  });

  it("rejects a multi-day range that ends before it starts", () => {
    expect(validateEnquiry("chauffeur", { startDate: "2026-12-15", endDate: "2026-12-12", guests: 2 }, "2026-11-28").errors.endDate).toBeTruthy();
  });

  it("flags same-day chauffeur bookings", () => {
    const r = validateEnquiry("chauffeur", { startDate: "2026-11-28", guests: 2 }, "2026-11-28");
    expect(r.sameDay).toBe(true);
    expect(r.errors.startDate).toBeUndefined();
  });

  it("allows flexible dates without a date", () => {
    expect(validateEnquiry("tour", { flexible: true, guests: 2 }, "2026-11-28").errors.startDate).toBeUndefined();
  });
});
