import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { AdminOverviewTab } from "./AdminOverviewTab";
import { OrderManagerTab } from "./OrderManagerTab";
import { KitchenDisplayView } from "./KitchenDisplayView";
import { MenuManagerTab } from "./MenuManagerTab";
import { FleetManagerTab } from "./FleetManagerTab";
import { CouponsManagerTab } from "./CouponsManagerTab";
import { AnalyticsTab } from "./AnalyticsTab";
import { InventoryManagerTab } from "./InventoryManagerTab";
import { FoodCostProfitTab } from "./FoodCostProfitTab";
import { BillingInvoicesTab } from "./BillingInvoicesTab";
import { StaffManagerTab } from "./StaffManagerTab";
import { MultiBranchTab } from "./MultiBranchTab";
import { DeliveryZonesTab } from "./DeliveryZonesTab";
import { SupportTicketsTab } from "./SupportTicketsTab";
import { WhatsAppAutomationTab } from "./WhatsAppAutomationTab";
import { QrMenuGeneratorTab } from "./QrMenuGeneratorTab";
import {
  AdminCategoriesTab,
  AdminSuppliersTab,
  AdminCustomersTab,
  AdminSubscriptionsTab,
  AdminReviewsTab,
  AdminMarketingTab,
  AdminSettingsTab,
  AdminHomepageCustomizerTab,
} from "./AdminExtendedTabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  ShoppingBag,
  ChefHat,
  Utensils,
  Layers,
  Boxes,
  Percent,
  Truck,
  Bike,
  Users,
  Calendar,
  Receipt,
  Tag,
  Star,
  Megaphone,
  BarChart3,
  Bot,
  UserCheck,
  LifeBuoy,
  MessageSquare,
  QrCode,
  Building,
  Navigation,
  Settings,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Menu as MenuIcon,
  X,
  Palette,
} from "lucide-react";
import type { Branch } from "@/types/kitchen";

export type AdminTabType =
  | "overview"
  | "orders"
  | "kds"
  | "menu"
  | "categories"
  | "storefront"
  | "inventory"
  | "costing"
  | "suppliers"
  | "fleet"
  | "zones"
  | "customers"
  | "subscriptions"
  | "billing"
  | "coupons"
  | "reviews"
  | "marketing"
  | "analytics"
  | "staff"
  | "support"
  | "whatsapp"
  | "qrmenu"
  | "branches"
  | "settings";

