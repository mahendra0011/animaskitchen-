import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  MapPin,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export const CartDrawer: React.FC = () => {
  const {
    cartDrawerOpen,
    setCartDrawerOpen,
    cart,
    updateCartItemQty,
    removeFromCart,
    clearCart,
    cartTotal,
    setCheckoutModalOpen,
    customerProfile,
    coupons,
    gstBillingConfig,
  } = useDemoStore();

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>("ANIMA120");
  const [selectedInstruction, setSelectedInstruction] = useState<string>("Call upon arrival");

  const instructions = [
    "Call upon arrival 📞",
    "Leave at door / guard 🚪",
    "Don't ring bell 🔕",
    "No plastic cutlery 🌿",
  ];

  // Calculate discounts
  const matchedCoupon = coupons.find(
    (c) => c.code.toUpperCase() === (appliedCoupon || "").toUpperCase(),
  );

  let discount = 0;
  if (matchedCoupon) {
    if (matchedCoupon.discountType === "flat") {
      discount = matchedCoupon.discountValue;
    } else {
      discount = Math.round((cartTotal * matchedCoupon.discountValue) / 100);
      if (matchedCoupon.maxDiscount && discount > matchedCoupon.maxDiscount) {
        discount = matchedCoupon.maxDiscount;
      }
    }
  }

  const effectiveTaxRate = gstBillingConfig.isGstEnabled ? gstBillingConfig.gstRatePercent : 0;
  const tax = Math.round((cartTotal * effectiveTaxRate) / 100);
  const packagingFee = gstBillingConfig.packagingFee > 0
    ? (gstBillingConfig.isPackagingFeePerItem
        ? cart.reduce((sum, item) => sum + item.quantity, 0) * gstBillingConfig.packagingFee
        : gstBillingConfig.packagingFee)
    : 0;
  const customTaxesBreakdown = (gstBillingConfig.customTaxes || [])
    .filter((t) => t.isEnabled && t.value > 0)
    .map((t) => ({
      id: t.id,
      name: t.name,
      type: t.type,
      value: t.value,
      amount:
        t.type === "percent"
          ? Number(((cartTotal * t.value) / 100).toFixed(2))
          : Number(t.value.toFixed(2)),
    }));
  const customTaxesTotal = Number(
    customTaxesBreakdown.reduce((sum, it) => sum + it.amount, 0).toFixed(2),
  );

  const isFreeDel = cartTotal >= gstBillingConfig.freeDeliveryThreshold || appliedCoupon === "FREEDEL";
  const deliveryFee = isFreeDel ? 0 : gstBillingConfig.deliveryFee;
  const grandTotal = Math.max(
    0,
    cartTotal + tax + customTaxesTotal + packagingFee + deliveryFee - discount,
  );

  const handleApplyCoupon = (code: string) => {
    const found = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!found) {
      toast.error("Invalid coupon code!", { description: "Try ANIMA120 or FIRSTBITE" });
      return;
    }
    if (cartTotal < found.minOrderValue) {
      toast.error(`Minimum order value for ${found.code} is ₹${found.minOrderValue}`);
      return;
    }
    setAppliedCoupon(found.code);
    toast.success(`Coupon ${found.code} applied!`, {
      description: found.description,
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    toast.info("Coupon removed");
  };

  const handleProceedToCheckout = () => {
    setCartDrawerOpen(false);
    setCheckoutModalOpen(true);
  };

  return (
    <Sheet open={cartDrawerOpen} onOpenChange={setCartDrawerOpen}>
      <SheetContent className="flex w-full flex-col justify-between p-0 sm:max-w-md bg-frost text-ink border-l border-ink/10 shadow-2xl">
        {/* Header */}
        <SheetHeader className="border-b border-ink/10 bg-cream/80 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-xl bg-ink text-cream">
                <ShoppingBag className="size-4" />
              </span>
              <div>
                <SheetTitle className="font-display text-xl text-ink">Your Hot Bag</SheetTitle>
                <p className="text-xs text-ink/60">
                  {cart.length} {cart.length === 1 ? "dish" : "dishes"} from Anima's Kitchen
                </p>
              </div>
            </div>
            {cart.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="h-8 text-xs text-ink/60 hover:text-spice"
              >
                Clear all
              </Button>
            )}
          </div>

          {/* Delivery Location Preview */}
          <div className="mt-3 flex items-center justify-between rounded-xl bg-frost px-3 py-2 text-xs border border-ink/10">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="size-3.5 text-spice shrink-0" />
              <span className="truncate text-ink/80">
                Delivering to: <strong>{customerProfile.savedAddresses[0]?.street}</strong>
              </span>
            </div>
            <span className="shrink-0 font-mono text-[10px] text-spice font-semibold ml-2">
              ~25 MIN
            </span>
          </div>
        </SheetHeader>

        {/* Scrollable Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-ink/60">
              <span className="grid size-16 place-items-center rounded-full bg-cream text-ink/40 mb-3">
                <ShoppingBag className="size-8" />
              </span>
              <p className="font-display text-lg text-ink">Your thali bag is empty</p>
              <p className="text-xs text-ink/60 max-w-xs mt-1">
                Explore our brass-simmered dal, hot puffed rotis, and royal thalis.
              </p>
              <Button
                size="sm"
                onClick={() => setCartDrawerOpen(false)}
                className="mt-5 rounded-full bg-ink text-cream text-xs hover:bg-spice"
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                <div className="space-y-3">
                  {cart.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20, scale: 0.97 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{
                        opacity: 0,
                        x: -20,
                        scale: 0.95,
                        height: 0,
                        marginTop: 0,
                        padding: 0,
                      }}
                      transition={{ duration: 0.3, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      className="rounded-2xl border border-ink/10 bg-cream/40 p-3.5 text-ink transition-colors hover:border-ink/20 hover:bg-cream/60"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex size-3.5 items-center justify-center rounded-sm border border-emerald-600 bg-frost p-0.5">
                              <span className="size-1.5 rounded-full bg-emerald-600" />
                            </span>
                            <h4 className="font-display text-base text-ink">
                              {item.menuItem.name}
                            </h4>
                          </div>

                          {/* Add-ons list if any */}
                          {item.selectedAddons && item.selectedAddons.length > 0 && (
                            <div className="mt-1.5 space-y-0.5 pl-5">
                              {item.selectedAddons.map((addonItem) => (
                                <div
                                  key={addonItem.addon.id}
                                  className="flex items-center gap-1.5 text-[11px] text-ink/70"
                                >
                                  <span className="font-mono text-[9px] font-bold text-spice">
                                    +{addonItem.quantity}x
                                  </span>
                                  <span>{addonItem.addon.name}</span>
                                  <span className="text-ink/40 font-mono">
                                    (₹{addonItem.addon.price * addonItem.quantity})
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {item.specialInstructions && (
                            <p className="mt-1 text-[10px] text-ink/60 pl-5 italic">
                              "{item.specialInstructions}"
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="font-display text-base text-ink">
                            ₹{item.itemTotal * item.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Qty controller */}
                      <div className="mt-3 flex items-center justify-between border-t border-ink/5 pt-2">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-ink/40 hover:text-spice transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="size-3.5" />
                        </button>

                        <div className="flex items-center gap-2 rounded-full border border-ink/15 bg-frost px-2 py-0.5 shadow-sm">
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            type="button"
                            onClick={() => updateCartItemQty(item.id, -1)}
                            className="grid size-5 place-items-center rounded-full text-ink hover:bg-cream"
                          >
                            <Minus className="size-3" />
                          </motion.button>
                          <span className="font-mono text-xs font-bold text-ink w-4 text-center">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            type="button"
                            onClick={() => updateCartItemQty(item.id, 1)}
                            className="grid size-5 place-items-center rounded-full text-ink hover:bg-cream"
                          >
                            <Plus className="size-3" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>

              {/* Delivery Instructions Chips */}
              <div className="mt-4 pt-2">
                <label className="font-mono text-[10px] uppercase font-semibold text-ink/60 block mb-2">
                  Delivery Preferences
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {instructions.map((inst) => (
                    <button
                      key={inst}
                      type="button"
                      onClick={() => setSelectedInstruction(inst)}
                      className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all ${
                        selectedInstruction === inst
                          ? "border border-spice bg-spice/10 text-spice font-semibold"
                          : "border border-ink/10 bg-frost text-ink/70 hover:bg-cream"
                      }`}
                    >
                      {inst}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply Coupons Section */}
              <div className="rounded-2xl border border-dashed border-ink/15 bg-cream/30 p-3.5 mt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Tag className="size-3.5 text-spice" />
                    <span className="font-mono text-xs font-semibold uppercase text-ink">
                      Apply Coupon
                    </span>
                  </div>
                  {appliedCoupon && (
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-[11px] font-semibold text-spice hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-xl bg-emerald-600/10 border border-emerald-600/30 px-3 py-2 text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5">
                      <Check className="size-4 text-emerald-700" />
                      <div>
                        <strong>{appliedCoupon}</strong> applied
                        <p className="text-[10px] text-emerald-700/80">
                          {matchedCoupon?.description}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-sm">-₹{discount}</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <Input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Enter coupon (e.g. ANIMA120)"
                        className="h-8 rounded-full border-ink/15 bg-frost text-xs uppercase font-mono"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleApplyCoupon(couponInput)}
                        className="h-8 rounded-full bg-ink px-4 text-xs text-cream hover:bg-spice"
                      >
                        Apply
                      </Button>
                    </div>

                    {/* Quick suggestion pills */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {coupons.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleApplyCoupon(c.code)}
                          className="rounded-full border border-ink/10 bg-frost px-2 py-0.5 font-mono text-[10px] text-ink/70 hover:border-spice hover:text-spice"
                        >
                          {c.code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer: Bill Summary & Checkout Button */}
        {cart.length > 0 && (
          <div className="border-t border-ink/10 bg-cream/90 p-5 pb-safe backdrop-blur-md">
            <div className="space-y-1.5 text-xs text-ink/70">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono">₹{cartTotal}</span>
              </div>
              {packagingFee > 0 && (
                <div className="flex justify-between">
                  <span>Eco Packaging Charge</span>
                  <span className="font-mono">₹{packagingFee}</span>
                </div>
              )}
              {gstBillingConfig.isGstEnabled && effectiveTaxRate > 0 ? (
                <div className="flex justify-between">
                  <span>
                    GST ({effectiveTaxRate}%)
                    <span className="text-[10px] text-ink/50 block">
                      CGST {gstBillingConfig.cgstPercent}% + SGST {gstBillingConfig.sgstPercent}%
                    </span>
                  </span>
                  <span className="font-mono font-semibold">₹{tax}</span>
                </div>
              ) : (
                <div className="flex justify-between text-emerald-700">
                  <span>GST & Tax</span>
                  <span className="font-mono font-semibold">₹0 (Exempt)</span>
                </div>
              )}
              {customTaxesBreakdown.map((ct) => (
                <div key={ct.id} className="flex justify-between items-center text-spice font-medium">
                  <span>
                    {ct.name} {ct.type === "percent" ? `(${ct.value}%)` : ""}
                  </span>
                  <span className="font-mono font-semibold">+₹{ct.amount}</span>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <div>
                  <span className="block font-medium">Delivery Partner Fee</span>
                  <span className="text-[10px] text-ink/60">
                    Free above ₹{gstBillingConfig.freeDeliveryThreshold}
                  </span>
                </div>
                <span className="font-mono font-semibold">
                  {deliveryFee === 0 ? (
                    <strong className="text-emerald-700 uppercase">FREE</strong>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between font-semibold text-emerald-700">
                  <span>Coupon Discount ({appliedCoupon})</span>
                  <span className="font-mono">-₹{discount}</span>
                </div>
              )}
              <div className="border-t border-ink/10 pt-2 flex justify-between items-center text-sm font-bold text-ink">
                <span>Grand Total</span>
                <span className="font-display text-2xl text-ink">₹{grandTotal}</span>
              </div>
            </div>

            {cartTotal < 250 && (
              <div className="mt-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium text-center">
                Min. order value: <strong>₹250</strong> for free delivery under 4 km (Add ₹
                {250 - cartTotal} more). Extra delivery fee applies beyond 4 km.
              </div>
            )}

            {/* Daily Pre-Order Schedule Notice */}
            <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-600/30 text-emerald-950 text-[11px] space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <Clock className="size-3.5 text-orange-600" />
                <span>Daily Order & Delivery Timings:</span>
              </div>
              <div className="text-[10px] font-mono leading-tight space-y-0.5 text-emerald-900/90">
                <div>☀️ <strong>Lunch Order:</strong> 8 AM – 10 AM (Delivery: 1:30–2:30 PM)</div>
                <div>🌙 <strong>Dinner Order:</strong> 4 PM – 6 PM (Delivery: 7:30–10:30 PM)</div>
              </div>
              <p className="text-[10px] text-amber-900 font-semibold pt-0.5 border-t border-emerald-200">
                ⚠️ If ordering after timing, send instant request on WhatsApp!
              </p>
            </div>

            {/* Cancel Policy Pill */}
            <div className="mt-1.5 px-2.5 py-1.5 rounded-lg bg-stone-100 border border-stone-300 text-[11px] text-stone-800 font-medium text-center">
              ⏱️ <strong>Cancel policy:</strong> Only within <strong>20 minutes</strong> of order booking.
            </div>

            <motion.div
              whileHover={{ scale: cartTotal >= 250 ? 1.02 : 1 }}
              whileTap={{ scale: cartTotal >= 250 ? 0.98 : 1 }}
            >
              <Button
                onClick={handleProceedToCheckout}
                disabled={cartTotal < 250}
                className="mt-3 w-full justify-between rounded-full bg-spice py-3 text-sm font-semibold text-cream shadow-lg hover:bg-ink transition-all disabled:opacity-50"
              >
                <span>
                  {cartTotal < 250
                    ? `Add ₹${250 - cartTotal} to Reach ₹250 Min.`
                    : "Proceed to Checkout"}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs">₹{grandTotal}</span>
                  <ArrowRight className="size-4" />
                </div>
              </Button>
            </motion.div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
