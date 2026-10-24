import React, { useState, useEffect, useRef } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Order, GstBillingConfig, CartItem, MenuItem, CustomBillTax } from "@/types/kitchen";
import { DEFAULT_GST_BILLING_CONFIG } from "@/data/mockKitchenData";
import {
  TaxPreset,
  DEFAULT_TAX_PRESETS,
  getStoredTaxPresets,
  saveStoredTaxPresets,
  calculateCustomTaxes,
  getCustomTaxesTotal,
} from "@/lib/taxPresets";
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
  Sliders,
  Save,
  RotateCcw,
  Sparkles,
  Calculator,
  ShieldCheck,
  Check,
  DollarSign,
  Truck,
  Box,
  Plus,
  Trash2,
  Edit3,
  X,
  Eye,
  Phone,
  MapPin,
  User,
  RefreshCw,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

interface BillingInvoicesTabProps {
  onNavigateToGstTax?: () => void;
}

export const BillingInvoicesTab: React.FC<BillingInvoicesTabProps> = ({
  onNavigateToGstTax,
}) => {
  const {
    orders,
    menuItems,
    triggerWhatsAppSimulatedMessage,
    gstBillingConfig,
    updateGstBillingConfig,
    updateOrder,
    deleteOrder,
    createCustomOrder,
  } = useDemoStore();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isCreatingNewBill, setIsCreatingNewBill] = useState(false);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  // GST Configuration form state - ALWAYS VISIBLE for instant admin control
  const [formConfig, setFormConfig] = useState<GstBillingConfig>({ ...gstBillingConfig });
  const [simulatedSubtotal, setSimulatedSubtotal] = useState<number>(350);
  const configSectionRef = useRef<HTMLDivElement>(null);

  // Sync local form state if store changes externally
  useEffect(() => {
    setFormConfig({ ...gstBillingConfig });
  }, [gstBillingConfig]);

  // Clean phone number helper (guarantees NO "+91 +91" duplication ever)
  const formatCustomerPhone = (phone?: string) => {
    if (!phone) return "+91 98765 43210";
    const digitsOnly = phone.replace(/\D/g, "");
    let localDigits = digitsOnly;
    while (localDigits.startsWith("91") && localDigits.length > 10) {
      localDigits = localDigits.slice(2);
    }
    if (localDigits.length < 5) return "+91 98765 43210";
    return `+91 ${localDigits.slice(-10)}`;
  };

  // Clean invoice number helper (prevents duplicate "AK-" or weird prefixes)
  const getCleanInvoiceNumber = (orderNumber: string) => {
    const digits = orderNumber.replace(/\D/g, "");
    const suffix = digits ? digits.slice(-4) : "1013";
    const prefix = gstBillingConfig.invoicePrefix?.replace(/[-_]$/, "") || "AK-INV";
    return `${prefix}-2026-${suffix}`;
  };

  // Robust subtotal calculation
  const getOrderSubtotal = (o: Order) => {
    if (o.items && o.items.length > 0) {
      const sum = o.items.reduce((acc, it) => {
        const p = it.price ?? it.itemTotal ?? it.menuItem?.price ?? 0;
        return acc + p * (it.quantity || 1);
      }, 0);
      if (sum > 0) return sum;
    }
    if (typeof o.subtotal === "number" && o.subtotal > 0) return o.subtotal;
    if (typeof o.itemTotal === "number" && o.itemTotal > 0) return o.itemTotal;
    if (o.finalTotal && o.finalTotal > 0) {
      return Math.max(50, o.finalTotal - (o.deliveryFee || 0) - (o.packagingFee || 0) - (o.taxAmount || 0));
    }
    return 240;
  };

  // Handle GST rate change with auto-split of CGST and SGST
  const handleGstRateChange = (rate: number) => {
    const half = Number((rate / 2).toFixed(2));
    setFormConfig((prev) => ({
      ...prev,
      gstRatePercent: rate,
      cgstPercent: half,
      sgstPercent: half,
    }));
  };

  // Dynamic Custom Tax Presets Management
  const [taxPresets, setTaxPresets] = useState<TaxPreset[]>(() => getStoredTaxPresets());

  useEffect(() => {
    saveStoredTaxPresets(taxPresets);
  }, [taxPresets]);

  const [showAddPresetModal, setShowAddPresetModal] = useState(false);
  const [newPreset, setNewPreset] = useState({
    emoji: "📋",
    name: "",
    gstRate: 5,
    packagingFee: 10,
    deliveryFee: 30,
    freeDeliveryThreshold: 299,
    hsnSacCode: "996331",
    isGstEnabled: true,
  });

  const applyPresetById = (presetId: string) => {
    const preset = taxPresets.find((p) => p.id === presetId);
    if (!preset) return;

    setFormConfig((prev) => ({
      ...prev,
      isGstEnabled: preset.isGstEnabled,
      gstRatePercent: preset.gstRate,
      cgstPercent: preset.cgst,
      sgstPercent: preset.sgst,
      packagingFee: preset.packagingFee,
      deliveryFee: preset.deliveryFee,
      freeDeliveryThreshold: preset.freeDeliveryThreshold,
      hsnSacCode: preset.hsnSacCode,
    }));
    toast.info(`Loaded Preset: ${preset.emoji} ${preset.name} (${preset.cgst}% CGST + ${preset.sgst}% SGST)`);
  };

  const handleAddCustomPreset = () => {
    if (!newPreset.name.trim()) {
      toast.error("Preset name is required!");
      return;
    }
    const gstRate = newPreset.isGstEnabled ? newPreset.gstRate : 0;
    const half = Number((gstRate / 2).toFixed(2));
    const customPreset: TaxPreset = {
      id: `custom-${Date.now()}`,
      emoji: newPreset.emoji || "📋",
      name: newPreset.name.trim(),
      gstRate: gstRate,
      cgst: half,
      sgst: half,
      packagingFee: newPreset.packagingFee,
      deliveryFee: newPreset.deliveryFee,
      freeDeliveryThreshold: newPreset.freeDeliveryThreshold,
      hsnSacCode: newPreset.hsnSacCode,
      isGstEnabled: newPreset.isGstEnabled,
      isDefault: false,
    };
    setTaxPresets((prev) => [...prev, customPreset]);
    setShowAddPresetModal(false);
    setNewPreset({
      emoji: "📋",
      name: "",
      gstRate: 5,
      packagingFee: 10,
      deliveryFee: 30,
      freeDeliveryThreshold: 299,
      hsnSacCode: "996331",
      isGstEnabled: true,
    });
    toast.success(`Custom Tax Preset "${customPreset.name}" permanently saved! Click it to apply.`);
  };

  const handleDeletePreset = (presetId: string) => {
    const preset = taxPresets.find((p) => p.id === presetId);
    if (!preset) return;
    if (taxPresets.length <= 1) {
      toast.error("At least 1 tax preset must remain!");
      return;
    }
    setTaxPresets((prev) => prev.filter((p) => p.id !== presetId));
    toast.success(`Tax Preset "${preset.name}" permanently deleted!`);
  };

  const handleResetPresets = () => {
    setTaxPresets(DEFAULT_TAX_PRESETS);
    saveStoredTaxPresets(DEFAULT_TAX_PRESETS);
    toast.info("Tax presets reset to government defaults!");
  };

  // Modal state for adding custom bill taxes (e.g. Rain Tax, Road Tax, Cess)
  const [showAddCustomTaxModal, setShowAddCustomTaxModal] = useState(false);
  const [newCustomTax, setNewCustomTax] = useState({
    name: "",
    type: "flat" as "flat" | "percent",
    value: 20,
    isEnabled: true,
  });

  const handleAddCustomBillTax = () => {
    if (!newCustomTax.name.trim()) {
      toast.error("Tax name is required! (e.g. Rain Tax, Road Tax)");
      return;
    }
    const item: CustomBillTax = {
      id: `custom-tax-${Date.now()}`,
      name: newCustomTax.name.trim(),
      type: newCustomTax.type,
      value: Number(newCustomTax.value) || 0,
      isEnabled: newCustomTax.isEnabled,
    };
    setFormConfig((prev) => ({
      ...prev,
      customTaxes: [...(prev.customTaxes || []), item],
    }));
    setShowAddCustomTaxModal(false);
    setNewCustomTax({
      name: "",
      type: "flat",
      value: 20,
      isEnabled: true,
    });
    toast.success(`Custom Tax "${item.name}" added to bill! Click "Save GST & Billing Settings" to persist.`);
  };

  const handleToggleCustomTax = (taxId: string) => {
    setFormConfig((prev) => ({
      ...prev,
      customTaxes: (prev.customTaxes || []).map((t) =>
        t.id === taxId ? { ...t, isEnabled: !t.isEnabled } : t,
      ),
    }));
  };

  const handleDeleteCustomTax = (taxId: string) => {
    const found = formConfig.customTaxes?.find((t) => t.id === taxId);
    setFormConfig((prev) => ({
      ...prev,
      customTaxes: (prev.customTaxes || []).filter((t) => t.id !== taxId),
    }));
    toast.success(`Custom Tax "${found?.name || "Tax"}" permanently removed from bill!`);
  };

  const handleQuickAddCustomTax = (name: string, type: "flat" | "percent", value: number) => {
    const existing = formConfig.customTaxes?.find((t) => t.name === name);
    if (existing) {
      handleToggleCustomTax(existing.id);
      toast.info(`Toggled "${name}" on bill.`);
      return;
    }
    const item: CustomBillTax = {
      id: `custom-tax-${Date.now()}`,
      name,
      type,
      value,
      isEnabled: true,
    };
    setFormConfig((prev) => ({
      ...prev,
      customTaxes: [...(prev.customTaxes || []), item],
    }));
    toast.success(`Added "${name}" to bill!`);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateGstBillingConfig(formConfig);
    toast.success("GST & Billing Settings Saved!", {
      description: `All customer bills and invoices now calculate at ${formConfig.isGstEnabled ? `${formConfig.gstRatePercent}% GST` : "0% (Exempt)"}.`,
    });
  };

  const scrollToConfig = () => {
    if (onNavigateToGstTax) {
      onNavigateToGstTax();
      return;
    }
    configSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Live Simulation Calculation
  const simEffectiveRate = formConfig.isGstEnabled ? formConfig.gstRatePercent : 0;
  const simTax = Number(((simulatedSubtotal * simEffectiveRate) / 100).toFixed(2));
  const simCgst = Number(
    ((simulatedSubtotal * (formConfig.isGstEnabled ? formConfig.cgstPercent : 0)) / 100).toFixed(2),
  );
  const simSgst = Number(
    ((simulatedSubtotal * (formConfig.isGstEnabled ? formConfig.sgstPercent : 0)) / 100).toFixed(2),
  );
  const simCustomTaxes = (formConfig.customTaxes || [])
    .filter((t) => t.isEnabled && t.value > 0)
    .map((t) => ({
      id: t.id,
      name: t.name,
      amount:
        t.type === "percent"
          ? Number(((simulatedSubtotal * t.value) / 100).toFixed(2))
          : Number(t.value.toFixed(2)),
    }));
  const simCustomTaxesTotal = Number(
    simCustomTaxes.reduce((sum, it) => sum + it.amount, 0).toFixed(2),
  );
  const simPackaging = formConfig.packagingFee;
  const simDelivery =
    simulatedSubtotal >= formConfig.freeDeliveryThreshold ? 0 : formConfig.deliveryFee;
  const simGrandTotal = Number(
    (simulatedSubtotal + simTax + simCustomTaxesTotal + simPackaging + simDelivery).toFixed(2),
  );

  // Generate invoices from orders dynamically using configured GST rates
  const effectiveGstRate = gstBillingConfig.isGstEnabled ? gstBillingConfig.gstRatePercent : 0;
  const effectiveCgstRate = gstBillingConfig.isGstEnabled ? gstBillingConfig.cgstPercent : 0;
  const effectiveSgstRate = gstBillingConfig.isGstEnabled ? gstBillingConfig.sgstPercent : 0;

  const invoices = orders.map((o) => {
    const invoiceNum = getCleanInvoiceNumber(o.orderNumber);
    const subtotal = getOrderSubtotal(o);
    const cgst = Number(((subtotal * effectiveCgstRate) / 100).toFixed(2));
    const sgst = Number(((subtotal * effectiveSgstRate) / 100).toFixed(2));
    const totalTax = Number((cgst + sgst).toFixed(2));
    const packaging =
      o.packagingFee !== undefined
        ? o.packagingFee
        : gstBillingConfig.packagingFee > 0
          ? gstBillingConfig.packagingFee
          : 0;
    const delivery =
      o.deliveryFee !== undefined
        ? o.deliveryFee
        : subtotal >= gstBillingConfig.freeDeliveryThreshold
          ? 0
          : gstBillingConfig.deliveryFee;
    const discount = o.discountAmount || 0;
    const finalTotal = Math.round(subtotal + totalTax + packaging + delivery - discount);

    return {
      invoiceNumber: invoiceNum,
      order: o,
      subtotal,
      cgst,
      sgst,
      totalTax,
      packaging,
      delivery,
      finalTotal,
      hsnCode: gstBillingConfig.hsnSacCode,
      gstin: gstBillingConfig.restaurantGstin,
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

  const totalGstCollected = invoices.reduce(
    (sum, inv) => sum + (inv.order.paymentStatus === "paid" ? inv.totalTax : 0),
    0,
  );

  const totalInvoicedAmount = invoices.reduce(
    (sum, inv) => sum + (inv.order.paymentStatus === "paid" ? inv.finalTotal : 0),
    0,
  );

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

  const handleDeleteBill = (orderId: string, invoiceNum: string) => {
    if (confirm(`Are you sure you want to void/delete invoice ${invoiceNum}?`)) {
      deleteOrder(orderId);
      if (selectedOrderForInvoice?.id === orderId) {
        setSelectedOrderForInvoice(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          TOP BANNER KPI CARDS WITH DIRECT EDIT BUTTONS
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
                Total Invoices Issued
              </span>
              <FileText className="size-4 text-ink/40" />
            </div>
            <p className="mt-2 font-display text-2xl text-ink font-bold">
              {invoices.length} Invoices
            </p>
          </div>
          <span className="text-[10px] text-ink/60 mt-2 block">
            100% compliant with GST e-Invoicing
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
                GST Tax Rate Active
              </span>
              <Percent className="size-4 text-spice" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="font-display text-2xl text-spice font-bold">
                {gstBillingConfig.isGstEnabled ? `${gstBillingConfig.gstRatePercent}%` : "0% (Exempt)"}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={scrollToConfig}
                className="h-6 px-2 text-[10px] font-mono border-spice/30 text-spice hover:bg-spice/10 rounded-md"
              >
                ⚙️ Change Tax %
              </Button>
            </div>
          </div>
          <span className="text-[10px] text-ink/60 mt-2 block font-mono">
            CGST {gstBillingConfig.cgstPercent}% + SGST {gstBillingConfig.sgstPercent}% · Collected: ₹
            {totalGstCollected.toLocaleString()}
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
                Gross Invoiced Sales
              </span>
              <Receipt className="size-4 text-emerald-600" />
            </div>
            <p className="mt-2 font-display text-2xl text-emerald-700 font-bold">
              ₹{totalInvoicedAmount.toLocaleString()}
            </p>
          </div>
          <span className="text-[10px] text-emerald-800/80 font-medium mt-2 block">
            Audited cloud kitchen ledger
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
                Statutory Credentials
              </span>
              <Building2 className="size-4 text-ink/40" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <p
                className="font-mono text-xs font-bold text-ink truncate max-w-[140px]"
                title={gstBillingConfig.restaurantGstin}
              >
                {gstBillingConfig.restaurantGstin}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={scrollToConfig}
                className="h-6 px-2 text-[10px] font-mono border-ink/20 text-ink/70 hover:text-ink rounded-md"
              >
                ✏️ Edit Details
              </Button>
            </div>
          </div>
          <span className="text-[10px] text-ink/50 font-mono mt-2 block">
            FSSAI Lic: {gstBillingConfig.fssaiNumber}
          </span>
        </div>
      </div>

      {/* =========================================================================
          ALWAYS-VISIBLE GST BILLING & TAX CUSTOMIZATION SECTION (ADMIN PANEL CONTROL)
          ========================================================================= */}
      <div
        ref={configSectionRef}
        className="bg-white rounded-3xl border-2 border-spice/20 shadow-md p-6 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-spice text-cream shadow-md">
              <Sliders className="size-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl font-bold text-ink">
                  GST Billing & Tax Management (Customizable)
                </h3>
                <Badge
                  className={`font-mono text-[10px] ${
                    formConfig.isGstEnabled
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-stone-100 text-stone-600 border-stone-300"
                  }`}
                >
                  {formConfig.isGstEnabled
                    ? `Current Active: ${formConfig.gstRatePercent}% GST`
                    : "Current Active: 0% GST (Exempt)"}
                </Badge>
              </div>
              <p className="text-xs text-ink/70 mt-0.5">
                Admin yahan se jo bhi tax percentage, CGST/SGST split, delivery fee ya GSTIN daalega, usi se automatically saare bills aur invoices calculate honge. Backend me baar-baar code badalne ki zaroorat nahi hai!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToGstTax && (
              <Button
                type="button"
                variant="outline"
                onClick={onNavigateToGstTax}
                className="h-9 rounded-xl border-spice/40 text-spice hover:bg-spice/10 text-xs font-semibold gap-1.5 shadow-sm px-3.5"
              >
                <Sliders className="size-4" />
                <span>⚙️ Open Dedicated GST & Tax Section</span>
              </Button>
            )}
            <Button
              type="button"
              onClick={() => setIsCreatingNewBill(true)}
              className="h-9 rounded-xl bg-ink hover:bg-spice text-cream text-xs font-semibold gap-1.5 shadow-sm px-3.5"
            >
              <Plus className="size-4" />
              <span>+ Create Custom Bill</span>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Quick Presets */}
          <div className="bg-frost/60 p-4 rounded-2xl border border-ink/10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase font-bold text-ink/70 flex items-center gap-1.5">
                  <Sparkles className="size-4 text-spice" />
                  1-Click Tax Presets (Click karke direct rate select karein):
                </span>
                <span className="text-[10px] text-ink/50 font-mono hidden sm:inline">
                  Koi bhi tax apply karein ya naya tax slab permanently add/remove karein
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setShowAddPresetModal(true)}
                  className="h-8 rounded-xl bg-spice text-white hover:bg-spice/90 border-0 text-[11px] font-bold gap-1 shadow-sm px-3"
                >
                  <Plus className="size-3.5" />
                  <span>+ Add Custom Tax / Preset</span>
                </Button>

                <button
                  type="button"
                  onClick={handleResetPresets}
                  className="text-[10px] text-ink/50 hover:text-spice font-mono underline ml-1"
                  title="Reset to default government GST slabs"
                >
                  Reset Defaults
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {taxPresets.map((preset) => {
                const isActive =
                  formConfig.isGstEnabled === preset.isGstEnabled &&
                  formConfig.gstRatePercent === preset.gstRate;

                return (
                  <div
                    key={preset.id}
                    onClick={() => applyPresetById(preset.id)}
                    className={`relative p-3 rounded-2xl border text-left cursor-pointer transition-all group ${
                      isActive
                        ? "bg-spice/10 border-spice text-spice font-bold shadow-sm ring-2 ring-spice/20"
                        : "bg-white border-ink/10 hover:border-spice/50 text-ink"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="block font-bold text-sm truncate pr-6">
                        {preset.emoji} {preset.name}
                      </span>

                      {/* Permanent Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePreset(preset.id);
                        }}
                        title={`Permanently delete ${preset.name}`}
                        className="opacity-50 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 p-1 rounded-lg transition-all text-ink/40"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    <span className="text-[11px] text-ink/60 font-mono block mt-1">
                      {preset.isGstEnabled
                        ? `${preset.cgst}% CGST + ${preset.sgst}% SGST (${preset.gstRate}% Total)`
                        : "0% Zero Tax / Exempt"}
                    </span>

                    {isActive && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] font-mono text-spice font-bold">
                        <CheckCircle2 className="size-3" />
                        <span>ACTIVE SLAB</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Fields: Tax Rates, Packaging, Delivery, GSTIN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            {/* Box 1: Custom Tax Percentage */}
            <div className="p-4 rounded-2xl bg-white border-2 border-ink/10 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-ink/10 pb-2">
                <span className="font-mono text-xs font-bold uppercase text-ink flex items-center gap-1.5">
                  <Percent className="size-4 text-spice" />
                  Custom Tax Percentages
                </span>
                <label className="flex items-center gap-1.5 cursor-pointer bg-frost px-2 py-1 rounded-lg border border-ink/10">
                  <input
                    type="checkbox"
                    checked={formConfig.isGstEnabled}
                    onChange={(e) =>
                      setFormConfig((prev) => ({ ...prev, isGstEnabled: e.target.checked }))
                    }
                    className="size-4 accent-spice rounded"
                  />
                  <span className="text-xs font-semibold text-ink">Enable GST</span>
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-ink/80 font-bold flex items-center justify-between">
                  <span>Enter Total GST Rate (%)</span>
                  <span className="text-[10px] text-spice font-mono font-normal">
                    (Admin yahan jo daalega wahi calculate hoga)
                  </span>
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formConfig.gstRatePercent}
                    onChange={(e) => handleGstRateChange(parseFloat(e.target.value) || 0)}
                    disabled={!formConfig.isGstEnabled}
                    className="h-10 font-mono pr-8 text-sm font-bold text-ink rounded-xl border-2 border-spice/40 focus:border-spice bg-spice/5"
                  />
                  <span className="absolute right-3 top-2.5 font-mono text-ink/60 font-bold text-sm">
                    %
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] text-ink/70 font-mono font-medium">
                    CGST Rate (%)
                  </label>
                  <Input
                    type="number"
                    step="0.05"
                    min="0"
                    value={formConfig.cgstPercent}
                    onChange={(e) =>
                      setFormConfig((prev) => ({
                        ...prev,
                        cgstPercent: parseFloat(e.target.value) || 0,
                      }))
                    }
                    disabled={!formConfig.isGstEnabled}
                    className="h-9 font-mono text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-ink/70 font-mono font-medium">
                    SGST Rate (%)
                  </label>
                  <Input
                    type="number"
                    step="0.05"
                    min="0"
                    value={formConfig.sgstPercent}
                    onChange={(e) =>
                      setFormConfig((prev) => ({
                        ...prev,
                        sgstPercent: parseFloat(e.target.value) || 0,
                      }))
                    }
                    disabled={!formConfig.isGstEnabled}
                    className="h-9 font-mono text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-[11px] text-ink/70 font-medium">HSN / SAC Code</label>
                <Input
                  value={formConfig.hsnSacCode}
                  onChange={(e) =>
                    setFormConfig((prev) => ({ ...prev, hsnSacCode: e.target.value }))
                  }
                  placeholder="e.g. 996331"
                  className="h-9 font-mono text-xs rounded-xl"
                />
                <span className="text-[10px] text-ink/50 block font-mono">
                  996331 = Restaurant & Cloud Kitchen Services
                </span>
              </div>
            </div>

            {/* Box 2: Packaging & Delivery Fees */}
            <div className="p-4 rounded-2xl bg-white border-2 border-ink/10 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-ink/10 pb-2">
                <span className="font-mono text-xs font-bold uppercase text-ink flex items-center gap-1.5">
                  <Box className="size-4 text-spice" />
                  Packaging & Delivery Fees
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-ink/80 font-bold">Eco Packaging Fee (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-mono text-ink/50 text-xs">₹</span>
                  <Input
                    type="number"
                    min="0"
                    value={formConfig.packagingFee}
                    onChange={(e) =>
                      setFormConfig((prev) => ({
                        ...prev,
                        packagingFee: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="h-10 font-mono pl-8 text-sm font-bold text-ink rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-ink/80 font-bold">Base Delivery Fee (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-mono text-ink/50 text-xs">₹</span>
                  <Input
                    type="number"
                    min="0"
                    value={formConfig.deliveryFee}
                    onChange={(e) =>
                      setFormConfig((prev) => ({
                        ...prev,
                        deliveryFee: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="h-10 font-mono pl-8 text-sm font-bold text-ink rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-ink/80 font-bold">
                  Free Delivery On Orders Above (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-mono text-ink/50 text-xs">₹</span>
                  <Input
                    type="number"
                    min="0"
                    value={formConfig.freeDeliveryThreshold}
                    onChange={(e) =>
                      setFormConfig((prev) => ({
                        ...prev,
                        freeDeliveryThreshold: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="h-10 font-mono pl-8 text-sm font-bold text-ink rounded-xl"
                  />
                </div>
                <span className="text-[10px] text-ink/50 block font-mono">
                  Orders at or above ₹{formConfig.freeDeliveryThreshold} get ₹0 delivery fee.
                </span>
              </div>
            </div>

            {/* Box 3: Statutory Credentials */}
            <div className="p-4 rounded-2xl bg-white border-2 border-ink/10 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-ink/10 pb-2">
                <span className="font-mono text-xs font-bold uppercase text-ink flex items-center gap-1.5">
                  <Building2 className="size-4 text-spice" />
                  Statutory & Legal Details
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-ink/80 font-bold">Legal Business Name</label>
                <Input
                  value={formConfig.businessLegalName}
                  onChange={(e) =>
                    setFormConfig((prev) => ({ ...prev, businessLegalName: e.target.value }))
                  }
                  placeholder="e.g. Anima's Kitchen Cloud Kitchen LLP"
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] text-ink/70 font-mono font-medium">GSTIN</label>
                  <Input
                    value={formConfig.restaurantGstin}
                    onChange={(e) =>
                      setFormConfig((prev) => ({ ...prev, restaurantGstin: e.target.value }))
                    }
                    placeholder="10AABCA9182C1Z8"
                    className="h-9 font-mono text-xs rounded-xl uppercase font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-ink/70 font-mono font-medium">
                    FSSAI Lic. No.
                  </label>
                  <Input
                    value={formConfig.fssaiNumber}
                    onChange={(e) =>
                      setFormConfig((prev) => ({ ...prev, fssaiNumber: e.target.value }))
                    }
                    placeholder="10423000000123"
                    className="h-9 font-mono text-xs rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-ink/70 font-medium">Billing Address</label>
                <Input
                  value={formConfig.billingAddress}
                  onChange={(e) =>
                    setFormConfig((prev) => ({ ...prev, billingAddress: e.target.value }))
                  }
                  placeholder="Kitchen street, city, pincode"
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-ink/70 font-medium">Invoice Number Prefix</label>
                <Input
                  value={formConfig.invoicePrefix}
                  onChange={(e) =>
                    setFormConfig((prev) => ({ ...prev, invoicePrefix: e.target.value }))
                  }
                  placeholder="AK-PAT"
                  className="h-9 font-mono text-xs rounded-xl uppercase"
                />
              </div>
            </div>
          </div>

          {/* =========================================================================
              CUSTOM BILL TAXES & EXTRA CHARGES (RAIN TAX, ROAD TAX, CESS, ETC.)
              ========================================================================= */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-50/50 via-frost to-amber-50/40 border-2 border-spice/20 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌧️ 🛣️</span>
                  <h4 className="font-display text-base font-bold text-ink">
                    Extra Custom Bill Taxes & Surcharges (Rain Tax, Road Tax, Cess)
                  </h4>
                  <Badge className="bg-spice text-white font-mono text-[10px]">
                    Live on Customer Bills
                  </Badge>
                </div>
                <p className="text-xs text-ink/60 mt-0.5">
                  Jaise <strong>Rain Tax (Barish surge)</strong>, <strong>Road Tax / Cess</strong>, ya koi bhi alag custom tax add karein. Har naye bill me add hoga!
                </p>
              </div>

              <Button
                type="button"
                onClick={() => setShowAddCustomTaxModal(true)}
                className="h-9 rounded-xl bg-spice hover:bg-spice/90 text-white font-bold text-xs gap-1.5 shadow-md px-4 shrink-0"
              >
                <Plus className="size-4" />
                <span>+ Add Custom Bill Tax (जैसे Rain Tax, Road Tax)</span>
              </Button>
            </div>

            {/* List of Custom Bill Taxes */}
            {(!formConfig.customTaxes || formConfig.customTaxes.length === 0) ? (
              <div className="p-5 bg-white rounded-2xl border border-dashed border-ink/20 text-center text-xs text-ink/60">
                Koi extra custom tax add nahi hai. Upar <strong>"+ Add Custom Bill Tax"</strong> button daba kar Rain Tax ya Road Tax add karein.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {formConfig.customTaxes.map((tax) => (
                  <div
                    key={tax.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                      tax.isEnabled
                        ? "bg-white border-spice shadow-sm ring-2 ring-spice/20"
                        : "bg-white/60 border-ink/10 opacity-70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-sm text-ink">
                          <span>{tax.name}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-spice block mt-0.5">
                          {tax.type === "flat" ? `₹${tax.value} Flat Charge` : `${tax.value}% on Subtotal`}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteCustomTax(tax.id)}
                        title="Permanently delete this tax"
                        className="p-1 text-ink/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-ink/10 text-xs">
                      <span className="text-[11px] text-ink/60 font-medium">
                        {tax.isEnabled ? "🟢 Active on Bills" : "⚪ Inactive (Off)"}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tax.isEnabled}
                          onChange={() => handleToggleCustomTax(tax.id)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-ink/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-spice"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-[10px] text-ink/50 font-mono font-bold uppercase">
                Quick 1-Click Suggestions:
              </span>
              <button
                type="button"
                onClick={() => handleQuickAddCustomTax("🌧️ Rain Tax", "flat", 20)}
                className="px-2.5 py-1 rounded-lg bg-white border border-ink/15 hover:border-spice text-ink font-medium text-[11px] shadow-2xs hover:text-spice transition-all"
              >
                + 🌧️ Rain Tax (₹20 Flat)
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddCustomTax("🛣️ Road Tax / Cess", "percent", 1.5)}
                className="px-2.5 py-1 rounded-lg bg-white border border-ink/15 hover:border-spice text-ink font-medium text-[11px] shadow-2xs hover:text-spice transition-all"
              >
                + 🛣️ Road Tax (1.5%)
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddCustomTax("🌙 Late Night Charge", "flat", 25)}
                className="px-2.5 py-1 rounded-lg bg-white border border-ink/15 hover:border-spice text-ink font-medium text-[11px] shadow-2xs hover:text-spice transition-all"
              >
                + 🌙 Late Night Charge (₹25)
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddCustomTax("🌿 Green Environment Cess", "flat", 5)}
                className="px-2.5 py-1 rounded-lg bg-white border border-ink/15 hover:border-spice text-ink font-medium text-[11px] shadow-2xs hover:text-spice transition-all"
              >
                + 🌿 Green Cess (₹5)
              </button>
            </div>
          </div>

          {/* Live Interactive Bill Simulator */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Calculator className="size-5 text-spice" />
                <span className="font-display text-base font-bold text-ink">
                  Live Bill Calculation Simulator (Try typing test food amount)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-ink/70 font-bold">Sample Order Value:</span>
                <div className="relative w-32">
                  <span className="absolute left-2.5 top-2 font-mono text-ink/50 text-xs">₹</span>
                  <Input
                    type="number"
                    value={simulatedSubtotal}
                    onChange={(e) => setSimulatedSubtotal(parseInt(e.target.value) || 0)}
                    className="h-8 pl-6 font-mono text-xs bg-white rounded-lg font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center font-mono text-xs">
              <div className="bg-white p-3 rounded-xl border border-ink/10 shadow-sm">
                <span className="text-[10px] uppercase text-ink/50 block font-bold">Food Items</span>
                <span className="font-bold text-ink text-sm">₹{simulatedSubtotal}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-ink/10 shadow-sm">
                <span className="text-[10px] uppercase text-ink/50 block font-bold">Packaging</span>
                <span className="font-bold text-ink text-sm">+₹{simPackaging}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-ink/10 shadow-sm">
                <span className="text-[10px] uppercase text-ink/50 block font-bold">
                  CGST ({formConfig.isGstEnabled ? formConfig.cgstPercent : 0}%)
                </span>
                <span className="font-bold text-ink text-sm">+₹{simCgst}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-ink/10 shadow-sm">
                <span className="text-[10px] uppercase text-ink/50 block font-bold">
                  SGST ({formConfig.isGstEnabled ? formConfig.sgstPercent : 0}%)
                </span>
                <span className="font-bold text-ink text-sm">+₹{simSgst}</span>
              </div>

              {/* Active Custom Taxes in Simulator */}
              {simCustomTaxes.map((ct) => (
                <div key={ct.id} className="bg-amber-100/70 p-3 rounded-xl border border-amber-300 shadow-sm">
                  <span className="text-[10px] uppercase text-amber-900 block font-bold truncate" title={ct.name}>
                    {ct.name}
                  </span>
                  <span className="font-bold text-spice text-sm">+₹{ct.amount}</span>
                </div>
              ))}

              <div className="bg-white p-3 rounded-xl border border-ink/10 shadow-sm">
                <span className="text-[10px] uppercase text-ink/50 block font-bold">Delivery Fee</span>
                <span
                  className={`font-bold text-sm ${simDelivery === 0 ? "text-emerald-700 font-extrabold" : "text-ink"}`}
                >
                  {simDelivery === 0 ? "FREE" : `+₹${simDelivery}`}
                </span>
              </div>
              <div className="bg-spice/15 p-3 rounded-xl border-2 border-spice/30 shadow-sm">
                <span className="text-[10px] uppercase text-spice font-extrabold block">
                  Final Customer Bill
                </span>
                <span className="font-display font-extrabold text-spice text-lg">
                  ₹{simGrandTotal}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Save & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-ink/10">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFormConfig({ ...DEFAULT_GST_BILLING_CONFIG });
                toast.info("Settings reset to defaults (5% Cloud Kitchen)");
              }}
              className="rounded-xl text-xs h-10 border-ink/20 gap-1.5"
            >
              <RotateCcw className="size-4" />
              <span>Reset Defaults</span>
            </Button>

            <Button
              type="submit"
              size="lg"
              className="rounded-xl text-sm h-11 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-lg font-bold px-6"
            >
              <Save className="size-4" />
              <span>💾 Save GST Rates & Update All Invoices Now</span>
            </Button>
          </div>
        </form>
      </div>

      {/* =========================================================================
          INVOICES TABLE (WITH EDIT, DELETE, AND VIEW ACTIONS)
          ========================================================================= */}
      <div className="bg-white rounded-3xl border border-ink/10 shadow-sm overflow-hidden space-y-3 p-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-display text-base font-bold text-ink flex items-center gap-2">
              <Receipt className="size-4 text-spice" />
              <span>Tax Invoices & Customer Bills Ledger</span>
            </h4>
            <p className="text-xs text-ink/60">
              Click <strong>"✏️ Edit Bill"</strong> on any row to add/remove dishes, change quantity, or modify pricing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 border border-ink/15 rounded-xl px-3 py-1.5 bg-frost/50 w-full sm:w-64">
              <Search className="size-3.5 text-ink/40 shrink-0" />
              <Input
                placeholder="Search invoice #, customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none shadow-none text-xs focus-visible:ring-0 p-0 h-auto placeholder:text-ink/40 bg-transparent"
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

            <Button
              type="button"
              size="sm"
              onClick={() => setIsCreatingNewBill(true)}
              className="h-8 rounded-xl bg-spice hover:bg-ink text-cream text-xs font-semibold gap-1 shrink-0"
            >
              <Plus className="size-3.5" />
              <span>+ New Bill</span>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-ink/10">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-frost/80 border-b border-ink/10 text-ink/70 font-mono text-[10px] uppercase">
                <th className="p-3.5 pl-4 font-semibold">Invoice No.</th>
                <th className="p-3.5 font-semibold">Order ID</th>
                <th className="p-3.5 font-semibold">Customer</th>
                <th className="p-3.5 font-semibold">Date & Time</th>
                <th className="p-3.5 font-semibold">Taxable Subtotal</th>
                <th className="p-3.5 font-semibold">
                  GST ({gstBillingConfig.cgstPercent}% + {gstBillingConfig.sgstPercent}%)
                </th>
                <th className="p-3.5 font-semibold">Final Total</th>
                <th className="p-3.5 font-semibold">Payment Mode</th>
                <th className="p-3.5 pr-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-ink/50 text-xs">
                    No invoices match your search query.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.invoiceNumber} className="hover:bg-frost/40 transition-colors">
                    <td className="p-3.5 pl-4 font-mono font-bold text-ink">
                      <span className="text-spice">{inv.invoiceNumber}</span>
                    </td>
                    <td className="p-3.5 font-mono text-ink/80 font-medium">
                      {inv.order.orderNumber}
                    </td>
                    <td className="p-3.5 font-medium text-ink">
                      <div>
                        <span>{inv.order.customerName || "Guest Customer"}</span>
                        <span className="text-[10px] text-ink/50 block font-mono">
                          {formatCustomerPhone(inv.order.customerPhone)}
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
                    <td className="p-3.5 font-mono font-semibold text-ink">₹{inv.subtotal}</td>
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
                        {inv.order.paymentMethod?.toUpperCase()} · {inv.order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => setEditingOrder({ ...inv.order })}
                          className="h-8 px-3 text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95"
                          title="Edit Bill Dishes, Add/Remove Items, Pricing & Charges"
                        >
                          <Edit3 className="size-3.5" />
                          <span>✏️ Edit Bill</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedOrderForInvoice(inv.order)}
                          className="h-8 px-2.5 text-xs border-ink/20 text-ink hover:bg-frost rounded-xl gap-1 font-semibold"
                          title="View Official Tax Bill / Print"
                        >
                          <Eye className="size-3.5" />
                          <span>View</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteBill(inv.order.id, inv.invoiceNumber)}
                          className="size-8 p-0 rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700"
                          title="Void / Delete Invoice"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE BILL EDITOR MODAL (ADD / REMOVE ITEMS & CHARGES)
          ========================================================================= */}
      {editingOrder && (
        <BillEditorModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={(updatedOrder) => {
            updateOrder(updatedOrder.id, updatedOrder);
            setEditingOrder(null);
          }}
          menuItems={menuItems}
          gstBillingConfig={gstBillingConfig}
        />
      )}

      {/* =========================================================================
          CREATE CUSTOM BILL MODAL (CREATE FRESH BILL FROM SCRATCH)
          ========================================================================= */}
      {isCreatingNewBill && (
        <CreateCustomBillModal
          onClose={() => setIsCreatingNewBill(false)}
          onCreate={(newOrder) => {
            createCustomOrder(newOrder);
            setIsCreatingNewBill(false);
            setSelectedOrderForInvoice(newOrder);
          }}
          menuItems={menuItems}
          gstBillingConfig={gstBillingConfig}
        />
      )}

      {/* =========================================================================
          PRINTABLE GST TAX INVOICE MODAL
          ========================================================================= */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-ink/20 shadow-2xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Action Bar (Print / Share / Close) */}
            <div className="flex items-center justify-between border-b border-ink/10 pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-600 text-white text-[10px] font-mono">
                  ORIGINAL FOR RECIPIENT
                </Badge>
                <span className="text-xs text-ink/60">
                  {gstBillingConfig.isGstEnabled
                    ? `GST Compliant (${gstBillingConfig.gstRatePercent}%)`
                    : "Bill of Supply / Exempt"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    const ord = selectedOrderForInvoice;
                    setSelectedOrderForInvoice(null);
                    setEditingOrder({ ...ord });
                  }}
                  className="h-8 rounded-xl text-xs gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-sm"
                >
                  <Edit3 className="size-3.5" />
                  <span>✏️ Edit This Bill</span>
                </Button>
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
                      getCleanInvoiceNumber(selectedOrderForInvoice.orderNumber),
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
                <div className="flex items-center gap-3.5">
                  <img
                    src="/logo.png"
                    alt="Anima's Kitchen Logo"
                    className="size-16 rounded-full object-contain border-2 border-spice/20 shadow-xs shrink-0 bg-white"
                  />
                  <div>
                    <h2 className="font-display text-2xl font-bold text-ink">
                      {gstBillingConfig.businessLegalName || "ANIMA’S KITCHEN"}
                    </h2>
                    <p className="text-xs text-ink/70">
                      Homestyle Ghar Ka Khana & Cloud Kitchen Pvt. Ltd.
                    </p>
                    <p className="text-[11px] text-ink/60 mt-1">
                      {gstBillingConfig.billingAddress}
                    </p>
                    <p className="text-[11px] font-mono text-ink/80 mt-0.5">
                      <strong>GSTIN:</strong> {gstBillingConfig.restaurantGstin} | <strong>FSSAI:</strong>{" "}
                      {gstBillingConfig.fssaiNumber}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-base font-bold text-spice block">
                    {gstBillingConfig.isGstEnabled ? "TAX INVOICE" : "BILL OF SUPPLY"}
                  </span>
                  <p className="text-xs font-mono font-bold text-ink mt-1">
                    {getCleanInvoiceNumber(selectedOrderForInvoice.orderNumber)}
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
                    {selectedOrderForInvoice.customerName || "Guest Customer"}
                  </p>
                  <p className="text-ink/70 font-mono text-[11px] mt-0.5">
                    Phone: {formatCustomerPhone(selectedOrderForInvoice.customerPhone)}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[9px] uppercase font-bold text-ink/40 block mb-1">
                    Delivery Destination
                  </span>
                  <p className="text-ink/80 leading-relaxed text-[11px]">
                    {selectedOrderForInvoice.deliveryAddress
                      ? `${selectedOrderForInvoice.deliveryAddress.street}, ${selectedOrderForInvoice.deliveryAddress.area}, Patna - ${selectedOrderForInvoice.deliveryAddress.pincode}`
                      : "Counter Pickup / In-Store Dining"}
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
                    {selectedOrderForInvoice.items.map((item, i) => {
                      const unitRate = item.price ?? item.priceAtOrder ?? item.menuItem?.price ?? 0;
                      const taxableAmt = item.totalPrice ?? unitRate * item.quantity;

                      return (
                        <tr key={i} className="hover:bg-frost/30">
                          <td className="p-2.5 pl-3">
                            <span className="font-semibold text-ink block">
                              {item.name || item.menuItem?.name || "Dish Item"}
                            </span>
                            {item.selectedAddons && item.selectedAddons.length > 0 && (
                              <span className="text-[10px] text-ink/60 block">
                                Add-ons:{" "}
                                {item.selectedAddons
                                  .map((a: any) => a.name || a.addon?.name)
                                  .filter(Boolean)
                                  .join(", ")}
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 font-mono text-[11px] text-ink/70">
                            {gstBillingConfig.hsnSacCode}
                          </td>
                          <td className="p-2.5 font-mono text-center font-bold">{item.quantity}</td>
                          <td className="p-2.5 font-mono text-right text-ink/80">₹{unitRate}</td>
                          <td className="p-2.5 pr-3 font-mono text-right font-bold text-ink">
                            ₹{taxableAmt}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Breakdown */}
              {(() => {
                const subtotal = getOrderSubtotal(selectedOrderForInvoice);
                const cgst = Number(
                  (
                    (subtotal * (gstBillingConfig.isGstEnabled ? gstBillingConfig.cgstPercent : 0)) /
                    100
                  ).toFixed(2),
                );
                const sgst = Number(
                  (
                    (subtotal * (gstBillingConfig.isGstEnabled ? gstBillingConfig.sgstPercent : 0)) /
                    100
                  ).toFixed(2),
                );
                const packaging =
                  selectedOrderForInvoice.packagingFee !== undefined
                    ? selectedOrderForInvoice.packagingFee
                    : gstBillingConfig.packagingFee;
                const delivery = selectedOrderForInvoice.deliveryFee || 0;
                const discount = selectedOrderForInvoice.discountAmount || 0;
                const grandTotal =
                  selectedOrderForInvoice.finalTotal ||
                  Math.round(subtotal + cgst + sgst + packaging + delivery - discount);

                return (
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
                        charged at {gstBillingConfig.gstRatePercent}% flat.
                      </p>
                    </div>

                    <div className="w-64 space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between text-ink/70">
                        <span>Taxable Subtotal:</span>
                        <span>₹{subtotal}</span>
                      </div>
                      {packaging > 0 ? (
                        <div className="flex justify-between text-ink/70">
                          <span>Eco Packaging:</span>
                          <span>₹{packaging}</span>
                        </div>
                      ) : null}
                      {discount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Discount / Coupon:</span>
                          <span>-₹{discount}</span>
                        </div>
                      )}
                      {selectedOrderForInvoice.walletDeduction && (
                        <div className="flex justify-between text-spice font-semibold">
                          <span>Wallet Paid:</span>
                          <span>-₹{selectedOrderForInvoice.walletDeduction}</span>
                        </div>
                      )}
                      {gstBillingConfig.isGstEnabled && gstBillingConfig.gstRatePercent > 0 ? (
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
                      {/* Extra Custom Bill Taxes (Rain Tax, Road Tax, etc.) */}
                      {selectedOrderForInvoice.customTaxesBreakdown && selectedOrderForInvoice.customTaxesBreakdown.length > 0 ? (
                        selectedOrderForInvoice.customTaxesBreakdown.map((ct) => (
                          <div key={ct.id} className="flex justify-between text-ink/80">
                            <span>{ct.name}:</span>
                            <span>₹{ct.amount}</span>
                          </div>
                        ))
                      ) : (
                        (gstBillingConfig.customTaxes || [])
                          .filter((t) => t.isEnabled)
                          .map((ct) => {
                            const amt =
                              ct.type === "flat"
                                ? ct.value
                                : Math.round((subtotal * ct.value) / 100);
                            return (
                              <div key={ct.id} className="flex justify-between text-ink/80">
                                <span>{ct.name}:</span>
                                <span>₹{amt}</span>
                              </div>
                            );
                          })
                      )}
                      <div className="flex justify-between text-ink/70">
                        <span>Delivery Charge:</span>
                        <span>{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
                      </div>
                      <div className="border-t-2 border-ink pt-2 flex justify-between text-base font-bold text-ink">
                        <span>Total Amount:</span>
                        <span className="text-spice font-display text-lg">₹{grandTotal}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Authorized Signatory Footer */}
              <div className="pt-6 border-t border-ink/10 flex justify-between items-end text-xs">
                <div>
                  <p className="text-[10px] font-mono text-ink/50 uppercase">Customer Signature</p>
                  <div className="h-8 border-b border-ink/30 w-36 mt-1" />
                </div>
                <div className="text-right">
                  <p className="font-bold text-ink">For {gstBillingConfig.businessLegalName}</p>
                  <div className="font-display text-sm text-spice italic mt-2">
                    Authorized Signatory
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADD CUSTOM TAX PRESET MODAL
          ========================================================================= */}
      {showAddPresetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border-2 border-spice/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-frost via-white to-spice/5 border-b border-ink/10 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-ink flex items-center gap-2">
                  <span className="text-xl">{newPreset.emoji || "📋"}</span>
                  <span>Add Custom Tax / Rate Preset</span>
                </h3>
                <p className="text-xs text-ink/60">
                  Naya custom tax ya slab permanently list me add karein.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPresetModal(false)}
                className="p-1.5 rounded-xl hover:bg-ink/5 text-ink/50 hover:text-ink transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              {/* Preset Name & Emoji */}
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1 space-y-1">
                  <label className="text-[11px] font-mono font-bold text-ink/70">Icon / Emoji</label>
                  <Input
                    type="text"
                    maxLength={3}
                    value={newPreset.emoji}
                    onChange={(e) => setNewPreset((p) => ({ ...p, emoji: e.target.value }))}
                    className="h-10 text-center text-lg rounded-xl border-ink/20 font-bold"
                  />
                </div>
                <div className="col-span-3 space-y-1">
                  <label className="text-[11px] font-mono font-bold text-ink/70">
                    Tax / Preset Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. 8% Special Festive Tax, VAT 10%..."
                    value={newPreset.name}
                    onChange={(e) => setNewPreset((p) => ({ ...p, name: e.target.value }))}
                    className="h-10 rounded-xl border-ink/20 font-medium"
                  />
                </div>
              </div>

              {/* Quick Emojis */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-ink/50 font-mono">Quick Pick:</span>
                {["🍛", "🍕", "🍔", "☕", "🏢", "🥗", "🌿", "🍸", "🏷️", "🧾"].map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setNewPreset((p) => ({ ...p, emoji: em }))}
                    className={`size-7 text-sm rounded-lg border transition-all ${
                      newPreset.emoji === em
                        ? "border-spice bg-spice/10 scale-110"
                        : "border-ink/10 hover:border-ink/30 bg-frost"
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>

              {/* Tax Enable Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-frost border border-ink/10">
                <div>
                  <span className="font-bold text-ink block">Enable Tax Calculation</span>
                  <span className="text-[10px] text-ink/60">
                    If off, this preset behaves as 0% Tax Exempt
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newPreset.isGstEnabled}
                    onChange={(e) => setNewPreset((p) => ({ ...p, isGstEnabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-ink/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spice"></div>
                </label>
              </div>

              {/* Rate & Split */}
              {newPreset.isGstEnabled && (
                <div className="space-y-3 p-3.5 rounded-2xl border border-spice/20 bg-spice/5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-bold text-spice flex items-center justify-between">
                      <span>Total Tax Rate (%)</span>
                      <span className="text-[10px] font-normal text-ink/60">
                        Auto-split into CGST & SGST (50/50)
                      </span>
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={newPreset.gstRate}
                        onChange={(e) =>
                          setNewPreset((p) => ({ ...p, gstRate: parseFloat(e.target.value) || 0 }))
                        }
                        className="h-10 text-base font-bold font-mono rounded-xl border-spice/40 pr-8 bg-white"
                      />
                      <span className="absolute right-3 top-2.5 font-mono text-ink/60 font-bold">
                        %
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-ink/70">
                    <div className="p-2 bg-white rounded-xl border border-ink/10">
                      <span className="block text-ink/50 text-[10px]">CGST Share (50%)</span>
                      <span className="font-bold text-spice">
                        {(newPreset.gstRate / 2).toFixed(2)}%
                      </span>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-ink/10">
                      <span className="block text-ink/50 text-[10px]">SGST Share (50%)</span>
                      <span className="font-bold text-spice">
                        {(newPreset.gstRate / 2).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Fees & Threshold */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-ink/70">Packaging Fee (₹)</label>
                  <Input
                    type="number"
                    min="0"
                    value={newPreset.packagingFee}
                    onChange={(e) =>
                      setNewPreset((p) => ({ ...p, packagingFee: parseFloat(e.target.value) || 0 }))
                    }
                    className="h-9 rounded-xl border-ink/20 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-ink/70">Delivery Fee (₹)</label>
                  <Input
                    type="number"
                    min="0"
                    value={newPreset.deliveryFee}
                    onChange={(e) =>
                      setNewPreset((p) => ({ ...p, deliveryFee: parseFloat(e.target.value) || 0 }))
                    }
                    className="h-9 rounded-xl border-ink/20 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-ink/70">Free Delivery Above (₹)</label>
                  <Input
                    type="number"
                    min="0"
                    value={newPreset.freeDeliveryThreshold}
                    onChange={(e) =>
                      setNewPreset((p) => ({
                        ...p,
                        freeDeliveryThreshold: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="h-9 rounded-xl border-ink/20 font-mono"
                  />
                </div>
              </div>

              {/* HSN/SAC Code */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold text-ink/70">HSN / SAC Code</label>
                <Input
                  type="text"
                  placeholder="996331"
                  value={newPreset.hsnSacCode}
                  onChange={(e) => setNewPreset((p) => ({ ...p, hsnSacCode: e.target.value }))}
                  className="h-9 rounded-xl border-ink/20 font-mono"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-frost border-t border-ink/10 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddPresetModal(false)}
                className="rounded-xl text-xs h-9 border-ink/20"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddCustomPreset}
                className="rounded-xl text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 shadow-md px-4"
              >
                <Save className="size-3.5" />
                <span>Save & Add Tax Preset</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD CUSTOM BILL TAX (RAIN TAX, ROAD TAX, NIGHT CESS, ETC.)
          ========================================================================= */}
      {showAddCustomTaxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full border-2 border-spice/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-blue-50/70 via-frost to-amber-50/50 border-b border-ink/10 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-ink flex items-center gap-2">
                  <span className="text-xl">🌧️ 🛣️</span>
                  <span>Add Custom Bill Tax / Surcharge</span>
                </h3>
                <p className="text-xs text-ink/60">
                  Bill me lagne wala koi bhi custom tax add karein (e.g. Rain Tax, Road Tax).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCustomTaxModal(false)}
                className="p-1.5 rounded-xl hover:bg-ink/5 text-ink/50 hover:text-ink transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold text-ink/70">
                  Tax Name (जैसे Rain Tax, Road Tax, Cess) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Rain Tax, Road Tax, Night Surcharge..."
                  value={newCustomTax.name}
                  onChange={(e) => setNewCustomTax((p) => ({ ...p, name: e.target.value }))}
                  className="h-10 rounded-xl border-ink/20 font-medium"
                />
              </div>

              {/* Quick Suggestions Pills */}
              <div className="space-y-1">
                <span className="text-[10px] text-ink/50 font-mono">Quick Suggestions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: "🌧️ Rain Tax", type: "flat" as const, val: 20 },
                    { name: "🛣️ Road Tax", type: "percent" as const, val: 1.5 },
                    { name: "🌙 Night Surcharge", type: "flat" as const, val: 25 },
                    { name: "🌿 Green Environment Cess", type: "flat" as const, val: 5 },
                  ].map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() =>
                        setNewCustomTax({
                          name: s.name,
                          type: s.type,
                          value: s.val,
                          isEnabled: true,
                        })
                      }
                      className="px-2.5 py-1 rounded-lg border border-ink/10 hover:border-spice bg-frost text-[11px] font-medium transition-colors"
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tax Type: Flat or Percent */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-ink/70">
                  Calculation Type (Rate kis hisab se lagega)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCustomTax((p) => ({ ...p, type: "flat" }))}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      newCustomTax.type === "flat"
                        ? "bg-spice/10 border-spice text-spice font-bold ring-2 ring-spice/20"
                        : "bg-white border-ink/10 text-ink/70"
                    }`}
                  >
                    <span className="block font-bold">₹ Flat Amount</span>
                    <span className="text-[10px] opacity-75">Har order par fix rupaye (₹)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewCustomTax((p) => ({ ...p, type: "percent" }))}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      newCustomTax.type === "percent"
                        ? "bg-spice/10 border-spice text-spice font-bold ring-2 ring-spice/20"
                        : "bg-white border-ink/10 text-ink/70"
                    }`}
                  >
                    <span className="block font-bold">% Percentage</span>
                    <span className="text-[10px] opacity-75">Food total ka percentage (%)</span>
                  </button>
                </div>
              </div>

              {/* Amount or Percentage Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold text-ink/70">
                  {newCustomTax.type === "flat" ? "Tax Amount (₹ me)" : "Tax Rate (% me)"}
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    step={newCustomTax.type === "percent" ? "0.1" : "1"}
                    min="0"
                    value={newCustomTax.value}
                    onChange={(e) =>
                      setNewCustomTax((p) => ({ ...p, value: parseFloat(e.target.value) || 0 }))
                    }
                    className="h-10 text-base font-bold font-mono rounded-xl border-spice/40 pr-8 bg-white"
                  />
                  <span className="absolute right-3 top-2.5 font-mono text-ink/60 font-bold">
                    {newCustomTax.type === "flat" ? "₹" : "%"}
                  </span>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-frost border border-ink/10">
                <div>
                  <span className="font-bold text-ink block">Abhi Bill me Activate Karein</span>
                  <span className="text-[10px] text-ink/60">
                    Yeh tax turant live bills me apply hone lagega
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCustomTax.isEnabled}
                    onChange={(e) => setNewCustomTax((p) => ({ ...p, isEnabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-ink/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spice"></div>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-frost border-t border-ink/10 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddCustomTaxModal(false)}
                className="rounded-xl text-xs h-9 border-ink/20"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddCustomBillTax}
                className="rounded-xl text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 shadow-md px-4"
              >
                <Save className="size-3.5" />
                <span>Save & Add to Bill</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   SUB-COMPONENT: BILL EDITOR MODAL (ADD / REMOVE ITEMS & CHARGES)
   ========================================================================= */
interface BillEditorModalProps {
  order: Order;
  onClose: () => void;
  onSave: (updatedOrder: Order) => void;
  menuItems: MenuItem[];
  gstBillingConfig: GstBillingConfig;
}

const BillEditorModal: React.FC<BillEditorModalProps> = ({
  order,
  onClose,
  onSave,
  menuItems,
  gstBillingConfig,
}) => {
  const [customerName, setCustomerName] = useState(order.customerName || "");
  const [customerPhone, setCustomerPhone] = useState(order.customerPhone || "");
  const [streetAddress, setStreetAddress] = useState(order.deliveryAddress?.street || "Kurji Road");
  const [area, setArea] = useState(order.deliveryAddress?.area || "Patliputra Colony");
  const [pincode, setPincode] = useState(order.deliveryAddress?.pincode || "800010");

  const [items, setItems] = useState<CartItem[]>([...order.items]);
  const [packagingFee, setPackagingFee] = useState<number>(
    order.packagingFee !== undefined ? order.packagingFee : gstBillingConfig.packagingFee,
  );
  const [deliveryFee, setDeliveryFee] = useState<number>(order.deliveryFee || 0);
  const [discountAmount, setDiscountAmount] = useState<number>(order.discountAmount || 0);
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "pending" | "refunded">(
    order.paymentStatus || "pending",
  );
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "cod" | "wallet">(
    order.paymentMethod || "cod",
  );

  // New item add state
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string>("");
  const [customItemName, setCustomItemName] = useState<string>("");
  const [customItemPrice, setCustomItemPrice] = useState<number>(120);
  const [customItemQty, setCustomItemQty] = useState<number>(1);

  // Live calculated subtotal
  const currentSubtotal = items.reduce((sum, it) => {
    const p = it.price ?? it.itemTotal ?? it.menuItem?.price ?? 0;
    return sum + p * (it.quantity || 1);
  }, 0);

  const effectiveTaxRate = gstBillingConfig.isGstEnabled ? gstBillingConfig.gstRatePercent : 0;
  const currentTax = Math.round((currentSubtotal * effectiveTaxRate) / 100);
  const currentCgst = Number(
    ((currentSubtotal * (gstBillingConfig.isGstEnabled ? gstBillingConfig.cgstPercent : 0)) / 100).toFixed(2),
  );
  const currentSgst = Number(
    ((currentSubtotal * (gstBillingConfig.isGstEnabled ? gstBillingConfig.sgstPercent : 0)) / 100).toFixed(2),
  );
  const customTaxesBreakdown = calculateCustomTaxes(currentSubtotal, gstBillingConfig.customTaxes);
  const customTaxesTotal = getCustomTaxesTotal(currentSubtotal, gstBillingConfig.customTaxes);
  const currentFinalTotal = Math.max(
    0,
    Math.round(currentSubtotal + currentTax + customTaxesTotal + packagingFee + deliveryFee - discountAmount),
  );

  const handleAddItemFromMenu = () => {
    if (!selectedMenuItemId && !customItemName.trim()) {
      toast.error("Please pick a dish from the menu or type a custom item name.");
      return;
    }

    if (selectedMenuItemId) {
      const found = menuItems.find((m) => m.id === selectedMenuItemId);
      if (found) {
        const newItem: CartItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          menuItem: found,
          name: found.name,
          quantity: customItemQty > 0 ? customItemQty : 1,
          selectedAddons: [],
          priceAtOrder: found.price,
          price: found.price,
          itemTotal: found.price,
          totalPrice: found.price * (customItemQty > 0 ? customItemQty : 1),
        };
        setItems((prev) => [...prev, newItem]);
        toast.success(`Added "${found.name}" to bill!`);
      }
    } else if (customItemName.trim()) {
      const mockMenuItem: MenuItem = {
        id: `custom-dish-${Date.now()}`,
        name: customItemName.trim(),
        description: "Custom ordered dish",
        price: customItemPrice,
        category: "Custom Meals",
        image:
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80",
        isVeg: true,
        isAvailable: true,
        preparationTimeMinutes: 15,
        rating: 5,
        reviewCount: 1,
      };

      const newItem: CartItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        menuItem: mockMenuItem,
        name: customItemName.trim(),
        quantity: customItemQty > 0 ? customItemQty : 1,
        selectedAddons: [],
        priceAtOrder: customItemPrice,
        price: customItemPrice,
        itemTotal: customItemPrice,
        totalPrice: customItemPrice * (customItemQty > 0 ? customItemQty : 1),
      };
      setItems((prev) => [...prev, newItem]);
      toast.success(`Added custom item "${customItemName.trim()}" to bill!`);
      setCustomItemName("");
    }

    setSelectedMenuItemId("");
    setCustomItemQty(1);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      toast.warning("A bill must have at least one item. Add another before removing.");
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
    toast.info("Item removed from bill.");
  };

  const handleUpdateItemQty = (index: number, newQty: number) => {
    if (newQty < 1) return;
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== index) return it;
        const p = it.price ?? it.itemTotal ?? it.menuItem?.price ?? 0;
        return {
          ...it,
          quantity: newQty,
          totalPrice: p * newQty,
        };
      }),
    );
  };

  const handleUpdateItemName = (index: number, newName: string) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, name: newName } : it)),
    );
  };

  const handleUpdateItemPrice = (index: number, newPrice: number) => {
    if (newPrice < 0) return;
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== index) return it;
        return {
          ...it,
          price: newPrice,
          priceAtOrder: newPrice,
          itemTotal: newPrice,
          totalPrice: newPrice * it.quantity,
        };
      }),
    );
  };

  const handleSaveBill = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedOrder: Order = {
      ...order,
      customerName: customerName.trim() || "Guest Customer",
      customerPhone: customerPhone.trim() || "98765 43210",
      deliveryAddress: {
        id: order.deliveryAddress?.id || "addr-custom",
        label: order.deliveryAddress?.label || "Home",
        street: streetAddress,
        area: area,
        city: "Patna",
        pincode: pincode,
        coordinates: order.deliveryAddress?.coordinates || { lat: 25.6425, lng: 85.1095 },
        contactPhone: customerPhone.trim() || "98765 43210",
        contactName: customerName.trim() || "Guest Customer",
      },
      items,
      itemTotal: currentSubtotal,
      subtotal: currentSubtotal,
      taxAmount: currentTax,
      customTaxesBreakdown,
      customTaxesTotal,
      packagingFee,
      deliveryFee,
      discountAmount,
      finalTotal: currentFinalTotal,
      paymentMethod,
      paymentStatus,
    };

    onSave(updatedOrder);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-ink/20 shadow-2xl p-6 sm:p-7 max-w-2xl w-full my-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-ink/10 pb-3">
          <div>
            <h3 className="font-display text-lg font-bold text-ink flex items-center gap-2">
              <Edit3 className="size-4 text-spice" />
              <span>Customize & Edit Bill #{order.orderNumber}</span>
            </h3>
            <p className="text-xs text-ink/60">
              Add or remove dishes, adjust prices, edit customer details, and modify charges.
            </p>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full bg-frost grid place-items-center text-ink/60 hover:text-ink text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSaveBill} className="space-y-4">
          {/* Customer Details */}
          <div className="bg-frost/60 p-3.5 rounded-2xl border border-ink/10 space-y-2.5">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50 block">
              1. Customer Information
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] text-ink/70 font-medium">Customer Name</label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-8 text-xs rounded-xl"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-ink/70 font-medium">Phone Number</label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="h-8 font-mono text-xs rounded-xl"
                  placeholder="e.g. 98765 12345"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] text-ink/60 font-mono">Street Address / Landmark</label>
                <Input
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="h-8 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-ink/60 font-mono">Pincode</label>
                <Input
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="h-8 font-mono text-xs rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Line Items Table (Add / Remove) */}
          <div className="border border-ink/10 rounded-2xl p-3.5 space-y-3 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
                2. Bill Line Items ({items.length} Items)
              </span>
              <span className="font-mono text-xs text-spice font-bold">
                Subtotal: ₹{currentSubtotal}
              </span>
            </div>

            <div className="divide-y divide-ink/10 max-h-56 overflow-y-auto pr-1">
              {items.map((it, idx) => {
                const itemPrice = it.price ?? it.itemTotal ?? it.menuItem?.price ?? 0;
                return (
                  <div key={idx} className="py-2 flex items-center justify-between gap-3 text-xs">
                    <div className="flex-1">
                      <Input
                        value={it.name || it.menuItem?.name || ""}
                        onChange={(e) => handleUpdateItemName(idx, e.target.value)}
                        className="h-7 text-xs font-semibold text-ink rounded-lg bg-white"
                        placeholder="Dish Name"
                      />
                      <span className="text-[10px] text-ink/50 font-mono block mt-0.5">
                        SAC: {gstBillingConfig.hsnSacCode}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-ink/20 rounded-lg overflow-hidden h-7">
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQty(idx, it.quantity - 1)}
                          className="px-2 bg-frost hover:bg-ink/10 font-mono text-xs text-ink"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono text-xs font-bold text-ink">
                          {it.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQty(idx, it.quantity + 1)}
                          className="px-2 bg-frost hover:bg-ink/10 font-mono text-xs text-ink"
                        >
                          +
                        </button>
                      </div>

                      <div className="w-20">
                        <Input
                          type="number"
                          value={itemPrice}
                          onChange={(e) =>
                            handleUpdateItemPrice(idx, parseFloat(e.target.value) || 0)
                          }
                          className="h-7 text-xs font-mono text-right rounded-lg"
                        />
                      </div>

                      <span className="font-mono font-bold text-ink w-16 text-right">
                        ₹{itemPrice * it.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="size-7 rounded-lg grid place-items-center text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                        title="Remove dish from bill"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add New Item Row */}
            <div className="pt-2 border-t border-ink/10 bg-frost/40 p-2.5 rounded-xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-ink/60 uppercase block">
                + Add Another Dish or Custom Item:
              </span>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <select
                  value={selectedMenuItemId}
                  onChange={(e) => {
                    setSelectedMenuItemId(e.target.value);
                    if (e.target.value) setCustomItemName("");
                  }}
                  className="h-8 text-xs rounded-xl border border-ink/20 bg-white px-2 flex-1 text-ink"
                >
                  <option value="">-- Pick from Anima's Menu --</option>
                  {menuItems.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (₹{m.price})
                    </option>
                  ))}
                </select>

                {!selectedMenuItemId && (
                  <Input
                    placeholder="Or type custom item name..."
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    className="h-8 text-xs rounded-xl flex-1"
                  />
                )}

                {!selectedMenuItemId && (
                  <div className="w-20 relative">
                    <span className="absolute left-2 top-2 text-[10px] font-mono text-ink/50">₹</span>
                    <Input
                      type="number"
                      placeholder="Rate"
                      value={customItemPrice}
                      onChange={(e) => setCustomItemPrice(parseFloat(e.target.value) || 0)}
                      className="h-8 pl-5 font-mono text-xs rounded-xl"
                    />
                  </div>
                )}

                <div className="w-16">
                  <Input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={customItemQty}
                    onChange={(e) => setCustomItemQty(parseInt(e.target.value) || 1)}
                    className="h-8 font-mono text-xs rounded-xl text-center"
                  />
                </div>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddItemFromMenu}
                  className="h-8 bg-ink hover:bg-spice text-cream text-xs rounded-xl px-3 gap-1 shrink-0"
                >
                  <Plus className="size-3.5" />
                  <span>Add Item</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Charges, Taxes & Payment Status */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-ink/60 font-mono">Packaging Fee (₹)</label>
              <Input
                type="number"
                min="0"
                value={packagingFee}
                onChange={(e) => setPackagingFee(parseInt(e.target.value) || 0)}
                className="h-8 font-mono text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-ink/60 font-mono">Delivery Fee (₹)</label>
              <Input
                type="number"
                min="0"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(parseInt(e.target.value) || 0)}
                className="h-8 font-mono text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-ink/60 font-mono">Discount (₹)</label>
              <Input
                type="number"
                min="0"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(parseInt(e.target.value) || 0)}
                className="h-8 font-mono text-xs rounded-xl text-emerald-700 font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-ink/60 font-mono">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className="h-8 text-xs rounded-xl border border-ink/20 bg-white px-2 w-full font-mono capitalize"
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          {/* Net Calculation Summary */}
          <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="text-[10px] text-ink/50 uppercase block">Calculated Net Total:</span>
              <div className="text-xs text-ink/80">
                Subtotal: ₹{currentSubtotal} + GST ({effectiveTaxRate}%): ₹{currentTax} (CGST: ₹
                {currentCgst} + SGST: ₹{currentSgst})
                {customTaxesTotal > 0 && ` + Extra Taxes: ₹${customTaxesTotal}`} + Packaging: ₹
                {packagingFee} + Delivery: ₹{deliveryFee}
                {discountAmount > 0 ? ` - Discount: ₹${discountAmount}` : ""}
              </div>
            </div>
            <div className="text-right">
              <span className="font-display text-xl text-spice font-bold">₹{currentFinalTotal}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-ink/10">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-9 rounded-xl text-xs border-ink/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-9 rounded-xl text-xs bg-spice hover:bg-ink text-cream gap-1.5 shadow-md px-4 font-semibold"
            >
              <Save className="size-3.5" />
              <span>Save & Update Bill</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================================
   SUB-COMPONENT: CREATE CUSTOM BILL MODAL (CREATE FROM SCRATCH)
   ========================================================================= */
