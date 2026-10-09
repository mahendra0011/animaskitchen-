import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Plus,
  CreditCard,
  QrCode,
  Banknote,
  Building,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Bike,
  Clock,
  Wallet,
  Check,
  Navigation,
} from "lucide-react";
import type { DeliveryAddress } from "@/types/kitchen";
import { toast } from "sonner";

export const CheckoutModal: React.FC = () => {
  const {
    checkoutModalOpen,
    setCheckoutModalOpen,
    customerProfile,
    cart,
    cartTotal,
    placeOrder,
    addDeliveryAddress,
    orderType,
    setOrderType,
    scheduledTime,
    setScheduledTime,
    customerWallet,
    useWalletDiscount,
    setUseWalletDiscount,
    hasKitchenPass,
  } = useDemoStore();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    customerProfile.savedAddresses[0]?.id || "addr-home",
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newStreet, setNewStreet] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newPincode, setNewPincode] = useState("560038");
  const [newLabel, setNewLabel] = useState<"Home" | "Office" | "Other">("Home");

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "cod">("upi");
  const [upiId, setUpiId] = useState("rahul@okhdfcbank");
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedAddress =
    customerProfile.savedAddresses.find((a) => a.id === selectedAddressId) ||
    customerProfile.savedAddresses[0];

  // Small Food Startup - Direct transparent pricing with 0% extra GST
  const tax = 0;

  // Patna Central Kitchen Hub (Kurji) coordinates: 25.6425, 85.1095
  const KITCHEN_HUB = { lat: 25.6425, lng: 85.1095, name: "Kurji Kitchen Central Hub" };

  // Calculate distance using Haversine formula (100% Free, zero API key)
  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  };

  // Specific Patna Localities requested by User
  const PATNA_SERVICE_AREAS = [
    { name: "Patliputra Colony", pincode: "800013", lat: 25.6268, lng: 85.1118, km: 2.2 },
    { name: "Anandpuri", pincode: "800001", lat: 25.618, lng: 85.114, km: 4.5 },
    { name: "Indrapuri", pincode: "800024", lat: 25.632, lng: 85.101, km: 3.8 },
    { name: "Rajeev Nagar", pincode: "800024", lat: 25.6364, lng: 85.1045, km: 3.1 },
    { name: "Ashiyana", pincode: "800025", lat: 25.6219, lng: 85.0882, km: 5.2 },
    { name: "Digha", pincode: "800011", lat: 25.6482, lng: 85.0974, km: 1.8 },
    { name: "Boring Road", pincode: "800001", lat: 25.6173, lng: 85.1212, km: 4.8 },
    { name: "Budha Colony", pincode: "800001", lat: 25.6241, lng: 85.1287, km: 4.2 },
    { name: "Alpana Market", pincode: "800001", lat: 25.6212, lng: 85.1195, km: 4.6 },
    { name: "Nehru Nagar", pincode: "800013", lat: 25.6295, lng: 85.1165, km: 3.5 },
    { name: "Kurji (Kitchen Hub)", pincode: "800010", lat: 25.6425, lng: 85.1095, km: 0.5 },
  ];

  // Address Input Mode: "gps" (live GPS detect + flat/landmark) vs "manual" (full address entry)
  const [addressInputMode, setAddressInputMode] = useState<"gps" | "manual">("gps");
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [detectedGpsCoords, setDetectedGpsCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  // Manual Form States
  const [manualHouseNo, setManualHouseNo] = useState("");
  const [manualStreet, setManualStreet] = useState("");
  const [manualArea, setManualArea] = useState("Patliputra Colony");
  const [manualLandmark, setManualLandmark] = useState("");
  const [manualCity, setManualCity] = useState("Patna");
  const [manualState, setManualState] = useState("Bihar");
  const [manualPincode, setManualPincode] = useState("800013");
  const [manualLabel, setManualLabel] = useState<"Home" | "Office" | "Other">("Home");

  // GPS Completion details
  const [gpsHouseNo, setGpsHouseNo] = useState("");
  const [gpsLandmark, setGpsLandmark] = useState("");

  // Calculate delivery fee dynamically based on selected address distance:
  // Under 4 km: FREE if cartTotal >= 250, else ₹35.
  // Beyond 4 km: Extra ₹35 base + ₹10/km extra
  const currentAddressDistance = selectedAddress?.coordinates
    ? calculateDistanceKm(
        KITCHEN_HUB.lat,
        KITCHEN_HUB.lng,
        selectedAddress.coordinates.lat,
        selectedAddress.coordinates.lng,
      )
    : 3.2;

  const isFreeDeliveryEligible = currentAddressDistance <= 4.0 && cartTotal >= 250;
  const rawDeliveryFee =
    orderType === "pickup" || hasKitchenPass
      ? 0
      : isFreeDeliveryEligible
        ? 0
        : currentAddressDistance <= 4.0
          ? 35 // Below min order ₹250
          : 35 + Math.round((currentAddressDistance - 4.0) * 10); // ₹10 per km extra beyond 4 km

  const deliveryFee = rawDeliveryFee;
  const grandTotal = cartTotal + tax + deliveryFee;

  // Handle GPS location detection (Browser native, 100% Free)
  const handleDetectLiveLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setIsDetectingGps(true);
    toast.loading("Detecting your exact GPS coordinates in Patna...", { id: "gps-detect" });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingGps(false);
        toast.dismiss("gps-detect");
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setDetectedGpsCoords({ lat, lng });

        // Calculate distance from Kurji Hub
        const dist = calculateDistanceKm(KITCHEN_HUB.lat, KITCHEN_HUB.lng, lat, lng);

        // Find closest known Patna locality or fallback
        let closestArea = "Patna Local Area";
        let minD = 999;
        PATNA_SERVICE_AREAS.forEach((a) => {
          const d = calculateDistanceKm(lat, lng, a.lat, a.lng);
          if (d < minD) {
            minD = d;
            closestArea = a.name;
          }
        });

        toast.success(
          `GPS detected! Approx ${dist} km from Kurji Hub (${dist <= 4.0 ? "Free delivery zone" : "Extra distance zone"}).`,
        );

        const newGpsAddr: DeliveryAddress = {
          id: `addr-gps-${Date.now()}`,
          label: "Current GPS",
          flatNo: gpsHouseNo || "Live Location",
          street: `Exact GPS Pin: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
          area: closestArea,
          city: "Patna",
          state: "Bihar",
          pincode: "800013",
          landmark: gpsLandmark || "Live Device Geolocation",
          coordinates: { lat, lng },
          contactPhone: customerProfile.phone,
          contactName: customerProfile.name,
        };

        addDeliveryAddress(newGpsAddr);
        setSelectedAddressId(newGpsAddr.id);
      },
      (err) => {
        setIsDetectingGps(false);
        toast.dismiss("gps-detect");
        toast.error(
          "Could not fetch GPS: " + (err.message || "Please select manual address option."),
        );
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

  // Handle saving manual address
  const handleSaveManualAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualHouseNo || !manualStreet) {
      toast.error("Please fill in Flat/House No and Street address.");
      return;
    }

    const matchedArea = PATNA_SERVICE_AREAS.find((a) => a.name === manualArea) || {
      name: manualArea,
      lat: 25.6268,
      lng: 85.1118,
      pincode: manualPincode,
      km: 3.5,
    };

    const newManualAddr: DeliveryAddress = {
      id: `addr-manual-${Date.now()}`,
      label: manualLabel,
      flatNo: manualHouseNo,
      street: `${manualHouseNo}, ${manualStreet}`,
      area: matchedArea.name,
      city: manualCity || "Patna",
      state: manualState || "Bihar",
      pincode: manualPincode || matchedArea.pincode,
      landmark: manualLandmark,
      coordinates: { lat: matchedArea.lat, lng: matchedArea.lng },
      contactPhone: customerProfile.phone,
      contactName: customerProfile.name,
    };

    addDeliveryAddress(newManualAddr);
    setSelectedAddressId(newManualAddr.id);
    toast.success(`Address saved for ${newManualAddr.area}, ${newManualAddr.city}!`);
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please add or select a delivery address.");
      return;
    }
    setIsProcessing(true);

    // Save location to Redis for Admin & Rider Google Maps navigation
    try {
      await fetch("/api/location/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: "ord-live-01",
          userId: customerProfile.id || "usr_customer",
          label: selectedAddress.label,
          addressText: `${selectedAddress.street}, ${selectedAddress.area}, ${selectedAddress.city} - ${selectedAddress.pincode}`,
          lat: selectedAddress.coordinates.lat,
          lng: selectedAddress.coordinates.lng,
        }),
      });
    } catch {
      // Background sync
    }

    setTimeout(() => {
      setIsProcessing(false);
      placeOrder(
        selectedAddress,
        paymentMethod,
        "ANIMA120",
        scheduledTime ? `Scheduled for: ${scheduledTime}` : "Fast delivery please",
      );
    }, 1200);
  };

  return (
    <Dialog open={checkoutModalOpen} onOpenChange={setCheckoutModalOpen}>
      <DialogContent className="max-w-3xl overflow-hidden rounded-3xl border border-ink/10 bg-frost p-0 shadow-2xl text-ink">
        {/* Header */}
        <div className="border-b border-ink/10 bg-cream p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-ink text-cream">
                <ShieldCheck className="size-4" />
              </span>
              <div>
                <DialogTitle className="font-display text-2xl text-ink">
                  Secure Checkout
                </DialogTitle>
                <DialogDescription className="text-xs text-ink/60">
                  Direct Kitchen Dispatch · Pure Homemade Food · Live GPS Tracked
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasKitchenPass && (
                <Badge className="bg-purple-700 text-white font-mono text-[10px]">
                  KITCHEN PASS ACTIVE
                </Badge>
              )}
              <Badge variant="outline" className="font-mono text-xs border-leaf/40 text-leaf">
                SSL Encrypted
              </Badge>
            </div>
          </div>
        </div>

        {/* 2-Column Body */}
        <div className="grid md:grid-cols-5 gap-6 p-6 max-h-[75vh] overflow-y-auto">
          {/* Left 3 cols: Delivery Mode, Address & Payment */}
          <div className="md:col-span-3 space-y-5">
            {/* Step 0: Delivery Mode Toggle & Scheduling */}
            <div className="space-y-3">
              <label className="font-mono text-xs font-semibold uppercase tracking-wider text-ink/70 flex items-center justify-between">
                <span>1. Fulfillment Mode</span>
                <span className="font-mono text-[10px] text-spice font-bold">
                  {orderType === "delivery" ? "DOORSTEP RIDER" : "SELF PICKUP"}
                </span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType("delivery")}
                  className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all text-left ${
                    orderType === "delivery"
                      ? "border-spice bg-spice/5 ring-2 ring-spice/20"
                      : "border-ink/10 bg-white hover:border-ink/20"
                  }`}
                >
                  <Bike className="size-4 text-spice shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-ink block">Doorstep Delivery</span>
                    <span className="text-[10px] text-ink/50 block">Rider to your address</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType("pickup")}
                  className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all text-left ${
                    orderType === "pickup"
                      ? "border-spice bg-spice/5 ring-2 ring-spice/20"
                      : "border-ink/10 bg-white hover:border-ink/20"
                  }`}
                >
                  <ShoppingBag className="size-4 text-spice shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-ink block">Self Takeaway</span>
                    <span className="text-[10px] text-emerald-700 font-bold block">
                      Free · 0 Delivery Fee
                    </span>
                  </div>
                </button>
              </div>

              {/* Scheduled Order Slot */}
              <div className="p-3 rounded-2xl bg-white border border-ink/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-ink/50" />
                  <div>
                    <span className="font-semibold text-ink block">Delivery Timing</span>
                    <span className="text-[10px] text-ink/50 font-mono">
                      {scheduledTime ? `Scheduled: ${scheduledTime}` : "Immediate (20-30 mins)"}
                    </span>
                  </div>
                </div>
                <select
                  value={scheduledTime || "now"}
                  onChange={(e) =>
                    setScheduledTime(e.target.value === "now" ? null : e.target.value)
                  }
                  className="rounded-xl border border-ink/20 bg-frost text-xs p-1.5 focus:outline-none"
                >
                  <option value="now">⚡ Deliver Now (20-30m)</option>
                  <option value="Today Lunch (1:00 PM - 1:30 PM)">Today Lunch (1:00 PM)</option>
                  <option value="Today Dinner (8:00 PM - 8:30 PM)">Today Dinner (8:00 PM)</option>
                  <option value="Tomorrow Lunch (1:00 PM - 1:30 PM)">
                    Tomorrow Lunch (1:00 PM)
                  </option>
                </select>
              </div>
            </div>

            {/* Step 1: Delivery Address & Service Area Notice */}
            <div>
              {orderType === "delivery" ? (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-xs font-semibold uppercase tracking-wider text-ink/70 flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-spice" />
                      2. Delivery Address (Patna Service Hub)
                    </label>
                    <span className="text-[10px] font-mono text-ink/50">
                      📍 Kurji Kitchen Central Hub
                    </span>
                  </div>

                  {/* PROMINENT SERVICE AREA NOTICE BANNER */}
                  <div className="rounded-2xl border border-spice/20 bg-gradient-to-br from-spice/5 via-amber-500/5 to-cream p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-spice">
                        <Sparkles className="size-3.5 text-spice" />
                        Patna Service Area & Delivery Policy
                      </span>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Free &lt; 4 KM (Min ₹250)
                      </span>
                    </div>

                    <p className="text-[11px] text-ink/80 leading-relaxed">
                      <strong>Direct Service Localities:</strong> Patliputra Colony, Anandpuri,
                      Indrapuri, Rajeev Nagar, Ashiyana, Digha, Boring Road, Budha Colony, Alpana
                      Market, Nehru Nagar & adjacent sectors across Patna.
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-ink/5 text-[10px]">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                        <Check className="size-3 text-emerald-600 shrink-0" />
                        <span>
                          <strong>Under 4 km:</strong> 100% Free Delivery (Orders ≥ ₹250)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                        <Clock className="size-3 text-amber-700 shrink-0" />
                        <span>
                          <strong>Beyond 4 km:</strong> ₹35 + ₹10/km extra delivery charge
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* DUAL MODE ADDRESS SELECTOR TABS */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-white rounded-2xl border border-ink/10">
                    <button
                      type="button"
                      onClick={() => setAddressInputMode("gps")}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                        addressInputMode === "gps"
                          ? "bg-spice text-cream shadow-sm"
                          : "text-ink/70 hover:text-ink hover:bg-frost"
                      }`}
                    >
                      <Navigation className="size-3.5" />
                      <span>1. Detect My Location</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddressInputMode("manual")}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                        addressInputMode === "manual"
                          ? "bg-spice text-cream shadow-sm"
                          : "text-ink/70 hover:text-ink hover:bg-frost"
                      }`}
                    >
                      <MapPin className="size-3.5" />
                      <span>2. Enter Manually</span>
                    </button>
                  </div>

                  {/* MODE 1: DETECT MY LOCATION (100% Free Browser GPS) */}
                  {addressInputMode === "gps" && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-display text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                            <Navigation className="size-4 text-emerald-600" />
                            Auto-Detect GPS Location
                          </h4>
                          <p className="text-[11px] text-emerald-800/80 mt-0.5">
                            Uses device GPS coordinates directly — zero map charge, 100% free!
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          disabled={isDetectingGps}
                          onClick={handleDetectLiveLocation}
                          className="bg-emerald-600 hover:bg-emerald-700 text-cream text-xs rounded-xl h-8 gap-1.5 shadow-sm"
                        >
                          {isDetectingGps ? (
                            <>
                              <Loader2 className="size-3.5 animate-spin" />
                              <span>Detecting...</span>
                            </>
                          ) : (
                            <>
                              <Navigation className="size-3.5" />
                              <span>Detect Now</span>
                            </>
                          )}
                        </Button>
                      </div>

                      {detectedGpsCoords && (
                        <div className="rounded-xl bg-white/90 p-2.5 border border-emerald-200 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] text-emerald-700 font-bold uppercase">
                              GPS Coordinates Captured:
                            </span>
                            <span className="font-mono text-[10px] font-bold text-ink">
                              {detectedGpsCoords.lat.toFixed(5)}, {detectedGpsCoords.lng.toFixed(5)}
                            </span>
                          </div>
                          <p className="text-[11px] text-ink/80 font-medium">
                            Distance to Kurji Kitchen: <strong>{currentAddressDistance} km</strong>{" "}
                            (
                            {currentAddressDistance <= 4
                              ? "✅ Free Delivery eligible"
                              : "⚠️ Beyond 4 km - Extra Delivery applies"}
                            )
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="text-[10px] font-mono text-ink/70 font-semibold block mb-1">
                            Flat / House No / Floor *
                          </label>
                          <Input
                            placeholder="e.g. Flat 302, Block B"
                            value={gpsHouseNo}
                            onChange={(e) => setGpsHouseNo(e.target.value)}
                            className="h-8 rounded-xl border-ink/15 text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-ink/70 font-semibold block mb-1">
                            Nearby Landmark *
                          </label>
                          <Input
                            placeholder="e.g. Near Shiv Mandir / Golambar"
                            value={gpsLandmark}
                            onChange={(e) => setGpsLandmark(e.target.value)}
                            className="h-8 rounded-xl border-ink/15 text-xs bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODE 2: ENTER ADDRESS MANUALLY */}
                  {addressInputMode === "manual" && (
                    <form
                      onSubmit={handleSaveManualAddress}
                      className="rounded-2xl border border-ink/10 bg-white p-4 space-y-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display text-sm font-bold text-ink">
                          Manual Patna Delivery Address
                        </span>
                        <div className="flex gap-1.5">
                          {(["Home", "Office", "Other"] as const).map((lbl) => (
                            <button
                              key={lbl}
                              type="button"
                              onClick={() => setManualLabel(lbl)}
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-all ${
                                manualLabel === lbl
                                  ? "bg-ink text-cream"
                                  : "border border-ink/15 text-ink/70 hover:border-ink/30"
                              }`}
                            >
                              {lbl}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-ink/70 font-semibold block mb-1">
                            Flat / House / Door No *
                          </label>
                          <Input
                            placeholder="e.g. House No. 42"
                            value={manualHouseNo}
                            onChange={(e) => setManualHouseNo(e.target.value)}
                            required
                            className="h-8 rounded-xl border-ink/15 text-xs bg-frost"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-ink/70 font-semibold block mb-1">
                            Street / Road / Colony *
                          </label>
                          <Input
                            placeholder="e.g. Road No. 4, North Sector"
                            value={manualStreet}
                            onChange={(e) => setManualStreet(e.target.value)}
                            required
                            className="h-8 rounded-xl border-ink/15 text-xs bg-frost"
                          />
                        </div>
                      </div>

                      {/* Select from Popular Patna Service Localities */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-ink/70 font-semibold block">
                          Select Patna Locality / Delivery Area:
                        </label>
                        <select
                          value={manualArea}
                          onChange={(e) => {
                            const found = PATNA_SERVICE_AREAS.find(
                              (a) => a.name === e.target.value,
                            );
                            setManualArea(e.target.value);
                            if (found) setManualPincode(found.pincode);
                          }}
                          className="w-full h-8 rounded-xl border border-ink/20 bg-frost text-xs px-2 focus:outline-none"
                        >
                          {PATNA_SERVICE_AREAS.map((loc) => (
                            <option key={loc.name} value={loc.name}>
                              {loc.name} ({loc.km} km from Kurji Hub -{" "}
                              {loc.km <= 4 ? "Free" : "Beyond 4 km"})
                            </option>
                          ))}
                          <option value="Other Area Across Patna">
                            Other Area Across Patna (Limited Service)
                          </option>
                        </select>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-ink/70 font-semibold block mb-1">
                            Landmark
                          </label>
                          <Input
                            placeholder="e.g. Near Golambar"
                            value={manualLandmark}
                            onChange={(e) => setManualLandmark(e.target.value)}
                            className="h-8 rounded-xl border-ink/15 text-xs bg-frost"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-ink/70 font-semibold block mb-1">
                            City
                          </label>
                          <Input
                            value={manualCity}
                            onChange={(e) => setManualCity(e.target.value)}
                            required
                            className="h-8 rounded-xl border-ink/15 text-xs bg-frost font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-ink/70 font-semibold block mb-1">
                            State
                          </label>
                          <Input
                            value={manualState}
                            onChange={(e) => setManualState(e.target.value)}
                            required
                            className="h-8 rounded-xl border-ink/15 text-xs bg-frost font-semibold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-ink/70 font-semibold block mb-1">
                            Pincode
                          </label>
                          <Input
                            value={manualPincode}
                            onChange={(e) => setManualPincode(e.target.value)}
                            placeholder="800013"
                            required
                            className="h-8 rounded-xl border-ink/15 text-xs bg-frost"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            type="submit"
                            size="sm"
                            className="w-full h-8 rounded-xl bg-ink text-xs text-cream hover:bg-spice"
                          >
                            Save & Select Address
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Saved Addresses List */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-ink/60 font-semibold block">
                      Saved & Selected Addresses:
                    </label>
                    {customerProfile.savedAddresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      const addrDistance = addr.coordinates
                        ? calculateDistanceKm(
                            KITCHEN_HUB.lat,
                            KITCHEN_HUB.lng,
                            addr.coordinates.lat,
                            addr.coordinates.lng,
                          )
                        : 3.0;

                      return (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`cursor-pointer rounded-2xl border p-3 transition-all ${
                            isSelected
                              ? "border-spice bg-spice/5 shadow-sm"
                              : "border-ink/10 bg-white hover:border-ink/20"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold uppercase rounded-md bg-frost px-2 py-0.5 border border-ink/10">
                                {addr.label}
                              </span>
                              <span className="text-xs font-semibold text-ink">{addr.area}</span>
                              <span className="font-mono text-[10px] text-ink/50">
                                ({addrDistance} km from kitchen)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {addrDistance <= 4.0 ? (
                                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  Free Delivery
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                  +Delivery Charge
                                </span>
                              )}
                              {isSelected && (
                                <CheckCircle2 className="size-4 text-spice shrink-0" />
                              )}
                            </div>
                          </div>
                          <p className="mt-1 text-xs text-ink/80">{addr.street}</p>
                          <p className="text-[11px] text-ink/50">
                            {addr.landmark ? `Landmark: ${addr.landmark} · ` : ""}
                            {addr.city}
                            {addr.state ? `, ${addr.state}` : ""} - {addr.pincode}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white border border-ink/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase font-bold text-spice">
                      Self Pickup Hub Counter
                    </span>
                    <Badge className="bg-emerald-600 text-white font-mono text-[9px]">
                      READY IN 15 MINS
                    </Badge>
                  </div>
                  <h4 className="font-display text-sm font-bold text-ink">
                    Anima's Kitchen Patliputra Central Hub #01
                  </h4>
                  <p className="text-xs text-ink/70">
                    Road No. 4, Patliputra Colony, Patna, Bihar - 800013
                  </p>
                  <p className="text-[11px] text-ink/50 font-mono">
                    Counter Incharge: Chef Ramesh · Call: +91 98765 43210
                  </p>
                </div>
              )}
            </div>

            {/* Step 3: Payment Method */}
            <div>
              <label className="font-mono text-xs font-semibold uppercase tracking-wider text-ink/70 block mb-3">
                3. Payment Method
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {/* UPI */}
                <div
                  onClick={() => setPaymentMethod("upi")}
                  className={`cursor-pointer rounded-2xl border p-3 transition-all ${
                    paymentMethod === "upi"
                      ? "border-spice bg-spice/5 shadow-sm"
                      : "border-ink/10 bg-white hover:border-ink/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <QrCode className="size-4 text-spice" />
                    <span className="font-display text-sm text-ink">UPI / QR Code</span>
                  </div>
                  <p className="text-[10px] text-ink/60 mt-1">GPay, PhonePe, Paytm</p>
                </div>

                {/* Card */}
                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`cursor-pointer rounded-2xl border p-3 transition-all ${
                    paymentMethod === "card"
                      ? "border-spice bg-spice/5 shadow-sm"
                      : "border-ink/10 bg-white hover:border-ink/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="size-4 text-indigo-600" />
                    <span className="font-display text-sm text-ink">Debit / Credit Card</span>
                  </div>
                  <p className="text-[10px] text-ink/60 mt-1">Visa, Mastercard, RuPay</p>
                </div>

                {/* Netbanking */}
                <div
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`cursor-pointer rounded-2xl border p-3 transition-all ${
                    paymentMethod === "netbanking"
                      ? "border-spice bg-spice/5 shadow-sm"
                      : "border-ink/10 bg-white hover:border-ink/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building className="size-4 text-amber-600" />
                    <span className="font-display text-sm text-ink">Net Banking</span>
                  </div>
                  <p className="text-[10px] text-ink/60 mt-1">HDFC, ICICI, SBI, Axis</p>
                </div>

                {/* COD */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`cursor-pointer rounded-2xl border p-3 transition-all ${
                    paymentMethod === "cod"
                      ? "border-spice bg-spice/5 shadow-sm"
                      : "border-ink/10 bg-white hover:border-ink/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Banknote className="size-4 text-leaf" />
                    <span className="font-display text-sm text-ink">Cash on Delivery</span>
                  </div>
                  <p className="text-[10px] text-ink/60 mt-1">Pay at delivery</p>
                </div>
              </div>

              {/* DEMO PAYMENT SIMULATION DETAILS */}
              <div className="mt-3.5 rounded-2xl border border-spice/20 bg-cream/40 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-ink/10 pb-2">
                  <div className="flex items-center gap-1.5 text-spice">
                    <Sparkles className="size-3.5" />
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                      Demo Payment Sandbox (Testing Mode)
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-mono text-emerald-800 border-emerald-300 bg-emerald-50">
                    Auto-Verified Demo
                  </Badge>
                </div>

                {paymentMethod === "upi" && (
                  <div className="space-y-2.5">
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-ink/10">
                      {/* Realistic simulated QR Code */}
                      <div className="flex flex-col items-center bg-frost p-2 rounded-lg border border-ink/10 shrink-0">
                        <div className="grid grid-cols-4 gap-1 p-1 bg-white rounded border border-ink/10">
                          <div className="size-4 bg-ink rounded-xs" />
                          <div className="size-4 bg-ink/70 rounded-xs" />
                          <div className="size-4 bg-ink rounded-xs" />
                          <div className="size-4 bg-ink/40 rounded-xs" />
                          <div className="size-4 bg-ink/60 rounded-xs" />
                          <div className="size-4 bg-spice rounded-xs" />
                          <div className="size-4 bg-ink rounded-xs" />
                          <div className="size-4 bg-ink/80 rounded-xs" />
                          <div className="size-4 bg-ink rounded-xs" />
                          <div className="size-4 bg-ink/30 rounded-xs" />
                          <div className="size-4 bg-ink rounded-xs" />
                          <div className="size-4 bg-spice rounded-xs" />
                        </div>
                        <span className="font-mono text-[9px] text-ink/60 mt-1 font-bold">SCAN TO PAY</span>
                      </div>
                      <div className="space-y-1 text-center sm:text-left flex-1">
                        <span className="font-mono text-[10px] uppercase font-bold text-ink/60 block">
                          UPI VPA / Handle:
                        </span>
                        <Input
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@okhdfcbank"
                          className="h-8 rounded-xl border-ink/15 bg-frost text-xs font-mono"
                        />
                        <p className="text-[10px] text-ink/60 mt-1">
                          Scan QR with PhonePe/GPay or confirm with test UPI ID for instant order approval.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="bg-white p-3 rounded-xl border border-ink/10 space-y-2">
                    <span className="font-mono text-[10px] uppercase font-bold text-ink/60 block">
                      Demo Test Card (Pre-filled):
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <Input
                          defaultValue="4242 •••• •••• 4242"
                          readOnly
                          className="h-8 rounded-xl border-ink/15 bg-frost text-xs font-mono"
                        />
                      </div>
                      <div>
                        <Input
                          defaultValue="12/28"
                          readOnly
                          className="h-8 rounded-xl border-ink/15 bg-frost text-xs font-mono text-center"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-emerald-700 font-mono">
                      ✓ Instant mock gateway authentication. Zero real deductions.
                    </p>
                  </div>
                )}

                {paymentMethod === "netbanking" && (
                  <div className="bg-white p-3 rounded-xl border border-ink/10 space-y-1.5">
                    <span className="font-mono text-[10px] uppercase font-bold text-ink/60 block">
                      Popular Supported Banks:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {["HDFC Bank", "State Bank of India", "ICICI Bank", "Axis Bank", "Punjab National Bank"].map((b, i) => (
                        <span
                          key={b}
                          className={`font-mono text-[10px] px-2 py-1 rounded-lg border ${
                            i === 0
                              ? "bg-spice text-cream border-spice font-bold"
                              : "bg-frost text-ink/70 border-ink/10"
                          }`}
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="bg-white p-3 rounded-xl border border-ink/10 space-y-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-leaf block">
                      Cash or QR on Delivery (Doorstep):
                    </span>
                    <p className="text-[11px] text-ink/70 leading-relaxed">
                      Pay cash directly to rider upon arrival or scan their live static QR code at delivery.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right 2 cols: Order Summary & Place Order CTA */}
          <div className="md:col-span-2 flex flex-col justify-between rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
            <div>
              <h4 className="font-display text-lg text-ink border-b border-ink/10 pb-2">
                Order Review
              </h4>

              <div className="mt-3 max-h-40 overflow-y-auto space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-start justify-between text-xs">
                    <div>
                      <span className="font-semibold text-ink">
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      {item.selectedAddons.length > 0 && (
                        <p className="text-[10px] text-ink/60">
                          +{item.selectedAddons.length} extra sides
                        </p>
                      )}
                    </div>
                    <span className="font-mono font-medium text-ink">
                      ₹{item.itemTotal * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Itemized Taxes & Discounts */}
              <div className="mt-4 border-t border-ink/10 pt-3 space-y-1.5 text-xs text-ink/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-ink">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="block font-medium">Delivery Fee</span>
                    <span className="text-[10px] text-ink/60">
                      Free under 4 km · Extra beyond 4 km
                    </span>
                  </div>
                  <span className="font-mono font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE (Under 4km)</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="border-t-2 border-ink pt-2 flex justify-between items-center text-sm font-bold text-ink">
                  <span>Total Payable</span>
                  <span className="font-display text-2xl text-spice font-bold">₹{grandTotal}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {orderType === "delivery" && cartTotal < 250 && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium text-center">
                  ⚠️ Minimum order value is <strong>₹250</strong> for free delivery under 4 km from
                  kitchen location. Extra delivery fee applies beyond 4 km.
                </div>
              )}

              <Button
                disabled={
                  isProcessing ||
                  (!selectedAddress && orderType === "delivery") ||
                  (orderType === "delivery" && cartTotal < 250)
                }
                onClick={handleConfirmOrder}
                className="w-full gap-2 rounded-2xl bg-spice py-3 font-semibold text-cream shadow-xl hover:bg-ink transition-all h-11 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Pay ₹{grandTotal}</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
              <p className="text-[10px] text-center text-ink/50 mt-1">
                Free delivery under 4 km · Minimum order ₹250 · Kurji Kitchen
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
