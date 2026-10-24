import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { RecipeCosting } from "@/types/kitchen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  TrendingUp,
  Percent,
  Coins,
  Receipt,
  PieChart,
  ChevronRight,
  Info,
  DollarSign,
  Utensils,
  Box,
  Flame,
  Bike,
  Plus,
  Trash2,
  Edit3,
  Sliders,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";

export const FoodCostProfitTab: React.FC = () => {
  const {
    recipeCostings,
    orders,
    addRecipeCosting,
    updateRecipeCosting,
    deleteRecipeCosting,
    menuItems,
    inventoryItems,
  } = useDemoStore();

  const [selectedDish, setSelectedDish] = useState<RecipeCosting | null>(null);

  // Add / Edit Costing Modal State
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [editingCostDish, setEditingCostDish] = useState<RecipeCosting | null>(null);

  const [costDishId, setCostDishId] = useState("");
  const [costDishName, setCostDishName] = useState("");
  const [costSellingPrice, setCostSellingPrice] = useState("189");
  const [costRawMaterial, setCostRawMaterial] = useState("52");
  const [costPackaging, setCostPackaging] = useState("9");
  const [costKitchen, setCostKitchen] = useState("15");
  const [costDelivery, setCostDelivery] = useState("20");

  // Calculate live statistics
  const avgFoodCostPercent =
    recipeCostings.reduce((sum, r) => sum + r.foodCostPercent, 0) / (recipeCostings.length || 1);

  const avgProfitPerDish =
    recipeCostings.reduce((sum, r) => sum + r.profitMargin, 0) / (recipeCostings.length || 1);

  // Cumulative profit estimate
  const todayEstimatedProfit =
    orders.reduce((sum, o) => {
      return sum + (o.paymentStatus === "paid" ? Math.round(o.finalTotal * 0.38) : 0);
    }, 0) + 48200;

  // Highest margin dish dynamically
  const highestMarginDish = [...recipeCostings].sort(
    (a, b) => b.profitMargin - a.profitMargin,
  )[0];

  const handleOpenAddModal = () => {
    setEditingCostDish(null);
    setCostDishId("");
    setCostDishName("");
    setCostSellingPrice("199");
    setCostRawMaterial("55");
    setCostPackaging("9");
    setCostKitchen("16");
    setCostDelivery("20");
    setIsCostModalOpen(true);
  };

  const handleOpenEditModal = (dish: RecipeCosting, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingCostDish(dish);
    setCostDishId(dish.itemId);
    setCostDishName(dish.itemName);
    setCostSellingPrice(String(dish.sellingPrice));
    setCostRawMaterial(String(dish.rawMaterialCost));
    setCostPackaging(String(dish.packagingCost));
    setCostKitchen(String(dish.kitchenCost));
    setCostDelivery(String(dish.deliveryAlloc));
    setIsCostModalOpen(true);
  };

  const handleSaveCostModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!costDishName.trim()) {
      toast.error("Dish ka naam likhein");
      return;
    }

    const price = Number(costSellingPrice) || 199;
    const raw = Number(costRawMaterial) || 0;
    const pack = Number(costPackaging) || 0;
    const kitchen = Number(costKitchen) || 0;
    const delivery = Number(costDelivery) || 0;

    const totalUnitCost = raw + pack + kitchen + delivery;
    const profit = Math.max(0, price - totalUnitCost);
    const foodCostPct = Number(((raw / (price || 1)) * 100).toFixed(1));
    const profitMarginPct = Number(((profit / (price || 1)) * 100).toFixed(1));

    if (editingCostDish) {
      updateRecipeCosting({
        ...editingCostDish,
        itemName: costDishName.trim(),
        sellingPrice: price,
        rawMaterialCost: raw,
        packagingCost: pack,
        kitchenCost: kitchen,
        deliveryAlloc: delivery,
        foodCostPercent: foodCostPct,
        profitMargin: Number(profit.toFixed(2)),
      });
    } else {
      const generatedId = costDishId || `custom-dish-${Date.now()}`;
      addRecipeCosting({
        itemId: generatedId,
        itemName: costDishName.trim(),
        sellingPrice: price,
        rawMaterialCost: raw,
        packagingCost: pack,
        kitchenCost: kitchen,
        deliveryAlloc: delivery,
        foodCostPercent: foodCostPct,
        profitMargin: Number(profit.toFixed(2)),
        requirements: [
          {
            rawMaterialId: "raw-boxes",
            rawMaterialName: "Meal Box",
            quantityNeeded: 1,
            unit: "pcs",
          },
        ],
      });
    }

    setIsCostModalOpen(false);
  };

  const handleDeleteCosting = (itemId: string, itemName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Remove costing model for "${itemName}"?`)) {
      deleteRecipeCosting(itemId);
      if (selectedDish?.itemId === itemId) setSelectedDish(null);
    }
  };

  // Preview calculations in modal
  const previewSelling = Number(costSellingPrice) || 199;
  const previewRaw = Number(costRawMaterial) || 0;
  const previewPack = Number(costPackaging) || 0;
  const previewKitchen = Number(costKitchen) || 0;
  const previewDelivery = Number(costDelivery) || 0;
  const previewTotalUnit = previewRaw + previewPack + previewKitchen + previewDelivery;
  const previewNetProfit = previewSelling - previewTotalUnit;
  const previewMarginPercent = Math.round((previewNetProfit / (previewSelling || 1)) * 100);
  const previewFoodCostPercent = ((previewRaw / (previewSelling || 1)) * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Hub Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-ink via-ink/95 to-ink/90 text-cream p-5 rounded-3xl shadow-sm border border-ink/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-cream/70">
              PAT-KUR-01 Hub Live · Financial ERP
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-cream mt-1">
            Food Costing & Net Margins
          </h2>
          <p className="text-xs text-cream/80 max-w-xl mt-0.5">
            Anima's Kitchen Cloud Kitchen · Kurji Main Kitchen (Flagship) (PAT-KUR-01)
          </p>
        </div>

        <Button
          onClick={handleOpenAddModal}
          size="sm"
          className="bg-spice hover:bg-spice/90 text-white rounded-xl text-xs font-semibold gap-1.5 shadow-sm h-9"
        >
          <Plus className="size-3.5" />
          <span>+ Model New Dish Costing</span>
        </Button>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Avg Food Cost %
            </span>
            <Percent className="size-4 text-emerald-600" />
          </div>
          <p className="mt-2 font-display text-2xl text-emerald-700 font-bold">
            {avgFoodCostPercent.toFixed(1)}%
          </p>
          <span className="text-[10px] text-emerald-800/80 font-medium mt-0.5 block">
            Target benchmark: 28% – 34% (Healthy)
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Avg Net Margin / Thali
            </span>
            <Coins className="size-4 text-spice" />
          </div>
          <p className="mt-2 font-display text-2xl text-spice font-bold">
            ₹{Math.round(avgProfitPerDish)}
          </p>
          <span className="text-[10px] text-ink/60 mt-0.5 block">
            After packaging, kitchen overhead & delivery
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Estimated Daily Profit
            </span>
            <TrendingUp className="size-4 text-ink/40" />
          </div>
          <p className="mt-2 font-display text-2xl text-ink font-bold">
            ₹{todayEstimatedProfit.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
            +18.2% contribution margin
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Highest Margin Hero
            </span>
            <PieChart className="size-4 text-amber-500" />
          </div>
          <p className="mt-2 font-display text-lg text-ink font-bold truncate">
            {highestMarginDish ? highestMarginDish.itemName : "Dal Tadka Thali"}
          </p>
          <span className="text-[10px] text-amber-600 font-bold font-mono mt-0.5 block">
            {highestMarginDish
              ? `₹${highestMarginDish.profitMargin.toFixed(2)} net margin (${Math.round((highestMarginDish.profitMargin / highestMarginDish.sellingPrice) * 100)}%)`
              : "₹104.00 net margin (41.8%)"}
          </span>
        </div>
      </div>

      {/* Cost Breakdown Architecture Card */}
      <div className="bg-white rounded-2xl border border-ink/10 p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Receipt className="size-4 text-spice" />
            <h3 className="font-display text-sm font-bold text-ink">
              Multi-Layer Food Costing Architecture
            </h3>
          </div>
          <p className="text-xs text-ink/60">
            Total Selling Price = Raw Materials + Eco Packaging (3-slot meal box) + Kitchen Energy &
            Labor + Delivery Fleet Allocation + Net Profit
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-ink/70 shrink-0">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-emerald-500" /> Ingredients
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-blue-500" /> Packaging
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-amber-500" /> Kitchen/Gas
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-purple-500" /> Delivery
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-spice" /> Net Profit
          </span>
        </div>
      </div>

      {/* Costing Table */}
      <div className="bg-white rounded-2xl border border-ink/10 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-ink/10 flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-ink">
              Per-Dish Recipe Costing & Margin Breakdown
            </h3>
            <p className="text-xs text-ink/60">
              Click any dish to inspect its granular Bill of Materials (BOM) & recipe ingredients
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[10px]">
              {recipeCostings.length} Recipes Modeled
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-frost/60 border-b border-ink/10 text-ink/60 font-mono text-[10px] uppercase">
                <th className="p-3.5 pl-4 font-semibold">Thali / Dish Name</th>
                <th className="p-3.5 font-semibold">Raw Material</th>
                <th className="p-3.5 font-semibold">Packaging</th>
                <th className="p-3.5 font-semibold">Kitchen/Gas</th>
                <th className="p-3.5 font-semibold">Delivery Alloc.</th>
                <th className="p-3.5 font-semibold">Selling Price</th>
                <th className="p-3.5 font-semibold">Food Cost %</th>
                <th className="p-3.5 font-semibold">Net Profit Margin</th>
                <th className="p-3.5 pr-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {recipeCostings.map((dish) => {
                const totalCost =
                  dish.rawMaterialCost + dish.packagingCost + dish.kitchenCost + dish.deliveryAlloc;
                const marginPercent = Math.round((dish.profitMargin / dish.sellingPrice) * 100);

                return (
                  <tr
                    key={dish.itemId}
                    onClick={() => setSelectedDish(dish)}
                    className="hover:bg-frost/40 transition-colors cursor-pointer group"
                  >
                    <td className="p-3.5 pl-4 font-semibold text-ink">
                      <div>
                        <span className="text-sm font-bold text-ink block">{dish.itemName}</span>
                        <span className="text-[10px] text-ink/50 font-mono">
                          Total Unit Cost: ₹{totalCost.toFixed(2)}
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono font-semibold text-ink">
                      ₹{dish.rawMaterialCost.toFixed(2)}
                    </td>

                    <td className="p-3.5 font-mono text-ink/70">
                      ₹{dish.packagingCost.toFixed(2)}
                    </td>

                    <td className="p-3.5 font-mono text-ink/70">₹{dish.kitchenCost.toFixed(2)}</td>

                    <td className="p-3.5 font-mono text-ink/70">
                      ₹{dish.deliveryAlloc.toFixed(2)}
                    </td>

                    <td className="p-3.5 font-mono text-sm font-bold text-ink">
                      ₹{dish.sellingPrice}
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                          dish.foodCostPercent <= 32
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {dish.foodCostPercent.toFixed(1)}%
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div>
                        <span className="font-mono text-sm font-bold text-spice block">
                          +₹{dish.profitMargin.toFixed(2)}
                        </span>
                        <span className="font-mono text-[10px] text-emerald-700 font-bold">
                          {marginPercent}% margin
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {/* Edit Cost Breakdown */}
                        <button
                          onClick={(e) => handleOpenEditModal(dish, e)}
                          title="Edit Cost Allocations"
                          className="size-7 rounded-lg border border-ink/15 grid place-items-center hover:bg-ink/10 text-ink/70"
                        >
                          <Edit3 className="size-3" />
                        </button>

                        {/* Inspect BOM */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedDish(dish)}
                          className="h-7 px-2 text-xs text-spice hover:bg-spice/10 gap-1 rounded-lg"
                        >
                          <span>BOM</span>
                          <ChevronRight className="size-3" />
                        </Button>

                        {/* Delete Costing */}
                        <button
                          onClick={(e) => handleDeleteCosting(dish.itemId, dish.itemName, e)}
                          title="Remove Costing Model"
                          className="size-7 rounded-lg border border-red-200 grid place-items-center hover:bg-red-50 text-red-500"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          MODALS / DIALOGS
          ========================================================================= */}

      {/* 1. Add / Edit Dish Costing Model Dialog */}
      <Dialog open={isCostModalOpen} onOpenChange={setIsCostModalOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold text-ink">
              {editingCostDish ? `Edit Costing: ${editingCostDish.itemName}` : `+ Model New Dish Costing`}
            </DialogTitle>
            <DialogDescription className="text-xs text-ink/60">
              Customize wholesale raw material, packaging, kitchen overhead, and target selling price.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveCostModel} className="space-y-4 mt-2">
            {!editingCostDish && (
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase font-bold text-ink/70">
                  Select Existing Dish or Enter Name *
                </label>
                <div className="space-y-1.5">
                  <select
                    value={costDishId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setCostDishId(id);
                      const m = menuItems.find((item) => item.id === id);
                      if (m) {
                        setCostDishName(m.name);
                        setCostSellingPrice(String(m.price));
                      }
                    }}
                    className="w-full text-xs h-9 rounded-xl border border-ink/20 px-3 bg-white text-ink"
                  >
                    <option value="">— Choose from Menu Catalog —</option>
                    {menuItems.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} (₹{m.price} · {m.category})
                      </option>
                    ))}
                  </select>

                  <Input
                    value={costDishName}
                    onChange={(e) => setCostDishName(e.target.value)}
                    placeholder="Or enter custom dish / combo name"
                    required
                    className="text-xs rounded-xl"
                  />
                </div>
              </div>
            )}

            {editingCostDish && (
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase font-bold text-ink/70">
                  Dish / Combo Name
                </label>
                <Input
                  value={costDishName}
                  onChange={(e) => setCostDishName(e.target.value)}
                  required
                  className="text-xs rounded-xl font-bold"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase font-bold text-ink/70">
                  Selling Price (₹) *
                </label>
                <Input
                  type="number"
                  step="any"
                  value={costSellingPrice}
                  onChange={(e) => setCostSellingPrice(e.target.value)}
                  required
                  className="text-xs rounded-xl font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase font-bold text-emerald-700">
                  Raw Material Cost (₹) *
                </label>
                <Input
                  type="number"
                  step="any"
                  value={costRawMaterial}
                  onChange={(e) => setCostRawMaterial(e.target.value)}
                  required
                  className="text-xs rounded-xl font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase font-bold text-blue-700">
                  Packaging (₹)
                </label>
                <Input
                  type="number"
                  step="any"
                  value={costPackaging}
                  onChange={(e) => setCostPackaging(e.target.value)}
                  className="text-xs rounded-xl font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase font-bold text-amber-700">
                  Kitchen/Gas (₹)
                </label>
                <Input
                  type="number"
                  step="any"
                  value={costKitchen}
                  onChange={(e) => setCostKitchen(e.target.value)}
                  className="text-xs rounded-xl font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase font-bold text-purple-700">
                  Delivery (₹)
                </label>
                <Input
                  type="number"
                  step="any"
                  value={costDelivery}
                  onChange={(e) => setCostDelivery(e.target.value)}
                  className="text-xs rounded-xl font-mono"
                />
              </div>
            </div>

            {/* Real-time Calculation Preview Card */}
            <div className="p-3.5 bg-frost/70 rounded-2xl border border-ink/10 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-ink/60">Total Unit Production Cost:</span>
                <span className="font-mono font-bold text-ink">₹{previewTotalUnit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink/60">Net Profit Margin:</span>
                <span className="font-mono font-bold text-spice">
                  +₹{previewNetProfit.toFixed(2)} ({previewMarginPercent}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink/60">Food Cost %:</span>
                <span
                  className={`font-mono font-bold ${
                    Number(previewFoodCostPercent) <= 34 ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {previewFoodCostPercent}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCostModalOpen(false)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-spice hover:bg-spice/90 text-white text-xs rounded-xl font-semibold shadow-sm"
              >
                {editingCostDish ? "Save Costing Changes" : "Create Cost Model"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Granular Bill of Materials (BOM) Modal */}
      {selectedDish && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-white rounded-3xl border border-ink/20 shadow-2xl p-6 max-w-lg w-full space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-spice">
                  Recipe Bill of Materials (BOM)
                </span>
                <h3 className="font-display text-lg font-bold text-ink">{selectedDish.itemName}</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenEditModal(selectedDish)}
                  className="h-8 px-2.5 text-xs text-ink/70 border-ink/20 gap-1 rounded-xl"
                >
                  <Edit3 className="size-3" />
                  <span>Edit Costs</span>
                </Button>
                <button
                  onClick={() => setSelectedDish(null)}
                  className="size-8 rounded-full bg-frost grid place-items-center text-ink/60 hover:text-ink text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Visual Cost Allocation Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-ink">
                <span>Cost Distribution Breakdown</span>
                <span className="font-mono text-spice font-bold">
                  Selling Price: ₹{selectedDish.sellingPrice}
                </span>
              </div>
              <div className="h-3 rounded-full bg-frost flex overflow-hidden border border-ink/10">
                <div
                  style={{
                    width: `${(selectedDish.rawMaterialCost / (selectedDish.sellingPrice || 1)) * 100}%`,
                  }}
                  className="bg-emerald-500 h-full"
                  title={`Raw Material: ₹${selectedDish.rawMaterialCost}`}
                />
                <div
                  style={{
                    width: `${(selectedDish.packagingCost / (selectedDish.sellingPrice || 1)) * 100}%`,
                  }}
                  className="bg-blue-500 h-full"
                  title={`Packaging: ₹${selectedDish.packagingCost}`}
                />
                <div
                  style={{
                    width: `${(selectedDish.kitchenCost / (selectedDish.sellingPrice || 1)) * 100}%`,
                  }}
                  className="bg-amber-500 h-full"
                  title={`Kitchen Gas & Labor: ₹${selectedDish.kitchenCost}`}
                />
                <div
                  style={{
                    width: `${(selectedDish.deliveryAlloc / (selectedDish.sellingPrice || 1)) * 100}%`,
                  }}
                  className="bg-purple-500 h-full"
                  title={`Delivery: ₹${selectedDish.deliveryAlloc}`}
                />
                <div
                  style={{
                    width: `${(selectedDish.profitMargin / (selectedDish.sellingPrice || 1)) * 100}%`,
                  }}
                  className="bg-spice h-full"
                  title={`Net Profit: ₹${selectedDish.profitMargin}`}
                />
              </div>

              <div className="grid grid-cols-5 gap-1 text-[9px] font-mono text-center pt-1">
                <div>
                  <span className="text-emerald-700 font-bold block">
                    ₹{selectedDish.rawMaterialCost}
                  </span>
                  <span className="text-ink/50">Ingredients</span>
                </div>
                <div>
                  <span className="text-blue-700 font-bold block">
                    ₹{selectedDish.packagingCost}
                  </span>
                  <span className="text-ink/50">Packaging</span>
                </div>
                <div>
                  <span className="text-amber-700 font-bold block">
                    ₹{selectedDish.kitchenCost}
                  </span>
                  <span className="text-ink/50">Kitchen</span>
                </div>
                <div>
                  <span className="text-purple-700 font-bold block">
                    ₹{selectedDish.deliveryAlloc}
                  </span>
                  <span className="text-ink/50">Delivery</span>
                </div>
                <div>
                  <span className="text-spice font-bold block">₹{selectedDish.profitMargin}</span>
                  <span className="text-ink/50">Net Profit</span>
                </div>
              </div>
            </div>

            {/* Ingredients Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono">
                  Recipe Raw Material Ingredients ({selectedDish.requirements.length}):
                </h4>
              </div>
              {selectedDish.requirements.length === 0 ? (
                <div className="p-4 text-center text-xs text-ink/50 bg-frost/50 rounded-xl">
                  No ingredients mapped yet.
                </div>
              ) : (
                <div className="border border-ink/10 rounded-2xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-frost border-b border-ink/10 text-[10px] font-mono text-ink/60 uppercase">
                      <tr>
                        <th className="p-2.5 pl-3">Raw Material Ingredient</th>
                        <th className="p-2.5">Portion per Serving</th>
                        <th className="p-2.5 pr-3 text-right">Auto-Deducted</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5 font-medium">
                      {selectedDish.requirements.map((req, idx) => (
                        <tr key={idx} className="hover:bg-frost/30">
                          <td className="p-2.5 pl-3 text-ink flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-spice" />
                            {req.rawMaterialName}
                          </td>
                          <td className="p-2.5 font-mono text-ink font-semibold">
                            {req.quantityNeeded} {req.unit}
                          </td>
                          <td className="p-2.5 pr-3 text-right">
                            <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[9px] font-mono">
                              ACTIVE SYNC
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenEditModal(selectedDish)}
                className="text-xs rounded-xl"
              >
                Modify Cost Allocations
              </Button>
              <Button
                onClick={() => setSelectedDish(null)}
                className="rounded-xl bg-ink text-cream hover:bg-ink/90 text-xs px-5"
              >
                Close Breakdown
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
