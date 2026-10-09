import { randomInt, createHash, createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { z } from "zod";

const OTP_PEPPER = process.env["OTP_PEPPER"] || "animas-kitchen-secure-pepper-2026-min-32-chars";
const SESSION_EXPIRY_DAYS = 30;

export const EmailOtpRequestSchema = z.object({
  email: z
    .string()
    .email()
    .transform((val) => val.trim().toLowerCase()),
});

export const EmailOtpVerifySchema = z.object({
  email: z
    .string()
    .email()
    .transform((val) => val.trim().toLowerCase()),
  otp: z.string().regex(/^\d{6}$/, "OTP must be a 6-digit numeric code"),
  otpId: z.string().optional(),
});

/**
 * Section 3.1: Cryptographically Secure HMAC-SHA256 with OTP_PEPPER & per-OTP id
 */
export const makeOtp = (): string => String(randomInt(0, 1_000_000)).padStart(6, "0");

export const hashOtp = (otp: string, email: string, id: string = "default"): string =>
  createHmac("sha256", OTP_PEPPER)
    .update(`${id}:${email.trim().toLowerCase()}:${otp.trim()}`)
    .digest("hex");

export const safeEq = (a: Buffer, b: Buffer): boolean =>
  a.length === b.length && timingSafeEqual(a, b);

export function generate6DigitOtp(): string {
  return makeOtp();
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function verifyOtpHash(
  inputOtp: string,
  email: string,
  storedHash: string,
  id: string = "default",
): boolean {
  const calculatedHash = hashOtp(inputOtp, email, id);
  try {
    const bufA = Buffer.from(calculatedHash, "hex");
    const bufB = Buffer.from(storedHash, "hex");
    return safeEq(bufA, bufB);
  } catch {
    return false;
  }
}

// In-memory rate limiting map for edge resilience & protection
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const rateLimits = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimits.get(key);

  if (!entry || entry.resetAt < now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}

// Send OTP Email using Branded Mailer or fallback
export async function sendOtpEmail(toEmail: string, otp: string): Promise<boolean> {
  try {
    const { sendBrandedOtpEmail } = await import("../email/mailer");
    return await sendBrandedOtpEmail(toEmail, otp);
  } catch {
    console.log(`[ANIMA'S KITCHEN OTP EMAIL] To: ${toEmail} | Code: ${otp}`);
    return true;
  }
}
