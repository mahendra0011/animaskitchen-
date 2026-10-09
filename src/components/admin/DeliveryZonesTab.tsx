import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { DeliveryZone } from "@/types/kitchen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Navigation,
  MapPin,
  CheckCircle2,
  Bike,
  ShieldCheck,
  Percent,
  Sliders,
} from "lucide-react";

export const DeliveryZonesTab: React.FC = () => {
  const { deliveryZones, updateDeliveryZones } = useDemoStore();
  const [zones, setZones] = useState<DeliveryZone[]>(deliveryZones);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  const handleUpdateZone = (id: string, field: keyof DeliveryZone, val: number | string) => {
    setZones((prev) => prev.map((z) => (z.id === id ? { ...z, [field]: val } : z)));
  };

  const handleSaveSettings = () => {
    updateDeliveryZones(zones);
    setSavedSuccess("Delivery zone pricing and free delivery thresholds successfully updated!");
    setTimeout(() => setSavedSuccess(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Coverage Radius
            </span>
            <Navigation className="size-4 text-spice" />
          </div>
          <p className="mt-2 font-display text-2xl text-ink font-bold">0 to 8.0 KM</p>
          <span className="text-[10px] text-ink/60 mt-0.5 block">
            Hyperlocal hot-food delivery perimeter
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Service Efficiency
            </span>
            <Bike className="size-4 text-emerald-600" />
          </div>
          <p className="mt-2 font-display text-2xl text-emerald-700 font-bold">24 Mins Avg</p>
          <span className="text-[10px] text-emerald-800/80 font-medium mt-0.5 block">
            Insulated thermal bag dispatch
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Kitchen Pass Members
            </span>
            <ShieldCheck className="size-4 text-purple-600" />
          </div>
          <p className="mt-2 font-display text-2xl text-purple-700 font-bold">100% Free</p>
          <span className="text-[10px] text-purple-800/80 font-medium mt-0.5 block">
            Zero delivery fee across all 3 zones
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* Zones Table and Controls */}
      <div className="bg-white rounded-2xl border border-ink/10 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-ink/10 flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-ink">
              Hyperlocal Delivery Zones & Pricing Rules
            </h3>
            <p className="text-xs text-ink/60">
              Set delivery fees and free-delivery order thresholds based on distance from hub
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleSaveSettings}
            className="rounded-xl bg-spice text-white hover:bg-spice/90 text-xs font-semibold"
          >
            Save Zone Rules
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-frost/60 border-b border-ink/10 text-ink/60 font-mono text-[10px] uppercase">
                <th className="p-3.5 pl-4 font-semibold">Zone Identifier</th>
                <th className="p-3.5 font-semibold">Distance Radius</th>
                <th className="p-3.5 font-semibold">Base Delivery Fee</th>
                <th className="p-3.5 font-semibold">Free Delivery Above</th>
                <th className="p-3.5 font-semibold">Minimum Order Value</th>
                <th className="p-3.5 pr-4 text-right font-semibold">Estimated Rider Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {zones.map((zone) => (
                <tr key={zone.id} className="hover:bg-frost/30 transition-colors">
                  <td className="p-3.5 pl-4 font-semibold text-ink">
                    <div className="flex items-center gap-2">
                      <span className="size-7 rounded-xl bg-ink text-cream grid place-items-center font-mono font-bold text-xs">
                        {zone.name.split(" ")[1]}
                      </span>
                      <div>
                        <span className="text-sm font-bold text-ink block">{zone.name}</span>
                        <span className="text-[10px] text-ink/50 font-mono">ID: {zone.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 font-mono text-xs font-semibold text-spice">
                    {zone.radiusKm}
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 max-w-[110px]">
                      <span className="font-mono text-ink/60">₹</span>
                      <Input
                        type="number"
                        value={zone.deliveryFee}
                        onChange={(e) =>
                          handleUpdateZone(zone.id, "deliveryFee", Number(e.target.value))
                        }
                        className="h-8 text-xs font-mono font-bold"
                      />
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 max-w-[120px]">
                      <span className="font-mono text-ink/60">₹</span>
                      <Input
                        type="number"
                        value={zone.freeAboveOrder}
                        onChange={(e) =>
                          handleUpdateZone(zone.id, "freeAboveOrder", Number(e.target.value))
                        }
                        className="h-8 text-xs font-mono font-bold text-emerald-700"
                      />
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 max-w-[120px]">
                      <span className="font-mono text-ink/60">₹</span>
                      <Input
                        type="number"
                        value={zone.minOrder}
                        onChange={(e) =>
                          handleUpdateZone(zone.id, "minOrder", Number(e.target.value))
                        }
                        className="h-8 text-xs font-mono font-bold"
                      />
                    </div>
                  </td>

                  <td className="p-3.5 pr-4 text-right font-mono text-xs text-ink/70">
                    {zone.id === "zone_a"
                      ? "18 – 25 mins"
                      : zone.id === "zone_b"
                        ? "25 – 38 mins"
                        : "38 – 50 mins"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Radial Distance Diagram */}
      <div className="bg-white rounded-2xl border border-ink/10 p-5 shadow-sm space-y-4">
        <h4 className="font-display text-sm font-bold text-ink">
          Radial Proximity Tiering Architecture
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-1">
            <span className="font-mono text-[10px] font-bold text-emerald-800 uppercase block">
              Inner Ring (0 - 4 KM) · FREE DELIVERY
            </span>
            <p className="font-bold text-ink text-sm">Zone 1: Kurji Hyperlocal Core</p>
            <p className="text-xs text-ink/70">
              FREE delivery within 4 km for orders &ge; ₹250. Serves Kurji, Vikash Nagar, Digha
              Ghat, Patliputra Colony.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-1">
            <span className="font-mono text-[10px] font-bold text-blue-800 uppercase block">
              Mid Ring (4 - 7 KM) · DELIVERY EXTRA
            </span>
            <p className="font-bold text-ink text-sm">Zone 2: Extended Patna Neighborhood</p>
            <p className="text-xs text-ink/70">
              Delivery charge extra beyond 4 km. Free delivery above ₹499. Serves Boring Road,
              Alpana Market, SK Puri.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-1">
            <span className="font-mono text-[10px] font-bold text-amber-800 uppercase block">
              Outer Ring (7 - 10 KM) · PERIMETER
            </span>
            <p className="font-bold text-ink text-sm">Zone 3: Outer Metro Perimeter</p>
            <p className="text-xs text-ink/70">
              Extra delivery fee applicable. Free above ₹699. Serves Bailey Road, Raja Bazar, Saguna
              More.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
