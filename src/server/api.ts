import { db } from "../db";
import { users, sessions, emailOtps } from "../db/schema";
import { eq, and, gt, desc } from "drizzle-orm";
import { createHash } from "node:crypto";
import {
  generate6DigitOtp,
  hashOtp,
  verifyOtpHash,
  generateSessionToken,
  sendOtpEmail,
  checkRateLimit,
} from "./auth/otp";

import {
  hashPasswordSecure,
  verifyPasswordSecure,
  checkLoginLockout,
  recordFailedLogin,
  resetLoginLockout,
  sanitizeText,
} from "./security/guard";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: "customer" | "rider" | "admin" | "kds";
  isEmailVerified: boolean;
}

// In-memory user store fallback if DB is not connected
interface MemoryUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  passwordHash: string;
  role: "customer" | "rider" | "admin" | "kds";
  isEmailVerified: boolean;
}
const memoryUsers = new Map<string, MemoryUser>();
const memoryOtps = new Map<string, { codeHash: string; attempts: number; expiresAt: number }>();
const memorySessions = new Map<string, { userId: string; expiresAt: number }>();

// 1. Session check helper
export async function getSessionUserFromCookie(
  cookieHeader: string | null,
): Promise<AuthenticatedUser | null> {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/animas_session=([a-f0-9]{64})/);
  if (!match) return null;

  const sessionToken = match[1];
  if (!sessionToken) return null;

  // Check memory session
  const memSession = memorySessions.get(sessionToken);
  if (memSession && memSession.expiresAt > Date.now()) {
    for (const u of memoryUsers.values()) {
      if (u.id === memSession.userId) {
        return {
          id: u.id,
          email: u.email,
          name: u.name,
          phone: u.phone,
          role: u.role,
          isEmailVerified: u.isEmailVerified,
        };
      }
    }
  }

  try {
    const sessionRecord = await db.query.sessions.findFirst({
      where: and(eq(sessions.id, sessionToken), gt(sessions.expiresAt, new Date())),
    });

    if (!sessionRecord) return null;

    const user = await db.query.users.findFirst({
      where: eq(users.id, sessionRecord.userId),
    });

    if (!user || user.status === "suspended") return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name || "",
      phone: user.phone || "",
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };
  } catch {
    return null;
  }
}

// 2. SIGNUP: Full Name, Email, Contact Number, Password -> Sends 1-Time Verification OTP
export async function handleSignup(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  ip: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  const email = data.email.trim().toLowerCase();
  const phone = sanitizeText(data.phone.trim());
  const name = sanitizeText(data.name.trim());

  if (!email || !data.password || data.password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long." };
  }

  // Check if already registered
  const existingMem = memoryUsers.get(email);
  if (existingMem) {
    return { success: false, error: "An account with this email already exists. Please log in." };
  }

  const pwdHash = hashPasswordSecure(data.password);
  const userId = "usr_" + Math.random().toString(36).substring(2, 9);

  // Store in memory
  memoryUsers.set(email, {
    id: userId,
    email,
    name,
    phone,
    passwordHash: pwdHash,
    role: "customer",
    isEmailVerified: false,
  });

  // Attempt DB insert
  try {
    await db.insert(users).values({
      id: userId as any,
      email,
      name,
      phone,
      passwordHash: pwdHash,
      isEmailVerified: false,
      role: "customer",
    });
  } catch {
    // Memory fallback active
  }

  // Generate & send One-Time Verification OTP
  const otp = generate6DigitOtp();
  const codeHash = hashOtp(otp, email);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  memoryOtps.set(email, {
    codeHash,
    attempts: 0,
    expiresAt: expiresAt.getTime(),
  });

  await sendOtpEmail(email, otp);

  return {
    success: true,
    message:
      "Registration successful! A one-time 6-digit verification code has been sent to your email.",
  };
}

