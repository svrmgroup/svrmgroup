import { describe, it, expect } from "vitest";
import { requiredPhone, optionalEmail, emailOrNull } from "./contactValidation";

describe("enquiry contact rules", () => {
  it("rejects an empty phone", () => expect(requiredPhone.safeParse("").success).toBe(false));
  it("rejects a country code with no number", () => expect(requiredPhone.safeParse("+27 ").success).toBe(false));
  it("accepts a full phone number", () => expect(requiredPhone.safeParse("+27 73 064 1481").success).toBe(true));
  it("allows a blank email", () => expect(optionalEmail.safeParse("").success).toBe(true));
  it("still rejects a malformed email", () => expect(optionalEmail.safeParse("abc").success).toBe(false));
  it("stores blank email as null", () => expect(emailOrNull("  ")).toBeNull());
});
