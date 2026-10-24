import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { LiveMapCanvas } from "./LiveMapCanvas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Star,
  ChefHat,
  Bike,
  Check,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  HelpCircle,
  Receipt,
  FileText,
  Download,
} from "lucide-react";
import type { OrderStatus } from "@/types/kitchen";
import { OrderInvoiceModal } from "./OrderInvoiceModal";

export const LiveTrackingView: React.FC = () => {
  const {
    activeOrder,
    setTrackingViewOpen,
    setCustomerPage,
    advanceDeliveryStep,
    updateOrderStatus,
    submitOrderReview,
    setActiveRole,
    isAuthenticated,
    currentUser,
    setAuthModalOpen,
    setAuthModalTab,
  } = useDemoStore();

  const handleBackToMenu = () => {
    setTrackingViewOpen(false);
    setCustomerPage("menu");
  };

  const [ratingInput, setRatingInput] = useState(5);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  if (!activeOrder) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-20 text-center text-ink">
        <p className="font-display text-2xl">No Active Order Found</p>
        <p className="text-xs text-ink/60 mt-1">Please place an order from our fresh menu.</p>
        <Button
          onClick={handleBackToMenu}
          className="mt-4 rounded-full bg-spice text-cream"
        >
          Return to Menu
        </Button>
      </div>
    );
  }

  const steps: Array<{ status: OrderStatus; label: string; sub: string }> = [
    { status: "placed", label: "Order Placed", sub: "Payment verified" },
    { status: "confirmed", label: "Confirmed", sub: "Kitchen accepted ticket" },
    { status: "preparing", label: "Cooking", sub: "Tawa & handi on fire" },
    { status: "ready", label: "Packed & Sealed", sub: "Insulated hot box" },
    { status: "picked_up", label: "Picked Up", sub: "Rider at hub" },
    { status: "out_for_delivery", label: "On the Way", sub: "Live GPS route" },
    { status: "delivered", label: "Delivered", sub: "OTP verified" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.status === activeOrder.status);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitOrderReview(activeOrder.id, ratingInput, feedbackInput);
    setHasSubmittedReview(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 text-ink">
      {/* Top Banner Navigation */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={handleBackToMenu}
              className="text-xs font-mono font-bold text-spice hover:underline flex items-center gap-1"
            >
              ← Back to Menu
            </button>
            {currentUser?.role === "admin" && (
              <>
                <span className="text-ink/30">•</span>
                <button
                  onClick={() => {
                    setTrackingViewOpen(false);
                    setActiveRole("admin");
                  }}
                  className="text-xs font-mono font-bold text-ink/60 hover:text-ink hover:underline"
                >
                  Return to Admin Orders
                </button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
              LIVE ORDER TRACKING
            </h1>
            <Badge className="bg-ink text-cream font-mono text-xs">
              #{activeOrder.orderNumber}
            </Badge>
          </div>
        </div>

        {/* Presentation Fast-Forward Button & Bill Button */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInvoiceModal(true)}
            className="rounded-full border-ink/20 bg-white text-xs font-semibold text-ink hover:border-spice hover:text-spice gap-1.5 shadow-sm"
          >
            <Receipt className="size-3.5 text-spice" />
            <span>Download Bill / Receipt</span>
          </Button>

          {activeOrder.status !== "delivered" && (
            <Button
              size="sm"
              onClick={() => advanceDeliveryStep(activeOrder.id)}
              className="rounded-full bg-spice text-cream text-xs font-semibold hover:bg-ink gap-1.5 shadow-sm"
            >
              <span>Simulate Next Step</span>
              <ChevronRight className="size-3.5" />
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isAuthenticated && currentUser?.role === "rider") {
                setActiveRole("rider");
              } else {
                setAuthModalTab("login");
                setAuthModalOpen(true);
              }
            }}
            className="rounded-full border-ink/15 text-xs text-ink hover:border-spice"
          >
            Rider Login 🛵
          </Button>
        </div>
      </div>

      {/* 7-Step Status Stepper Bar */}
      <div className="mb-8 rounded-3xl border border-ink/10 bg-frost/90 p-5 shadow-sm backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-spice tracking-wider">
              ORDER LIFECYCLE
            </span>
            <h3 className="font-display text-xl text-ink">{steps[activeIndex]?.label}</h3>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 font-mono text-xs font-bold text-ink border border-ink/10">
            <Clock className="size-3.5 text-spice" />
            <span>ETA: {activeOrder.estimatedDeliveryMinutes} mins</span>
          </div>
        </div>

        {/* Stepper Dots & Line */}
        <div className="relative">
          {/* Background Gray Line */}
          <div className="absolute top-4 left-4 right-4 h-1 bg-ink/10 -translate-y-1/2 z-0" />
          {/* Active Colored Line */}
          <div
            className="absolute top-4 left-4 h-1 bg-spice -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          />

          <div className="relative z-10 flex justify-between">
            {steps.map((step, idx) => {
              const isCompleted = idx <= activeIndex;
              const isCurrent = idx === activeIndex;
              return (
                <div key={step.status} className="flex flex-col items-center">
                  <div
                    className={`grid size-8 place-items-center rounded-full border-2 transition-all ${
                      isCompleted
                        ? "border-spice bg-spice text-cream shadow-md"
                        : "border-ink/20 bg-frost text-ink/40"
                    } ${isCurrent ? "ring-4 ring-spice/20 scale-110" : ""}`}
                  >
                    {isCompleted ? (
                      <Check className="size-4 stroke-[3]" />
                    ) : (
                      <span className="font-mono text-[10px] font-bold">{idx + 1}</span>
                    )}
                  </div>
                  <span
                    className={`mt-2 hidden sm:block text-center font-display text-[11px] max-w-[70px] leading-tight ${
                      isCurrent ? "text-spice font-bold" : "text-ink/70"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Live Map + Order Details Card */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left 7 cols: Interactive Visual Map */}
        <div className="lg:col-span-7 space-y-6">
          <LiveMapCanvas order={activeOrder} />

          {/* Timeline Audit Logs */}
          <div className="rounded-3xl border border-ink/10 bg-frost p-5 shadow-sm">
            <h4 className="font-display text-base text-ink mb-3">Live Order Activity</h4>
            <div className="space-y-2.5">
              {activeOrder.timeline.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <span className="font-mono text-[10px] text-ink/50 whitespace-nowrap mt-0.5">
                    {event.timestamp}
                  </span>
                  <span className="size-2 rounded-full bg-spice mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-ink">{event.label}</strong>
                    <p className="text-ink/60 text-[11px]">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 cols: Order Items & Delivery Summary */}
        <div className="lg:col-span-5 space-y-6">
          {/* Delivered Celebration & Review Card if delivered */}
          {activeOrder.status === "delivered" && (
            <div className="overflow-hidden rounded-3xl border border-emerald-600/30 bg-emerald-600/10 p-5 shadow-md">
              <div className="flex items-center gap-2 text-emerald-800 font-display text-xl">
                <CheckCircle2 className="size-6 text-emerald-700" />
                <span>Order Delivered!</span>
              </div>
              <p className="mt-1 text-xs text-emerald-800/80">
                Hope you enjoy your steaming homemade meal from Anima's Kitchen!
              </p>

              {!hasSubmittedReview ? (
                <form onSubmit={handleReviewSubmit} className="mt-4 space-y-3">
                  <div>
                    <label className="font-mono text-[10px] uppercase font-bold text-emerald-900 block mb-1">
                      Rate your food & delivery:
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingInput(star)}
                          className="text-amber-500 hover:scale-125 transition-transform"
                        >
                          <Star
                            className={`size-6 ${
                              star <= ratingInput ? "fill-amber-500" : "fill-transparent"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <Input
                    placeholder="Tell Anima's Kitchen what you loved..."
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    className="h-8 rounded-xl border-emerald-600/30 bg-frost text-xs"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="w-full rounded-full bg-emerald-700 text-cream text-xs hover:bg-emerald-800"
                  >
                    Submit Review
                  </Button>
                </form>
              ) : (
                <p className="mt-3 font-mono text-xs font-semibold text-emerald-800">
                  ✓ Review submitted! Thank you for supporting our kitchen.
                </p>
              )}
            </div>
          )}

          {/* Delivery Details Card */}
          <div className="rounded-3xl border border-ink/10 bg-frost p-5 shadow-sm">
            <h4 className="font-display text-lg text-ink border-b border-ink/10 pb-2">
              Delivery Information
            </h4>
            <div className="mt-3 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="size-4 text-spice shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink">
                    {activeOrder.deliveryAddress.contactName} ({activeOrder.deliveryAddress.label})
                  </strong>
                  <p className="text-ink/70">{activeOrder.deliveryAddress.street}</p>
                  <p className="text-ink/50 text-[11px]">
                    {activeOrder.deliveryAddress.area}, {activeOrder.deliveryAddress.city} -{" "}
                    {activeOrder.deliveryAddress.pincode}
                  </p>
                </div>
              </div>

              {activeOrder.deliveryInstructions && (
                <div className="rounded-xl bg-cream/70 p-2.5 border border-ink/5">
                  <span className="font-mono text-[10px] text-ink/50 block">Instructions:</span>
                  <p className="text-ink/80 text-[11px] italic">
                    "{activeOrder.deliveryInstructions}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Items Summary Card */}
          <div className="rounded-3xl border border-ink/10 bg-frost p-5 shadow-sm">
            <h4 className="font-display text-lg text-ink border-b border-ink/10 pb-2">
              Items Ordered
            </h4>

            <div className="mt-3 space-y-3">
              {activeOrder.items.map((item) => (
                <div key={item.id} className="text-xs border-b border-ink/5 pb-2 last:border-0">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-ink">
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    <span className="font-mono font-medium text-ink">
                      ₹{item.itemTotal * item.quantity}
                    </span>
                  </div>

                  {item.selectedAddons && item.selectedAddons.length > 0 && (
                    <div className="mt-1 pl-3 space-y-0.5 text-[11px] text-ink/60">
                      {item.selectedAddons.map((addon) => (
                        <div key={addon.addon.id} className="flex justify-between">
                          <span>
                            + {addon.quantity}x {addon.addon.name}
                          </span>
                          <span className="font-mono">₹{addon.addon.price * addon.quantity}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-ink/10 pt-3 space-y-2 text-xs text-ink/70">
              <div className="flex justify-between">
                <span>Payment</span>
                <span className="uppercase font-mono font-semibold text-ink">
                  {activeOrder.paymentMethod} ({activeOrder.paymentStatus})
                </span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-ink pt-1">
                <span>Final Paid</span>
                <span className="font-display text-xl text-spice">₹{activeOrder.finalTotal}</span>
              </div>

              <Button
                onClick={() => setShowInvoiceModal(true)}
                className="w-full mt-2 rounded-2xl bg-ink hover:bg-spice text-cream text-xs font-semibold py-2.5 gap-2 shadow-sm transition-all"
              >
                <Download className="size-3.5" />
                <span>View & Download Tax Bill (Invoice)</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Invoice / Bill Download Modal */}
      <OrderInvoiceModal
        order={activeOrder}
        open={showInvoiceModal}
        onOpenChange={setShowInvoiceModal}
      />
    </div>
  );
};
