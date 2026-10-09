import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Banknote,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export const RiderEarningsTab: React.FC = () => {
  const { activeRider } = useDemoStore();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const pastTrips = [
    { id: "trip-1", order: "#AK-8491", time: "12:45 PM", dist: "2.4 km", amount: 65, tip: 20 },
    { id: "trip-2", order: "#AK-8420", time: "11:30 AM", dist: "3.1 km", amount: 75, tip: 0 },
    { id: "trip-3", order: "#AK-8390", time: "10:15 AM", dist: "1.8 km", amount: 55, tip: 10 },
    { id: "trip-4", order: "#AK-8312", time: "09:20 AM", dist: "4.0 km", amount: 90, tip: 30 },
  ];

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      toast.success(`₹${activeRider.walletBalance} Transferred to your UPI account!`, {
        description: "Transaction ID: UPI/849204810294 · Instant settlement",
      });
    }, 1200);
  };

  return (
    <div className="space-y-6 text-ink">
      {/* Wallet Balance Hero Card */}
      <div className="overflow-hidden rounded-3xl border border-ink/10 bg-gradient-to-br from-ink via-ink to-emerald-950 p-6 text-cream shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-cream/10 text-saffron">
              <Wallet className="size-4" />
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-cream/70">
              Withdrawable Balance
            </span>
          </div>
          <Badge className="bg-emerald-600 text-cream font-mono text-[10px]">
            Instant UPI Active
          </Badge>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <h3 className="font-display text-4xl sm:text-5xl text-cream">
              ₹{activeRider.walletBalance}
            </h3>
            <p className="mt-1 text-xs text-cream/60">
              Registered UPI: <strong>rajesh@okaxis</strong>
            </p>
          </div>

          <Button
            onClick={handleWithdraw}
            disabled={isWithdrawing || activeRider.walletBalance <= 0}
            className="rounded-full bg-saffron px-5 py-2.5 font-bold text-ink hover:bg-cream shadow-md"
          >
            {isWithdrawing ? "Transferring..." : "Withdraw Now"}
            <ArrowUpRight className="size-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Daily & Weekly Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-ink/10 bg-frost p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Today's Earnings
            </span>
            <TrendingUp className="size-3.5 text-emerald-700" />
          </div>
          <p className="mt-2 font-display text-2xl text-ink">₹{activeRider.todayEarnings}</p>
          <span className="font-mono text-[10px] text-ink/60 block mt-0.5">
            {activeRider.totalDeliveries} total completed trips
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-frost p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Weekly Payout
            </span>
            <Banknote className="size-3.5 text-spice" />
          </div>
          <p className="mt-2 font-display text-2xl text-spice">₹{activeRider.weeklyEarnings}</p>
          <span className="font-mono text-[10px] text-ink/60 block mt-0.5">
            Next direct payout on Monday
          </span>
        </div>
      </div>

      {/* Target Incentive Progress */}
      <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-amber-700" />
            <span className="font-display text-base text-ink">Peak Hours Incentive</span>
          </div>
          <span className="font-mono text-xs font-bold text-amber-800">₹150 Bonus</span>
        </div>
        <p className="mt-1 text-xs text-ink/70">
          Complete <strong>2 more trips</strong> before 3:00 PM to unlock ₹150 lunch bonus.
        </p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-amber-500/20">
          <div className="h-full w-3/4 rounded-full bg-amber-600" />
        </div>
      </div>

      {/* Recent Trips Ledger */}
      <div className="rounded-3xl border border-ink/10 bg-frost p-5">
        <h4 className="font-display text-lg text-ink border-b border-ink/10 pb-3">
          Completed Trips Today
        </h4>
        <div className="mt-3 space-y-3">
          {pastTrips.map((trip) => (
            <div
              key={trip.id}
              className="flex items-center justify-between border-b border-ink/5 pb-2.5 last:border-0 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-ink">{trip.order}</span>
                  <span className="text-[10px] text-ink/50">{trip.time}</span>
                </div>
                <p className="text-[11px] text-ink/60 mt-0.5">{trip.dist} covered</p>
              </div>

              <div className="text-right">
                <span className="font-display text-base text-emerald-700 font-bold">
                  +₹{trip.amount + trip.tip}
                </span>
                {trip.tip > 0 && (
                  <span className="block font-mono text-[9px] text-amber-700">
                    (₹{trip.tip} tip)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
