import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tag, Plus, Check, Percent, Sparkles, Calendar } from "lucide-react";
import type { Coupon } from "@/types/kitchen";

export const CouponsManagerTab: React.FC = () => {
  const { coupons, createCoupon } = useDemoStore();
  const [modalOpen, setModalOpen] = useState(false);

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"flat" | "percent">("flat");
  const [discountValue, setDiscountValue] = useState("100");
  const [minOrder, setMinOrder] = useState("349");

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newCoupon: Coupon = {
      code: code.toUpperCase().trim(),
      description: description || `Save ₹${discountValue} on orders above ₹${minOrder}`,
      discountType,
      discountValue: Number(discountValue) || 100,
      minOrderValue: Number(minOrder) || 299,
      expiryDate: "2026-12-31",
      usageCount: 0,
      isActive: true,
    };

    createCoupon(newCoupon);
    setModalOpen(false);
    setCode("");
    setDescription("");
  };

  return (
    <div className="space-y-6 text-ink">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl text-ink">Coupons & Promotional Offers</h3>
          <p className="text-xs text-ink/60">
            Create festival discounts, first-order incentives, and thali combos.
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="rounded-full bg-spice text-xs font-semibold text-cream hover:bg-ink gap-1.5"
        >
          <Plus className="size-3.5" />
          <span>Create New Coupon</span>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.map((c) => (
          <div
            key={c.code}
            className="flex flex-col justify-between rounded-3xl border border-ink/10 bg-frost p-5 shadow-sm hover:border-spice transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold tracking-wider rounded-xl bg-spice/10 text-spice px-3 py-1 border border-spice/20">
                  {c.code}
                </span>
                <Badge className="bg-emerald-600 text-cream text-[10px] font-mono">ACTIVE</Badge>
              </div>
              <p className="mt-3 text-xs font-medium text-ink leading-relaxed">{c.description}</p>
            </div>

            <div className="mt-5 border-t border-ink/5 pt-3 flex items-center justify-between text-[11px] text-ink/60 font-mono">
              <span>Min Order: ₹{c.minOrderValue}</span>
              <span>Redeemed {c.usageCount} times</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md rounded-3xl border border-ink/10 bg-frost p-6 text-ink shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-ink">
              Create Promotional Code
            </DialogTitle>
            <DialogDescription className="text-xs text-ink/60">
              Coupon will be immediately usable by customers in cart.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCoupon} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="font-mono text-[10px] uppercase font-bold text-ink/60 block mb-1">
                Coupon Code
              </label>
              <Input
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. FESTIVE150"
                className="rounded-xl border-ink/15 text-xs bg-cream font-mono uppercase"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase font-bold text-ink/60 block mb-1">
                Description
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Flat ₹150 off on weekend lunch thalis"
                className="rounded-xl border-ink/15 text-xs bg-cream"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-mono text-[10px] uppercase font-bold text-ink/60 block mb-1">
                  Discount Value (₹ or %)
                </label>
                <Input
                  required
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="rounded-xl border-ink/15 text-xs bg-cream font-mono"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase font-bold text-ink/60 block mb-1">
                  Min Order Amount (₹)
                </label>
                <Input
                  required
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  className="rounded-xl border-ink/15 text-xs bg-cream font-mono"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="mt-2 w-full rounded-full bg-spice py-2.5 font-semibold text-cream hover:bg-ink"
            >
              Publish Coupon
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
