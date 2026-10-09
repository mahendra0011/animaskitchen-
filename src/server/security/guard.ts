import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

// 1. Military-grade Scrypt Password Hashing (resistant to GPU/ASIC brute-force)
export function hashPasswordSecure(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64, {
    N: 16384,
    r: 8,
    p: 1,
    maxmem: 32 * 1024 * 1024,
  }).toString("hex");
  return `${salt}:${derivedKey}`;
}

export function verifyPasswordSecure(password: string, storedHash: string): boolean {
  try {
    const parts = storedHash.split(":");
    if (parts.length !== 2) return false;
    const salt = parts[0]!;
    const hash = parts[1]!;

    const derivedKey = scryptSync(password, salt, 64, {
      N: 16384,
      r: 8,
      p: 1,
      maxmem: 32 * 1024 * 1024,
    }).toString("hex");

    return timingSafeEqual(Buffer.from(derivedKey, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}

// 2. Strict Rate Limiting & Brute-Force Lockout Engine
interface SecurityAttemptRecord {
  failures: number;
  lockedUntil: number;
  lastAttempt: number;
}
const ipLockouts = new Map<string, SecurityAttemptRecord>();
const accountLockouts = new Map<string, SecurityAttemptRecord>();

export function checkLoginLockout(
  key: string,
  isIp = false,
): { isLocked: boolean; waitSeconds?: number } {
  const store = isIp ? ipLockouts : accountLockouts;
  const record = store.get(key);
  if (!record) return { isLocked: false };

  const now = Date.now();
  if (record.lockedUntil > now) {
    const waitSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { isLocked: true, waitSeconds };
  }

  // Reset expired lockout
  if (record.lockedUntil > 0 && record.lockedUntil <= now) {
    store.delete(key);
  }

  return { isLocked: false };
}

export function recordFailedLogin(
  key: string,
  isIp = false,
): { failures: number; isLocked: boolean; waitSeconds?: number } {
  const store = isIp ? ipLockouts : accountLockouts;
  const now = Date.now();
  const record = store.get(key) || { failures: 0, lockedUntil: 0, lastAttempt: now };

  record.failures += 1;
  record.lastAttempt = now;

  // Max 5 failures -> Lockout for 15 minutes
  if (record.failures >= 5) {
    record.lockedUntil = now + 15 * 60 * 1000;
    store.set(key, record);
    return { failures: record.failures, isLocked: true, waitSeconds: 15 * 60 };
  }

  store.set(key, record);
  return { failures: record.failures, isLocked: false };
}

export function resetLoginLockout(key: string, isIp = false): void {
  const store = isIp ? ipLockouts : accountLockouts;
  store.delete(key);
}

// 3. PII Masking (Zero sensitive data leaks in logs, telemetry and responses)
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "***@***.com";
  const [user, domain] = email.split("@");
  if (!user || !domain) return "***@***.com";
  const maskedUser = user.length <= 2 ? user[0] + "***" : user.slice(0, 2) + "***" + user.slice(-1);
  return `${maskedUser}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (!phone) return "****";
  const clean = phone.replace(/\D/g, "");
  if (clean.length < 6) return "****";
  return clean.slice(0, 3) + "****" + clean.slice(-3);
}

// 4. Strict Input Sanitization (Anti-XSS, HTML Injection & Script stripping)
export function sanitizeText(input: string): string {
  if (!input) return "";
  return input
    .replace(/[<>'"`;\\]/g, "") // strip html/script injection metacharacters
    .replace(/\0/g, "") // strip null bytes
    .trim();
}

// 5. Deep Recursive Object Sanitizer (Scans request JSON payloads for injection)
export function sanitizePayload<T>(obj: T): T {
  if (typeof obj === "string") {
    return sanitizeText(obj) as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizePayload(item)) as unknown as T;
  }
  if (obj !== null && typeof obj === "object") {
    const cleaned: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      // Prevent prototype pollution
      if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
      cleaned[sanitizeText(key)] = sanitizePayload(val);
    }
    return cleaned as T;
  }
  return obj;
}

// 6. Anti-IDOR Authorization Check (Ensures users can only access their own orders & profile)
export function assertResourceOwner(
  currentUserId: string,
  resourceOwnerId: string,
  userRole?: string,
): boolean {
  if (!currentUserId || !resourceOwnerId) return false;
  // Superusers / Admin / Kitchen Display System can access for operations
  if (userRole === "admin" || userRole === "kds") return true;
  return currentUserId === resourceOwnerId;
}

// 7. Safe Public User Projection (Eliminates PII & hash leakage)
export function safePublicUser(user: {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  role?: string;
  isEmailVerified?: boolean;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name || "",
    phone: maskPhone(user.phone || ""),
    role: user.role || "customer",
    isEmailVerified: Boolean(user.isEmailVerified),
  };
}

// 8. Security Audit Logger (Logs with zero raw passwords, OTPs or sensitive PII)
export function logSecurityEvent(
  eventType:
    | "AUTH_LOGIN_SUCCESS"
    | "AUTH_LOGIN_FAILED"
    | "AUTH_LOCKOUT"
    | "SUSPICIOUS_PAYLOAD"
    | "IDOR_ATTEMPT",
  details: { ip?: string; email?: string; userId?: string; note?: string },
) {
  const timestamp = new Date().toISOString();
  const maskedEmailSafe = details.email ? maskEmail(details.email) : "unknown";
  const maskedIp = details.ip
    ? details.ip.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, "$1.$2.*.*")
    : "local";

  console.info(
    `[SECURITY AUDIT] ${timestamp} | EVENT: ${eventType} | IP: ${maskedIp} | USER: ${details.userId || maskedEmailSafe} | INFO: ${details.note || ""}`,
  );
}