interface AdminDashboardViewProps {
  initialTab?: AdminTabType;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  initialTab = "overview",
}) => {
  const {
    orders,
    menuItems,
    deliveryPartners,
    inventoryItems,
    supportTickets,
    branches,
    activeBranchId,
    setActiveRole,
    logout,
  } = useDemoStore();

  const [activeTab, setActiveTab] = useState<AdminTabType>(initialTab);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const pendingOrders = orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled");
  const lowStockCount = inventoryItems.filter((i) => i.currentStock <= i.minStockLevel).length;
  const openTicketCount = supportTickets.filter((t) => t.status === "open").length;
  const defaultBranch: Branch = {
    id: "branch-indiranagar",
    name: "Indiranagar Central Hub",
    code: "BLR-01",
    city: "Bengaluru",
    address: "12th Main Road, Indiranagar, Bengaluru",
    phone: "+91 98111 22334",
    status: "active",
    activeOrders: 14,
    dailyRevenue: 34200,
  };
  const currentBranch =
    branches.find((b) => b.id === activeBranchId) || branches[0] || defaultBranch;

  interface AdminNavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    count?: number;
    badge?: string;
  }

  // Grouped Navigation structure aligned directly with requested architecture
  const coreTabs = [
    {
      id: "overview",
      label: "Dashboard Home",
      icon: <LayoutDashboard className="size-4" />,
      badge: "LIVE",
    },
    {
      id: "orders",
      label: "Orders Dispatch",
      icon: <ShoppingBag className="size-4" />,
      count: pendingOrders.length,
    },
    { id: "kds", label: "Kitchen / KDS", icon: <ChefHat className="size-4" />, count: 18 },
    {
      id: "menu",
      label: "Menu Catalog",
      icon: <Utensils className="size-4" />,
      count: menuItems.length,
    },
    { id: "categories", label: "Combos & Categories", icon: <Layers className="size-4" /> },
    {
      id: "storefront",
      label: "Festival & Storefront CMS",
      icon: <Palette className="size-4" />,
      badge: "FESTIVAL",
    },
  ];

  const supplyOperationsTabs = [
    {
      id: "inventory",
      label: "Inventory & Stock",
      icon: <Boxes className="size-4" />,
      count: lowStockCount > 0 ? lowStockCount : undefined,
    },
    { id: "costing", label: "Recipes & Food Cost", icon: <Percent className="size-4" /> },
    { id: "suppliers", label: "Suppliers & Purchase", icon: <Truck className="size-4" /> },
    {
      id: "fleet",
      label: "Delivery Fleet (Map)",
      icon: <Bike className="size-4" />,
      count: deliveryPartners.length,
    },
    { id: "zones", label: "Delivery Radius", icon: <Navigation className="size-4" /> },
  ];

  const customerRetentionTabs = [
    { id: "customers", label: "Customer CRM", icon: <Users className="size-4" /> },
    { id: "billing", label: "Billing & GST Invoices", icon: <Receipt className="size-4" /> },
    { id: "coupons", label: "Coupons & Offers", icon: <Tag className="size-4" /> },
    { id: "reviews", label: "Reviews & Ratings", icon: <Star className="size-4" />, badge: "4.9★" },
    { id: "marketing", label: "Marketing / CRM", icon: <Megaphone className="size-4" /> },
  ];

  const intelligenceSettingsTabs = [
    { id: "analytics", label: "Analytics & Reports", icon: <BarChart3 className="size-4" /> },
    { id: "staff", label: "Staff & Roles", icon: <UserCheck className="size-4" /> },
    {
      id: "support",
      label: "Support & Grievances",
      icon: <LifeBuoy className="size-4" />,
      count: openTicketCount > 0 ? openTicketCount : undefined,
    },
    {
      id: "whatsapp",
      label: "WhatsApp Automation",
      icon: <MessageSquare className="size-4" />,
      badge: "BOT",
    },
    { id: "qrmenu", label: "QR Standee Orders", icon: <QrCode className="size-4" /> },
    {
      id: "branches",
      label: "Branches & Hubs",
      icon: <Building className="size-4" />,
      badge: currentBranch.code,
    },
    { id: "settings", label: "Kitchen Settings", icon: <Settings className="size-4" /> },
  ];

  const quickMobileTabs = [
    { id: "overview", label: "Home", icon: <LayoutDashboard className="size-3.5" /> },
    {
      id: "orders",
      label: `Orders (${pendingOrders.length})`,
      icon: <ShoppingBag className="size-3.5" />,
    },
    { id: "kds", label: "KDS (18)", icon: <ChefHat className="size-3.5" /> },
    { id: "inventory", label: "Stock", icon: <Boxes className="size-3.5" /> },
    { id: "menu", label: "Menu", icon: <Utensils className="size-3.5" /> },
    { id: "fleet", label: "Fleet", icon: <Bike className="size-3.5" /> },
    { id: "customers", label: "CRM", icon: <Users className="size-3.5" /> },
    { id: "billing", label: "GST Bills", icon: <Receipt className="size-3.5" /> },
  ];

  const renderNavGroup = (title: string, items: AdminNavItem[]) => (
    <div className="space-y-1 mb-4">
      <p className="font-mono text-[9px] uppercase font-bold text-cream/40 px-3 tracking-wider">
        {title}
      </p>
      {items.map((t) => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => {
              setActiveTab(t.id as AdminTabType);
              setMobileDrawerOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              isActive
                ? "bg-saffron text-ink shadow-md font-bold scale-[1.01]"
                : "text-cream/70 hover:bg-cream/10 hover:text-cream"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {t.icon}
              <span className="truncate">{t.label}</span>
            </div>
            {t.count !== undefined ? (
              <span
                className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
                  isActive ? "bg-ink text-cream font-bold" : "bg-cream/15 text-cream"
                }`}
              >
                {t.count}
              </span>
            ) : t.badge ? (
              <span
                className={`rounded-full px-1.5 py-0.2 font-mono text-[9px] font-bold ${
                  isActive ? "bg-ink text-saffron" : "bg-saffron/20 text-saffron"
                }`}
              >
                {t.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row text-ink pb-16 md:pb-0">
      {/* Left Modern Admin Sidebar (Desktop Only) */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-ink text-cream shrink-0 flex-col justify-between border-r border-cream/10 p-4 md:min-h-screen md:sticky md:top-0">
        <div className="overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-none pr-1">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-cream/10">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.jpeg"
                alt="Anima's Kitchen Logo"
                className="size-9 rounded-2xl object-cover shadow-md border border-cream/20"
              />
              <div>
                <h2 className="font-display text-sm font-bold leading-tight text-cream">
                  ANIMA’S OPS
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-wider text-saffron block truncate max-w-[120px]">
                  {currentBranch.name}
                </span>
              </div>
            </div>
            <Badge className="bg-emerald-600/90 text-cream font-mono text-[9px] px-1.5 py-0.5">
              ONLINE
            </Badge>
          </div>

          {/* Navigation Sections */}
          <div className="mt-4">
            {renderNavGroup("Main Control", coreTabs)}
            {renderNavGroup("Kitchen & Supply", supplyOperationsTabs)}
            {renderNavGroup("Customers & Finance", customerRetentionTabs)}
            {renderNavGroup("Reports & Configuration", intelligenceSettingsTabs)}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-3 border-t border-cream/10 space-y-2.5 mt-auto">
          <div className="flex items-center gap-2.5 px-1">
            <span className="grid size-7 place-items-center rounded-xl bg-cream/15 text-cream text-[11px] font-bold font-mono">
              AD
            </span>
            <div className="text-left overflow-hidden">
              <p className="font-display text-[11px] text-cream truncate">Chief Dispatcher</p>
              <p className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {currentBranch.code} Hub Live
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveRole("customer")}
              className="w-full justify-start rounded-xl border-cream/20 bg-cream/5 text-[11px] text-cream hover:bg-cream/15 gap-2 h-8"
            >
              <ExternalLink className="size-3" />
              <span>Customer Storefront</span>
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                logout();
                setActiveRole("customer");
              }}
              className="w-full justify-start rounded-xl bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white border border-red-500/30 text-[11px] gap-2 h-8"
            >
              <LogOut className="size-3" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Top App Bar (Android Friendly) */}
      <header className="md:hidden sticky top-0 z-40 bg-ink text-cream border-b border-cream/10 shadow-sm">
        <div className="flex items-center justify-between p-3.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="p-1.5 rounded-xl bg-cream/10 text-cream hover:bg-cream/20"
              aria-label="Toggle navigation drawer"
            >
              {mobileDrawerOpen ? <X className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
            <div className="flex items-center gap-2">
              <img
                src="/logo.jpeg"
                alt="Logo"
                className="size-7 rounded-xl object-cover shadow-sm border border-cream/20"
              />
              <span className="font-display font-bold text-sm text-cream">ANIMA'S OPS</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-600 text-cream font-mono text-[9px] px-1.5 py-0.5 border-none">
              {currentBranch.code} LIVE
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setActiveRole("customer")}
              className="text-xs text-cream/80 hover:text-cream px-2 h-7"
            >
              Store
            </Button>
          </div>
        </div>

        {/* Horizontal Swipeable Tab Pills on Mobile */}
        <div className="px-3 pb-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {quickMobileTabs.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as AdminTabType)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-all ${
                  isActive
                    ? "bg-saffron text-ink font-bold shadow-xs"
                    : "bg-cream/10 text-cream/80 hover:text-cream"
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Mobile Slide-in Drawer with all modules */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-x-0 top-[96px] bottom-0 z-50 bg-ink/95 backdrop-blur-xl p-4 overflow-y-auto space-y-4 text-cream">
          {renderNavGroup("Main Control", coreTabs)}
          {renderNavGroup("Kitchen & Supply", supplyOperationsTabs)}
          {renderNavGroup("Customers & Finance", customerRetentionTabs)}
          {renderNavGroup("Reports & Configuration", intelligenceSettingsTabs)}
        </div>
      )}

      {/* Main Operations Area */}
      <main className="flex-1 p-3.5 sm:p-5 md:p-7 space-y-5 sm:space-y-6 overflow-y-auto max-w-7xl">
        {/* Executive Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink/10 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="grid size-9 sm:size-11 place-items-center rounded-2xl bg-ink text-cream shadow-sm shrink-0">
              <ShieldCheck className="size-5 sm:size-6 text-saffron" />
            </span>
            <div>
              <h1 className="font-display text-xl sm:text-2xl md:text-3xl tracking-tight text-ink font-bold uppercase">
                {activeTab === "overview" && "Dashboard Overview"}
                {activeTab === "orders" && "Orders Dispatch Queue"}
                {activeTab === "kds" && "Kitchen Display System (KDS)"}
                {activeTab === "menu" && "Menu Catalog & Item Availability"}
                {activeTab === "categories" && "Categories & Meal Combos"}
                {activeTab === "inventory" && "Inventory & Raw Material Stock"}
                {activeTab === "costing" && "Food Costing & Net Margins"}
                {activeTab === "suppliers" && "Suppliers & Purchase Orders"}
                {activeTab === "fleet" && "Delivery Fleet & Rider Tracking"}
                {activeTab === "zones" && "Delivery Zones & Radius"}
                {activeTab === "customers" && "Customer CRM & Lifetime Value"}
                {activeTab === "subscriptions" && "Tiffin & Subscription Plans"}
                {activeTab === "billing" && "GST Billing & Tax Invoices"}
                {activeTab === "coupons" && "Offers & Discount Coupons"}
                {activeTab === "reviews" && "Customer Reviews & Ratings"}
                {activeTab === "marketing" && "Marketing & Retention Engine"}
                {activeTab === "analytics" && "Sales Analytics & Business Intelligence"}
                {activeTab === "staff" && "Staff Management & Shifts"}
                {activeTab === "support" && "Customer Grievances & CRM"}
                {activeTab === "whatsapp" && "WhatsApp Automation Simulator"}
                {activeTab === "qrmenu" && "QR Menu & Standee Generator"}
                {activeTab === "storefront" && "Festival & Storefront Customizer (CMS)"}
                {activeTab === "branches" && "Multi-Branch Cloud Kitchens"}
                {activeTab === "settings" && "Kitchen & Business Settings"}
              </h1>
              <p className="text-[11px] sm:text-xs text-ink/60">
                Anima's Kitchen Cloud Kitchen · {currentBranch.name} ({currentBranch.code})
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveRole("customer")}
              className="rounded-full border-ink/15 text-xs text-ink hover:border-spice gap-1.5"
            >
              <ExternalLink className="size-3.5" />
              <span>Customer View</span>
            </Button>
          </div>
        </div>

        {/* Dynamic Section Content */}
        <div className="min-w-0">
          {activeTab === "overview" && (
            <AdminOverviewTab onNavigateTab={(t) => setActiveTab(t as AdminTabType)} />
          )}
          {activeTab === "orders" && <OrderManagerTab />}
          {activeTab === "kds" && <KitchenDisplayView />}
          {activeTab === "menu" && <MenuManagerTab />}
          {activeTab === "categories" && <AdminCategoriesTab />}
          {activeTab === "storefront" && <AdminHomepageCustomizerTab />}
          {activeTab === "inventory" && <InventoryManagerTab />}
          {activeTab === "costing" && <FoodCostProfitTab />}
          {activeTab === "suppliers" && <AdminSuppliersTab />}
          {activeTab === "fleet" && <FleetManagerTab />}
          {activeTab === "zones" && <DeliveryZonesTab />}
          {activeTab === "customers" && <AdminCustomersTab />}
          {activeTab === "subscriptions" && <AdminSubscriptionsTab />}
          {activeTab === "billing" && <BillingInvoicesTab />}
          {activeTab === "coupons" && <CouponsManagerTab />}
          {activeTab === "reviews" && <AdminReviewsTab />}
          {activeTab === "marketing" && <AdminMarketingTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "staff" && <StaffManagerTab />}
          {activeTab === "support" && <SupportTicketsTab />}
          {activeTab === "whatsapp" && <WhatsAppAutomationTab />}
          {activeTab === "qrmenu" && <QrMenuGeneratorTab />}
          {activeTab === "branches" && <MultiBranchTab />}
          {activeTab === "settings" && <AdminSettingsTab />}
        </div>
      </main>

      {/* Android Mobile Sticky Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-frost/95 border-t border-ink/10 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-medium transition-all ${
            activeTab === "overview" ? "text-spice font-bold" : "text-ink/60"
          }`}
        >
          <LayoutDashboard className="size-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-medium relative transition-all ${
            activeTab === "orders" ? "text-spice font-bold" : "text-ink/60"
          }`}
        >
          <ShoppingBag className="size-4" />
          <span>Orders</span>
          {pendingOrders.length > 0 && (
            <span className="absolute top-0 right-2 size-2 bg-spice rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("kds")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-medium transition-all ${
            activeTab === "kds" ? "text-spice font-bold" : "text-ink/60"
          }`}
        >
          <ChefHat className="size-4" />
          <span>KDS (18)</span>
        </button>

        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-medium transition-all ${
            activeTab === "inventory" ? "text-spice font-bold" : "text-ink/60"
          }`}
        >
          <Boxes className="size-4" />
          <span>Stock</span>
        </button>

        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-medium transition-all ${
            mobileDrawerOpen ? "text-spice font-bold" : "text-ink/60"
          }`}
        >
          <MenuIcon className="size-4" />
          <span>More</span>
        </button>
      </nav>
    </div>
  );
};
