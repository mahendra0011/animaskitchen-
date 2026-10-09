import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  Package,
  Bike,
  Users,
  ChefHat,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Star,
  RefreshCw,
  ArrowUpRight,
  BarChart3,
  Sparkles,
  MapPin,
  Flame,
  ArrowRight,
  Boxes,
  LifeBuoy,
  CreditCard,
  ShoppingBag,
  Percent,
  Calendar,
  Send,
  Bot,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import type { OrderStatus } from "@/types/kitchen";

interface AdminOverviewTabProps {
  onNavigateTab: (tabId: string) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({ onNavigateTab }) => {
  const {
    orders,
    menuItems,
    inventoryItems,
    deliveryPartners,
    subscriptions,
    supportTickets,
    branches,
    activeBranchId,
    updateOrderStatus,
    assignDeliveryPartner,
  } = useDemoStore();

  const [timeRange, setTimeRange] = useState<"today" | "yesterday" | "7d" | "30d">("today");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiThinking, setAiThinking] = useState(false);

  // Exact metrics as requested by user for Today's Overview:
  // Revenue ₹48,650, Total Orders 186, New Customers 24, Active Delivery 12, Preparing 18, Completed 142, Cancelled 4
  const metrics = {
    revenue:
      timeRange === "today"
        ? "₹48,650"
        : timeRange === "yesterday"
          ? "₹42,180"
          : timeRange === "7d"
            ? "₹3,18,400"
            : "₹12,45,000",
    revenueGrowth: "+18.4% vs yesterday",
    totalOrders:
      timeRange === "today"
        ? 186
        : timeRange === "yesterday"
          ? 164
          : timeRange === "7d"
            ? 1140
            : 4650,
    ordersGrowth: "+12% vs last week",
    newCustomers:
      timeRange === "today" ? 24 : timeRange === "yesterday" ? 19 : timeRange === "7d" ? 148 : 580,
    activeDelivery: 12,
    preparing: 18,
    ready: 6,
    pending: 4,
    completed: 142,
    cancelled: 4,
    netProfit: "₹21,430",
    profitMargin: "44.1%",
    aov: "₹261.50",
    activeRiders:
      deliveryPartners.filter((p) => p.status === "busy" || p.status === "available").length || 8,
    lowStockCount: inventoryItems.filter((i) => i.currentStock <= i.minStockLevel).length || 3,
    delayedOrders: 1,
    expiringSubscriptions: 5,
    openTickets: supportTickets.filter((t) => t.status === "open").length || 2,
  };

  // Top foods data
  const topFoods = [
    {
      name: "Dal Tadka Thali (House Special)",
      orders: 74,
      revenue: "₹13,986",
      tag: "Bestseller",
      veg: true,
      growth: "+24%",
    },
    {
      name: "Paneer Butter Masala Thali",
      orders: 42,
      revenue: "₹9,198",
      tag: "Top Margin",
      veg: true,
      growth: "+18%",
    },
    {
      name: "Rajma Chawal Comfort Bowl",
      orders: 38,
      revenue: "₹6,042",
      tag: "Trending",
      veg: true,
      growth: "+15%",
    },
    {
      name: "Hand-Rolled Tawa Phulka (Pack of 3)",
      orders: 96,
      revenue: "₹4,320",
      tag: "Highest Add-on",
      veg: true,
      growth: "+31%",
    },
  ];

  // Live order actions
  const handleQuickStatus = (orderId: string, nextStatus: OrderStatus) => {
    updateOrderStatus(orderId, nextStatus);
    toast.success(`Order #${orderId} moved to ${nextStatus.toUpperCase()}`);
  };

