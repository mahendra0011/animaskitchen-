import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Bike,
  Package,
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Star,
  DollarSign,
  Gift,
  Bell,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import type { Order } from "@/types/kitchen";

interface DeliveryPartnerHomeTabProps {
  onNavigateTab: (tabId: string) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
}

export const DeliveryPartnerHomeTab: React.FC<DeliveryPartnerHomeTabProps> = ({
  onNavigateTab,
  isOnline,
  setIsOnline,
}) => {
  const { activeRider, activeOrder, orders, advanceDeliveryStep } = useDemoStore();

  const [hasNewRequest, setHasNewRequest] = useState(true);

  // Rider metrics
  const summary = {
    deliveries: 12,
    completed: 10,
    pending: 2,
    todayEarnings: 620,
    weeklyEarnings: 4280,
    monthlyEarnings: 18450,
    rating: 4.8,
    onTimeRate: "96%",
    totalDistance: "64.2 km",
    bonusProgress: 12,
    bonusTarget: 15,
  };

  const handleAcceptRequest = () => {
    setHasNewRequest(false);
    toast.success("Delivery Request Accepted! Proceeding to Anima's Kitchen Hub.");
    onNavigateTab("active");
  };

  const handleRejectRequest = () => {
    setHasNewRequest(false);
    toast.info("Request passed to next available rider in zone.");
  };

  return (
    <div className="space-y-6">
      {/* Block 1: Rider Greeting & Online/Offline Duty Switch */}
      <div className="bg-gradient-to-r from-ink via-ink to-zinc-900 text-cream p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-cream/10">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`size-2.5 rounded-full ${
                isOnline ? "bg-emerald-400 animate-ping" : "bg-zinc-500"
              }`}
            />
            <span
              className={`font-mono text-xs uppercase font-bold tracking-wider ${
                isOnline ? "text-emerald-400" : "text-zinc-400"
              }`}
            >
              {isOnline ? "🟢 ONLINE · READY FOR DELIVERIES" : "⚪ OFFLINE · SHIFT PAUSED"}
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold mt-1 text-cream">
            Good Morning, {activeRider?.name?.split(" ")[0] || "Rahul"} 👋
          </h2>
          <p className="text-xs text-cream/70 font-mono mt-0.5">
            Shift: Lunch Slot (10:30 AM – 4:00 PM) · Zone: Indiranagar Central
          </p>
        </div>

        <div className="flex items-center gap-3 bg-cream/10 px-4 py-2.5 rounded-2xl border border-cream/15 self-start sm:self-auto">
          <span className="font-mono text-xs font-semibold text-cream">Duty Toggle:</span>
          <Switch
            checked={isOnline}
            onCheckedChange={(val) => {
              setIsOnline(val);
              toast(
                val
                  ? "You are now ONLINE. You will receive delivery requests."
                  : "You are now OFFLINE. Delivery requests paused.",
              );
            }}
          />
        </div>
      </div>

      {/* Block 2: Today's Summary & Earnings Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-frost/90 border border-ink/10 rounded-2xl p-4 shadow-sm hover:border-spice/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/60 font-semibold">
              Today's Earnings
            </span>
            <span className="grid size-8 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600">
              <DollarSign className="size-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-display text-2xl sm:text-3xl font-bold text-ink">
              ₹{summary.todayEarnings}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 font-mono font-medium">
            +₹80 Tips & Incentives
          </p>
        </div>

        <div className="bg-frost/90 border border-ink/10 rounded-2xl p-4 shadow-sm hover:border-spice/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/60 font-semibold">
              Total Deliveries
            </span>
            <span className="grid size-8 place-items-center rounded-xl bg-blue-500/15 text-blue-600">
              <Bike className="size-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-display text-2xl sm:text-3xl font-bold text-ink">
              {summary.deliveries}
            </span>
            <span className="text-xs text-ink/60 font-mono">orders</span>
          </div>
          <p className="mt-1 text-[11px] text-blue-600 font-mono font-medium">
            10 Completed · 2 Pending
          </p>
        </div>

        <div className="bg-frost/90 border border-ink/10 rounded-2xl p-4 shadow-sm hover:border-spice/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/60 font-semibold">
              Weekly Payout
            </span>
            <span className="grid size-8 place-items-center rounded-xl bg-amber-500/15 text-amber-600">
              <TrendingUp className="size-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-display text-2xl sm:text-3xl font-bold text-ink">
              ₹{summary.weeklyEarnings}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-amber-700 font-mono font-medium">
            Payout on Tuesday (NEFT)
          </p>
        </div>

        <div className="bg-frost/90 border border-ink/10 rounded-2xl p-4 shadow-sm hover:border-spice/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/60 font-semibold">
              Rider Rating
            </span>
            <span className="grid size-8 place-items-center rounded-xl bg-saffron/20 text-amber-600">
              <Star className="size-4 fill-amber-500" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-display text-2xl sm:text-3xl font-bold text-ink">
              {summary.rating}
            </span>
            <span className="text-xs text-ink/60 font-mono">/ 5.0</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 font-mono font-medium">
            96% On-Time Delivery
          </p>
        </div>
      </div>

      {/* Block 3 & 4: Current Active Order & New Delivery Request */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Block 3: Current Active Order Card */}
        <div className="bg-frost/90 border-2 border-spice/30 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-ink/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-spice animate-pulse" />
              <span className="font-mono text-xs uppercase font-bold text-spice tracking-wider">
                CURRENT ACTIVE ORDER
              </span>
            </div>
            <Badge className="bg-spice text-cream font-mono text-xs px-2.5 py-0.5">
              ETA: 18 min
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-bold text-ink">
                Order #{activeOrder?.id?.replace("ord-", "AK") || "AK1024"}
              </span>
              <span className="font-display text-base font-bold text-emerald-700">
                Earning: ₹65
              </span>
            </div>

            <div className="bg-cream/70 p-3 rounded-2xl border border-ink/10 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-ink/80">
                <span>
                  Customer:{" "}
                  <strong className="text-ink">
                    {activeOrder?.customerName || "Mahesh Sharma"}
                  </strong>
                </span>
                <span className="font-mono text-ink/60">+91 98765 11223</span>
              </div>
              <div className="flex items-center justify-between text-ink/80">
                <span>
                  Items: <strong className="text-ink">2 × Dal Tadka Veg Thali</strong>
                </span>
                <Badge className="bg-emerald-500/15 text-emerald-700 font-mono text-[9px] border-none">
                  PAID ONLINE
                </Badge>
              </div>
              <p className="text-[11px] text-ink/60 pt-1 border-t border-ink/5">
                Drop: Flat 302, Green Glen Layout, Bellandur / Indiranagar
              </p>
            </div>
          </div>

          {/* Quick Actions on Active Order */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Button
              onClick={() => onNavigateTab("active")}
              className="w-full bg-ink hover:bg-spice text-cream font-bold text-xs rounded-xl h-10 shadow-sm"
            >
              [VIEW ORDER WORKFLOW]
            </Button>
            <Button
              onClick={() => onNavigateTab("navigation")}
              variant="outline"
              className="w-full border-ink/20 text-ink hover:bg-frost font-bold text-xs rounded-xl h-10 gap-1.5"
            >
              <Navigation className="size-3.5 text-spice" />
              [START NAVIGATION]
            </Button>
          </div>
        </div>

        {/* Block 4: New Delivery Request (Notification Alert Box) */}
        {hasNewRequest ? (
          <div className="bg-gradient-to-br from-amber-500/10 via-cream to-amber-500/5 border-2 border-amber-500/40 rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="size-4 text-amber-600 animate-bounce" />
                <span className="font-mono text-xs uppercase font-bold text-amber-700 tracking-wider">
                  🔔 NEW DELIVERY REQUEST
                </span>
              </div>
              <span className="font-mono text-xs bg-amber-500/20 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                Auto-reject in 45s
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold text-ink">Order #AK1025</span>
                <span className="font-display text-base font-bold text-emerald-700">
                  Est. Earning: ₹65
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-white/70 p-3 rounded-2xl border border-amber-500/15">
                <div>
                  <span className="font-mono text-[9px] uppercase text-ink/50 block font-bold">
                    Pickup
                  </span>
                  <span className="font-semibold text-ink">Anima's Kitchen</span>
                  <span className="font-mono text-[10px] text-ink/50 block">0.8 km away</span>
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase text-ink/50 block font-bold">
                    Drop Location
                  </span>
                  <span className="font-semibold text-ink">Indiranagar 12th Main</span>
                  <span className="font-mono text-[10px] text-ink/50 block">3.4 km distance</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-ink/70 px-1">
                <span>Items: 1 × Deluxe Thali + 1 × Gulab Jamun</span>
                <span className="font-mono text-amber-700 font-semibold">ETA: 18 min</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Button
                onClick={handleAcceptRequest}
                className="bg-emerald-600 hover:bg-emerald-700 text-cream font-bold text-xs rounded-xl h-10 shadow-sm"
              >
                [ACCEPT ORDER]
              </Button>
              <Button
                onClick={handleRejectRequest}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs rounded-xl h-10"
              >
                [REJECT]
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-frost/60 border border-dashed border-ink/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-2">
            <span className="grid size-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="size-6" />
            </span>
            <h4 className="font-display text-base font-bold text-ink">No Pending Requests</h4>
            <p className="text-xs text-ink/60 max-w-xs">
              You are in high-priority dispatch zone. New orders will ping immediately with sound
              alert.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setHasNewRequest(true)}
              className="mt-2 text-xs text-spice rounded-xl"
            >
              Simulate New Order Ping
            </Button>
          </div>
        )}
      </div>

      {/* Block 5: Quick Actions Bar (Navigate, Call, Support, Emergency) */}
      <div className="bg-frost/90 border border-ink/10 rounded-2xl p-4 shadow-sm">
        <span className="font-mono text-[10px] uppercase font-bold text-ink/50 tracking-wider block mb-3">
          Rider Quick Actions
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <Button
            onClick={() => onNavigateTab("navigation")}
            variant="outline"
            className="border-ink/15 text-xs text-ink hover:border-spice hover:bg-cream rounded-xl h-9 gap-1.5"
          >
            <Navigation className="size-3.5 text-spice" />
            <span>Open Map</span>
          </Button>

          <Button
            onClick={() => {
              toast.info("Calling Customer: +91 98765 11223");
            }}
            variant="outline"
            className="border-ink/15 text-xs text-ink hover:border-emerald-600 hover:bg-cream rounded-xl h-9 gap-1.5"
          >
            <Phone className="size-3.5 text-emerald-600" />
            <span>Call Customer</span>
          </Button>

          <Button
            onClick={() => onNavigateTab("support")}
            variant="outline"
            className="border-ink/15 text-xs text-ink hover:border-blue-600 hover:bg-cream rounded-xl h-9 gap-1.5"
          >
            <ShieldCheck className="size-3.5 text-blue-600" />
            <span>Rider Support</span>
          </Button>

          <Button
            onClick={() => onNavigateTab("emergency")}
            className="bg-red-600 hover:bg-red-700 text-cream font-bold text-xs rounded-xl h-9 gap-1.5 shadow-sm"
          >
            <AlertTriangle className="size-3.5" />
            <span>🚨 SOS Emergency</span>
          </Button>
        </div>
      </div>

      {/* Lower Blocks: Challenge / Bonus Progress, Completed Deliveries Feed, Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's Challenge / Bonus Card */}
        <div className="bg-gradient-to-br from-spice to-spice/90 text-cream rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="size-4 text-saffron animate-pulse" />
              <span className="font-mono text-xs uppercase font-bold text-saffron tracking-wider">
                TODAY'S CHALLENGE
              </span>
            </div>
            <Badge className="bg-saffron text-ink font-mono text-[10px] font-bold">
              ₹150 BONUS
            </Badge>
          </div>

          <h4 className="font-display text-base font-bold text-cream">
            Complete 15 Deliveries Today
          </h4>
          <p className="text-xs text-cream/80">
            Just 3 more deliveries to unlock your daily ₹150 performance incentive!
          </p>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-xs font-mono">
              <span>Progress: 12 / 15 Deliveries</span>
              <span className="text-saffron font-bold">80% Done</span>
            </div>
            <div className="h-2.5 w-full bg-cream/20 rounded-full overflow-hidden">
              <div className="h-full bg-saffron rounded-full transition-all duration-500 w-[80%]" />
            </div>
          </div>
        </div>

        {/* Today's Completed Deliveries Feed */}
        <div className="bg-frost/90 border border-ink/10 rounded-3xl p-5 shadow-sm space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-ink/10 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <h4 className="font-display text-sm font-bold text-ink">
                Recent Completed Deliveries (10 Today)
              </h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateTab("history")}
              className="text-xs text-spice hover:underline p-0 h-auto font-semibold"
            >
              Full History →
            </Button>
          </div>

          <div className="divide-y divide-ink/10 text-xs">
            {[
              {
                id: "AK1020",
                customer: "Sneha Reddy",
                area: "Domlur 2nd Stage",
                earning: "₹65",
                time: "1:42 PM",
                duration: "14 min",
              },
              {
                id: "AK1018",
                customer: "Amit Verma",
                area: "Indiranagar 100ft Rd",
                earning: "₹55",
                time: "1:15 PM",
                duration: "11 min",
              },
              {
                id: "AK1015",
                customer: "Vikram Sen",
                area: "Koramangala 4th Block",
                earning: "₹75",
                time: "12:35 PM",
                duration: "21 min",
              },
            ].map((del, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-ink">#{del.id}</span>
                    <span className="text-ink/80">{del.customer}</span>
                    <span className="text-ink/40 font-mono text-[10px]">({del.area})</span>
                  </div>
                  <span className="font-mono text-[10px] text-ink/50">
                    Delivered in {del.duration} · {del.time}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-display text-sm font-bold text-emerald-700 block">
                    +{del.earning}
                  </span>
                  <span className="font-mono text-[9px] text-ink/40">Earned</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
