import { describe, expect, it } from "vitest";
import { vehicles } from "../data/vehicles";
import { FLAGSHIP_SLUG, vehicleServiceOffers } from "./vehicleServices";

describe("chauffeur fleet search data", () => {
  it("makes the Phantom the first Signature vehicle and flagship", () => {
    expect(FLAGSHIP_SLUG).toBe("rolls-royce-phantom");
    expect(vehicles.filter(vehicle => vehicle.tier === "Signature")[0]?.slug).toBe(FLAGSHIP_SLUG);
  });
  it("keeps the Maybach S-Class in Signature", () => {
    expect(vehicles.filter(vehicle => vehicle.tier === "Signature").map(vehicle => vehicle.slug))
      .toContain("mercedes-maybach-s-class");
  });

  it("includes each offered vehicle with its own official enquiry link", () => {
    const offers = vehicleServiceOffers(vehicles);
    expect(offers).toHaveLength(vehicles.length);
    for (const vehicle of vehicles) {
      expect(offers.find(offer => offer.itemOffered.name === `${vehicle.name} chauffeur service Cape Town`)?.url)
        .toBe(`https://svrm.group/chauffeur?cat=cars&vehicle=${vehicle.slug}#${vehicle.slug}`);
    }
  });
});