import { describe, expect, it } from "vitest";
import { CANCELLATION_REFUND_TIERS } from "./cancellationPolicy";

describe("Approved cancellation refund rules", () => {
  it("refunds 95% with 31 or more days of notice", () => {
    expect(CANCELLATION_REFUND_TIERS[0]).toEqual({ minDays: 31, maxDays: null, refundPercent: 95 });
  });
  it("refunds 85% with 15–30 days of notice", () => {
    expect(CANCELLATION_REFUND_TIERS[1]).toEqual({ minDays: 15, maxDays: 30, refundPercent: 85 });
  });
  it("refunds 75% with 8–14 days of notice", () => {
    expect(CANCELLATION_REFUND_TIERS[2]).toEqual({ minDays: 8, maxDays: 14, refundPercent: 75 });
  });
  it("is non-refundable with 0–7 days of notice, subject to law", () => {
    expect(CANCELLATION_REFUND_TIERS[3]).toEqual({ minDays: 0, maxDays: 7, refundPercent: 0 });
  });
});