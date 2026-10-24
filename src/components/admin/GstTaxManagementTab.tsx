import React, { useState, useEffect } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { GstBillingConfig, CustomBillTax } from "@/types/kitchen";
import { DEFAULT_GST_BILLING_CONFIG } from "@/data/mockKitchenData";
import {
  TaxPreset,
  DEFAULT_TAX_PRESETS,
  getStoredTaxPresets,
  saveStoredTaxPresets,
} from "@/lib/taxPresets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Percent,
  Receipt,
  FileText,
  Building2,
  Box,
  Truck,
  Calculator,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Sliders,
  Download,
  ExternalLink,
  Info,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface GstTaxManagementTabProps {
  onNavigateToBilling?: () => void;
}

export const GstTaxManagementTab: React.FC<GstTaxManagementTabProps> = ({
  onNavigateToBilling,
}) => {
  const { orders, gstBillingConfig, updateGstBillingConfig } = useDemoStore();

  // Local form state for live editing
  const [formConfig, setFormConfig] = useState<GstBillingConfig>({ ...gstBillingConfig });
  const [simulatedSubtotal, setSimulatedSubtotal] = useState<number>(350);

  // ─── Custom Tax Preset Management ────────────────────────────────────
  const [taxPresets, setTaxPresets] = useState<TaxPreset[]>(() => getStoredTaxPresets());

  // Persist presets to localStorage whenever changed
  useEffect(() => {
    saveStoredTaxPresets(taxPresets);
  }, [taxPresets]);

  const handleResetPresets = () => {
    setTaxPresets(DEFAULT_TAX_PRESETS);
    saveStoredTaxPresets(DEFAULT_TAX_PRESETS);
    toast.info("Tax presets reset to government defaults!");
  };

  // Modal state for adding a new custom preset
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
    toast.success(`Custom Tax "${item.name}" added to bill! Click "Save GST Rates" to persist.`);
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


  // Sync if store changes externally
  useEffect(() => {
    setFormConfig({ ...gstBillingConfig });
  }, [gstBillingConfig]);

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

  // Apply a preset by id
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

  // Add custom preset
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
    toast.success(`Custom Tax Preset "${customPreset.name}" saved! Click it to apply.`);
  };

  // Delete a preset
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

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateGstBillingConfig(formConfig);
    toast.success("GST & Tax Configuration Saved Live!", {
      description: `All customer bills, order checkouts, and invoices now dynamically calculate at ${
        formConfig.isGstEnabled ? `${formConfig.gstRatePercent}% GST` : "0% (Exempt)"
      }.`,
    });
  };

  // Live Simulator Calculations
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

  // Financial calculations from orders
  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const totalTaxableSales = paidOrders.reduce((sum, o) => sum + (o.subtotal || o.itemTotal || 240), 0);
  const totalGstCollected = Number(
    ((totalTaxableSales * (gstBillingConfig.isGstEnabled ? gstBillingConfig.gstRatePercent : 0)) / 100).toFixed(2),
  );
  const totalCgstCollected = Number(
    ((totalTaxableSales * (gstBillingConfig.isGstEnabled ? gstBillingConfig.cgstPercent : 0)) / 100).toFixed(2),
  );
  const totalSgstCollected = Number(
    ((totalTaxableSales * (gstBillingConfig.isGstEnabled ? gstBillingConfig.sgstPercent : 0)) / 100).toFixed(2),
  );

  // Export tax ledger summary as JSON/CSV
  const handleExportTaxReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      businessLegalName: gstBillingConfig.businessLegalName,
      gstin: gstBillingConfig.restaurantGstin,
      fssai: gstBillingConfig.fssaiNumber,
      activeTaxRate: gstBillingConfig.isGstEnabled ? `${gstBillingConfig.gstRatePercent}%` : "0% (Exempt)",
      cgstRate: `${gstBillingConfig.cgstPercent}%`,
      sgstRate: `${gstBillingConfig.sgstPercent}%`,
      totalInvoicesCount: orders.length,
      paidInvoicesCount: paidOrders.length,
      grossTaxableSales: totalTaxableSales,
      totalCgst: totalCgstCollected,
      totalSgst: totalSgstCollected,
      totalGstLiability: totalGstCollected,
      hsnSacCode: gstBillingConfig.hsnSacCode,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GST_Tax_Report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("GST Tax Filing Report Downloaded!");
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          HEADER SECTION WITH QUICK ACTIONS
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-ink/10 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-spice text-cream shadow-md shrink-0">
            <Percent className="size-7" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="font-display text-2xl font-bold text-ink">
                GST & Tax Management
              </h2>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-mono text-[10px]">
                {formConfig.isGstEnabled
                  ? `Active Rate: ${formConfig.gstRatePercent}% GST`
                  : "Tax Status: 0% GST Exempt"}
              </Badge>
              <Badge variant="outline" className="text-[10px] font-mono text-ink/60 border-ink/20">
                Rule 46 CGST Act Compliant
              </Badge>
            </div>
            <p className="text-xs text-ink/70 mt-1 max-w-2xl">
              Admin panel se direct tax percentage, CGST/SGST split, delivery fee aur GSTIN configure karein. Har naya aur purana bill bina kisi backend code badle dynamically isi percentage se calculate hoga.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onNavigateToBilling && (
            <Button
              type="button"
              variant="outline"
              onClick={onNavigateToBilling}
              className="h-10 rounded-xl border-ink/20 text-xs font-semibold gap-1.5 hover:bg-frost"
            >
              <Receipt className="size-4 text-spice" />
              <span>🧾 View Invoices Ledger</span>
            </Button>
          )}

          <Button
            type="button"
            onClick={handleExportTaxReport}
            variant="outline"
            className="h-10 rounded-xl border-ink/20 text-xs font-semibold gap-1.5 hover:bg-frost"
          >
            <Download className="size-4 text-ink/70" />
            <span>Export Tax Summary</span>
          </Button>
        </div>
      </div>

      {/* =========================================================================
          KEY STATUTORY & TAX AUDIT KPI CARDS
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Active GST Rate
            </span>
            <Percent className="size-4 text-spice" />
          </div>
          <div className="mt-2">
            <p className="font-display text-3xl text-spice font-bold">
              {formConfig.isGstEnabled ? `${formConfig.gstRatePercent}%` : "0%"}
            </p>
            <span className="text-[10px] text-ink/60 font-mono mt-1 block">
              CGST: {formConfig.cgstPercent}% + SGST: {formConfig.sgstPercent}%
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Taxable Food Sales
            </span>
            <Receipt className="size-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <p className="font-display text-3xl text-emerald-700 font-bold">
              ₹{totalTaxableSales.toLocaleString()}
            </p>
            <span className="text-[10px] text-emerald-800/80 font-mono mt-1 block">
              From {paidOrders.length} paid invoices
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Total GST Collected
            </span>
            <DollarSign className="size-4 text-spice" />
          </div>
          <div className="mt-2">
            <p className="font-display text-3xl text-ink font-bold">
              ₹{totalGstCollected.toLocaleString()}
            </p>
            <span className="text-[10px] text-ink/60 font-mono mt-1 block">
              CGST: ₹{totalCgstCollected.toLocaleString()} | SGST: ₹{totalSgstCollected.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Registered GSTIN
            </span>
            <Building2 className="size-4 text-ink/40" />
          </div>
          <div className="mt-2">
            <p className="font-mono text-xs font-bold text-ink truncate" title={formConfig.restaurantGstin}>
              {formConfig.restaurantGstin}
            </p>
            <span className="text-[10px] text-ink/50 font-mono mt-1 block">
              FSSAI: {formConfig.fssaiNumber}
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          GST CONFIGURATION FORM (TAX RATES, FEES, STATUTORY CREDENTIALS)
          ========================================================================= */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="bg-white rounded-3xl border-2 border-spice/20 shadow-md p-6 space-y-6">
          {/* Quick Presets */}
          <div className="bg-frost/60 p-4 rounded-2xl border border-ink/10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase font-bold text-ink/70 flex items-center gap-1.5">
                  <Sparkles className="size-4 text-spice" />
                  1-Click Statutory Tax Presets:
                </span>
                <span className="text-[10px] text-ink/50 font-mono hidden sm:inline">
                  Click any preset to auto-fill government standard rates
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
                    className={`relative p-3.5 rounded-2xl border text-left cursor-pointer transition-all group ${
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
                        <span>ACTIVE INVOICE SLAB</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Grid: Rates, Packaging & Delivery, Credentials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            {/* Box 1: Custom Tax Percentage */}
            <div className="p-4 rounded-2xl bg-white border-2 border-ink/10 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-ink/10 pb-2">
                <span className="font-mono text-xs font-bold uppercase text-ink flex items-center gap-1.5">
                  <Percent className="size-4 text-spice" />
                  Tax Rates & Percentage
                </span>
                <label className="flex items-center gap-1.5 cursor-pointer bg-frost px-2.5 py-1 rounded-lg border border-ink/10">
                  <input
                    type="checkbox"
                    checked={formConfig.isGstEnabled}
                    onChange={(e) =>
                      setFormConfig((prev) => ({ ...prev, isGstEnabled: e.target.checked }))
                    }
                    className="size-4 accent-spice rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-ink">Enable GST</span>
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-ink/80 font-bold flex items-center justify-between">
                  <span>Enter Total GST Rate (%)</span>
                  <span className="text-[10px] text-spice font-mono font-medium">
                    (Direct percentage input)
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
                    className="h-10 font-mono pr-8 text-base font-bold text-ink rounded-xl border-2 border-spice/40 focus:border-spice bg-spice/5"
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
                <span className="text-[10px] text-ink/50 block font-mono">
                  Applied once per order for meal tray containers.
                </span>
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
                  Statutory & Legal Credentials
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
                  placeholder="AK-INV"
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

              {/* Active Custom Taxes Blocks in Simulator */}
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
        </div>
      </form>

      {/* =========================================================================
          GSTR-1 & GSTR-3B STATUTORY FILING BREAKDOWN (GOVERNMENT COMPLIANCE)
          ========================================================================= */}
      <div className="bg-white rounded-3xl border border-ink/10 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink/10 pb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-ink flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald-600" />
              <span>Monthly GST Filing Estimation & Compliance (GSTR-3B)</span>
            </h3>
            <p className="text-xs text-ink/60">
              Audited cloud kitchen ledger breakdown for quarterly/monthly GST return filing.
            </p>
          </div>

          <Badge className="bg-ink text-cream font-mono text-[10px]">
            HSN SAC: {gstBillingConfig.hsnSacCode}
          </Badge>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-ink/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-frost font-mono text-[10px] uppercase text-ink/70">
              <tr>
                <th className="p-3 pl-4">Nature of Supply</th>
                <th className="p-3">Total Taxable Value</th>
                <th className="p-3">Integrated Tax (IGST)</th>
                <th className="p-3">Central Tax (CGST {gstBillingConfig.cgstPercent}%)</th>
                <th className="p-3">State Tax (SGST {gstBillingConfig.sgstPercent}%)</th>
                <th className="p-3 pr-4 text-right">Total Tax Payable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 font-mono">
              <tr className="hover:bg-frost/30">
                <td className="p-3 pl-4 font-semibold text-ink">
                  Intra-State Cloud Kitchen Supply (Bihar - 10)
                </td>
                <td className="p-3 font-bold text-ink">₹{totalTaxableSales.toLocaleString()}</td>
                <td className="p-3 text-ink/50">₹0.00</td>
                <td className="p-3 font-semibold text-spice">₹{totalCgstCollected.toLocaleString()}</td>
                <td className="p-3 font-semibold text-spice">₹{totalSgstCollected.toLocaleString()}</td>
                <td className="p-3 pr-4 text-right font-bold text-emerald-700">
                  ₹{totalGstCollected.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

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
          ADD CUSTOM BILL TAX MODAL (RAIN TAX, ROAD TAX, CESS)
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
