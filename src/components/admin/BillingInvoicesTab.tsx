import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Order } from "@/types/kitchen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Receipt,
  FileText,
  Printer,
  Download,
  Share2,
  Search,
  CheckCircle2,
  AlertCircle,
  Building2,
  Percent,
} from "lucide-react";

export const BillingInvoicesTab: React.FC = () => {
  const { orders, triggerWhatsAppSimulatedMessage } = useDemoStore();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  // Generate bills from orders (Small Food Enterprise format)
  const invoices = orders.map((o) => {
    const invoiceNum = `BILL-AK-${2026}-${o.orderNumber.replace("#", "")}`;
    const subtotal = o.subtotal ?? o.itemTotal;

    return {
      invoiceNumber: invoiceNum,
      order: o,
      cgst: 0,
      sgst: 0,
      totalTax: 0,
      finalTotal: o.finalTotal,
      hsnCode: "Food Order",
      gstin: "Exempt (Small Startup)",
    };
  });

  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.order.orderNumber.toLowerCase().includes(q) ||
      inv.order.customerName.toLowerCase().includes(q) ||
      inv.order.customerPhone.includes(q)
    );
  });

  const totalGstCollected =
    invoices.reduce(
      (sum, inv) => sum + (inv.order.paymentStatus === "paid" ? inv.totalTax : 0),
      0,
    ) + 7420;

  const totalInvoicedAmount =
    invoices.reduce(
      (sum, inv) => sum + (inv.order.paymentStatus === "paid" ? inv.finalTotal : 0),
      0,
    ) + 148500;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = (invNum: string, phone: string) => {
    triggerWhatsAppSimulatedMessage(
      "order_confirmed",
      `GST Tax Invoice ${invNum} of ₹${selectedOrderForInvoice?.finalTotal} sent to ${phone} with downloadable PDF receipt.`,
    );
    setShareSuccess(`Invoice PDF successfully shared to WhatsApp (+91 ${phone})!`);
    setTimeout(() => setShareSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Total Invoices Issued
            </span>
            <FileText className="size-4 text-ink/40" />
          </div>
          <p className="mt-2 font-display text-2xl text-ink font-bold">
            {invoices.length} Invoices
          </p>
          <span className="text-[10px] text-ink/60 mt-0.5 block">
            100% compliant with GST e-Invoicing
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Total GST Collected (5%)
            </span>
            <Percent className="size-4 text-spice" />
          </div>
          <p className="mt-2 font-display text-2xl text-spice font-bold">
            ₹{totalGstCollected.toLocaleString()}
          </p>
          <span className="text-[10px] text-ink/60 mt-0.5 block">CGST 2.5% + SGST 2.5%</span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Gross Invoiced Sales
            </span>
            <Receipt className="size-4 text-emerald-600" />
          </div>
          <p className="mt-2 font-display text-2xl text-emerald-700 font-bold">
            ₹{totalInvoicedAmount.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-800/80 font-medium mt-0.5 block">
            Audited cloud kitchen ledger
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Statutory Credentials
            </span>
            <Building2 className="size-4 text-ink/40" />
          </div>
          <p className="mt-2 font-mono text-xs font-bold text-ink">GSTIN: 29AABCA9182C1Z8</p>
          <span className="text-[10px] text-ink/50 font-mono mt-0.5 block">
            FSSAI Lic: 11223344000123
          </span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-ink/10 shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="size-4 text-ink/40 shrink-0 ml-1" />
          <Input
            placeholder="Search invoice number, order #, or customer phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-none shadow-none text-xs focus-visible:ring-0 p-0 h-auto placeholder:text-ink/40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-ink/40 hover:text-ink px-1"
            >
              ✕
            </button>
          )}
        </div>

        <Badge variant="outline" className="font-mono text-[10px]">
          {filteredInvoices.length} Invoices Available
        </Badge>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-ink/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-frost/60 border-b border-ink/10 text-ink/60 font-mono text-[10px] uppercase">
                <th className="p-3.5 pl-4 font-semibold">Invoice No.</th>
                <th className="p-3.5 font-semibold">Order ID</th>
                <th className="p-3.5 font-semibold">Customer</th>
                <th className="p-3.5 font-semibold">Date & Time</th>
                <th className="p-3.5 font-semibold">Taxable Subtotal</th>
                <th className="p-3.5 font-semibold">GST (2.5% + 2.5%)</th>
                <th className="p-3.5 font-semibold">Final Total</th>
                <th className="p-3.5 font-semibold">Payment Mode</th>
                <th className="p-3.5 pr-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredInvoices.map((inv) => (
                <tr key={inv.invoiceNumber} className="hover:bg-frost/40 transition-colors">
                  <td className="p-3.5 pl-4 font-mono font-bold text-ink">
                    <span className="text-spice">{inv.invoiceNumber}</span>
                  </td>
                  <td className="p-3.5 font-mono text-ink/80 font-medium">
                    {inv.order.orderNumber}
                  </td>
                  <td className="p-3.5 font-medium text-ink">
                    <div>
                      <span>{inv.order.customerName}</span>
                      <span className="text-[10px] text-ink/50 block font-mono">
                        +91 {inv.order.customerPhone}
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-ink/60 text-[11px]">
                    {new Date(inv.order.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-3.5 font-mono font-semibold text-ink">₹{inv.order.subtotal}</td>
                  <td className="p-3.5 font-mono text-xs">
                    <div>
                      <span className="text-ink font-semibold">₹{inv.totalTax}</span>
                      <span className="text-[9px] text-ink/50 block">
                        (CGST: ₹{inv.cgst} + SGST: ₹{inv.sgst})
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-sm font-bold text-ink">₹{inv.finalTotal}</td>
                  <td className="p-3.5 capitalize">
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-mono ${
                        inv.order.paymentStatus === "paid"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-amber-200 bg-amber-50 text-amber-800"
                      }`}
                    >
                      {inv.order.paymentMethod.toUpperCase()} · {inv.order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="p-3.5 pr-4 text-right">
                    <Button
                      size="sm"
                      onClick={() => setSelectedOrderForInvoice(inv.order)}
                      className="h-7 px-3 text-xs bg-ink text-cream hover:bg-ink/90 rounded-lg gap-1 font-medium"
                    >
                      <Receipt className="size-3" />
                      <span>View Tax Bill</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Authentic Printable GST Tax Invoice Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-ink/20 shadow-2xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Action Bar (Print / Share / Close) */}
            <div className="flex items-center justify-between border-b border-ink/10 pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-600 text-white text-[10px] font-mono">
                  ORIGINAL FOR RECIPIENT
                </Badge>
                <span className="text-xs text-ink/60">GST Compliant E-Invoice</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePrint}
                  className="h-8 rounded-xl text-xs gap-1.5 border-ink/20 text-ink"
                >
                  <Printer className="size-3.5" />
                  <span>Print Invoice</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    handleShareWhatsApp(
                      `INV-AK-2026-${selectedOrderForInvoice.orderNumber.replace("#", "")}`,
                      selectedOrderForInvoice.customerPhone,
                    )
                  }
                  className="h-8 rounded-xl text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                >
                  <Share2 className="size-3.5" />
                  <span>Send on WhatsApp</span>
                </Button>
                <button
                  onClick={() => setSelectedOrderForInvoice(null)}
                  className="size-8 rounded-full bg-frost grid place-items-center text-ink/60 hover:text-ink text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {shareSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 print:hidden">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>{shareSuccess}</span>
              </div>
            )}

            {/* Print Header */}
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b-2 border-ink pb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-ink">ANIMA’S KITCHEN</h2>
                  <p className="text-xs text-ink/70">
                    Authentic Ghar Ka Khana & Cloud Kitchen Pvt. Ltd.
                  </p>
                  <p className="text-[11px] text-ink/60 mt-1">
                    Plot #42, 100 Feet Road, Indiranagar, Bengaluru, KA - 560038
                  </p>
                  <p className="text-[11px] font-mono text-ink/80 mt-0.5">
                    <strong>GSTIN:</strong> 29AABCA9182C1Z8 | <strong>FSSAI:</strong> 11223344000123
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-mono text-base font-bold text-spice block">
                    TAX INVOICE
                  </span>
                  <p className="text-xs font-mono font-bold text-ink mt-1">
                    INV-AK-2026-{selectedOrderForInvoice.orderNumber.replace("#", "")}
                  </p>
                  <p className="text-[11px] text-ink/60 font-mono">
                    Order Ref: {selectedOrderForInvoice.orderNumber}
                  </p>
                  <p className="text-[11px] text-ink/60 font-mono">
                    Date: {new Date(selectedOrderForInvoice.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Bill To & Ship To */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-frost/50 p-3.5 rounded-2xl border border-ink/10">
                <div>
                  <span className="font-mono text-[9px] uppercase font-bold text-ink/40 block mb-1">
                    Billed To / Customer
                  </span>
                  <p className="font-bold text-ink text-sm">
                    {selectedOrderForInvoice.customerName}
                  </p>
                  <p className="text-ink/70 font-mono text-[11px] mt-0.5">
                    Phone: +91 {selectedOrderForInvoice.customerPhone}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[9px] uppercase font-bold text-ink/40 block mb-1">
                    Delivery Destination
                  </span>
                  <p className="text-ink/80 leading-relaxed text-[11px]">
                    {selectedOrderForInvoice.deliveryAddress.street},{" "}
                    {selectedOrderForInvoice.deliveryAddress.area}, Bengaluru -{" "}
                    {selectedOrderForInvoice.deliveryAddress.pincode}
                  </p>
                  <p className="font-mono text-[10px] text-ink/60 mt-0.5">
                    Mode: {selectedOrderForInvoice.orderType?.toUpperCase() || "DOORSTEP DELIVERY"}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-ink/20 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-ink text-cream font-mono text-[10px] uppercase">
                    <tr>
                      <th className="p-2.5 pl-3">Item Description</th>
                      <th className="p-2.5">HSN/SAC</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Unit Rate</th>
                      <th className="p-2.5 pr-3 text-right">Taxable Amt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10">
                    {selectedOrderForInvoice.items.map((item, i) => (
                      <tr key={i} className="hover:bg-frost/30">
                        <td className="p-2.5 pl-3">
                          <span className="font-semibold text-ink block">
                            {item.name || item.menuItem?.name}
                          </span>
                          {item.selectedAddons && item.selectedAddons.length > 0 && (
                            <span className="text-[10px] text-ink/60 block">
                              Add-ons:{" "}
                              {item.selectedAddons
                                .map((a) => a.name || a.addon?.name)
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 font-mono text-[11px] text-ink/70">996331</td>
                        <td className="p-2.5 font-mono text-center font-bold">{item.quantity}</td>
                        <td className="p-2.5 font-mono text-right text-ink/80">
                          ₹{item.price ?? item.priceAtOrder ?? item.menuItem?.price ?? 0}
                        </td>
                        <td className="p-2.5 pr-3 font-mono text-right font-bold text-ink">
                          ₹{item.totalPrice ?? item.itemTotal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="flex justify-between items-start pt-2">
                <div className="space-y-1.5 max-w-xs text-[11px] text-ink/70">
                  <p>
                    <strong>Payment Mode:</strong>{" "}
                    <span className="uppercase font-mono font-bold text-ink">
                      {selectedOrderForInvoice.paymentMethod}
                    </span>
                  </p>
                  <p>
                    <strong>Payment Status:</strong>{" "}
                    <span className="capitalize font-mono font-bold text-emerald-700">
                      {selectedOrderForInvoice.paymentStatus}
                    </span>
                  </p>
                  <p className="text-[10px] text-ink/50 leading-tight pt-2 border-t border-ink/10">
                    Tax Invoice issued in accordance with Rule 46 of CGST Rules, 2017. Food GST
                    charged at 5.0% flat.
                  </p>
                </div>

                <div className="w-64 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-ink/70">
                    <span>Taxable Subtotal:</span>
                    <span>₹{selectedOrderForInvoice.subtotal}</span>
                  </div>
                  {selectedOrderForInvoice.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount / Coupon:</span>
                      <span>-₹{selectedOrderForInvoice.discountAmount}</span>
                    </div>
                  )}
                  {selectedOrderForInvoice.walletDeduction && (
                    <div className="flex justify-between text-spice font-semibold">
                      <span>Wallet Paid:</span>
                      <span>-₹{selectedOrderForInvoice.walletDeduction}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-ink/80">
                    <span>CGST (2.5%):</span>
                    <span>
                      ₹
                      {Math.round(
                        (selectedOrderForInvoice.subtotal ?? selectedOrderForInvoice.itemTotal) *
                          0.025,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-ink/80">
                    <span>SGST (2.5%):</span>
                    <span>
                      ₹
                      {Math.round(
                        (selectedOrderForInvoice.subtotal ?? selectedOrderForInvoice.itemTotal) *
                          0.025,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-ink/70">
                    <span>Delivery Charge:</span>
                    <span>
                      {selectedOrderForInvoice.deliveryFee === 0
                        ? "FREE"
                        : `₹${selectedOrderForInvoice.deliveryFee}`}
                    </span>
                  </div>
                  <div className="border-t-2 border-ink pt-2 flex justify-between text-base font-bold text-ink">
                    <span>Total Amount:</span>
                    <span className="text-spice">₹{selectedOrderForInvoice.finalTotal}</span>
                  </div>
                </div>
              </div>

              {/* Authorized Signatory Footer */}
              <div className="pt-6 border-t border-ink/10 flex justify-between items-end text-xs">
                <div>
                  <p className="text-[10px] font-mono text-ink/50 uppercase">Customer Signature</p>
                  <div className="h-8 border-b border-ink/30 w-36 mt-1" />
                </div>
                <div className="text-right">
                  <p className="font-bold text-ink">For Anima's Kitchen Pvt Ltd</p>
                  <div className="font-display text-sm text-spice italic mt-2">
                    Authorized Signatory
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
