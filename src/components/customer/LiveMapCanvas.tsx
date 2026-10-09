import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ExternalLink, Navigation, Compass, Clock, ShieldCheck, Bike } from "lucide-react";
import type { Order } from "@/types/kitchen";

interface LiveMapCanvasProps {
  order?: Order;
  orderStatus?: string;
  riderName?: string;
  riderPhone?: string;
  riderVehicle?: string;
  status?: string;
  estimatedMinutes?: number;
  branchName?: string;
}

export const LiveMapCanvas: React.FC<LiveMapCanvasProps> = ({
  order,
  orderStatus,
  status: propStatus,
}) => {
  const status = order?.status || propStatus || orderStatus || "out_for_delivery";
  const customerName = order?.customerName || "Customer";
  const address = order?.deliveryAddress?.street || "Indiranagar 12th Main, Bengaluru";
  const lat = order?.deliveryAddress?.coordinates?.lat || 12.9719;
  const lng = order?.deliveryAddress?.coordinates?.lng || 77.6412;

  const handleOpenGoogleMaps = () => {
    const query = encodeURIComponent(`${lat},${lng} (${customerName} - ${address})`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  return (
    <div className="w-full h-full min-h-[220px] rounded-2xl bg-gradient-to-br from-cream via-frost to-cream border border-ink/10 p-5 flex flex-col justify-between shadow-inner relative overflow-hidden">
      {/* Background Subtle Grid Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1c1917_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Top Banner Status */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-emerald-600 text-cream shadow-sm">
            <Compass className="size-4" />
          </span>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-ink/60 block">
              Location & Dispatch Radar
            </span>
            <span className="text-xs font-bold text-ink flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Route Coordinates Ready
            </span>
          </div>
        </div>

        <Badge className="bg-spice/10 text-spice font-mono text-[10px] border-none font-bold">
          {status.toUpperCase().replace(/_/g, " ")}
        </Badge>
      </div>

      {/* Destination & Action Box */}
      <div className="bg-frost/95 border border-ink/10 rounded-2xl p-4 shadow-sm z-10 space-y-3">
        <div className="flex items-start gap-2.5">
          <MapPin className="size-4 text-spice shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-mono uppercase text-ink/50 font-bold block">
              Delivery Destination
            </span>
            <p className="text-xs font-bold text-ink truncate">{address}</p>
            <span className="text-[11px] font-mono text-ink/60 block mt-0.5">
              GPS: {lat.toFixed(4)}, {lng.toFixed(4)}
            </span>
          </div>
        </div>

        <Button
          onClick={handleOpenGoogleMaps}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-cream font-bold text-xs rounded-xl h-10 gap-2 shadow-md transition-all"
        >
          <ExternalLink className="size-4" />
          <span>Open Direct Location in Google Maps</span>
        </Button>
      </div>

      {/* Bottom Info Footnote */}
      <div className="flex items-center justify-between text-[11px] text-ink/60 z-10 pt-1">
        <span className="flex items-center gap-1">
          <ShieldCheck className="size-3.5 text-leaf" />
          Direct GPS Navigation via Google Maps App
        </span>
        <span className="font-mono text-[10px]">Real-Time Sync</span>
      </div>
    </div>
  );
};
