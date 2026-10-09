import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

interface ReviewsPageProps {
  onBack: () => void;
  onExploreMenu: () => void;
}

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  badge: string;
  dish: string;
  comment: string;
  likes: number;
}

const REVIEWS_DATA: Review[] = [
  {
    id: "rev-1",
    name: "Pooja Sharma",
    location: "Indiranagar, Bengaluru",
    rating: 5,
    date: "Yesterday",
    badge: "Verified Buyer · 42 orders",
    dish: "Dal Tadka Deluxe Thali",
    comment:
      "Genuinely feels like mom's cooking! The yellow dal tadka has that authentic desi ghee and burnt cumin aroma that you never get in commercial restaurants. The 3 rotis were still soft and piping hot when the insulated box arrived.",
    likes: 34,
  },
  {
    id: "rev-2",
    name: "Arjun Venkataraman",
    location: "Koramangala, Bengaluru",
    rating: 5,
    date: "2 days ago",
    badge: "Daily Lunch Customer",
    dish: "Special Dal Tadka Thali",
    comment:
      "I order my office lunch from here almost every day. Zero acidity, light on the stomach, and they actually change the sabzi daily! The live kitchen tracker and hot packaging are fantastic.",
    likes: 28,
  },
  {
    id: "rev-3",
    name: "Rohan & Sneha Gupta",
    location: "HSR Layout, Bengaluru",
    rating: 5,
    date: "4 days ago",
    badge: "Family Feast Buyer",
    dish: "Shahi Paneer Deluxe Thali + Gulab Jamun",
    comment:
      "Ordered 4 deluxe thalis for Sunday lunch with family. The Shahi paneer gravy was rich without being overly oily. And the hot Gulab Jamuns soaked in cardamom syrup were pure heaven. Best cloud kitchen in Bengaluru hands down!",
    likes: 19,
  },
  {
    id: "rev-4",
    name: "Dr. Meenakshi Sundaram",
    location: "Domlur, Bengaluru",
    rating: 5,
    date: "1 week ago",
    badge: "Health Conscious Foodie",
    dish: "Jammu Rajma Chawal Thali",
    comment:
      "As a physician, I rarely eat restaurant food because of cheap refined oils. Anima's Kitchen using 100% cow desi ghee and brass degchi slow-cooking is a game changer. The rajma was perfectly tender and wholesome.",
    likes: 45,
  },
  {
    id: "rev-5",
    name: "Vikram Malhotra",
    location: "Old Airport Road, Bengaluru",
    rating: 5,
    date: "1 week ago",
    badge: "Office Group Order",
    dish: "Handi Dum Biryani Combo",
    comment:
      "We ordered 8 thalis for an office team sprint lunch. Delivered in 22 minutes, packed in neat spill-proof compartments with mint raita and kachumber salad. Everybody in the team loved it.",
    likes: 16,
  },
  {
    id: "rev-6",
    name: "Ananya Deshmukh",
    location: "Indiranagar, Bengaluru",
    rating: 5,
    date: "2 weeks ago",
    badge: "Verified Buyer",
    dish: "Desi Ghee Tawa Rotis + Yellow Dal",
    comment:
      "The hand-rolled tawa rotis brushed with fresh cow ghee remind me of my nani's kitchen in Pune. The portion size of the Hungry Thali was very generous too.",
    likes: 12,
  },
];

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onBack, onExploreMenu }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  const handleLike = (id: string) => {
    setLikedReviews((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredReviews =
    activeFilter === "All"
      ? REVIEWS_DATA
      : activeFilter === "Tiffin Pass"
        ? REVIEWS_DATA.filter((r) => r.badge.includes("Tiffin") || r.dish.includes("Tiffin"))
        : activeFilter === "Thalis"
          ? REVIEWS_DATA.filter((r) => r.dish.includes("Thali"))
          : REVIEWS_DATA;

  return (
    <div className="min-h-screen bg-cream text-ink pb-24 sm:pb-12">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-frost/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="grid size-9 place-items-center rounded-full border border-ink/15 bg-frost text-ink hover:bg-ink hover:text-cream transition-all"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div>
              <h1 className="font-display text-xl font-black text-ink leading-tight">
                Customer Reviews & Ratings
              </h1>
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink/50">
                14,200+ Verified Foodies · 4.9 ★ Rating
              </p>
            </div>
          </div>

          <Button
            onClick={onExploreMenu}
            size="sm"
            className="rounded-full bg-spice text-cream hover:bg-ink text-xs font-semibold px-4 gap-1.5"
          >
            <span>Order Thali</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </header>

      {/* Ratings Hero */}
      <div className="border-b border-ink/10 bg-gradient-to-r from-saffron/20 via-frost to-cream py-12">
        <div className="mx-auto max-w-5xl px-5">
          <div className="grid gap-8 md:grid-cols-12 items-center">
            {/* Big Score Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="md:col-span-4 rounded-3xl border border-ink/10 bg-frost/95 p-6 text-center shadow-sm"
            >
              <span className="font-display text-6xl font-black text-ink">4.9</span>
              <div className="flex justify-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="size-5 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="font-mono text-xs font-bold text-ink/70">
                Based on 14,280+ Verified Orders
              </p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 font-mono text-[10px] font-bold text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="size-3" /> 98% Recommend Anima's
              </span>
            </motion.div>

            {/* Quality Metric Sliders */}
            <div className="md:col-span-8 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Food Taste & Freshness</span>
                  <span className="text-spice">4.9 / 5.0</span>
                </div>
                <div className="h-2 w-full rounded-full bg-ink/10 overflow-hidden">
                  <div className="h-full bg-spice rounded-full" style={{ width: "98%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Insulated Heat-Lock Packaging</span>
                  <span className="text-spice">4.9 / 5.0</span>
                </div>
                <div className="h-2 w-full rounded-full bg-ink/10 overflow-hidden">
                  <div className="h-full bg-spice rounded-full" style={{ width: "97%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Delivery Speed & Punctuality</span>
                  <span className="text-spice">4.8 / 5.0</span>
                </div>
                <div className="h-2 w-full rounded-full bg-ink/10 overflow-hidden">
                  <div className="h-full bg-spice rounded-full" style={{ width: "95%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Digestibility & Desi Ghee Purity</span>
                  <span className="text-spice">5.0 / 5.0</span>
                </div>
                <div className="h-2 w-full rounded-full bg-ink/10 overflow-hidden">
                  <div className="h-full bg-spice rounded-full" style={{ width: "99%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Reviews Feed */}
      <div className="mx-auto max-w-5xl px-5 py-10">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-5">
          <div className="flex flex-wrap gap-2">
            {["All", "Thalis", "Tiffin Pass"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                  activeFilter === tab
                    ? "bg-ink text-cream shadow-sm"
                    : "border border-ink/15 bg-frost/80 text-ink/70 hover:border-spice hover:text-spice"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              toast.info("Review form opened!", {
                description: "You can write a verified review after your order is delivered.",
              })
            }
            className="rounded-full border-ink/20 text-xs font-semibold hover:border-spice hover:text-spice gap-1.5"
          >
            <MessageSquare className="size-3.5" />
            <span>Write a Review</span>
          </Button>
        </div>

        {/* Reviews Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {filteredReviews.map((rev, i) => {
            const isLiked = likedReviews[rev.id];
            const currentLikes = rev.likes + (isLiked ? 1 : 0);
            return (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5, boxShadow: "0 20px 35px -10px rgba(36,24,15,0.12)" }}
                className="flex flex-col justify-between rounded-3xl border border-ink/10 bg-frost/80 p-6 shadow-sm backdrop-blur-md transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-base font-bold text-ink">{rev.name}</h3>
                      <p className="text-[11px] text-ink/50">{rev.location}</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-md bg-cream px-2 py-0.5 border border-ink/10">
                      <Star className="size-3.5 fill-amber-500 text-amber-500" />
                      <span className="font-mono text-xs font-bold text-ink">{rev.rating}.0</span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-cream px-2.5 py-0.5 font-mono text-[9px] font-bold text-emerald-800 border border-emerald-200">
                      ✓ {rev.badge}
                    </span>
                    <span className="font-mono text-[10px] text-ink/40">• {rev.date}</span>
                  </div>

                  <div className="mt-2 rounded-xl bg-cream/70 px-3 py-1 text-xs font-mono text-spice font-semibold border border-ink/5">
                    Dish: {rev.dish}
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-ink/75">"{rev.comment}"</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-ink/5 pt-3">
                  <span className="text-[11px] text-ink/50">Was this review helpful?</span>
                  <button
                    onClick={() => handleLike(rev.id)}
                    className={`flex items-center gap-1 rounded-full px-3 py-1 font-mono text-xs transition-all ${
                      isLiked
                        ? "bg-spice text-cream font-bold"
                        : "bg-cream text-ink/70 hover:text-spice border border-ink/10"
                    }`}
                  >
                    <ThumbsUp className="size-3" />
                    <span>{currentLikes}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 rounded-3xl border border-ink/10 bg-ink text-cream p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between shadow-xl"
        >
          <div>
            <h3 className="font-display text-2xl font-bold text-cream">
              Taste what 14,000+ happy customers are raving about
            </h3>
            <p className="mt-1 text-xs text-cream/70">
              Hot thalis delivered in 24 minutes with pure cow desi ghee.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button
              onClick={onExploreMenu}
              size="lg"
              className="mt-4 sm:mt-0 rounded-full bg-spice text-cream hover:bg-cream hover:text-ink font-bold px-8 h-12 shadow-lg"
            >
              Order Today's Thali
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
