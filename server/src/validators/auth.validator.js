const { z } = require("zod");

/**
 * Normalise a phone string coming from the frontend PhoneInput.
 * Strips dial code prefix (e.g. "+91 ", "+44 ") and all spaces/dashes
 * so validation works on the raw local number.
 * Examples:
 *   "+91 9876543210"  → "9876543210"
 *   "+44 7911123456"  → "7911123456"
 *   "9876543210"      → "9876543210"
 */
function normalisePhone(raw) {
  // Remove leading + and dial code (1–4 digits) followed by a space
  const stripped = raw.replace(/^\+\d{1,4}\s*/, "");
  // Remove remaining spaces, dashes, parentheses
  return stripped.replace(/[\s\-().]/g, "");
}

const phoneField = z
  .string()
  .trim()
  .transform((val) => normalisePhone(val))
  .refine(
    (val) => {
      // After stripping, must be digits only
      if (!/^\d+$/.test(val)) return false;
      // Indian numbers: starts with 6-9 and is exactly 10 digits
      if (val.length === 10 && /^[6-9]/.test(val)) return true;
      // International (non-Indian): ITU E.164 allows 5–15 digits
      if (val.length >= 5 && val.length <= 15) return true;
      return false;
    },
    { message: "Please enter a valid phone number" }
  );

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  phone: phoneField,

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

const verifyEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  otp: z
    .string()
    .trim()
    .length(6, "OTP must be 6 digits"),
});

const verifyPhoneSchema = z.object({
  phone: phoneField,

  otp: z
    .string()
    .trim()
    .length(6, "OTP must be 6 digits"),
});

const resendEmailOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),
});

const resendPhoneOtpSchema = z.object({
  phone: phoneField,
});

const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
});

module.exports = {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  verifyPhoneSchema,
  resendEmailOtpSchema,
  resendPhoneOtpSchema,
  updateProfileSchema,
};