import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronDown,
  MapPin,
  Plus,
  ShoppingBag,
  Sparkles,
  Timer,
  User,
  Navigation,
  LogOut,
  Flame,
  Star,
  ShieldCheck,
  Menu as MenuIcon,
  X as XIcon,
  Utensils,
  BookOpen,
  ArrowDown,
  Heart,
  Phone,
  MessageCircle,
  Globe,
  Mail,
  Instagram,
  Facebook,
  ExternalLink,
  Smartphone,
  Download,
} from "lucide-react";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { DemoStoreProvider, useDemoStore } from "@/context/DemoStoreContext";
import { CustomerMenuSection } from "@/components/customer/CustomerMenuSection";
import { ThaliCustomizerModal } from "@/components/customer/ThaliCustomizerModal";
import { CartDrawer } from "@/components/customer/CartDrawer";
import { CheckoutModal } from "@/components/customer/CheckoutModal";
import { LiveTrackingView } from "@/components/customer/LiveTrackingView";
import { FullMenuPage } from "@/components/customer/FullMenuPage";
import { DishDetailPage } from "@/components/customer/DishDetailPage";
import { OffersPage } from "@/components/customer/OffersPage";
import { AboutUsPage } from "@/components/customer/AboutUsPage";
import { ReviewsPage } from "@/components/customer/ReviewsPage";
import { FaqPage } from "@/components/customer/FaqPage";
import { ContactPage } from "@/components/customer/ContactPage";
import { LegalCompliancePage } from "@/components/customer/LegalCompliancePage";
import { CustomerProfileDrawer } from "@/components/customer/CustomerProfileDrawer";
import { CustomerDashboardView } from "@/components/customer/CustomerDashboardView";
import { DeliveryPartnerView } from "@/components/delivery/DeliveryPartnerView";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { AppDownloadSection } from "@/components/customer/AppDownloadSection";
import { AuthModal } from "@/components/auth/AuthModal";

import heroBgImage from "@/assets/animas-hero-bg.png";
import heroThali from "@/assets/animas-hero-thali.jpg";
import dalSpecial from "@/assets/animas-dal-special.jpg";
import rotiImage from "@/assets/animas-roti-tawa.jpg";
import rajmaImage from "@/assets/animas-rajma-chawal.jpg";
import spiceKitchenImage from "@/assets/animas-spice-kitchen.jpg";
import gulabJamunImage from "@/assets/animas-gulab-jamun.jpg";
import lunchSpreadImage from "@/assets/animas-lunch-spread.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Anima’s Kitchen — Hot, Warm, Homemade Indian Food & Thalis" },
      {
        name: "description",
        content:
          "Order fresh Indian home food, thalis with customizable add-ons, 100% cow desi ghee, and live GPS delivery tracking.",
      },
      { property: "og:title", content: "Anima’s Kitchen — Hot, Warm, Homemade" },
      {
        property: "og:description",
        content:
          "Order fresh Indian home food, thalis with customizable add-ons, 100% cow desi ghee, and live GPS delivery tracking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  return (
    <DemoStoreProvider>
      <MainAppContent />
      <Toaster position="top-right" richColors />
    </DemoStoreProvider>
  );
}

type CustomerPage =
  "home" | "menu" | "offers" | "about" | "reviews" | "faq" | "contact" | "dashboard";

