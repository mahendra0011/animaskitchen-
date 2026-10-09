import Redis from "ioredis";

const redisUrl = process.env["REDIS_URL"];

// In-memory fallback if Redis URL is not provided
const memoryStore = new Map<string, string>();

let redisClient: Redis | null = null;

if (redisUrl) {
  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      lazyConnect: true,
    });
    redisClient.connect().catch((err) => {
      console.warn("[Redis] Connection error, falling back to in-memory store:", err.message);
      redisClient = null;
    });
  } catch (err: any) {
    console.warn("[Redis] Initialization failed:", err.message);
    redisClient = null;
  }
}

export interface UserLocationPayload {
  userId: string;
  orderId?: string;
  label?: string; // e.g. "Home", "Office", "Current GPS"
  addressText: string;
  lat: number;
  lng: number;
  updatedAt: string;
}

// 1. Save or Update User/Order Location in Redis
export async function saveOrderLocation(
  orderId: string,
  location: UserLocationPayload,
): Promise<void> {
  const key = `order_loc:${orderId}`;
  const serialized = JSON.stringify(location);

  if (redisClient) {
    try {
      // Keep location in Redis with 7 days TTL
      await redisClient.set(key, serialized, "EX", 7 * 24 * 3600);
      return;
    } catch {
      // Fallback below
    }
  }

  memoryStore.set(key, serialized);
}

// 2. Retrieve Order Location (Admin & Rider access)
export async function getOrderLocation(orderId: string): Promise<UserLocationPayload | null> {
  const key = `order_loc:${orderId}`;

  if (redisClient) {
    try {
      const data = await redisClient.get(key);
      if (data) return JSON.parse(data) as UserLocationPayload;
    } catch {
      // Fallback below
    }
  }

  const memoryData = memoryStore.get(key);
  return memoryData ? (JSON.parse(memoryData) as UserLocationPayload) : null;
}

// 3. Generate direct universal Google Maps Navigation link
export function createGoogleMapsLink(lat: number, lng: number, label?: string): string {
  const query = encodeURIComponent(`${lat},${lng}${label ? ` (${label})` : ""}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
