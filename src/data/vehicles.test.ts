import { describe, expect, it } from "vitest";
import { vehicles, rentalRate } from "./vehicles";

describe("approved chauffeur rates", () => {
  it("prices Range Rover Autobiography at R20,000 per day", () => {
    expect(vehicles.find(v => v.slug === "range-rover-autobiography")?.fromZAR).toBe(20000);
  });
  it("prices Lamborghini Urus at R37,500 per day", () => {
    expect(vehicles.find(v => v.slug === "lamborghini-urus")?.fromZAR).toBe(37500);
  });
  it("leaves existing self-drive rates unchanged", () => {
    const autobiography = vehicles.find(v => v.slug === "range-rover-autobiography");
    const urus = vehicles.find(v => v.slug === "lamborghini-urus");
    expect(autobiography && rentalRate(autobiography)).toBe(15500);
    expect(urus && rentalRate(urus)).toBe(20500);
  });
});