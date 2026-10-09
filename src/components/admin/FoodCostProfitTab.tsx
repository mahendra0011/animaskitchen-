import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { RecipeCosting } from "@/types/kitchen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

export const FoodCostProfitTab: React.FC = () => {
  const { recipeCostings, orders } = useDemoStore();
  const [selectedDish, setSelectedDish] = useState<RecipeCosting | null>(null);

  // Calculate live statistics
  const avgFoodCostPercent =
    recipeCostings.reduce((sum, r) => sum + r.foodCostPercent, 0) / (recipeCostings.length || 1);

  const avgProfitPerDish =
    recipeCostings.reduce((sum, r) => sum + r.profitMargin, 0) / (recipeCostings.length || 1);

  // Calculate cumulative profit made today from delivered/active orders
  const todayEstimatedProfit =
    orders.reduce((sum, o) => {
      // Rough estimate: average 38% contribution margin on paid totals
      return sum + (o.paymentStatus === "paid" ? Math.round(o.finalTotal * 0.38) : 0);
    }, 0) + 48200;

  return (
    <div className="space-y-6">
      {/* KPI Metric Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
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

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
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

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
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

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Highest Margin Hero
            </span>
            <PieChart className="size-4 text-amber-500" />
          </div>
          <p className="mt-2 font-display text-lg text-ink font-bold truncate">Royal Shahi Thali</p>
          <span className="text-[10px] text-amber-600 font-bold font-mono mt-0.5 block">
            ₹104.00 net margin (41.8%)
          </span>
        </div>
      </div>

      {/* Cost Breakdown Explanation Card */}
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
          <Badge variant="outline" className="font-mono text-[10px]">
            {recipeCostings.length} Recipes Modeled
          </Badge>
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
                <th className="p-3.5 pr-4 text-right font-semibold">Recipe BOM</th>
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
                    className="hover:bg-frost/40 transition-colors cursor-pointer"
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
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs text-spice hover:bg-spice/10 gap-1 rounded-lg"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="size-3" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Granular Bill of Materials (BOM) Modal */}
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
              <button
                onClick={() => setSelectedDish(null)}
                className="size-8 rounded-full bg-frost grid place-items-center text-ink/60 hover:text-ink text-sm"
              >
                ✕
              </button>
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
                    width: `${(selectedDish.rawMaterialCost / selectedDish.sellingPrice) * 100}%`,
                  }}
                  className="bg-emerald-500 h-full"
                  title={`Raw Material: ₹${selectedDish.rawMaterialCost}`}
                />
                <div
                  style={{
                    width: `${(selectedDish.packagingCost / selectedDish.sellingPrice) * 100}%`,
                  }}
                  className="bg-blue-500 h-full"
                  title={`Packaging: ₹${selectedDish.packagingCost}`}
                />
                <div
                  style={{
                    width: `${(selectedDish.kitchenCost / selectedDish.sellingPrice) * 100}%`,
                  }}
                  className="bg-amber-500 h-full"
                  title={`Kitchen Gas & Labor: ₹${selectedDish.kitchenCost}`}
                />
                <div
                  style={{
                    width: `${(selectedDish.deliveryAlloc / selectedDish.sellingPrice) * 100}%`,
                  }}
                  className="bg-purple-500 h-full"
                  title={`Delivery: ₹${selectedDish.deliveryAlloc}`}
                />
                <div
                  style={{
                    width: `${(selectedDish.profitMargin / selectedDish.sellingPrice) * 100}%`,
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
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider font-mono">
                Recipe Raw Material Ingredients:
              </h4>
              <div className="border border-ink/10 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-frost border-b border-ink/10 text-[10px] font-mono text-ink/60 uppercase">
                    <tr>
                      <th className="p-2.5 pl-3">Raw Material Ingredient</th>
                      <th className="p-2.5">Portion per Thali</th>
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
            </div>

            <div className="flex justify-end pt-2">
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