function MainAppContent() {
  const {
    activeRole,
    isAuthenticated,
    currentUser,
    logout,
    setAuthModalOpen,
    setAuthModalTab,
    trackingViewOpen,
    setTrackingViewOpen,
    cartCount,
    setCartDrawerOpen,
    setProfileDrawerOpen,
    activeOrder,
    menuItems,
    setThaliModalItem,
    addToCart,
    homepageCustomization,
    wishlistIds,
    socialPosts,
    daySpecialMeal,
  } = useDemoStore();

  const [areaChecked, setAreaChecked] = useState(false);
  const [customerPage, setCustomerPage] = useState<string>("home");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedDishPageId, setSelectedDishPageId] = useState<string | null>(null);

  // GSAP animation for floating food micro-badges and subtle ambient glow
  const heroAccentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window === "undefined" || !heroAccentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(".gsap-float", {
        y: -6,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3,
      });
      gsap.to(".gsap-pulse-slow", {
        scale: 1.03,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }, heroAccentRef);

    return () => ctx.revert();
  }, [customerPage]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-cream text-ink pb-20 lg:pb-0">
      {/* Role-Based Rendering */}
      {activeRole === "rider" && <DeliveryPartnerView />}

      {activeRole === "admin" && <AdminDashboardView initialTab="overview" />}

      {activeRole === "kds" && <AdminDashboardView initialTab="kds" />}

      {activeRole === "customer" && (
        <>
          {trackingViewOpen ? (
            <LiveTrackingView />
          ) : selectedDishPageId ? (
            <DishDetailPage
              dishId={selectedDishPageId}
              onBack={() => setSelectedDishPageId(null)}
            />
          ) : customerPage === "dashboard" ? (
            <CustomerDashboardView
              onBackToStore={() => setCustomerPage("home")}
              onOpenDishPage={(id) => setSelectedDishPageId(id)}
            />
          ) : customerPage === "menu" ? (
            <FullMenuPage
              onBack={() => setCustomerPage("home")}
              onOpenDishPage={(id) => setSelectedDishPageId(id)}
            />
          ) : customerPage === "offers" ? (
            <OffersPage
              onBack={() => setCustomerPage("home")}
              onExploreMenu={() => setCustomerPage("menu")}
            />
          ) : customerPage === "about" ? (
            <AboutUsPage
              onBack={() => setCustomerPage("home")}
              onExploreMenu={() => setCustomerPage("menu")}
            />
          ) : customerPage === "reviews" ? (
            <ReviewsPage
              onBack={() => setCustomerPage("home")}
              onExploreMenu={() => setCustomerPage("menu")}
            />
          ) : customerPage === "faq" ? (
            <FaqPage
              onBack={() => setCustomerPage("home")}
              onExploreMenu={() => setCustomerPage("menu")}
              onContactUs={() => setCustomerPage("contact")}
            />
          ) : customerPage === "contact" ? (
            <ContactPage
              onBack={() => setCustomerPage("home")}
              onExploreMenu={() => setCustomerPage("menu")}
            />
          ) : customerPage === "legal" ? (
            <LegalCompliancePage
              onBack={() => setCustomerPage("home")}
              onExploreMenu={() => setCustomerPage("menu")}
            />
          ) : (
            <>
              {/* Customer App Navigation Header */}
              <header className="sticky top-0 z-40 border-b border-ink/10 bg-frost/95 backdrop-blur-xl transition-all shadow-xs">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-2.5">
                  {/* Left: Brand Logo */}
                  <button
                    onClick={() => setCustomerPage("home")}
                    className="flex items-center gap-2.5 sm:gap-3 text-left shrink-0 group"
                    aria-label="Anima’s Kitchen home"
                  >
                    <img
                      src="/logo.jpeg"
                      alt="Anima's Kitchen Logo"
                      className="size-9 sm:size-10 rounded-xl object-cover shadow-xs border border-ink/10 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <span className="block font-display text-base sm:text-lg font-black leading-none tracking-tight text-ink">
                        ANIMA’S KITCHEN
                      </span>
                      <span className="mt-0.5 hidden sm:block font-mono text-[9px] uppercase tracking-[0.18em] text-ink/50">
                        Vikash Nagar, Kurji, Patna
                      </span>
                    </div>
                  </button>

                  {/* Center: Desktop Navigation Links (Cleanly spaced, neat hover effects) */}
                  <nav
                    className="hidden items-center gap-6 xl:gap-8 font-body text-xs sm:text-sm font-semibold text-ink/75 lg:flex"
                    aria-label="Main navigation"
                  >
                    <button
                      onClick={() => setCustomerPage("menu")}
                      className={`whitespace-nowrap transition-colors hover:text-spice ${
                        customerPage === "menu" ? "text-spice font-bold" : ""
                      }`}
                    >
                      Menu
                    </button>
                    <button
                      onClick={() => setCustomerPage("offers")}
                      className={`whitespace-nowrap transition-colors hover:text-spice ${
                        customerPage === "offers" ? "text-spice font-bold" : ""
                      }`}
                    >
                      Offers
                    </button>
                    <button
                      onClick={() => setCustomerPage("about")}
                      className={`whitespace-nowrap transition-colors hover:text-spice ${
                        customerPage === "about" ? "text-spice font-bold" : ""
                      }`}
                    >
                      About Us
                    </button>
                    <button
                      onClick={() => setCustomerPage("reviews")}
                      className={`whitespace-nowrap transition-colors hover:text-spice ${
                        customerPage === "reviews" ? "text-spice font-bold" : ""
                      }`}
                    >
                      Reviews
                    </button>
                    <button
                      onClick={() => setCustomerPage("faq")}
                      className={`whitespace-nowrap transition-colors hover:text-spice ${
                        customerPage === "faq" ? "text-spice font-bold" : ""
                      }`}
                    >
                      FAQ
                    </button>
                    <button
                      onClick={() => setCustomerPage("contact")}
                      className={`whitespace-nowrap transition-colors hover:text-spice ${
                        customerPage === "contact" ? "text-spice font-bold" : ""
                      }`}
                    >
                      Contact
                    </button>
                  </nav>

                  {/* Right: Actions (Wishlist, Cart, APK Download & Account) */}
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    {/* Download App Pill Button (Desktop only) */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden xl:inline-flex rounded-full border-emerald-600/30 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-1 font-body text-xs font-bold shadow-xs transition-all hover:scale-105 shrink-0 gap-1.5 h-8"
                      onClick={() => {
                        const appSection = document.getElementById("download-app");
                        if (appSection) appSection.scrollIntoView({ behavior: "smooth" });
                        else {
                          const link = document.createElement("a");
                          link.href = "/animas-kitchen.apk";
                          link.download = "AnimasKitchen-release.apk";
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }
                      }}
                      title="Download Android APK"
                    >
                      <Download className="size-3 text-emerald-700" />
                      <span>Download App</span>
                    </Button>

                    {/* Wishlist Trigger */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative size-8 sm:size-9 rounded-full border border-ink/10 bg-white/90 text-ink hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 shadow-xs shrink-0 transition-all"
                      onClick={() => setProfileDrawerOpen(true)}
                      aria-label={`Open Wishlist with ${wishlistIds.length} saved dishes`}
                      title="Saved Dishes / Wishlist"
                    >
                      <Heart
                        className={`size-3.5 sm:size-4 ${wishlistIds.length > 0 ? "fill-rose-500 text-rose-500" : ""}`}
                      />
                      {wishlistIds.length > 0 && (
                        <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-rose-500 font-mono text-[9px] font-bold text-white">
                          {wishlistIds.length}
                        </span>
                      )}
                    </Button>

                    {/* Cart Trigger */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative size-8 sm:size-9 rounded-full border border-ink/10 bg-white/90 text-ink hover:bg-white shadow-xs shrink-0 transition-all"
                      onClick={() => setCartDrawerOpen(true)}
                      aria-label={`Open cart with ${cartCount} items`}
                      title="Shopping Cart"
                    >
                      <ShoppingBag className="size-3.5 sm:size-4" />
                      {cartCount > 0 && (
                        <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-spice font-mono text-[9px] font-bold text-cream">
                          {cartCount}
                        </span>
                      )}
                    </Button>

                    {/* Desktop Auth State */}
                    {!isAuthenticated ? (
                      <div className="hidden lg:flex items-center gap-1.5 ml-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setAuthModalTab("login");
                            setAuthModalOpen(true);
                          }}
                          className="h-8 rounded-full px-3 text-xs font-semibold text-ink hover:text-spice hover:bg-cream/80"
                        >
                          Sign In
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setAuthModalTab("signup");
                            setAuthModalOpen(true);
                          }}
                          className="h-8 rounded-full bg-spice px-3.5 text-xs font-bold text-cream hover:bg-ink shadow-xs transition-all hover:scale-102"
                        >
                          Account
                        </Button>
                      </div>
                    ) : (
                      <div className="hidden lg:flex items-center gap-1.5 ml-1">
                        <button
                          onClick={() => setCustomerPage("dashboard")}
                          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all h-8 ${
                            customerPage === "dashboard"
                              ? "border-spice bg-spice text-cream shadow-xs"
                              : "border-ink/15 bg-white text-ink hover:border-spice"
                          }`}
                          title="Open Customer Dashboard"
                        >
                          <span className="grid size-5 place-items-center rounded-full bg-ink text-cream text-[10px] font-bold">
                            {currentUser?.name?.charAt(0) || "U"}
                          </span>
                          <span className="truncate max-w-[80px]">
                            {currentUser?.name?.split(" ")[0]}
                          </span>
                        </button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={logout}
                          className="size-8 rounded-full text-ink/60 hover:text-red-600 hover:bg-red-50"
                          title="Logout"
                        >
                          <LogOut className="size-3.5" />
                        </Button>
                      </div>
                    )}

                    {/* Mobile User Icon / Dashboard Trigger */}
                    <button
                      onClick={() => {
                        if (isAuthenticated) {
                          setCustomerPage("dashboard");
                        } else {
                          setAuthModalTab("login");
                          setAuthModalOpen(true);
                        }
                      }}
                      className="grid size-8 place-items-center rounded-full border border-ink/12 bg-white/80 text-ink hover:bg-white shadow-xs lg:hidden shrink-0"
                      aria-label={isAuthenticated ? "Open Dashboard" : "Sign In"}
                    >
                      {isAuthenticated ? (
                        <span className="grid size-5 place-items-center rounded-full bg-ink text-cream text-[10px] font-bold">
                          {currentUser?.name?.charAt(0) || "U"}
                        </span>
                      ) : (
                        <User className="size-4 text-ink/80" />
                      )}
                    </button>

                    {/* Mobile Navigation Menu Toggle */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-full border border-ink/12 bg-white/80 text-ink hover:bg-white shadow-xs lg:hidden shrink-0"
                      onClick={() => setMobileNavOpen((o) => !o)}
                      aria-label="Toggle Navigation Menu"
                    >
                      {mobileNavOpen ? (
                        <XIcon className="size-4" />
                      ) : (
                        <MenuIcon className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Mobile Navigation Dropdown Drawer */}
                {mobileNavOpen && (
                  <div className="border-t border-ink/10 bg-frost/98 px-4 py-4 backdrop-blur-2xl shadow-xl lg:hidden animate-in slide-in-from-top-2 duration-200">
                    {/* User Card if Authenticated or Sign In CTA */}
                    <div className="mb-3">
                      {isAuthenticated ? (
                        <div className="flex items-center justify-between rounded-2xl bg-ink p-3 text-cream">
                          <div className="flex items-center gap-2.5">
                            <span className="grid size-8 place-items-center rounded-full bg-cream text-ink font-bold text-xs">
                              {currentUser?.name?.charAt(0) || "U"}
                            </span>
                            <div>
                              <span className="text-xs font-bold block">{currentUser?.name}</span>
                              <span className="text-[10px] text-cream/60 font-mono block">
                                Customer Account
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setCustomerPage("dashboard");
                                setMobileNavOpen(false);
                              }}
                              className="rounded-lg bg-spice px-2.5 py-1 text-[11px] font-bold text-cream hover:bg-white hover:text-ink transition-colors"
                            >
                              Dashboard
                            </button>
                            <button
                              onClick={logout}
                              className="rounded-lg bg-white/10 p-1 text-cream hover:bg-red-600 transition-colors"
                              title="Logout"
                            >
                              <LogOut className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-ink/10 bg-cream/70 p-2.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setAuthModalTab("login");
                              setAuthModalOpen(true);
                              setMobileNavOpen(false);
                            }}
                            className="rounded-xl border-ink/20 text-xs font-bold bg-white text-ink"
                          >
                            Sign In
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setAuthModalTab("signup");
                              setAuthModalOpen(true);
                              setMobileNavOpen(false);
                            }}
                            className="rounded-xl bg-spice text-xs font-bold text-cream hover:bg-ink"
                          >
                            Create Account
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Nav Link List */}
                    <div className="flex flex-col gap-1 font-body text-sm font-semibold">
                      <button
                        onClick={() => {
                          setCustomerPage("dashboard");
                          setMobileNavOpen(false);
                        }}
                        className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors ${
                          customerPage === "dashboard"
                            ? "bg-spice text-cream font-bold"
                            : "text-ink hover:bg-cream/60"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <User className="size-4 text-spice" />
                          <span>👤 My Customer Dashboard</span>
                        </span>
                        <ArrowRight className="size-3.5 opacity-50" />
                      </button>

                      <button
                        onClick={() => {
                          setCustomerPage("menu");
                          setMobileNavOpen(false);
                        }}
                        className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors ${
                          customerPage === "menu"
                            ? "bg-spice text-cream font-bold"
                            : "text-ink hover:bg-cream/60"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span>🍽️</span>
                          <span>Complete Menu (20+ Dishes)</span>
                        </span>
                        <ArrowRight className="size-3.5 opacity-50" />
                      </button>

                      <button
                        onClick={() => {
                          setCustomerPage("offers");
                          setMobileNavOpen(false);
                        }}
                        className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors ${
                          customerPage === "offers"
                            ? "bg-spice text-cream font-bold"
                            : "text-ink hover:bg-cream/60"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span>🏷️</span>
                          <span>Deals & Promo Codes</span>
                        </span>
                        <ArrowRight className="size-3.5 opacity-50" />
                      </button>

                      <button
                        onClick={() => {
                          setCustomerPage("about");
                          setMobileNavOpen(false);
                        }}
                        className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors ${
                          customerPage === "about"
                            ? "bg-spice text-cream font-bold"
                            : "text-ink hover:bg-cream/60"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span>📖</span>
                          <span>About Anima’s Kitchen</span>
                        </span>
                        <ArrowRight className="size-3.5 opacity-50" />
                      </button>

                      <button
                        onClick={() => {
                          setCustomerPage("reviews");
                          setMobileNavOpen(false);
                        }}
                        className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors ${
                          customerPage === "reviews"
                            ? "bg-spice text-cream font-bold"
                            : "text-ink hover:bg-cream/60"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span>⭐</span>
                          <span>Customer Reviews (4.9★)</span>
                        </span>
                        <ArrowRight className="size-3.5 opacity-50" />
                      </button>

                      <button
                        onClick={() => {
                          setCustomerPage("faq");
                          setMobileNavOpen(false);
                        }}
                        className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors ${
                          customerPage === "faq"
                            ? "bg-spice text-cream font-bold"
                            : "text-ink hover:bg-cream/60"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span>❓</span>
                          <span>Frequently Asked Questions</span>
                        </span>
                        <ArrowRight className="size-3.5 opacity-50" />
                      </button>

                      <button
                        onClick={() => {
                          setCustomerPage("contact");
                          setMobileNavOpen(false);
                        }}
                        className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors ${
                          customerPage === "contact"
                            ? "bg-spice text-cream font-bold"
                            : "text-ink hover:bg-cream/60"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span>📍</span>
                          <span>Contact & WhatsApp Help</span>
                        </span>
                        <ArrowRight className="size-3.5 opacity-50" />
                      </button>

                      <button
                        onClick={() => {
                          setMobileNavOpen(false);
                          const appSection = document.getElementById("download-app");
                          if (appSection) appSection.scrollIntoView({ behavior: "smooth" });
                          else {
                            const link = document.createElement("a");
                            link.href = "/animas-kitchen.apk";
                            link.download = "AnimasKitchen-release.apk";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }
                        }}
                        className="flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors text-emerald-800 bg-emerald-500/10 font-bold hover:bg-emerald-500/20"
                      >
                        <span className="flex items-center gap-2.5">
                          <span>📲</span>
                          <span>Download Android App (APK)</span>
                        </span>
                        <Download className="size-3.5 text-emerald-700" />
                      </button>
                    </div>

                    {/* Quick Order Button in Drawer */}
                    <div className="mt-3 pt-3 border-t border-ink/10">
                      <Button
                        className="w-full rounded-xl bg-spice py-3 text-xs font-bold text-cream hover:bg-ink shadow-sm"
                        onClick={() => {
                          setMobileNavOpen(false);
                          const dalThali = menuItems[0];
                          if (dalThali) setThaliModalItem(dalThali);
                        }}
                      >
                        Order Dal Tadka Thali — ₹180
                      </Button>
                    </div>
                  </div>
                )}
              </header>

              {/* Dynamic Festival / Announcement Top Banner */}
              {homepageCustomization.festivalBannerActive && (
                <div
                  className={`relative z-30 py-2.5 px-4 text-center font-body text-xs sm:text-sm font-bold tracking-wide transition-colors ${
                    homepageCustomization.announcementColor === "spice"
                      ? "bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white"
                      : homepageCustomization.announcementColor === "emerald"
                        ? "bg-gradient-to-r from-emerald-700 via-teal-600 to-green-700 text-white"
                        : homepageCustomization.announcementColor === "purple"
                          ? "bg-gradient-to-r from-purple-800 via-pink-700 to-indigo-800 text-white"
                          : "bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white shadow-sm"
                  }`}
                >
                  <div className="mx-auto max-w-6xl flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                    <span className="rounded-full bg-white/20 px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase backdrop-blur-xs">
                      {homepageCustomization.festivalBadge || "FESTIVE OFFER"}
                    </span>
                    <span>{homepageCustomization.festivalBannerText}</span>
                  </div>
                </div>
              )}

              {/* Premium Culinary Hero Section - Compact Viewport Fit (No extra scrolling needed) */}
              <section
                ref={heroAccentRef}
                id="top"
                className="relative overflow-hidden min-h-[calc(100vh-64px)] lg:max-h-[820px] flex items-center bg-[#1A140E] border-b border-ink/10"
                style={{
                  backgroundImage: `url(${heroBgImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center right",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* Soft dark vignette on left side for 100% crisp typography and button contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent pointer-events-none md:max-w-[70%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                {/* Ambient Glowing Orbs in the background */}
                <div className="absolute top-1/4 left-1/3 size-64 rounded-full bg-orange-600/15 blur-3xl pointer-events-none animate-pulse-glow" />
                <div className="absolute bottom-1/3 right-1/4 size-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none animate-pulse-glow" />

                <div className="relative mx-auto max-w-6xl w-full px-5 sm:px-8 py-6 sm:py-8 z-10 flex flex-col lg:flex-row items-center justify-between gap-4">
                  <div className="max-w-xl lg:max-w-2xl space-y-3.5 sm:space-y-4">
                    {/* Location & Purity Pill Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1 shadow-md backdrop-blur-md hover:bg-white/20 transition-colors">
                      <MapPin className="size-3 text-[#E25C1D] fill-[#E25C1D] animate-pulse" />
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-white">
                        PATNA HUB #01 · VIKASH NAGAR, KURJI
                      </span>
                      <span className="text-white/30 font-mono">|</span>
                      <span className="font-mono text-[11px] font-medium text-white/90">
                        {homepageCustomization.heroBadge || "100% Desi Cow Ghee"}
                      </span>
                    </div>

                    {/* Main Headline */}
                    <div>
                      <h1 className="font-serif text-3xl sm:text-5xl lg:text-[62px] font-bold leading-[1.08] tracking-tight text-white drop-shadow-md">
                        {homepageCustomization.heroHeadline || "Ghar jaisa swaad."}
                      </h1>
                      <div className="relative inline-block mt-1">
                        <span className="font-serif italic text-3xl sm:text-5xl lg:text-[62px] font-bold text-[#E27D22] drop-shadow-md">
                          {homepageCustomization.heroSubheadline || "Har din."}
                        </span>
                        {/* Curved Swoosh Underline SVG */}
                        <svg
                          className="absolute -bottom-2 sm:-bottom-2.5 left-0 w-full h-2.5 sm:h-3 text-[#E27D22]"
                          viewBox="0 0 220 14"
                          fill="none"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M3 11C60 3 160 3 217 11"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Subtitle / Tagline */}
                    <p className="font-body text-xs sm:text-sm md:text-base text-white/90 leading-relaxed max-w-lg drop-shadow-sm">
                      {homepageCustomization.heroTagline ||
                        "Desi thalis, made with love and traditional recipes. Freshly cooked, just like home."}
                    </p>

                    {/* Action CTA Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                      <Button
                        className="rounded-full bg-gradient-to-r from-[#E25C1D] to-[#F17829] hover:from-[#c94d14] hover:to-[#E25C1D] text-white px-5 sm:px-7 py-3 font-body text-xs sm:text-sm font-bold shadow-lg shadow-orange-950/40 transition-all hover:scale-105 h-auto justify-center gap-2 active:scale-95"
                        onClick={() => {
                          const dalThali = menuItems[0];
                          if (dalThali) setThaliModalItem(dalThali);
                        }}
                      >
                        <Utensils className="size-3.5" />
                        <span>{homepageCustomization.ctaButtonText || "Order Thali"}</span>
                        <ArrowRight className="size-3.5" />
                      </Button>

                      <Button
                        variant="outline"
                        className="rounded-full border border-white/60 bg-black/40 hover:bg-white/20 hover:border-white text-white px-4 sm:px-5 py-3 font-body text-xs sm:text-sm font-bold backdrop-blur-md transition-all hover:scale-105 h-auto justify-center gap-1.5 active:scale-95"
                        onClick={() => {
                          const menuEl = document.getElementById("menu-section");
                          if (menuEl) menuEl.scrollIntoView({ behavior: "smooth" });
                          else setCustomerPage("menu");
                        }}
                      >
                        <BookOpen className="size-3.5" />
                        <span>View Menu</span>
                      </Button>

                      <Button
                        variant="outline"
                        className="rounded-full border border-emerald-400/50 bg-emerald-950/50 hover:bg-emerald-900/60 hover:border-emerald-400 text-emerald-200 px-4 sm:px-5 py-3 font-body text-xs sm:text-sm font-bold backdrop-blur-md transition-all hover:scale-105 h-auto justify-center gap-1.5 active:scale-95 shadow-md"
                        onClick={() => {
                          const appSection = document.getElementById("download-app");
                          if (appSection) appSection.scrollIntoView({ behavior: "smooth" });
                          else {
                            const link = document.createElement("a");
                            link.href = "/animas-kitchen.apk";
                            link.download = "AnimasKitchen-release.apk";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }
                        }}
                      >
                        <Smartphone className="size-3.5 text-emerald-400" />
                        <span>Download APK</span>
                        <Download className="size-3 text-emerald-400" />
                      </Button>

                      {/* Social Action Buttons requested by user */}
                      <a
                        href="https://www.facebook.com/share/1DkpxegDgy/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/50 bg-blue-900/40 hover:bg-blue-800/60 hover:border-blue-300 text-white px-3.5 sm:px-4 py-3 font-body text-xs sm:text-sm font-bold backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-md"
                        title="Follow Anima's Kitchen on Facebook"
                      >
                        <Facebook className="size-3.5 text-blue-400 fill-blue-400" />
                        <span>Facebook</span>
                        <ExternalLink className="size-3 opacity-60" />
                      </a>

                      <a
                        href="https://www.instagram.com/sanjaysingh1599?utm_source=qr&mdxt=NGFucWt6dWlldmlk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-pink-400/50 bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-orange-900/50 hover:border-pink-300 text-white px-3.5 sm:px-4 py-3 font-body text-xs sm:text-sm font-bold backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-md"
                        title="Follow Anima's Kitchen on Instagram"
                      >
                        <Instagram className="size-3.5 text-pink-400" />
                        <span>Instagram</span>
                        <ExternalLink className="size-3 opacity-60" />
                      </a>
                    </div>

                    {/* Metrics Bar */}
                    <div className="flex flex-wrap items-center gap-3 pt-2 text-white/90 font-mono text-[11px]">
                      <div className="flex items-center gap-2 rounded-xl bg-white/10 px-2.5 py-1 backdrop-blur-md border border-white/10">
                        <span>🛵</span>
                        <span className="font-bold text-white">24 Mins Delivery</span>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl bg-white/10 px-2.5 py-1 backdrop-blur-md border border-white/10">
                        <span>⭐</span>
                        <span className="font-bold text-emerald-400">4.9 ★ (14K+ Foodies)</span>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl bg-white/10 px-2.5 py-1 backdrop-blur-md border border-white/10">
                        <span>🌱</span>
                        <span className="font-bold text-white">100% Desi Ghee</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SINGLE CLEAN CONTINUOUS INFINITY RUNNER (Ak akeli saaf patti) - LEFT TO RIGHT SCROLL */}
              <div className="relative overflow-hidden bg-gradient-to-r from-[#D85012] via-[#F57C00] to-[#E25C1D] py-2.5 text-white shadow-md border-y border-amber-950/20 select-none">
                <div className="flex whitespace-nowrap marquee-reverse font-mono text-xs sm:text-sm font-black uppercase tracking-wider">
                  <div className="flex shrink-0 items-center gap-6 sm:gap-8 px-4">
                    <span className="flex items-center gap-2">
                      <span className="text-amber-200">✨</span> 100% PURE DESI COW GHEE
                    </span>
                    <span className="text-white/60 font-bold">•</span>
                    <span className="flex items-center gap-2">
                      <span className="text-amber-200">🍲</span> HOMESTYLE SMALL-BATCH COOKING
                    </span>
                    <span className="text-white/60 font-bold">•</span>
                    <span className="flex items-center gap-2">
                      <span className="text-amber-200">🚀</span> 25 MIN EXPRESS DISPATCH
                    </span>
                    <span className="text-white/60 font-bold">•</span>
                    <span className="flex items-center gap-2">
                      <span className="text-amber-200">🛵</span> FREE DELIVERY UNDER 4 KM
                    </span>
                    <span className="text-white/60 font-bold">•</span>
                    <span className="flex items-center gap-2">
                      <span className="text-amber-200">🌿</span> ZERO ARTIFICIAL FLAVORS
                    </span>
                    <span className="text-white/60 font-bold">•</span>
                    <span className="flex items-center gap-2">
                      <span className="text-amber-200">🔥</span> WARM OR NEXT THALI IS FREE
                    </span>
                    <span className="text-white/60 font-bold">•</span>
                    <span className="flex items-center gap-2">
                      <span className="text-amber-200">⭐</span> 4.9★ RATED IN PATNA
                    </span>
                    <span className="text-white/60 font-bold">•</span>
                  </div>
                  <div
                    className="flex shrink-0 items-center gap-6 sm:gap-8 px-4"
                    aria-hidden="true"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-amber-200">✨</span> 100% PURE DESI COW GHEE
                    </span>
                    <span className="text-white/60 font-bold">•</span>
                    <span className="flex items-center gap-2">
                      <span className="text-amber-200">🍲</span> HOMESTYLE SMALL-BATCH COOKING
                    </span>
                    <span className="text-white/60 font-bold">•</span>
                    <span className="flex items-center gap-2">
                      <span className="text-amber-200">🚀</span> 25 MIN EXPRESS DISPATCH
                    </span>
                    <span className="text-white/60 font-bold">•</span>
                    <span className="flex items-center gap-2">
                      <span className="text-amber-200">🛵</span> FREE DELIVERY UNDER 4 KM
                    </span>
                    <span className="text-white/60 font-bold">•</span>
                    <span className="flex items-center gap-2">
                      <span className="text-amber-200">🌿</span> ZERO ARTIFICIAL FLAVORS
                    </span>
                    <span className="text-white/60 font-bold">•</span>
                    <span className="flex items-center gap-2">
                      <span className="text-amber-200">🔥</span> WARM OR NEXT THALI IS FREE
                    </span>
                    <span className="text-white/60 font-bold">•</span>
                    <span className="flex items-center gap-2">
                      <span className="text-amber-200">⭐</span> 4.9★ RATED IN PATNA
                    </span>
                    <span className="text-white/60 font-bold">•</span>
                  </div>
                </div>
              </div>

              {/* 📲 Official Mobile App Download Section (Hero Section Ke Baad) */}
              <AppDownloadSection />

              {/* 🌟 Day Special Meal Section (Admin Editable on Day-Basis) */}
              {daySpecialMeal.active && (
                <section id="day-special" className="py-8 px-4 sm:px-6 bg-gradient-to-b from-amber-500/10 via-cream to-cream">
                  <div className="mx-auto max-w-6xl">
                    <div className="relative overflow-hidden rounded-3xl border-2 border-spice/30 bg-gradient-to-r from-ink via-stone-900 to-amber-950 p-6 sm:p-8 text-cream shadow-2xl">
                      {/* Decorative ambient backdrop */}
                      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-spice/20 blur-3xl pointer-events-none" />
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-spice/20 to-transparent w-full h-full pointer-events-none" />

                      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-spice px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-white shadow-md">
                              <Sparkles className="size-3.5" />
                              {daySpecialMeal.badge || "TODAY'S SPECIAL"}
                            </span>
                            <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-3 py-1 text-[11px] font-mono font-semibold text-amber-300">
                              📅 {daySpecialMeal.day === "Daily" ? "Fresh Today" : `${daySpecialMeal.day} Special`}
                            </span>
                            {daySpecialMeal.isVeg && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/60 border border-emerald-400/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                                🟢 100% Pure Veg
                              </span>
                            )}
                          </div>

                          <div>
                            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                              {daySpecialMeal.dishName}
                            </h2>
                            <p className="mt-2 font-body text-xs sm:text-sm text-cream/80 max-w-xl leading-relaxed">
                              {daySpecialMeal.description}
                            </p>
                          </div>

                          {/* Items Included Badges */}
                          {daySpecialMeal.itemsIncluded && daySpecialMeal.itemsIncluded.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              {daySpecialMeal.itemsIncluded.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-medium text-cream/90 backdrop-blur-sm border border-white/10"
                                >
                                  <Check className="size-3 text-emerald-400" />
                                  {item}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Pricing & Order CTA */}
                          <div className="flex flex-wrap items-center gap-4 pt-2">
                            <div className="flex items-baseline gap-2">
                              <span className="font-display text-3xl font-black text-spice">
                                ₹{daySpecialMeal.price}
                              </span>
                              {daySpecialMeal.originalPrice && daySpecialMeal.originalPrice > daySpecialMeal.price && (
                                <span className="text-sm font-mono text-cream/50 line-through">
                                  ₹{daySpecialMeal.originalPrice}
                                </span>
                              )}
                              <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                                Limited Daily Batches
                              </span>
                            </div>

                            <Button
                              className="rounded-full bg-gradient-to-r from-spice to-orange-500 hover:from-orange-600 hover:to-spice text-white font-bold px-6 py-2.5 text-xs sm:text-sm shadow-lg shadow-orange-950/40 hover:scale-105 active:scale-95 transition-all gap-2"
                              onClick={() => {
                                // Add as custom meal item to cart
                                const specialMenuItem = {
                                  id: `special-${daySpecialMeal.id}`,
                                  name: daySpecialMeal.dishName,
                                  description: daySpecialMeal.description,
                                  price: daySpecialMeal.price,
                                  category: "Thali",
                                  image: daySpecialMeal.imageUrl,
                                  isVeg: daySpecialMeal.isVeg,
                                  isAvailable: true,
                                  rating: 5.0,
                                  prepTimeMinutes: 20,
                                  calories: 620,
                                  customizable: false,
                                  spiceLevel: "medium" as const,
                                };
                                addToCart(specialMenuItem as any);
                              }}
                            >
                              <Utensils className="size-4" />
                              <span>Order Special Meal</span>
                              <Plus className="size-4 ml-1" />
                            </Button>
                          </div>
                        </div>

                        {/* Dish Visual Card */}
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-2xl group">
                          <img
                            src={daySpecialMeal.imageUrl}
                            alt={daySpecialMeal.dishName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                            <span className="rounded-md bg-black/60 backdrop-blur-md px-2.5 py-1 text-white font-mono font-bold border border-white/20">
                              🔥 Cooked Fresh Today
                            </span>
                            <span className="rounded-md bg-emerald-600/90 px-2.5 py-1 text-white font-mono font-bold">
                              ₹{daySpecialMeal.price} Only
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Complete Interactive Menu Section with Add-ons Bar */}
              <CustomerMenuSection
                onOpenDishPage={(id) => setSelectedDishPageId(id)}
                onViewFullMenu={() => setCustomerPage("menu")}
              />

              {/* 📸 Instagram & Social Feed Section (Directly after Menu) */}
              <section id="kitchen-stories" className="py-14 sm:py-20 bg-gradient-to-b from-cream via-amber-500/5 to-cream border-t border-ink/10">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 border border-pink-300/60 px-3 py-1 text-xs font-mono font-bold text-pink-700 mb-2">
                        <Instagram className="size-3.5 text-pink-600" />
                        <span>@sanjaysingh1599 • LIVE KITCHEN STORIES</span>
                      </div>
                      <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
                        From Our Kitchen To Your Feed
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-ink/70 max-w-xl">
                        See real daily cooking behind the scenes, fresh ingredients, and customer love updated regularly.
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <a
                        href="https://www.instagram.com/sanjaysingh1599?utm_source=qr&mdxt=NGFucWt6dWlldmlk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-95 text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
                      >
                        <Instagram className="size-4" />
                        <span>View All Posts</span>
                        <ExternalLink className="size-3.5 opacity-70" />
                      </a>
                      <a
                        href="https://www.facebook.com/share/1DkpxegDgy/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
                      >
                        <Facebook className="size-4 fill-white" />
                        <span>Facebook</span>
                      </a>
                    </div>
                  </div>

                  {/* Posts Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {socialPosts.map((post) => (
                      <div
                        key={post.id}
                        className="group flex flex-col rounded-2xl border border-ink/10 bg-frost/90 overflow-hidden shadow-xs hover:shadow-xl transition-all hover:-translate-y-1 backdrop-blur-md"
                      >
                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden bg-ink/5">
                          <img
                            src={post.imageUrl}
                            alt={post.caption}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute top-2.5 right-2.5 rounded-full bg-black/60 backdrop-blur-md p-1.5 text-white">
                            {post.platform === "facebook" ? (
                              <Facebook className="size-3.5 fill-white" />
                            ) : (
                              <Instagram className="size-3.5 text-pink-400" />
                            )}
                          </div>
                          <div className="absolute bottom-2.5 left-2.5 rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono text-white/90">
                            {post.createdAt}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                          <p className="font-body text-xs text-ink/80 leading-relaxed line-clamp-3">
                            {post.caption}
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-ink/10 text-[11px] font-mono text-ink/60">
                            <span className="flex items-center gap-1 text-red-500 font-semibold">
                              <Heart className="size-3.5 fill-red-500 text-red-500" />
                              {post.likesCount || 120} likes
                            </span>
                            <a
                              href={post.postUrl || "https://www.instagram.com/sanjaysingh1599?utm_source=qr&mdxt=NGFucWt6dWlldmlk"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-spice hover:underline inline-flex items-center gap-1"
                            >
                              <span>View Post</span>
                              <ExternalLink className="size-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>


              {/* Delivery Guarantee Section (Placed immediately after Menu for high visibility) */}
              <section
                id="delivery"
                className="border-y border-ink/10 bg-cream py-16 overflow-hidden"
              >
                <div className="mx-auto max-w-6xl px-5">
                  <div className="grid gap-8 md:grid-cols-3 items-center">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.3em] text-spice">
                        (i) — delivery promise
                      </p>
                      <h2 className="mt-3 font-display text-3xl sm:text-4xl tracking-tight">
                        We deliver warm, or your next thali is free.
                      </h2>
                      <p className="mt-3 font-body text-sm text-ink/70 leading-relaxed">
                        Insulated thermal carriers, timed dispatch and fresh delivery across Kurji,
                        Patliputra, Digha, and nearby Patna areas.{" "}
                        <strong>Free delivery under 4 km</strong> (Min. order ₹250). Delivery charge
                        extra beyond 4 km.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-6 rounded-full border-ink/15 bg-frost/60 text-ink hover:border-spice hover:bg-frost hover:text-spice transition-all hover:scale-105 active:scale-95"
                        onClick={() => setAreaChecked((c) => !c)}
                      >
                        <MapPin className="size-4 mr-1.5" />
                        {areaChecked
                          ? "✓ Vikash Nagar, Kurji, Patna (Under 4km Free Zone)"
                          : "Check delivery area (Kurji, Patna)"}
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                      <div className="rounded-3xl border border-ink/10 bg-frost/80 p-5 backdrop-blur-xl shadow-xs hover:shadow-lg transition-all hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
                            Avg Dispatch Time
                          </p>
                          <Timer className="size-4 text-spice" />
                        </div>
                        <p className="mt-2 font-display text-3xl text-ink">25 min</p>
                        <span className="text-[10px] text-ink/60 mt-0.5 block">
                          Cooked fresh & dispatched hot
                        </span>
                      </div>

                      <div className="rounded-3xl border border-ink/10 bg-frost/80 p-5 backdrop-blur-xl shadow-xs hover:shadow-lg transition-all hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
                            Free Delivery Radius
                          </p>
                          <MapPin className="size-4 text-spice" />
                        </div>
                        <p className="mt-2 font-display text-2xl font-bold text-emerald-700">
                          Under 4 km
                        </p>
                        <span className="text-[10px] text-ink/70 mt-0.5 block font-medium">
                          Free under 4 km (Min ₹250) · Extra beyond 4 km
                        </span>
                      </div>

                      <div className="rounded-3xl border border-ink/10 bg-frost/80 p-5 backdrop-blur-xl shadow-xs hover:shadow-lg transition-all hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
                            Kitchen Service Hours
                          </p>
                          <Sparkles className="size-4 text-spice" />
                        </div>
                        <p className="mt-2 font-display text-lg font-bold text-ink leading-snug">
                          9 AM – 2 PM
                          <br />7 PM – 10 PM
                        </p>
                        <span className="text-[10px] text-spice font-medium block mt-0.5">
                          Morning & Evening Slots
                        </span>
                      </div>

                      <div className="rounded-3xl border border-ink/10 bg-frost/80 p-5 backdrop-blur-xl shadow-xs hover:shadow-lg transition-all hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
                            Delivery Charge
                          </p>
                          <ShoppingBag className="size-4 text-spice" />
                        </div>
                        <p className="mt-2 font-display text-2xl font-bold text-emerald-700">
                          ₹0 (Free Under 4km)
                        </p>
                        <span className="text-[10px] text-ink/70 block mt-0.5 font-medium">
                          Delivery charge extra beyond 4 km
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Dynamic Festival / Event Showcase Banner */}
              {homepageCustomization.posterBannerActive && (
                <section className="relative overflow-hidden bg-gradient-to-br from-[#2D1204] via-[#1A0A02] to-[#3D1A06] text-cream py-12 sm:py-16 border-y border-amber-900/40">
                  <div className="mx-auto max-w-6xl px-5">
                    <div className="relative rounded-3xl bg-gradient-to-r from-amber-950/70 via-stone-900/90 to-amber-950/70 border border-amber-500/30 p-6 sm:p-10 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="space-y-4 max-w-xl z-10 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-400/40 px-3.5 py-1 text-xs font-mono font-bold tracking-wider text-amber-300">
                          <Sparkles className="size-3.5" />
                          <span>{homepageCustomization.festivalBadge || "FESTIVE EDITION"}</span>
                        </div>
                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                          {homepageCustomization.posterBannerTitle || "Special Festive Feast Box"}
                        </h2>
                        <p className="font-body text-sm sm:text-base text-cream/80 leading-relaxed">
                          {homepageCustomization.posterBannerDescription ||
                            "Slow-cooked in pure Desi Cow Ghee with stone-ground spices. Order in advance for your family and office celebrations."}
                        </p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                          <Button
                            className="rounded-full bg-spice hover:bg-orange-600 text-white font-bold px-6 py-3 shadow-lg hover:scale-105 transition-all text-sm gap-2"
                            onClick={() => {
                              const festiveItem = menuItems[0];
                              if (festiveItem) setThaliModalItem(festiveItem);
                            }}
                          >
                            <Utensils className="size-4" />
                            <span>
                              {homepageCustomization.ctaButtonText || "Order Festive Special"}
                            </span>
                          </Button>
                        </div>
                      </div>

                      {/* Poster / Food Image Display */}
                      <div className="relative z-10 w-full md:w-80 lg:w-96 shrink-0 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-2xl">
                        <img
                          src={homepageCustomization.posterBannerImageUrl || lunchSpreadImage}
                          alt={homepageCustomization.posterBannerTitle || "Festive Meal Special"}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 left-3 right-3 text-center bg-black/60 backdrop-blur-md rounded-xl py-1.5 px-3 border border-white/10 font-mono text-xs font-bold text-amber-200">
                          {homepageCustomization.specialOfferBannerText}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Fresh From The Tawa Section */}
              <section
                id="tawa"
                className="border-y border-ink/10 bg-saffron/20 py-16 overflow-hidden"
              >
                <div className="mx-auto max-w-6xl px-5">
                  <div className="grid items-center gap-8 md:grid-cols-[1.15fr_0.85fr]">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6 }}
                    >
                      <img
                        src={rotiImage}
                        alt="Fresh puffed rotis on a hot iron tawa with ghee"
                        width={1200}
                        height={900}
                        loading="lazy"
                        className="aspect-[4/3] w-full rounded-[min(3vw,28px)] object-cover shadow-xl shadow-ink/10 hover:scale-102 transition-transform duration-500"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    >
                      <p className="font-mono text-xs uppercase tracking-[0.3em] text-spice">
                        (d) — straight off the tawa
                      </p>
                      <h2 className="mt-3 font-display text-4xl leading-none tracking-tight sm:text-5xl">
                        Soft rotis.
                        <br />
                        <span className="text-spice">Pure Desi Ghee.</span>
                      </h2>
                      <p className="mt-4 max-w-[38ch] font-body text-sm leading-6 text-ink/70">
                        Every roti is hand-rolled, puffed on iron tawa, and brushed with pure desi
                        cow ghee just before leaving our kitchen in insulated containers.
                      </p>
                      <Button
                        className="mt-6 rounded-full bg-ink px-6 py-2.5 font-body text-sm font-semibold text-cream shadow-none hover:bg-spice transition-all hover:scale-105 active:scale-95"
                        onClick={() => {
                          const tawaRoti =
                            menuItems.find((m) => m.name.includes("Tawa Roti")) || menuItems[0];
                          if (tawaRoti) addToCart(tawaRoti);
                        }}
                      >
                        Add Desi Ghee Rotis · ₹60 <Plus className="size-4 ml-1" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* Comfort Bowl Section */}
              <section id="comfort" className="bg-cream py-16 overflow-hidden">
                <div className="mx-auto max-w-6xl px-5">
                  <div className="grid items-center gap-8 md:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6 }}
                      className="order-2 md:order-1"
                    >
                      <p className="font-mono text-xs uppercase tracking-[0.3em] text-leaf font-bold">
                        (e) — ghar jaisa lunch
                      </p>
                      <h2 className="mt-3 font-display text-4xl leading-none tracking-tight sm:text-5xl">
                        Jammu Rajma Chawal,
                        <br />
                        <span className="text-leaf">no shortcuts.</span>
                      </h2>
                      <p className="mt-4 max-w-[38ch] font-body text-sm leading-6 text-ink/70">
                        Red kidney beans simmered low and slow, fluffy basmati rice, sharp pickled
                        onions and a spoonful of homemade mango pickle—the kind of lunch that brings
                        back childhood memories.
                      </p>
                      <div className="mt-6 flex items-center gap-4">
                        <span className="font-display text-3xl">₹180</span>
                        <Button
                          className="rounded-full bg-leaf px-6 py-2.5 font-body text-sm font-semibold text-cream shadow-none hover:bg-ink transition-all hover:scale-105 active:scale-95"
                          onClick={() => {
                            const rajma =
                              menuItems.find((m) => m.name.includes("Rajma")) || menuItems[0];
                            if (rajma) addToCart(rajma);
                          }}
                        >
                          Add to Order <Plus className="size-4 ml-1" />
                        </Button>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="order-1 md:order-2"
                    >
                      <img
                        src={rajmaImage}
                        alt="Rajma chawal with onion salad and pickle in a brass thali"
                        width={1200}
                        height={900}
                        loading="lazy"
                        className="aspect-[4/3] w-full rounded-[min(3vw,28px)] object-cover shadow-xl hover:scale-102 transition-transform duration-500"
                      />
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* Kitchen Standards & Philosophy */}
              <section id="kitchen" className="bg-ink text-cream py-16 overflow-hidden">
                <div className="mx-auto max-w-6xl px-5">
                  <div className="grid items-center gap-8 md:grid-cols-[0.85fr_1.15fr]">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6 }}
                    >
                      <p className="font-mono text-xs uppercase tracking-[0.3em] text-saffron">
                        (f) — the kitchen standard
                      </p>
                      <h2 className="mt-3 font-display text-4xl leading-none tracking-tight sm:text-5xl">
                        Stone-ground spices.
                        <br />
                        Always.
                      </h2>
                      <p className="mt-4 max-w-[38ch] font-body text-sm leading-6 text-cream/70">
                        We roast whole spices daily, make curries in heavy-bottomed brass utensils
                        and cook only what can be dispatched fresh within 25 minutes. Zero
                        artificial food color. Zero frozen gravies.
                      </p>
                      <div className="mt-7 grid max-w-sm grid-cols-2 gap-3 font-mono text-xs text-cream/70">
                        <span className="border-l-2 border-saffron pl-3">
                          <b className="block font-display text-2xl text-cream">12</b>whole roasted
                          spices
                        </span>
                        <span className="border-l-2 border-saffron pl-3">
                          <b className="block font-display text-2xl text-cream">0</b>frozen
                          shortcuts
                        </span>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    >
                      <img
                        src={spiceKitchenImage}
                        alt="Whole Indian spices beside a simmering copper cooking pot"
                        width={1200}
                        height={900}
                        loading="lazy"
                        className="aspect-[4/3] w-full rounded-[min(3vw,28px)] object-cover shadow-2xl shadow-black/40 hover:scale-102 transition-transform duration-500"
                      />
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* Sweet Finish Section */}
              <section id="sweet" className="bg-saffron/20 py-16 overflow-hidden">
                <div className="mx-auto max-w-6xl px-5">
                  <div className="grid items-center gap-8 md:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6 }}
                    >
                      <img
                        src={gulabJamunImage}
                        alt="Warm gulab jamun topped with pistachio and saffron"
                        width={1200}
                        height={900}
                        loading="lazy"
                        className="aspect-[4/3] w-full rounded-[min(3vw,28px)] object-cover shadow-xl hover:scale-102 transition-transform duration-500"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    >
                      <p className="font-mono text-xs uppercase tracking-[0.3em] text-spice">
                        (h) — end on a sweet note
                      </p>
                      <h2 className="mt-3 font-display text-4xl leading-none tracking-tight sm:text-5xl">
                        Shahi Gulab Jamun?
                        <br />
                        <span className="text-spice">Always a yes.</span>
                      </h2>
                      <p className="mt-4 max-w-[38ch] font-body text-sm leading-6 text-ink/70">
                        Pure khoya dumplings dipped in saffron & cardamom syrup, finished with
                        hand-sliced pistachios. The ideal ending to an honest thali meal.
                      </p>
                      <Button
                        className="mt-6 rounded-full bg-spice px-6 py-2.5 font-body text-sm font-semibold text-cream shadow-none hover:bg-ink transition-all hover:scale-105 active:scale-95"
                        onClick={() => {
                          const jamun =
                            menuItems.find((m) => m.name.includes("Gulab Jamun")) || menuItems[0];
                          if (jamun) addToCart(jamun);
                        }}
                      >
                        Add Dessert · ₹90 <Plus className="size-4 ml-1" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* Footer */}

              {/* Footer */}
              <footer className="bg-ink text-cream py-14">
                <div className="mx-auto max-w-6xl px-5">
                  <div className="grid gap-10 md:grid-cols-4">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-full bg-cream font-display text-lg leading-none text-ink">
                          A
                        </span>
                        <p className="font-display text-2xl tracking-tight">ANIMA’S KITCHEN</p>
                      </div>
                      <p className="mt-4 max-w-[36ch] font-body text-sm text-cream/60">
                        Warm Indian home food, cooked in small batches and delivered while it still
                        steams.
                      </p>

                      {/* Official Kitchen Social Handles */}
                      <div className="mt-5 flex items-center gap-3">
                        <a
                          href="https://www.facebook.com/share/1DkpxegDgy/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-full bg-[#1877F2]/20 border border-[#1877F2]/40 hover:bg-[#1877F2] text-cream px-3 py-1.5 text-xs font-semibold transition-all group"
                          title="Follow Anima's Kitchen on Facebook"
                        >
                          <Facebook className="size-3.5 fill-[#1877F2] text-[#1877F2] group-hover:fill-white group-hover:text-white transition-colors" />
                          <span>Facebook Page</span>
                        </a>

                        <a
                          href="https://wa.me/917004960724?text=Namaste%20Anima's%20Kitchen"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366] text-cream px-3 py-1.5 text-xs font-semibold transition-all group"
                          title="Chat on WhatsApp"
                        >
                          <MessageCircle className="size-3.5 fill-[#25D366] text-[#25D366] group-hover:fill-white group-hover:text-white transition-colors" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
                        Explore
                      </p>
                      <ul className="mt-4 space-y-2 font-body text-sm text-cream/70">
                        <li>
                          <button
                            onClick={() => setCustomerPage("menu")}
                            className="hover:text-saffron transition-colors text-left"
                          >
                            Full Menu (20+ Dishes)
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => setCustomerPage("offers")}
                            className="hover:text-saffron transition-colors text-left"
                          >
                            Deals & Promo Codes
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => setCustomerPage("about")}
                            className="hover:text-saffron transition-colors text-left"
                          >
                            About Us & Heritage
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => setCustomerPage("reviews")}
                            className="hover:text-saffron transition-colors text-left"
                          >
                            Customer Reviews (4.9★)
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => setCustomerPage("faq")}
                            className="hover:text-saffron transition-colors text-left"
                          >
                            Frequently Asked Questions
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => setCustomerPage("contact")}
                            className="hover:text-saffron transition-colors text-left"
                          >
                            Contact & WhatsApp Help
                          </button>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
                        Kitchen Location
                      </p>
                      <ul className="mt-4 space-y-2 font-body text-sm text-cream/70">
                        <li>Vikash Nagar, Kurji</li>
                        <li>Patna, Bihar, India</li>
                        <li>
                          <a
                            href="tel:+917004960724"
                            className="hover:text-saffron transition-colors"
                          >
                            📞 +91 70049 60724
                          </a>
                        </li>
                        <li>
                          <a
                            href="mailto:animaskitchen24@gmail.com"
                            className="hover:text-saffron transition-colors text-xs text-cream/80"
                          >
                            ✉️ animaskitchen24@gmail.com
                          </a>
                        </li>
                        <li className="text-xs text-saffron font-medium">
                          🕒 Morning: 9 AM – 2 PM | Evening: 7 PM – 10 PM
                        </li>
                        <li>
                          <button
                            onClick={() => setCustomerPage("contact")}
                            className="text-saffron hover:underline font-mono text-xs block mt-1"
                          >
                            Open Kitchen Map & Contact →
                          </button>
                        </li>
                      </ul>
                    </div>

                    {/* Column 3: Legal & Food Governance */}
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
                        Legal & Compliance
                      </p>
                      <ul className="mt-4 space-y-2 font-body text-sm text-cream/70">
                        <li>
                          <button
                            onClick={() => setCustomerPage("legal")}
                            className="hover:text-saffron transition-colors text-left flex items-center gap-1.5"
                          >
                            <span>Privacy Policy (DPDP 2023)</span>
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => setCustomerPage("legal")}
                            className="hover:text-saffron transition-colors text-left flex items-center gap-1.5"
                          >
                            <span>Terms of Service & Delivery</span>
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => setCustomerPage("legal")}
                            className="hover:text-saffron transition-colors text-left flex items-center gap-1.5"
                          >
                            <span>Refund & Cancellation Policy</span>
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => setCustomerPage("legal")}
                            className="hover:text-saffron transition-colors text-left flex items-center gap-1.5"
                          >
                            <span>FSSAI License & Hygiene</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-12 flex flex-col gap-2 border-t border-cream/10 pt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-cream/40 md:flex-row md:justify-between items-center">
                    <div className="flex flex-wrap items-center gap-3">
                      <span>© 2026 Anima’s Kitchen · Patna</span>
                      <span className="text-cream/20">|</span>
                      <button
                        onClick={() => setCustomerPage("legal")}
                        className="hover:text-saffron transition-colors lowercase"
                      >
                        Privacy Policy
                      </button>
                      <span className="text-cream/20">·</span>
                      <button
                        onClick={() => setCustomerPage("legal")}
                        className="hover:text-saffron transition-colors lowercase"
                      >
                        Terms of Service
                      </button>
                      <span className="text-cream/20">·</span>
                      <button
                        onClick={() => setCustomerPage("legal")}
                        className="hover:text-saffron transition-colors lowercase"
                      >
                        Refunds
                      </button>
                    </div>
                    <span className="text-emerald-400/90 font-semibold flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                      100% Homestyle · FSSAI Hygiene Compliant
                    </span>
                  </div>

                  {/* ─── AGENCY BRANDING & CREDITS: APEXTECHERA.ONLINE (PREMIUM SHOWCASE) ─── */}
                  <div className="mt-8 pt-6 border-t border-cream/10">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cream/[0.04] via-cream/[0.08] to-cream/[0.04] p-5 md:p-6 border border-cream/15 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                      {/* Left: Agency Identity & Badge */}
                      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
                        <div className="relative flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-saffron to-amber-600 text-ink shadow-lg shadow-saffron/20 ring-2 ring-saffron/40 font-display font-black text-lg tracking-tighter">
                          AT
                          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-cream/50">
                              Crafted & Engineered By
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-saffron/15 px-2 py-0.5 text-[9px] font-mono font-semibold text-saffron ring-1 ring-saffron/30">
                              Tech Partner
                            </span>
                          </div>
                          <a
                            href="https://apextechera.online"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group mt-0.5 inline-flex items-center gap-1.5 text-base sm:text-lg font-bold text-cream hover:text-saffron transition-all duration-300 font-display tracking-tight"
                          >
                            <span className="bg-gradient-to-r from-white via-cream to-saffron bg-clip-text text-transparent group-hover:from-saffron group-hover:to-amber-300">
                              Apex Tech Era
                            </span>
                            <span className="text-xs font-mono text-saffron/80 font-normal">
                              (apextechera.online)
                            </span>
                            <ExternalLink className="size-3.5 text-saffron/70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </a>
                          <p className="text-[11px] text-cream/50 font-sans mt-0.5">
                            High-Performance Web Apps, Cloud Architecture & Custom Software
                          </p>
                        </div>
                      </div>

                      {/* Right: Quick Action Contact Pills */}
                      <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs font-mono">
                        <a
                          href="https://apextechera.online"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cream/5 hover:bg-saffron hover:text-ink text-cream/80 border border-cream/10 transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
                          title="Official Website"
                        >
                          <Globe className="size-3.5 text-saffron group-hover:text-ink" />
                          <span>Website</span>
                        </a>

                        <a
                          href="https://instagram.com/apextechera.online"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cream/5 hover:bg-rose-500 hover:text-white text-cream/80 border border-cream/10 transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
                          title="Follow on Instagram"
                        >
                          <Instagram className="size-3.5 text-rose-400 group-hover:text-white" />
                          <span>@apextechera.online</span>
                        </a>

                        <a
                          href="mailto:mahendrapra0077@gmail.com"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cream/5 hover:bg-saffron hover:text-ink text-cream/80 border border-cream/10 transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
                          title="Direct Inquiries Email"
                        >
                          <Mail className="size-3.5 text-saffron" />
                          <span>Email</span>
                        </a>

                        <a
                          href="tel:+917724822660"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-300 border border-emerald-500/30 font-semibold transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
                          title="Call or WhatsApp Agency"
                        >
                          <Phone className="size-3.5 text-emerald-400 group-hover:text-white" />
                          <span>+91 77248 22660</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </footer>
            </>
          )}

          {/* ─── ANDROID MOBILE STICKY BOTTOM NAVIGATION BAR FOR STOREFRONT ─── */}
          {customerPage !== "dashboard" && !trackingViewOpen && !selectedDishPageId && (
            <nav
              className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-ink/10 bg-frost/95 py-2 px-1 backdrop-blur-xl shadow-2xl lg:hidden"
              aria-label="Mobile Bottom Navigation"
            >
              <button
                onClick={() => {
                  setCustomerPage("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex flex-col items-center gap-1 px-3 py-1 text-[11px] font-medium transition-colors ${
                  customerPage === "home" ? "text-spice font-bold" : "text-ink/60 hover:text-ink"
                }`}
              >
                <span className="text-base">🏠</span>
                <span>Home</span>
              </button>

              <button
                onClick={() => setCustomerPage("menu")}
                className={`flex flex-col items-center gap-1 px-3 py-1 text-[11px] font-medium transition-colors ${
                  customerPage === "menu" ? "text-spice font-bold" : "text-ink/60 hover:text-ink"
                }`}
              >
                <span className="text-base">🍽️</span>
                <span>Menu</span>
              </button>

              <button
                onClick={() => setCustomerPage("offers")}
                className={`flex flex-col items-center gap-1 px-3 py-1 text-[11px] font-medium transition-colors ${
                  customerPage === "offers" ? "text-spice font-bold" : "text-ink/60 hover:text-ink"
                }`}
              >
                <span className="text-base">🏷️</span>
                <span>Offers</span>
              </button>

              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative flex flex-col items-center gap-1 px-3 py-1 text-[11px] font-medium text-ink/70 hover:text-spice transition-colors"
              >
                <span className="relative">
                  <ShoppingBag className="size-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 grid size-4 place-items-center rounded-full bg-spice text-[9px] font-mono font-bold text-cream">
                      {cartCount}
                    </span>
                  )}
                </span>
                <span>Cart</span>
              </button>

              <button
                onClick={() => setCustomerPage("dashboard")}
                className={`flex flex-col items-center gap-1 px-3 py-1 text-[11px] font-medium transition-colors ${
                  customerPage === "dashboard"
                    ? "text-spice font-bold"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                <User className="size-4" />
                <span>Account</span>
              </button>
            </nav>
          )}

          {/* Customer Modals & Drawers - available in all customer screens */}
          <ThaliCustomizerModal />
          <CartDrawer />
          <CheckoutModal />
          <CustomerProfileDrawer />

          {/* ─── FLOATING QUICK ACTION BUTTONS (WHATSAPP & CALL) ─── */}
          {customerPage === "home" && !trackingViewOpen && (
            <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-2.5 pointer-events-auto">
              {/* WhatsApp Action Button */}
              <a
                href="https://wa.me/917004960724?text=Namaste%20Anima's%20Kitchen,%20I%20want%20to%20order%20food"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full bg-[#25D366] text-white px-3.5 py-2.5 sm:px-4 sm:py-2.5 shadow-lg hover:bg-[#20ba5a] hover:scale-105 active:scale-95 transition-all duration-300 ring-2 ring-white/30"
                aria-label="WhatsApp"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="size-5 fill-white text-white shrink-0" />
                <span className="font-bold text-xs sm:text-sm tracking-tight pr-1">WhatsApp</span>
              </a>

              {/* Call Action Button */}
              <a
                href="tel:+917004960724"
                className="group flex items-center gap-2 rounded-full bg-ink text-cream px-3.5 py-2.5 sm:px-4 sm:py-2.5 shadow-lg hover:bg-spice hover:scale-105 active:scale-95 transition-all duration-300 border border-cream/20 ring-2 ring-white/10"
                aria-label="Call"
                title="Call Anima's Kitchen"
              >
                <Phone className="size-4 text-saffron fill-saffron shrink-0" />
                <span className="font-bold text-xs sm:text-sm tracking-tight pr-1">Call Us</span>
              </a>
            </div>
          )}
        </>
      )}

      {/* Account / Role Authentication Modal */}
      <AuthModal />
    </main>
  );
}
