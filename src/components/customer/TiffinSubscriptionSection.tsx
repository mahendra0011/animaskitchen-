import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDemoStore } from "@/context/DemoStoreContext";
import { INITIAL_TIFFIN_PLANS } from "@/data/mockKitchenData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Check,
  Clock,
  Sparkles,
  PauseCircle,
  PlayCircle,
  RotateCw,
  MapPin,
  Utensils,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import tiffinImage from "@/assets/animas-tiffin.jpg";
import type { TiffinPlan } from "@/types/kitchen";

export const TiffinSubscriptionSection: React.FC = () => {
  const { subscriptions, addSubscription, togglePauseSubscriptionDate, customerProfile } =
    useDemoStore();

  const [selectedSlot, setSelectedSlot] = useState<"lunch" | "dinner">("lunch");
  const [activePlanId, setActivePlanId] = useState<string>("plan-weekly");

  const weeklyMenu = [
    { day: "Monday", meal: "Yellow Dal Tadka, Seasonal Bhindi, 4 Rotis, Jeera Rice" },
    { day: "Tuesday", meal: "Jammu Rajma Masala, Aloo Gobi, 4 Rotis, Steamed Rice" },
    { day: "Wednesday", meal: "Dhaba Style Dal Makhani, Mix Veg, 4 Rotis, Pulao" },
    { day: "Thursday", meal: "Punjabi Kadhi Pakoda, Baingan Bharta, 4 Rotis, Rice" },
    { day: "Friday", meal: "Shahi Matar Paneer, Dal Fry, 4 Rotis, Rice, Gulab Jamun" },
  ];

  const activeSub = subscriptions[0];

  const handleSubscribe = (plan: TiffinPlan) => {
    const address = customerProfile.savedAddresses[0];
    if (address) {
      addSubscription(plan.id, selectedSlot, address);
    }
  };

  const tomorrowDateStr: string =
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0] || "";
  const isTomorrowPaused = tomorrowDateStr
    ? activeSub?.pausedDates.includes(tomorrowDateStr)
    : false;

  return (
    <section id="tiffin" className="border-t border-ink/10 bg-cream py-16">
      <div className="mx-auto max-w-6xl px-5">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-ink/10 pb-8"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-saffron font-bold">
              (c) — lunch &amp; dinner on repeat
            </p>
            <h2 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl text-ink">
              HOMESTYLE TIFFIN SUBSCRIPTIONS
            </h2>
            <p className="mt-2 text-sm text-ink/70 max-w-xl">
              Rotating homestyle lunch &amp; dinner prepared in small batches and delivered hot in
              insulated stainless steel boxes. Cancel or pause anytime with 1 tap.
            </p>
          </div>

          {/* Slot Toggle */}
          <div className="flex items-center gap-2 rounded-full border border-ink/15 bg-frost p-1 shadow-sm">
            <button
              onClick={() => setSelectedSlot("lunch")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                selectedSlot === "lunch"
                  ? "bg-ink text-cream shadow-sm"
                  : "text-ink/70 hover:text-ink"
              }`}
            >
              Lunch (12:30 - 2:00 PM)
            </button>
            <button
              onClick={() => setSelectedSlot("dinner")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                selectedSlot === "dinner"
                  ? "bg-ink text-cream shadow-sm"
                  : "text-ink/70 hover:text-ink"
              }`}
            >
              Dinner (7:30 - 9:00 PM)
            </button>
          </div>
        </motion.div>

        {/* Active Subscription Live Banner (if active) */}
        {activeSub && (
          <div className="mt-8 rounded-3xl border border-emerald-600/30 bg-emerald-600/10 p-6 backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-700 text-cream font-mono text-[10px]">
                    ACTIVE PASS
                  </Badge>
                  <span className="font-mono text-xs text-emerald-900 font-semibold">
                    {activeSub.daysRemaining} days remaining of {activeSub.totalDays}
                  </span>
                </div>
                <h3 className="mt-1 font-display text-2xl text-ink">{activeSub.planName}</h3>
                <p className="text-xs text-ink/70 flex items-center gap-1.5 mt-1">
                  <MapPin className="size-3.5 text-emerald-700" />
                  Delivering {activeSub.mealSlot} to:{" "}
                  <strong>{activeSub.deliveryAddress.street}</strong>
                </p>
              </div>

              {/* Pause / Skip tomorrow toggle */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (tomorrowDateStr) {
                      togglePauseSubscriptionDate(activeSub.id, tomorrowDateStr);
                    }
                  }}
                  className={`rounded-full text-xs font-semibold gap-1.5 ${
                    isTomorrowPaused
                      ? "border-emerald-700 bg-emerald-700 text-cream hover:bg-emerald-800"
                      : "border-ink/20 text-ink hover:border-spice hover:text-spice"
                  }`}
                >
                  {isTomorrowPaused ? (
                    <>
                      <PlayCircle className="size-3.5" />
                      <span>Meal Paused for Tomorrow (Click to Resume)</span>
                    </>
                  ) : (
                    <>
                      <PauseCircle className="size-3.5" />
                      <span>Skip Tomorrow's Meal</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Plans Grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {INITIAL_TIFFIN_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                y: -6,
                boxShadow: plan.isPopular
                  ? "0 24px 40px -10px rgba(226,92,29,0.25)"
                  : "0 20px 30px -10px rgba(36,24,15,0.12)",
              }}
              className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border p-6 backdrop-blur-md transition-shadow ${
                plan.isPopular
                  ? "border-spice bg-frost shadow-lg ring-2 ring-spice/20"
                  : "border-ink/10 bg-frost/80 hover:border-ink/20"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute right-0 top-0 rounded-bl-2xl bg-spice px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-cream shadow-sm">
                  MOST POPULAR
                </div>
              )}

              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-ink/50 block">
                  {plan.planType} meal plan
                </span>
                <h3 className="mt-1 font-display text-2xl text-ink">{plan.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink/70">{plan.description}</p>

                <div className="mt-5 flex items-baseline gap-1 border-b border-ink/10 pb-5">
                  <span className="font-display text-4xl text-ink">₹{plan.price}</span>
                  <span className="font-mono text-xs text-ink/60">
                    /
                    {plan.planType === "daily"
                      ? "day"
                      : plan.planType === "weekly"
                        ? "5-days"
                        : "month"}
                  </span>
                </div>

                {/* Features */}
                <ul className="mt-5 space-y-2.5 text-xs text-ink/80">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <span className="grid size-4 place-items-center rounded-full bg-emerald-600/15 text-emerald-700">
                        <Check className="size-2.5 stroke-[3]" />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Button
                  onClick={() => handleSubscribe(plan)}
                  className={`w-full rounded-full py-2.5 text-xs font-semibold shadow-sm transition-all ${
                    plan.isPopular
                      ? "bg-spice text-cream hover:bg-ink"
                      : "bg-ink text-cream hover:bg-spice"
                  }`}
                >
                  <span>Start {plan.name}</span>
                  <ChevronRight className="size-3.5 ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 5-Day Rotating Menu Preview */}
        <div className="mt-14 overflow-hidden rounded-3xl border border-ink/10 bg-ink text-cream p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cream/10 pb-5">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-saffron font-bold">
                WEEKLY ROTATION SCHEDULE
              </p>
              <h3 className="mt-1 font-display text-2xl sm:text-3xl text-cream">
                NO REPEATS · FRESH INGREDIENTS EVERY DAY
              </h3>
            </div>
            <span className="rounded-full bg-cream/10 px-3 py-1 font-mono text-xs text-saffron border border-saffron/20 self-start md:self-auto">
              5 Days Varied Menu
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {weeklyMenu.map((item, idx) => (
              <motion.div
                key={item.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.1)" }}
                className="rounded-2xl border border-cream/10 bg-cream/5 p-4 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-cream/10 pb-2">
                  <span className="font-display text-base text-saffron">{item.day}</span>
                  <span className="font-mono text-[10px] text-cream/40">Day {idx + 1}</span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-cream/80">{item.meal}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