  const handleAskAI = (preset?: string) => {
    const q = preset || aiQuestion;
    if (!q.trim()) return;
    setAiThinking(true);
    setAiAnswer(null);

    setTimeout(() => {
      setAiThinking(false);
      if (q.toLowerCase().includes("revenue")) {
        setAiAnswer(
          "📊 Today's net revenue stands at ₹48,650 across 186 fulfilled orders with an Average Order Value (AOV) of ₹261.50. You are pacing 18.4% above yesterday's benchmark, with Dal Tadka Thali accounting for 28.7% of gross sales.",
        );
      } else if (q.toLowerCase().includes("least") || q.toLowerCase().includes("food")) {
        setAiAnswer(
          "🥘 Menu Performance Audit: 'Boondi Raita Add-on' and 'Matar Paneer Box' have seen lowest conversion (under 6 orders). Recommendation: Bundle Boondi Raita free with the ₹219 Weekend Deluxe Thali to lift margin.",
        );
      } else if (q.toLowerCase().includes("tiffin") || q.toLowerCase().includes("demand")) {
        setAiAnswer(
          "🗓️ Tiffin Forecast: 48 active subscriptions scheduled for tomorrow lunch in Indiranagar zone. Requires estimated 14.5 kg Sharbati Atta, 7.2 kg Yellow Moong Dal, and 6 riders for 12:45 PM batch dispatch.",
        );
      } else if (q.toLowerCase().includes("cancel")) {
        setAiAnswer(
          "⚠️ Cancellation Analysis: 4 cancellations recorded today. 3 occurred due to customer duplicate order placement, 1 due to address outside 7km radius before auto-geofence check.",
        );
      } else {
        setAiAnswer(
          `✨ Anima AI Insights: Kitchen operational efficiency is at 94.2%. Average prep time is 14.2 min (target < 16 min). Dispatch queue has 18 orders in prep with 8 delivery partners actively deployed.`,
        );
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Real-time Kitchen Health & Quick Range */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-ink to-ink/90 text-cream p-4 sm:p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">
              LIVE OPERATIONS STREAM
            </span>
            <span className="text-cream/40">·</span>
            <span className="text-xs text-cream/70 font-mono">
              Bengaluru Central Hub · Auto-refresh 5s
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold mt-1 text-cream">
            Today’s Business Overview
          </h2>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1.5 bg-cream/10 p-1 rounded-xl border border-cream/15 self-start sm:self-auto">
          {(
            [
              { id: "today", label: "Today" },
              { id: "yesterday", label: "Yesterday" },
              { id: "7d", label: "Last 7 Days" },
              { id: "30d", label: "Last 30 Days" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setTimeRange(item.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                timeRange === item.id
                  ? "bg-saffron text-ink shadow-sm"
                  : "text-cream/70 hover:text-cream hover:bg-cream/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 8 Priority Key Metric Cards as specifically requested by user */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Revenue */}
        <div className="bg-frost/90 border border-ink/10 rounded-2xl p-4 shadow-sm hover:border-spice/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/60 font-medium">
              Revenue
            </span>
            <span className="grid size-8 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <DollarSign className="size-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-ink">
              {metrics.revenue}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 font-medium flex items-center gap-0.5">
            <ArrowUpRight className="size-3" />
            {metrics.revenueGrowth}
          </p>
        </div>

        {/* 2. Total Orders */}
        <div className="bg-frost/90 border border-ink/10 rounded-2xl p-4 shadow-sm hover:border-spice/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/60 font-medium">
              Total Orders
            </span>
            <span className="grid size-8 place-items-center rounded-xl bg-blue-500/10 text-blue-600">
              <Package className="size-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-ink">
              {metrics.totalOrders}
            </span>
            <span className="text-xs text-ink/60 font-mono">orders</span>
          </div>
          <p className="mt-1 text-[11px] text-blue-600 font-medium flex items-center gap-0.5">
            <CheckCircle2 className="size-3" />
            142 fulfilled · 4 cancelled
          </p>
        </div>

        {/* 3. Net Profit */}
        <div className="bg-frost/90 border border-ink/10 rounded-2xl p-4 shadow-sm hover:border-spice/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/60 font-medium">
              Net Profit
            </span>
            <span className="grid size-8 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
              <Percent className="size-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-ink">
              {metrics.netProfit}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-amber-700 font-mono font-medium">
            Margin: {metrics.profitMargin} · Food cost 32%
          </p>
        </div>

        {/* 4. New Customers */}
        <div className="bg-frost/90 border border-ink/10 rounded-2xl p-4 shadow-sm hover:border-spice/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/60 font-medium">
              New Customers
            </span>
            <span className="grid size-8 place-items-center rounded-xl bg-purple-500/10 text-purple-600">
              <Users className="size-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-ink">
              {metrics.newCustomers}
            </span>
            <span className="text-xs text-ink/60 font-mono">new</span>
          </div>
          <p className="mt-1 text-[11px] text-purple-600 font-medium flex items-center gap-0.5">
            <Sparkles className="size-3" />
            First-order coupon applied
          </p>
        </div>

        {/* 5. Preparing Orders */}
        <div className="bg-frost/90 border border-ink/10 rounded-2xl p-4 shadow-sm hover:border-spice/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/60 font-medium">
              👨‍🍳 Preparing
            </span>
            <Badge className="bg-amber-500/15 text-amber-700 font-mono text-[10px] border-none">
              KITCHEN LIVE
            </Badge>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-amber-600">
              {metrics.preparing}
            </span>
            <span className="text-xs text-ink/60 font-mono">in stove</span>
          </div>
          <button
            onClick={() => onNavigateTab("kds")}
            className="mt-1 text-[11px] text-amber-700 font-bold hover:underline flex items-center gap-1"
          >
            Open KDS Screen →
          </button>
        </div>

        {/* 6. Active Delivery */}
        <div className="bg-frost/90 border border-ink/10 rounded-2xl p-4 shadow-sm hover:border-spice/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/60 font-medium">
              🚚 Active Delivery
            </span>
            <span className="grid size-8 place-items-center rounded-xl bg-teal-500/10 text-teal-600">
              <Bike className="size-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-teal-600">
              {metrics.activeDelivery}
            </span>
            <span className="text-xs text-ink/60 font-mono">on wheels</span>
          </div>
          <button
            onClick={() => onNavigateTab("fleet")}
            className="mt-1 text-[11px] text-teal-700 font-bold hover:underline flex items-center gap-1"
          >
            Track 8 Riders Live →
          </button>
        </div>

        {/* 7. Ready for Pickup */}
        <div className="bg-frost/90 border border-ink/10 rounded-2xl p-4 shadow-sm hover:border-spice/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/60 font-medium">
              Ready / Packaged
            </span>
            <span className="grid size-8 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="size-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-emerald-600">
              {metrics.ready}
            </span>
            <span className="text-xs text-ink/60 font-mono">packaged</span>
          </div>
          <p className="mt-1 text-[11px] text-ink/60 font-mono">Awaiting rider pickup</p>
        </div>

        {/* 8. Pending & Delayed Alerts */}
        <div className="bg-frost/90 border border-ink/10 rounded-2xl p-4 shadow-sm hover:border-spice/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/60 font-medium">
              Pending / Alerts
            </span>
            <span className="grid size-8 place-items-center rounded-xl bg-red-500/10 text-red-600">
              <AlertTriangle className="size-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-red-600">
              {metrics.pending}
            </span>
            <span className="text-xs text-ink/60 font-mono">pending</span>
          </div>
          <p className="mt-1 text-[11px] text-red-600 font-medium">
            {metrics.delayedOrders} delayed · {metrics.lowStockCount} low stock
          </p>
        </div>
      </div>

      {/* Saath mein: Critical Operational Health Badges */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-frost/60 border border-ink/10 rounded-2xl">
        <span className="font-mono text-[10px] uppercase font-bold text-ink/50 tracking-wider px-2">
          Critical Radar:
        </span>
        <Badge
          onClick={() => onNavigateTab("orders")}
          className="cursor-pointer bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 border-none font-mono text-xs px-2.5 py-1 gap-1.5"
        >
          <Clock className="size-3" />
          <span>Pending Orders: {metrics.pending}</span>
        </Badge>
        <Badge
          onClick={() => onNavigateTab("kds")}
          className="cursor-pointer bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border-none font-mono text-xs px-2.5 py-1 gap-1.5"
        >
          <Flame className="size-3" />
          <span>Preparing: {metrics.preparing}</span>
        </Badge>
        <Badge
          onClick={() => onNavigateTab("fleet")}
          className="cursor-pointer bg-teal-500/10 text-teal-700 hover:bg-teal-500/20 border-none font-mono text-xs px-2.5 py-1 gap-1.5"
        >
          <Bike className="size-3" />
          <span>Out for Delivery: {metrics.activeDelivery}</span>
        </Badge>
        <Badge
          onClick={() => onNavigateTab("inventory")}
          className="cursor-pointer bg-red-500/10 text-red-700 hover:bg-red-500/20 border-none font-mono text-xs px-2.5 py-1 gap-1.5"
        >
          <Boxes className="size-3" />
          <span>Low Stock Alerts: {metrics.lowStockCount} items</span>
        </Badge>
        <Badge
          onClick={() => onNavigateTab("support")}
          className="cursor-pointer bg-purple-500/10 text-purple-700 hover:bg-purple-500/20 border-none font-mono text-xs px-2.5 py-1 gap-1.5"
        >
          <LifeBuoy className="size-3" />
          <span>Support Grievances: {metrics.openTickets} Open</span>
        </Badge>
        <Badge className="bg-emerald-500/10 text-emerald-700 border-none font-mono text-xs px-2.5 py-1 gap-1.5">
          <Star className="size-3 fill-emerald-600 text-emerald-600" />
          <span>Today's Rating: 4.9★ (14 Reviews)</span>
        </Badge>
        <Badge className="bg-emerald-500/10 text-emerald-700 border-none font-mono text-xs px-2.5 py-1 gap-1.5">
          <CheckCircle2 className="size-3 text-emerald-600" />
          <span>Failed Payments: 0</span>
        </Badge>
      </div>

      {/* Main Grid: Sales Chart + Live Orders Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sales Performance & Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sales & Hourly Order Flow Chart Widget */}
          <div className="bg-frost/90 border border-ink/10 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-4 text-spice" />
                  <h3 className="font-display text-lg font-bold text-ink">
                    Hourly Order Flow & Revenue
                  </h3>
                </div>
                <p className="text-xs text-ink/60 font-body">
                  Peak lunch hours (12:00 PM – 2:30 PM) generated 64% of total daily volume.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-ink/70">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-spice" />
                  Orders
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-saffron" />
                  Revenue (₹)
                </span>
              </div>
            </div>

            {/* Simulated Visual Bar Chart */}
            <div className="mt-4 sm:mt-6 pt-2 sm:pt-4 overflow-x-auto scrollbar-none">
              <div className="grid grid-cols-8 gap-2 items-end h-44 border-b border-ink/10 pb-2 min-w-[340px]">
                {[
                  { time: "9 AM", orders: 8, height: "18%", rev: "₹1,840" },
                  { time: "11 AM", orders: 18, height: "35%", rev: "₹4,200" },
                  { time: "12 PM", orders: 46, height: "85%", rev: "₹12,400" },
                  { time: "1 PM", orders: 58, height: "100%", rev: "₹15,650" },
                  { time: "2 PM", orders: 26, height: "48%", rev: "₹6,800" },
                  { time: "4 PM", orders: 10, height: "20%", rev: "₹2,450" },
                  { time: "6 PM", orders: 12, height: "24%", rev: "₹3,100" },
                  { time: "8 PM", orders: 8, height: "16%", rev: "₹2,210" },
                ].map((col, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-1.5 h-full justify-end group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[9px] text-ink/70 bg-white px-1 rounded shadow-xs border border-ink/10">
                      {col.rev}
                    </span>
                    <div
                      style={{ height: col.height }}
                      className={`w-full max-w-[36px] rounded-t-lg transition-all group-hover:brightness-110 ${
                        idx === 3
                          ? "bg-spice shadow-md"
                          : idx === 2
                            ? "bg-spice/85"
                            : "bg-ink/20 hover:bg-saffron"
                      }`}
                    />
                    <span className="font-mono text-[10px] text-ink/60">{col.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Metrics Summary Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-2">
              <div className="p-2.5 rounded-xl bg-cream/70 border border-ink/5">
                <span className="font-mono text-[10px] uppercase text-ink/60 block">
                  Avg Order Value
                </span>
                <span className="font-display text-base font-bold text-ink">₹261.50</span>
              </div>
              <div className="p-2.5 rounded-xl bg-cream/70 border border-ink/5">
                <span className="font-mono text-[10px] uppercase text-ink/60 block">
                  Discounts Given
                </span>
                <span className="font-display text-base font-bold text-spice">₹3,420</span>
              </div>
              <div className="p-2.5 rounded-xl bg-cream/70 border border-ink/5">
                <span className="font-mono text-[10px] uppercase text-ink/60 block">
                  Delivery Collection
                </span>
                <span className="font-display text-base font-bold text-ink">₹4,280</span>
              </div>
              <div className="p-2.5 rounded-xl bg-cream/70 border border-ink/5">
                <span className="font-mono text-[10px] uppercase text-ink/60 block">
                  Total Refunds
                </span>
                <span className="font-display text-base font-bold text-emerald-600">₹0.00</span>
              </div>
            </div>
          </div>

          {/* Top Selling Foods & Category Breakdown */}
          <div className="bg-frost/90 border border-ink/10 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-ink">
                  Top Selling Dishes & Performance
                </h3>
                <p className="text-xs text-ink/60">
                  Item velocity, gross contribution, and customer repeat order index.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateTab("menu")}
                className="rounded-full border-ink/15 text-xs text-ink hover:border-spice"
              >
                Manage Menu Catalog →
              </Button>
            </div>

            <div className="mt-4 divide-y divide-ink/10">
              {topFoods.map((food, i) => (
                <div key={i} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-7 place-items-center rounded-lg bg-ink/5 font-mono text-xs font-bold text-ink">
                      #{i + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink">{food.name}</span>
                        <Badge className="bg-spice/10 text-spice font-mono text-[9px] border-none">
                          {food.tag}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-ink/60 font-mono">
                        {food.orders} orders today · Velocity {food.growth}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-sm font-bold text-ink block">
                      {food.revenue}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-600 font-semibold">
                      High Margin
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Orders Feed & AI Business Assistant */}
        <div className="space-y-6">
          {/* Live Orders Feed Widget */}
          <div className="bg-frost/90 border border-ink/10 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                <h3 className="font-display text-base font-bold text-ink">Live Order Queue</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("orders")}
                className="text-xs text-spice hover:underline p-0 h-auto font-semibold"
              >
                View All ({orders.length}) →
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              {orders.slice(0, 4).map((order) => {
                const statusColors: Record<string, string> = {
                  received: "bg-blue-500/10 text-blue-700",
                  confirmed: "bg-amber-500/10 text-amber-700",
                  preparing: "bg-orange-500/10 text-orange-700",
                  ready: "bg-emerald-500/10 text-emerald-700",
                  out_for_delivery: "bg-purple-500/10 text-purple-700",
                  delivered: "bg-ink/10 text-ink/70",
                };

                return (
                  <div
                    key={order.id}
                    className="p-3 bg-cream/70 border border-ink/10 rounded-xl space-y-2 hover:border-spice/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-ink">
                          #{order.id.replace("ord-", "AK")}
                        </span>
                        <Badge
                          className={`${statusColors[order.status] || "bg-ink/10"} font-mono text-[9px] border-none uppercase`}
                        >
                          {order.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <span className="font-display text-xs font-bold text-ink">
                        ₹{order.finalTotal}
                      </span>
                    </div>

                    <div className="text-[11px] text-ink/70 flex items-center justify-between">
                      <span>{order.customerName}</span>
                      <span className="font-mono text-ink/50">{order.items.length} item(s)</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-ink/5">
                      <span className="font-mono text-[10px] text-ink/50 flex items-center gap-1">
                        <Clock className="size-3" />
                        {order.estimatedDeliveryMinutes || 25} min ETA
                      </span>

                      {/* Quick Status Advance */}
                      {order.status === "placed" && (
                        <Button
                          size="sm"
                          onClick={() => handleQuickStatus(order.id, "confirmed")}
                          className="h-6 px-2 text-[10px] bg-ink hover:bg-spice text-cream rounded-md"
                        >
                          Accept
                        </Button>
                      )}
                      {order.status === "confirmed" && (
                        <Button
                          size="sm"
                          onClick={() => handleQuickStatus(order.id, "preparing")}
                          className="h-6 px-2 text-[10px] bg-spice text-cream rounded-md"
                        >
                          Start Prep
                        </Button>
                      )}
                      {order.status === "preparing" && (
                        <Button
                          size="sm"
                          onClick={() => handleQuickStatus(order.id, "ready")}
                          className="h-6 px-2 text-[10px] bg-emerald-600 text-cream rounded-md"
                        >
                          Mark Ready
                        </Button>
                      )}
                      {order.status === "ready" && (
                        <Button
                          size="sm"
                          onClick={() => handleQuickStatus(order.id, "out_for_delivery")}
                          className="h-6 px-2 text-[10px] bg-teal-600 text-cream rounded-md"
                        >
                          Dispatch
                        </Button>
                      )}
                      {order.status === "out_for_delivery" && (
                        <span className="font-mono text-[10px] text-teal-700 font-semibold">
                          Rider Assigned
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Business Assistant Widget */}
          <div className="bg-gradient-to-br from-ink via-ink to-spice/30 text-cream rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg bg-saffron text-ink">
                  <Bot className="size-4" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-bold text-cream">
                    Ask AI Kitchen Assistant
                  </h3>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-saffron block">
                    Real-time Kitchen Intelligence
                  </span>
                </div>
              </div>
              <Sparkles className="size-4 text-saffron animate-spin-slow" />
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-1.5">
              {[
                "Today's revenue kitna hai?",
                "Which food is selling least?",
                "Next week's tiffin demand?",
                "Why did cancellations happen?",
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskAI(p)}
                  className="px-2.5 py-1 rounded-full bg-cream/10 hover:bg-cream/20 text-cream/90 text-[10px] font-medium transition-all text-left"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Prompt Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                placeholder="Ask anything about kitchen..."
                className="flex-1 bg-cream/10 border border-cream/20 rounded-xl px-3 py-2 text-xs text-cream placeholder:text-cream/40 focus:outline-none focus:border-saffron"
              />
              <Button
                size="sm"
                onClick={() => handleAskAI()}
                disabled={aiThinking}
                className="bg-saffron text-ink hover:bg-cream font-bold h-8 px-3 rounded-xl"
              >
                {aiThinking ? (
                  <RefreshCw className="size-3.5 animate-spin" />
                ) : (
                  <Send className="size-3.5" />
                )}
              </Button>
            </div>

            {/* AI Response Output */}
            {aiAnswer && (
              <div className="p-3 rounded-xl bg-cream/15 border border-cream/20 text-xs text-cream/95 leading-relaxed font-body">
                {aiAnswer}
              </div>
            )}
          </div>

          {/* Low Stock Urgent Reorder Box */}
          <div className="bg-frost/90 border border-ink/10 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Boxes className="size-4 text-red-600" />
                <h4 className="font-display text-xs font-bold text-ink uppercase">
                  Low Stock Raw Materials ({metrics.lowStockCount})
                </h4>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("inventory")}
                className="text-xs text-red-600 hover:underline p-0 h-auto font-semibold"
              >
                Restock →
              </Button>
            </div>

            <div className="space-y-2">
              {[
                { name: "Sharbati Wheat Atta", stock: "4.5 kg", min: "15 kg", unit: "kg" },
                { name: "Pure Cow Desi Ghee", stock: "1.2 L", min: "5 L", unit: "L" },
                { name: "Fresh Malai Paneer", stock: "2.0 kg", min: "6 kg", unit: "kg" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-red-500/5 border border-red-500/20 text-xs"
                >
                  <span className="font-semibold text-ink">{item.name}</span>
                  <div className="text-right">
                    <span className="font-mono text-red-600 font-bold">{item.stock}</span>
                    <span className="font-mono text-[10px] text-ink/40 ml-1">(min {item.min})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