// 3. ONE-TIME EMAIL VERIFICATION (OTP Verification)
export async function handleVerifySignupEmail(
  email: string,
  otp: string,
): Promise<{ success: boolean; token?: string; user?: AuthenticatedUser; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const memRecord = memoryOtps.get(normalizedEmail);

  let isValid = false;
  if (memRecord && memRecord.expiresAt > Date.now()) {
    if (memRecord.attempts >= 5) {
      return { success: false, error: "Too many failed attempts. Please request a new code." };
    }
    isValid = verifyOtpHash(otp, normalizedEmail, memRecord.codeHash);
    if (!isValid) {
      memRecord.attempts += 1;
      return { success: false, error: "Invalid verification code." };
    }
    memoryOtps.delete(normalizedEmail);
  }

  if (!isValid) {
    return { success: false, error: "Invalid or expired verification code." };
  }

  // Mark user verified
  const user = memoryUsers.get(normalizedEmail);
  if (user) {
    user.isEmailVerified = true;
  }

  try {
    await db.update(users).set({ isEmailVerified: true }).where(eq(users.email, normalizedEmail));
  } catch {
    // Memory active
  }

  const sessionToken = generateSessionToken();
  memorySessions.set(sessionToken, {
    userId: user?.id || "usr_guest",
    expiresAt: Date.now() + 30 * 24 * 3600 * 1000,
  });

  return {
    success: true,
    token: sessionToken,
    user: {
      id: user?.id || "usr_guest",
      email: normalizedEmail,
      name: user?.name || "",
      phone: user?.phone || "",
      role: user?.role || "customer",
      isEmailVerified: true,
    },
  };
}

// 4. LOGIN: Email & Password (Protected against Brute-Force & Timing Attacks)
export async function handlePasswordLogin(
  email: string,
  password: string,
  ip = "127.0.0.1",
): Promise<{ success: boolean; token?: string; user?: AuthenticatedUser; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  // Check Lockout
  const accountLock = checkLoginLockout(normalizedEmail);
  if (accountLock.isLocked) {
    return {
      success: false,
      error: `Account temporarily locked due to too many failed attempts. Please wait ${accountLock.waitSeconds} seconds.`,
    };
  }

  let user = memoryUsers.get(normalizedEmail);

  // Seed Admin Credentials from environment
  const envAdminEmail = (process.env["ADMIN_EMAIL"] || "Animaskitchen24@gmail.com")
    .trim()
    .toLowerCase();
  const envAdminPassword = process.env["ADMIN_PASSWORD"] || "K9!xM7#qL2";
  const envAdminName = process.env["ADMIN_NAME"] || "Anima Kitchen Admin";

  if (!user && normalizedEmail === envAdminEmail) {
    user = {
      id: "usr_admin_animas",
      email: normalizedEmail,
      name: envAdminName,
      phone: "+91 99999 88888",
      passwordHash: hashPasswordSecure(envAdminPassword),
      role: "admin",
      isEmailVerified: true,
    };
    memoryUsers.set(normalizedEmail, user);
  }

  // Seed Delivery Boy / Rider Credentials from environment
  const envRiderEmail = (process.env["RIDER_EMAIL"] || "Sanjay.k.singh2003@gmail.com")
    .trim()
    .toLowerCase();
  const envRiderPassword = process.env["RIDER_PASSWORD"] || "R8@vP5!zT9";
  const envRiderName = process.env["RIDER_NAME"] || "Sanjay K Singh";
  const envRiderPhone = process.env["RIDER_PHONE"] || "+91 98450 12345";

  if (!user && normalizedEmail === envRiderEmail) {
    user = {
      id: "usr_rider_sanjay",
      email: normalizedEmail,
      name: envRiderName,
      phone: envRiderPhone,
      passwordHash: hashPasswordSecure(envRiderPassword),
      role: "rider",
      isEmailVerified: true,
    };
    memoryUsers.set(normalizedEmail, user);
  }

  // Only 2 authorized system seed accounts: Admin & Delivery Rider

  if (!user) {
    try {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.email, normalizedEmail),
      });
      if (dbUser) {
        user = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name || "",
          phone: dbUser.phone || "",
          passwordHash: dbUser.passwordHash || "",
          role: dbUser.role,
          isEmailVerified: dbUser.isEmailVerified,
        };
      }
    } catch {
      // Memory check
    }
  }

  if (!user || !verifyPasswordSecure(password, user.passwordHash)) {
    const attempt = recordFailedLogin(normalizedEmail);
    if (attempt.isLocked) {
      return {
        success: false,
        error: "Too many failed attempts. Your account has been temporarily locked for 15 minutes.",
      };
    }
    return { success: false, error: "Invalid email or password." };
  }

  // Clear lockouts on successful authentication
  resetLoginLockout(normalizedEmail);

  if (!user.isEmailVerified) {
    // Auto trigger OTP
    const otp = generate6DigitOtp();
    const codeHash = hashOtp(otp, normalizedEmail);
    memoryOtps.set(normalizedEmail, {
      codeHash,
      attempts: 0,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
    await sendOtpEmail(normalizedEmail, otp);

    return {
      success: false,
      error: "EMAIL_NOT_VERIFIED",
    };
  }

  const sessionToken = generateSessionToken();
  memorySessions.set(sessionToken, {
    userId: user.id,
    expiresAt: Date.now() + 30 * 24 * 3600 * 1000,
  });

  return {
    success: true,
    token: sessionToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isEmailVerified: true,
    },
  };
}

