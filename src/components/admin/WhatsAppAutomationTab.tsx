import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { WhatsAppLog } from "@/types/kitchen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Send,
  CheckCheck,
  Smartphone,
  Sparkles,
  CheckCircle2,
  Clock,
  Radio,
  FileText,
} from "lucide-react";

export const WhatsAppAutomationTab: React.FC = () => {
  const { whatsappLogs, triggerWhatsAppSimulatedMessage } = useDemoStore();
  const [selectedEvent, setSelectedEvent] = useState<WhatsAppLog["event"]>("order_confirmed");
  const [customPhone, setCustomPhone] = useState<string>("9876543210");
  const [customMessage, setCustomMessage] = useState<string>(
    "🍱 Your hot Dal Tadka Thali order #AK-8491 has been accepted by Anima's Central Kitchen! Estimated delivery: 24 mins.",
  );
  const [sentAlert, setSentAlert] = useState<string | null>(null);

  const handleSendSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim()) return;
    triggerWhatsAppSimulatedMessage(selectedEvent, customMessage);
    setSentAlert(`Simulated WhatsApp message sent to +91 ${customPhone}!`);
    setTimeout(() => setSentAlert(null), 3000);
  };

  const templates = [
    {
      name: "order_confirmed_v2",
      event: "order_confirmed",
      title: "Order Confirmed & Payment Received",
      preview:
        "🍱 Namaste {{1}}! We have received your order {{2}} of ₹{{3}}. Our chefs are preparing your authentic meal.",
    },
    {
      name: "food_in_stove_v1",
      event: "preparing",
      title: "Live Kitchen Stove Alert",
      preview:
        "🔥 Fresh & Hot! Your thali is now on the stove at Indiranagar Hub Station #2. Preparing with pure desi ghee.",
    },
    {
      name: "rider_dispatched_otp_v3",
      event: "out_for_delivery",
      title: "Rider Out For Delivery + OTP",
      preview:
        "🛵 Delivery partner {{1}} is on the way with your food! Your 4-digit delivery security PIN is {{2}}.",
    },
    {
      name: "meal_delivered_csat_v1",
      event: "delivered",
      title: "Order Delivered + Review Request",
      preview:
        "✅ Hope you loved your meal! Rate your experience with Anima's Kitchen and get 50 bonus loyalty points.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              WhatsApp Engine
            </span>
            <Radio className="size-4 text-emerald-600 animate-pulse" />
          </div>
          <p className="mt-2 font-display text-2xl text-emerald-700 font-bold">Cloud API Live</p>
          <span className="text-[10px] text-ink/60 mt-0.5 block">
            Meta Verified Business Account
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Messages Dispatched
            </span>
            <MessageSquare className="size-4 text-spice" />
          </div>
          <p className="mt-2 font-display text-2xl text-spice font-bold">
            {whatsappLogs.length + 1420} Sent
          </p>
          <span className="text-[10px] text-ink/60 mt-0.5 block">99.8% delivery success rate</span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Customer Open Rate
            </span>
            <CheckCheck className="size-4 text-blue-600" />
          </div>
          <p className="mt-2 font-display text-2xl text-blue-700 font-bold">94.2%</p>
          <span className="text-[10px] text-blue-800/80 font-medium mt-0.5 block">
            3x higher engagement vs SMS
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Active Meta Templates
            </span>
            <FileText className="size-4 text-ink/40" />
          </div>
          <p className="mt-2 font-display text-2xl text-ink font-bold">6 Templates</p>
          <span className="text-[10px] text-ink/60 mt-0.5 block">
            Pre-approved utility notifications
          </span>
        </div>
      </div>

      {sentAlert && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{sentAlert}</span>
        </div>
      )}

      {/* Main Grid: Live Feed & Simulator Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live WhatsApp Log Feed */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-ink/10 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-ink/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <MessageSquare className="size-4" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-ink">
                  Live WhatsApp Outbox Stream
                </h3>
                <p className="text-xs text-ink/60">
                  Real-time trigger logs on customer order progression
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-mono text-[9px]">
              {whatsappLogs.length} LOGGED
            </Badge>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {whatsappLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-frost border border-ink/10 space-y-2 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="capitalize font-bold text-xs text-ink">
                      {log.recipientName}
                    </span>
                    <span className="text-[10px] font-mono text-ink/50">
                      +91 {log.recipientPhone}
                    </span>
                    <Badge variant="outline" className="text-[9px] font-mono bg-white">
                      {log.event.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-[10px] font-mono text-ink/40">
                    {new Date(log.timestamp).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-950 text-xs font-sans leading-relaxed border border-emerald-200/70">
                  {log.message}
                </div>

                <div className="flex items-center justify-end gap-1 text-[10px] font-mono text-emerald-700 font-medium">
                  <CheckCheck className="size-3 text-emerald-600" />
                  <span>Delivered & Read</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Dispatch Simulator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-ink/10 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-ink/10 pb-3">
              <Sparkles className="size-4 text-spice" />
              <div>
                <h3 className="font-display text-base font-bold text-ink">
                  Dispatch Test Simulator
                </h3>
                <p className="text-xs text-ink/60">
                  Trigger instant WhatsApp message to customer device
                </p>
              </div>
            </div>

            <form onSubmit={handleSendSimulation} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Lifecycle Event</label>
                <select
                  value={selectedEvent}
                  onChange={(e) => {
                    const evt = e.target.value as WhatsAppLog["event"];
                    setSelectedEvent(evt);
                    if (evt === "order_confirmed") {
                      setCustomMessage(
                        "🍱 Namaste Rahul! Your order #AK-8491 is confirmed. Our kitchen is preparing your authentic thali now.",
                      );
                    } else if (evt === "preparing") {
                      setCustomMessage(
                        "🔥 Food in Stove! Chef Ramesh is cooking your Dal Tadka Thali with pure desi ghee.",
                      );
                    } else if (evt === "out_for_delivery") {
                      setCustomMessage(
                        "🛵 Delivery partner Rajesh is on his way! Share OTP 4821 with him upon arrival.",
                      );
                    } else if (evt === "delivered") {
                      setCustomMessage(
                        "✅ Your meal has been delivered! We hope you loved it. Tap here to rate our chef & get ₹20 wallet credit.",
                      );
                    }
                  }}
                  className="w-full text-xs rounded-xl border border-ink/20 bg-white p-2.5 focus:outline-none font-medium"
                >
                  <option value="order_confirmed">Order Confirmed</option>
                  <option value="preparing">Food in Stove (Preparing)</option>
                  <option value="out_for_delivery">Out for Delivery (with OTP)</option>
                  <option value="delivered">Order Delivered</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Customer Phone</label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-ink/60">+91</span>
                  <Input
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    className="text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Message Body</label>
                <textarea
                  rows={4}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full rounded-xl border border-ink/20 p-2.5 text-xs text-ink focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-2 shadow-md h-10"
              >
                <Send className="size-3.5" />
                <span>Trigger WhatsApp Message</span>
              </Button>
            </form>
          </div>

          {/* Meta Pre-Approved Template Previews */}
          <div className="bg-white rounded-3xl border border-ink/10 p-5 shadow-sm space-y-3">
            <h4 className="font-display text-sm font-bold text-ink">
              Registered Meta WhatsApp Templates
            </h4>
            <div className="space-y-2.5">
              {templates.map((tpl) => (
                <div
                  key={tpl.name}
                  onClick={() => {
                    setSelectedEvent(tpl.event as any);
                    setCustomMessage(tpl.preview);
                  }}
                  className="p-3 rounded-2xl bg-frost border border-ink/10 hover:border-emerald-300 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink">{tpl.title}</span>
                    <span className="text-[9px] font-mono text-emerald-700 font-bold">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-[11px] text-ink/70 line-clamp-2 leading-relaxed font-mono">
                    {tpl.preview}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
