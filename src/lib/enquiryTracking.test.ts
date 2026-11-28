import { describe, expect, it } from "vitest";
import { buildImportCsv, inclusiveDays, newReference, parseAttribution, serviceFromPath, withServiceMessage } from "./enquiryTracking";
import { WHATSAPP_URL } from "./whatsapp";

const text = (href: string) => new URL(href).searchParams.get("text") || "";

describe("enquiry tracking", () => {
  it("creates short SV references", () => {
    expect(newReference()).toMatch(/^SV-[A-Z0-9]{5}$/);
  });

  it("maps pages to services", () => {
    expect(serviceFromPath("/tours/cape-peninsula")).toBe("tours");
    expect(serviceFromPath("/chauffeur")).toBe("chauffeur");
    expect(serviceFromPath("/security")).toBe("secure_transport");
    expect(serviceFromPath("/airport-transfers")).toBe("airport_transfer");
  });

  it("swaps the generic prefill for the tour message with the reference", () => {
    const t = text(withServiceMessage(WHATSAPP_URL, "/tours/cape-peninsula", "SV-ABCDE"));
    expect(t).toContain("private Cape Peninsula tour on [date] for [number] guests");
    expect(t).toMatch(/Ref: SV-ABCDE$/);
    expect(t).not.toMatch(/R\s?\d/); // no prices in prefilled messages
  });

  it("uses German wording for German visitors", () => {
    expect(text(withServiceMessage(WHATSAPP_URL, "/tours/cape-peninsula", "SV-ABCDE", "de"))).toContain("Kap-Halbinsel");
  });

  it("keeps a page's own detailed message and only adds the reference", () => {
    const custom = "https://wa.me/27730641481?text=" + encodeURIComponent("Airport transfer · 3 guests");
    expect(text(withServiceMessage(custom, "/airport-transfers", "SV-ABCDE"))).toBe("Airport transfer · 3 guests\n\nRef: SV-ABCDE");
  });

  it("reads ad parameters from the landing URL", () => {
    expect(parseAttribution("?gclid=abc&utm_source=google", "/chauffeur")).toMatchObject({ gclid: "abc", utm_source: "google", landing_path: "/chauffeur" });
    expect(parseAttribution("?lang=de", "/")).toBeNull();
  });

  it("counts chauffeur days inclusively", () => {
    expect(inclusiveDays(new Date(2026, 11, 1), new Date(2026, 11, 5))).toBe(5);
    expect(inclusiveDays(new Date(2026, 11, 1), new Date(2026, 11, 1))).toBe(1);
  });

  it("builds the import sheet only for consented, genuine ad-click enquiries", () => {
    const base = { gclid: "G1", ad_consent: true, is_employment: false, is_duplicate: false, qualified_at: "2026-12-02T08:00:00Z", quote_sent_at: null, deposit_paid_at: null, completed_at: "2026-12-10T10:30:00Z", contribution: 12000 };
    const csv = buildImportCsv([
      base,
      { ...base, gclid: "NOCONSENT", ad_consent: false },
      { ...base, gclid: "JOB", is_employment: true },
      { ...base, gclid: "DUP", is_duplicate: true },
      { ...base, gclid: null },
    ]);
    const lines = csv.split("\n");
    expect(lines[0]).toBe("Parameters:TimeZone=Africa/Johannesburg");
    expect(lines.slice(2)).toEqual([
      "G1,Qualified enquiry,2026-12-02 10:00:00,,",
      "G1,Completed booking,2026-12-10 12:30:00,12000,ZAR",
    ]);
  });
});
