import React, { useState, useEffect } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  MapPin,
  Utensils,
  Navigation,
  Clock,
  Banknote,
  CheckCircle2,
  XCircle,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";

export const NewDeliveryAlertModal: React.FC = () => {
  const { riderAlertOpen, setRiderAlertOpen, activeOrder, advanceDeliveryStep, activeRider } =
    useDemoStore();

  const [countdown, setCountdown] = useState(28);

  useEffect(() => {
    if (!riderAlertOpen) {
      setCountdown(28);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setRiderAlertOpen(false);
          return 28;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [riderAlertOpen, setRiderAlertOpen]);

  if (!activeOrder) return null;

  const handleAccept = () => {
    advanceDeliveryStep(activeOrder.id);
    setRiderAlertOpen(false);
    toast.success("Delivery Order Accepted!", {
      description: "Navigate to Anima's Kitchen to pick up order.",
    });
  };

  const handleReject = () => {
    setRiderAlertOpen(false);
    toast.info("Order declined. Searching nearby riders...");
  };

  return (
    <Dialog open={riderAlertOpen} onOpenChange={setRiderAlertOpen}>
      <DialogContent className="max-w-md overflow-hidden rounded-3xl border-2 border-emerald-500/30 bg-frost p-0 shadow-2xl text-ink">
        {/* Animated Radar Pulse Banner */}
        <div className="relative overflow-hidden bg-emerald-700 p-6 text-cream text-center">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="size-32 rounded-full bg-cream/10 animate-ping" />
            <span className="size-48 rounded-full bg-cream/5 animate-ping [animation-delay:400ms]" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-cream/20 text-cream shadow-inner mb-2">
              <Bell className="size-6 animate-bounce" />
            </span>
            <Badge className="bg-saffron text-ink font-mono text-[10px] font-bold uppercase tracking-wider mb-1">
              NEW ORDER DISPATCHED
            </Badge>
            <DialogTitle className="font-display text-2xl text-cream">
              Order #{activeOrder.orderNumber}
            </DialogTitle>
            <p className="text-xs text-cream/80">Hot Thali Meal · 2 Packets</p>
          </div>
        </div>

        {/* Details & Locations */}
        <div className="p-6 space-y-4">
          {/* Earnings & Distance Preview */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl border border-ink/10 bg-cream/50 p-2.5">
              <span className="text-[10px] uppercase font-mono text-ink/50 block">
                Your Earning
              </span>
              <span className="font-display text-xl text-emerald-700 font-bold">₹65</span>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-cream/50 p-2.5">
              <span className="text-[10px] uppercase font-mono text-ink/50 block">Distance</span>
              <span className="font-display text-xl text-ink">2.4 km</span>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-cream/50 p-2.5">
              <span className="text-[10px] uppercase font-mono text-ink/50 block">Est. Time</span>
              <span className="font-display text-xl text-spice">18 min</span>
            </div>
          </div>

          {/* Pickup & Drop Points */}
          <div className="space-y-3 rounded-2xl border border-ink/10 bg-cream/30 p-4 text-xs">
            {/* Pickup */}
            <div className="flex items-start gap-3">
              <span className="grid size-6 place-items-center rounded-full bg-ink text-saffron shrink-0 mt-0.5">
                <Utensils className="size-3" />
              </span>
              <div>
                <span className="font-mono text-[9px] uppercase font-bold text-ink/50 block">
                  PICKUP FROM KITCHEN
                </span>
                <strong className="text-ink text-xs">Anima's Kitchen Hub</strong>
                <p className="text-[11px] text-ink/60">100ft Road, Indiranagar</p>
              </div>
            </div>

            <div className="ml-3 h-4 border-l border-dashed border-ink/20" />

            {/* Drop */}
            <div className="flex items-start gap-3">
              <span className="grid size-6 place-items-center rounded-full bg-emerald-600 text-cream shrink-0 mt-0.5">
                <MapPin className="size-3" />
              </span>
              <div>
                <span className="font-mono text-[9px] uppercase font-bold text-ink/50 block">
                  DELIVER TO CUSTOMER
                </span>
                <strong className="text-ink text-xs">
                  {activeOrder.deliveryAddress.contactName} ({activeOrder.deliveryAddress.label})
                </strong>
                <p className="text-[11px] text-ink/60">{activeOrder.deliveryAddress.street}</p>
              </div>
            </div>
          </div>

          {/* Countdown & Action Buttons */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs text-ink/60 font-mono">
              <span>Auto-rejects in:</span>
              <span className="font-bold text-spice">{countdown}s</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleReject}
                className="rounded-full border-ink/15 text-xs text-ink/70 hover:bg-red-50 hover:text-red-700"
              >
                <XCircle className="size-4 mr-1" />
                <span>Decline</span>
              </Button>
              <Button
                onClick={handleAccept}
                className="rounded-full bg-emerald-600 text-xs font-semibold text-cream shadow-md hover:bg-emerald-700"
              >
                <CheckCircle2 className="size-4 mr-1" />
                <span>Accept Delivery</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
