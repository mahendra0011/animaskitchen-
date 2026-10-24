import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { InventoryCategory, InventoryItem, RecipeCosting, RecipeRequirement } from "@/types/kitchen";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  Utensils,
  Play,
  Edit3,
  Sliders,
  Check,
  X,
  ChevronRight,
  Flame,
  Info,
  DollarSign,
  ArrowRight,
  Building2,
} from "lucide-react";
import { toast } from "sonner";

export const InventoryManagerTab: React.FC = () => {
  const {
    inventoryItems,
    updateInventoryStock,
    setInventoryStockDirect,
    recordWastage,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    recipeCostings,
    isAutoDeductionEnabled,
    setIsAutoDeductionEnabled,
    addRecipeCosting,
    updateRecipeCosting,
    deleteRecipeCosting,
    simulateRecipeDeduction,
    menuItems,
  } = useDemoStore();

  // Sub-Tab Navigation
  const [activeSubTab, setActiveSubTab] = useState<"recipes" | "stock" | "po">("recipes");

  // Stock Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Wastage Modal State
  const [wastageModalItem, setWastageModalItem] = useState<InventoryItem | null>(null);
  const [wastageAmount, setWastageAmount] = useState<number>(1);
  const [wastageReason, setWastageReason] = useState<string>("Damaged / Spill in Kitchen");

  // PO Modal State
  const [poModalItem, setPoModalItem] = useState<InventoryItem | null>(null);
  const [poQuantity, setPoQuantity] = useState<number>(25);
  const [poSuccessMessage, setPoSuccessMessage] = useState<string | null>(null);

  // Add / Edit Raw Material SKU Modal
  const [isSkuModalOpen, setIsSkuModalOpen] = useState(false);
  const [editingSku, setEditingSku] = useState<InventoryItem | null>(null);
  const [skuName, setSkuName] = useState("");
  const [skuCategory, setSkuCategory] = useState<InventoryCategory>("grains");
  const [skuStock, setSkuStock] = useState("20");
  const [skuUnit, setSkuUnit] = useState<InventoryItem["unit"]>("kg");
  const [skuMinStock, setSkuMinStock] = useState("10");
  const [skuCost, setSkuCost] = useState("100");
  const [skuSupplier, setSkuSupplier] = useState("");

  // Recipe Deduction Engine State
  const [selectedRecipeItemId, setSelectedRecipeItemId] = useState<string>(() => {
    return recipeCostings[0]?.itemId || "dish-dal-thali";
  });
  const [recipeSearch, setRecipeSearch] = useState("");

  // Add Ingredient to Recipe Builder State
  const [newIngredientRawId, setNewIngredientRawId] = useState<string>("");
  const [newIngredientAmount, setNewIngredientAmount] = useState<string>("150");
  const [newIngredientUnit, setNewIngredientUnit] = useState<string>("g");

  // Map New Dish Modal
  const [isMapDishModalOpen, setIsMapDishModalOpen] = useState(false);
  const [selectedDishToMapId, setSelectedDishToMapId] = useState<string>("");

  // Edit Single Requirement in Recipe
  const [editingRequirement, setEditingRequirement] = useState<{
    rawMaterialId: string;
    amount: string;
    unit: string;
  } | null>(null);

  // Categories list for Inventory
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

  const lowStockItems = inventoryItems.filter((item) => item.currentStock <= item.minStockLevel);
  const lowStockCount = lowStockItems.length;

  const totalValuation = inventoryItems.reduce(
    (sum, item) => sum + item.currentStock * item.costPerUnit,
    0,
  );

  // Selected Recipe for deduction
  const activeRecipe = recipeCostings.find((r) => r.itemId === selectedRecipeItemId);

  // Associated Menu Item for activeRecipe
  const activeMenuItem = menuItems.find((m) => m.id === selectedRecipeItemId);

  // Filtered recipes for the selector
  const filteredRecipes = recipeCostings.filter(
    (r) =>
      r.itemName.toLowerCase().includes(recipeSearch.toLowerCase()) ||
      r.requirements.some((req) =>
        req.rawMaterialName.toLowerCase().includes(recipeSearch.toLowerCase()),
      ),
  );

  // Dishes not yet in recipe costings
  const unmappedDishes = menuItems.filter(
    (m) => !recipeCostings.some((r) => r.itemId === m.id),
  );

  // Helper to open Add SKU Modal
  const handleOpenAddSkuModal = () => {
    setEditingSku(null);
    setSkuName("");
    setSkuCategory("grains");
    setSkuStock("25");
    setSkuUnit("kg");
    setSkuMinStock("10");
    setSkuCost("120");
    setSkuSupplier("Local Mandi Wholesaler");
    setIsSkuModalOpen(true);
  };

  // Helper to open Edit SKU Modal
  const handleOpenEditSkuModal = (sku: InventoryItem) => {
    setEditingSku(sku);
    setSkuName(sku.name);
    setSkuCategory(sku.category);
    setSkuStock(String(sku.currentStock));
    setSkuUnit(sku.unit);
    setSkuMinStock(String(sku.minStockLevel));
    setSkuCost(String(sku.costPerUnit));
    setSkuSupplier(sku.supplierName);
    setIsSkuModalOpen(true);
  };

  // Save SKU
  const handleSaveSku = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skuName.trim()) {
      toast.error("Raw material ka naam likhein");
      return;
    }

    const costNum = Number(skuCost) || 50;
    const stockNum = Number(skuStock) || 0;
    const minStockNum = Number(skuMinStock) || 5;

    if (editingSku) {
      updateInventoryItem({
        ...editingSku,
        name: skuName.trim(),
        category: skuCategory,
        currentStock: stockNum,
        unit: skuUnit,
        minStockLevel: minStockNum,
        costPerUnit: costNum,
        supplierName: skuSupplier.trim() || "Approved Supplier",
      });
    } else {
      addInventoryItem({
        name: skuName.trim(),
        category: skuCategory,
        currentStock: stockNum,
        unit: skuUnit,
        minStockLevel: minStockNum,
        costPerUnit: costNum,
        supplierName: skuSupplier.trim() || "Approved Supplier",
      });
    }
    setIsSkuModalOpen(false);
  };

  // PO creation
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

  // Wastage record
  const handleConfirmWastage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wastageModalItem) return;
    recordWastage(wastageModalItem.id, wastageAmount, wastageReason);
    setWastageModalItem(null);
    setWastageAmount(1);
  };

  // Helper to normalize input quantity to raw material inventory base unit
  const convertToInventoryUnit = (
    inputAmount: number,
    inputUnit: string,
    rawItemUnit: InventoryItem["unit"],
  ): number => {
    if (rawItemUnit === "kg") {
      if (inputUnit === "g" || inputUnit === "gms") return inputAmount / 1000;
      return inputAmount; // already kg
    }
    if (rawItemUnit === "ltr") {
      if (inputUnit === "ml") return inputAmount / 1000;
      return inputAmount; // already ltr
    }
    return inputAmount; // pcs, cylinder, etc.
  };

  // Add / Link Ingredient to Active Recipe
  const handleAddIngredientToRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRecipe) {
      toast.error("Pehle recipe select karein");
      return;
    }

    const rawItem = inventoryItems.find((i) => i.id === newIngredientRawId);
    if (!rawItem) {
      toast.error("Raw material ingredient select karein");
      return;
    }

    const inputNum = Number(newIngredientAmount);
    if (!inputNum || inputNum <= 0) {
      toast.error("Valid quantity dalein");
      return;
    }

    const normalizedQuantity = convertToInventoryUnit(inputNum, newIngredientUnit, rawItem.unit);

    const updatedRequirements = [...activeRecipe.requirements];
    const existingIdx = updatedRequirements.findIndex((r) => r.rawMaterialId === rawItem.id);

    const requirementObj: RecipeRequirement = {
      rawMaterialId: rawItem.id,
      rawMaterialName: rawItem.name,
      quantityNeeded: Number(normalizedQuantity.toFixed(4)),
      unit: rawItem.unit,
    };

    if (existingIdx >= 0) {
      updatedRequirements[existingIdx] = requirementObj;
    } else {
      updatedRequirements.push(requirementObj);
    }

    // Recalculate raw material cost
    const newRawCost = Math.round(
      updatedRequirements.reduce((sum, req) => {
        const item = inventoryItems.find((i) => i.id === req.rawMaterialId);
        return sum + (item ? item.costPerUnit * req.quantityNeeded : 0);
      }, 0),
    );

    const totalDishCost =
      newRawCost + activeRecipe.packagingCost + activeRecipe.kitchenCost + activeRecipe.deliveryAlloc;
    const foodCostPct = Number(
      ((newRawCost / (activeRecipe.sellingPrice || 1)) * 100).toFixed(1),
    );
    const profitMarginPct = Number(
      (
        (((activeRecipe.sellingPrice - totalDishCost) / (activeRecipe.sellingPrice || 1)) * 100).toFixed(1)
      ),
    );

    updateRecipeCosting({
      ...activeRecipe,
      rawMaterialCost: newRawCost,
      foodCostPercent: foodCostPct,
      profitMargin: profitMarginPct,
      requirements: updatedRequirements,
    });

    setNewIngredientRawId("");
    setNewIngredientAmount("100");
    toast.success(`Linked ${rawItem.name} (${inputNum} ${newIngredientUnit}) to ${activeRecipe.itemName}!`);
  };

  // Remove Ingredient from Active Recipe
  const handleRemoveIngredientFromRecipe = (rawMaterialId: string) => {
    if (!activeRecipe) return;

    const updatedRequirements = activeRecipe.requirements.filter(
      (r) => r.rawMaterialId !== rawMaterialId,
    );

    const newRawCost = Math.round(
      updatedRequirements.reduce((sum, req) => {
        const item = inventoryItems.find((i) => i.id === req.rawMaterialId);
        return sum + (item ? item.costPerUnit * req.quantityNeeded : 0);
      }, 0),
    );

    const totalDishCost =
      newRawCost + activeRecipe.packagingCost + activeRecipe.kitchenCost + activeRecipe.deliveryAlloc;
    const foodCostPct = Number(
      ((newRawCost / (activeRecipe.sellingPrice || 1)) * 100).toFixed(1),
    );
    const profitMarginPct = Number(
      (
        (((activeRecipe.sellingPrice - totalDishCost) / (activeRecipe.sellingPrice || 1)) * 100).toFixed(1)
      ),
    );

    updateRecipeCosting({
      ...activeRecipe,
      rawMaterialCost: newRawCost,
      foodCostPercent: foodCostPct,
      profitMargin: profitMarginPct,
      requirements: updatedRequirements,
    });
    toast.info("Ingredient removed from recipe");
  };

  // Save edited requirement
  const handleSaveEditedRequirement = () => {
    if (!activeRecipe || !editingRequirement) return;

    const rawItem = inventoryItems.find((i) => i.id === editingRequirement.rawMaterialId);
    if (!rawItem) return;

    const inputNum = Number(editingRequirement.amount);
    if (!inputNum || inputNum <= 0) {
      toast.error("Valid quantity dalein");
      return;
    }

    const normalizedQuantity = convertToInventoryUnit(
      inputNum,
      editingRequirement.unit,
      rawItem.unit,
    );

    const updatedRequirements = activeRecipe.requirements.map((req) => {
      if (req.rawMaterialId === editingRequirement.rawMaterialId) {
        return {
          ...req,
          quantityNeeded: Number(normalizedQuantity.toFixed(4)),
        };
      }
      return req;
    });

    const newRawCost = Math.round(
      updatedRequirements.reduce((sum, req) => {
        const item = inventoryItems.find((i) => i.id === req.rawMaterialId);
        return sum + (item ? item.costPerUnit * req.quantityNeeded : 0);
      }, 0),
    );

    const totalDishCost =
      newRawCost + activeRecipe.packagingCost + activeRecipe.kitchenCost + activeRecipe.deliveryAlloc;
    const foodCostPct = Number(
      ((newRawCost / (activeRecipe.sellingPrice || 1)) * 100).toFixed(1),
    );
    const profitMarginPct = Number(
      (
        (((activeRecipe.sellingPrice - totalDishCost) / (activeRecipe.sellingPrice || 1)) * 100).toFixed(1)
      ),
    );

    updateRecipeCosting({
      ...activeRecipe,
      rawMaterialCost: newRawCost,
      foodCostPercent: foodCostPct,
      profitMargin: profitMarginPct,
      requirements: updatedRequirements,
    });

    setEditingRequirement(null);
    toast.success("Requirement quantity updated");
  };

  // Map a new dish to Recipe Costing
  const handleMapNewDish = (e: React.FormEvent) => {
    e.preventDefault();
    const dish = menuItems.find((m) => m.id === selectedDishToMapId);
    if (!dish) {
      toast.error("Dish select karein");
      return;
    }

    const newRecipe: RecipeCosting = {
      itemId: dish.id,
      itemName: dish.name,
      rawMaterialCost: Math.round(dish.price * 0.28),
      packagingCost: 9,
      kitchenCost: 15,
      deliveryAlloc: 20,
      sellingPrice: dish.price,
      foodCostPercent: 28.0,
      profitMargin: 48.0,
      requirements: [
        {
          rawMaterialId: "raw-boxes",
          rawMaterialName: "Meal Box",
          quantityNeeded: 1,
          unit: "pcs",
        },
      ],
    };

    addRecipeCosting(newRecipe);
    setSelectedRecipeItemId(dish.id);
    setIsMapDishModalOpen(false);
    setSelectedDishToMapId("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Hub Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-ink via-ink/95 to-ink/90 text-cream p-5 rounded-3xl shadow-sm border border-ink/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-cream/70">
              PAT-KUR-01 Hub Live · Cloud Kitchen ERP
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-cream mt-1">
            Inventory & Raw Material Stock
          </h2>
          <p className="text-xs text-cream/80 max-w-xl mt-0.5">
            Anima's Kitchen Cloud Kitchen · Kurji Main Kitchen (Flagship) (PAT-KUR-01)
          </p>
        </div>

        {/* Global Auto-Deduction Switch */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono font-bold block text-cream/80">
              Automatic Recipe Deduction
            </span>
            <span
              className={`text-xs font-bold ${
                isAutoDeductionEnabled ? "text-emerald-300" : "text-amber-300"
              }`}
            >
              {isAutoDeductionEnabled ? "ENGINE ACTIVE" : "PAUSED"}
            </span>
          </div>
          <Switch
            checked={isAutoDeductionEnabled}
            onCheckedChange={(checked) => {
              setIsAutoDeductionEnabled(checked);
              toast[checked ? "success" : "warning"](
                checked
                  ? "Automatic Recipe Deduction Engine Enabled! Raw materials will deplete on customer orders."
                  : "Recipe Deduction Engine Paused.",
              );
            }}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
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

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Low Stock Alerts
            </span>
            <AlertTriangle
              className={`size-4 ${
                lowStockCount > 0 ? "text-amber-500 animate-pulse" : "text-emerald-500"
              }`}
            />
          </div>
          <p
            className={`mt-2 font-display text-2xl font-bold ${
              lowStockCount > 0 ? "text-amber-600" : "text-emerald-600"
            }`}
          >
            {lowStockCount} Items
          </p>
          <span className="text-[10px] text-ink/60 mt-0.5 block">
            {lowStockCount > 0
              ? `${lowStockCount} items below minimum safety threshold`
              : "Healthy stock levels across pantry"}
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
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

        <div className="rounded-2xl border border-spice/20 bg-spice/5 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-spice">
              Configured Recipes
            </span>
            <Layers className="size-4 text-spice" />
          </div>
          <p className="mt-2 font-display text-2xl text-ink font-bold">
            {recipeCostings.length} Dishes
          </p>
          <span className="text-[10px] text-spice font-semibold mt-0.5 block">
            Linked to live customer order deductions
          </span>
        </div>
      </div>

      {/* Main Sub-Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-ink/10 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveSubTab("recipes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeSubTab === "recipes"
                ? "bg-spice text-white font-semibold shadow-sm"
                : "bg-frost text-ink/70 hover:bg-ink/5"
            }`}
          >
            <Layers className="size-3.5" />
            <span>Automatic Recipe Deduction Engine (BOM)</span>
            <Badge className="bg-white/20 text-white text-[9px] px-1.5 py-0 border-none">
              Customizable
            </Badge>
          </button>

          <button
            onClick={() => setActiveSubTab("stock")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeSubTab === "stock"
                ? "bg-ink text-cream font-semibold shadow-sm"
                : "bg-frost text-ink/70 hover:bg-ink/5"
            }`}
          >
            <Boxes className="size-3.5" />
            <span>Raw Materials & Ingredients Stock</span>
            <Badge className="bg-ink/10 text-ink text-[9px] px-1.5 py-0 border-none">
              {inventoryItems.length} SKUs
            </Badge>
          </button>

          <button
            onClick={() => setActiveSubTab("po")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeSubTab === "po"
                ? "bg-amber-600 text-white font-semibold shadow-sm"
                : "bg-frost text-ink/70 hover:bg-ink/5"
            }`}
          >
            <ShoppingCart className="size-3.5" />
            <span>Procurement & Replenishment</span>
            {lowStockCount > 0 && (
              <Badge className="bg-red-500 text-white text-[9px] px-1.5 py-0 border-none animate-pulse">
                {lowStockCount} Alert
              </Badge>
            )}
          </button>
        </div>

        {activeSubTab === "stock" && (
          <Button
            size="sm"
            onClick={handleOpenAddSkuModal}
            className="bg-spice hover:bg-spice/90 text-white rounded-xl text-xs font-semibold gap-1.5 shadow-sm h-8"
          >
            <Plus className="size-3.5" />
            <span>+ Add Raw Material SKU</span>
          </Button>
        )}

        {activeSubTab === "recipes" && (
          <Button
            size="sm"
            onClick={() => setIsMapDishModalOpen(true)}
            className="bg-ink hover:bg-ink/90 text-cream rounded-xl text-xs font-semibold gap-1.5 shadow-sm h-8"
          >
            <Plus className="size-3.5" />
            <span>+ Link New Dish to Recipe Engine</span>
          </Button>
        )}
      </div>

      {/* =========================================================================
          TAB 1: AUTOMATIC RECIPE DEDUCTION ENGINE (BOM MANAGER)
          ========================================================================= */}
      {activeSubTab === "recipes" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Explanation / Feature Highlight */}
          <div className="bg-gradient-to-r from-spice/10 via-amber-500/10 to-orange-500/5 rounded-2xl border border-spice/20 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-spice" />
                  <h3 className="font-display text-base font-bold text-ink">
                    Automatic Recipe Deduction Engine (Recipe BOM)
                  </h3>
                </div>
                <p className="text-xs text-ink/70 leading-relaxed max-w-3xl">
                  Anima's Kitchen links raw materials directly to dish orders. When a customer orders
                  a <strong className="text-ink">Dal Tadka Thali</strong>, the system automatically
                  decrements:
                  <span className="font-mono text-spice font-bold"> 180g Basmati Rice</span>,
                  <span className="font-mono text-spice font-bold"> 120g Toor Dal</span>,
                  <span className="font-mono text-spice font-bold"> 25g Desi Ghee</span>, and
                  <span className="font-mono text-spice font-bold"> 1× 3-Slot Eco Box</span>.
                  <span className="block mt-1 font-semibold text-spice">
                    ✨ Ab aap kisi bhi dish, thali, ya combo ke liye raw material deductions add,
                    edit aur customize kar sakte hain!
                  </span>
                </p>
              </div>

              {activeRecipe && (
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => simulateRecipeDeduction(activeRecipe.itemId, 1)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold gap-1.5 shadow-sm"
                  >
                    <Play className="size-3 fill-current" />
                    <span>🧪 Test 1× Order Deduction</span>
                  </Button>
                  <span className="text-[10px] text-ink/50 font-mono">
                    Tests real-time stock decrement
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Dish Selector & Recipe Config Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Dish Selector (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="bg-white rounded-2xl border border-ink/10 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-sm font-bold text-ink">Select Dish / Recipe</h4>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {filteredRecipes.length} Modeled
                  </Badge>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="size-3.5 absolute left-3 top-2.5 text-ink/40" />
                  <Input
                    placeholder="Search dish or ingredient..."
                    value={recipeSearch}
                    onChange={(e) => setRecipeSearch(e.target.value)}
                    className="pl-8 text-xs h-8 rounded-xl border-ink/15"
                  />
                </div>

                {/* Dish list */}
                <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                  {filteredRecipes.map((recipe) => {
                    const isSelected = recipe.itemId === selectedRecipeItemId;
                    const dish = menuItems.find((m) => m.id === recipe.itemId);

                    return (
                      <button
                        key={recipe.itemId}
                        onClick={() => setSelectedRecipeItemId(recipe.itemId)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-spice/10 border-spice text-ink font-semibold shadow-xs"
                            : "bg-white border-ink/10 text-ink/80 hover:bg-frost/60 hover:border-ink/20"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {dish?.image ? (
                            <img
                              src={dish.image}
                              alt={recipe.itemName}
                              className="size-9 rounded-lg object-cover shrink-0 border border-ink/10"
                            />
                          ) : (
                            <div className="size-9 rounded-lg bg-spice/10 text-spice grid place-items-center shrink-0">
                              <Utensils className="size-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-ink block truncate">
                              {recipe.itemName}
                            </span>
                            <span className="text-[10px] text-ink/50 block font-mono">
                              {recipe.requirements.length} Ingredients · ₹{recipe.sellingPrice}
                            </span>
                          </div>
                        </div>

                        <ChevronRight
                          className={`size-4 shrink-0 transition-transform ${
                            isSelected ? "text-spice translate-x-0.5" : "text-ink/30"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Recipe BOM & Ingredient Builder (8 cols) */}
            <div className="lg:col-span-8 space-y-5">
              {activeRecipe ? (
                <>
                  {/* Dish Overview Card */}
                  <div className="bg-white rounded-2xl border border-ink/10 p-5 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink/10 pb-4">
                      <div className="flex items-center gap-3">
                        {activeMenuItem?.image && (
                          <img
                            src={activeMenuItem.image}
                            alt={activeRecipe.itemName}
                            className="size-12 rounded-xl object-cover border border-ink/15 shrink-0"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-lg font-bold text-ink">
                              {activeRecipe.itemName}
                            </h3>
                            {activeMenuItem?.category && (
                              <Badge variant="outline" className="text-[10px] font-mono capitalize">
                                {activeMenuItem.category}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-ink/60 mt-0.5">
                            Raw material auto-deductions triggered on every customer order.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (confirm(`Remove recipe deduction rule for "${activeRecipe.itemName}"?`)) {
                              deleteRecipeCosting(activeRecipe.itemId);
                            }
                          }}
                          className="h-8 px-2.5 text-xs text-red-600 border-red-200 hover:bg-red-50 gap-1 rounded-xl"
                        >
                          <Trash2 className="size-3.5" />
                          <span>Delete Rule</span>
                        </Button>
                      </div>
                    </div>

                    {/* Costing Summary Mini-Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-frost/50 p-3 rounded-xl border border-ink/5 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-ink/50 uppercase block">
                          Selling Price
                        </span>
                        <span className="font-bold text-ink font-mono text-sm">
                          ₹{activeRecipe.sellingPrice}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-ink/50 uppercase block">
                          Raw Material Cost
                        </span>
                        <span className="font-bold text-spice font-mono text-sm">
                          ₹{activeRecipe.rawMaterialCost}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-ink/50 uppercase block">
                          Food Cost %
                        </span>
                        <span className="font-bold text-emerald-700 font-mono text-sm">
                          {activeRecipe.foodCostPercent}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-ink/50 uppercase block">
                          Profit Margin
                        </span>
                        <span className="font-bold text-ink font-mono text-sm">
                          {activeRecipe.profitMargin}%
                        </span>
                      </div>
                    </div>

                    {/* Table of Linked Ingredients */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display text-sm font-bold text-ink">
                          Linked Raw Materials ({activeRecipe.requirements.length} Ingredients)
                        </h4>
                        <span className="text-[10px] text-ink/50 font-mono">
                          Auto-decremented per 1 portion
                        </span>
                      </div>

                      {activeRecipe.requirements.length === 0 ? (
                        <div className="p-8 text-center bg-frost/40 rounded-xl border border-dashed border-ink/20">
                          <Layers className="size-8 mx-auto text-ink/30 mb-2" />
                          <p className="text-xs text-ink/60 font-medium">
                            No raw materials linked to this recipe yet.
                          </p>
                          <p className="text-[11px] text-ink/40 mt-0.5">
                            Use the builder below to link Basmati Rice, Dal, Ghee, Spices, or Packaging.
                          </p>
                        </div>
                      ) : (
                        <div className="border border-ink/10 rounded-xl overflow-hidden">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-frost border-b border-ink/10 text-ink/60 font-mono text-[10px] uppercase">
                                <th className="p-3 pl-4 font-semibold">Ingredient / SKU</th>
                                <th className="p-3 font-semibold">Deduction Per Order</th>
                                <th className="p-3 font-semibold">Unit Cost</th>
                                <th className="p-3 font-semibold">Cost Contribution</th>
                                <th className="p-3 pr-4 text-right font-semibold">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-ink/5">
                              {activeRecipe.requirements.map((req) => {
                                const rawItem = inventoryItems.find(
                                  (i) => i.id === req.rawMaterialId,
                                );
                                const lineCost = rawItem
                                  ? (rawItem.costPerUnit * req.quantityNeeded).toFixed(2)
                                  : "0.00";

                                return (
                                  <tr key={req.rawMaterialId} className="hover:bg-frost/40">
                                    <td className="p-3 pl-4">
                                      <span className="font-semibold text-ink block">
                                        {req.rawMaterialName}
                                      </span>
                                      {rawItem && (
                                        <span className="text-[10px] font-mono text-ink/40">
                                          Stock in pantry: {rawItem.currentStock} {rawItem.unit}
                                        </span>
                                      )}
                                    </td>
                                    <td className="p-3 font-mono font-bold text-spice">
                                      {req.unit === "kg" && req.quantityNeeded < 1
                                        ? `${Math.round(req.quantityNeeded * 1000)} g (${req.quantityNeeded} kg)`
                                        : req.unit === "ltr" && req.quantityNeeded < 1
                                          ? `${Math.round(req.quantityNeeded * 1000)} ml (${req.quantityNeeded} ltr)`
                                          : `${req.quantityNeeded} ${req.unit}`}
                                    </td>
                                    <td className="p-3 font-mono text-ink/60">
                                      {rawItem ? `₹${rawItem.costPerUnit}/${rawItem.unit}` : "—"}
                                    </td>
                                    <td className="p-3 font-mono font-semibold text-ink">
                                      ₹{lineCost}
                                    </td>
                                    <td className="p-3 pr-4 text-right">
                                      <div className="flex items-center justify-end gap-1.5">
                                        <button
                                          onClick={() =>
                                            setEditingRequirement({
                                              rawMaterialId: req.rawMaterialId,
                                              amount: String(
                                                req.unit === "kg" && req.quantityNeeded < 1
                                                  ? Math.round(req.quantityNeeded * 1000)
                                                  : req.unit === "ltr" && req.quantityNeeded < 1
                                                    ? Math.round(req.quantityNeeded * 1000)
                                                    : req.quantityNeeded,
                                              ),
                                              unit:
                                                req.unit === "kg" && req.quantityNeeded < 1
                                                  ? "g"
                                                  : req.unit === "ltr" && req.quantityNeeded < 1
                                                    ? "ml"
                                                    : req.unit,
                                            })
                                          }
                                          title="Edit quantity"
                                          className="size-7 rounded-lg border border-ink/15 grid place-items-center hover:bg-ink/10 text-ink/70"
                                        >
                                          <Edit3 className="size-3" />
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleRemoveIngredientFromRecipe(req.rawMaterialId)
                                          }
                                          title="Remove from recipe"
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
                      )}
                    </div>
                  </div>

                  {/* Add / Link New Ingredient Builder Card */}
                  <div className="bg-white rounded-2xl border border-spice/20 p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <Plus className="size-4 text-spice" />
                      <h4 className="font-display text-sm font-bold text-ink">
                        + Link Raw Material to "{activeRecipe.itemName}"
                      </h4>
                    </div>

                    <form onSubmit={handleAddIngredientToRecipe} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                        {/* SKU Selector */}
                        <div className="sm:col-span-5 space-y-1">
                          <label className="text-[11px] font-mono uppercase font-bold text-ink/60">
                            Raw Material SKU *
                          </label>
                          <select
                            value={newIngredientRawId}
                            onChange={(e) => {
                              const rawId = e.target.value;
                              setNewIngredientRawId(rawId);
                              const selected = inventoryItems.find((i) => i.id === rawId);
                              if (selected) {
                                if (selected.unit === "kg") setNewIngredientUnit("g");
                                else if (selected.unit === "ltr") setNewIngredientUnit("ml");
                                else setNewIngredientUnit(selected.unit);
                              }
                            }}
                            className="w-full text-xs h-9 rounded-xl border border-ink/20 px-3 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-spice"
                          >
                            <option value="">— Select Raw Material —</option>
                            {inventoryItems.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name} ({item.currentStock} {item.unit} available · ₹
                                {item.costPerUnit}/{item.unit})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Quantity */}
                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[11px] font-mono uppercase font-bold text-ink/60">
                            Quantity Needed *
                          </label>
                          <Input
                            type="number"
                            step="any"
                            min="0.001"
                            value={newIngredientAmount}
                            onChange={(e) => setNewIngredientAmount(e.target.value)}
                            placeholder="e.g. 180"
                            className="text-xs h-9 rounded-xl border-ink/20"
                          />
                        </div>

                        {/* Unit */}
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[11px] font-mono uppercase font-bold text-ink/60">
                            Unit
                          </label>
                          <select
                            value={newIngredientUnit}
                            onChange={(e) => setNewIngredientUnit(e.target.value)}
                            className="w-full text-xs h-9 rounded-xl border border-ink/20 px-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-spice"
                          >
                            <option value="g">grams (g)</option>
                            <option value="kg">kilograms (kg)</option>
                            <option value="ml">milliliters (ml)</option>
                            <option value="ltr">liters (ltr)</option>
                            <option value="pcs">pieces (pcs)</option>
                            <option value="cylinder">cylinder</option>
                          </select>
                        </div>

                        {/* Submit Button */}
                        <div className="sm:col-span-2">
                          <Button
                            type="submit"
                            className="w-full h-9 bg-spice hover:bg-spice/90 text-white rounded-xl text-xs font-semibold gap-1 shadow-sm"
                          >
                            <Plus className="size-3.5" />
                            <span>Add</span>
                          </Button>
                        </div>
                      </div>

                      {/* Live Deduction Preview Calculation */}
                      {newIngredientRawId && (
                        <div className="p-3 bg-frost rounded-xl border border-ink/10 flex items-center justify-between text-xs text-ink/70">
                          <div className="flex items-center gap-2">
                            <Info className="size-3.5 text-spice shrink-0" />
                            <span>
                              Ordering 1 portion will auto-decrement{" "}
                              <strong className="text-ink">
                                {newIngredientAmount} {newIngredientUnit}
                              </strong>{" "}
                              from{" "}
                              <strong className="text-ink">
                                {inventoryItems.find((i) => i.id === newIngredientRawId)?.name}
                              </strong>
                              .
                            </span>
                          </div>
                        </div>
                      )}
                    </form>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl border border-ink/10 p-12 text-center space-y-3">
                  <Layers className="size-10 text-ink/30 mx-auto" />
                  <h4 className="font-display text-base font-bold text-ink">
                    No Recipe Selected
                  </h4>
                  <p className="text-xs text-ink/60 max-w-sm mx-auto">
                    Select a dish from the left list to customize its recipe raw material deduction
                    rules.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: RAW MATERIALS & PANTRY STOCK (SKUS)
          ========================================================================= */}
      {activeSubTab === "stock" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3.5 rounded-2xl border border-ink/10 shadow-sm">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="size-4 text-ink/40 shrink-0 ml-1" />
              <Input
                placeholder="Search raw material SKU or supplier..."
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

                            {/* Edit SKU */}
                            <button
                              onClick={() => handleOpenEditSkuModal(item)}
                              title="Edit Raw Material Details"
                              className="size-7 rounded-lg border border-ink/15 grid place-items-center hover:bg-ink/10 text-ink/70"
                            >
                              <Edit3 className="size-3" />
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

                            {/* Delete SKU */}
                            <button
                              onClick={() => {
                                if (confirm(`Delete raw material "${item.name}" from inventory?`)) {
                                  deleteInventoryItem(item.id);
                                }
                              }}
                              title="Delete SKU"
                              className="size-7 rounded-lg border border-red-200 grid place-items-center hover:bg-red-50 text-red-600"
                            >
                              <X className="size-3" />
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
        </div>
      )}

      {/* =========================================================================
          TAB 3: PROCUREMENT & LOW STOCK REPLENISHMENT
          ========================================================================= */}
      {activeSubTab === "po" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-ink/10 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-ink">
                  Replenishment & Purchase Orders (PO)
                </h3>
                <p className="text-xs text-ink/60">
                  Manage vendor procurement and automated restock triggers for raw materials
                </p>
              </div>
              <Badge
                className={
                  lowStockCount > 0
                    ? "bg-red-600 text-white text-[10px] font-mono"
                    : "bg-emerald-600 text-white text-[10px] font-mono"
                }
              >
                {lowStockCount} SKUs Need Restock
              </Badge>
            </div>

            {lowStockCount === 0 ? (
              <div className="p-8 text-center bg-emerald-50/50 rounded-2xl border border-emerald-200/50 space-y-2">
                <CheckCircle2 className="size-8 mx-auto text-emerald-600" />
                <h4 className="font-display text-sm font-bold text-ink">
                  All Raw Material Stocks are Healthy!
                </h4>
                <p className="text-xs text-ink/60 max-w-md mx-auto">
                  Every ingredient in the Kurji Kitchen is currently above its minimum safety alert threshold.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase font-bold text-red-600">
                  Critical & Low Stock Ingredients Requiring Immediate PO
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl border border-red-200 bg-red-50/30 flex items-center justify-between gap-3"
                    >
                      <div>
                        <span className="text-xs font-bold text-ink block">{item.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-red-600 font-bold text-sm">
                            {item.currentStock} {item.unit}
                          </span>
                          <span className="text-[10px] text-ink/50 font-mono">
                            (Min: {item.minStockLevel} {item.unit})
                          </span>
                        </div>
                        <span className="text-[10px] text-ink/60 block mt-0.5">
                          Supplier: {item.supplierName}
                        </span>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => setPoModalItem(item)}
                        className="bg-spice hover:bg-spice/90 text-white rounded-xl text-xs font-semibold gap-1.5 shadow-sm"
                      >
                        <ShoppingCart className="size-3" />
                        <span>Order PO</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS / DIALOGS
          ========================================================================= */}

      {/* 1. Add / Edit SKU Modal */}
      <Dialog open={isSkuModalOpen} onOpenChange={setIsSkuModalOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold text-ink">
              {editingSku ? `Edit Raw Material SKU` : `+ Add New Raw Material SKU`}
            </DialogTitle>
            <DialogDescription className="text-xs text-ink/60">
              Configure inventory SKU details, wholesale cost, and safety stock alert.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveSku} className="space-y-3.5 mt-2">
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase font-bold text-ink/70">
                Material Name *
              </label>
              <Input
                value={skuName}
                onChange={(e) => setSkuName(e.target.value)}
                placeholder="e.g. Kolam Steamed Rice"
                required
                className="text-xs rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase font-bold text-ink/70">
                  Category
                </label>
                <select
                  value={skuCategory}
                  onChange={(e) => setSkuCategory(e.target.value as InventoryCategory)}
                  className="w-full text-xs h-9 rounded-xl border border-ink/20 px-3 bg-white text-ink"
                >
                  <option value="grains">Grains & Rice</option>
                  <option value="dairy">Dairy & Paneer</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="spices">Spices</option>
                  <option value="oil">Oil & Ghee</option>
                  <option value="packaging">Packaging</option>
                  <option value="gas">Commercial Gas</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase font-bold text-ink/70">
                  Stock Unit
                </label>
                <select
                  value={skuUnit}
                  onChange={(e) => setSkuUnit(e.target.value as InventoryItem["unit"])}
                  className="w-full text-xs h-9 rounded-xl border border-ink/20 px-3 bg-white text-ink"
                >
                  <option value="kg">kg (Kilograms)</option>
                  <option value="ltr">ltr (Liters)</option>
                  <option value="pcs">pcs (Pieces)</option>
                  <option value="cylinder">cylinder</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase font-bold text-ink/70">
                  Current Stock
                </label>
                <Input
                  type="number"
                  step="any"
                  value={skuStock}
                  onChange={(e) => setSkuStock(e.target.value)}
                  className="text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase font-bold text-ink/70">
                  Min Alert
                </label>
                <Input
                  type="number"
                  step="any"
                  value={skuMinStock}
                  onChange={(e) => setSkuMinStock(e.target.value)}
                  className="text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase font-bold text-ink/70">
                  Unit Cost (₹)
                </label>
                <Input
                  type="number"
                  step="any"
                  value={skuCost}
                  onChange={(e) => setSkuCost(e.target.value)}
                  className="text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase font-bold text-ink/70">
                Supplier / Wholesaler Name
              </label>
              <Input
                value={skuSupplier}
                onChange={(e) => setSkuSupplier(e.target.value)}
                placeholder="e.g. Patna Wholesale Mandi"
                className="text-xs rounded-xl"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSkuModalOpen(false)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-spice hover:bg-spice/90 text-white text-xs rounded-xl font-semibold shadow-sm"
              >
                {editingSku ? "Update SKU" : "Save SKU"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Map New Dish to Recipe Costing Modal */}
      <Dialog open={isMapDishModalOpen} onOpenChange={setIsMapDishModalOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold text-ink">
              + Link New Dish to Recipe Deduction Engine
            </DialogTitle>
            <DialogDescription className="text-xs text-ink/60">
              Select any menu item to configure which raw materials are auto-deducted when an order is placed.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleMapNewDish} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase font-bold text-ink/70">
                Choose Menu Dish *
              </label>
              <select
                value={selectedDishToMapId}
                onChange={(e) => setSelectedDishToMapId(e.target.value)}
                className="w-full text-xs h-10 rounded-xl border border-ink/20 px-3 bg-white text-ink"
                required
              >
                <option value="">— Select from Menu Items —</option>
                {unmappedDishes.length > 0 ? (
                  unmappedDishes.map((dish) => (
                    <option key={dish.id} value={dish.id}>
                      {dish.name} (₹{dish.price} · {dish.category})
                    </option>
                  ))
                ) : (
                  <option disabled>All menu items already mapped!</option>
                )}
              </select>
            </div>

            <div className="p-3 bg-frost rounded-xl border border-ink/10 text-xs text-ink/70">
              Once linked, you can add exact ingredient amounts (e.g. 180g Rice, 120g Dal, 25g Ghee) that will automatically deduct on dispatch.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsMapDishModalOpen(false)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!selectedDishToMapId}
                className="bg-spice hover:bg-spice/90 text-white text-xs rounded-xl font-semibold shadow-sm"
              >
                Create Recipe Mapping
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. Edit Requirement Amount Modal */}
      {editingRequirement && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-white rounded-3xl border border-ink/20 shadow-2xl p-6 max-w-sm w-full space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <h3 className="font-display text-base font-bold text-ink">
                Edit Ingredient Quantity
              </h3>
              <button
                onClick={() => setEditingRequirement(null)}
                className="size-7 rounded-full bg-frost grid place-items-center text-ink/60 hover:text-ink text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-ink/70">
                Ingredient:{" "}
                <strong className="text-ink">
                  {inventoryItems.find((i) => i.id === editingRequirement.rawMaterialId)?.name}
                </strong>
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase font-bold text-ink/60">
                    Amount
                  </label>
                  <Input
                    type="number"
                    step="any"
                    value={editingRequirement.amount}
                    onChange={(e) =>
                      setEditingRequirement({ ...editingRequirement, amount: e.target.value })
                    }
                    className="text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase font-bold text-ink/60">
                    Unit
                  </label>
                  <select
                    value={editingRequirement.unit}
                    onChange={(e) =>
                      setEditingRequirement({ ...editingRequirement, unit: e.target.value })
                    }
                    className="w-full text-xs h-9 rounded-xl border border-ink/20 px-2 bg-white text-ink"
                  >
                    <option value="g">g (Grams)</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml (Milliliters)</option>
                    <option value="ltr">ltr</option>
                    <option value="pcs">pcs</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingRequirement(null)}
                  className="text-xs rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEditedRequirement}
                  className="bg-spice hover:bg-spice/90 text-white text-xs rounded-xl font-semibold shadow-sm"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Supplier Purchase Order Modal */}
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
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                <span>{poSuccessMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleCreatePo} className="space-y-4">
                <div className="p-3.5 bg-frost/50 rounded-2xl border border-ink/5 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-ink/60">Supplier:</span>
                    <strong className="text-ink">{poModalItem.supplierName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/60">Current Stock:</span>
                    <strong className="font-mono text-ink">
                      {poModalItem.currentStock} {poModalItem.unit}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/60">Wholesale Unit Price:</span>
                    <strong className="font-mono text-ink">
                      ₹{poModalItem.costPerUnit} / {poModalItem.unit}
                    </strong>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase font-bold text-ink/60 block">
                    Replenishment Quantity ({poModalItem.unit})
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={poQuantity}
                    onChange={(e) => setPoQuantity(Number(e.target.value))}
                    required
                    className="text-sm font-mono font-bold rounded-xl"
                  />
                </div>

                <div className="p-3 rounded-xl bg-spice/5 border border-spice/20 flex items-center justify-between text-xs">
                  <span className="text-ink/70">Estimated PO Invoice:</span>
                  <span className="font-mono text-base font-bold text-spice">
                    ₹{(poQuantity * poModalItem.costPerUnit).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPoModalItem(null)}
                    className="text-xs rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-spice hover:bg-spice/90 text-white text-xs rounded-xl font-semibold shadow-sm"
                  >
                    Send Purchase Order PO
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 5. Wastage Modal */}
      {wastageModalItem && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-white rounded-3xl border border-ink/20 shadow-2xl p-6 max-w-md w-full space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-red-600">
                  Kitchen Operations
                </span>
                <h3 className="font-display text-lg font-bold text-ink">
                  Log Wastage / Spoilage
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
              <div className="p-3.5 bg-red-50/50 rounded-2xl border border-red-200/50 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink/60">Item:</span>
                  <strong className="text-ink">{wastageModalItem.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Current Stock:</span>
                  <strong className="font-mono text-ink">
                    {wastageModalItem.currentStock} {wastageModalItem.unit}
                  </strong>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase font-bold text-ink/60 block">
                  Wasted Amount ({wastageModalItem.unit})
                </label>
                <Input
                  type="number"
                  step="any"
                  min="0.1"
                  max={wastageModalItem.currentStock}
                  value={wastageAmount}
                  onChange={(e) => setWastageAmount(Number(e.target.value))}
                  required
                  className="text-sm font-mono font-bold rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase font-bold text-ink/60 block">
                  Reason for Spoilage / Wastage
                </label>
                <select
                  value={wastageReason}
                  onChange={(e) => setWastageReason(e.target.value)}
                  className="w-full text-xs h-9 rounded-xl border border-ink/20 px-3 bg-white text-ink"
                >
                  <option value="Damaged / Spill in Kitchen">Damaged / Spill in Kitchen</option>
                  <option value="Expired / Past Shelf Life">Expired / Past Shelf Life</option>
                  <option value="Burnt during Preparation">Burnt during Preparation</option>
                  <option value="Quality Inspection Rejected">Quality Inspection Rejected</option>
                  <option value="End of Day Audit Adjustment">End of Day Audit Adjustment</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setWastageModalItem(null)}
                  className="text-xs rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white text-xs rounded-xl font-semibold shadow-sm"
                >
                  Confirm Wastage Deduction
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
