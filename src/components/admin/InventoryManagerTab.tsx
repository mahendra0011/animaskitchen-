import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { InventoryCategory, InventoryItem } from "@/types/kitchen";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Boxes,
  Plus,
  Minus,
  AlertTriangle,
  RotateCcw,
  Trash2,
  ShoppingCart,
  CheckCircle2,
  Search,
  Filter,
  Package,
  Layers,
  Sparkles,
} from "lucide-react";

export const InventoryManagerTab: React.FC = () => {
  const { inventoryItems, updateInventoryStock, recordWastage, recipeCostings, activityLogs } =
    useDemoStore();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [wastageModalItem, setWastageModalItem] = useState<InventoryItem | null>(null);
  const [wastageAmount, setWastageAmount] = useState<number>(1);
  const [wastageReason, setWastageReason] = useState<string>("Damaged / Spill in Kitchen");
  const [poModalItem, setPoModalItem] = useState<InventoryItem | null>(null);
  const [poQuantity, setPoQuantity] = useState<number>(25);
  const [poSuccessMessage, setPoSuccessMessage] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Items" },
    { id: "grains", label: "Grains & Rice" },
    { id: "dairy", label: "Dairy & Paneer" },
    { id: "vegetables", label: "Vegetables" },
    { id: "spices", label: "Spices" },
    { id: "oil", label: "Oil & Ghee" },
    { id: "packaging", label: "Packaging" },
    { id: "gas", label: "Commercial Gas" },
  ];

  const filteredItems = inventoryItems.filter((item) => {
    const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const lowStockCount = inventoryItems.filter(
    (item) => item.currentStock <= item.minStockLevel,
  ).length;

  const totalValuation = inventoryItems.reduce(
    (sum, item) => sum + item.currentStock * item.costPerUnit,
    0,
  );

  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poModalItem) return;
    const totalPoCost = poQuantity * poModalItem.costPerUnit;
    updateInventoryStock(poModalItem.id, poQuantity);
    setPoSuccessMessage(
      `Purchase Order PO-${Math.floor(1000 + Math.random() * 9000)} sent to ${poModalItem.supplierName}! +${poQuantity} ${poModalItem.unit} added to stock (Total: ₹${totalPoCost.toLocaleString()}).`,
    );
    setTimeout(() => {
      setPoSuccessMessage(null);
      setPoModalItem(null);
    }, 2400);
  };

  const handleConfirmWastage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wastageModalItem) return;
    recordWastage(wastageModalItem.id, wastageAmount, wastageReason);
    setWastageModalItem(null);
    setWastageAmount(1);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Total Stock Items
            </span>
            <Boxes className="size-4 text-ink/40" />
          </div>
          <p className="mt-2 font-display text-2xl text-ink font-bold">
            {inventoryItems.length} SKUs
          </p>
          <span className="text-[10px] text-ink/60 mt-0.5 block">
            Across 7 raw material categories
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Low Stock Alerts
            </span>
            <AlertTriangle
              className={`size-4 ${lowStockCount > 0 ? "text-amber-500 animate-pulse" : "text-emerald-500"}`}
            />
          </div>
          <p
            className={`mt-2 font-display text-2xl font-bold ${lowStockCount > 0 ? "text-amber-600" : "text-emerald-600"}`}
          >
            {lowStockCount} Items
          </p>
          <span className="text-[10px] text-ink/60 mt-0.5 block">
            {lowStockCount > 0 ? "Requires supplier replenishment" : "Healthy stock levels"}
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Total Inventory Value
            </span>
            <Package className="size-4 text-ink/40" />
          </div>
          <p className="mt-2 font-display text-2xl text-emerald-700 font-bold">
            ₹{Math.round(totalValuation).toLocaleString()}
          </p>
          <span className="text-[10px] text-ink/60 mt-0.5 block">
            At current wholesale cost prices
          </span>
        </div>

        <div className="rounded-2xl border border-spice/20 bg-spice/5 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-spice">
              Smart Recipe Deduction
            </span>
            <Sparkles className="size-4 text-spice" />
          </div>
          <p className="mt-2 text-xs font-semibold text-ink leading-relaxed">
            Auto-deducts raw materials (rice, dal, ghee, boxes) every time an order is placed.
          </p>
          <span className="text-[9px] font-mono text-spice mt-1 block font-bold">
            LIVE SYNCHRONIZED
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3.5 rounded-2xl border border-ink/10 shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="size-4 text-ink/40 shrink-0 ml-1" />
          <Input
            placeholder="Search raw material or supplier..."
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

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-ink text-cream shadow-sm font-semibold"
                  : "bg-frost text-ink/70 hover:bg-ink/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-ink/10 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-ink/10 flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-ink">
              Raw Materials & Ingredients Stock
            </h3>
            <p className="text-xs text-ink/60">
              Real-time pantry levels, auto-depleted on order dispatch
            </p>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-ink/20">
            {filteredItems.length} SKUs Listed
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-frost/60 border-b border-ink/10 text-ink/60 font-mono text-[10px] uppercase">
                <th className="p-3.5 pl-4 font-semibold">Ingredient / SKU</th>
                <th className="p-3.5 font-semibold">Category</th>
                <th className="p-3.5 font-semibold">Current Stock</th>
                <th className="p-3.5 font-semibold">Min Alert</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Unit Cost</th>
                <th className="p-3.5 font-semibold">Supplier</th>
                <th className="p-3.5 pr-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredItems.map((item) => {
                const isCritical = item.currentStock <= item.minStockLevel / 2;
                const isLow = item.currentStock <= item.minStockLevel && !isCritical;

                return (
                  <tr key={item.id} className="hover:bg-frost/30 transition-colors">
                    <td className="p-3.5 pl-4 font-semibold text-ink">
                      <div>
                        <span className="text-sm font-medium text-ink block">{item.name}</span>
                        <span className="text-[10px] font-mono text-ink/40">
                          Last restocked: {item.lastRestocked}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="capitalize px-2 py-0.5 rounded-md bg-frost text-ink/70 font-mono text-[10px] font-medium border border-ink/10">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-mono text-sm font-bold ${
                            isCritical ? "text-red-600" : isLow ? "text-amber-600" : "text-ink"
                          }`}
                        >
                          {item.currentStock} {item.unit}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-ink/60">
                      {item.minStockLevel} {item.unit}
                    </td>
                    <td className="p-3.5">
                      {isCritical ? (
                        <Badge className="bg-red-600 text-white border-none text-[9px] font-mono">
                          CRITICAL LOW
                        </Badge>
                      ) : isLow ? (
                        <Badge className="bg-amber-500 text-ink font-bold border-none text-[9px] font-mono">
                          LOW STOCK
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-600/10 text-emerald-800 border-emerald-600/20 text-[9px] font-mono">
                          OPTIMAL
                        </Badge>
                      )}
                    </td>
                    <td className="p-3.5 font-mono font-semibold text-ink">
                      ₹{item.costPerUnit}/{item.unit}
                    </td>
                    <td className="p-3.5 text-ink/70">
                      <span className="truncate block max-w-[120px]">{item.supplierName}</span>
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Stock adjustments */}
                        <button
                          onClick={() => updateInventoryStock(item.id, -1)}
                          title="Subtract 1 unit"
                          className="size-7 rounded-lg border border-ink/15 grid place-items-center hover:bg-ink/10 text-ink/70"
                        >
                          <Minus className="size-3" />
                        </button>
                        <button
                          onClick={() => updateInventoryStock(item.id, 5)}
                          title="Add 5 units"
                          className="size-7 rounded-lg border border-ink/15 grid place-items-center hover:bg-ink/10 text-ink/70"
                        >
                          <Plus className="size-3" />
                        </button>

                        {/* PO button */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPoModalItem(item)}
                          className="h-7 px-2 text-[10px] rounded-lg border-spice/30 text-spice hover:bg-spice/10 gap-1"
                        >
                          <ShoppingCart className="size-3" />
                          <span>Order PO</span>
                        </Button>

                        {/* Wastage */}
                        <button
                          onClick={() => setWastageModalItem(item)}
                          title="Log Wastage / Spoilage"
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

      {/* Recipe Deduction Explanation Card */}
      <div className="bg-white rounded-2xl border border-ink/10 p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="size-5 text-spice" />
          <h3 className="font-display text-base font-bold text-ink">
            Automatic Recipe Deduction Engine
          </h3>
        </div>
        <p className="text-xs text-ink/70 leading-relaxed max-w-3xl">
          Anima's Kitchen links raw materials directly to dish orders. When a customer orders a{" "}
          <strong className="text-ink">Dal Tadka Thali</strong>, the system automatically
          decrements:
          <span className="font-mono text-spice font-bold"> 180g Basmati Rice</span>,
          <span className="font-mono text-spice font-bold"> 120g Toor Dal</span>,
          <span className="font-mono text-spice font-bold"> 25g Desi Ghee</span>, and
          <span className="font-mono text-spice font-bold"> 1× 3-Slot Eco Box</span>.
        </p>
      </div>

      {/* Supplier Purchase Order Modal */}
      {poModalItem && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-white rounded-3xl border border-ink/20 shadow-2xl p-6 max-w-md w-full space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-spice">
                  Procurement PO Request
                </span>
                <h3 className="font-display text-lg font-bold text-ink">
                  Restock {poModalItem.name}
                </h3>
              </div>
              <button
                onClick={() => setPoModalItem(null)}
                className="size-8 rounded-full bg-frost grid place-items-center text-ink/60 hover:text-ink text-sm"
              >
                ✕
              </button>
            </div>

            {poSuccessMessage ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{poSuccessMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleCreatePo} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink">Supplier Name</label>
                  <Input
                    value={poModalItem.supplierName}
                    disabled
                    className="bg-frost border-ink/10 text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-ink">Quantity to Order</label>
                    <div className="flex items-center gap-1.5">
                      <Input
                        type="number"
                        min="1"
                        value={poQuantity}
                        onChange={(e) => setPoQuantity(Number(e.target.value))}
                        className="text-xs font-mono font-bold"
                      />
                      <span className="text-xs font-mono text-ink/60">{poModalItem.unit}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-ink">Cost per Unit</label>
                    <Input
                      value={`₹${poModalItem.costPerUnit}`}
                      disabled
                      className="bg-frost border-ink/10 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-frost border border-ink/10 flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink/70">Estimated PO Total:</span>
                  <span className="font-mono text-base font-bold text-ink">
                    ₹{(poQuantity * poModalItem.costPerUnit).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPoModalItem(null)}
                    className="rounded-xl text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-xl bg-spice text-white hover:bg-spice/90 text-xs font-semibold gap-1.5"
                  >
                    <ShoppingCart className="size-3.5" />
                    <span>Dispatch Purchase Order</span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Wastage Logger Modal */}
      {wastageModalItem && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-white rounded-3xl border border-ink/20 shadow-2xl p-6 max-w-md w-full space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-red-600">
                  Kitchen Loss Logging
                </span>
                <h3 className="font-display text-lg font-bold text-ink">
                  Log Wastage for {wastageModalItem.name}
                </h3>
              </div>
              <button
                onClick={() => setWastageModalItem(null)}
                className="size-8 rounded-full bg-frost grid place-items-center text-ink/60 hover:text-ink text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmWastage} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">
                  Wasted Quantity ({wastageModalItem.unit})
                </label>
                <Input
                  type="number"
                  min="0.5"
                  step="0.5"
                  max={wastageModalItem.currentStock}
                  value={wastageAmount}
                  onChange={(e) => setWastageAmount(Number(e.target.value))}
                  className="text-xs font-mono font-bold"
                />
                <span className="text-[10px] text-ink/50 block">
                  Available in pantry: {wastageModalItem.currentStock} {wastageModalItem.unit}
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Reason for Loss</label>
                <select
                  value={wastageReason}
                  onChange={(e) => setWastageReason(e.target.value)}
                  className="w-full text-xs rounded-xl border border-ink/20 bg-white p-2.5 focus:outline-none"
                >
                  <option value="Damaged / Spill in Kitchen">Accidental Spill / Dropped</option>
                  <option value="Cook Overburn / Burned on Flame">
                    Overcooked / Burned in Pot
                  </option>
                  <option value="Quality / Expiry Exceeded">Expired / Off-smell</option>
                  <option value="Packaging Broken">Packaging Seal Broken</option>
                </select>
              </div>

              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex justify-between">
                <span>Estimated Financial Loss:</span>
                <strong className="font-mono font-bold">
                  ₹{Math.round(wastageAmount * wastageModalItem.costPerUnit)}
                </strong>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setWastageModalItem(null)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-red-600 text-white hover:bg-red-700 text-xs font-semibold"
                >
                  Deduct & Log Wastage
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
