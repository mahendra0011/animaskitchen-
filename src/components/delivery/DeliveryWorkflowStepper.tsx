import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Bike,
  Utensils,
  MapPin,
  CheckCircle2,
  Navigation,
  Key,
  ShieldCheck,
  Sparkles,
  Phone,
  ChevronRight,
  PackageCheck,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import type { Order } from "@/types/kitchen";

interface DeliveryWorkflowStepperProps {
  order: Order;
}

export const DeliveryWorkflowStepper: React.FC<DeliveryWorkflowStepperProps> = ({ order }) => {
  const { advanceDeliveryStep, verifyDeliveryOtp } = useDemoStore();
  const [enteredOtp, setEnteredOtp] = useState("");

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp.trim()) return;
    verifyDeliveryOtp(order.id, enteredOtp);
  };

  const step = order.currentDeliveryStep;

  return (
    <div className="rounded-3xl border border-ink/10 bg-frost p-5 shadow-sm text-ink space-y-5">
      {/* Top Banner Status */}
      <div className="flex items-center justify-between border-b border-ink/10 pb-4">
        <div>
          <span className="font-mono text-[10px] uppercase font-bold text-emerald-700 block">
            ACTIVE TASK · ORDER #{order.orderNumber}
          </span>
          <h3 className="font-display text-xl text-ink">
            {step === "assigned" && "New Delivery Assigned"}
            {step === "accepted" && "Navigate to Kitchen Hub"}
            {step === "arrived_at_kitchen" && "At Kitchen · Waiting for Handover"}
            {step === "picked_up" && "Order Collected · Ready to Dispatch"}
            {step === "out_for_delivery" && "En Route to Customer"}
            {step === "reached_customer" && "At Doorstep · Awaiting OTP"}
            {step === "otp_verified" && "OTP Verified Successfully"}
            {step === "delivered" && "Delivered Successfully!"}
          </h3>
        </div>

        <Badge className="bg-emerald-600 text-cream font-mono text-xs capitalize">
          {step.replace(/_/g, " ")}
        </Badge>
      </div>

      {/* Dynamic Action Trigger based on current step */}
      <div className="rounded-2xl border border-ink/10 bg-cream/50 p-4">
        {step === "assigned" && (
          <div className="space-y-3">
            <p className="text-xs text-ink/70">
              You have been selected for this order based on proximity (0.8 km from hub).
            </p>
            <Button
              onClick={() => advanceDeliveryStep(order.id)}
              className="w-full rounded-full bg-emerald-600 py-3 font-semibold text-cream shadow-md hover:bg-emerald-700"
            >
              <CheckCircle2 className="size-4 mr-1.5" />
              <span>Accept Order</span>
            </Button>
          </div>
        )}

        {step === "accepted" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-xs text-ink/80">
              <Utensils className="size-4 text-spice" />
              <span>Drive to Anima's Kitchen Hub (Indiranagar 100ft Road)</span>
            </div>
            <Button
              onClick={() => advanceDeliveryStep(order.id)}
              className="w-full rounded-full bg-ink py-3 font-semibold text-cream shadow-md hover:bg-spice"
            >
              <Navigation className="size-4 mr-1.5" />
              <span>I Have Arrived at Kitchen Hub</span>
            </Button>
          </div>
        )}

        {step === "arrived_at_kitchen" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-ink/80">
              <span>
                Show ticket <strong>#{order.orderNumber}</strong> to chef
              </span>
              <span className="font-mono text-spice font-bold">2 Boxes</span>
            </div>
            <Button
              onClick={() => advanceDeliveryStep(order.id)}
              className="w-full rounded-full bg-spice py-3 font-semibold text-cream shadow-md hover:bg-ink"
            >
              <PackageCheck className="size-4 mr-1.5" />
              <span>Confirm Pickup & Hot Seal Verified</span>
            </Button>
          </div>
        )}

        {step === "picked_up" && (
          <div className="space-y-3">
            <p className="text-xs text-ink/70">
              Insulated bag secured. Start navigation towards customer destination.
            </p>
            <Button
              onClick={() => advanceDeliveryStep(order.id)}
              className="w-full rounded-full bg-emerald-600 py-3 font-semibold text-cream shadow-md hover:bg-emerald-700"
            >
              <Bike className="size-4 mr-1.5" />
              <span>Start Delivery Navigation</span>
            </Button>
          </div>
        )}

        {step === "out_for_delivery" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-ink/80">
              <span className="flex items-center gap-1.5">
                <Navigation className="size-3.5 text-emerald-700 animate-spin" />
                Live GPS Active (2.4 km)
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`tel:${order.customerPhone}`)}
                className="h-7 text-xs border-ink/15 text-ink"
              >
                <Phone className="size-3 mr-1" />
                Call Customer
              </Button>
            </div>
            <Button
              onClick={() => advanceDeliveryStep(order.id)}
              className="w-full rounded-full bg-ink py-3 font-semibold text-cream shadow-md hover:bg-spice"
            >
              <MapPin className="size-4 mr-1.5" />
              <span>Reached Customer Doorstep</span>
            </Button>
          </div>
        )}

        {(step === "reached_customer" || step === "otp_verified") && (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-ink flex items-center gap-1.5">
                <Key className="size-3.5 text-spice" />
                Enter Customer Delivery OTP:
              </span>
              <span className="text-[10px] text-ink/50">(Customer OTP: {order.deliveryOtp})</span>
            </div>

            <div className="flex gap-2">
              <Input
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                placeholder="4-digit OTP (e.g. 4826)"
                maxLength={4}
                required
                className="rounded-2xl border-ink/20 font-mono text-base tracking-widest text-center font-bold bg-frost"
              />
              <Button
                type="submit"
                className="rounded-2xl bg-emerald-600 px-5 font-semibold text-cream hover:bg-emerald-700"
              >
                Verify & Deliver
              </Button>
            </div>
          </form>
        )}

        {step === "delivered" && (
          <div className="space-y-2 text-center py-2">
            <span className="grid size-12 place-items-center rounded-full bg-emerald-600/15 text-emerald-700 mx-auto">
              <CheckCircle2 className="size-7" />
            </span>
            <p className="font-display text-xl text-ink">Order Completed!</p>
            <p className="font-mono text-xs font-semibold text-emerald-700">
              ₹65 Credited to your Partner Wallet
            </p>
          </div>
        )}
      </div>

      {/* Customer & Address Details */}
      <div className="rounded-2xl border border-ink/10 bg-frost p-4 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <strong className="text-ink text-sm">
            {order.deliveryAddress.contactName} ({order.deliveryAddress.label})
          </strong>
          <span className="font-mono text-ink/60">{order.customerPhone}</span>
        </div>
        <p className="text-ink/70">{order.deliveryAddress.street}</p>
        <p className="text-ink/50 text-[11px]">
          {order.deliveryAddress.area}, {order.deliveryAddress.city} -{" "}
          {order.deliveryAddress.pincode}
        </p>
        {order.deliveryInstructions && (
          <div className="rounded-lg bg-cream/60 p-2 text-[11px] text-ink/80 italic border border-ink/5">
            Note: "{order.deliveryInstructions}"
          </div>
        )}
      </div>
    </div>
  );
};
