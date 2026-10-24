import React, { useState, useEffect, useRef } from "react";
import {
  QrCode,
  Copy,
  ExternalLink,
  Printer,
  Download,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Eye,
  RefreshCw,
  Share2,
  ChefHat,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useDemoStore } from "@/context/DemoStoreContext";

export const QrMenuGeneratorTab: React.FC = () => {
  const { branches, activeBranchId, menuItems } = useDemoStore();
  const currentBranch =
    branches.find((b) => b.id === activeBranchId) || branches[0] || {
      name: "Kurji Main Kitchen (Flagship)",
      code: "PAT-KUR-01",
    };

  const [copied, setCopied] = useState(false);
  const [standeeTitle, setStandeeTitle] = useState("SCAN FOR LIVE DIGITAL MENU");
  const [standeeSubtitle, setStandeeSubtitle] = useState("Authentic Ghar Ka Khana · Fresh Daily Meals");
  const [customUrl, setCustomUrl] = useState("");
  const [qrColor, setQrColor] = useState<"dark" | "spice">("dark");
  const standeeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      setCustomUrl(`${origin}/?page=menu&source=qr_menu`);
    }
  }, []);

  const targetMenuUrl = customUrl || (typeof window !== "undefined" ? `${window.location.origin}/?page=menu&source=qr_menu` : "https://animaskitchen.in/?page=menu");

  const handleCopy = () => {
    navigator.clipboard.writeText(targetMenuUrl);
    setCopied(true);
    toast.success("Digital Menu link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateScan = () => {
    toast.info("Opening Digital Menu in new tab...");
    window.open(targetMenuUrl, "_blank");
  };

  const handlePrintStandee = () => {
    window.print();
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=12&data=${encodeURIComponent(
    targetMenuUrl
  )}`;

  const handleDownloadQr = async () => {
    try {
      toast.info("Preparing QR code download...");
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Animas-Kitchen-Menu-QR-${currentBranch.code || "PAT-KUR-01"}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("QR code image downloaded successfully!");
    } catch {
      // Fallback: open in new window
      window.open(qrImageUrl, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      {/* Print-specific style overrides */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-menu-standee, #printable-menu-standee * {
            visibility: visible;
          }
          #printable-menu-standee {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 480px;
            box-shadow: none !important;
            border: 2px solid #000 !important;
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* Top 3 Touchless Menu Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-ink/10 shadow-sm flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-spice/10 text-spice shrink-0">
            <Smartphone className="size-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink">Zero-App Ordering</h4>
            <p className="text-[11px] text-ink/60 mt-0.5">
              100% Instant. Customers scan via any phone camera, Google Lens, or Paytm to view menu.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-ink/10 shadow-sm flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
            <RefreshCw className="size-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink">Live Menu Catalog Sync</h4>
            <p className="text-[11px] text-ink/60 mt-0.5">
              Reflects all {menuItems.length} active dishes, daily thalis, combos & real-time prices.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-ink/10 shadow-sm flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-saffron/20 text-ink shrink-0">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink">Multi-Purpose Standee</h4>
            <p className="text-[11px] text-ink/60 mt-0.5">
              Print ready for billing counter standees, meal box flyers, stickers, or table tent cards.
            </p>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: QR Menu Configuration & Action Buttons */}
        <div className="lg:col-span-6 space-y-5 bg-white p-6 rounded-3xl border border-ink/10 shadow-sm">
          <div className="border-b border-ink/10 pb-4">
            <div className="flex items-center gap-2">
              <QrCode className="size-5 text-spice" />
              <h3 className="font-display text-base font-bold text-ink">
                Digital Menu QR Configuration
              </h3>
            </div>
            <p className="text-xs text-ink/60 mt-1">
              Customers scan this QR code to view your entire cloud kitchen menu and place orders.
            </p>
          </div>

          {/* Target URL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-ink">
                Digital Menu URL (Encoded in QR)
              </label>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    setCustomUrl(`${window.location.origin}/?page=menu&source=qr_menu`);
                    toast.info("Reset to default host menu URL");
                  }
                }}
                className="text-[11px] text-spice hover:underline font-medium"
              >
                Reset Default
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://animaskitchen.in/?page=menu"
                className="text-xs font-mono bg-cream/30 text-ink border-ink/15"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="rounded-xl text-xs shrink-0 border-ink/15 hover:border-spice gap-1.5 h-10 px-3"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5 text-ink/60" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
            <p className="text-[10px] text-ink/50">
              This link directly opens the Anima's Kitchen Full Menu page on customer phones.
            </p>
          </div>

          {/* Standee Content Customization */}
          <div className="space-y-3 pt-2 border-t border-ink/10">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wide text-ink/70">
              Standee Text Customization
            </h4>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink">Headline Badge</label>
              <Input
                value={standeeTitle}
                onChange={(e) => setStandeeTitle(e.target.value)}
                placeholder="e.g. SCAN FOR LIVE DIGITAL MENU"
                className="text-xs font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink">Subtitle Tagline</label>
              <Input
                value={standeeSubtitle}
                onChange={(e) => setStandeeSubtitle(e.target.value)}
                placeholder="e.g. Authentic Ghar Ka Khana · Fresh Daily Meals"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink">QR Style Theme</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setQrColor("dark")}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    qrColor === "dark"
                      ? "border-ink bg-ink text-cream shadow-sm"
                      : "border-ink/15 text-ink/70 hover:border-ink/30"
                  }`}
                >
                  Classic Black & Dark
                </button>
                <button
                  type="button"
                  onClick={() => setQrColor("spice")}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    qrColor === "spice"
                      ? "border-spice bg-spice text-white shadow-sm"
                      : "border-ink/15 text-ink/70 hover:border-ink/30"
                  }`}
                >
                  Spice Orange Brand
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-ink/10 flex flex-col sm:flex-row items-center gap-3">
            <Button
              onClick={handleSimulateScan}
              className="w-full sm:flex-1 rounded-2xl bg-spice hover:bg-spice/90 text-white text-xs font-bold gap-2 h-11 shadow-sm"
            >
              <ExternalLink className="size-4" />
              <span>Simulate Scan / View Menu</span>
            </Button>

            <Button
              variant="outline"
              onClick={handlePrintStandee}
              className="w-full sm:w-auto rounded-2xl border-ink/20 text-xs font-bold text-ink gap-2 h-11 px-4 hover:border-spice hover:bg-spice/5"
            >
              <Printer className="size-4 text-spice" />
              <span>Print Standee</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleDownloadQr}
              className="w-full sm:w-auto rounded-2xl border-ink/20 text-xs font-bold text-ink gap-2 h-11 px-4 hover:border-emerald-600 hover:bg-emerald-50"
            >
              <Download className="size-4 text-emerald-600" />
              <span>Download PNG</span>
            </Button>
          </div>
        </div>

        {/* Right Column: Visual Printable Standee Mockup */}
        <div className="lg:col-span-6 flex justify-center">
          <div
            id="printable-menu-standee"
            ref={standeeRef}
            className="w-full max-w-sm rounded-3xl bg-white border-2 border-ink/15 shadow-xl p-6 sm:p-7 text-center space-y-4"
          >
            {/* Header Brand */}
            <div className="space-y-1">
              <div className="flex justify-center">
                <img
                  src="/logo.png"
                  alt="Anima's Kitchen"
                  className="size-16 rounded-full object-contain shadow-md border-2 border-spice/30 mx-auto bg-white"
                />
              </div>
              <h3 className="font-display text-xl font-black text-ink tracking-tight pt-1">
                ANIMA’S KITCHEN
              </h3>
              <p className="text-[11px] font-semibold text-spice uppercase tracking-wider">
                Authentic Ghar Ka Khana · Cloud Kitchen
              </p>
              <p className="text-[10px] text-ink/50">
                {currentBranch.name} ({currentBranch.code})
              </p>
            </div>

            {/* Standee Action Callout Banner */}
            <div>
              <div
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white font-mono text-xs font-bold shadow-sm ${
                  qrColor === "spice" ? "bg-spice" : "bg-ink"
                }`}
              >
                <Sparkles className="size-3.5 text-saffron" />
                <span>{standeeTitle || "SCAN FOR LIVE DIGITAL MENU"}</span>
              </div>
            </div>

            {/* High-Resolution Scannable QR Code Box */}
            <div className="p-4 rounded-3xl bg-cream/40 border border-ink/10 inline-block shadow-inner relative group">
              <img
                src={qrImageUrl}
                alt="Scan Anima's Kitchen Menu QR Code"
                className="size-52 sm:size-56 mx-auto rounded-xl object-contain"
                onError={(e) => {
                  // Fallback SVG if offline
                  (e.currentTarget as HTMLElement).style.display = "none";
                  const fallback = document.getElementById("qr-svg-fallback");
                  if (fallback) fallback.style.display = "block";
                }}
              />

              {/* Fallback SVG representation if network image is blocked */}
              <div id="qr-svg-fallback" style={{ display: "none" }}>
                <svg viewBox="0 0 100 100" className="size-52 mx-auto text-ink" fill="currentColor">
                  <rect x="5" y="5" width="28" height="28" rx="4" fill="#1C1814" />
                  <rect x="9" y="9" width="20" height="20" rx="2" fill="#FAF7F2" />
                  <rect x="13" y="13" width="12" height="12" rx="1" fill="#D9531E" />

                  <rect x="67" y="5" width="28" height="28" rx="4" fill="#1C1814" />
                  <rect x="71" y="9" width="20" height="20" rx="2" fill="#FAF7F2" />
                  <rect x="75" y="13" width="12" height="12" rx="1" fill="#D9531E" />

                  <rect x="5" y="67" width="28" height="28" rx="4" fill="#1C1814" />
                  <rect x="9" y="71" width="20" height="20" rx="2" fill="#FAF7F2" />
                  <rect x="13" y="75" width="12" height="12" rx="1" fill="#D9531E" />

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
            </div>

            {/* Instruction Footer */}
            <div className="space-y-1.5 pt-1">
              <p className="text-xs font-bold text-ink flex items-center justify-center gap-1.5">
                <Smartphone className="size-3.5 text-spice" />
                <span>Scan with Phone Camera, Google Lens or Paytm</span>
              </p>
              <p className="text-[11px] text-ink/70 font-medium">
                {standeeSubtitle || "Authentic Ghar Ka Khana · Fresh Daily Meals"}
              </p>
            </div>

            {/* Quality Badges */}
            <div className="pt-2 border-t border-ink/10 flex items-center justify-center gap-3 text-[10px] text-ink/60 font-semibold">
              <span className="flex items-center gap-1">
                <Check className="size-3 text-emerald-600" />
                No App Needed
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ChefHat className="size-3 text-spice" />
                Live Daily Menu
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3 text-blue-600" />
                Instant Ordering
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
