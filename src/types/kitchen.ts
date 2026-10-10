export type OrderStatus =
  | "placed"
  | "confirmed"
  | "preparing"
  | "ready"
  | "picked_up"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type DeliveryStep =
  | "assigned"
  | "accepted"
  | "arrived_at_kitchen"
  | "picked_up"
  | "out_for_delivery"
  | "reached_customer"
  | "otp_verified"
  | "delivered";

export interface ThaliAddon {
  id: string;
  code: string;
  name: string;
  portion: string;
  price: number;
  description?: string;
  isVeg: boolean;
}

export interface MenuItemNutrition {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

export interface MenuItemSizeVariant {
  name: string;
  priceOffset: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category:
    | "Thali"
    | "Paneer & Tandoor"
    | "Biryani"
    | "Roti & Rice"
    | "Desserts"
    | "Chai & More"
    | "Combos";
  image: string;
  isVeg: boolean;
  badge?: string | undefined;
  isTodaySpecial?: boolean | undefined;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  rating: number;
  reviewCount: number;
  isThali?: boolean | undefined;
  includedItems?: string[] | undefined;
  allowedAddons?: string[] | undefined; // IDs of ThaliAddon
  nutrition?: MenuItemNutrition | undefined;
  sizeVariants?: MenuItemSizeVariant[] | undefined;
  reviews?:
    | Array<{
        id: string;
        userName: string;
        rating: number;
        comment: string;
        date: string;
      }>
    | undefined;
}

export interface SelectedAddon {
  addon: ThaliAddon;
  quantity: number;
  name?: string;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedAddons: SelectedAddon[];
  specialInstructions?: string;
  itemTotal: number;
  priceAtOrder?: number;
  name?: string;
  price?: number;
  totalPrice?: number;
}

export interface DeliveryAddress {
  id: string;
  label: "Home" | "Office" | "Other" | string;
  street: string;
  area: string;
  city: string;
  pincode: string;
  flatNo?: string;
  tag?: string;
  state?: string;
  landmark?: string;
  isDefault?: boolean;
  instructions?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  contactPhone: string;
  contactName: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  rating: number;
  totalDeliveries: number;
  vehicle: {
    model: string;
    plateNumber: string;
    type: "scooter" | "bike" | "ev";
  };
  vehicleNumber?: string;
  currentLocation: {
    lat: number;
    lng: number;
    heading: number;
  };
  status: "available" | "busy" | "offline";
  avatar: string;
  todayEarnings: number;
  weeklyEarnings: number;
  walletBalance: number;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  timestamp: string;
  description: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: DeliveryAddress;
  items: CartItem[];
  itemTotal: number;
  subtotal?: number;
  taxAmount: number;
  deliveryFee: number;
  discountAmount: number;
  appliedCoupon?: string;
  finalTotal: number;
  paymentMethod: "upi" | "card" | "netbanking" | "cod" | "wallet";
  paymentStatus: "paid" | "pending" | "refunded";
  status: OrderStatus;
  deliveryPartnerId?: string;
  deliveryOtp: string; // 4-digit OTP e.g. "4826"
  estimatedDeliveryMinutes: number;
  estimatedDeliveryTime?: string;
  timeline: OrderTimelineEvent[];
  deliveryInstructions?: string;
  specialInstructions?: string;
  orderType?: "delivery" | "pickup";
  scheduledTime?: string;
  walletDeduction?: number;
  kotTicketId?: string;
  coordinates: {
    kitchen: { lat: number; lng: number };
    currentRider: { lat: number; lng: number; heading?: number };
    customer: { lat: number; lng: number };
    progressRatio: number; // 0 to 1 along simulated route
  };
  currentDeliveryStep: DeliveryStep;
  customerRating?: number;
  customerFeedback?: string;
}

/* =========================================================
   Enterprise Cloud Kitchen & Restaurant Platform Models
   ========================================================= */

export type InventoryCategory =
  "grains" | "dairy" | "vegetables" | "spices" | "oil" | "packaging" | "gas";

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  currentStock: number;
  unit: "kg" | "ltr" | "pcs" | "gms" | "cylinder";
  minStockLevel: number;
  costPerUnit: number;
  supplierName: string;
  lastRestocked: string;
}

export interface RecipeRequirement {
  rawMaterialId: string;
  rawMaterialName: string;
  quantityNeeded: number;
  unit: string;
}

export interface RecipeCosting {
  itemId: string;
  itemName: string;
  rawMaterialCost: number;
  packagingCost: number;
  kitchenCost: number;
  deliveryAlloc: number;
  sellingPrice: number;
  foodCostPercent: number;
  profitMargin: number;
  requirements: RecipeRequirement[];
}