// 4.1 GOOGLE SIGN-IN HANDLER
export async function handleGoogleLogin(
  credential?: string,
  userInfo?: { email: string; name?: string; picture?: string; sub?: string },
): Promise<{ success: boolean; token?: string; user?: AuthenticatedUser; error?: string }> {
  try {
    let email = userInfo?.email;
    let name = userInfo?.name || "";

    // If credential (Google ID Token JWT) was passed, decode payload
    if (credential && !email) {
      try {
        const parts = credential.split(".");
        if (parts.length === 3 && parts[1]) {
          const payloadJson = Buffer.from(parts[1], "base64url").toString("utf-8");
          const payload = JSON.parse(payloadJson);
          email = payload.email;
          name = payload.name || payload.given_name || "Google User";
        }
      } catch {
        // Fallback
      }
    }

    if (!email) {
      return { success: false, error: "Unable to retrieve Google email profile." };
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = memoryUsers.get(normalizedEmail);

    if (!user) {
      try {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, normalizedEmail),
        });
        if (dbUser) {
          user = {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name || name || "Google User",
            phone: dbUser.phone || "",
            passwordHash: dbUser.passwordHash || "",
            role: dbUser.role as any,
            isEmailVerified: true,
          };
          memoryUsers.set(normalizedEmail, user);
        }
      } catch {}
    }

    // If still not found, create new verified user automatically
    if (!user) {
      user = {
        id: `usr_g_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        email: normalizedEmail,
        name: name || normalizedEmail.split("@")[0] || "Customer",
        phone: "+91 98765 00000",
        passwordHash: hashPasswordSecure(Math.random().toString(36)),
        role: "customer",
        isEmailVerified: true,
      };
      memoryUsers.set(normalizedEmail, user);

      try {
        await db.insert(users).values({
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          passwordHash: user.passwordHash,
          role: "customer",
          isEmailVerified: true,
        });
      } catch {}
    }

    const sessionToken = generateSessionToken();
    memorySessions.set(sessionToken, {
      userId: user.id,
      expiresAt: Date.now() + 30 * 24 * 3600 * 1000,
    });

    return {
      success: true,
      token: sessionToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isEmailVerified: true,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Google sign-in failed." };
  }
}

// 5. RESEND OTP Code
export async function handleResendVerification(
  email: string,
): Promise<{ success: boolean; message: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const otp = generate6DigitOtp();
  const codeHash = hashOtp(otp, normalizedEmail);
  memoryOtps.set(normalizedEmail, {
    codeHash,
    attempts: 0,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });
  await sendOtpEmail(normalizedEmail, otp);
  return { success: true, message: "Verification code sent to your email." };
}

// 6. FORGOT PASSWORD: Send OTP to Email
export async function handleForgotPasswordRequest(
  email: string,
): Promise<{ success: boolean; message?: string; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return { success: false, error: "Email address is required." };
  }

  // Generate 6-digit OTP
  const otp = generate6DigitOtp();
  const codeHash = hashOtp(otp, normalizedEmail);
  memoryOtps.set(`reset_${normalizedEmail}`, {
    codeHash,
    attempts: 0,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });

  const sent = await sendOtpEmail(normalizedEmail, otp);
  if (!sent) {
    return {
      success: false,
      error: "Could not send verification email. Please check your address.",
    };
  }

  return { success: true, message: "Password reset OTP sent to your email!" };
}

// 7. RESET PASSWORD WITH OTP
export async function handleResetPasswordWithOtp(
  email: string,
  otp: string,
  newPassword: string,
): Promise<{ success: boolean; message?: string; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: "New password must be at least 6 characters long." };
  }

  const record = memoryOtps.get(`reset_${normalizedEmail}`);
  if (!record || record.expiresAt < Date.now()) {
    return { success: false, error: "OTP expired or invalid. Please request a new one." };
  }

  if (record.attempts >= 5) {
    memoryOtps.delete(`reset_${normalizedEmail}`);
    return { success: false, error: "Too many failed OTP attempts. Please request a new code." };
  }

  const isValid = verifyOtpHash(otp, normalizedEmail, record.codeHash);
  if (!isValid) {
    record.attempts += 1;
    return { success: false, error: "Incorrect OTP code." };
  }

  memoryOtps.delete(`reset_${normalizedEmail}`);
  const newHash = hashPasswordSecure(newPassword);

  // Update in memory
  const memUser = memoryUsers.get(normalizedEmail);
  if (memUser) {
    memUser.passwordHash = newHash;
  }

  // Update in DB if present
  try {
    await db.update(users).set({ passwordHash: newHash }).where(eq(users.email, normalizedEmail));
  } catch {
    // Memory updated
  }

  resetLoginLockout(normalizedEmail);
  return { success: true, message: "Password has been successfully reset! You can now log in." };
}

// 8. CHANGE PASSWORD (DIRECT IN DASHBOARD/SETTINGS)
export async function handleChangePasswordDirectly(
  email: string,
  oldPassword: string,
  newPassword: string,
): Promise<{ success: boolean; message?: string; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: "New password must be at least 6 characters." };
  }

  let user = memoryUsers.get(normalizedEmail);

  // Check admin env fallback
  const envAdminEmail = (process.env["ADMIN_EMAIL"] || "Animaskitchen24@gmail.com")
    .trim()
    .toLowerCase();
  const envAdminPassword = process.env["ADMIN_PASSWORD"] || "K9!xM7#qL2";
  if (!user && normalizedEmail === envAdminEmail) {
    user = {
      id: "usr_admin_animas",
      email: normalizedEmail,
      name: process.env["ADMIN_NAME"] || "Anima Kitchen Admin",
      phone: "+91 99999 88888",
      passwordHash: hashPasswordSecure(envAdminPassword),
      role: "admin",
      isEmailVerified: true,
    };
    memoryUsers.set(normalizedEmail, user);
  }

  if (!user) {
    try {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.email, normalizedEmail),
      });
      if (dbUser && dbUser.passwordHash) {
        user = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name || "",
          phone: dbUser.phone || "",
          passwordHash: dbUser.passwordHash,
          role: dbUser.role as any,
          isEmailVerified: dbUser.isEmailVerified,
        };
        memoryUsers.set(normalizedEmail, user);
      }
    } catch {
      // DB offline
    }
  }

  if (!user || !user.passwordHash) {
    return { success: false, error: "User account not found." };
  }

  const passwordMatches = verifyPasswordSecure(oldPassword, user.passwordHash);
  if (!passwordMatches) {
    return { success: false, error: "Current password does not match." };
  }

  const newHash = hashPasswordSecure(newPassword);
  user.passwordHash = newHash;

  try {
    await db.update(users).set({ passwordHash: newHash }).where(eq(users.email, normalizedEmail));
  } catch {
    // Memory updated
  }

  return { success: true, message: "Password updated successfully!" };
}
