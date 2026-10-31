import { z } from "zod";

/** Phone is required on every public enquiry (min 7 digits); email is optional. */
export const requiredPhone = z
  .string()
  .trim()
  .max(40)
  .refine((v) => v.replace(/\D/g, "").length >= 7, {
    message: "Phone / WhatsApp number required",
  });

export const optionalEmail = z
  .string()
  .trim()
  .max(255)
  .email("Enter a valid email or leave it blank")
  .optional()
  .or(z.literal(""));

export const emailOrNull = (v?: string | null) => (v && v.trim() ? v.trim() : null);

export const PHONE_REQUIRED_MSG = "Please add your name and phone / WhatsApp number.";
