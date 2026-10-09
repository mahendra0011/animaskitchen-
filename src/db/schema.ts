import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Users
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").default(""),
  phone: text("phone").default(""),
  passwordHash: text("password_hash"),
  isEmailVerified: boolean("is_email_verified").default(false).notNull(),
  role: text("role", { enum: ["customer", "rider", "admin", "kds"] })
    .default("customer")
    .notNull(),
  status: text("status", { enum: ["active", "suspended"] })
    .default("active")
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Sessions
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(), // Session token hash
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Email OTPs (Secure single-use SHA256 hashed code)
export const emailOtps = pgTable(
  "email_otps",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    codeHash: text("code_hash").notNull(),
    attempts: integer("attempts").default(0).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("email_otp_idx").on(table.email)],
);

// Staff & Rider Invites
export const invites = pgTable("invites", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  role: text("role", { enum: ["rider", "admin", "kds"] }).notNull(),
  branchId: text("branch_id"),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Branches
export const branches = pgTable("branches", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  lat: text("lat").notNull(),
  lng: text("lng").notNull(),
  phone: text("phone").notNull(),
  isOpen: boolean("is_open").default(true).notNull(),
  gstNo: text("gst_no"),
  fssaiNo: text("fssai_no"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Delivery Zones
export const deliveryZones = pgTable("delivery_zones", {
  id: text("id").primaryKey(),
  branchId: text("branch_id")
    .notNull()
    .references(() => branches.id),
  name: text("name").notNull(),
  radiusKm: integer("radius_km").default(5).notNull(),
  feePaise: integer("fee_paise").default(4000).notNull(), // ₹40.00
  minOrderPaise: integer("min_order_paise").default(19900).notNull(), // ₹199.00
  etaMin: integer("eta_min").default(35).notNull(),
});

// Menu Categories
export const menuCategories = pgTable("menu_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

// Menu Items
export const menuItems = pgTable("menu_items", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").notNull(),
  categoryName: text("category_name").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  pricePaise: integer("price_paise").notNull(), // Integer paise
  isVeg: boolean("is_veg").default(true).notNull(),
  image: text("image").notNull(),
  badge: text("badge"),
  isTodaySpecial: boolean("is_today_special").default(false).notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  preparationTimeMinutes: integer("prep_time_minutes").default(20).notNull(),
  rating: text("rating").default("4.8").notNull(),
  reviewCount: integer("review_count").default(0).notNull(),
  isThali: boolean("is_thali").default(false).notNull(),
  includedItems: jsonb("included_items").$type<string[]>(),
  allowedAddons: jsonb("allowed_addons").$type<string[]>(),
  nutrition: jsonb("nutrition").$type<{
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  }>(),
  sizeVariants: jsonb("size_variants").$type<Array<{ name: string; priceOffset: number }>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Thali Add-ons
export const thaliAddons = pgTable("thali_addons", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  portion: text("portion").notNull(),
  pricePaise: integer("price_paise").notNull(),
  description: text("description"),
  isVeg: boolean("is_veg").default(true).notNull(),
});

// Delivery Addresses
export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  label: text("label", { enum: ["Home", "Office", "Other"] }).notNull(),
  street: text("street").notNull(),
  area: text("area").notNull(),
  city: text("city").notNull(),
  pincode: text("pincode").notNull(),
  landmark: text("landmark"),
  lat: text("lat").notNull(),
  lng: text("lng").notNull(),
  contactName: text("contact_name").notNull(),
  contactPhone: text("contact_phone").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Orders
export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey(), // e.g. ORD-1024
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    branchId: text("branch_id")
      .notNull()
      .references(() => branches.id),
    status: text("status", {
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
    })
      .default("placed")
      .notNull(),
    deliveryStep: text("delivery_step", {
      enum: [
        "assigned",
        "accepted",
        "arrived_at_kitchen",
        "picked_up",
        "out_for_delivery",
        "reached_customer",
        "otp_verified",
        "delivered",
      ],
    }),
    orderType: text("order_type", { enum: ["delivery", "pickup"] })
      .default("delivery")
      .notNull(),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),

    // Snapshots & Financials (in Paise)
    addressSnapshot: jsonb("address_snapshot").notNull(),
    itemsSnapshot: jsonb("items_snapshot").notNull(),
    itemTotalPaise: integer("item_total_paise").notNull(),
    deliveryFeePaise: integer("delivery_fee_paise").default(0).notNull(),
    taxPaise: integer("tax_paise").default(0).notNull(),
    discountPaise: integer("discount_paise").default(0).notNull(),
    walletUsedPaise: integer("wallet_used_paise").default(0).notNull(),
    totalPaise: integer("total_paise").notNull(),

    couponCode: text("coupon_code"),
    paymentMethod: text("payment_method", { enum: ["razorpay", "cod", "wallet"] }).notNull(),
    paymentStatus: text("payment_status", { enum: ["pending", "captured", "failed", "refunded"] })
      .default("pending")
      .notNull(),
    deliveryOtpHash: text("delivery_otp_hash"), // 4-digit handover OTP hashed

    riderId: uuid("rider_id").references(() => users.id),
    kotId: text("kot_id"),
    etaMin: integer("eta_min").default(35).notNull(),
    instructions: text("instructions"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("order_user_idx").on(table.userId),
    index("order_branch_status_idx").on(table.branchId, table.status),
  ],
);

// Coupons
export const coupons = pgTable("coupons", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  discountType: text("discount_type", { enum: ["percentage", "fixed"] }).notNull(),
  discountValue: integer("discount_value").notNull(), // percentage or paise
  minOrderPaise: integer("min_order_paise").default(0).notNull(),
  maxDiscountPaise: integer("max_discount_paise"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  isActive: boolean("is_active").default(true).notNull(),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0).notNull(),
});

// Wallet Ledgers
export const customerWallets = pgTable("customer_wallets", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  balancePaise: integer("balance_paise").default(0).notNull(),
  cashbackEarnedPaise: integer("cashback_earned_paise").default(0).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const walletTransactions = pgTable("wallet_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amountPaise: integer("amount_paise").notNull(), // positive for credit, negative for debit
  type: text("type", { enum: ["credit", "debit"] }).notNull(),
  description: text("description").notNull(),
  orderId: text("order_id").references(() => orders.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// KOT Tickets (Kitchen Order Tickets)
export const kotTickets = pgTable("kot_tickets", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  branchId: text("branch_id")
    .notNull()
    .references(() => branches.id),
  station: text("station", {
    enum: ["Tawa / Breads", "Handi & Curry", "Packing & Thali Assembly"],
  }).notNull(),
  items: jsonb("items").notNull(),
  priority: text("priority", { enum: ["normal", "rush", "vip"] })
    .default("normal")
    .notNull(),
  status: text("status", { enum: ["new", "preparing", "ready"] })
    .default("new")
    .notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  readyAt: timestamp("ready_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Inventory Items
export const inventoryItems = pgTable("inventory_items", {
  id: text("id").primaryKey(),
  branchId: text("branch_id")
    .notNull()
    .references(() => branches.id),
  name: text("name").notNull(),
  category: text("category").notNull(),
  stock: integer("stock").notNull(),
  unit: text("unit").notNull(),
  minThreshold: integer("min_threshold").notNull(),
  costPerUnitPaise: integer("cost_per_unit_paise").notNull(),
  supplier: text("supplier").notNull(),
  lastRestocked: timestamp("last_restocked", { withTimezone: true }).defaultNow().notNull(),
});

// Support Tickets
export const supportTickets = pgTable("support_tickets", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  ticketNumber: text("ticket_number").notNull().unique(),
  orderId: text("order_id").references(() => orders.id),
  category: text("category").notNull(),
  description: text("description").notNull(),
  status: text("status", { enum: ["open", "in_progress", "resolved"] })
    .default("open")
    .notNull(),
  messages: jsonb("messages").default([]).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
