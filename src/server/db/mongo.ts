import mongoose from "mongoose";
import dns from "node:dns";

// Windows Node.js local ISP resolver often fails on SRV records (_mongodb._tcp)
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch {
  // Use default
}

export async function connectMongo(): Promise<typeof mongoose | null> {
  const uri = process.env["MONGODB_URI"];
  if (!uri) {
    console.warn("[MongoDB] No MONGODB_URI provided in environment.");
    return null;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  try {
    try {
      dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
    } catch {
      // Use system default
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });
    console.log("[MongoDB] Connected successfully to Document Store");
    return conn;
  } catch (err: any) {
    console.warn("[MongoDB] Connection failed:", err.message);
    return null;
  }
}

// -----------------------------------------------------------------------------
// 1. Order Document Schema (Flexible Thalis, Custom Addons, Live Items)
// -----------------------------------------------------------------------------
const OrderItemSchema = new mongoose.Schema({
  menuItemId: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  pricePaise: { type: Number, required: true },
  selectedAddons: [
    {
      code: String,
      name: String,
      portion: String,
      pricePaise: Number,
      quantity: Number,
    },
  ],
  specialInstructions: String,
});

const GpsBreadcrumbSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  speed: Number,
});

const MongoOrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    customerName: String,
    customerPhone: String,
    items: [OrderItemSchema],
    deliveryAddress: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "preparing",
        "ready",
        "picked_up",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "placed",
    },
    deliveryOtp: { type: String, default: "4521" },
    // Live GPS Trail of the delivery rider
    gpsTrail: [GpsBreadcrumbSchema],
    totalPaise: { type: Number, required: true },
    paymentMethod: { type: String, default: "cod" },
  },
  { timestamps: true },
);

export const MongoOrder =
  mongoose.models["MongoOrder"] || mongoose.model("MongoOrder", MongoOrderSchema);

// -----------------------------------------------------------------------------
// 2. Customer Support Chat Thread Schema (Nested Message Array)
// -----------------------------------------------------------------------------
const TicketMessageSchema = new mongoose.Schema({
  senderId: String,
  senderRole: { type: String, enum: ["customer", "admin", "agent"], default: "customer" },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const MongoSupportTicketSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    customerName: String,
    customerPhone: String,
    orderNumber: String,
    issueType: { type: String, required: true },
    status: { type: String, enum: ["open", "in_progress", "resolved"], default: "open" },
    messages: [TicketMessageSchema],
  },
  { timestamps: true },
);

export const MongoSupportTicket =
  mongoose.models["MongoSupportTicket"] ||
  mongoose.model("MongoSupportTicket", MongoSupportTicketSchema);

// -----------------------------------------------------------------------------
// 3. Email Broadcast & Audit Activity Log Schema
// -----------------------------------------------------------------------------
const MongoAuditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // e.g. "EMAIL_BROADCAST", "PRICE_UPDATE"
    actor: { type: String, default: "system" },
    metadata: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const MongoAuditLog =
  mongoose.models["MongoAuditLog"] || mongoose.model("MongoAuditLog", MongoAuditLogSchema);
