import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { SupportTicket, TicketIssueType } from "@/types/kitchen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LifeBuoy,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Gift,
  ArrowRight,
  Filter,
  MessageSquare,
} from "lucide-react";

export const SupportTicketsTab: React.FC = () => {
  const {
    supportTickets,
    updateSupportTicketStatus,
    addWalletMoney,
    triggerWhatsAppSimulatedMessage,
  } = useDemoStore();

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredTickets = supportTickets.filter((t) => {
    if (filterStatus === "all") return true;
    return t.status === filterStatus;
  });

  const openCount = supportTickets.filter((t) => t.status === "open").length;
  const inProgressCount = supportTickets.filter((t) => t.status === "in_progress").length;
  const resolvedCount = supportTickets.filter((t) => t.status === "resolved").length;

  const handleResolveWithWalletCredit = (ticket: SupportTicket, creditAmount: number = 50) => {
    updateSupportTicketStatus(ticket.id, "resolved");
    addWalletMoney(creditAmount);
    triggerWhatsAppSimulatedMessage(
      "delivered",
      `Hello ${ticket.customerName}, your grievance #${ticket.ticketNumber} regarding order ${ticket.orderNumber} has been resolved. We have credited ₹${creditAmount} to your Anima's Kitchen Wallet!`,
    );
    setActionSuccess(
      `Ticket ${ticket.ticketNumber} marked resolved! ₹${creditAmount} apology credit deposited to customer wallet & WhatsApp confirmation dispatched.`,
    );
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleProgress = (ticket: SupportTicket) => {
    updateSupportTicketStatus(ticket.id, "in_progress");
    setActionSuccess(`Ticket ${ticket.ticketNumber} moved to In Progress.`);
    setTimeout(() => setActionSuccess(null), 2500);
  };

  const getIssueBadge = (type: TicketIssueType) => {
    switch (type) {
      case "delayed_delivery":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[9px] font-mono">
            DELAYED DELIVERY
          </Badge>
        );
      case "missing_item":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300 text-[9px] font-mono">
            MISSING ITEM
          </Badge>
        );
      case "wrong_item":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-[9px] font-mono">
            WRONG ITEM
          </Badge>
        );
      case "food_quality":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-[9px] font-mono">
            FOOD QUALITY
          </Badge>
        );
      case "payment_refund":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-[9px] font-mono">
            PAYMENT / REFUND
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Open Tickets
            </span>
            <AlertCircle
              className={`size-4 ${openCount > 0 ? "text-red-500 animate-pulse" : "text-emerald-500"}`}
            />
          </div>
          <p
            className={`mt-2 font-display text-2xl font-bold ${openCount > 0 ? "text-red-600" : "text-emerald-600"}`}
          >
            {openCount} Pending
          </p>
          <span className="text-[10px] text-ink/60 mt-0.5 block">
            Requires ops dispatcher intervention
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              In Progress
            </span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <p className="mt-2 font-display text-2xl text-amber-600 font-bold">
            {inProgressCount} Investigating
          </p>
          <span className="text-[10px] text-ink/60 mt-0.5 block">With kitchen chef / rider</span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Resolved Today
            </span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <p className="mt-2 font-display text-2xl text-emerald-700 font-bold">
            {resolvedCount} Resolved
          </p>
          <span className="text-[10px] text-emerald-800/80 font-medium mt-0.5 block">
            94% 1st contact resolution
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Average Resolution Speed
            </span>
            <LifeBuoy className="size-4 text-spice" />
          </div>
          <p className="mt-2 font-display text-2xl text-spice font-bold">8.5 Mins</p>
          <span className="text-[10px] text-ink/60 mt-0.5 block">
            Instant wallet credit resolution
          </span>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-ink/10 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-ink/70 ml-2">Filter Pipeline:</span>
          <div className="flex items-center gap-1">
            {[
              { id: "all", label: `All (${supportTickets.length})` },
              { id: "open", label: `Open (${openCount})` },
              { id: "in_progress", label: `In Progress (${inProgressCount})` },
              { id: "resolved", label: `Resolved (${resolvedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  filterStatus === tab.id
                    ? "bg-ink text-cream shadow-sm"
                    : "text-ink/60 hover:bg-frost"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <Badge variant="outline" className="font-mono text-[10px] mr-2">
          {filteredTickets.length} Displayed
        </Badge>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-ink/10">
            <CheckCircle2 className="size-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-display text-base font-bold text-ink">All Tickets Resolved!</p>
            <p className="text-xs text-ink/60 mt-1">
              No active customer grievances in this category.
            </p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`bg-white rounded-2xl border p-5 transition-all shadow-sm space-y-3 ${
                ticket.status === "open"
                  ? "border-red-200 ring-1 ring-red-100"
                  : ticket.status === "in_progress"
                    ? "border-amber-200"
                    : "border-ink/10 opacity-80"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink/5 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-spice">
                    {ticket.ticketNumber}
                  </span>
                  <span className="text-xs font-mono text-ink/40">·</span>
                  <span className="font-mono text-xs font-semibold text-ink">
                    Order Ref: {ticket.orderNumber}
                  </span>
                  {getIssueBadge(ticket.issueType)}
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] text-ink/50">
                  <Clock className="size-3" />
                  <span>
                    Logged:{" "}
                    {new Date(ticket.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <p className="text-sm font-semibold text-ink leading-relaxed">
                    "{ticket.description}"
                  </p>
                  <div className="flex items-center gap-3 text-xs text-ink/60 font-mono">
                    <span className="font-bold text-ink">{ticket.customerName}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Phone className="size-3" /> +91 {ticket.phone}
                    </span>
                  </div>
                </div>

                {/* Resolution Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                  {ticket.status === "open" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleProgress(ticket)}
                      className="h-8 rounded-xl text-xs border-amber-200 text-amber-700 hover:bg-amber-50"
                    >
                      <span>Investigate</span>
                    </Button>
                  )}

                  {ticket.status !== "resolved" ? (
                    <Button
                      size="sm"
                      onClick={() => handleResolveWithWalletCredit(ticket, 50)}
                      className="h-8 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1.5 shadow-sm"
                    >
                      <Gift className="size-3.5" />
                      <span>Resolve & Credit ₹50 Wallet</span>
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-mono font-bold border border-emerald-200">
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                      <span>CLOSED & COMPENSATED</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