export type StaffRole =
  "Super Admin" | "Hub Manager" | "Head Chef" | "Kitchen Staff" | "Dispatcher" | "Accountant";

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  shift: "Morning (7AM - 3PM)" | "Evening (3PM - 11PM)" | "Full Day (8AM - 8PM)";
  onDuty: boolean;
  attendanceRate: number;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  activeOrders: number;
  dailyRevenue: number;
  phone: string;
  status: "active" | "busy";
}

export type TicketIssueType =
  | "missing_item"
  | "wrong_item"
  | "wrong_order"
  | "delayed_delivery"
  | "food_quality"
  | "payment_refund";

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerPhone?: string;
  phone?: string;
  orderNumber?: string;
  orderId?: string;
  issueType: TicketIssueType;
  description?: string;
  message?: string;
  priority?: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
}

export type KitchenStation = "Tawa Station" | "Handi & Curry" | "Packing Station";

export interface KOTTicket {
  id: string;
  orderNumber: string;
  items: { name: string; quantity: number; notes?: string }[];
  station: KitchenStation;
  prepTimeMinutes: number;
  isPriority: boolean;
  isDelayed: boolean;
  notes?: string;
  status: "new" | "preparing" | "ready";
  createdAt: string;
}

export interface LoyaltyProfile {
  points: number;
  tier: "Silver" | "Gold" | "Platinum";
  referralCode: string;
  totalReferrals: number;
  referralEarnings: number;
}

export interface WalletTransaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
}

export interface CustomerWallet {
  balance: number;
  transactions: WalletTransaction[];
}

export interface DeliveryZone {
  id: string;
  name: string;
  radiusKm: string;
  deliveryFee: number;
  freeAboveOrder: number;
  minOrder: number;
  localities?: string[];
  conditions?: string;
}

export interface GSTInvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
  hsnCode: string;
}

export interface GSTInvoice {
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: GSTInvoiceItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMode: string;
  gstin: string;
}

export interface WhatsAppLog {
  id: string;
  timestamp: string;
  recipientPhone: string;
  recipientName: string;
  event:
    | "order_confirmed"
    | "preparing"
    | "rider_assigned"
    | "out_for_delivery"
    | "delivered"
    | "subscription_reminder";
  message: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: "flat" | "percent";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  usageCount: number;
  isActive: boolean;
}

export interface TiffinPlan {
  id: string;
  name: string;
  planType: "daily" | "weekly" | "monthly";
  mealSlot: "lunch" | "dinner" | "both";
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface ActiveSubscription {
  id: string;
  planId: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: "active" | "paused" | "expired";
  mealSlot: "lunch" | "dinner" | "both";
  deliveryAddress: DeliveryAddress;
  pausedDates: string[]; // YYYY-MM-DD
  totalDays: number;
  daysRemaining: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  role: "system" | "customer" | "admin" | "kitchen" | "rider";
  action: string;
  details: string;
  relatedOrderId?: string;
}

export interface CustomerProfile {
  id?: string;
  name: string;
  phone: string;
  email: string;
  savedAddresses: DeliveryAddress[];
  defaultAddressId: string;
  totalOrdersCount: number;
  totalSpend: number;
  favoriteItemIds: string[];
}

export interface HomepageCustomization {
  festivalBannerActive: boolean;
  festivalBannerText: string;
  festivalBadge: string;
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroTagline: string;
  heroImageUrl?: string;
  posterBannerActive?: boolean;
  posterBannerTitle?: string;
  posterBannerDescription?: string;
  posterBannerImageUrl?: string;
  specialOfferBannerText: string;
  announcementColor: "saffron" | "spice" | "emerald" | "purple";
  ctaButtonText: string;
  festivalCouponCode?: string;
}

export interface SocialPost {
  id: string;
  imageUrl: string;
  caption: string;
  postUrl: string;
  platform: "instagram" | "facebook";
  likesCount?: number;
  commentsCount?: number;
  createdAt: string;
}

export interface KitchenVideo {
  id: string;
  title: string;
  description?: string;
  videoUrl: string; // Direct MP4 or YouTube embed/watch link or Cloudinary URL
  thumbnailUrl?: string;
  sourceType: "local" | "youtube" | "cloudinary";
  youtubeId?: string;
  viewsCount?: number;
  likesCount?: number;
  duration?: string;
  tags?: string[];
  createdAt: string;
}

export interface DaySpecialMeal {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday" | "Daily";
  active: boolean;
  title: string;
  badge: string;
  dishName: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  isVeg: boolean;
  itemsIncluded: string[];
}

