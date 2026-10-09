import { z } from "zod";

// Pricing calculation schema
export const PriceCalculationItemSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().int().positive(),
  selectedAddonIds: z.array(z.string()).default([]),
  sizeVariantName: z.string().optional(),
});

export const CalculatePriceRequestSchema = z.object({
  items: z.array(PriceCalculationItemSchema).min(1),
  couponCode: z.string().optional(),
  useWalletPaise: z.number().int().nonnegative().default(0),
  zoneId: z.string().optional(),
  orderType: z.enum(["delivery", "pickup"]).default("delivery"),
});

export interface PriceBreakdown {
  itemsTotalPaise: number;
  deliveryFeePaise: number;
  discountPaise: number;
  taxPaise: number;
  walletUsedPaise: number;
  finalTotalPaise: number;
  couponApplied?: {
    code: string;
    discountPaise: number;
  };
}

// Server-side authoritative price calculation logic
export function calculateServerOrderPrice(
  items: Array<{
    pricePaise: number;
    quantity: number;
    addonsTotalPaise: number;
    variantOffsetPaise: number;
  }>,
  options: {
    coupon?: {
      code: string;
      discountType: "percentage" | "fixed";
      discountValue: number;
      minOrderPaise: number;
      maxDiscountPaise?: number;
    };
    availableWalletPaise?: number;
    useWalletPaise?: number;
    zoneFeePaise?: number;
    orderType?: "delivery" | "pickup";
    taxRatePercent?: number; // GST (e.g. 5%)
  },
): PriceBreakdown {
  const taxRatePercent = options.taxRatePercent ?? 5;

  // 1. Calculate items total strictly from authoritative DB prices
  const itemsTotalPaise = items.reduce((acc, item) => {
    const unitPrice = item.pricePaise + item.variantOffsetPaise + item.addonsTotalPaise;
    return acc + unitPrice * item.quantity;
  }, 0);

  // 2. Validate & calculate coupon discount
  let discountPaise = 0;
  let couponApplied: { code: string; discountPaise: number } | undefined = undefined;

  if (options.coupon && itemsTotalPaise >= options.coupon.minOrderPaise) {
    if (options.coupon.discountType === "percentage") {
      discountPaise = Math.round((itemsTotalPaise * options.coupon.discountValue) / 100);
      if (options.coupon.maxDiscountPaise && discountPaise > options.coupon.maxDiscountPaise) {
        discountPaise = options.coupon.maxDiscountPaise;
      }
    } else {
      discountPaise = options.coupon.discountValue;
    }
    couponApplied = {
      code: options.coupon.code,
      discountPaise,
    };
  }

  // 3. Delivery fee (₹0 for pickup or orders above ₹499 free delivery threshold)
  let deliveryFeePaise = 0;
  if (options.orderType !== "pickup") {
    if (itemsTotalPaise >= 49900) {
      deliveryFeePaise = 0; // Free delivery
    } else {
      deliveryFeePaise = options.zoneFeePaise ?? 4000; // default ₹40
    }
  }

  // 4. Tax (GST)
  const taxableBasePaise = Math.max(0, itemsTotalPaise - discountPaise);
  const taxPaise = Math.round((taxableBasePaise * taxRatePercent) / 100);

  // 5. Total before wallet
  const subtotalBeforeWallet = taxableBasePaise + deliveryFeePaise + taxPaise;

  // 6. Wallet deduction (never exceed actual subtotal or user balance)
  const userWalletBalance = options.availableWalletPaise ?? 0;
  const requestedWallet = options.useWalletPaise ?? 0;
  const maxApplicableWallet = Math.min(userWalletBalance, requestedWallet, subtotalBeforeWallet);
  const walletUsedPaise = Math.max(0, maxApplicableWallet);

  // 7. Final Total
  const finalTotalPaise = subtotalBeforeWallet - walletUsedPaise;

  return {
    itemsTotalPaise,
    deliveryFeePaise,
    discountPaise,
    taxPaise,
    walletUsedPaise,
    finalTotalPaise,
    couponApplied,
  };
}
