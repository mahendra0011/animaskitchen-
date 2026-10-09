import { z } from "zod";

// Environment Configuration Schema
export const EnvSchema = z.object({
  PORT: z.string().default("10000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  DATABASE_URL: z.string().url().optional(),
  SESSION_SECRET: z
    .string()
    .min(16)
    .default("animas-kitchen-production-session-secret-key-32chars"),
  OTP_PEPPER: z.string().min(16).default("animas-kitchen-production-otp-pepper-secret-salt-2026"),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("orders@animaskitchen.com"),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  GOOGLE_MAPS_KEY: z.string().optional(),
  CLOUDINARY_URL: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  APP_URL: z.string().default("https://animaskitchen.com"),
});

export const env = EnvSchema.parse(process.env);