interface CreateCustomBillModalProps {
  onClose: () => void;
  onCreate: (newOrder: Order) => void;
  menuItems: MenuItem[];
  gstBillingConfig: GstBillingConfig;
}

const CreateCustomBillModal: React.FC<CreateCustomBillModalProps> = ({
  onClose,
  onCreate,
  menuItems,
  gstBillingConfig,
}) => {
  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [customerPhone, setCustomerPhone] = useState("98765 43210");
  const [streetAddress, setStreetAddress] = useState("Kurji Main Road, Patna");
  const [pincode, setPincode] = useState("800010");
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "cod">("upi");
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "pending">("paid");

  const [items, setItems] = useState<CartItem[]>(() => {
    const defaultDish = menuItems[0];
    if (defaultDish) {
      return [
        {
          id: `item-${Date.now()}-1`,
          menuItem: defaultDish,
          name: defaultDish.name,
          quantity: 2,
          selectedAddons: [],
          priceAtOrder: defaultDish.price,
          price: defaultDish.price,
          itemTotal: defaultDish.price,
          totalPrice: defaultDish.price * 2,
        },
      ];
    }
    return [];
  });

  const [packagingFee, setPackagingFee] = useState<number>(gstBillingConfig.packagingFee);
  const [deliveryFee, setDeliveryFee] = useState<number>(
    orderType === "pickup" ? 0 : gstBillingConfig.deliveryFee,
  );
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // New item add state
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string>("");
  const [customItemName, setCustomItemName] = useState<string>("");
  const [customItemPrice, setCustomItemPrice] = useState<number>(140);
  const [customItemQty, setCustomItemQty] = useState<number>(1);

  const currentSubtotal = items.reduce((sum, it) => {
    const p = it.price ?? it.itemTotal ?? it.menuItem?.price ?? 0;
    return sum + p * (it.quantity || 1);
  }, 0);

  const effectiveTaxRate = gstBillingConfig.isGstEnabled ? gstBillingConfig.gstRatePercent : 0;
  const currentTax = Math.round((currentSubtotal * effectiveTaxRate) / 100);
  const currentCgst = Number(
    ((currentSubtotal * (gstBillingConfig.isGstEnabled ? gstBillingConfig.cgstPercent : 0)) / 100).toFixed(2),
  );
  const currentSgst = Number(
    ((currentSubtotal * (gstBillingConfig.isGstEnabled ? gstBillingConfig.sgstPercent : 0)) / 100).toFixed(2),
  );
  const customTaxesBreakdown = calculateCustomTaxes(currentSubtotal, gstBillingConfig.customTaxes);
  const customTaxesTotal = getCustomTaxesTotal(currentSubtotal, gstBillingConfig.customTaxes);
  const currentFinalTotal = Math.max(
    0,
    Math.round(currentSubtotal + currentTax + customTaxesTotal + packagingFee + deliveryFee - discountAmount),
  );

  const handleAddItem = () => {
    if (!selectedMenuItemId && !customItemName.trim()) {
      toast.error("Please pick a menu item or type a custom dish name.");
      return;
    }

    if (selectedMenuItemId) {
      const found = menuItems.find((m) => m.id === selectedMenuItemId);
      if (found) {
        const newItem: CartItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          menuItem: found,
          name: found.name,
          quantity: customItemQty > 0 ? customItemQty : 1,
          selectedAddons: [],
          priceAtOrder: found.price,
          price: found.price,
          itemTotal: found.price,
          totalPrice: found.price * (customItemQty > 0 ? customItemQty : 1),
        };
        setItems((prev) => [...prev, newItem]);
        toast.success(`Added "${found.name}" to new bill!`);
      }
    } else if (customItemName.trim()) {
      const mockMenuItem: MenuItem = {
        id: `custom-dish-${Date.now()}`,
        name: customItemName.trim(),
        description: "Custom homemade meal",
        price: customItemPrice,
        category: "Custom Meals",
        image:
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80",
        isVeg: true,
        isAvailable: true,
        preparationTimeMinutes: 15,
        rating: 5,
        reviewCount: 1,
      };

      const newItem: CartItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        menuItem: mockMenuItem,
        name: customItemName.trim(),
        quantity: customItemQty > 0 ? customItemQty : 1,
        selectedAddons: [],
        priceAtOrder: customItemPrice,
        price: customItemPrice,
        itemTotal: customItemPrice,
        totalPrice: customItemPrice * (customItemQty > 0 ? customItemQty : 1),
      };
      setItems((prev) => [...prev, newItem]);
      toast.success(`Added custom item "${customItemName.trim()}"!`);
      setCustomItemName("");
    }

    setSelectedMenuItemId("");
    setCustomItemQty(1);
  };

  const handleUpdateItemName = (index: number, newName: string) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, name: newName } : it)),
    );
  };

  const handleUpdateItemQty = (index: number, newQty: number) => {
    if (newQty < 1) return;
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== index) return it;
        const p = it.price ?? it.itemTotal ?? it.menuItem?.price ?? 0;
        return {
          ...it,
          quantity: newQty,
          totalPrice: p * newQty,
        };
      }),
    );
  };

  const handleUpdateItemPrice = (index: number, newPrice: number) => {
    if (newPrice < 0) return;
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== index) return it;
        return {
          ...it,
          price: newPrice,
          priceAtOrder: newPrice,
          itemTotal: newPrice,
          totalPrice: newPrice * it.quantity,
        };
      }),
    );
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      toast.warning("A bill must contain at least 1 dish.");
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Please add at least one dish to the bill.");
      return;
    }

    const orderNum = `AK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-custom-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      customerName: customerName.trim() || "Walk-in Guest",
      customerPhone: customerPhone.trim() || "98765 43210",
      deliveryAddress: {
        id: `addr-${Date.now()}`,
        label: "Delivery Address",
        street: streetAddress,
        area: "Kurji / Patliputra",
        city: "Patna",
        pincode: pincode,
        coordinates: { lat: 25.6425, lng: 85.1095 },
        contactPhone: customerPhone.trim() || "98765 43210",
        contactName: customerName.trim() || "Walk-in Guest",
      },
      items,
      itemTotal: currentSubtotal,
      subtotal: currentSubtotal,
      taxAmount: currentTax,
      customTaxesBreakdown,
      customTaxesTotal,
      packagingFee,
      deliveryFee,
      discountAmount,
      finalTotal: currentFinalTotal,
      paymentMethod,
      paymentStatus,
      status: "placed",
      deliveryOtp: Math.floor(1000 + Math.random() * 9000).toString(),
      estimatedDeliveryMinutes: 25,
      orderType,
      timeline: [
        {
          status: "placed",
          label: "Invoice Generated",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          description: `Custom GST Invoice generated via Admin Counter`,
        },
      ],
      coordinates: {
        kitchen: { lat: 25.6425, lng: 85.1095 },
        currentRider: { lat: 25.6425, lng: 85.1095 },
        customer: { lat: 25.6425, lng: 85.1095 },
        progressRatio: 0,
      },
      currentDeliveryStep: "assigned",
    };

    onCreate(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-ink/20 shadow-2xl p-6 sm:p-7 max-w-2xl w-full my-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-ink/10 pb-3">
          <div>
            <h3 className="font-display text-lg font-bold text-ink flex items-center gap-2">
              <Plus className="size-4 text-spice" />
              <span>Create New Custom Tax Bill</span>
            </h3>
            <p className="text-xs text-ink/60">
              Generate an official GST Tax Invoice from scratch with custom items, customer name, and taxes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full bg-frost grid place-items-center text-ink/60 hover:text-ink text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCreateBill} className="space-y-4">
          {/* Customer Details */}
          <div className="bg-frost/60 p-3.5 rounded-2xl border border-ink/10 space-y-2.5">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50 block">
              1. Customer & Delivery Info
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] text-ink/70 font-medium">Customer Name</label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-8 text-xs rounded-xl"
                  placeholder="e.g. Anand Kumar"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-ink/70 font-medium">Phone Number</label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="h-8 font-mono text-xs rounded-xl"
                  placeholder="e.g. 98765 43210"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] text-ink/60 font-mono">Address / Dining Note</label>
                <Input
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="h-8 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-ink/60 font-mono">Order Type</label>
                <select
                  value={orderType}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setOrderType(val);
                    setDeliveryFee(val === "pickup" ? 0 : gstBillingConfig.deliveryFee);
                  }}
                  className="h-8 text-xs rounded-xl border border-ink/20 bg-white px-2 w-full font-mono"
                >
                  <option value="delivery">Doorstep Delivery</option>
                  <option value="pickup">Self / Counter Pickup</option>
                </select>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-ink/10 rounded-2xl p-3.5 space-y-3 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
                2. Dishes & Items in Bill
              </span>
              <span className="font-mono text-xs text-spice font-bold">
                Subtotal: ₹{currentSubtotal}
              </span>
            </div>

            <div className="divide-y divide-ink/10 max-h-56 overflow-y-auto pr-1">
              {items.map((it, idx) => {
                const itemPrice = it.price ?? it.itemTotal ?? it.menuItem?.price ?? 0;
                return (
                  <div key={idx} className="py-2 flex items-center justify-between gap-3 text-xs">
                    <div className="flex-1">
                      <Input
                        value={it.name || it.menuItem?.name || ""}
                        onChange={(e) => handleUpdateItemName(idx, e.target.value)}
                        className="h-7 text-xs font-semibold text-ink rounded-lg bg-white"
                        placeholder="Dish Name"
                      />
                      <span className="text-[10px] text-ink/50 font-mono block mt-0.5">
                        SAC: {gstBillingConfig.hsnSacCode}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-ink/20 rounded-lg overflow-hidden h-7">
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQty(idx, it.quantity - 1)}
                          className="px-2 bg-frost hover:bg-ink/10 font-mono text-xs text-ink"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono text-xs font-bold text-ink">
                          {it.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQty(idx, it.quantity + 1)}
                          className="px-2 bg-frost hover:bg-ink/10 font-mono text-xs text-ink"
                        >
                          +
                        </button>
                      </div>

                      <div className="w-20">
                        <Input
                          type="number"
                          value={itemPrice}
                          onChange={(e) =>
                            handleUpdateItemPrice(idx, parseFloat(e.target.value) || 0)
                          }
                          className="h-7 text-xs font-mono text-right rounded-lg"
                        />
                      </div>

                      <span className="font-mono font-bold text-ink w-16 text-right">
                        ₹{itemPrice * it.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="size-7 rounded-lg grid place-items-center text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                        title="Remove dish"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Item Row */}
            <div className="pt-2 border-t border-ink/10 bg-frost/40 p-2.5 rounded-xl space-y-2">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <select
                  value={selectedMenuItemId}
                  onChange={(e) => {
                    setSelectedMenuItemId(e.target.value);
                    if (e.target.value) setCustomItemName("");
                  }}
                  className="h-8 text-xs rounded-xl border border-ink/20 bg-white px-2 flex-1 text-ink"
                >
                  <option value="">-- Select from Menu --</option>
                  {menuItems.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (₹{m.price})
                    </option>
                  ))}
                </select>

                {!selectedMenuItemId && (
                  <Input
                    placeholder="Or type custom item name..."
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    className="h-8 text-xs rounded-xl flex-1"
                  />
                )}

                {!selectedMenuItemId && (
                  <div className="w-20 relative">
                    <span className="absolute left-2 top-2 text-[10px] font-mono text-ink/50">₹</span>
                    <Input
                      type="number"
                      placeholder="Rate"
                      value={customItemPrice}
                      onChange={(e) => setCustomItemPrice(parseFloat(e.target.value) || 0)}
                      className="h-8 pl-5 font-mono text-xs rounded-xl"
                    />
                  </div>
                )}

                <div className="w-16">
                  <Input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={customItemQty}
                    onChange={(e) => setCustomItemQty(parseInt(e.target.value) || 1)}
                    className="h-8 font-mono text-xs rounded-xl text-center"
                  />
                </div>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddItem}
                  className="h-8 bg-ink hover:bg-spice text-cream text-xs rounded-xl px-3 gap-1 shrink-0"
                >
                  <Plus className="size-3.5" />
                  <span>Add</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Charges & Payment */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-ink/60 font-mono">Packaging Fee (₹)</label>
              <Input
                type="number"
                min="0"
                value={packagingFee}
                onChange={(e) => setPackagingFee(parseInt(e.target.value) || 0)}
                className="h-8 font-mono text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-ink/60 font-mono">Delivery Fee (₹)</label>
              <Input
                type="number"
                min="0"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(parseInt(e.target.value) || 0)}
                className="h-8 font-mono text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-ink/60 font-mono">Payment Mode</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="h-8 text-xs rounded-xl border border-ink/20 bg-white px-2 w-full font-mono uppercase"
              >
                <option value="upi">UPI / QR</option>
                <option value="cod">Cash / COD</option>
                <option value="card">Card</option>
                <option value="netbanking">Net Banking</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-ink/60 font-mono">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className="h-8 text-xs rounded-xl border border-ink/20 bg-white px-2 w-full font-mono capitalize"
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Net Calculation Summary */}
          <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="text-[10px] text-ink/50 uppercase block">Grand Total Payable:</span>
              <div className="text-xs text-ink/80">
                Subtotal: ₹{currentSubtotal} + GST ({effectiveTaxRate}%): ₹{currentTax} (CGST: ₹
                {currentCgst} + SGST: ₹{currentSgst})
                {customTaxesTotal > 0 && ` + Extra Taxes: ₹${customTaxesTotal}`} + Packaging: ₹
                {packagingFee} + Delivery: ₹{deliveryFee}
              </div>
            </div>
            <div className="text-right">
              <span className="font-display text-xl text-spice font-bold">₹{currentFinalTotal}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-ink/10">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-9 rounded-xl text-xs border-ink/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-9 rounded-xl text-xs bg-spice hover:bg-ink text-cream gap-1.5 shadow-md px-4 font-semibold"
            >
              <Receipt className="size-3.5" />
              <span>Generate Custom Tax Invoice</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
