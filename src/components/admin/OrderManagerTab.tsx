import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Bike,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  Sparkles,
  Utensils,
  Eye,
  Filter,
} from "lucide-react";
import type { Order, OrderStatus } from "@/types/kitchen";

export const OrderManagerTab: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    assignDeliveryPartner,
    cancelOrder,
    deliveryPartners,
    setActiveOrderId,
    setTrackingViewOpen,
    setActiveRole,
  } = useDemoStore();

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = filterStatus === "all" || ord.status === filterStatus;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customerPhone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "placed":
      case "confirmed":
        return "bg-amber-500/10 text-amber-800 border-amber-500/20";
      case "preparing":
        return "bg-orange-500/10 text-orange-800 border-orange-500/20";
      case "ready":
      case "picked_up":
        return "bg-blue-500/10 text-blue-800 border-blue-500/20";
      case "out_for_delivery":
        return "bg-emerald-600/10 text-emerald-800 border-emerald-600/20";
      case "delivered":
        return "bg-green-700/10 text-green-900 border-green-700/20";
      case "cancelled":
        return "bg-red-600/10 text-red-800 border-red-600/20";
    }
  };

  return (
    <div className="space-y-6 text-ink">
      {/* Top Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {(["all", "placed", "preparing", "ready", "out_for_delivery", "delivered"] as const).map(
            (st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${
                  filterStatus === st
                    ? "bg-ink text-cream shadow-sm"
                    : "border border-ink/15 bg-frost text-ink/70 hover:bg-cream"
                }`}
              >
                {st.replace(/_/g, " ")}
              </button>
            ),
          )}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-ink/40" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order or customer..."
            className="h-8 rounded-full border-ink/15 bg-frost pl-9 text-xs"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-3xl border border-ink/10 bg-frost shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-ink/10 bg-cream/70 font-mono uppercase text-ink/60">
              <tr>
                <th className="p-4">Order Details</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Dishes & Addons</th>
                <th className="p-4">Amount & Mode</th>
                <th className="p-4">Assigned Rider</th>
                <th className="p-4">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredOrders.map((ord) => {
                const assignedPartner = deliveryPartners.find(
                  (p) => p.id === ord.deliveryPartnerId,
                );

                return (
                  <tr key={ord.id} className="hover:bg-cream/40 transition-colors">
                    {/* Order Details */}
                    <td className="p-4">
                      <span className="font-mono text-sm font-bold text-ink block">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-[10px] text-ink/50 font-mono">
                        {new Date(ord.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="mt-1 block font-mono text-[9px] font-bold text-spice">
                        OTP: {ord.deliveryOtp}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <strong className="text-ink block">{ord.customerName}</strong>
                      <span className="text-[11px] text-ink/60 font-mono">{ord.customerPhone}</span>
                      <span className="text-[10px] text-ink/50 block">
                        {ord.deliveryAddress.label} · {ord.deliveryAddress.area}
                      </span>
                    </td>

                    {/* Dishes & Addons */}
                    <td className="p-4 max-w-[220px]">
                      <div className="space-y-1">
                        {ord.items.map((it) => (
                          <div key={it.id}>
                            <span className="font-medium text-ink">
                              {it.quantity}x {it.menuItem.name}
                            </span>
                            {it.selectedAddons.length > 0 && (
                              <p className="text-[10px] text-spice font-medium">
                                +{it.selectedAddons.map((a) => a.addon.name).join(", ")}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Amount & Mode */}
                    <td className="p-4">
                      <span className="font-display text-base text-ink block">
                        ₹{ord.finalTotal}
                      </span>
                      <Badge variant="outline" className="text-[10px] uppercase font-mono mt-0.5">
                        {ord.paymentMethod} · {ord.paymentStatus}
                      </Badge>
                    </td>

                    {/* Assigned Rider Dropdown */}
                    <td className="p-4">
                      <select
                        value={ord.deliveryPartnerId || ""}
                        onChange={(e) => assignDeliveryPartner(ord.id, e.target.value)}
                        className="rounded-xl border border-ink/15 bg-cream/70 px-2 py-1 text-xs text-ink font-medium focus:ring-1 focus:ring-spice"
                      >
                        <option value="">-- Assign Rider --</option>
                        {deliveryPartners.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.vehicle.type})
                          </option>
                        ))}
                      </select>
                      {assignedPartner && (
                        <span className="text-[10px] text-ink/50 block mt-1">
                          {assignedPartner.vehicle.plateNumber}
                        </span>
                      )}
                    </td>

                    {/* Status & Actions */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-center text-[10px] font-bold uppercase tracking-wider ${getStatusColor(
                            ord.status,
                          )}`}
                        >
                          {ord.status.replace(/_/g, " ")}
                        </span>

                        <div className="flex items-center gap-1">
                          {ord.status === "placed" && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(ord.id, "confirmed")}
                              className="h-6 rounded-full bg-ink px-2 text-[10px] text-cream hover:bg-spice"
                            >
                              Confirm
                            </Button>
                          )}
                          {ord.status === "confirmed" && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(ord.id, "preparing")}
                              className="h-6 rounded-full bg-amber-600 px-2 text-[10px] text-cream hover:bg-amber-700"
                            >
                              Cook
                            </Button>
                          )}
                          {ord.status === "preparing" && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(ord.id, "ready")}
                              className="h-6 rounded-full bg-emerald-600 px-2 text-[10px] text-cream hover:bg-emerald-700"
                            >
                              Ready
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setActiveOrderId(ord.id);
                              setActiveRole("customer");
                              setTrackingViewOpen(true);
                            }}
                            className="h-6 text-[10px] text-ink/70 hover:text-spice px-1"
                            title="Live GPS Map view"
                          >
                            <Eye className="size-3" />
                          </Button>

                          {ord.status !== "delivered" && ord.status !== "cancelled" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => cancelOrder(ord.id)}
                              className="h-6 text-[10px] text-red-600 hover:bg-red-50 px-1"
                              title="Cancel order"
                            >
                              <XCircle className="size-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
