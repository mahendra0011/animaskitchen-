import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { LiveMapCanvas } from "../customer/LiveMapCanvas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Bike,
  Navigation,
  DollarSign,
  TrendingUp,
  Clock,
  Calendar,
  Star,
  ShieldCheck,
  AlertTriangle,
  Bell,
  Phone,
  MessageSquare,
  FileText,
  CreditCard,
  Flame,
  Award,
  ExternalLink,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

/* =========================================================================
   1. Live GPS Navigation Tab
   ========================================================================= */
export const DeliveryNavigationTab: React.FC = () => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-frost/90 border border-ink/10 p-5 rounded-2xl">
        <div>
          <span className="font-mono text-xs uppercase font-bold text-spice block">
            LIVE GPS SATELLITE ROUTE
          </span>
          <h3 className="font-display text-lg font-bold text-ink">
            Anima's Kitchen Hub → Customer Doorstep
          </h3>
          <p className="text-xs text-ink/60">
            Distance: 3.4 km · Estimated Travel Time: 14 min via 100ft Road
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              window.open("https://maps.google.com/?q=Indiranagar+Bangalore", "_blank");
            }}
            className="bg-ink hover:bg-spice text-cream text-xs rounded-xl h-9 gap-1.5"
          >
            <ExternalLink className="size-3.5" />
            <span>Open in Google Maps</span>
          </Button>
        </div>
      </div>

      <div className="h-[420px] rounded-3xl overflow-hidden border border-ink/10 relative shadow-sm">
        <LiveMapCanvas orderStatus="out_for_delivery" />
      </div>

      {/* Route & Traffic Intel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-frost/80 rounded-2xl border border-ink/10 text-xs">
          <span className="font-mono text-[10px] uppercase text-ink/50 block font-bold">
            Traffic
          </span>
          <span className="font-semibold text-emerald-700">Clear Route (No major delays)</span>
        </div>
        <div className="p-3 bg-frost/80 rounded-2xl border border-ink/10 text-xs">
          <span className="font-mono text-[10px] uppercase text-ink/50 block font-bold">
            Speed limit
          </span>
          <span className="font-semibold text-ink">40 km/h (City zone)</span>
        </div>
        <div className="p-3 bg-frost/80 rounded-2xl border border-ink/10 text-xs">
          <span className="font-mono text-[10px] uppercase text-ink/50 block font-bold">
            Next Turn
          </span>
          <span className="font-semibold text-spice">Right on 12th Main Road (400m)</span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   2. Delivery History Tab
   ========================================================================= */
export const DeliveryHistoryTab: React.FC = () => {
  const [filter, setFilter] = useState<"today" | "week" | "month">("today");

  const historyData = [
    {
      id: "AK1020",
      customer: "Sneha Reddy",
      area: "Domlur 2nd Stage",
      earning: 65,
      status: "Delivered",
      time: "1:42 PM",
      date: "Today",
      method: "UPI Paid",
    },
    {
      id: "AK1018",
      customer: "Amit Verma",
      area: "Indiranagar 100ft Rd",
      earning: 55,
      status: "Delivered",
      time: "1:15 PM",
      date: "Today",
      method: "COD (₹389)",
    },
    {
      id: "AK1015",
      customer: "Vikram Sen",
      area: "Koramangala 4th Block",
      earning: 75,
      status: "Delivered",
      time: "12:35 PM",
      date: "Today",
      method: "UPI Paid",
    },
    {
      id: "AK1012",
      customer: "Ananya Iyer",
      area: "Ulsoor Lake Road",
      earning: 60,
      status: "Delivered",
      time: "11:50 AM",
      date: "Today",
      method: "UPI Paid",
    },
    {
      id: "AK1008",
      customer: "Karan Johar",
      area: "Domlur Flyover",
      earning: 65,
      status: "Delivered",
      time: "11:10 AM",
      date: "Today",
      method: "COD (₹219)",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-frost/90 border border-ink/10 p-5 rounded-2xl">
        <div>
          <h3 className="font-display text-lg font-bold text-ink">Trip & Delivery History</h3>
          <p className="text-xs text-ink/60">
            Log of fulfilled orders, trip durations, and per-order payouts.
          </p>
        </div>
        <div className="flex gap-1.5 bg-cream/70 p-1 rounded-xl border border-ink/10">
          {(["today", "week", "month"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize ${
                filter === f ? "bg-ink text-cream" : "text-ink/60 hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-frost/90 border border-ink/10 rounded-2xl overflow-hidden shadow-sm divide-y divide-ink/10">
        {historyData.map((item) => (
          <div
            key={item.id}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-ink">#{item.id}</span>
                <span className="font-bold text-ink">{item.customer}</span>
                <Badge className="bg-emerald-500/15 text-emerald-700 font-mono text-[9px] border-none">
                  {item.status}
                </Badge>
              </div>
              <p className="text-ink/60">
                Area: {item.area} ·{" "}
                <span className="font-mono">
                  {item.time} ({item.date})
                </span>
              </p>
            </div>
            <div className="flex sm:flex-col items-end justify-between gap-1">
              <span className="font-display text-sm font-bold text-emerald-700">
                +₹{item.earning}
              </span>
              <span className="font-mono text-[10px] text-ink/50">{item.method}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   3. Rider Earnings & Payouts Tab
   ========================================================================= */
export const DeliveryEarningsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 3 Large Earnings Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-frost/90 border border-ink/10 rounded-2xl shadow-sm">
          <span className="font-mono text-[10px] uppercase text-ink/50 font-bold block">
            TODAY'S EARNINGS
          </span>
          <span className="font-display text-3xl font-bold text-ink mt-1 block">₹620</span>
          <span className="text-xs text-emerald-600 font-mono">10 trips completed</span>
        </div>

        <div className="p-5 bg-frost/90 border border-ink/10 rounded-2xl shadow-sm">
          <span className="font-mono text-[10px] uppercase text-ink/50 font-bold block">
            THIS WEEK
          </span>
          <span className="font-display text-3xl font-bold text-spice mt-1 block">₹4,280</span>
          <span className="text-xs text-ink/60 font-mono">58 trips · Payout Tuesday</span>
        </div>

        <div className="p-5 bg-frost/90 border border-ink/10 rounded-2xl shadow-sm">
          <span className="font-mono text-[10px] uppercase text-ink/50 font-bold block">
            THIS MONTH
          </span>
          <span className="font-display text-3xl font-bold text-emerald-700 mt-1 block">
            ₹18,450
          </span>
          <span className="text-xs text-emerald-600 font-mono">286 total deliveries</span>
        </div>
      </div>

      {/* Breakdown Card */}
      <div className="bg-frost/90 border border-ink/10 rounded-2xl p-5 shadow-sm space-y-3">
        <h4 className="font-display text-sm font-bold text-ink">Today's Earnings Breakdown</h4>
        <div className="divide-y divide-ink/10 text-xs">
          <div className="py-2.5 flex justify-between">
            <span className="text-ink/70">Per-Order Delivery Fee (10 orders × ₹48 avg)</span>
            <span className="font-mono font-bold text-ink">₹480.00</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-ink/70">Distance Travel Incentive (Over 5 km orders)</span>
            <span className="font-mono font-bold text-ink">₹80.00</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-ink/70">Customer In-App Tips</span>
            <span className="font-mono font-bold text-ink">₹60.00</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-ink/70">Daily 15-Deliveries Challenge Progress (12/15)</span>
            <span className="font-mono font-bold text-amber-700">+₹150 (Pending 3 trips)</span>
          </div>
          <div className="py-3 flex justify-between text-sm font-bold text-ink">
            <span>Total Credited to Wallet</span>
            <span className="font-display text-base text-emerald-700">₹620.00</span>
          </div>
        </div>
      </div>

      {/* COD Cash Ledger */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 shadow-sm space-y-2">
        <h4 className="font-display text-sm font-bold text-amber-950 flex items-center gap-1.5">
          <DollarSign className="size-4 text-amber-700" /> Cash on Delivery (COD) Ledger
        </h4>
        <p className="text-xs text-amber-900/80">
          Cash collected from customers to deposit at kitchen hub end of shift.
        </p>
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-xs text-ink/70">Cash in Hand Today:</span>
            <span className="font-display text-base font-bold text-amber-950 ml-2">₹608.00</span>
          </div>
          <Badge className="bg-amber-500/20 text-amber-900 font-mono text-xs border-none">
            Settle by 4:00 PM
          </Badge>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   4. Rider Performance Tab
   ========================================================================= */
export const DeliveryPerformanceTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-frost/90 border border-ink/10 p-5 rounded-2xl">
        <h3 className="font-display text-lg font-bold text-ink">Delivery Partner Scorecard</h3>
        <p className="text-xs text-ink/60">
          Maintained by customer ratings, on-time GPS arrival, and food condition checks.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-frost/90 border border-ink/10 rounded-2xl text-center">
          <span className="font-mono text-[10px] uppercase text-ink/50 block">Customer Rating</span>
          <span className="font-display text-2xl font-bold text-amber-600">⭐ 4.8</span>
          <span className="text-[10px] text-ink/50 font-mono block">Top 5% Partner</span>
        </div>
        <div className="p-4 bg-frost/90 border border-ink/10 rounded-2xl text-center">
          <span className="font-mono text-[10px] uppercase text-ink/50 block">On-Time Rate</span>
          <span className="font-display text-2xl font-bold text-emerald-600">96%</span>
          <span className="text-[10px] text-ink/50 font-mono block">&lt; 20 min avg</span>
        </div>
        <div className="p-4 bg-frost/90 border border-ink/10 rounded-2xl text-center">
          <span className="font-mono text-[10px] uppercase text-ink/50 block">Total Completed</span>
          <span className="font-display text-2xl font-bold text-ink">286</span>
          <span className="text-[10px] text-ink/50 font-mono block">Zero spills</span>
        </div>
        <div className="p-4 bg-frost/90 border border-ink/10 rounded-2xl text-center">
          <span className="font-mono text-[10px] uppercase text-ink/50 block">Cancelled</span>
          <span className="font-display text-2xl font-bold text-red-600">3</span>
          <span className="text-[10px] text-ink/50 font-mono block">0.9% cancellation</span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   5. Availability & Shift Management Tab
   ========================================================================= */
export const DeliveryAvailabilityTab: React.FC = () => {
  const [onBreak, setOnBreak] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-frost/90 border border-ink/10 p-5 rounded-2xl space-y-4">
        <h3 className="font-display text-lg font-bold text-ink">Shift & Zone Availability</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-cream/60 p-4 rounded-xl border border-ink/10 space-y-1">
            <span className="font-mono text-[10px] uppercase text-ink/50 block font-bold">
              Current Assigned Shift
            </span>
            <span className="font-display text-sm font-bold text-ink block">
              Lunch Peak Shift (10:30 AM – 4:00 PM)
            </span>
            <p className="text-ink/60">Includes guaranteed base pay + ₹25 surge incentive</p>
          </div>

          <div className="bg-cream/60 p-4 rounded-xl border border-ink/10 space-y-1">
            <span className="font-mono text-[10px] uppercase text-ink/50 block font-bold">
              Assigned Operational Zone
            </span>
            <span className="font-display text-sm font-bold text-spice block">
              Indiranagar Hub #01 (5.5 km radius)
            </span>
            <p className="text-ink/60">Domlur, HAL 2nd Stage, Koramangala 1st Block</p>
          </div>
        </div>

        {/* Break Mode Button */}
        <div className="pt-2 flex items-center justify-between border-t border-ink/10">
          <div>
            <span className="font-bold text-xs text-ink block">Tea / Fuel Break Mode</span>
            <span className="text-[11px] text-ink/60">
              Pause new order assignment for 15 minutes
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setOnBreak(!onBreak);
              toast(
                onBreak
                  ? "Break ended. You are back in active queue!"
                  : "Break started. Enjoy your 15-min chai!",
              );
            }}
            variant={onBreak ? "destructive" : "outline"}
            className="text-xs rounded-xl"
          >
            {onBreak ? "End Break Mode" : "Take 15 Min Break"}
          </Button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   6. Rider Profile & KYC Documents Tab
   ========================================================================= */
export const DeliveryProfileDocsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Profile Details */}
      <div className="bg-frost/90 border border-ink/10 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-display text-lg font-bold text-ink">Rider Identity & Vehicle</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-ink/50 block">Full Name</span>
            <span className="font-bold text-ink">Rahul Verma</span>
          </div>
          <div>
            <span className="text-ink/50 block">Mobile Phone</span>
            <span className="font-mono font-bold text-ink">+91 98765 43210</span>
          </div>
          <div>
            <span className="text-ink/50 block">Vehicle Model</span>
            <span className="font-bold text-ink">Hero Splendor Plus (Motorcycle)</span>
          </div>
          <div>
            <span className="text-ink/50 block">Registration Plate</span>
            <span className="font-mono font-bold text-spice">KA-03-HA-8821</span>
          </div>
          <div>
            <span className="text-ink/50 block">Emergency Contact</span>
            <span className="font-bold text-ink">Sunita Verma (Mother) · +91 98450 11223</span>
          </div>
          <div>
            <span className="text-ink/50 block">Registered Bank / UPI</span>
            <span className="font-mono font-bold text-emerald-700">rahul@okhdfcbank</span>
          </div>
        </div>
      </div>

      {/* Verified Documents & Expiry Alert */}
      <div className="bg-frost/90 border border-ink/10 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-display text-sm font-bold text-ink">
            Government & Vehicle Documents
          </h4>
          <Badge className="bg-emerald-500/15 text-emerald-700 font-mono text-[10px] border-none">
            Verified Partner
          </Badge>
        </div>

        {/* Expiry Warning Banner */}
        <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="size-4 text-amber-700 shrink-0" />
          <span>
            <strong>Warning:</strong> Vehicle Insurance expires in <strong>12 days</strong> (29 Sep
            2026). Please upload renewed policy to avoid account pause.
          </span>
        </div>

        <div className="divide-y divide-ink/10 text-xs">
          {[
            {
              name: "Driving License (DL-KA0320210087421)",
              status: "Verified ✓",
              valid: "Valid till 2038",
            },
            {
              name: "Vehicle Registration Certificate (RC)",
              status: "Verified ✓",
              valid: "Active",
            },
            { name: "Aadhaar Card KYC", status: "Verified ✓", valid: "Verified" },
            {
              name: "Vehicle Pollution Certificate (PUC)",
              status: "Verified ✓",
              valid: "Valid till Dec 2026",
            },
          ].map((doc, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between">
              <span className="font-semibold text-ink">{doc.name}</span>
              <span className="font-mono text-emerald-600 font-bold">{doc.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   7. Support & 🚨 Emergency SOS Tab
   ========================================================================= */
export const DeliverySupportEmergencyTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Big Red SOS Alert Button */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-cream p-6 rounded-3xl shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-6 text-cream animate-bounce" />
          <h3 className="font-display text-xl font-bold text-cream">
            🚨 EMERGENCY SAFETY & ACCIDENT SOS
          </h3>
        </div>
        <p className="text-xs text-cream/90">
          In case of emergency, accident, or threat, tap below. Your live GPS coordinates will be
          sent immediately to the Anima Operations Manager and Police Emergency (112).
        </p>
        <Button
          onClick={() => {
            toast.error(
              "🚨 EMERGENCY TRIGGERED: Live GPS Location transmitted to Hub Dispatch & Safety Team.",
            );
          }}
          className="bg-cream text-red-700 hover:bg-white font-bold text-sm rounded-xl h-11 px-6 shadow-md"
        >
          BROADCAST EMERGENCY SOS NOW
        </Button>
      </div>

      {/* Support Quick Issues */}
      <div className="bg-frost/90 border border-ink/10 rounded-2xl p-5 shadow-sm space-y-4">
        <h4 className="font-display text-sm font-bold text-ink">
          Need Immediate Delivery Assistance?
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            "Customer unavailable / phone switched off",
            "Restaurant delay (> 15 min waiting)",
            "Wrong delivery address given",
            "Vehicle puncture / mechanical breakdown",
            "Customer refusing COD payment",
          ].map((issue, idx) => (
            <Button
              key={idx}
              variant="outline"
              onClick={() => toast.info(`Issue reported: "${issue}". Dispatch manager pinged.`)}
              className="justify-start text-left text-xs border-ink/15 hover:border-spice rounded-xl h-10 px-3 text-ink"
            >
              {issue}
            </Button>
          ))}
        </div>

        <div className="pt-3 border-t border-ink/10 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => toast.info("Dialing Dispatch Manager: +91 98765 00111")}
            className="flex-1 bg-ink hover:bg-spice text-cream rounded-xl text-xs h-10 gap-2"
          >
            <Phone className="size-4" />
            <span>Call Dispatch Hub (+91 98765 00111)</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
