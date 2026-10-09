import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  QrCode,
  Printer,
  Download,
  Copy,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Utensils,
  ShoppingBag,
} from "lucide-react";

export const QrMenuGeneratorTab: React.FC = () => {
  const { setActiveRole, setOrderType } = useDemoStore();
  const [qrType, setQrType] = useState<"table" | "counter" | "packaging">("table");
  const [tableNumber, setTableNumber] = useState<string>("04");
  const [copied, setCopied] = useState<boolean>(false);

  const getTargetUrl = () => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://animas-kitchen.in";
    if (qrType === "table") {
      return `${origin}/?source=table&table_no=${tableNumber}`;
    } else if (qrType === "counter") {
      return `${origin}/?source=counter_takeaway`;
    } else {
      return `${origin}/?source=packaging_reorder&discount=REPEAT10`;
    }
  };

  const currentUrl = getTargetUrl();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestScan = () => {
    if (qrType === "counter") {
      setOrderType("pickup");
    }
    setActiveRole("customer");
  };

  const handlePrintStandee = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Zero-App Ordering
            </span>
            <QrCode className="size-4 text-spice" />
          </div>
          <p className="mt-2 font-display text-2xl text-ink font-bold">100% Instant</p>
          <span className="text-[10px] text-ink/60 mt-0.5 block">
            Scan via any phone camera, Google Lens or Paytm
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Direct Counter Orders
            </span>
            <Utensils className="size-4 text-emerald-600" />
          </div>
          <p className="mt-2 font-display text-2xl text-emerald-700 font-bold">Zero Wait Time</p>
          <span className="text-[10px] text-emerald-800/80 font-medium mt-0.5 block">
            Customers order & pay directly from table
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Packaging Re-Order Hook
            </span>
            <Sparkles className="size-4 text-purple-600" />
          </div>
          <p className="mt-2 font-display text-2xl text-purple-700 font-bold">+38% Retention</p>
          <span className="text-[10px] text-purple-800/80 font-medium mt-0.5 block">
            Auto-applies REPEAT10 coupon on QR scan
          </span>
        </div>
      </div>

      {/* Main Grid: Controls + Visual Standee Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: QR Generator Configuration */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-ink/10 p-6 shadow-sm space-y-5">
          <div>
            <h3 className="font-display text-lg font-bold text-ink">
              QR Code Setup & Customization
            </h3>
            <p className="text-xs text-ink/60">
              Configure dynamic ordering links for tables, express counters, and delivery packaging
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-ink block">
              Select QR Placement Target
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setQrType("table")}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  qrType === "table"
                    ? "border-spice bg-spice/5 ring-2 ring-spice/20"
                    : "border-ink/10 hover:border-ink/20"
                }`}
              >
                <Utensils className="size-4 text-spice mb-1.5" />
                <span className="text-xs font-bold text-ink block">Dine-in Table</span>
                <span className="text-[10px] text-ink/50 block">With Table # ID</span>
              </button>

              <button
                type="button"
                onClick={() => setQrType("counter")}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  qrType === "counter"
                    ? "border-spice bg-spice/5 ring-2 ring-spice/20"
                    : "border-ink/10 hover:border-ink/20"
                }`}
              >
                <ShoppingBag className="size-4 text-spice mb-1.5" />
                <span className="text-xs font-bold text-ink block">Takeaway Stand</span>
                <span className="text-[10px] text-ink/50 block">Express Pickup</span>
              </button>

              <button
                type="button"
                onClick={() => setQrType("packaging")}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  qrType === "packaging"
                    ? "border-spice bg-spice/5 ring-2 ring-spice/20"
                    : "border-ink/10 hover:border-ink/20"
                }`}
              >
                <Sparkles className="size-4 text-spice mb-1.5" />
                <span className="text-xs font-bold text-ink block">Meal Box Flyer</span>
                <span className="text-[10px] text-ink/50 block">Re-order & 10% Off</span>
              </button>
            </div>
          </div>

          {qrType === "table" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink">Table Number Identifier</label>
              <Input
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g. 04"
                className="text-xs font-mono font-bold max-w-xs"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink">Target Web URL (Encoded in QR)</label>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={currentUrl}
                className="text-xs font-mono bg-frost text-ink/70"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="rounded-xl text-xs shrink-0"
              >
                {copied ? (
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                <span className="ml-1.5">{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <Button
              onClick={handleTestScan}
              className="w-full sm:w-auto rounded-2xl bg-ink text-cream hover:bg-ink/90 text-xs font-semibold gap-1.5"
            >
              <ExternalLink className="size-3.5" />
              <span>Simulate Customer Scan</span>
            </Button>
            <Button
              variant="outline"
              onClick={handlePrintStandee}
              className="w-full sm:w-auto rounded-2xl border-ink/20 text-xs text-ink font-semibold gap-1.5"
            >
              <Printer className="size-3.5" />
              <span>Print Ready Standee</span>
            </Button>
          </div>
        </div>

        {/* Right Column: Visual Printable Standee Mockup */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-sm rounded-3xl bg-white border-2 border-ink/15 shadow-xl p-6 text-center space-y-5 print:border-none print:shadow-none">
            {/* Header Brand */}
            <div className="space-y-1">
              <span className="inline-grid size-12 place-items-center rounded-2xl bg-saffron text-ink font-display text-2xl font-bold mx-auto shadow-md">
                A
              </span>
              <h4 className="font-display text-xl font-bold text-ink">ANIMA’S KITCHEN</h4>
              <p className="text-[11px] text-ink/60 font-medium">
                Authentic Ghar Ka Khana · Cloud Kitchen
              </p>
            </div>

            {/* Target Badge */}
            <div>
              {qrType === "table" ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-spice text-white font-mono text-xs font-bold shadow-sm">
                  <span>TABLE #{tableNumber}</span>
                </div>
              ) : qrType === "counter" ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700 text-white font-mono text-xs font-bold shadow-sm">
                  <span>EXPRESS TAKEAWAY COUNTER</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-700 text-white font-mono text-xs font-bold shadow-sm">
                  <span>10% OFF NEXT ORDER: REPEAT10</span>
                </div>
              )}
            </div>

            {/* QR Visual Box */}
            <div className="p-4 rounded-3xl bg-frost border border-ink/10 inline-block shadow-inner">
              {/* Realistic SVG QR code representation */}
              <svg viewBox="0 0 100 100" className="size-48 mx-auto text-ink" fill="currentColor">
                {/* QR corner marker top-left */}
                <rect x="5" y="5" width="28" height="28" rx="4" fill="#1C1814" />
                <rect x="9" y="9" width="20" height="20" rx="2" fill="#FAF7F2" />
                <rect x="13" y="13" width="12" height="12" rx="1" fill="#D9531E" />

                {/* QR corner marker top-right */}
                <rect x="67" y="5" width="28" height="28" rx="4" fill="#1C1814" />
                <rect x="71" y="9" width="20" height="20" rx="2" fill="#FAF7F2" />
                <rect x="75" y="13" width="12" height="12" rx="1" fill="#D9531E" />

                {/* QR corner marker bottom-left */}
                <rect x="5" y="67" width="28" height="28" rx="4" fill="#1C1814" />
                <rect x="9" y="71" width="20" height="20" rx="2" fill="#FAF7F2" />
                <rect x="13" y="75" width="12" height="12" rx="1" fill="#D9531E" />

                {/* QR Data Matrix simulation */}
                <rect x="38" y="10" width="8" height="8" fill="#1C1814" />
                <rect x="50" y="10" width="8" height="8" fill="#1C1814" />
                <rect x="42" y="24" width="8" height="8" fill="#D9531E" />
                <rect x="10" y="40" width="8" height="8" fill="#1C1814" />
                <rect x="24" y="44" width="8" height="8" fill="#1C1814" />
                <rect x="38" y="38" width="12" height="12" rx="2" fill="#1C1814" />
                <rect x="56" y="42" width="10" height="10" fill="#D9531E" />
                <rect x="72" y="40" width="8" height="8" fill="#1C1814" />
                <rect x="84" y="46" width="8" height="8" fill="#1C1814" />
                <rect x="38" y="56" width="8" height="8" fill="#1C1814" />
                <rect x="50" y="58" width="14" height="8" fill="#1C1814" />
                <rect x="70" y="60" width="8" height="14" fill="#1C1814" />
                <rect x="84" y="74" width="8" height="8" fill="#D9531E" />
                <rect x="42" y="76" width="16" height="10" fill="#1C1814" />
                <rect x="62" y="80" width="12" height="8" fill="#1C1814" />
              </svg>
            </div>

            {/* Instruction Footer */}
            <div className="space-y-1">
              <p className="text-xs font-bold text-ink">
                Scan with Phone Camera or Google Pay / Paytm
              </p>
              <p className="text-[10px] text-ink/60">
                View Live Authentic Menu · Instant Digital Billing · Desi Khana
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
