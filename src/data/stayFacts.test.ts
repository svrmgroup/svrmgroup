import { describe, expect, it } from "vitest";
import { stays } from "./stays";
import { guestLabel, stayFacts, stayFactSummary } from "./stayFacts";
import { stayListing } from "./listings";

describe("verified stay facts", () => {
  it("has bedrooms, bathrooms, guest capacity and a source for every published stay", () => {
    for (const stay of stays) {
      const facts = stayFacts[stay.slug];
      expect(facts, stay.slug).toBeDefined();
      expect(facts.bedrooms, stay.slug).toBeGreaterThan(0);
      expect(facts.bathrooms, stay.slug).toBeGreaterThan(0);
      expect(facts.maxGuests, stay.slug).toBeGreaterThan(0);
      expect(facts.source, stay.slug).toMatch(/^https:\/\//);
    }
  });

  it("uses the real À La Penthouse capacity", () => {
    expect(stayFacts["a-la-penthouse"]).toMatchObject({ bedrooms: 2, bathrooms: 2, maxGuests: 4 });
  });

  it("gives À La Penthouse its own page, nine real photos and accurate booking guidance", () => {
    const stay = stays.find((item) => item.slug === "a-la-penthouse");
    expect(stay).toBeDefined();
    const listing = stayListing(stay!);
    expect(listing.path).toBe("/stays/a-la-penthouse");
    expect(listing.photos).toHaveLength(9);
    expect(listing.faqs.map((faq) => faq.a).join(" ")).toContain("seven-night minimum");
    expect(listing.faqs.map((faq) => faq.a).join(" ")).toContain("lower level");
  });

  it("uses the same verified facts on every detail page", () => {
    for (const stay of stays) {
      const facts = stayFacts[stay.slug];
      const listing = stayListing(stay);
      expect(listing.bathroomCount, stay.slug).toBe(facts.bathrooms);
      expect(listing.guestCapacity, stay.slug).toBe(facts.maxGuests);
      expect(listing.maxGuests, stay.slug).toBe(guestLabel(facts));
      expect(listing.bathrooms, stay.slug).not.toContain("confirm");
    }
  });

  it("uses the official Higgovale Sandstone figures", () => {
    expect(stayFacts["nox-4-bed-higgovale-mountain-views-sandstone-apartment"]).toMatchObject({ bedrooms: 4, bathrooms: 4, maxGuests: 8 });
  });

  it("does not assume every bedroom adds exactly one bathroom", () => {
    expect(stayFacts["nox-clifton-3bed-penthouse-sea-views-dunmore-horizons"]).toMatchObject({ bedrooms: 3, bathrooms: 2, maxGuests: 6 });
    expect(stayFacts["nox-luxurious-camps-bay-retreat-w-sea-views-rock-residence"]).toMatchObject({ bedrooms: 6, bathrooms: 4, maxGuests: 12 });
    expect(stayFacts["nox-llandudno-beach-oasis-solmara-house"]).toMatchObject({ bedrooms: 5, bathrooms: 4, maxGuests: 10 });
  });

  it("uses the official twenty-guest capacity for Buddha Retreat", () => {
    expect(stayFactSummary("nox-idyllic-camps-bay-villa-w-2-pools-buddha-retreat")).toBe("10 bed · 10 bath · 20 guests");
  });
});
