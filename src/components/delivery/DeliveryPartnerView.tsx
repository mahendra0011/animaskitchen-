import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { DeliveryPartnerHomeTab } from "./DeliveryPartnerHomeTab";
import { DeliveryActiveTaskTab } from "./DeliveryActiveTaskTab";
import {
  DeliveryNavigationTab,
  DeliveryHistoryTab,
  DeliveryEarningsTab,
  DeliveryPerformanceTab,
  DeliveryAvailabilityTab,
  DeliveryProfileDocsTab,
  DeliverySupportEmergencyTab,
} from "./DeliveryExtendedTabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Home,
  Package,
  Bell,
  Bike,
  Navigation,
  Clock,
  DollarSign,
  CreditCard,
  Flame,
  Award,
  Calendar,
  User,
  FileText,
  LifeBuoy,
  AlertTriangle,
  Settings,
  ExternalLink,
  LogOut,
  Star,
  CheckCircle2,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";

export type RiderTabType =
  | "dashboard"
  | "requests"
  | "active"
  | "navigation"
  | "history"
  | "earnings"
  | "payouts"
  | "incentives"
  | "performance"
  | "availability"
  | "notifications"
  | "profile"
  | "documents"
  | "support"
  | "emergency"
  | "settings";

export const DeliveryPartnerView: React.FC = () => {
  const { activeRider, activeOrder, setActiveRole, setCustomerPage, logout } = useDemoStore();

  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<RiderTabType>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    badgeColor?: string;
    count?: string;
  }

  // Exact Sidebar structure requested by the user:
  const navSections: Array<{ title: string; items: NavItem[] }> = [
    {
      title: "Deliveries",
      items: [
        { id: "dashboard", label: "Dashboard Home", icon: <Home className="size-4" /> },
        {
          id: "requests",
          label: "Delivery Requests",
          icon: <Bell className="size-4" />,
          badge: "1 NEW",
          badgeColor: "bg-amber-500 text-ink",
        },
        {
          id: "active",
          label: "Active Delivery",
          icon: <Bike className="size-4" />,
          badge: activeOrder ? "LIVE" : undefined,
          badgeColor: "bg-spice text-cream",
        },
        { id: "navigation", label: "GPS Navigation", icon: <Navigation className="size-4" /> },
        { id: "history", label: "Delivery History", icon: <Clock className="size-4" /> },
      ],
    },
    {
      title: "Earnings & Performance",
      items: [
        {
          id: "earnings",
          label: "Daily Earnings",
          icon: <DollarSign className="size-4" />,
          count: "₹620",
        },
        { id: "payouts", label: "Bank Payouts", icon: <CreditCard className="size-4" /> },
        {
          id: "incentives",
          label: "Daily Challenges",
          icon: <Flame className="size-4" />,
          count: "12/15",
        },
        { id: "performance", label: "Scorecard (4.8★)", icon: <Award className="size-4" /> },
      ],
    },
    {
      title: "Account & Safety",
      items: [
        {
          id: "availability",
          label: "Shift & Availability",
          icon: <Calendar className="size-4" />,
        },
        { id: "profile", label: "Rider Profile", icon: <User className="size-4" /> },
        {
          id: "documents",
          label: "Documents & KYC",
          icon: <FileText className="size-4" />,
          badge: "Expiring",
          badgeColor: "bg-amber-500/30 text-amber-300",
        },
        { id: "support", label: "Rider Support", icon: <LifeBuoy className="size-4" /> },
        {
          id: "emergency",
          label: "🚨 SOS Safety",
          icon: <AlertTriangle className="size-4" />,
          badge: "24x7",
          badgeColor: "bg-red-500 text-white font-bold",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row text-ink h-screen overflow-hidden">
      {/* Rider Permanent Sidebar (Desktop) - Independent Scroll */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-ink text-cream shrink-0 flex-col justify-between border-r border-cream/10 p-4 h-screen sticky top-0 overflow-hidden">
        {/* Top: Rider Brand & Profile Header */}
        <div className="pb-4 border-b border-cream/10 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-2xl bg-spice text-cream font-display text-base font-bold shadow-md">
                🛵
              </span>
              <div>
                <h2 className="font-display text-sm font-bold leading-tight text-cream">
                  ANIMA'S RIDER
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-wider text-saffron block">
                  Indiranagar Hub
                </span>
              </div>
            </div>
            <Badge
              className={`font-mono text-[9px] px-1.5 py-0.5 border-none ${isOnline ? "bg-emerald-600 text-cream" : "bg-zinc-600 text-zinc-300"}`}
            >
              {isOnline ? "ONLINE" : "OFFLINE"}
            </Badge>
          </div>

          {/* Quick Action: Go to Website */}
          <div className="mt-3">
            <button
              onClick={() => {
                setCustomerPage("home");
                setActiveRole("customer");
              }}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-cream/10 hover:bg-cream/20 text-cream text-xs font-semibold transition-all border border-cream/15 hover:border-cream/30"
            >
              <Home className="size-3.5 text-saffron" />
              <span>Go to Website (Homepage)</span>
            </button>
          </div>

          {/* Rider Quick Identity */}
          <div className="mt-3 p-2.5 rounded-xl bg-cream/5 border border-cream/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-cream/10 text-xs font-bold">
                {activeRider?.name?.charAt(0) || "R"}
              </span>
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-cream block truncate">
                  {activeRider?.name || "Rahul Verma"}
                </span>
                <span className="font-mono text-[9px] text-cream/50">
                  {activeRider?.vehicle?.plateNumber || "KA-03-HA-8821"}
                </span>
              </div>
            </div>
            <div className="flex items-center text-amber-400 text-xs font-mono font-bold">
              <Star className="size-3 fill-amber-400 mr-0.5" />
              4.8
            </div>
          </div>
        </div>

        {/* Middle Navigation with independent smooth scrolling */}
        <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-4 scrollbar-thin scrollbar-thumb-cream/20">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <span className="font-mono text-[9px] uppercase font-bold text-cream/40 px-3 tracking-wider block">
                {sec.title}
              </span>
              {sec.items.map((t) => {
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as RiderTabType)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-spice text-cream shadow-md font-bold scale-[1.01]"
                        : "text-cream/70 hover:bg-cream/10 hover:text-cream"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {t.icon}
                      <span className="truncate">{t.label}</span>
                    </div>
                    {t.count ? (
                      <span
                        className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] ${isActive ? "bg-cream text-ink font-bold" : "bg-cream/15 text-cream"}`}
                      >
                        {t.count}
                      </span>
                    ) : t.badge ? (
                      <span
                        className={`rounded-full px-1.5 py-0.2 font-mono text-[9px] font-bold ${t.badgeColor || "bg-cream/20 text-cream"}`}
                      >
                        {t.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer: Prominent Logout */}
        <div className="pt-3 border-t border-cream/10 space-y-1.5 shrink-0">
          <Button
            variant="destructive"
            size="sm"
            onClick={logout}
            className="w-full justify-center rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-md text-xs font-bold gap-2 h-9"
          >
            <LogOut className="size-3.5" />
            <span>Logout Rider Session</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden flex flex-col bg-ink text-cream border-b border-cream/10 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between p-3.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-xl bg-cream/10 text-cream"
              aria-label="Toggle mobile drawer"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
            <span className="font-display font-bold text-sm text-cream">ANIMA'S RIDER</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCustomerPage("home");
                setActiveRole("customer");
              }}
              className="text-xs bg-cream/10 text-cream hover:bg-cream/20 border-cream/20 px-2 h-7 rounded-lg"
              title="Go to Homepage"
            >
              <Home className="size-3 mr-1 text-saffron" />
              <span>Website</span>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={logout}
              className="text-xs bg-red-600/30 text-red-200 hover:bg-red-600 hover:text-white border border-red-500/40 px-2 h-7 rounded-lg"
            >
              <LogOut className="size-3 mr-1" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Horizontal Quick Swipeable Tabs for Android Phone */}
        <div className="px-3 pb-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-t border-cream/10 pt-2">
          {[
            { id: "dashboard", label: "Home", icon: <Home className="size-3.5" /> },
            { id: "requests", label: "Requests (1)", icon: <Bell className="size-3.5" /> },
            { id: "active", label: "Active Task", icon: <Bike className="size-3.5" /> },
            { id: "navigation", label: "GPS Map", icon: <Navigation className="size-3.5" /> },
            { id: "earnings", label: "Earnings (₹620)", icon: <DollarSign className="size-3.5" /> },
            { id: "history", label: "History", icon: <Clock className="size-3.5" /> },
            { id: "performance", label: "4.8★ Rating", icon: <Award className="size-3.5" /> },
            { id: "emergency", label: "🚨 SOS", icon: <AlertTriangle className="size-3.5" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as RiderTabType)}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
                activeTab === t.id
                  ? "bg-spice text-cream font-bold shadow-xs"
                  : "bg-cream/10 text-cream/80 hover:text-cream"
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[96px] bottom-0 z-40 bg-ink/95 backdrop-blur-xl p-5 overflow-y-auto space-y-4 text-cream">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-cream/40 block">
                {sec.title}
              </span>
              {sec.items.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id as RiderTabType);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    activeTab === t.id ? "bg-spice text-cream font-bold" : "text-cream/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {t.icon}
                    <span>{t.label}</span>
                  </div>
                  {t.count && <span className="font-mono text-xs">{t.count}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-3.5 sm:p-5 md:p-6 lg:p-7 space-y-5 sm:space-y-6 overflow-y-auto max-w-6xl pb-24 md:pb-6">
        {/* Render Tab Content */}
        {activeTab === "dashboard" && (
          <DeliveryPartnerHomeTab
            onNavigateTab={(tab) => setActiveTab(tab as RiderTabType)}
            isOnline={isOnline}
            setIsOnline={setIsOnline}
          />
        )}

        {(activeTab === "active" || activeTab === "requests") && (
          <DeliveryActiveTaskTab onBackToDashboard={() => setActiveTab("dashboard")} />
        )}

        {activeTab === "navigation" && <DeliveryNavigationTab />}

        {activeTab === "history" && <DeliveryHistoryTab />}

        {(activeTab === "earnings" || activeTab === "payouts" || activeTab === "incentives") && (
          <DeliveryEarningsTab />
        )}

        {activeTab === "performance" && <DeliveryPerformanceTab />}

        {activeTab === "availability" && <DeliveryAvailabilityTab />}

        {(activeTab === "profile" || activeTab === "documents") && <DeliveryProfileDocsTab />}

        {(activeTab === "support" || activeTab === "emergency") && <DeliverySupportEmergencyTab />}
      </main>

      {/* Android Mobile Sticky Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-frost/95 border-t border-ink/10 backdrop-blur-xl px-2 py-1.5 pb-safe flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-medium transition-all ${
            activeTab === "dashboard" ? "text-spice font-bold" : "text-ink/60"
          }`}
        >
          <Home className="size-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-medium relative transition-all ${
            activeTab === "requests" ? "text-spice font-bold" : "text-ink/60"
          }`}
        >
          <Bell className="size-4" />
          <span>Requests</span>
          <span className="absolute top-0 right-2 size-2 bg-amber-500 rounded-full" />
        </button>

        <button
          onClick={() => setActiveTab("active")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-medium relative transition-all ${
            activeTab === "active" ? "text-spice font-bold" : "text-ink/60"
          }`}
        >
          <Bike className="size-4" />
          <span>Active Task</span>
          {activeOrder && <span className="absolute top-0 right-2 size-2 bg-spice rounded-full" />}
        </button>

        <button
          onClick={() => setActiveTab("navigation")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-medium transition-all ${
            activeTab === "navigation" ? "text-spice font-bold" : "text-ink/60"
          }`}
        >
          <Navigation className="size-4" />
          <span>GPS Map</span>
        </button>

        <button
          onClick={() => setActiveTab("earnings")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-medium transition-all ${
            activeTab === "earnings" ? "text-spice font-bold" : "text-ink/60"
          }`}
        >
          <DollarSign className="size-4" />
          <span>Earnings</span>
        </button>
      </nav>
    </div>
  );
};
