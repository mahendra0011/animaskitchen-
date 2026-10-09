import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LiveMapCanvas } from "./LiveMapCanvas";
import {
  Home,
  UtensilsCrossed,
  Package,
  Bike,
  Calendar,
  Heart,
  RotateCcw,
  Tag,
  Wallet,
  Star,
  MapPin,
  CreditCard,
  MessageSquare,
  Bell,
  LifeBuoy,
  Gift,
  Award,
  User,
  Settings,
  LogOut,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Plus,
  Minus,
  Check,
  Phone,
  ChevronRight,
  ExternalLink,
  Flame,
  ShieldCheck,
  Send,
  X,
  RefreshCw,
  Menu,
  Receipt,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import type { Order, MenuItem, TicketIssueType, DeliveryAddress } from "@/types/kitchen";
import { OrderInvoiceModal } from "./OrderInvoiceModal";

export type CustomerDashboardTab =
  | "home"
  | "menu"
  | "orders"
  | "track"
  | "subscription"
  | "favorites"
  | "reorder"
  | "coupons"
  | "wallet"
  | "addresses"
  | "payments"
  | "reviews"
  | "notifications"
  | "support"
  | "membership"
  | "profile"
  | "settings";

interface CustomerDashboardViewProps {
  onBackToStore?: () => void;
  onOpenDishPage?: (dishId: string) => void;
}

export const CustomerDashboardView: React.FC<CustomerDashboardViewProps> = ({
  onBackToStore,
  onOpenDishPage,
}) => {
  const {
    currentUser,
    orders,
    activeOrder,
    setActiveOrderId,
    menuItems,
    subscriptions,
    customerWallet,
    loyaltyProfile,
    customerProfile,
    coupons,
    hasKitchenPass,
    setHasKitchenPass,
    addWalletMoney,
    redeemLoyaltyPoints,
    supportTickets,
    createSupportTicket,
    addToCart,
    setCartDrawerOpen,
    activeRider,
    verifyDeliveryOtp,
    logout,
    advanceDeliveryStep,
    wishlistIds,
    toggleWishlist,
  } = useDemoStore();

  const [activeTab, setActiveTab] = useState<CustomerDashboardTab>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderFilter, setOrderFilter] = useState<"all" | "active" | "completed" | "cancelled">(
    "all",
  );
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  // Address state
  const [addresses, setAddresses] = useState(customerProfile.savedAddresses);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState("Home");
  const [newAddrStreet, setNewAddrStreet] = useState("");
  const [newAddrInstructions, setNewAddrInstructions] = useState("");

  // Support ticket form state
  const [ticketIssue, setTicketIssue] = useState<TicketIssueType>("missing_item");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSubmitting, setTicketSubmitting] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      title: "Order #AK-8491 is Cooking!",
      description: "Chef is slow-cooking your yellow dal tadka on brass flame.",
      time: "5 mins ago",
      read: false,
      type: "order",
    },
    {
      id: "notif-2",
      title: "Weekday Tiffin Renewal",
      description: "Your monthly tiffin pass renewal is scheduled for next Monday.",
      time: "1 hour ago",
      read: false,
      type: "subscription",
    },
    {
      id: "notif-3",
      title: "₹50 Cashback Credited!",
      description: "Added to your Anima's Wallet from your previous order.",
      time: "Yesterday",
      read: true,
      type: "wallet",
    },
    {
      id: "notif-4",
      title: "New Weekend Coupon: FAMILYCOMBO",
      description: "Flat ₹150 OFF on orders above ₹699. Valid till Sunday.",
      time: "2 days ago",
      read: true,
      type: "coupon",
    },
  ]);

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  // Dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Active current order or fallback to first active
  const currentLiveOrder =
    activeOrder ||
    orders.find((o) => o.status !== "delivered" && o.status !== "cancelled") ||
    orders[0];

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "active") return o.status !== "delivered" && o.status !== "cancelled";
    if (orderFilter === "completed") return o.status === "delivered";
    if (orderFilter === "cancelled") return o.status === "cancelled";
    return true;
  });

  // Handle reordering
  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.menuItem, item.selectedAddons, item.specialInstructions);
    });
    setCartDrawerOpen(true);
    toast.success(`Reordered ${order.items.length} items from #${order.orderNumber}!`, {
      description: "Items added to your cart.",
    });
  };

  // Add address handler
  const handleAddAddress = () => {
    if (!newAddrStreet) {
      toast.error("Please enter a street address");
      return;
    }
    const newAddr: DeliveryAddress = {
      id: `addr-${Date.now()}`,
      label: newAddrLabel,
      street: newAddrStreet,
      area: "Patliputra Colony",
      city: "Patna",
      pincode: "800013",
      landmark: "Near Main Gate",
      isDefault: false,
      instructions: newAddrInstructions,
      coordinates: { lat: 25.6268, lng: 85.1118 },
      contactPhone: currentUser?.phone || customerProfile.phone || "+91 98765 43210",
      contactName: currentUser?.name || customerProfile.name || "Customer",
    };
    setAddresses((prev) => [...prev, newAddr]);
    setShowAddAddressModal(false);
    setNewAddrStreet("");
    setNewAddrInstructions("");
    toast.success(`Added new address: ${newAddrLabel}`);
  };

  // Submit support ticket
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage) {
      toast.error("Please enter your problem description");
      return;
    }
    setTicketSubmitting(true);
    createSupportTicket({
      customerName: currentUser?.name || customerProfile.name,
      customerPhone: currentUser?.phone || customerProfile.phone,
      orderId: currentLiveOrder?.id,
      issueType: ticketIssue,
      message: ticketMessage,
      priority: ticketIssue === "wrong_order" || ticketIssue === "missing_item" ? "high" : "medium",
      status: "open",
    });
    setTicketMessage("");
    setTicketSubmitting(false);
    toast.success("Support ticket created! A manager will respond in 5-10 mins.");
  };

  // Sidebar Menu Items
  const navItems: {
    id: CustomerDashboardTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    { id: "home", label: "Dashboard", icon: <Home className="size-4" /> },
    { id: "menu", label: "Order Food", icon: <UtensilsCrossed className="size-4" /> },
    {
      id: "orders",
      label: "My Orders",
      icon: <Package className="size-4" />,
      badge: orders.length > 0 ? `${orders.length}` : undefined,
    },
    {
      id: "track",
      label: "Track Order",
      icon: <Bike className="size-4" />,
      badge: currentLiveOrder && currentLiveOrder.status !== "delivered" ? "LIVE" : undefined,
    },
    { id: "favorites", label: "Favorites", icon: <Heart className="size-4" /> },
    { id: "reorder", label: "Reorder", icon: <RotateCcw className="size-4" /> },
    {
      id: "coupons",
      label: "Coupons & Offers",
      icon: <Tag className="size-4" />,
      badge: `${coupons.length}`,
    },
    { id: "addresses", label: "Addresses", icon: <MapPin className="size-4" /> },
    { id: "payments", label: "Payments", icon: <CreditCard className="size-4" /> },
    { id: "reviews", label: "Reviews & Ratings", icon: <MessageSquare className="size-4" /> },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="size-4" />,
      badge:
        notifications.filter((n) => !n.read).length > 0
          ? `${notifications.filter((n) => !n.read).length}`
          : undefined,
    },
    { id: "support", label: "Customer Support", icon: <LifeBuoy className="size-4" /> },
    { id: "membership", label: "Membership", icon: <Award className="size-4" /> },
    { id: "profile", label: "Profile", icon: <User className="size-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="size-4" /> },
  ];

  return (
    <div className="flex min-h-screen bg-cream text-ink">
      {/* ===================== SIDEBAR ===================== */}
      <aside className="hidden lg:flex w-72 flex-col justify-between border-r border-ink/10 bg-frost/95 backdrop-blur-xl shrink-0 p-5 overflow-y-auto">
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-5 border-b border-ink/10">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-ink text-cream font-display text-xl shadow-md">
                A
              </span>
              <div>
                <span className="font-display text-lg font-bold tracking-tight text-ink block leading-none">
                  ANIMA'S KITCHEN
                </span>
                <span className="font-mono text-[10px] text-spice font-bold uppercase tracking-wider block mt-1">
                  Customer Portal
                </span>
              </div>
            </div>

            {onBackToStore && (
              <button
                onClick={onBackToStore}
                title="Return to Main Storefront"
                className="text-ink/60 hover:text-spice p-1 rounded-lg transition-colors"
              >
                <ExternalLink className="size-4" />
              </button>
            )}
          </div>

          {/* User mini card */}
          <div className="mt-4 flex items-center gap-3 p-3 rounded-2xl bg-cream/80 border border-ink/5">
            <div className="size-10 rounded-full bg-spice text-cream grid place-items-center font-display font-bold text-sm">
              {(currentUser?.name || customerProfile.name).charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-display text-sm font-bold text-ink truncate block">
                {currentUser?.name || customerProfile.name}
              </span>
              <span className="text-[11px] text-ink/60 font-mono block truncate">
                {currentUser?.phone || customerProfile.phone}
              </span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="mt-5 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === "menu" && onBackToStore) {
                      onBackToStore();
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-ink text-cream shadow-sm"
                      : "text-ink/75 hover:bg-cream hover:text-spice"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? "text-saffron" : "text-ink/60"}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? "bg-spice text-cream" : "bg-ink/5 text-ink/70"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="pt-4 border-t border-ink/10 mt-6">
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start text-xs text-ink/70 hover:text-red-600 hover:bg-red-50 rounded-xl gap-2 font-semibold"
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* ===================== MAIN CONTENT AREA ===================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile Topbar */}
        <header className="sticky top-0 z-30 flex flex-col lg:hidden border-b border-ink/10 bg-frost/95 backdrop-blur-md">
          <div className="flex items-center justify-between p-3.5">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-xl bg-ink text-cream font-display text-base font-bold">
                A
              </span>
              <div>
                <span className="font-display font-bold text-sm block leading-tight">
                  ANIMA'S CUSTOMER
                </span>
                <span className="font-mono text-[9px] uppercase text-spice tracking-wider block">
                  Homestyle Food Hub
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onBackToStore && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onBackToStore}
                  className="rounded-xl text-xs font-semibold text-ink/75 hover:text-spice px-2 h-7"
                >
                  Storefront
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-xl text-xs px-2.5 h-7 gap-1"
              >
                {mobileMenuOpen ? <X className="size-3.5" /> : <Menu className="size-3.5" />}
                <span>{mobileMenuOpen ? "Close" : "Menu"}</span>
              </Button>
            </div>
          </div>

          {/* Horizontal Quick Swipeable Tabs for Android Phone */}
          <div className="px-3 pb-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-t border-ink/5 pt-2">
            {[
              { id: "home", label: "Home", icon: <Home className="size-3.5" /> },
              { id: "menu", label: "Menu", icon: <UtensilsCrossed className="size-3.5" /> },
              {
                id: "orders",
                label: `Orders (${orders.length})`,
                icon: <Package className="size-3.5" />,
              },
              { id: "track", label: "Track Live", icon: <Bike className="size-3.5" /> },
              {
                id: "wallet",
                label: `Wallet (₹${customerWallet.balance})`,
                icon: <Wallet className="size-3.5" />,
              },
              { id: "coupons", label: "Offers", icon: <Tag className="size-3.5" /> },
              { id: "favorites", label: "Wishlist", icon: <Heart className="size-3.5" /> },
              { id: "support", label: "Help", icon: <LifeBuoy className="size-3.5" /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as CustomerDashboardTab)}
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
                  activeTab === t.id
                    ? "bg-ink text-cream font-bold shadow-xs"
                    : "bg-cream text-ink/75 hover:text-spice"
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="border-b border-ink/10 bg-frost p-4 lg:hidden grid grid-cols-2 gap-2 shadow-md">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === item.id
                    ? "bg-ink text-cream font-bold"
                    : "bg-cream text-ink/80 hover:text-spice"
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Main View Container */}
        <main className="p-3.5 sm:p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6 sm:space-y-8 pb-24 lg:pb-8">
          {/* ===================== TAB: 1. DASHBOARD HOME ===================== */}
          {activeTab === "home" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Header Greeting Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-6">
                <div>
                  <div className="flex items-center gap-2 text-spice font-mono text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="size-3.5" />
                    <span>Pure Cow Desi Ghee Cloud Kitchen</span>
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl font-black text-ink mt-1">
                    {getGreeting()}, {(currentUser?.name || customerProfile.name).split(" ")[0]} 👋
                  </h1>
                  <p className="text-xs sm:text-sm text-ink/70 mt-1">
                    Everything for your daily meals, live order tracking, subscriptions & wallet in
                    one place.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setActiveTab("menu")}
                    className="rounded-full bg-spice text-cream hover:bg-ink text-xs font-bold px-5 h-10 shadow-sm gap-1.5"
                  >
                    <UtensilsCrossed className="size-3.5" />
                    <span>Quick Order Now</span>
                  </Button>
                </div>
              </div>

              {/* 4 Summary Quick Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab("favorites")}
                  className="rounded-2xl border border-ink/10 bg-frost/90 p-4 cursor-pointer hover:border-spice transition-shadow shadow-sm hover:shadow-md"
                >
                  <span className="font-mono text-[10px] text-ink/50 uppercase block font-bold">
                    Saved Wishlist
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-display text-2xl font-black text-rose-600">
                      {wishlistIds.length} Dishes
                    </span>
                    <span className="font-mono text-[11px] text-spice font-bold">View →</span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab("coupons")}
                  className="rounded-2xl border border-ink/10 bg-frost/90 p-4 cursor-pointer hover:border-spice transition-shadow shadow-sm hover:shadow-md"
                >
                  <span className="font-mono text-[10px] text-ink/50 uppercase block font-bold">
                    Active Coupons
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-display text-2xl font-black text-spice">
                      {coupons.length} Offers
                    </span>
                    <span className="font-mono text-[11px] text-emerald-700 font-bold">
                      Save ₹120
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab("orders")}
                  className="rounded-2xl border border-ink/10 bg-frost/90 p-4 cursor-pointer hover:border-spice transition-shadow shadow-sm hover:shadow-md"
                >
                  <span className="font-mono text-[10px] text-ink/50 uppercase block font-bold">
                    Total Orders
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-display text-2xl font-black text-ink">
                      {orders.length}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-600 font-bold">
                      Active: 1
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab("wallet")}
                  className="rounded-2xl border border-ink/10 bg-frost/90 p-4 cursor-pointer hover:border-spice transition-shadow shadow-sm hover:shadow-md"
                >
                  <span className="font-mono text-[10px] text-ink/50 uppercase block font-bold">
                    Kitchen Wallet
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-display text-2xl font-black text-leaf">
                      ₹{customerWallet.balance}
                    </span>
                    <span className="font-mono text-[10px] text-ink/50">Instant Pay</span>
                  </div>
                </motion.div>
              </div>

              {/* 🚚 Active Order Highlight Card */}
              {currentLiveOrder && (
                <div className="rounded-3xl border border-spice/30 bg-gradient-to-br from-white via-white to-spice/5 p-6 shadow-lg backdrop-blur-md">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="grid size-12 place-items-center rounded-2xl bg-spice/10 text-spice">
                        <Bike className="size-6 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-spice">
                            CURRENT ORDER #{currentLiveOrder.orderNumber}
                          </span>
                          <span className="rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5">
                            {currentLiveOrder.status.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-display text-lg font-bold text-ink mt-0.5">
                          {currentLiveOrder.items.map((i) => i.menuItem.name).join(" + ")}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-start md:self-auto">
                      <div>
                        <span className="text-[10px] font-mono text-ink/50 uppercase block">
                          Estimated Delivery
                        </span>
                        <span className="font-display text-xl font-bold text-ink">
                          {currentLiveOrder.estimatedDeliveryTime || "24 Mins"}
                        </span>
                      </div>
                      <Button
                        onClick={() => {
                          setActiveOrderId(currentLiveOrder.id);
                          setActiveTab("track");
                        }}
                        className="rounded-full bg-ink text-cream hover:bg-spice text-xs font-bold px-5 h-10 shadow-md gap-1.5"
                      >
                        <Bike className="size-3.5 text-saffron" />
                        <span>Track Order</span>
                      </Button>
                    </div>
                  </div>

                  {/* Order Progress Stepper Bar */}
                  <div className="mt-5 grid grid-cols-4 gap-2 text-center text-[10px] font-mono font-bold">
                    <div className="flex flex-col items-center">
                      <span className="size-3 rounded-full bg-emerald-600 mb-1" />
                      <span className="text-emerald-700">Placed</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="size-3 rounded-full bg-emerald-600 mb-1" />
                      <span className="text-emerald-700">Confirmed</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="size-3 rounded-full bg-spice animate-ping mb-1" />
                      <span className="text-spice">Cooking in Brass</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="size-3 rounded-full bg-ink/20 mb-1" />
                      <span className="text-ink/40">Out for Delivery</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid Split: Today's Special & Active Subscription */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* 🔥 Today's Special */}
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 20px 30px -10px rgba(36,24,15,0.12)" }}
                  transition={{ duration: 0.25 }}
                  className="rounded-3xl border border-ink/10 bg-frost/90 p-6 flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-spice uppercase tracking-wider">
                        🔥 TODAY'S SPECIAL
                      </span>
                      <span className="font-mono text-xs text-ink/60 font-semibold">₹189</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-ink">
                      Dal Tadka Deluxe Thali
                    </h3>
                    <p className="text-xs text-ink/70 mt-1 leading-relaxed">
                      Yellow dal tadka simmered in brass pot with cumin garlic tadka, 3 hand-rolled
                      rotis, jeera rice & house mango pickle.
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-ink/5">
                    <span className="font-mono text-[11px] text-leaf font-bold">
                      ✓ 100% Cow Desi Ghee
                    </span>
                    <Button
                      size="sm"
                      onClick={() => {
                        const dalThali = menuItems[0];
                        if (dalThali) addToCart(dalThali);
                      }}
                      className="rounded-xl bg-spice text-cream hover:bg-ink text-xs font-bold px-4 h-9 gap-1 shadow-sm"
                    >
                      <Plus className="size-3.5" />
                      <span>Order Now</span>
                    </Button>
                  </div>
                </motion.div>

                {/* 🛡️ Pure Cow Desi Ghee Promise */}
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 20px 30px -10px rgba(36,24,15,0.12)" }}
                  transition={{ duration: 0.25 }}
                  className="rounded-3xl border border-ink/10 bg-frost/90 p-6 flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-leaf uppercase tracking-wider">
                        🌱 100% PURE & FRESH
                      </span>
                      <Badge variant="outline" className="text-leaf border-leaf/30 text-[10px]">
                        AUTHENTIC
                      </Badge>
                    </div>
                    <h3 className="font-display text-xl font-bold text-ink">
                      Brass Pots & Cow Desi Ghee
                    </h3>
                    <p className="text-xs text-ink/70 mt-1 leading-relaxed">
                      Zero cheap palm or vegetable oils. We prepare fresh lunch & dinner in heavy
                      brass handis for genuine ghar-ka-swad and easy digestion.
                    </p>
                    <div className="mt-3 rounded-xl bg-cream/70 p-2.5 font-mono text-xs text-ink/70">
                      Kitchen Slots:{" "}
                      <span className="font-bold text-ink">
                        9 AM–2 PM (Lunch) & 7 PM–10 PM (Dinner)
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-ink/5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("menu")}
                      className="rounded-xl text-xs font-bold border-ink/15"
                    >
                      View All Thalis
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setActiveTab("menu")}
                      className="rounded-xl bg-ink text-cream hover:bg-spice text-xs font-bold px-4 h-9"
                    >
                      Order Fresh Meal
                    </Button>
                  </div>
                </motion.div>
              </div>

              {/* 🥘 Recommended For You */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink">Recommended For You</h3>
                    <p className="text-xs text-ink/60">
                      Curated dishes based on your taste for pure desi ghee & soft rotis.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("menu")}
                    className="font-mono text-xs font-bold text-spice hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {menuItems.slice(0, 3).map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.08 }}
                      whileHover={{ y: -5, boxShadow: "0 12px 24px -6px rgba(36,24,15,0.12)" }}
                      className="rounded-2xl border border-ink/10 bg-frost/90 p-3.5 flex flex-col justify-between shadow-sm cursor-pointer"
                    >
                      <div>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full aspect-[4/3] rounded-xl object-cover mb-2 transition-transform duration-300 hover:scale-102"
                        />
                        <h4 className="font-display text-sm font-bold text-ink truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-ink/60 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-ink/5">
                        <span className="font-display text-base font-bold text-ink">
                          ₹{item.price}
                        </span>
                        <motion.div whileTap={{ scale: 0.9 }}>
                          <Button
                            size="sm"
                            onClick={() => addToCart(item)}
                            className="h-8 rounded-lg bg-spice text-cream hover:bg-ink text-xs font-bold px-3 gap-1 shadow-sm"
                          >
                            <Plus className="size-3" />
                            <span>Add</span>
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 🎟️ Available Offers Banner */}
              <div className="rounded-3xl border border-spice/20 bg-gradient-to-r from-saffron/20 via-spice/10 to-frost p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-2xl bg-spice text-cream">
                    <Tag className="size-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-spice uppercase tracking-wider">
                      3 COUPONS AVAILABLE
                    </span>
                    <h4 className="font-display text-base font-bold text-ink">
                      Use code PEHLITHALI for flat 20% OFF on your next thali!
                    </h4>
                  </div>
                </div>
                <Button
                  onClick={() => setActiveTab("coupons")}
                  className="rounded-full bg-ink text-cream hover:bg-spice text-xs font-bold px-5 h-9 shrink-0"
                >
                  View All Offers
                </Button>
              </div>

              {/* 🔁 Recent Orders Quick Reorder */}
              {orders.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-xl font-bold text-ink">Recent Orders</h3>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="font-mono text-xs font-bold text-spice hover:underline"
                    >
                      See All Orders →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {orders.slice(0, 2).map((order) => (
                      <div
                        key={order.id}
                        className="rounded-2xl border border-ink/10 bg-frost/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-ink">
                              #{order.orderNumber}
                            </span>
                            <span className="text-xs text-ink/50">
                              • {order.items.length} items
                            </span>
                            <span className="rounded-md bg-cream px-2 py-0.5 text-[10px] font-mono text-emerald-800 font-bold border border-ink/5">
                              {order.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-ink/70 mt-1">
                            {order.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(", ")}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-display text-lg font-bold text-ink">
                            ₹{order.finalTotal}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => handleReorder(order)}
                            className="rounded-xl bg-spice text-cream hover:bg-ink text-xs font-bold px-4 h-9 gap-1"
                          >
                            <RotateCcw className="size-3" />
                            <span>Order Again</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB: 2. MY ORDERS ===================== */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-5">
                <div>
                  <h2 className="font-display text-2xl font-black text-ink">My Orders</h2>
                  <p className="text-xs text-ink/60">
                    Complete history, live status, reordering & invoices.
                  </p>
                </div>

                <div className="flex gap-2">
                  {(["all", "active", "completed", "cancelled"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setOrderFilter(f)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                        orderFilter === f
                          ? "bg-ink text-cream"
                          : "bg-frost text-ink/70 border border-ink/10 hover:border-spice"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-3xl border border-ink/10 bg-frost/90 p-5 sm:p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink/5 pb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-spice">
                          ORDER #{order.orderNumber}
                        </span>
                        <span className="font-mono text-[11px] text-ink/50 ml-2">
                          Placed recently
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-bold px-3 py-0.5 border border-emerald-200">
                          {order.status.toUpperCase()}
                        </span>
                        <span className="font-display text-lg font-bold text-ink">
                          ₹{order.finalTotal}
                        </span>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="space-y-2">
                      {order.items.map((i, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="font-medium text-ink">
                            {i.quantity} × {i.menuItem.name}
                          </span>
                          <span className="font-mono text-ink/60">₹{i.itemTotal * i.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Order action buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-ink/5">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setActiveOrderId(order.id);
                            setActiveTab("track");
                          }}
                          className="rounded-xl text-xs font-bold border-ink/15 hover:border-spice gap-1"
                        >
                          <Bike className="size-3.5" />
                          <span>Track Order</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="text-xs text-ink/70 hover:text-spice flex items-center gap-1"
                        >
                          <Receipt className="size-3.5 text-spice" />
                          <span>Download Invoice</span>
                        </Button>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleReorder(order)}
                        className="rounded-xl bg-spice text-cream hover:bg-ink text-xs font-bold px-4 gap-1"
                      >
                        <RotateCcw className="size-3.5" />
                        <span>Reorder</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB: 3. TRACK ORDER ===================== */}
          {activeTab === "track" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-ink/10 pb-4">
                <span className="font-mono text-xs font-bold text-spice uppercase tracking-wider">
                  LIVE SATELLITE GPS TRACKING
                </span>
                <h2 className="font-display text-2xl font-black text-ink mt-0.5">
                  Live Order Dispatch Tracker
                </h2>
              </div>

              {currentLiveOrder ? (
                <div className="grid gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-8 rounded-3xl border border-ink/10 bg-frost p-4 shadow-sm overflow-hidden min-h-[380px] flex flex-col justify-between">
                    <LiveMapCanvas
                      riderName={activeRider.name}
                      riderPhone={activeRider.phone}
                      riderVehicle={activeRider.vehicleNumber || activeRider.vehicle?.plateNumber}
                      status={currentLiveOrder.status}
                      estimatedMinutes={20}
                      branchName="Indiranagar Hub"
                    />
                  </div>

                  <div className="lg:col-span-4 rounded-3xl border border-ink/10 bg-frost/95 p-5 space-y-5">
                    <div>
                      <span className="font-mono text-[10px] text-ink/50 uppercase font-bold">
                        Live Order
                      </span>
                      <h3 className="font-display text-lg font-bold text-ink">
                        #{currentLiveOrder.orderNumber}
                      </h3>
                      <p className="text-xs text-ink/60 mt-0.5">
                        {currentLiveOrder.deliveryAddress.street}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-cream p-3.5 border border-ink/5 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-ink/60">Delivery Partner</span>
                        <span className="font-bold text-ink">{activeRider.name}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-ink/60">Partner Phone</span>
                        <a
                          href={`tel:${activeRider.phone}`}
                          className="text-spice font-mono font-bold hover:underline"
                        >
                          {activeRider.phone}
                        </a>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-ink/60">Vehicle</span>
                        <span className="font-mono font-bold text-ink">
                          {activeRider.vehicleNumber ||
                            activeRider.vehicle?.plateNumber ||
                            "KA-03-HA-8821"}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-ink/60">Delivery OTP</span>
                        <span className="font-mono font-black text-spice bg-spice/10 px-2 py-0.5 rounded">
                          {currentLiveOrder.deliveryOtp || "Pending"}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl bg-leaf/10 border border-leaf/20 p-3 text-center">
                      <span className="font-mono text-[11px] text-leaf font-bold block">
                        ● GPS Rider Live Connected
                      </span>
                      <p className="text-[11px] text-ink/70 mt-0.5">
                        Share this 4-digit OTP with the delivery partner upon arrival.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-ink/60">
                  <p>No active orders currently out for delivery.</p>
                  <Button
                    onClick={() => setActiveTab("menu")}
                    className="mt-4 rounded-full bg-spice text-cream"
                  >
                    Place an Order
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB: 5. FAVORITES ===================== */}
          {activeTab === "favorites" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-ink/10 pb-4">
                <h2 className="font-display text-2xl font-black text-ink">My Favorite Dishes</h2>
                <p className="text-xs text-ink/60">Quick 1-click reordering of dishes you love.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {menuItems.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-ink/10 bg-frost/90 p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
                        <img src={item.image} alt={item.name} className="size-full object-cover" />
                        <span className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white text-red-500 shadow-sm">
                          <Heart className="size-3.5 fill-red-500" />
                        </span>
                      </div>
                      <h3 className="font-display text-base font-bold text-ink">{item.name}</h3>
                      <p className="text-xs text-ink/60 line-clamp-2 mt-1">{item.description}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-ink/5">
                      <span className="font-display text-xl font-bold text-ink">₹{item.price}</span>
                      <Button
                        size="sm"
                        onClick={() => addToCart(item)}
                        className="rounded-xl bg-spice text-cream hover:bg-ink text-xs font-bold px-4 h-9 gap-1"
                      >
                        <Plus className="size-3.5" />
                        <span>Order Now</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB: 6. REORDER ===================== */}
          {activeTab === "reorder" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-ink/10 pb-4">
                <h2 className="font-display text-2xl font-black text-ink">1-Click Reorder</h2>
                <p className="text-xs text-ink/60">
                  Repeat your favorite past orders instantly without browsing.
                </p>
              </div>

              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-3xl border border-ink/10 bg-frost/90 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm"
                  >
                    <div>
                      <span className="font-mono text-xs font-bold text-spice">
                        PAST ORDER #{order.orderNumber}
                      </span>
                      <h3 className="font-display text-lg font-bold text-ink mt-1">
                        {order.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(" + ")}
                      </h3>
                      <p className="text-xs text-ink/60 mt-1">
                        Delivered to {order.deliveryAddress.street}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div>
                        <span className="text-[10px] font-mono text-ink/50 uppercase block">
                          Amount
                        </span>
                        <span className="font-display text-2xl font-bold text-ink">
                          ₹{order.finalTotal}
                        </span>
                      </div>
                      <Button
                        size="lg"
                        onClick={() => handleReorder(order)}
                        className="rounded-2xl bg-spice text-cream hover:bg-ink text-xs font-bold px-6 h-12 shadow-md gap-2"
                      >
                        <RotateCcw className="size-4" />
                        <span>ORDER AGAIN</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB: 7. COUPONS & OFFERS ===================== */}
          {activeTab === "coupons" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-ink/10 pb-4">
                <h2 className="font-display text-2xl font-black text-ink">
                  Coupons & Exclusive Offers
                </h2>
                <p className="text-xs text-ink/60">
                  Apply promo codes to your cart for direct discounts.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    code: "PEHLITHALI",
                    desc: "Flat 20% OFF on your first order",
                    min: "Min order ₹199",
                    exp: "Expires in 3 days",
                  },
                  {
                    code: "DESIGHEE50",
                    desc: "Flat ₹50 OFF on deluxe thalis",
                    min: "Min order ₹299",
                    exp: "Valid till Sunday",
                  },
                  {
                    code: "GULABFREE",
                    desc: "Free warm gulab jamun with any thali",
                    min: "Min order ₹249",
                    exp: "Active today",
                  },
                  {
                    code: "FAMILYCOMBO",
                    desc: "Flat ₹150 OFF on family spreads",
                    min: "Min order ₹699",
                    exp: "Active on weekends",
                  },
                ].map((c) => (
                  <div
                    key={c.code}
                    className="rounded-3xl border border-dashed border-ink/20 bg-frost/90 p-5 flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-base font-black text-spice">{c.code}</span>
                        <span className="font-mono text-[10px] text-ink/50">{c.exp}</span>
                      </div>
                      <p className="font-display text-sm font-bold text-ink mt-1.5">{c.desc}</p>
                      <span className="text-[11px] font-mono text-ink/50 block mt-1">{c.min}</span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-ink/5 flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(c.code);
                          toast.success(`Coupon code ${c.code} copied!`);
                        }}
                        className="rounded-xl bg-ink text-cream hover:bg-spice text-xs font-bold px-4 h-8 gap-1"
                      >
                        <Copy className="size-3" />
                        <span>Copy Code</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB: 8. WALLET ===================== */}
          {activeTab === "wallet" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-ink/10 pb-4">
                <h2 className="font-display text-2xl font-black text-ink">
                  Anima's Kitchen Wallet
                </h2>
                <p className="text-xs text-ink/60">
                  Instant checkout, instant refunds & exclusive cashbacks.
                </p>
              </div>

              {/* Wallet Card */}
              <div className="rounded-3xl border border-spice/30 bg-gradient-to-br from-ink via-ink/95 to-ink/90 text-cream p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <span className="font-mono text-xs text-saffron uppercase tracking-widest font-bold">
                    AVAILABLE WALLET BALANCE
                  </span>
                  <h3 className="font-display text-4xl sm:text-5xl font-black text-cream mt-1">
                    ₹{customerWallet.balance}
                  </h3>
                  <p className="text-xs text-cream/60 mt-1">
                    Auto-applied on checkout for zero-click instant ordering.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[100, 250, 500].map((amt) => (
                    <Button
                      key={amt}
                      onClick={() => addWalletMoney(amt)}
                      className="rounded-xl bg-white/10 hover:bg-spice text-cream text-xs font-bold h-10 px-4 border border-white/15"
                    >
                      +₹{amt}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Transactions List */}
              <div className="rounded-3xl border border-ink/10 bg-frost/90 p-6 space-y-4">
                <h3 className="font-display text-base font-bold text-ink">
                  Recent Wallet Transactions
                </h3>
                <div className="space-y-2.5">
                  {customerWallet.transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-cream/70 border border-ink/5 text-xs"
                    >
                      <div>
                        <span className="font-bold text-ink block">{tx.description}</span>
                        <span className="font-mono text-[10px] text-ink/50">{tx.date}</span>
                      </div>
                      <span
                        className={`font-mono text-sm font-bold ${
                          tx.type === "credit" ? "text-emerald-700" : "text-red-600"
                        }`}
                      >
                        {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB: 10. ADDRESSES ===================== */}
          {activeTab === "addresses" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-black text-ink">Saved Addresses</h2>
                  <p className="text-xs text-ink/60">
                    Manage home, office & delivery dropoff locations.
                  </p>
                </div>

                <Button
                  onClick={() => setShowAddAddressModal(true)}
                  className="rounded-full bg-spice text-cream hover:bg-ink text-xs font-bold px-4 h-9 gap-1"
                >
                  <Plus className="size-3.5" />
                  <span>Add New Address</span>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="rounded-3xl border border-ink/10 bg-frost/90 p-5 flex flex-col justify-between shadow-sm space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-base font-bold text-ink">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 border border-emerald-200">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink/70 mt-1 leading-relaxed">{addr.street}</p>
                      {addr.instructions && (
                        <p className="text-[11px] text-ink/50 mt-1 font-mono">
                          Note: {addr.instructions}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-ink/5 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setAddresses((prev) =>
                            prev.map((a) => ({ ...a, isDefault: a.id === addr.id })),
                          );
                          toast.success(`Set ${addr.label} as default delivery address`);
                        }}
                        className="text-spice hover:underline font-bold"
                      >
                        Set as Default
                      </button>
                      <button
                        onClick={() => {
                          setAddresses((prev) => prev.filter((a) => a.id !== addr.id));
                          toast.info(`Deleted address: ${addr.label}`);
                        }}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add address modal */}
              {showAddAddressModal && (
                <div className="rounded-3xl border border-spice/20 bg-cream p-6 shadow-lg space-y-4 max-w-lg">
                  <h3 className="font-display text-lg font-bold text-ink">
                    Add New Delivery Address
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold block mb-1">Address Label</label>
                      <select
                        value={newAddrLabel}
                        onChange={(e) => setNewAddrLabel(e.target.value)}
                        className="w-full rounded-xl border border-ink/15 bg-white p-2.5 font-medium"
                      >
                        <option>Home</option>
                        <option>Office</option>
                        <option>Partner's Place</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold block mb-1">Complete Address *</label>
                      <textarea
                        rows={2}
                        value={newAddrStreet}
                        onChange={(e) => setNewAddrStreet(e.target.value)}
                        placeholder="House / Flat #, Building, Street, Indiranagar, Bengaluru"
                        className="w-full rounded-xl border border-ink/15 bg-white p-2.5 font-medium resize-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">
                        Drop-off Instructions (Optional)
                      </label>
                      <input
                        type="text"
                        value={newAddrInstructions}
                        onChange={(e) => setNewAddrInstructions(e.target.value)}
                        placeholder="Leave at security gate / ring bell twice"
                        className="w-full rounded-xl border border-ink/15 bg-white p-2.5 font-medium"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={handleAddAddress}
                        className="rounded-xl bg-spice text-cream hover:bg-ink font-bold text-xs px-5"
                      >
                        Save Address
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setShowAddAddressModal(false)}
                        className="rounded-xl text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB: 11. PAYMENTS ===================== */}
          {activeTab === "payments" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-ink/10 pb-4">
                <h2 className="font-display text-2xl font-black text-ink">
                  Payment Methods & Billing
                </h2>
                <p className="text-xs text-ink/60">Saved UPI IDs, cards, and payment history.</p>
              </div>

              <div className="rounded-3xl border border-ink/10 bg-frost/90 p-6 space-y-4">
                <h3 className="font-display text-base font-bold text-ink">Saved Payment Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-cream border border-ink/10">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-spice bg-spice/10 px-2 py-1 rounded-md">
                        UPI
                      </span>
                      <span className="text-xs font-bold text-ink">mahendra@okhdfcbank</span>
                    </div>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                      VERIFIED
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-cream border border-ink/10">
                    <div className="flex items-center gap-3">
                      <CreditCard className="size-4 text-ink/60" />
                      <span className="text-xs font-bold text-ink">HDFC Visa Card •••• 4892</span>
                    </div>
                    <span className="text-[11px] text-ink/50 font-mono">Exp 08/28</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB: 12. REVIEWS & RATINGS ===================== */}
          {activeTab === "reviews" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-ink/10 pb-4">
                <h2 className="font-display text-2xl font-black text-ink">My Reviews & Ratings</h2>
                <p className="text-xs text-ink/60">
                  Feedback provided on your delivered thalis & riders.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-ink/10 bg-frost/90 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base font-bold text-ink">
                      Dal Tadka Deluxe Thali
                    </span>
                    <div className="flex gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="size-3.5 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-ink/75">
                    "Rotis were exceptionally soft and warm. The desi ghee aroma reminded me of home
                    in Punjab."
                  </p>
                  <span className="text-[10px] font-mono text-ink/40 block">
                    Reviewed 3 days ago
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB: 13. NOTIFICATIONS ===================== */}
          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-black text-ink">Notifications</h2>
                  <p className="text-xs text-ink/60">
                    Order status, kitchen alerts & subscription reminders.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllNotificationsAsRead}
                  className="rounded-xl text-xs font-bold"
                >
                  Mark all as read
                </Button>
              </div>

              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      n.read
                        ? "border-ink/5 bg-frost/50 text-ink/60"
                        : "border-spice/20 bg-frost text-ink shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-display text-sm font-bold text-ink">{n.title}</span>
                      <span className="font-mono text-[10px] text-ink/40">{n.time}</span>
                    </div>
                    <p className="text-xs mt-1 leading-relaxed">{n.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB: 14. CUSTOMER SUPPORT ===================== */}
          {activeTab === "support" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-ink/10 pb-4">
                <h2 className="font-display text-2xl font-black text-ink">
                  Customer Support & Help
                </h2>
                <p className="text-xs text-ink/60">
                  Direct kitchen manager hotline, tickets & WhatsApp assistance.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Submit Ticket Form */}
                <div className="rounded-3xl border border-ink/10 bg-frost/95 p-6 space-y-4">
                  <h3 className="font-display text-lg font-bold text-ink">Raise an Order Ticket</h3>
                  <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold block mb-1">Issue Category</label>
                      <select
                        value={ticketIssue}
                        onChange={(e) => setTicketIssue(e.target.value as TicketIssueType)}
                        className="w-full rounded-xl border border-ink/15 bg-white p-2.5 font-medium"
                      >
                        <option value="missing_item">Missing Item / Roti</option>
                        <option value="wrong_order">Wrong Dish Delivered</option>
                        <option value="late_delivery">Delayed Delivery</option>
                        <option value="spill">Packaging Leak / Spill</option>
                        <option value="taste">Taste / Spice Feedback</option>
                        <option value="refund_request">Refund Request</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold block mb-1">Description *</label>
                      <textarea
                        rows={3}
                        required
                        value={ticketMessage}
                        onChange={(e) => setTicketMessage(e.target.value)}
                        placeholder="Please describe what went wrong..."
                        className="w-full rounded-xl border border-ink/15 bg-white p-2.5 font-medium resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={ticketSubmitting}
                      className="w-full rounded-xl bg-spice text-cream hover:bg-ink font-bold h-10 text-xs shadow-sm"
                    >
                      Submit Ticket
                    </Button>
                  </form>
                </div>

                {/* Direct Hotlines */}
                <div className="rounded-3xl border border-ink/10 bg-frost/95 p-6 space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">Instant Escalations</h3>
                    <p className="text-xs text-ink/60 mt-1">
                      Our kitchen duty manager resolves live order concerns within 5 minutes.
                    </p>

                    <div className="mt-5 space-y-3 text-xs">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-cream border border-ink/10">
                        <span className="font-bold text-ink">WhatsApp Order Support</span>
                        <a
                          href="https://wa.me/919876543210"
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-spice font-bold hover:underline"
                        >
                          Chat on WhatsApp →
                        </a>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-cream border border-ink/10">
                        <span className="font-bold text-ink">Duty Manager Phone</span>
                        <a
                          href="tel:+919876543210"
                          className="font-mono text-spice font-bold hover:underline"
                        >
                          +91 98765 43210
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Active tickets */}
                  {supportTickets.length > 0 && (
                    <div className="pt-4 border-t border-ink/5">
                      <span className="font-mono text-[10px] text-ink/50 uppercase font-bold block mb-2">
                        Active Tickets ({supportTickets.length})
                      </span>
                      {supportTickets.slice(0, 2).map((st) => (
                        <div key={st.id} className="text-xs flex justify-between py-1 text-ink/70">
                          <span>
                            #{st.ticketNumber} ({st.issueType})
                          </span>
                          <span className="font-bold text-amber-600 capitalize">{st.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB: 16. MEMBERSHIP ===================== */}
          {activeTab === "membership" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-ink/10 pb-4">
                <h2 className="font-display text-2xl font-black text-ink">
                  Anima's Kitchen VIP Pass
                </h2>
                <p className="text-xs text-ink/60">
                  Free unlimited deliveries, member-only thali discounts & priority dispatch.
                </p>
              </div>

              <div className="rounded-3xl border border-amber-300 bg-gradient-to-br from-amber-50 via-white to-amber-100/50 p-6 sm:p-8 space-y-6 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-800 uppercase tracking-widest">
                      GOLD PASS MEMBERSHIP
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-black text-amber-950 mt-1">
                      {hasKitchenPass ? "Active Gold Member" : "Join Anima's Kitchen Pass"}
                    </h3>
                    <p className="text-xs text-amber-900/70 mt-1">
                      {hasKitchenPass
                        ? "Valid until December 31, 2026 · Unlimited Free Deliveries"
                        : "Only ₹199 for 3 months of free delivery & VIP rewards."}
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      setHasKitchenPass(!hasKitchenPass);
                      toast.success(
                        hasKitchenPass ? "Membership toggled" : "Welcome to VIP Gold Pass!",
                      );
                    }}
                    className="rounded-full bg-amber-900 text-cream hover:bg-ink text-xs font-bold px-6 h-11"
                  >
                    {hasKitchenPass ? "Renew Membership" : "Get Pass for ₹199"}
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 pt-4 border-t border-amber-200 text-xs">
                  <div className="flex items-center gap-2 text-amber-950 font-medium">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>Free delivery on orders above ₹149</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-950 font-medium">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>Priority KDS cooking queue</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-950 font-medium">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>Free Gulab Jamun on Sunday thalis</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB: 17. PROFILE ===================== */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in duration-300 max-w-xl">
              <div className="border-b border-ink/10 pb-4">
                <h2 className="font-display text-2xl font-black text-ink">My Profile</h2>
                <p className="text-xs text-ink/60">
                  Your personal details, contact number and email address.
                </p>
              </div>

              <div className="rounded-3xl border border-ink/10 bg-frost/95 p-6 space-y-4 text-xs">
                <div>
                  <label className="font-bold block mb-1 text-ink">Full Name</label>
                  <input
                    type="text"
                    defaultValue={currentUser?.name || customerProfile.name}
                    className="w-full rounded-xl border border-ink/15 bg-white p-3 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-ink">Mobile Number</label>
                  <input
                    type="text"
                    defaultValue={currentUser?.phone || customerProfile.phone}
                    className="w-full rounded-xl border border-ink/15 bg-white p-3 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-ink">Email Address</label>
                  <input
                    type="email"
                    defaultValue={currentUser?.email || customerProfile.email}
                    className="w-full rounded-xl border border-ink/15 bg-white p-3 font-medium"
                  />
                </div>

                <Button
                  onClick={() => toast.success("Profile details saved successfully!")}
                  className="w-full rounded-xl bg-spice text-cream hover:bg-ink font-bold h-10 text-xs"
                >
                  Save Profile Changes
                </Button>
              </div>
            </div>
          )}

          {/* ===================== TAB: 18. SETTINGS ===================== */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-in fade-in duration-300 max-w-xl">
              <div className="border-b border-ink/10 pb-4">
                <h2 className="font-display text-2xl font-black text-ink">Account Settings</h2>
                <p className="text-xs text-ink/60">
                  App preferences, notification controls & account privacy.
                </p>
              </div>

              <div className="rounded-3xl border border-ink/10 bg-frost/95 p-6 space-y-4 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-ink/5">
                  <div>
                    <span className="font-bold text-ink block">WhatsApp Order Updates</span>
                    <span className="text-ink/50 text-[11px]">
                      Receive live cooking & rider OTP updates on WhatsApp
                    </span>
                  </div>
                  <input type="checkbox" defaultChecked className="size-4 accent-spice" />
                </div>

                <div className="flex items-center justify-between py-2 border-b border-ink/5">
                  <div>
                    <span className="font-bold text-ink block">Promotional SMS & Offers</span>
                    <span className="text-ink/50 text-[11px]">
                      Weekend discount alerts & festival specials
                    </span>
                  </div>
                  <input type="checkbox" defaultChecked className="size-4 accent-spice" />
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={logout}
                    className="rounded-xl text-xs font-bold text-red-600 hover:bg-red-50"
                  >
                    Logout from this Device
                  </Button>
                  <Button
                    onClick={() => toast.success("Preferences updated!")}
                    className="rounded-xl bg-ink text-cream hover:bg-spice text-xs font-bold"
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Android Mobile Sticky Bottom Navigation Bar */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-frost/95 border-t border-ink/10 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around shadow-lg">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-medium transition-all ${
              activeTab === "home" ? "text-spice font-bold" : "text-ink/60"
            }`}
          >
            <Home className="size-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab("menu")}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-medium transition-all ${
              activeTab === "menu" ? "text-spice font-bold" : "text-ink/60"
            }`}
          >
            <UtensilsCrossed className="size-4" />
            <span>Order</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-medium relative transition-all ${
              activeTab === "orders" ? "text-spice font-bold" : "text-ink/60"
            }`}
          >
            <Package className="size-4" />
            <span>Orders</span>
            {orders.length > 0 && (
              <span className="absolute top-0 right-2 size-2 bg-spice rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("track")}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-medium transition-all ${
              activeTab === "track" ? "text-spice font-bold" : "text-ink/60"
            }`}
          >
            <Bike className="size-4" />
            <span>Track</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-medium transition-all ${
              mobileMenuOpen ? "text-spice font-bold" : "text-ink/60"
            }`}
          >
            <User className="size-4" />
            <span>Account</span>
          </button>
        </nav>
      </div>

      {/* Invoice Modal for Customer Bill Download */}
      <OrderInvoiceModal
        order={selectedOrderForInvoice}
        open={Boolean(selectedOrderForInvoice)}
        onOpenChange={(open) => {
          if (!open) setSelectedOrderForInvoice(null);
        }}
      />
    </div>
  );
};
