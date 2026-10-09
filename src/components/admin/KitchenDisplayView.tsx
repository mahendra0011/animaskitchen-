import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ChefHat,
  Clock,
  CheckCircle2,
  Flame,
  PackageCheck,
  AlertCircle,
  Bell,
  Sparkles,
  Zap,
  Printer,
  FileText,
  Filter,
} from "lucide-react";
import type { KitchenStation, KOTTicket } from "@/types/kitchen";

export const KitchenDisplayView: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    deliveryPartners,
    rushHourMode,
    setRushHourMode,
    kotTickets,
    updateKotTicketStatus,
  } = useDemoStore();

  const [selectedStation, setSelectedStation] = useState<string>("all");
  const [selectedKot, setSelectedKot] = useState<KOTTicket | null>(null);

  // Group kitchen orders into 3 columns
  const newOrders = orders.filter((o) => o.status === "placed" || o.status === "confirmed");
  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const readyOrders = orders.filter((o) => o.status === "ready");

  const filterByStation = (ticketList: KOTTicket[]) => {
    if (selectedStation === "all") return ticketList;
    return ticketList.filter((k) => k.station === selectedStation);
  };

  return (
    <div className="min-h-[85vh] bg-[#0d0e12] text-white p-5 sm:p-7 rounded-3xl border border-zinc-800 shadow-2xl space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-md">
            <ChefHat className="size-7" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-white">
                KITCHEN DISPLAY SYSTEM (KDS)
              </h2>
              <span className="inline-flex size-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Live Cooking Station · Brass & Iron Tawa Hub #01 (Indiranagar)
            </p>
          </div>
        </div>

        {/* Controls: Rush Hour Toggle & Counters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Rush Hour Mode Toggle */}
          <button
            onClick={() => setRushHourMode(!rushHourMode)}
            className={`flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all border ${
              rushHourMode
                ? "bg-red-500/20 border-red-500/50 text-red-300 animate-pulse shadow-md"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            <Zap className={`size-4 ${rushHourMode ? "text-red-400 fill-red-400" : ""}`} />
            <span>{rushHourMode ? "RUSH HOUR ACTIVE (+10M)" : "NORMAL RUSH"}</span>
          </button>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-center">
              <span className="text-zinc-500 block text-[9px]">PENDING KOT</span>
              <span className="text-base font-bold text-amber-400">
                {kotTickets.filter((k) => k.status !== "ready").length}
              </span>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-center">
              <span className="text-zinc-500 block text-[9px]">ACTIVE STOVES</span>
              <span className="text-base font-bold text-emerald-400">4 Iron Tawas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Station Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
          <span className="text-zinc-500 font-mono text-[10px] px-2 uppercase">Station:</span>
          {["all", "Tawa Station", "Handi & Curry", "Packing Station"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStation(st)}
              className={`rounded-xl px-3 py-1.5 font-semibold transition-all ${
                selectedStation === st
                  ? "bg-amber-500 text-black font-bold shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {st === "all" ? "All Stations" : st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-amber-400" /> New Orders
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-orange-500" /> Preparing
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-emerald-500" /> Ready
          </span>
        </div>
      </div>

      {/* 3-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Column 1: NEW ORDERS */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-amber-400" />
              <h3 className="font-display text-base tracking-wide text-zinc-200">1. NEW TICKETS</h3>
            </div>
            <Badge className="bg-amber-500/20 text-amber-400 font-mono text-xs">
              {newOrders.length}
            </Badge>
          </div>

          <div className="space-y-3 flex-1 min-h-[320px]">
            {newOrders.length === 0 ? (
              <div className="py-12 text-center text-zinc-600">
                <ChefHat className="size-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-mono">No incoming new tickets</p>
              </div>
            ) : (
              newOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-xl border border-amber-500/30 bg-zinc-900 p-3.5 space-y-2.5 shadow-sm hover:border-amber-500 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-amber-400">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                      <Clock className="size-3" />
                      Just Now
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-zinc-200">
                        <span className="font-medium">
                          {it.quantity}x {it.menuItem.name}
                        </span>
                        {it.selectedAddons?.length > 0 && (
                          <span className="text-[10px] text-amber-300/80 font-mono">
                            +{it.selectedAddons.length} extras
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {order.deliveryInstructions && (
                    <p className="text-[11px] text-amber-300/90 bg-amber-500/10 p-1.5 rounded-lg font-mono">
                      Note: {order.deliveryInstructions}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      onClick={() =>
                        updateOrderStatus(order.id, "preparing", "Chef started cooking on tawa")
                      }
                      className="w-full rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 gap-1.5"
                    >
                      <Flame className="size-3.5 fill-black" />
                      <span>Accept & Fire Stove</span>
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: PREPARING (ON FIRE) */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-orange-500 animate-ping" />
              <h3 className="font-display text-base tracking-wide text-zinc-200">
                2. PREPARING ON STOVE
              </h3>
            </div>
            <Badge className="bg-orange-500/20 text-orange-400 font-mono text-xs">
              {preparingOrders.length}
            </Badge>
          </div>

          <div className="space-y-3 flex-1 min-h-[320px]">
            {preparingOrders.length === 0 ? (
              <div className="py-12 text-center text-zinc-600">
                <Flame className="size-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-mono">Stoves resting / idle</p>
              </div>
            ) : (
              preparingOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-xl border border-orange-500/50 bg-zinc-900 p-3.5 space-y-2.5 shadow-md ring-1 ring-orange-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-sm font-bold text-orange-400">
                        #{order.orderNumber}
                      </span>
                      <Badge className="bg-orange-500/20 text-orange-300 font-mono text-[9px] px-1.5 py-0">
                        COOKING
                      </Badge>
                    </div>
                    <span className="text-[10px] text-orange-300 font-mono flex items-center gap-1 animate-pulse">
                      <Clock className="size-3" />~{rushHourMode ? "20" : "12"} mins
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="border-b border-zinc-800/80 pb-1">
                        <div className="flex justify-between items-center text-zinc-100">
                          <span className="font-bold">
                            {it.quantity}x {it.menuItem.name}
                          </span>
                        </div>
                        {it.selectedAddons?.length > 0 && (
                          <div className="text-[10px] text-zinc-400 pl-2">
                            Add-ons:{" "}
                            {it.selectedAddons
                              .map((a) => `${a.quantity}x ${a.addon.name}`)
                              .join(", ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      onClick={() =>
                        updateOrderStatus(order.id, "ready", "Food packed hot & ready for dispatch")
                      }
                      className="w-full rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 gap-1.5"
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>Mark Ready & Pack</span>
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: READY FOR PICKUP */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-emerald-500" />
              <h3 className="font-display text-base tracking-wide text-zinc-200">
                3. READY FOR PICKUP
              </h3>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 font-mono text-xs">
              {readyOrders.length}
            </Badge>
          </div>

          <div className="space-y-3 flex-1 min-h-[320px]">
            {readyOrders.length === 0 ? (
              <div className="py-12 text-center text-zinc-600">
                <PackageCheck className="size-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-mono">No packed boxes waiting</p>
              </div>
            ) : (
              readyOrders.map((order, i) => {
                const partner = deliveryPartners.find((p) => p.id === order.deliveryPartnerId);
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="rounded-xl border border-emerald-500/40 bg-zinc-900/90 p-3.5 space-y-2.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-emerald-400">
                        #{order.orderNumber}
                      </span>
                      <Badge className="bg-emerald-600 text-white font-mono text-[9px]">
                        SEALED HOT
                      </Badge>
                    </div>

                    <p className="text-xs text-zinc-300">
                      Customer: <strong>{order.customerName}</strong> (
                      {order.orderType === "pickup" ? "Self Pickup" : "Rider Delivery"})
                    </p>

                    <div className="rounded-lg bg-zinc-800/80 p-2 text-[11px] font-mono flex justify-between items-center text-zinc-300">
                      <span>Rider:</span>
                      <strong>{partner?.name || "Assigning Rider..."}</strong>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateOrderStatus(
                          order.id,
                          "picked_up",
                          "Rider picked up food from dispatch hub",
                        )
                      }
                      className="w-full rounded-xl border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 text-xs"
                    >
                      <span>Hand Over Box</span>
                    </Button>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Official Kitchen Order Tickets (KOT) Section */}
      <div className="border-t border-zinc-800 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-amber-400" />
            <h3 className="font-display text-lg text-white">
              KOT — Kitchen Order Tickets ({kotTickets.length})
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Auto-generated KOT printed per preparation station
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filterByStation(kotTickets).map((kot, idx) => (
            <motion.div
              key={kot.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedKot(kot)}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 cursor-pointer hover:border-amber-500/50 hover:bg-zinc-900 transition-colors font-mono text-xs space-y-2.5"
            >
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="font-bold text-amber-400">#{kot.orderNumber}</span>
                <Badge
                  className={`text-[9px] uppercase ${
                    kot.status === "preparing"
                      ? "bg-amber-500 text-black font-bold"
                      : kot.status === "ready"
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  {kot.status}
                </Badge>
              </div>

              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Station:</span>
                <strong className="text-zinc-200">{kot.station}</strong>
              </div>

              <div className="space-y-1">
                {kot.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-zinc-200">
                    <span>
                      {it.quantity}x {it.name}
                    </span>
                  </div>
                ))}
              </div>

              {kot.notes && (
                <p className="text-[10px] text-amber-300/80 bg-zinc-800 p-1.5 rounded truncate">
                  {kot.notes}
                </p>
              )}

              <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-1 border-t border-zinc-800">
                <span>{kot.createdAt}</span>
                <span className="text-amber-400 hover:underline">View KOT Slip →</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* KOT Detailed Slip Modal */}
      {selectedKot && (
        <Dialog open={!!selectedKot} onOpenChange={(open) => !open && setSelectedKot(null)}>
          <DialogContent className="max-w-md bg-white text-zinc-900 font-mono p-6 rounded-3xl border-2 border-zinc-900 shadow-2xl">
            <div className="text-center border-b-2 border-dashed border-zinc-300 pb-4 space-y-1">
              <h2 className="font-display text-2xl tracking-tight text-zinc-900">
                ANIMA'S KITCHEN
              </h2>
              <p className="text-xs uppercase font-bold text-zinc-500">
                KITCHEN ORDER TICKET (KOT)
              </p>
              <p className="text-[11px] text-zinc-600">Hub: Indiranagar 100ft Station</p>
            </div>

            <div className="py-3 border-b-2 border-dashed border-zinc-300 text-xs space-y-1">
              <div className="flex justify-between">
                <span>Order No:</span>
                <strong>#{selectedKot.orderNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span>Station:</span>
                <strong>{selectedKot.station}</strong>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>{selectedKot.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span>Priority:</span>
                <strong>{selectedKot.isPriority ? "HIGH PRIORITY" : "STANDARD"}</strong>
              </div>
            </div>

            <div className="py-4 space-y-2 border-b-2 border-dashed border-zinc-300 text-xs">
              <p className="font-bold uppercase text-[10px] text-zinc-500">Items to Prepare:</p>
              {selectedKot.items.map((it, idx) => (
                <div key={idx} className="flex justify-between font-bold">
                  <span>
                    {it.quantity} x {it.name}
                  </span>
                  {it.notes && <span className="text-[10px] text-red-600">({it.notes})</span>}
                </div>
              ))}
            </div>

            {selectedKot.notes && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong>Chef Note:</strong> {selectedKot.notes}
              </div>
            )}

            <div className="pt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 rounded-xl border-zinc-300 text-xs font-bold gap-1.5"
              >
                <Printer className="size-3.5" />
                <span>Print KOT</span>
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  updateKotTicketStatus(selectedKot.id, "ready");
                  setSelectedKot(null);
                }}
                className="flex-1 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
              >
                Mark Ready
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
