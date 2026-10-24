import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  SlidersHorizontal,
  Star,
  Clock,
  Plus,
  Sparkles,
  Flame,
  Check,
  ShoppingBag,
  Eye,
  ArrowRight,
  Heart,
} from "lucide-react";
import type { MenuItem } from "@/types/kitchen";

export const CustomerMenuSection: React.FC<{
  onOpenDishPage?: (dishId: string) => void;
  onViewFullMenu?: () => void;
}> = ({ onOpenDishPage, onViewFullMenu }) => {
  const {
    menuItems,
    thaliAddons,
    addToCart,
    setThaliModalItem,
    toggleWishlist,
    isWishlisted,
    allCategories,
  } = useDemoStore();

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyVeg, setOnlyVeg] = useState(false);

  const categories = useMemo(() => {
    return ["All", ...(allCategories || [])];
  }, [allCategories]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCat = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVeg = !onlyVeg || item.isVeg;
      return matchesCat && matchesSearch && matchesVeg;
    });
  }, [menuItems, activeCategory, searchQuery, onlyVeg]);

  const handleOpenDish = (item: MenuItem) => {
    if (onOpenDishPage) {
      onOpenDishPage(item.id);
    } else {
      setThaliModalItem(item);
    }
  };

  const handleItemClick = (item: MenuItem) => {
    if (!item.isAvailable) return;
    if (item.isThali || (item.allowedAddons && item.allowedAddons.length > 0)) {
      handleOpenDish(item);
    } else {
      addToCart(item);
    }
  };

  return (
    <section id="menu" className="border-t border-ink/10 bg-cream py-16">
      <div className="mx-auto max-w-6xl px-5">
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-ink/10 pb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-spice">
              (b) — cooked fresh in brass & iron
            </p>
            <h2 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl text-ink">
              OUR COMPLETE MENU
            </h2>
            <p className="mt-2 text-sm text-ink/70 max-w-lg">
              Every dish is prepared using stone-ground spices, pure cow desi ghee, and delivered
              hot in insulated boxes.
            </p>
          </div>

          {/* Search and Veg Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search thali, biryani, paneer..."
                className="pl-10 rounded-full border-ink/15 bg-frost/80 text-xs focus-visible:ring-spice shadow-sm h-10 w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={onlyVeg ? "default" : "outline"}
                size="sm"
                onClick={() => setOnlyVeg((v) => !v)}
                className={`flex-1 sm:flex-none rounded-full gap-1.5 text-xs font-semibold h-10 px-3.5 ${
                  onlyVeg
                    ? "bg-leaf text-cream hover:bg-emerald-800"
                    : "border-ink/15 text-ink hover:border-leaf hover:text-leaf"
                }`}
              >
                <span className="inline-flex size-3.5 items-center justify-center rounded-sm border border-current p-0.5">
                  <span className="size-1.5 rounded-full bg-current" />
                </span>
                <span>Pure Veg Only</span>
              </Button>

              {onViewFullMenu && (
                <Button
                  onClick={onViewFullMenu}
                  size="sm"
                  className="flex-1 sm:flex-none rounded-full bg-ink text-cream hover:bg-spice text-xs font-bold px-4 h-10 gap-1.5 shadow-sm shrink-0"
                >
                  <span>See Full Menu</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Smart Personalization & 1-Click Reorder Bar */}
        <div className="mt-8 rounded-3xl bg-white border border-spice/20 p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-xl bg-spice/10 text-spice">
                <Sparkles className="size-3.5 text-spice" />
              </span>
              <div>
                <h3 className="font-display text-sm font-bold text-ink">
                  Smart Re-Order & Recommended for You
                </h3>
                <p className="text-[11px] text-ink/60">
                  Frequently ordered homestyle favorites · 1-click add to cart
                </p>
              </div>
            </div>
            <span className="font-mono text-[9px] uppercase font-bold text-spice bg-spice/10 px-2 py-0.5 rounded-md">
              AI SMART CURATION
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {menuItems.slice(0, 3).map((fav) => (
              <div
                key={`fav-${fav.id}`}
                onClick={() => handleOpenDish(fav)}
                className="flex items-center justify-between p-3 rounded-2xl bg-frost border border-ink/10 hover:border-spice/40 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <img
                    src={fav.image}
                    alt={fav.name}
                    className="size-11 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-ink truncate block group-hover:text-spice transition-colors">
                      {fav.name}
                    </span>
                    <span className="font-mono text-xs font-semibold text-spice">₹{fav.price}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 ml-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(fav.id);
                    }}
                    className={`grid size-8 place-items-center rounded-xl border transition-all ${
                      isWishlisted(fav.id)
                        ? "border-rose-400 bg-rose-50 text-rose-600"
                        : "border-ink/15 text-ink/60 hover:text-rose-600 hover:border-rose-300"
                    }`}
                    title={isWishlisted(fav.id) ? "Remove from Wishlist" : "Save to Wishlist"}
                  >
                    <Heart className={`size-3.5 ${isWishlisted(fav.id) ? "fill-rose-600" : ""}`} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDish(fav);
                    }}
                    className="grid size-8 place-items-center rounded-xl border border-ink/15 text-ink/70 hover:border-spice hover:text-spice transition-all"
                    title="View Details & What's Inside"
                  >
                    <Eye className="size-3.5" />
                  </button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(fav);
                    }}
                    className="h-8 px-3 rounded-xl bg-ink text-cream hover:bg-spice text-xs font-semibold gap-1 shrink-0"
                  >
                    <Plus className="size-3" />
                    <span>Add</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Pills - Horizontal swipeable on mobile */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-4 sm:px-5 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-ink text-cream shadow-md scale-102"
                  : "border border-ink/15 bg-frost/60 text-ink/80 hover:border-spice hover:text-spice hover:bg-frost"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              onClick={() => handleOpenDish(item)}
              className={`group flex flex-col justify-between overflow-hidden rounded-3xl border border-ink/10 bg-frost/95 shadow-xs backdrop-blur-xl transition-all duration-200 hover:shadow-2xl hover:border-spice/50 hover:bg-white hover:-translate-y-1.5 active:scale-[0.98] cursor-pointer relative ${
                !item.isAvailable ? "opacity-60 grayscale-[40%]" : ""
              }`}
            >
              {/* Image & Badges with Rich Zoom & Glass Sheen */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink/5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 group-hover:rotate-0.5"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Top badges */}
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  <span className="inline-flex size-5 items-center justify-center rounded-md border border-emerald-600 bg-frost p-0.5 shadow-sm">
                    <span className="size-2.5 rounded-full bg-emerald-600" />
                  </span>
                  {item.badge && (
                    <span className="rounded-full bg-[#FF6B00] px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-white shadow-sm animate-pulse-glow">
                      {item.badge}
                    </span>
                  )}
                  {item.isTodaySpecial && !item.badge && (
                    <span className="rounded-full bg-saffron px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ink shadow-sm">
                      TODAY'S SPECIAL
                    </span>
                  )}
                  {item.isThali && !item.badge && (
                    <span className="rounded-full bg-spice px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-cream shadow-sm">
                      THALI COMBO
                    </span>
                  )}
                </div>

                {/* Top action buttons (Wishlist & View details) */}
                <div className="absolute right-3 top-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item.id);
                    }}
                    className={`grid size-9 place-items-center rounded-xl shadow-md backdrop-blur-md transition-all duration-200 active:scale-90 hover:scale-110 ${
                      isWishlisted(item.id)
                        ? "bg-rose-500 text-white scale-105 shadow-rose-500/30"
                        : "bg-ink/75 text-cream hover:bg-rose-500 hover:text-white"
                    }`}
                    title={
                      isWishlisted(item.id) ? "Remove from Saved Wishlist" : "Save to Wishlist"
                    }
                  >
                    <Heart
                      className={`size-4 transition-transform duration-200 ${
                        isWishlisted(item.id) ? "fill-white scale-110" : ""
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDish(item);
                    }}
                    className="grid size-9 place-items-center rounded-xl bg-ink/75 text-cream shadow-md backdrop-blur-md transition-all duration-200 hover:bg-spice hover:scale-110 active:scale-90"
                    title="View Details & What's Inside"
                  >
                    <Eye className="size-4" />
                  </button>
                </div>

                {/* Stock or Prep time badge */}
                <div className="absolute bottom-3 right-3">
                  {!item.isAvailable ? (
                    <Badge variant="destructive" className="font-mono text-[10px] uppercase">
                      SOLD OUT
                    </Badge>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-ink/80 px-2.5 py-1 font-mono text-[10px] text-cream backdrop-blur-md transition-transform group-hover:scale-105">
                      <Clock className="size-3 text-saffron" />
                      {item.preparationTimeMinutes} min
                    </span>
                  )}
                </div>
              </div>

              {/* Content Body */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl tracking-tight text-ink group-hover:text-spice transition-colors duration-200">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1 rounded-md bg-cream px-1.5 py-0.5 font-mono text-xs font-bold text-ink border border-ink/10 shadow-xs">
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <span>{item.rating}</span>
                    </div>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-ink/70 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Included items preview if thali */}
                  {item.includedItems && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {item.includedItems.slice(0, 3).map((inc) => (
                        <span
                          key={inc}
                          className="rounded-md bg-cream/80 px-2 py-0.5 text-[10px] text-ink/60 border border-ink/5"
                        >
                          + {inc}
                        </span>
                      ))}
                      {item.includedItems.length > 3 && (
                        <span className="text-[10px] font-semibold text-spice self-center ml-1">
                          +{item.includedItems.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Price & Action Button */}
                <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-ink/50 block">Price</span>
                    <span className="font-display text-2xl text-ink font-bold group-hover:text-spice transition-colors">
                      ₹{item.price}
                    </span>
                  </div>

                  <Button
                    disabled={!item.isAvailable}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                    className="rounded-full bg-spice text-cream hover:bg-ink px-4 py-2 text-xs font-bold shadow-md shadow-spice/20 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5"
                  >
                    <Plus className="size-3.5" />
                    <span>Add to Cart</span>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View Full Menu Banner */}
        {onViewFullMenu && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-5 rounded-3xl border border-spice/20 bg-gradient-to-r from-saffron/20 via-white to-spice/10 p-6 sm:p-7 shadow-sm backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="size-4 text-spice" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-spice">
                  FULL CHEF CATALOGUE
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-ink">
                Craving more options? Explore our complete 20+ dish menu
              </h3>
              <p className="mt-1 text-xs text-ink/70 max-w-xl">
                Browse our complete collection of slow-cooked thalis, handi biryanis, tandoor paneer
                starters, soft rotis & desserts with quick filters and search.
              </p>
            </div>
            <Button
              onClick={onViewFullMenu}
              size="lg"
              className="rounded-full bg-spice text-cream hover:bg-ink font-bold px-7 h-11 text-xs shadow-md shrink-0 gap-2 transition-all hover:scale-102"
            >
              <span>See Full Menu (20+ Dishes)</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        )}

        {/* Dedicated Section for Extra Add-ons (LA, JE, DA, CH, RA, MI, PA) */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-ink/10 bg-gradient-to-r from-saffron/15 via-spice/10 to-leaf/10 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink/10 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-spice" />
                <span className="font-mono text-xs uppercase tracking-widest text-spice font-bold">
                  FRESH ADD-ONS & SIDES
                </span>
              </div>
              <h3 className="mt-1 font-display text-2xl sm:text-3xl tracking-tight text-ink">
                ORDER INDIVIDUAL SIDES & EXTRA ROTIS
              </h3>
              <p className="mt-1 text-xs text-ink/70">
                Want just an extra lachha paratha or a bowl of Punjabi rajma? Add them directly to
                your order!
              </p>
            </div>
            <span className="rounded-full bg-cream px-3 py-1 font-mono text-xs text-ink/80 border border-ink/10 self-start md:self-auto">
              7 Signature Sides Available
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {thaliAddons.map((addon) => (
              <div
                key={addon.id}
                className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-frost/90 p-4 shadow-sm transition-all hover:border-spice hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-8 place-items-center rounded-xl bg-ink text-cream font-mono text-xs font-bold">
                      {addon.code}
                    </span>
                    <span className="rounded-full bg-cream px-2 py-0.5 font-mono text-[10px] text-ink/60 border border-ink/10">
                      {addon.portion}
                    </span>
                  </div>
                  <h4 className="mt-3 font-display text-base text-ink">{addon.name}</h4>
                  <p className="mt-1 text-[11px] text-ink/60 line-clamp-2">{addon.description}</p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-ink/5 pt-3">
                  <span className="font-display text-lg text-spice">₹{addon.price}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // Add side as a standalone item to cart
                      const sideMenuItem: MenuItem = {
                        id: `side-${addon.id}`,
                        name: addon.name,
                        description: addon.description || `${addon.portion} portion`,
                        price: addon.price,
                        category: "Roti & Rice",
                        image:
                          addon.code === "LA"
                            ? "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80"
                            : addon.code === "PA"
                              ? "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80"
                              : "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
                        isVeg: true,
                        isAvailable: true,
                        preparationTimeMinutes: 10,
                        rating: 4.9,
                        reviewCount: 95,
                      };
                      addToCart(sideMenuItem);
                    }}
                    className="h-8 rounded-full border-ink/15 text-xs font-semibold text-ink hover:border-spice hover:bg-spice hover:text-cream"
                  >
                    <span>+ Add</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
