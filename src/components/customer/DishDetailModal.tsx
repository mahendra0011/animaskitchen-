import React, { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Star,
  Clock,
  Plus,
  Minus,
  X,
  ShoppingBag,
  Flame,
  Check,
  Sparkles,
  Send,
  MessageSquare,
} from "lucide-react";
import { useDemoStore } from "@/context/DemoStoreContext";
import type { MenuItem, ThaliAddon, SelectedAddon } from "@/types/kitchen";

interface DishDetailModalProps {
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
  thaliAddons: ThaliAddon[];
  onAddToCart: (item: MenuItem, addons?: SelectedAddon[], size?: string) => void;
  onOpenFullPage?: (dishId: string) => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  item,
  open,
  onClose,
  thaliAddons,
  onAddToCart,
  onOpenFullPage,
}) => {
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [spiceLevel, setSpiceLevel] = useState<"Mild" | "Medium" | "Desi Spicy">("Medium");

  // Reset state on open or item change
  useEffect(() => {
    setSelectedSize(0);
    setQuantity(1);
    setSelectedAddonIds([]);
    setSpiceLevel("Medium");
  }, [item?.id, open]);

  if (!item) return null;

  // Filter relevant authentic addons for this item
  const allowedAddons: ThaliAddon[] =
    item.allowedAddons && item.allowedAddons.length > 0
      ? thaliAddons.filter((a) => item.allowedAddons!.includes(a.id))
      : thaliAddons.slice(0, 8);

  // Project-relevant size options
  const sizeVariants =
    item.sizeVariants && item.sizeVariants.length > 0
      ? item.sizeVariants
      : item.isThali
        ? [
            { name: "Regular Thali (3 Rotis + Rice)", priceOffset: 0 },
            { name: "Hungry Thali (4 Rotis + Extra Dal)", priceOffset: 49 },
          ]
        : [
            { name: "Regular", priceOffset: 0 },
            { name: "Large Portion", priceOffset: 59 },
          ];

  const currentSize = sizeVariants[selectedSize] ||
    sizeVariants[0] || { name: "Regular", priceOffset: 0 };
  const sizeOffset = currentSize.priceOffset || 0;

  const selectedAddonsList: SelectedAddon[] = selectedAddonIds
    .map((id) => thaliAddons.find((a) => a.id === id))
    .filter(Boolean)
    .map((addon) => ({ addon: addon!, quantity: 1 }));

  const addonsTotal = selectedAddonsList.reduce((sum, sa) => sum + sa.addon.price, 0);
  const unitPrice = item.price + sizeOffset + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId],
    );
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(
        item,
        selectedAddonsList.length > 0 ? selectedAddonsList : undefined,
        `${currentSize.name}${item.isThali ? ` · ${spiceLevel} spice` : ""}`,
      );
    }
    onClose();
  };

  // Nutrition data fallback if not present
  const nutrition = item.nutrition || {
    calories: item.isThali ? 520 : 340,
    protein: item.isThali ? "18g" : "12g",
    carbs: item.isThali ? "72g" : "48g",
    fat: item.isThali ? "16g" : "10g",
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] md:w-[920px] p-0 overflow-hidden rounded-3xl border border-ink/15 bg-cream text-ink shadow-2xl max-h-[92vh] flex flex-col">
        {/* Scrollable Container in Anima's Kitchen Aesthetic */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-7 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
            {/* ─── LEFT COLUMN: Square Image, Badges & What's Included ─── */}
            <div className="md:col-span-5 flex flex-col space-y-4">
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-white border border-ink/10 shadow-lg">
                <img src={item.image} alt={item.name} className="size-full object-cover" />

                {/* Floating Tag Badge (Top Left) */}
                <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-bold text-leaf border border-leaf/20 shadow-xs backdrop-blur-md">
                    <span className="size-2 rounded-full bg-emerald-600" />
                    Pure Veg
                  </span>

                  {item.badge && (
                    <span className="rounded-full bg-spice px-3 py-0.5 text-xs font-black uppercase tracking-wider text-cream shadow-xs font-mono">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Preparation Time (Bottom Right) */}
                <div className="absolute bottom-3.5 right-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/80 backdrop-blur-md px-3 py-1 font-mono text-xs font-bold text-cream">
                    <Clock className="size-3.5 text-saffron" />
                    {item.preparationTimeMinutes} min
                  </span>
                </div>
              </div>

              {/* What's Included (For Thali Items) */}
              {item.includedItems && item.includedItems.length > 0 && (
                <div className="rounded-2xl bg-white border border-ink/10 p-4 space-y-2.5 shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-spice font-mono block">
                    What's Included in this Thali
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.includedItems.map((inc) => (
                      <span
                        key={inc}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-leaf/10 border border-leaf/20 px-2.5 py-1 text-xs text-leaf font-medium"
                      >
                        <Check className="size-3 text-leaf shrink-0" />
                        {inc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ─── RIGHT COLUMN: Details, Size, Spice, Add-ons, Stepper, Nutrition ─── */}
            <div className="md:col-span-7 flex flex-col space-y-4">
              {/* Header: Title & Close Button */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink/50 font-bold">
                    {item.category}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-ink tracking-tight leading-tight">
                    {item.name}
                  </h2>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex text-amber-500">
                      <Star className="size-4 fill-amber-500" />
                      <Star className="size-4 fill-amber-500" />
                      <Star className="size-4 fill-amber-500" />
                      <Star className="size-4 fill-amber-500" />
                      <Star className="size-4 fill-amber-500" />
                    </div>
                    <span className="text-sm font-bold text-ink">{item.rating}</span>
                    <span className="text-xs text-ink/50 font-mono">
                      ({item.reviewCount}+ reviews)
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-white border border-ink/15 text-ink/70 hover:text-ink hover:border-ink/40 transition-colors shadow-xs"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-ink/75 leading-relaxed">{item.description}</p>

              {/* Price in Big Spice Red */}
              <div className="flex items-baseline gap-2 pt-0.5">
                <span className="font-display text-3xl sm:text-4xl font-black text-spice">
                  ₹{unitPrice}
                </span>
                {sizeOffset > 0 && (
                  <span className="font-mono text-xs text-ink/50">
                    (Base ₹{item.price} + Size ₹{sizeOffset})
                  </span>
                )}
              </div>

              {/* Size Selector */}
              {sizeVariants && sizeVariants.length > 0 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-2 block font-mono">
                    Size
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {sizeVariants.map((sv, idx) => {
                      const isSelected = selectedSize === idx;
                      return (
                        <button
                          key={sv.name}
                          type="button"
                          onClick={() => setSelectedSize(idx)}
                          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all border ${
                            isSelected
                              ? "bg-spice text-cream border-spice shadow-md"
                              : "bg-white border-ink/15 text-ink/80 hover:border-spice"
                          }`}
                        >
                          <span>{sv.name}</span>
                          {sv.priceOffset > 0 && (
                            <span className="ml-1.5 opacity-80">+₹{sv.priceOffset}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Spice Level (For Thali Dishes) */}
              {item.isThali && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-2 block font-mono flex items-center gap-1">
                    <Flame className="size-3 text-spice" />
                    Spice Level
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Mild", "Medium", "Desi Spicy"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSpiceLevel(lvl)}
                        className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all text-center border ${
                          spiceLevel === lvl
                            ? "border-spice bg-spice/10 text-spice font-bold"
                            : "border-ink/15 bg-white text-ink/70 hover:border-ink/30"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Authentic Indian Add-ons (2 Columns) */}
              {allowedAddons.length > 0 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-2 block font-mono flex items-center gap-1">
                    <Sparkles className="size-3 text-saffron" />
                    Add-ons (Optional)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {allowedAddons.map((addon) => {
                      const isSelected = selectedAddonIds.includes(addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon.id)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all cursor-pointer select-none text-xs ${
                            isSelected
                              ? "border-spice bg-spice/10 text-ink font-semibold shadow-xs"
                              : "border-ink/12 bg-white text-ink/80 hover:border-ink/25"
                          }`}
                        >
                          <span className="truncate pr-2">{addon.name}</span>
                          <span
                            className={`font-mono text-xs shrink-0 ${
                              isSelected ? "text-spice font-bold" : "text-ink/60"
                            }`}
                          >
                            +₹{addon.price}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper + Add to Cart Button */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center gap-1 rounded-xl border border-ink/15 bg-white px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="grid size-8 place-items-center rounded-lg text-ink hover:bg-frost transition-colors"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-8 text-center font-mono text-sm font-bold text-ink">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="grid size-8 place-items-center rounded-lg text-ink hover:bg-frost transition-colors"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={!item.isAvailable}
                  className="flex-1 rounded-xl bg-spice hover:bg-ink text-cream font-bold py-3.5 h-auto text-sm sm:text-base shadow-lg shadow-spice/25 transition-all gap-2"
                >
                  <ShoppingBag className="size-4" />
                  Add to Cart — ₹{totalPrice}
                </Button>
              </div>

              {/* ─── WHAT'S INSIDE: Nutrition Stats (Exact User Requirement) ─── */}
              <div className="pt-4 border-t border-ink/10 space-y-3">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink/50">
                  What's Inside
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {/* Calories */}
                  <div className="rounded-2xl bg-white border border-ink/10 p-3 text-center shadow-xs">
                    <span className="block font-display text-base sm:text-xl font-black text-ink">
                      {nutrition.calories}kcal
                    </span>
                    <span className="block text-[11px] text-ink/50 font-medium mt-1">Calories</span>
                  </div>

                  {/* Protein */}
                  <div className="rounded-2xl bg-white border border-ink/10 p-3 text-center shadow-xs">
                    <span className="block font-display text-base sm:text-xl font-black text-spice">
                      {nutrition.protein}
                    </span>
                    <span className="block text-[11px] text-ink/50 font-medium mt-1">Protein</span>
                  </div>

                  {/* Carbs */}
                  <div className="rounded-2xl bg-white border border-ink/10 p-3 text-center shadow-xs">
                    <span className="block font-display text-base sm:text-xl font-black text-saffron">
                      {nutrition.carbs}
                    </span>
                    <span className="block text-[11px] text-ink/50 font-medium mt-1">Carbs</span>
                  </div>

                  {/* Fat */}
                  <div className="rounded-2xl bg-white border border-ink/10 p-3 text-center shadow-xs">
                    <span className="block font-display text-base sm:text-xl font-black text-leaf">
                      {nutrition.fat}
                    </span>
                    <span className="block text-[11px] text-ink/50 font-medium mt-1">Fat</span>
                  </div>
                </div>

                {/* Disclaimer Note */}
                <p className="text-[11px] text-ink/50 italic text-center sm:text-left">
                  * Approximate values. Actual nutrition may vary by size and add-ons.
                </p>
              </div>

              {/* ─── CUSTOMER REVIEWS & RATINGS SECTION ─── */}
              <DishReviewsSection item={item} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DishReviewsSection: React.FC<{ item: MenuItem }> = ({ item }) => {
  const { addMenuItemReview, currentUser } = useDemoStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [name, setName] = useState(currentUser?.name || "");

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addMenuItemReview(item.id, {
      rating,
      comment: comment.trim(),
      userName: name.trim() || currentUser?.name || "Verified Customer",
    });
    setComment("");
  };

  const defaultMockReviews = [
    {
      id: "dr-1",
      userName: "Pooja Verma",
      rating: 5,
      comment: "Ghar jaisa swaad! The rotis were soft and ghee aroma was genuine.",
      date: "2 days ago",
    },
    {
      id: "dr-2",
      userName: "Rohan M.",
      rating: 5,
      comment: "Super fresh, perfectly spiced and packed steaming hot. Value for money!",
      date: "5 days ago",
    },
  ];

  const displayReviews =
    item.reviews && item.reviews.length > 0 ? item.reviews : defaultMockReviews;

  return (
    <div className="pt-5 border-t border-ink/10 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-display text-base font-bold text-ink flex items-center gap-1.5">
            <Star className="size-4 text-amber-500 fill-amber-500" />
            <span>Customer Reviews & Feedback ({displayReviews.length})</span>
          </h4>
          <p className="text-xs text-ink/60">
            Average Rating: <strong className="text-ink">{item.rating}★</strong> from{" "}
            {item.reviewCount} happy foodies.
          </p>
        </div>
      </div>

      {/* Write a Review Box */}
      <form
        onSubmit={handleSubmitReview}
        className="rounded-2xl border border-spice/20 bg-cream/60 p-4 space-y-3"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase font-bold text-ink/70">
            Share Your Experience
          </span>
          {/* Star selector */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-0.5 hover:scale-110 transition-transform"
              >
                <Star
                  className={`size-4 ${
                    star <= rating ? "text-amber-500 fill-amber-500" : "text-ink/20"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="h-8 rounded-xl border border-ink/15 bg-white px-3 text-xs text-ink"
          />
          <input
            type="text"
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review about this dish..."
            className="sm:col-span-2 h-8 rounded-xl border border-ink/15 bg-white px-3 text-xs text-ink focus:border-spice"
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            className="h-7 text-xs rounded-xl bg-spice hover:bg-ink text-cream gap-1 px-3 font-semibold"
          >
            <Send className="size-3" />
            <span>Post Review</span>
          </Button>
        </div>
      </form>

      {/* Reviews List */}
      <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
        {displayReviews.map((rev) => (
          <div
            key={rev.id}
            className="rounded-2xl border border-ink/10 bg-white p-3 space-y-1 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-ink">{rev.userName}</span>
              <div className="flex items-center gap-1">
                <div className="flex">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="size-3 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <span className="text-[10px] text-ink/40 font-mono ml-1">{rev.date}</span>
              </div>
            </div>
            <p className="text-xs text-ink/75 leading-relaxed">{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
