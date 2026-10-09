import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bike,
  Star,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Sparkles,
  Plus,
} from "lucide-react";
import { DeliveryPartner } from "@/types/kitchen";

export const FleetManagerTab: React.FC = () => {
  const { deliveryPartners, orders, addDeliveryPartner } = useDemoStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRider, setNewRider] = useState({
    name: "",
    phone: "",
    model: "Honda Activa 6G",
    plateNumber: "KA-01-EQ-",
    type: "scooter" as "scooter" | "bike" | "ev",
  });

  const handleOnboardRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRider.name.trim() || !newRider.phone.trim()) return;

    const partner: DeliveryPartner = {
      id: `partner-${Date.now()}`,
      name: newRider.name.trim(),
      phone: newRider.phone.trim(),
      rating: 5.0,
      totalDeliveries: 0,
      vehicle: {
        model: newRider.model.trim() || "Delivery Bike",
        plateNumber: newRider.plateNumber.trim().toUpperCase() || "KA-01-XX-0000",
        type: newRider.type,
      },
      currentLocation: {
        lat: 12.9716,
        lng: 77.5946,
        heading: 0,
      },
      status: "available",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      todayEarnings: 0,
      weeklyEarnings: 0,
      walletBalance: 0,
    };

    addDeliveryPartner(partner);
    setIsAddOpen(false);
    setNewRider({
      name: "",
      phone: "",
      model: "Honda Activa 6G",
      plateNumber: "KA-01-EQ-",
      type: "scooter",
    });
  };

  return (
    <div className="space-y-6 text-ink">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-xl text-ink font-bold">Active Delivery Fleet</h3>
          <p className="text-xs text-ink/60">
            Real-time monitoring of riders, vehicle assignments, and daily dispatch trips.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Badge className="bg-emerald-600 text-cream font-mono text-xs">
            {deliveryPartners.filter((p) => p.status !== "offline").length} Riders Active
          </Badge>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-2xl bg-spice text-white hover:bg-spice/90 gap-1.5 shadow-sm text-xs font-semibold px-4">
                <Plus className="size-4" />
                <span>Onboard Rider</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white text-ink">
              <DialogHeader>
                <DialogTitle className="font-display text-xl font-bold flex items-center gap-2">
                  <Bike className="size-5 text-spice" />
                  Onboard Delivery Partner
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleOnboardRider} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink/70">Rider Full Name</label>
                  <Input
                    required
                    placeholder="e.g. Sunil Kumar"
                    value={newRider.name}
                    onChange={(e) => setNewRider({ ...newRider, name: e.target.value })}
                    className="rounded-xl border-ink/15 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink/70">Contact Number</label>
                  <Input
                    required
                    placeholder="e.g. +91 98450 12345"
                    value={newRider.phone}
                    onChange={(e) => setNewRider({ ...newRider, phone: e.target.value })}
                    className="rounded-xl border-ink/15 text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink/70">Vehicle Model</label>
                    <Input
                      required
                      placeholder="e.g. Honda Activa / Ather 450X"
                      value={newRider.model}
                      onChange={(e) => setNewRider({ ...newRider, model: e.target.value })}
                      className="rounded-xl border-ink/15 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink/70">Vehicle Plate No.</label>
                    <Input
                      required
                      placeholder="e.g. KA-01-EQ-9876"
                      value={newRider.plateNumber}
                      onChange={(e) => setNewRider({ ...newRider, plateNumber: e.target.value })}
                      className="rounded-xl border-ink/15 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddOpen(false)}
                    className="rounded-xl text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-xl bg-spice text-white hover:bg-spice/90 text-xs font-bold"
                  >
                    Register & Activate Rider
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {deliveryPartners.map((partner) => {
          const activeOrderForPartner = orders.find(
            (o) => o.deliveryPartnerId === partner.id && o.status !== "delivered",
          );

          return (
            <div
              key={partner.id}
              className="rounded-3xl border border-ink/10 bg-frost p-5 shadow-sm space-y-4 hover:border-ink/20 transition-all"
            >
              {/* Profile Card */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={partner.avatar}
                    alt={partner.name}
                    className="size-12 rounded-2xl object-cover border border-ink/10"
                  />
                  <div>
                    <h4 className="font-display text-base text-ink">{partner.name}</h4>
                    <p className="font-mono text-xs text-ink/60">{partner.phone}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <span className="font-mono text-xs font-bold text-ink">{partner.rating}</span>
                      <span className="text-[10px] text-ink/40">
                        ({partner.totalDeliveries} trips)
                      </span>
                    </div>
                  </div>
                </div>

                <Badge
                  className={`text-[10px] font-mono uppercase ${
                    partner.status === "available"
                      ? "bg-emerald-600/10 text-emerald-800 border-emerald-600/30"
                      : "bg-amber-500/10 text-amber-800 border-amber-500/30"
                  }`}
                >
                  {partner.status}
                </Badge>
              </div>

              {/* Vehicle info */}
              <div className="rounded-2xl border border-ink/5 bg-cream/50 p-3 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-ink/60">Vehicle</span>
                  <strong className="text-ink">{partner.vehicle.model}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Plate Number</span>
                  <span className="font-mono font-bold text-ink">
                    {partner.vehicle.plateNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Today's Payout</span>
                  <span className="font-mono font-bold text-emerald-700">
                    ₹{partner.todayEarnings}
                  </span>
                </div>
              </div>

              {/* Assigned order tag if any */}
              {activeOrderForPartner ? (
                <div className="rounded-xl bg-amber-500/15 border border-amber-500/30 p-2.5 text-xs text-amber-900 flex items-center justify-between">
                  <div>
                    <span className="font-bold">Carrying #{activeOrderForPartner.orderNumber}</span>
                    <p className="text-[10px] text-amber-800/80 uppercase">
                      {activeOrderForPartner.status.replace(/_/g, " ")}
                    </p>
                  </div>
                  <Navigation className="size-3.5 animate-bounce" />
                </div>
              ) : (
                <p className="text-[11px] text-ink/50 text-center py-1">
                  Ready for next dispatch assignment
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
