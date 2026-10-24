export interface TaxPreset {
  id: string;
  emoji: string;
  name: string;
  gstRate: number;
  cgst: number;
  sgst: number;
  packagingFee: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  hsnSacCode: string;
  isGstEnabled: boolean;
  isDefault?: boolean;
}

export const DEFAULT_TAX_PRESETS: TaxPreset[] = [
  {
    id: "5-kitchen",
    emoji: "🍛",
    name: "5% Cloud Kitchen",
    gstRate: 5,
    cgst: 2.5,
    sgst: 2.5,
    packagingFee: 10,
    deliveryFee: 30,
    freeDeliveryThreshold: 299,
    hsnSacCode: "996331",
    isGstEnabled: true,
    isDefault: true,
  },
  {
    id: "18-catering",
    emoji: "🏢",
    name: "18% Commercial",
    gstRate: 18,
    cgst: 9,
    sgst: 9,
    packagingFee: 15,
    deliveryFee: 40,
    freeDeliveryThreshold: 399,
    hsnSacCode: "996332",
    isGstEnabled: true,
    isDefault: true,
  },
  {
    id: "12-composite",
    emoji: "🥗",
    name: "12% Composite / Bakery",
    gstRate: 12,
    cgst: 6,
    sgst: 6,
    packagingFee: 10,
    deliveryFee: 35,
    freeDeliveryThreshold: 350,
    hsnSacCode: "996334",
    isGstEnabled: true,
    isDefault: true,
  },
  {
    id: "0-exempt",
    emoji: "🌿",
    name: "0% Zero Tax / Exempt",
    gstRate: 0,
    cgst: 0,
    sgst: 0,
    packagingFee: 10,
    deliveryFee: 30,
    freeDeliveryThreshold: 250,
    hsnSacCode: "996331",
    isGstEnabled: false,
    isDefault: true,
  },
];

export const TAX_PRESETS_STORAGE_KEY = "animas_kitchen_tax_presets";

export function getStoredTaxPresets(): TaxPreset[] {
  if (typeof window === "undefined") return DEFAULT_TAX_PRESETS;
  try {
    const raw = localStorage.getItem(TAX_PRESETS_STORAGE_KEY);
    if (!raw) return DEFAULT_TAX_PRESETS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TAX_PRESETS;
  } catch {
    return DEFAULT_TAX_PRESETS;
  }
}

export function saveStoredTaxPresets(presets: TaxPreset[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TAX_PRESETS_STORAGE_KEY, JSON.stringify(presets));
  } catch (err) {
    console.error("Error saving tax presets:", err);
  }
}

// ─── Custom Bill Taxes (Rain Tax, Road Tax, Cess, etc.) ──────────────────────
import type { CustomBillTax } from "@/types/kitchen";

export const DEFAULT_CUSTOM_BILL_TAXES: CustomBillTax[] = [
  {
    id: "tax-rain",
    name: "Rain Tax (Barish Surge)",
    type: "flat",
    value: 20,
    isEnabled: false,
  },
  {
    id: "tax-road",
    name: "Road Tax / Local Cess",
    type: "percent",
    value: 1.5,
    isEnabled: false,
  },
];

export function calculateCustomTaxes(
  subtotal: number,
  customTaxes?: CustomBillTax[],
): { id: string; name: string; type: "flat" | "percent"; value: number; amount: number }[] {
  if (!customTaxes || customTaxes.length === 0) return [];
  return customTaxes
    .filter((t) => t.isEnabled && t.value > 0)
    .map((t) => {
      const amount =
        t.type === "percent"
          ? Number(((subtotal * t.value) / 100).toFixed(2))
          : Number(t.value.toFixed(2));
      return {
        id: t.id,
        name: t.name,
        type: t.type,
        value: t.value,
        amount,
      };
    });
}

export function getCustomTaxesTotal(
  subtotal: number,
  customTaxes?: CustomBillTax[],
): number {
  const breakdown = calculateCustomTaxes(subtotal, customTaxes);
  return Number(breakdown.reduce((sum, item) => sum + item.amount, 0).toFixed(2));
}

