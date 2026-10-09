import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DishDetailModal } from "./DishDetailModal";
import { Search, Star, Clock, Plus, Eye, ShoppingBag, ArrowLeft } from "lucide-react";
import type { MenuItem } from "@/types/kitchen";

// ─── Category metadata for richer category headers ───────────────────────────
const CATEGORY_META: Record<string, { emoji: string; tagline: string }> = {
  All: { emoji: "🍽️", tagline: "Complete menu from Anima's Kitchen" },
  Thali: { emoji: "🥘", tagline: "Full steel thali meals — the soul of our kitchen" },
  "Paneer & Tandoor": { emoji: "🧀", tagline: "Clay-oven roasted, smoky & melt-in-mouth" },
  Biryani: { emoji: "🍚", tagline: "Saffron dum cooked in sealed handis" },
  "Roti & Rice": { emoji: "🫓", tagline: "Hand-rolled rotis & fragrant basmati" },
  Desserts: { emoji: "🍮", tagline: "Sweet endings made with pure khoya & desi ghee" },
  "Chai & More": { emoji: "☕", tagline: "Kulhad chai, cold mint lime cooler & beverages" },
};

// ─── Full Menu Page Component ────────────────────────────────────────────────
export const FullMenuPage: React.FC<{
  onBack: () => void;
  onOpenDishPage?: (dishId: string) => void;
}> = ({ onBack, onOpenDishPage }) => {
  const { menuItems, thaliAddons, addToCart, cartCount, setCartDrawerOpen } = useDemoStore();

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyVeg, setOnlyVeg] = useState(false);
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);

  const handleViewDish = (item: MenuItem) => {
    if (onOpenDishPage) {
      onOpenDishPage(item.id);
    } else {
      setDetailItem(item);
    }
  };

  const categories = [
    "All",
    "Thali",
    "Paneer & Tandoor",
    "Biryani",
    "Roti & Rice",
    "Desserts",
    "Chai & More",
  ];

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

  const categoryInfo = CATEGORY_META[activeCategory] ||
    CATEGORY_META["All"] || {
      emoji: "🍱",
      tagline: "Pure Desi Ghee Home-Style Meals & Authentic Recipes",
      badge: "100% Homestyle",
    };

  const handleAddFromModal = (item: MenuItem) => {
    addToCart(item);
  };

  return (
    <div className="min-h-screen bg-cream pb-24 lg:pb-8">
      {/* Sticky top bar */}
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-frost/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="grid size-9 place-items-center rounded-full border border-ink/15 bg-frost text-ink hover:bg-ink hover:text-cream transition-all"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div>
              <h1 className="font-display text-lg font-extrabold text-ink leading-tight">
                Our Menu
              </h1>
              <p className="font-mono text-[10px] text-ink/50 uppercase tracking-wider">
                {menuItems.length} dishes • Fresh from Anima's Kitchen
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartDrawerOpen(true)}
              className="relative rounded-full border border-ink/10 bg-frost text-ink hover:bg-frost"
            >
              <ShoppingBag className="size-4" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-spice font-mono text-[9px] text-cream">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Category header */}
      <div className="border-b border-ink/10 bg-gradient-to-r from-saffron/10 via-frost to-spice/5 py-6">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{categoryInfo.emoji}</span>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
                {activeCategory === "All" ? "COMPLETE MENU" : activeCategory.toUpperCase()}
              </h2>
              <p className="text-xs text-ink/60 mt-0.5">{categoryInfo.tagline}</p>
            </div>
          </div>

          {/* Search + Veg toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes..."
                className="pl-10 rounded-xl border-ink/15 bg-white/90 text-xs focus-visible:ring-spice shadow-sm"
              />
            </div>

            <button
              onClick={() => setOnlyVeg((v) => !v)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all border ${
                onlyVeg
                  ? "bg-leaf text-cream border-leaf shadow-md"
                  : "border-ink/15 bg-white/80 text-ink hover:border-leaf hover:text-leaf"
              }`}
            >
              <span className="inline-flex size-3 items-center justify-center rounded-sm border border-current p-0.5 mr-1.5">
                <span className="size-1.5 rounded-full bg-current" />
              </span>
              Pure Veg
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-5 py-6">
        {/* Category pills - sticky horizontal scroll */}
        <div className="sticky top-[53px] z-30 bg-cream/95 backdrop-blur-md pt-2 pb-3 -mx-5 px-5 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto scrollbar-none border-b border-ink/5 mb-4">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-ink text-cream shadow-lg shadow-ink/15 scale-[1.02]"
                  : "border border-ink/12 bg-white/90 text-ink/70 hover:border-spice hover:text-spice"
              }`}
            >
              <span className="mr-1.5">{CATEGORY_META[cat]?.emoji}</span>
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6 mt-2">
          <p className="font-mono text-[11px] text-ink/50">
            Showing {filteredItems.length} of {menuItems.length} dishes
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              onClick={() => handleViewDish(item)}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition-shadow hover:shadow-xl cursor-pointer ${
                !item.isAvailable ? "opacity-50 grayscale-[40%]" : ""
              }`}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Badges */}
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  <span className="inline-flex size-5 items-center justify-center rounded-md border border-emerald-500 bg-white/90 p-0.5">
                    <span className="size-2.5 rounded-full bg-emerald-500" />
                  </span>
                  {item.badge && (
                    <span className="rounded-lg bg-[#FF6B00] px-2.5 py-0.5 font-mono text-[10px] font-black text-white shadow-sm uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                  {item.isTodaySpecial && !item.badge && (
                    <span className="rounded-lg bg-saffron px-2.5 py-0.5 font-mono text-[10px] font-bold text-ink shadow-sm">
                      🔥 TODAY'S SPECIAL
                    </span>
                  )}
                </div>

                {/* Eye icon - View Details */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDish(item);
                  }}
                  className="absolute right-3 top-3 grid size-9 place-items-center rounded-xl bg-white/90 text-ink shadow-md backdrop-blur-md transition-all hover:bg-spice hover:text-cream hover:scale-110"
                  title="View Details"
                >
                  <Eye className="size-4" />
                </button>

                {/* Prep time */}
                <div className="absolute bottom-3 right-3">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-ink/75 px-2.5 py-1 font-mono text-[10px] text-cream backdrop-blur-md">
                    <Clock className="size-3 text-saffron" />
                    {item.preparationTimeMinutes} min
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-base font-extrabold text-ink leading-tight group-hover:text-spice transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0 rounded-lg bg-cream px-1.5 py-0.5 font-mono text-xs font-bold text-ink border border-ink/10">
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      {item.rating}
                    </div>
                  </div>

                  <p className="mt-1.5 text-[11px] leading-relaxed text-ink/60 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Included items preview */}
                  {item.includedItems && (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {item.includedItems.slice(0, 3).map((inc) => (
                        <span
                          key={inc}
                          className="rounded-md bg-cream px-2 py-0.5 text-[9px] text-ink/50 border border-ink/5"
                        >
                          {inc}
                        </span>
                      ))}
                      {item.includedItems.length > 3 && (
                        <span className="text-[9px] font-semibold text-spice self-center">
                          +{item.includedItems.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Price + Actions */}
                <div className="mt-4 flex items-center justify-between border-t border-ink/8 pt-3">
                  <div>
                    <span className="font-display text-xl font-extrabold text-ink">
                      ₹{item.price}
                    </span>
                    {item.sizeVariants && item.sizeVariants.length > 1 && (
                      <span className="ml-1.5 text-[10px] text-ink/40 font-mono">
                        {item.sizeVariants.length} sizes
                      </span>
                    )}
                  </div>

                  {/* Quick add button */}
                  <motion.div whileTap={{ scale: 0.92 }}>
                    <Button
                      disabled={!item.isAvailable}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                      size="sm"
                      className="rounded-xl bg-spice text-cream hover:bg-ink text-xs font-bold px-4 h-8 shadow-sm gap-1"
                    >
                      <Plus className="size-3" />
                      Add
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">🍽️</span>
            <h3 className="font-display text-xl font-bold text-ink">No dishes found</h3>
            <p className="mt-1 text-sm text-ink/60">Try changing your filters or search query.</p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
                setOnlyVeg(false);
              }}
              className="mt-4 rounded-xl bg-ink px-5 py-2 text-xs font-bold text-cream hover:bg-spice transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <DishDetailModal
        item={detailItem}
        open={!!detailItem}
        onClose={() => setDetailItem(null)}
        thaliAddons={thaliAddons}
        onAddToCart={handleAddFromModal}
      />
    </div>
  );
};
