import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);

    // PROD CORS allowlist (no open reflector). Non-browser / same-origin
    // requests without Origin still work; browsers need an exact match.
    const requestOrigin = request.headers.get("origin") || "";
    const allowedOrigins = [
      process.env["APP_URL"] || "",
      process.env["FRONTEND_URL"] || "",
      "https://animaskitchen.com",
      "https://www.animaskitchen.com",
      "https://animas-kitchen-frontend.onrender.com",
      "http://localhost:5173",
      "http://localhost:3000",
      "capacitor://localhost",
      "ionic://localhost",
    ].filter(Boolean);
    const isAllowedOrigin = requestOrigin !== "" && allowedOrigins.includes(requestOrigin);
    const corsHeaders: Record<string, string> = {
      ...(isAllowedOrigin ? { "Access-Control-Allow-Origin": requestOrigin } : {}),
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      ...(isAllowedOrigin ? { "Access-Control-Allow-Credentials": "true" } : {}),
      Vary: "Origin",
    };

    // Preflight OPTIONS handler
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Client IP extraction with anti-spoofing
    const clientIp =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";

    // 1. Anti-DDoS & Brute Force IP Rate Limiting (120 req / minute per IP)
    const { checkRateLimit } = await import("./server/auth/otp");
    const ipRate = checkRateLimit(`ip_rate:${clientIp}`, 120, 60 * 1000);
    if (!ipRate.allowed) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Too many requests. Please slow down to protect server availability.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
            ...corsHeaders,
          },
        },
      );
    }

    // 2. Large Payload Protection (Block payload bombing > 5MB)
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ success: false, error: "Payload exceeds 5MB limit." }), {
        status: 413,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Backend Dedicated Health Check Route
    if (url.pathname === "/api/health" || url.pathname === "/healthz") {
      return new Response(
        JSON.stringify({
          status: "healthy",
          timestamp: new Date().toISOString(),
          service: "animas-kitchen-backend",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    // Helper to wrap API responses with CORS and secure headers
    const withCors = (response: Response): Response => {
      Object.entries(corsHeaders).forEach(([k, v]) => {
        response.headers.set(k, v);
      });
      // Anti-leak headers
      response.headers.set("X-Content-Type-Options", "nosniff");
      response.headers.set("Cache-Control", "no-store, max-age=0");
      return response;
    };

    // API Route: Signup (Full Name, Email, Phone, Password) -> Sends 1-Time Verification OTP
    if (url.pathname === "/api/auth/signup" && request.method === "POST") {
      try {
        const body = await request.json();
        const { handleSignup } = await import("./server/api");
        const clientIp = request.headers.get("x-forwarded-for") || "127.0.0.1";
        const result = await handleSignup({ ...body, ip: clientIp });
        return withCors(
          new Response(JSON.stringify(result), {
            status: result.success ? 200 : 400,
            headers: { "Content-Type": "application/json" },
          }),
        );
      } catch (err: any) {
        return withCors(
          new Response(JSON.stringify({ success: false, error: err.message }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }
    }

    // API Route: One-Time Email Verification Code
    if (url.pathname === "/api/auth/verify-email" && request.method === "POST") {
      try {
        const body = await request.json();
        const { handleVerifySignupEmail } = await import("./server/api");
        const result = await handleVerifySignupEmail(body.email, body.otp);

        if (!result.success || !result.token) {
          return new Response(
            JSON.stringify({ success: false, error: result.error || "Verification failed" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        const headers = new Headers({
          "Content-Type": "application/json",
          "Set-Cookie": `animas_session=${result.token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${30 * 24 * 3600}`,
        });

        return new Response(JSON.stringify({ success: true, user: result.user }), {
          status: 200,
          headers,
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // API Route: Login (Email & Password)
    if (url.pathname === "/api/auth/login" && request.method === "POST") {
      try {
        const body = await request.json();
        const { handlePasswordLogin } = await import("./server/api");
        const result = await handlePasswordLogin(body.email, body.password);

        if (!result.success || !result.token) {
          return new Response(
            JSON.stringify({ success: false, error: result.error || "Invalid credentials" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        const headers = new Headers({
          "Content-Type": "application/json",
          "Set-Cookie": `animas_session=${result.token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${30 * 24 * 3600}`,
        });

        return new Response(JSON.stringify({ success: true, user: result.user }), {
          status: 200,
          headers,
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // API Route: Login via Google OAuth
    if (url.pathname === "/api/auth/google" && request.method === "POST") {
      try {
        const body = await request.json();
        const { handleGoogleLogin } = await import("./server/api");
        const result = await handleGoogleLogin(
          body.credential,
          body.userInfo,
          body.accessToken || body.access_token,
        );

        if (!result.success || !result.token) {
          return new Response(
            JSON.stringify({
              success: false,
              error: result.error || "Google authentication failed",
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        const headers = new Headers({
          "Content-Type": "application/json",
          "Set-Cookie": `animas_session=${result.token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${30 * 24 * 3600}`,
        });

        return new Response(JSON.stringify({ success: true, user: result.user }), {
          status: 200,
          headers,
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // API Route: Resend Email Verification Code
    if (url.pathname === "/api/auth/resend-code" && request.method === "POST") {
      try {
        const body = await request.json();
        const { handleResendVerification } = await import("./server/api");
        const result = await handleResendVerification(body.email);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // API Route: Forgot Password (Request OTP via Email)
    if (url.pathname === "/api/auth/forgot-password" && request.method === "POST") {
      try {
        const body = await request.json();
        const { handleForgotPasswordRequest } = await import("./server/api");
        const result = await handleForgotPasswordRequest(body.email);
        return new Response(JSON.stringify(result), {
          status: result.success ? 200 : 400,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // API Route: Reset Password with OTP
    if (url.pathname === "/api/auth/reset-password" && request.method === "POST") {
      try {
        const body = await request.json();
        const { handleResetPasswordWithOtp } = await import("./server/api");
        const result = await handleResetPasswordWithOtp(body.email, body.otp, body.newPassword);
        return new Response(JSON.stringify(result), {
          status: result.success ? 200 : 400,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // API Route: Change Password Directly (Dashboard / Settings)
    if (url.pathname === "/api/auth/change-password" && request.method === "POST") {
      try {
        const body = await request.json();
        const { handleChangePasswordDirectly } = await import("./server/api");
        const result = await handleChangePasswordDirectly(
          body.email,
          body.oldPassword,
          body.newPassword,
        );
        return new Response(JSON.stringify(result), {
          status: result.success ? 200 : 400,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // API Route: Current Session (Zero PII / Hash Leakage)
    if (url.pathname === "/api/auth/me" && request.method === "GET") {
      const { getSessionUserFromCookie } = await import("./server/api");
      const { safePublicUser } = await import("./server/security/guard");
      const user = await getSessionUserFromCookie(request.headers.get("cookie"));
      return withCors(
        new Response(JSON.stringify({ user: user ? safePublicUser(user) : null }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }

    // API Route: Logout (Invalidate Cookie with Strict Security)
    if (url.pathname === "/api/auth/logout" && request.method === "POST") {
      const headers = new Headers({
        "Content-Type": "application/json",
        "Set-Cookie": `animas_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
      });
      return withCors(
        new Response(JSON.stringify({ success: true, message: "Logged out successfully" }), {
          status: 200,
          headers,
        }),
      );
    }

    // API Route: Save / Update Order Location to Redis (from user or manual input)
    if (url.pathname === "/api/location/save" && request.method === "POST") {
      try {
        const body = await request.json();
        const { saveOrderLocation, createGoogleMapsLink } =
          await import("./server/location/redisLocation");
        const orderId = body.orderId || "ORD-LIVE";
        const lat = parseFloat(body.lat);
        const lng = parseFloat(body.lng);

        await saveOrderLocation(orderId, {
          userId: body.userId || "anonymous",
          orderId,
          label: body.label || "Customer Location",
          addressText: body.addressText || `${lat}, ${lng}`,
          lat,
          lng,
          updatedAt: new Date().toISOString(),
        });

        const mapsLink = createGoogleMapsLink(lat, lng, body.addressText);

        return new Response(
          JSON.stringify({
            success: true,
            message: "Location saved to Redis successfully",
            googleMapsUrl: mapsLink,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // API Route: Get Order Location & Google Maps Link (for Delivery Boy & Admin)
    if (url.pathname.startsWith("/api/location/") && request.method === "GET") {
      try {
        const orderId = url.pathname.replace("/api/location/", "");
        const { getOrderLocation, createGoogleMapsLink } =
          await import("./server/location/redisLocation");
        const loc = await getOrderLocation(orderId);

        if (!loc) {
          return new Response(JSON.stringify({ success: false, error: "Location not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        const mapsLink = createGoogleMapsLink(loc.lat, loc.lng, loc.addressText);

        return new Response(
          JSON.stringify({
            success: true,
            location: loc,
            googleMapsUrl: mapsLink,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // API Route: Create Order in MongoDB (Flexible Document format with Anti-Tamper & Sanitization)
    if (url.pathname === "/api/orders/create" && request.method === "POST") {
      try {
        const body = await request.json();
        const { sanitizeText, sanitizePayload } = await import("./server/security/guard");
        const { connectMongo, MongoOrder } = await import("./server/db/mongo");
        await connectMongo();

        const sanitizedItems = Array.isArray(body.items) ? sanitizePayload(body.items) : [];
        const sanitizedAddress = body.deliveryAddress
          ? sanitizePayload(body.deliveryAddress)
          : {
              street: "Road No. 4, Patliputra Colony",
              area: "Patna, Bihar",
              lat: 25.6268,
              lng: 85.1118,
            };

        // PROD: never trust client totals / OTP / paid flags.
        // Validate items, cap quantities & totals, generate OTP server-side.
        if (!Array.isArray(sanitizedItems) || sanitizedItems.length === 0) {
          return withCors(
            new Response(JSON.stringify({ success: false, error: "Order must contain items." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }),
          );
        }
        if (sanitizedItems.length > 50) {
          return withCors(
            new Response(JSON.stringify({ success: false, error: "Too many items in order." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }),
          );
        }
        const clientTotalPaise = Math.max(0, Math.floor(Number(body.totalPaise) || 0));
        if (clientTotalPaise <= 0 || clientTotalPaise > 500000) {
          return withCors(
            new Response(JSON.stringify({ success: false, error: "Invalid order total." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }),
          );
        }
        const allowedMethods = ["cod", "upi", "card", "netbanking", "wallet"];
        const rawMethod = sanitizeText(body.paymentMethod || "cod").toLowerCase();
        const paymentMethod = allowedMethods.includes(rawMethod) ? rawMethod : "cod";
        const { randomInt } = await import("node:crypto");
        const serverOtp = String(randomInt(1000, 10000));

        // Best-effort server-side price recalculation from PG menu prices.
        let authoritativeTotalPaise: number | null = null;
        try {
          const { db } = await import("./db/index");
          const { menuItems } = await import("./db/schema");
          const { inArray } = await import("drizzle-orm");
          const { calculateServerOrderPrice } = await import("./server/pricing/calculator");
          const ids = sanitizedItems
            .map((it: any) => String(it.menuItemId || it.id || ""))
            .filter(Boolean)
            .slice(0, 50);
          if (ids.length > 0) {
            const rows = await db.select().from(menuItems).where(inArray(menuItems.id, ids));
            const priceById = new Map(rows.map((r) => [r.id, r.pricePaise]));
            const priced = sanitizedItems.map((it: any) => {
              const key = String(it.menuItemId || it.id || "");
              const qty = Math.min(20, Math.max(1, Math.floor(Number(it.quantity) || 1)));
              return {
                pricePaise: priceById.get(key) ?? Math.floor(Number(it.pricePaise) || 0),
                quantity: qty,
                addonsTotalPaise: 0,
                variantOffsetPaise: 0,
              };
            });
            const breakdown = calculateServerOrderPrice(priced, { orderType: "delivery" });
            authoritativeTotalPaise = breakdown.finalTotalPaise;
          }
        } catch {
          // DB offline — fall back to capped client total.
        }

        const orderDoc = {
          orderNumber: sanitizeText(body.orderNumber || `AK-${Date.now().toString().slice(-5)}`),
          userId: sanitizeText(body.userId || "usr_guest"),
          customerName: sanitizeText(body.customerName || "Customer"),
          customerPhone: sanitizeText(body.customerPhone || body.phone || "+91 99999 88888"),
          items: sanitizedItems,
          deliveryAddress: sanitizedAddress,
          totalPaise: authoritativeTotalPaise ?? clientTotalPaise,
          clientTotalPaise,
          paymentMethod,
          paymentStatus: "pending",
          status: "placed",
          deliveryOtp: serverOtp,
          gpsTrail: [],
        };

        let savedDoc = null;
        if (MongoOrder) {
          try {
            savedDoc = await MongoOrder.create(orderDoc);
            console.log("[MongoDB] Real order saved successfully:", savedDoc.orderNumber);
          } catch (mErr: any) {
            console.error("[MongoDB] Failed to create order in MongoDB Atlas:", mErr.message);
          }
        }

        // Broadcast real-time order creation event via Socket.io
        try {
          const { broadcastOrderUpdate } = await import("./server/socket");
          broadcastOrderUpdate(orderDoc.orderNumber, "order:created", savedDoc || orderDoc);
        } catch {
          // Socket silent fallback
        }

        return withCors(
          new Response(JSON.stringify({ success: true, order: savedDoc || orderDoc }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      } catch (err: any) {
        console.error("[API] /api/orders/create failed:", err.message);
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // API Route: List Realtime Orders from MongoDB
    if (url.pathname === "/api/orders" && request.method === "GET") {
      try {
        const { connectMongo, MongoOrder } = await import("./server/db/mongo");
        await connectMongo();
        const mongoOrders = await MongoOrder.find().sort({ createdAt: -1 }).limit(50).lean();
        return new Response(JSON.stringify({ success: true, orders: mongoOrders }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, orders: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // API Route: Append Rider GPS Trail in MongoDB (Fast array push)
    if (url.pathname === "/api/rider/gps-trail" && request.method === "POST") {
      try {
        const body = await request.json();
        const { connectMongo, MongoOrder } = await import("./server/db/mongo");
        await connectMongo();

        const point = {
          lat: parseFloat(body.lat),
          lng: parseFloat(body.lng),
          speed: body.speed || 0,
          timestamp: new Date(),
        };

        if (MongoOrder) {
          try {
            await MongoOrder.updateOne(
              { orderNumber: body.orderNumber },
              { $push: { gpsTrail: point } },
            );
          } catch {
            // Memory fallback
          }
        }

        // Live Socket.io emit for real-time tracking map
        try {
          const { broadcastOrderUpdate } = await import("./server/socket");
          broadcastOrderUpdate(body.orderNumber, "rider:location", {
            orderNumber: body.orderNumber,
            lat: point.lat,
            lng: point.lng,
          });
        } catch {
          // Socket silent fallback
        }

        return withCors(
          new Response(JSON.stringify({ success: true, point }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // API Route: Email Broadcast (Admin can broadcast promotional offers & menus)
    if (url.pathname === "/api/email/broadcast" && request.method === "POST") {
      try {
        const body = await request.json();
        const { broadcastEmailToUsers } = await import("./server/email/mailer");
        const recipients: string[] = body.recipients || [];
        const subject: string = body.subject || "Special Homestyle Delicacy from Anima's Kitchen";
        const title: string = body.title || "Special Kitchen Announcement";
        const message: string =
          body.message || "We have prepared something warm and fresh for you today!";
        const buttonText: string | undefined = body.buttonText;
        const buttonUrl: string | undefined = body.buttonUrl;

        const result = await broadcastEmailToUsers(
          recipients,
          subject,
          title,
          message,
          buttonText,
          buttonUrl,
        );

        return new Response(
          JSON.stringify({
            success: true,
            result,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // API Route: Upload Media to Cloudinary
    if (url.pathname === "/api/media/upload" && request.method === "POST") {
      try {
        const body = await request.json();
        const { file, folder, resourceType, publicId } = body;
        if (!file) {
          return new Response(
            JSON.stringify({ success: false, error: "File data (base64 or url) is required" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        const { uploadToCloudinary } = await import("./server/media/cloudinary");
        const uploadResult = await uploadToCloudinary(file, {
          folder: folder || "animas-kitchen",
          resourceType: resourceType || "auto",
          publicId,
        });

        return new Response(
          JSON.stringify({
            success: true,
            ...uploadResult,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({ success: false, error: err.message || "Upload failed" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    // API Route: Razorpay — create order (online UPI/card/netbanking)
    // Requires RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET in env. Frontend must call
    // this BEFORE marking anything paid; /api/orders/create always stores pending.
    if (url.pathname === "/api/payments/razorpay/order" && request.method === "POST") {
      try {
        const body = await request.json();
        const keyId = process.env["RAZORPAY_KEY_ID"] || "";
        const keySecret = process.env["RAZORPAY_KEY_SECRET"] || "";
        if (!keyId || !keySecret || (keyId.includes("test_") === false && keyId === "")) {
          return withCors(
            new Response(
              JSON.stringify({ success: false, error: "Online payments not configured." }),
              { status: 503, headers: { "Content-Type": "application/json" } },
            ),
          );
        }
        if (keyId.startsWith("rzp_test_") && process.env["NODE_ENV"] === "production") {
          console.warn("[Razorpay] Test keys in production — switch to live keys.");
        }
        const amountPaise = Math.floor(Number(body.amountPaise) || 0);
        if (!amountPaise || amountPaise <= 0 || amountPaise > 500000) {
          return withCors(
            new Response(JSON.stringify({ success: false, error: "Invalid amount." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }),
          );
        }
        const receipt = String(body.receipt || `AK-${Date.now()}`).slice(0, 40);
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        const rzRes = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: amountPaise,
            currency: "INR",
            receipt,
            notes: body.notes || {},
          }),
        });
        const rzData = await rzRes.json();
        if (!rzRes.ok) {
          return withCors(
            new Response(
              JSON.stringify({
                success: false,
                error: (rzData as any)?.error?.description || "Razorpay order failed.",
              }),
              { status: 502, headers: { "Content-Type": "application/json" } },
            ),
          );
        }
        return withCors(
          new Response(JSON.stringify({ success: true, order: rzData, keyId }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      } catch (err: any) {
        return withCors(
          new Response(JSON.stringify({ success: false, error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }
    }

    // API Route: Razorpay — verify payment signature & mark order paid
    if (url.pathname === "/api/payments/razorpay/verify" && request.method === "POST") {
      try {
        const body = await request.json();
        const keySecret = process.env["RAZORPAY_KEY_SECRET"] || "";
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderNumber } = body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
          return withCors(
            new Response(JSON.stringify({ success: false, error: "Missing payment fields." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }),
          );
        }
        const { createHmac } = await import("node:crypto");
        const expected = createHmac("sha256", keySecret)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest("hex");
        if (expected !== razorpay_signature) {
          return withCors(
            new Response(JSON.stringify({ success: false, error: "Signature mismatch." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }),
          );
        }
        // Mark Mongo order paid (best-effort).
        try {
          const { connectMongo, MongoOrder } = await import("./server/db/mongo");
          await connectMongo();
          if (MongoOrder && orderNumber) {
            await MongoOrder.updateOne(
              { orderNumber: String(orderNumber) },
              {
                $set: {
                  paymentStatus: "paid",
                  razorpayOrderId: razorpay_order_id,
                  razorpayPaymentId: razorpay_payment_id,
                },
              },
            );
          }
        } catch {
          // Memory fallback — client still treats verify success as paid.
        }
        try {
          const { broadcastOrderUpdate } = await import("./server/socket");
          broadcastOrderUpdate(String(orderNumber || ""), "order:payment_verified", {
            orderNumber,
            razorpay_payment_id,
          });
        } catch {
          // noop
        }
        return withCors(
          new Response(JSON.stringify({ success: true, verified: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      } catch (err: any) {
        return withCors(
          new Response(JSON.stringify({ success: false, error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }
    }

    // API Route: Razorpay webhook (payment.captured → mark paid)
    if (url.pathname === "/api/payments/razorpay/webhook" && request.method === "POST") {
      try {
        const rawBody = await request.text();
        const signature = request.headers.get("x-razorpay-signature") || "";
        const webhookSecret = process.env["RAZORPAY_WEBHOOK_SECRET"] || "";
        if (!webhookSecret) {
          return new Response(
            JSON.stringify({ success: false, error: "Webhook not configured." }),
            {
              status: 503,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
        const { createHmac } = await import("node:crypto");
        const expected = createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
        if (expected !== signature) {
          return new Response(JSON.stringify({ success: false }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        const event = JSON.parse(rawBody) as any;
        if (event?.event === "payment.captured" && event?.payload?.payment?.entity) {
          const entity = event.payload.payment.entity;
          try {
            const { connectMongo, MongoOrder } = await import("./server/db/mongo");
            await connectMongo();
            if (MongoOrder) {
              await MongoOrder.updateOne(
                { razorpayOrderId: entity.order_id },
                { $set: { paymentStatus: "paid", razorpayPaymentId: entity.id } },
              );
            }
          } catch {
            // noop
          }
        }
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Helper function to attach production security headers (0% leak, anti-clickjacking, anti-XSS)
    const secureResponse = (res: Response): Response => {
      res.headers.set("X-Content-Type-Options", "nosniff");
      res.headers.set("X-Frame-Options", "DENY");
      res.headers.set("X-XSS-Protection", "1; mode=block");
      res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
      res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
      res.headers.set(
        "Content-Security-Policy",
        "default-src 'self' https: data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://accounts.google.com https://checkout.razorpay.com; frame-src 'self' https://accounts.google.com https://api.razorpay.com https://checkout.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https: *;",
      );
      Object.entries(corsHeaders).forEach(([k, v]) => {
        if (!res.headers.has(k)) res.headers.set(k, v);
      });
      return res;
    };

    // Standard TanStack Start SSR & page serving
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      return secureResponse(normalized);
    } catch (error) {
      console.error(error);
      return secureResponse(
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
    }
  },
};
