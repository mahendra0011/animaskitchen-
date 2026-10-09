import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Download,
  Sparkles,
  Zap,
  BellRing,
  MapPin,
  ShieldCheck,
  Star,
  Flame,
  CheckCircle2,
  Share2,
  Apple,
  X,
  PlusSquare,
  Compass,
} from "lucide-react";

export const AppDownloadSection: React.FC = () => {
  const [showIosGuide, setShowIosGuide] = useState(false);

  const handleDownloadApk = () => {
    // Direct link to trigger APK file download or release bundle
    const link = document.createElement("a");
    link.href = "/animas-kitchen.apk";
    link.download = "AnimasKitchen-release.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      id="download-app"
      className="relative overflow-hidden py-16 sm:py-20 bg-gradient-to-b from-[#1C140E] via-[#24180F] to-[#170E08] text-cream"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-10 size-72 rounded-full bg-orange-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 size-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: App Benefits & Download Button */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-orange-400">
                <Smartphone className="size-4 animate-bounce-subtle" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-orange-300">
                  ANDROID &amp; iOS SUPPORT
                </span>
              </div>
              <span className="text-white/40">•</span>
              <span className="font-mono text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                <Apple className="size-3.5" /> iPhone Ready
              </span>
            </div>

            {/* Headline */}
            <div>
              <h2 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Ghar Ka Swaad, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-[#FFA726] italic font-serif">
                  Ab Aapke Mobile App Par!
                </span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-cream/80 max-w-xl leading-relaxed">
                Order directly from our official mobile app on <strong>Android &amp; iPhone</strong> for
                lightning-fast 1-tap orders, real-time kitchen stove status, instant dispatch
                notifications &amp; exclusive app-only discounts.
              </p>
            </div>

            {/* Key App Features Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                <div className="flex items-center gap-2.5 mb-1 text-orange-400">
                  <Zap className="size-4 shrink-0" />
                  <span className="font-display text-sm font-bold text-white">
                    Instant 1-Tap Ordering
                  </span>
                </div>
                <p className="text-[11px] text-cream/60">
                  Repeat your favorite thalis in under 10 seconds.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                <div className="flex items-center gap-2.5 mb-1 text-emerald-400">
                  <MapPin className="size-4 shrink-0" />
                  <span className="font-display text-sm font-bold text-white">
                    Live GPS Delivery
                  </span>
                </div>
                <p className="text-[11px] text-cream/60">
                  Follow your rider through Patna streets with 0 delay.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                <div className="flex items-center gap-2.5 mb-1 text-amber-400">
                  <BellRing className="size-4 shrink-0" />
                  <span className="font-display text-sm font-bold text-white">
                    Stove Status Alerts
                  </span>
                </div>
                <p className="text-[11px] text-cream/60">
                  Know the exact minute dal is tempered &amp; packed hot.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                <div className="flex items-center gap-2.5 mb-1 text-rose-400">
                  <Star className="size-4 shrink-0" />
                  <span className="font-display text-sm font-bold text-white">
                    ₹100 First App Off
                  </span>
                </div>
                <p className="text-[11px] text-cream/60">
                  Auto-applied welcome discount on your first mobile order.
                </p>
              </div>
            </div>

            {/* Dual Download CTA Bar (Android + iOS) */}
            <div className="space-y-3 pt-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Android APK Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button
                    onClick={handleDownloadApk}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#E25C1D] via-[#FF7A00] to-[#E25C1D] hover:opacity-95 text-white font-display text-sm font-bold px-6 py-3.5 h-auto shadow-xl shadow-orange-950/40 gap-3 border border-orange-400/30"
                  >
                    <Smartphone className="size-5 shrink-0 text-white" />
                    <div className="text-left">
                      <span className="block text-[9px] uppercase tracking-wider font-mono opacity-80">
                        For Android Phones
                      </span>
                      <span className="text-sm font-black flex items-center gap-1.5">
                        Download Android APK <Download className="size-3.5" />
                      </span>
                    </div>
                  </Button>
                </motion.div>

                {/* iOS / iPhone Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button
                    onClick={() => setShowIosGuide(true)}
                    className="w-full rounded-2xl bg-white/10 hover:bg-white/15 text-white font-display text-sm font-bold px-6 py-3.5 h-auto shadow-xl border border-white/20 gap-3 backdrop-blur-md"
                  >
                    <Apple className="size-5 shrink-0 text-white" />
                    <div className="text-left">
                      <span className="block text-[9px] uppercase tracking-wider font-mono text-zinc-300">
                        For iPhone / iPad (iOS)
                      </span>
                      <span className="text-sm font-black flex items-center gap-1.5 text-white">
                        Install on iOS / iPhone <Sparkles className="size-3.5 text-amber-300" />
                      </span>
                    </div>
                  </Button>
                </motion.div>
              </div>

              <div className="flex flex-wrap items-center justify-start gap-4 text-xs font-mono text-cream/70">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="size-4" /> 100% Verified Safe &amp; Fast
                </span>
                <span className="hidden sm:inline text-white/30">•</span>
                <span>Android 8.0+ &amp; iOS 15+ Supported</span>
              </div>
            </div>
          </div>

          {/* Right Column: Realistic 3D Mobile Phone Mockup Template */}
          <div className="lg:col-span-5 flex justify-center">
            {/* Phone Frame */}
            <div className="relative w-[290px] sm:w-[320px] rounded-[48px] border-[10px] border-[#382B20] bg-black p-2.5 shadow-2xl shadow-orange-950/60 ring-1 ring-white/10">
              {/* Speaker / Dynamic Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#1A140E] rounded-full flex items-center justify-center gap-2 z-20">
                <div className="size-2 rounded-full bg-black/60" />
                <div className="w-8 h-1 rounded-full bg-white/10" />
              </div>

              {/* Phone Screen Display */}
              <div className="relative overflow-hidden rounded-[36px] bg-[#FAF6F0] text-[#24180F] pt-7 pb-4 px-3.5 space-y-3.5 min-h-[560px]">
                {/* Mobile App Header */}
                <div className="flex items-center justify-between border-b border-black/5 pb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src="/logo.png"
                      alt="Logo"
                      className="size-7 rounded-xl object-cover shadow-xs"
                    />
                    <div>
                      <span className="font-display text-xs font-extrabold text-[#24180F] block leading-tight">
                        Anima's Kitchen
                      </span>
                      <span className="font-mono text-[8px] text-emerald-700 font-bold flex items-center gap-0.5">
                        <span className="size-1 rounded-full bg-emerald-600 animate-ping" />
                        Kurji, Patna · Open Now
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#E25C1D]/10 px-2 py-0.5 font-mono text-[9px] font-bold text-[#E25C1D]">
                    4.9 ★
                  </span>
                </div>

                {/* Live Order Tracker In-App Card */}
                <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-white to-orange-500/5 p-3 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="font-bold text-[#E25C1D]">ORDER #8429</span>
                    <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                      COOKING LIVE
                    </span>
                  </div>
                  <h4 className="font-display text-xs font-bold text-[#24180F]">
                    Royal Dal Tadka Thali (Desi Ghee)
                  </h4>
                  {/* Progress bar */}
                  <div className="w-full bg-black/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#E25C1D] h-full w-2/3 rounded-full animate-pulse" />
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono text-black/60">
                    <span>Simmering in Brass Handi</span>
                    <span className="font-bold text-[#24180F]">ETA: 18 mins</span>
                  </div>
                </div>

                {/* Popular Dishes Carousel Preview in App */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] font-bold uppercase text-black/60">
                      Featured Thalis
                    </span>
                    <span className="font-mono text-[9px] text-[#E25C1D] font-bold">See All</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 rounded-xl border border-black/5 bg-white p-2 shadow-xs">
                      <div className="size-12 rounded-lg bg-orange-100 overflow-hidden shrink-0 flex items-center justify-center text-xl">
                        🥘
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-display text-xs font-bold text-[#24180F] block truncate">
                          Deluxe Desi Ghee Thali
                        </span>
                        <span className="text-[10px] text-black/50 block">
                          Dal, 3 Rotis, Sabzi, Rice
                        </span>
                        <span className="font-display text-xs font-extrabold text-[#E25C1D]">
                          ₹189
                        </span>
                      </div>
                      <span className="rounded-lg bg-[#E25C1D] text-white text-[10px] font-bold px-2 py-1 shadow-xs">
                        + Add
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 rounded-xl border border-black/5 bg-white p-2 shadow-xs">
                      <div className="size-12 rounded-lg bg-amber-100 overflow-hidden shrink-0 flex items-center justify-center text-xl">
                        🧀
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-display text-xs font-bold text-[#24180F] block truncate">
                          Paneer Tikka Handi Combo
                        </span>
                        <span className="text-[10px] text-black/50 block">Smoky Clay Tandoor</span>
                        <span className="font-display text-xs font-extrabold text-[#E25C1D]">
                          ₹229
                        </span>
                      </div>
                      <span className="rounded-lg bg-[#E25C1D] text-white text-[10px] font-bold px-2 py-1 shadow-xs">
                        + Add
                      </span>
                    </div>
                  </div>
                </div>

                {/* App Bottom Quick Bar */}
                <div className="pt-2">
                  <div className="rounded-xl bg-[#24180F] text-white p-2.5 flex items-center justify-between shadow-md">
                    <div>
                      <span className="text-[9px] font-mono text-white/60 block">
                        1 item in Bag
                      </span>
                      <span className="font-display text-xs font-bold">₹189 · Free Delivery</span>
                    </div>
                    <span className="rounded-lg bg-[#E25C1D] text-white font-bold text-[10px] px-3 py-1">
                      Checkout →
                    </span>
                  </div>
                </div>

                {/* Bottom Navigation Mockup */}
                <div className="pt-1 border-t border-black/5 flex justify-around text-[9px] font-mono text-black/50">
                  <span className="text-[#E25C1D] font-bold">● Home</span>
                  <span>Menu</span>
                  <span>Orders</span>
                  <span>Profile</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* iOS / iPhone Install Guide Interactive Modal */}
      <AnimatePresence>
        {showIosGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md rounded-3xl border border-white/20 bg-[#1E1610] p-6 text-cream shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowIosGuide(false)}
                className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="size-12 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center border border-white/10 shadow-md">
                  <Apple className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white leading-tight">
                    Install on iPhone / iPad
                  </h3>
                  <p className="text-xs text-orange-400 font-mono">
                    Instant 1-Click PWA App (No App Store wait)
                  </p>
                </div>
              </div>

              {/* Step by Step Guide */}
              <div className="space-y-3.5 my-5 text-xs text-cream/90 font-sans">
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="size-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-mono font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-white block mb-0.5">Open in Safari</span>
                    <span className="text-cream/70">
                      Open <strong className="text-white">animaskitchen.com</strong> on your iPhone Safari browser.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="size-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-mono font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-white block mb-0.5 flex items-center gap-1.5">
                      Tap the Share Button <Share2 className="size-3.5 text-blue-400" />
                    </span>
                    <span className="text-cream/70">
                      Tap the middle share icon (square with arrow pointing up) at the bottom bar of Safari.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="size-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-mono font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <span className="font-bold text-white block mb-0.5 flex items-center gap-1.5">
                      Select "Add to Home Screen" <PlusSquare className="size-3.5 text-emerald-400" />
                    </span>
                    <span className="text-cream/70">
                      Scroll down and tap <strong>Add to Home Screen</strong>, then tap <strong>Add</strong> in the top right.
                    </span>
                  </div>
                </div>
              </div>

              {/* Success note */}
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 flex items-center gap-2.5 text-emerald-300 text-xs font-mono">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>Anima's Kitchen app icon will appear directly on your iPhone home screen!</span>
              </div>

              {/* Action Button */}
              <div className="mt-5">
                <Button
                  onClick={() => setShowIosGuide(false)}
                  className="w-full rounded-full bg-gradient-to-r from-[#E25C1D] to-[#FF7A00] text-white font-bold py-3 hover:opacity-95"
                >
                  Got It, Thanks!
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
