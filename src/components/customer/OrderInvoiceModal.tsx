import React, { useRef } from "react";
import { Order } from "@/types/kitchen";
import { useDemoStore } from "@/context/DemoStoreContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, CheckCircle2, ShieldCheck, Share2, Receipt } from "lucide-react";
import { toast } from "sonner";

interface OrderInvoiceModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({
  order,
  open,
  onOpenChange,
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { gstBillingConfig } = useDemoStore();

  if (!order) return null;

  const invoiceNumber = `${gstBillingConfig.invoicePrefix || "INV-AK"}-2026-${order.orderNumber.replace("#", "")}`;
  const subtotal = order.subtotal ?? order.itemTotal;
  const effectiveTaxRate = gstBillingConfig.isGstEnabled ? gstBillingConfig.gstRatePercent : 0;
  const totalTax = order.taxAmount ?? Math.round((subtotal * effectiveTaxRate) / 100);
  const cgst = Number(((subtotal * (gstBillingConfig.isGstEnabled ? gstBillingConfig.cgstPercent : 0)) / 100).toFixed(2));
  const sgst = Number(((subtotal * (gstBillingConfig.isGstEnabled ? gstBillingConfig.sgstPercent : 0)) / 100).toFixed(2));
  const packagingFee = order.packagingFee ?? (gstBillingConfig.packagingFee > 0 ? gstBillingConfig.packagingFee : 0);

  const customTaxesList = order.customTaxesBreakdown?.length
    ? order.customTaxesBreakdown
    : (gstBillingConfig.customTaxes || [])
        .filter((t) => t.isEnabled && t.value > 0)
        .map((t) => ({
          id: t.id,
          name: t.name,
          amount:
            t.type === "percent"
              ? Number(((subtotal * t.value) / 100).toFixed(2))
              : Number(t.value.toFixed(2)),
        }));

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    // Generate clean text-based / printable receipt download
    const printableHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bill Receipt - ${invoiceNumber} - Anima's Kitchen</title>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 30px; color: #1e1e1e; max-width: 650px; margin: 0 auto; line-height: 1.5; }
          .header { text-align: center; border-bottom: 2px dashed #e2e8f0; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { margin: 0; color: #d9480f; font-size: 26px; }
          .sub { font-size: 12px; color: #64748b; margin-top: 4px; }
          .badge { display: inline-block; background: #ecfdf5; color: #047857; padding: 4px 10px; border-radius: 999px; font-weight: bold; font-size: 12px; margin-top: 8px; }
          .meta { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
          th { text-align: left; background: #f8fafc; padding: 8px; border-bottom: 1px solid #cbd5e1; }
          td { padding: 8px; border-bottom: 1px solid #f1f5f9; }
          .text-right { text-align: right; }
          .totals { margin-left: auto; width: 280px; font-size: 13px; line-height: 1.8; }
          .totals-row { display: flex; justify-content: space-between; }
          .grand-total { font-weight: bold; font-size: 18px; color: #d9480f; border-top: 2px solid #1e1e1e; padding-top: 8px; margin-top: 8px; }
          .footer { margin-top: 35px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="/logo.png" alt="Anima's Kitchen" style="width: 72px; height: 72px; object-fit: contain; border-radius: 50%; margin: 0 auto 10px auto; display: block;" />
          <h1>${gstBillingConfig.businessLegalName || "ANIMA'S KITCHEN"}</h1>
          <div class="sub">${gstBillingConfig.billingAddress}</div>
          <div class="sub">GSTIN: <strong>${gstBillingConfig.restaurantGstin}</strong> | FSSAI Lic. No: <strong>${gstBillingConfig.fssaiNumber}</strong> | SAC: ${gstBillingConfig.hsnSacCode}</div>
          <div class="badge">${gstBillingConfig.isGstEnabled && effectiveTaxRate > 0 ? `GST TAX INVOICE (${effectiveTaxRate}%)` : "OFFICIAL ORDER RECEIPT / CASH MEMO"}</div>
        </div>

        <div class="meta">
          <div>
            <strong>Billed To:</strong><br>
            ${order.customerName}<br>
            Phone: +91 ${order.customerPhone}<br>
            ${order.deliveryAddress ? `${order.deliveryAddress.street}, ${order.deliveryAddress.area}, ${order.deliveryAddress.city} - ${order.deliveryAddress.pincode}` : "Self Pickup"}
          </div>
          <div style="text-align: right;">
            <strong>Invoice No:</strong> ${invoiceNumber}<br>
            <strong>Order ID:</strong> ${order.orderNumber}<br>
            <strong>Date:</strong> ${new Date(order.createdAt).toLocaleString("en-IN")}<br>
            <strong>Payment Mode:</strong> ${order.paymentMethod.toUpperCase()} (${order.paymentStatus.toUpperCase()})
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Dish Item</th>
              <th>SAC</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Price</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (item) => `
              <tr>
                <td>
                  <strong>${item.menuItem?.name || "Delicious Homemade Dish"}</strong>
                  ${
                    item.selectedAddons && item.selectedAddons.length > 0
                      ? `<br><small style="color: #64748b;">+ ${item.selectedAddons.map((a: any) => a.addon?.name || a.name).join(", ")}</small>`
                      : ""
                  }
                </td>
                <td>${gstBillingConfig.hsnSacCode}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">₹${item.menuItem?.price || item.itemTotal}</td>
                <td class="text-right">₹${item.itemTotal * item.quantity}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row"><span>Taxable Subtotal:</span><span>₹${subtotal}</span></div>
          ${packagingFee > 0 ? `<div class="totals-row"><span>Eco Packaging:</span><span>₹${packagingFee}</span></div>` : ""}
          ${gstBillingConfig.isGstEnabled && effectiveTaxRate > 0 ? `
            <div class="totals-row"><span>CGST (${gstBillingConfig.cgstPercent}%):</span><span>₹${cgst}</span></div>
            <div class="totals-row"><span>SGST (${gstBillingConfig.sgstPercent}%):</span><span>₹${sgst}</span></div>
          ` : `<div class="totals-row"><span>GST:</span><span>₹0 (Exempt)</span></div>`}
          ${customTaxesList.map((ct) => `<div class="totals-row" style="color: #ea580c;"><span>${ct.name}:</span><span>+₹${ct.amount}</span></div>`).join("")}
          <div class="totals-row"><span>Delivery Fee:</span><span>${order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}</span></div>
          ${order.discountAmount ? `<div class="totals-row" style="color: #047857;"><span>Discount / Coupon:</span><span>-₹${order.discountAmount}</span></div>` : ""}
          <div class="totals-row grand-total"><span>Total Paid:</span><span>₹${order.finalTotal}</span></div>
        </div>

        <div class="footer">
          Tax Invoice issued in accordance with Rule 46 of CGST Rules, 2017.<br>
          Thank you for choosing Anima's Kitchen Patna! Prepared with 100% cow desi ghee and zero preservatives.<br>
          For orders & queries: +91 70049 60724 | animaskitchen24@gmail.com
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([printableHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Animas_Kitchen_Bill_${order.orderNumber.replace("#", "")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Bill downloaded successfully! You can view or print it.");
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*Anima's Kitchen Tax Invoice*\n` +
        `Invoice: ${invoiceNumber}\n` +
        `Order: ${order.orderNumber}\n` +
        `Amount Paid: ₹${order.finalTotal}\n` +
        `Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}\n\n` +
        `Thank you for ordering Ghar Jaisa Khana from Anima's Kitchen Patna!`,
    );
    window.open(`https://wa.me/91${order.customerPhone}?text=${text}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-3xl border border-ink/10 bg-frost p-0 shadow-2xl text-ink">
        <DialogHeader className="border-b border-ink/10 bg-cream p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-spice text-cream shadow-sm">
                <Receipt className="size-5" />
              </span>
              <div>
                <DialogTitle className="font-display text-xl font-bold text-ink">
                  Order Bill & Receipt
                </DialogTitle>
                <DialogDescription className="text-xs text-ink/60">
                  Official Customer Cash Memo · Downloadable Bill
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="h-8 rounded-full border-ink/20 text-xs text-ink gap-1 hover:border-spice"
              >
                <Printer className="size-3.5" />
                <span>Print</span>
              </Button>
              <Button
                size="sm"
                onClick={handleDownloadInvoice}
                className="h-8 rounded-full bg-spice text-cream text-xs gap-1.5 hover:bg-ink shadow-sm"
              >
                <Download className="size-3.5" />
                <span>Download Bill</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Invoice Printable View */}
        <div
          ref={invoiceRef}
          className="p-5 sm:p-6 overflow-y-auto max-h-[75vh] space-y-4 bg-white"
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b border-ink/10 pb-4">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Anima's Kitchen Logo"
                  className="size-14 rounded-full object-contain border-2 border-spice/20 shadow-xs shrink-0 bg-white"
                />
                <div>
                  <h3 className="font-display text-lg font-extrabold text-ink leading-tight">
                    {gstBillingConfig.businessLegalName || "ANIMA'S KITCHEN"}
                  </h3>
                  <span className="text-[10px] font-mono text-ink/60 uppercase">
                    Patna Cloud & Tiffin Hub
                  </span>
                </div>
              </div>
              <p className="mt-2 text-xs text-ink/70">
                {gstBillingConfig.billingAddress}
              </p>
              <p className="text-[11px] text-ink/60 font-mono">
                <strong>GSTIN:</strong> {gstBillingConfig.restaurantGstin} · <strong>FSSAI:</strong> {gstBillingConfig.fssaiNumber}
              </p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="size-3 text-emerald-600" />
                {gstBillingConfig.isGstEnabled && effectiveTaxRate > 0 ? "GST TAX INVOICE" : "PAID RECEIPT"}
              </span>
              <p className="font-mono text-xs font-bold text-ink mt-2">{invoiceNumber}</p>
              <p className="text-[11px] font-mono text-ink/60">
                Date: {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </p>
              <p className="text-[11px] font-mono text-ink/60">Order Ref: {order.orderNumber}</p>
            </div>
          </div>

          {/* Customer & Delivery Coordinates */}
          <div className="rounded-2xl bg-frost/60 p-3.5 border border-ink/10 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-ink/50 font-bold block mb-1">
                Billed To:
              </span>
              <strong className="text-ink text-sm">{order.customerName}</strong>
              <p className="text-ink/70 mt-0.5">+91 {order.customerPhone}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-ink/50 font-bold block mb-1">
                Dispatch Destination:
              </span>
              {order.deliveryAddress ? (
                <>
                  <p className="text-ink font-medium">{order.deliveryAddress.street}</p>
                  <p className="text-ink/60 text-[11px]">
                    {order.deliveryAddress.area}, {order.deliveryAddress.city} -{" "}
                    {order.deliveryAddress.pincode}
                  </p>
                </>
              ) : (
                <p className="text-ink">Counter Pickup</p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-hidden rounded-2xl border border-ink/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-frost/80 text-ink/70 font-mono text-[10px] uppercase border-b border-ink/10">
                <tr>
                  <th className="p-3">Dish / Item</th>
                  <th className="p-3">SAC</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Rate</th>
                  <th className="p-3 text-right pr-4">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {order.items.map((item, i) => (
                  <tr key={i} className="hover:bg-frost/20">
                    <td className="p-3">
                      <span className="font-semibold text-ink">
                        {item.menuItem?.name || "Dish Item"}
                      </span>
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <p className="text-[10px] text-ink/60 mt-0.5">
                          +{" "}
                          {item.selectedAddons.map((a: any) => a.addon?.name || a.name).join(", ")}
                        </p>
                      )}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-ink/60">{gstBillingConfig.hsnSacCode}</td>
                    <td className="p-3 text-center font-mono font-medium">{item.quantity}</td>
                    <td className="p-3 text-right font-mono text-ink/70">
                      ₹{item.menuItem?.price || item.itemTotal}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-ink pr-4">
                      ₹{item.itemTotal * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Taxes & Payment Breakup */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="space-y-1.5 text-xs text-ink/70">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold text-ink/50">
                  Payment Method:
                </span>
                <span className="font-mono font-bold uppercase text-ink bg-frost px-2 py-0.5 rounded border border-ink/10">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold text-ink/50">
                  Status:
                </span>
                <span className="font-mono font-bold uppercase text-emerald-700">
                  {order.paymentStatus}
                </span>
              </div>
              <p className="text-[10px] text-ink/50 pt-1">
                Rule 46 Tax Invoice · SAC: {gstBillingConfig.hsnSacCode}
              </p>
            </div>

            <div className="w-full sm:w-60 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-ink/70">
                <span>Taxable Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              {packagingFee > 0 && (
                <div className="flex justify-between text-ink/70">
                  <span>Eco Packaging:</span>
                  <span>₹{packagingFee}</span>
                </div>
              )}
              {gstBillingConfig.isGstEnabled && effectiveTaxRate > 0 ? (
                <>
                  <div className="flex justify-between text-ink/80">
                    <span>CGST ({gstBillingConfig.cgstPercent}%):</span>
                    <span>₹{cgst}</span>
                  </div>
                  <div className="flex justify-between text-ink/80">
                    <span>SGST ({gstBillingConfig.sgstPercent}%):</span>
                    <span>₹{sgst}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-emerald-700">
                  <span>GST:</span>
                  <span>₹0 (Exempt)</span>
                </div>
              )}
              {customTaxesList.map((ct) => (
                <div key={ct.id} className="flex justify-between text-spice font-medium">
                  <span>{ct.name}:</span>
                  <span className="font-mono font-semibold">+₹{ct.amount}</span>
                </div>
              ))}
              <div className="flex justify-between text-ink/70">
                <span>Delivery:</span>
                <span>{order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}</span>
              </div>
              {order.discountAmount ? (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount:</span>
                  <span>-₹{order.discountAmount}</span>
                </div>
              ) : null}
              <div className="border-t-2 border-ink pt-2 flex justify-between text-base font-bold text-ink">
                <span>Total Paid:</span>
                <span className="text-spice font-display">₹{order.finalTotal}</span>
              </div>
            </div>
          </div>

          {/* Footer note & WhatsApp trigger */}
          <div className="pt-4 border-t border-ink/10 flex flex-wrap justify-between items-center gap-3">
            <p className="text-[11px] text-ink/60">
              Thank you for trusting Anima's Kitchen with your daily meals!
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareWhatsApp}
                className="h-8 rounded-full text-xs text-[#25D366] hover:text-[#20ba5a] border-ink/15 gap-1.5"
              >
                <Share2 className="size-3.5" />
                <span>Send to WhatsApp</span>
              </Button>
              <Button
                size="sm"
                onClick={handleDownloadInvoice}
                className="h-8 rounded-full bg-spice text-cream text-xs hover:bg-ink gap-1.5"
              >
                <Download className="size-3.5" />
                <span>Save Bill</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
