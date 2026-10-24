import React, { useState, useRef } from "react";
import { useDemoStore, DEFAULT_MENU_CATEGORIES } from "@/context/DemoStoreContext";
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
  Plus,
  Search,
  Trash2,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Flame,
  Leaf,
  Clock,
  X,
  Loader2,
  Edit3,
  Tag,
  Check,
  FolderPlus,
} from "lucide-react";
import { toast } from "sonner";
import type { MenuItem } from "@/types/kitchen";

const PRESET_IMAGES = [
  {
    label: "Dal Tadka Thali",
    url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
  },
  {
    label: "Paneer Tikka",
    url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80",
  },
  {
    label: "Dum Biryani",
    url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
  },
  {
    label: "Tawa Rotis",
    url: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80",
  },
  {
    label: "Gulab Jamun",
    url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
  },
  {
    label: "Masala Chai",
    url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
  },
];

export const MenuManagerTab: React.FC = () => {
  const {
    menuItems,
    toggleMenuItemStock,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    customCategories,
    allCategories,
    addCustomCategory,
    deleteCustomCategory,
  } = useDemoStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [managerNewCatInput, setManagerNewCatInput] = useState("");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New item form state
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("199");
  const [category, setCategory] = useState<string>("Thali");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [prepTime, setPrepTime] = useState("20");
  const [image, setImage] = useState(PRESET_IMAGES[0]?.url || "");
  const [badge, setBadge] = useState("BESTSELLER");
  const [isVeg, setIsVeg] = useState(true);
  const [isTodaySpecial, setIsTodaySpecial] = useState(false);
  const [includedItems, setIncludedItems] = useState("");
  const [calories, setCalories] = useState("450");
  const [protein, setProtein] = useState("14g");
  const [carbs, setCarbs] = useState("55g");
  const [fat, setFat] = useState("12g");

  const filtered = menuItems.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategoryFilter === "All" || m.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === "string") {
          const base64Data = reader.result;
          // Set preview immediately
          setImage(base64Data);
          setIsUploading(true);
          const toastId = toast.loading("Cloudinary par photo upload ho rahi hai...");
          try {
            const res = await fetch("/api/media/upload", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                file: base64Data,
                folder: "animas-kitchen/menu",
              }),
            });
            const data = await res.json();
            if (data.success && data.secureUrl) {
              setImage(data.secureUrl);
              toast.success("Dish photo Cloudinary me upload ho gayi!", { id: toastId });
            } else {
              toast.error(data.error || "Cloudinary upload fail hua, local preview set hai", {
                id: toastId,
              });
            }
          } catch (err: any) {
            toast.error("Upload error: " + err.message, { id: toastId });
          } finally {
            setIsUploading(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalImage =
      image.trim() ||
      PRESET_IMAGES[0]?.url ||
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80";

    const newDish: MenuItem = {
      id: `dish-${Date.now()}`,
      name: name.trim(),
      description: desc.trim() || "Homestyle fresh preparation with 100% pure desi ghee",
      price: Number(price) || 199,
      category,
      image: finalImage,
      isVeg,
      badge: badge.trim() || undefined,
      isTodaySpecial,
      isAvailable: true,
      preparationTimeMinutes: Number(prepTime) || 20,
      rating: 4.9,
      reviewCount: 1,
      isThali: category === "Thali",
      includedItems: includedItems.trim()
        ? includedItems
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : category === "Thali"
          ? ["2 Ghee Phulkas", "Dal Tadka", "Jeera Rice", "Mint Chutney", "Salad"]
          : undefined,
      allowedAddons: [
        "addon-la",
        "addon-je",
        "addon-da",
        "addon-ch",
        "addon-ra",
        "addon-mi",
        "addon-pa",
      ],
      nutrition: {
        calories: Number.parseInt(calories.replace(/\D/g, ""), 10) || 450,
        protein: protein.trim() || "14g",
        carbs: carbs.trim() || "55g",
        fat: fat.trim() || "12g",
      },
    };

    if (editingItem) {
      updateMenuItem({
        ...editingItem,
        ...newDish,
        id: editingItem.id,
        rating: editingItem.rating,
        reviewCount: editingItem.reviewCount,
        reviews: editingItem.reviews,
      });
      setEditingItem(null);
    } else {
      addMenuItem(newDish);
    }
    setAddModalOpen(false);

    // Reset fields
    resetForm();
  };

  const handleCreateCustomCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      toast.error("Category ka naam daalein");
      return;
    }
    const success = addCustomCategory(trimmed);
    if (success) {
      setCategory(trimmed);
      setNewCategoryName("");
      setIsCreatingCategory(false);
    }
  };

  const handleCreateManagerCategory = () => {
    const trimmed = managerNewCatInput.trim();
    if (!trimmed) {
      toast.error("Category ka naam daalein");
      return;
    }
    const success = addCustomCategory(trimmed);
    if (success) {
      setManagerNewCatInput("");
    }
  };

  const resetForm = () => {
    setName("");
    setDesc("");
    setPrice("199");
    setCategory("Thali");
    setIsCreatingCategory(false);
    setNewCategoryName("");
    setPrepTime("20");
    setImage(PRESET_IMAGES[0]?.url || "");
    setBadge("BESTSELLER");
    setIsVeg(true);
    setIsTodaySpecial(false);
    setIncludedItems("");
    setCalories("450");
    setProtein("14g");
    setCarbs("55g");
    setFat("12g");
    setEditingItem(null);
  };

  const openAddModal = () => {
    resetForm();
    setAddModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setDesc(item.description);
    setPrice(String(item.price));
    setCategory(item.category);
    setIsCreatingCategory(false);
    setNewCategoryName("");
    setPrepTime(String(item.preparationTimeMinutes || 20));
    setImage(item.image);
    setBadge(item.badge || "BESTSELLER");
    setIsVeg(item.isVeg);
    setIsTodaySpecial(item.isTodaySpecial || false);
    setIncludedItems((item.includedItems || []).join(", "));
    setCalories(String(item.nutrition?.calories || 450));
    setProtein(item.nutrition?.protein || "14g");
    setCarbs(item.nutrition?.carbs || "55g");
    setFat(item.nutrition?.fat || "12g");
    setAddModalOpen(true);
  };

  return (
    <div className="space-y-6 text-ink">
      {/* Top Controls & Category Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative min-w-[260px] flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-ink/40" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search dish, ingredient, or category..."
              className="h-9 rounded-full border-ink/15 bg-frost pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCategoryManagerOpen(true)}
              className="rounded-full border-ink/15 bg-frost text-xs font-semibold text-ink hover:border-spice hover:text-spice gap-1.5 h-9 shadow-sm"
            >
              <Tag className="size-3.5 text-spice" />
              <span>Manage Categories ({allCategories.length})</span>
            </Button>

            <Button
              onClick={openAddModal}
              className="rounded-full bg-spice text-xs font-semibold text-cream hover:bg-ink gap-1.5 shadow-sm h-9"
            >
              <Plus className="size-3.5" />
              <span>Add New Food Item</span>
            </Button>
          </div>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter("All")}
            className={`rounded-full px-3 py-1 font-mono text-[11px] font-bold transition-all whitespace-nowrap ${
              selectedCategoryFilter === "All"
                ? "bg-ink text-cream shadow-sm"
                : "bg-frost text-ink/70 hover:bg-cream hover:text-ink border border-ink/10"
            }`}
          >
            All Items ({menuItems.length})
          </button>
          {allCategories.map((cat) => {
            const count = menuItems.filter((m) => m.category === cat).length;
            const isCustom = !DEFAULT_MENU_CATEGORIES.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`rounded-full px-3 py-1 font-mono text-[11px] transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategoryFilter === cat
                    ? "bg-spice text-cream shadow-sm font-bold"
                    : "bg-frost text-ink/70 hover:bg-cream hover:text-ink border border-ink/10"
                }`}
              >
                <span>{cat}</span>
                <span className="opacity-70 text-[10px]">({count})</span>
                {isCustom && (
                  <span className="text-[8px] uppercase tracking-wider bg-white/20 text-cream px-1 py-0.2 rounded font-mono font-bold">
                    Custom
                  </span>
                )}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setCategoryManagerOpen(true)}
            className="rounded-full px-2.5 py-1 font-mono text-[11px] font-bold border border-dashed border-spice/40 text-spice hover:bg-spice/10 transition-all whitespace-nowrap flex items-center gap-1"
            title="Nayi category banayein"
          >
            <Plus className="size-3" />
            <span>+ Category</span>
          </button>
        </div>
      </div>

      {/* Menu Management Table */}
      <div className="overflow-hidden rounded-3xl border border-ink/10 bg-frost shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ink">
            <thead className="border-b border-ink/10 bg-cream/60 font-mono text-[10px] uppercase text-ink/60">
              <tr>
                <th className="p-4">Dish</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Prep Time</th>
                <th className="p-4">Live Availability</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-cream/40 transition-colors">
                  {/* Dish name & image */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-12 rounded-xl object-cover border border-ink/10 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-sm text-ink">{item.name}</strong>
                          {item.badge && (
                            <Badge className="bg-spice/15 text-spice border-spice/20 text-[9px] font-mono font-bold">
                              {item.badge}
                            </Badge>
                          )}
                          {item.isTodaySpecial && (
                            <Badge className="bg-saffron text-ink text-[9px] font-mono">
                              SPECIAL
                            </Badge>
                          )}
                          {item.isThali && (
                            <Badge className="bg-spice text-cream text-[9px] font-mono">
                              THALI
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-ink/60 max-w-xs truncate">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono font-medium text-ink">{item.category}</span>
                      {!DEFAULT_MENU_CATEGORIES.includes(item.category) && (
                        <span className="text-[9px] font-mono font-bold bg-spice/10 text-spice border border-spice/20 px-1.5 py-0.5 rounded-full">
                          Custom
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="p-4 font-display text-base text-ink font-bold">₹{item.price}</td>

                  {/* Prep Time */}
                  <td className="p-4 font-mono text-ink/70">{item.preparationTimeMinutes} mins</td>

                  {/* Live In Stock / Sold Out toggle */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.isAvailable}
                        onCheckedChange={() => toggleMenuItemStock(item.id)}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                      <span
                        className={`font-mono text-[10px] font-bold uppercase ${
                          item.isAvailable ? "text-emerald-700" : "text-red-600"
                        }`}
                      >
                        {item.isAvailable ? "IN STOCK" : "SOLD OUT"}
                      </span>
                    </div>
                  </td>

                  {/* Actions: Edit & Delete */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(item)}
                        className="size-8 rounded-full text-ink/60 hover:text-spice hover:bg-spice/10"
                        title="Edit dish details"
                      >
                        <Edit3 className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMenuItem(item.id)}
                        className="size-8 rounded-full text-ink/40 hover:text-red-600 hover:bg-red-50"
                        title="Delete dish"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Add / Edit Dish Dialog */}
      <Dialog
        open={addModalOpen}
        onOpenChange={(open) => {
          setAddModalOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-ink/10 bg-frost p-6 text-ink shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl sm:text-2xl text-ink flex items-center gap-2">
              <Sparkles className="size-5 text-spice" />
              <span>{editingItem ? `Edit "${editingItem.name}"` : "Add New Dish to Kitchen"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-ink/60">
              {editingItem
                ? "Update pricing, prep time, image, or dietary flags. Changes update in real-time."
                : "Add dish image, pricing, preparation time, and nutritional details. Instantly live on the customer app."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateDish} className="mt-4 space-y-4 text-xs">
            {/* 1. Image Upload & Selection Section */}
            <div className="rounded-2xl border border-ink/15 bg-cream/70 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[10px] uppercase font-bold text-ink/70 flex items-center gap-1.5">
                  <Upload className="size-3.5 text-spice" />
                  <span>Dish Photo (Upload or Choose Preset)</span>
                </label>
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="text-[10px] text-red-600 hover:underline flex items-center gap-1"
                  >
                    <X className="size-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {/* Live Preview Box & Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative size-20 sm:size-24 rounded-2xl overflow-hidden border-2 border-spice/30 bg-white shrink-0 shadow-inner flex items-center justify-center">
                  {image ? (
                    <img src={image} alt="Dish preview" className="size-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-ink/40 text-center px-1 font-mono">
                      No Image
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl border-ink/20 bg-white text-xs font-semibold text-ink hover:bg-cream hover:border-spice flex items-center gap-1.5 h-8 disabled:opacity-60"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="size-3.5 text-spice animate-spin" />
                          <span>Uploading to Cloudinary...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="size-3.5 text-spice" />
                          <span>Upload from Device</span>
                        </>
                      )}
                    </Button>
                    <span className="text-[11px] text-ink/40 font-mono">or paste URL below</span>
                  </div>

                  <div className="relative">
                    <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-ink/40" />
                    <Input
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="rounded-xl border-ink/15 text-[11px] bg-white pl-8 h-8 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Image Presets */}
              <div>
                <span className="text-[10px] font-mono text-ink/50 uppercase block mb-1.5">
                  Quick Food Presets:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className={`group relative rounded-xl overflow-hidden border p-1 text-center transition-all ${
                        image === preset.url
                          ? "border-spice bg-spice/10 ring-1 ring-spice"
                          : "border-ink/10 bg-white hover:border-spice/50"
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="size-8 rounded-lg object-cover mx-auto mb-1"
                      />
                      <span className="text-[9px] font-semibold text-ink block truncate leading-none">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Basic Dish Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="font-mono text-[10px] uppercase font-bold text-ink/60 block mb-1">
                  Dish Name *
                </label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kashmiri Dum Aloo"
                  className="rounded-xl border-ink/15 text-xs bg-cream"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-mono text-[10px] uppercase font-bold text-ink/60 block mb-1">
                  Description
                </label>
                <Input
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Baby potatoes cooked in fennel & dry ginger gravy, topped with pure cow ghee..."
                  className="rounded-xl border-ink/15 text-xs bg-cream"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase font-bold text-ink/60 block mb-1">
                  Price (₹) *
                </label>
                <Input
                  required
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="rounded-xl border-ink/15 text-xs bg-cream font-mono"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[10px] uppercase font-bold text-ink/60">
                    Category *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                    className="text-[10px] font-mono text-spice hover:text-ink font-bold flex items-center gap-1 hover:underline transition-colors"
                  >
                    <Plus className="size-3" />
                    <span>+ Nayi Category Banayein</span>
                  </button>
                </div>

                <select
                  value={category}
                  onChange={(e) => {
                    if (e.target.value === "__CREATE_NEW__") {
                      setIsCreatingCategory(true);
                    } else {
                      setCategory(e.target.value);
                      setIsCreatingCategory(false);
                    }
                  }}
                  className="w-full rounded-xl border border-ink/15 bg-cream p-2 text-xs font-medium text-ink focus:border-spice focus:ring-1 focus:ring-spice"
                >
                  <optgroup label="Standard Categories">
                    <option value="Thali">Thali</option>
                    <option value="Sabzi">Sabzi & Curries</option>
                    <option value="Paneer & Tandoor">Paneer & Tandoor</option>
                    <option value="Biryani">Biryani</option>
                    <option value="Roti & Rice">Roti & Rice</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Chai & More">Chai & More</option>
                    <option value="Combos">Combos</option>
                  </optgroup>

                  {customCategories.length > 0 && (
                    <optgroup label="Custom Categories (Aapki Banayi Hui)">
                      {customCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat} (Custom)
                        </option>
                      ))}
                    </optgroup>
                  )}

                  {/* If current dish has a category not in standard or custom */}
                  {category &&
                    !DEFAULT_MENU_CATEGORIES.includes(category) &&
                    !customCategories.includes(category) && (
                      <optgroup label="Current Selection">
                        <option value={category}>{category} (Custom)</option>
                      </optgroup>
                    )}

                  <option value="__CREATE_NEW__" className="text-spice font-bold">
                    ✨ + Nayi Custom Category Banayein...
                  </option>
                </select>

                {/* Active Category Info Pill if Custom */}
                {!DEFAULT_MENU_CATEGORIES.includes(category) && (
                  <div className="flex items-center gap-1.5 text-[11px] text-spice font-mono font-medium bg-spice/10 px-2.5 py-1 rounded-lg border border-spice/20">
                    <Check className="size-3 text-spice" />
                    <span>
                      Selected Custom Category: <strong>{category}</strong>
                    </span>
                  </div>
                )}

                {/* Inline Custom Category Creator */}
                {isCreatingCategory && (
                  <div className="rounded-2xl border-2 border-dashed border-spice/40 bg-spice/5 p-3 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase font-bold text-spice flex items-center gap-1">
                        <Sparkles className="size-3" />
                        <span>Nayi Custom Category Banayein</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsCreatingCategory(false)}
                        className="text-ink/40 hover:text-ink text-xs p-0.5"
                        title="Band karein"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>

                    <div className="flex gap-1.5">
                      <Input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Category naam (e.g. Snacks, Chaat, Beverages, South Indian...)"
                        className="rounded-xl border-ink/20 text-xs bg-white h-8 font-medium"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleCreateCustomCategory();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={handleCreateCustomCategory}
                        className="rounded-xl bg-spice text-cream hover:bg-ink text-xs font-semibold h-8 px-3 shrink-0"
                      >
                        Add & Select
                      </Button>
                    </div>

                    {/* Quick suggestion chips */}
                    <div>
                      <span className="text-[9px] font-mono uppercase text-ink/50 block mb-1 font-bold">
                        Suggested Categories (Click to Add):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {[
                          "Snacks & Starters",
                          "Chaat & Street Food",
                          "Beverages & Drinks",
                          "South Indian",
                          "Rolls & Wraps",
                          "Healthy Bites",
                          "Chinese & Indo-Chinese",
                          "Breakfast Specials",
                        ].map((sugg) => (
                          <button
                            key={sugg}
                            type="button"
                            onClick={() => {
                              addCustomCategory(sugg);
                              setCategory(sugg);
                              setIsCreatingCategory(false);
                            }}
                            className="rounded-full border border-spice/25 bg-white px-2 py-0.5 text-[10px] font-medium text-spice hover:bg-spice hover:text-white transition-colors"
                          >
                            + {sugg}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase font-bold text-ink/60 block mb-1 flex items-center gap-1">
                  <Clock className="size-3 text-spice" />
                  <span>Prep Time (Minutes)</span>
                </label>
                <Input
                  type="number"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  placeholder="20"
                  className="rounded-xl border-ink/15 text-xs bg-cream font-mono"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase font-bold text-ink/60 block mb-1">
                  Dish Badge / Tag
                </label>
                <Input
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. BESTSELLER, CHEF SPECIAL"
                  className="rounded-xl border-ink/15 text-xs bg-cream font-mono uppercase"
                />
              </div>
            </div>

            {/* 3. Included Items (for Thalis / Combos) */}
            <div>
              <label className="font-mono text-[10px] uppercase font-bold text-ink/60 block mb-1">
                Included Items (Comma separated)
              </label>
              <Input
                value={includedItems}
                onChange={(e) => setIncludedItems(e.target.value)}
                placeholder="e.g. 2 Desi Ghee Rotis, Dal Tadka, Jeera Rice, Gulab Jamun, Green Chutney"
                className="rounded-xl border-ink/15 text-xs bg-cream"
              />
            </div>

            {/* 4. Dietary & Special Flags */}
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-ink/10 bg-cream/40 p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-ink flex items-center gap-1.5">
                  <Leaf className="size-3.5 text-emerald-600" />
                  <span>Pure Vegetarian</span>
                </span>
                <Switch
                  checked={isVeg}
                  onCheckedChange={setIsVeg}
                  className="data-[state=checked]:bg-emerald-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-ink flex items-center gap-1.5">
                  <Flame className="size-3.5 text-saffron" />
                  <span>Today's Special</span>
                </span>
                <Switch
                  checked={isTodaySpecial}
                  onCheckedChange={setIsTodaySpecial}
                  className="data-[state=checked]:bg-saffron"
                />
              </div>
            </div>

            {/* 5. Nutritional Information */}
            <div className="rounded-2xl border border-ink/10 bg-white p-3 space-y-2">
              <span className="font-mono text-[10px] font-bold uppercase text-ink/60 block">
                Nutrition Facts (Per Serving)
              </span>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <span className="text-[9px] font-mono text-ink/50 uppercase block">
                    Calories (kcal)
                  </span>
                  <Input
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="450"
                    className="h-7 text-[11px] rounded-lg bg-cream font-mono"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-ink/50 uppercase block">Protein</span>
                  <Input
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    placeholder="14g"
                    className="h-7 text-[11px] rounded-lg bg-cream font-mono"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-ink/50 uppercase block">Carbs</span>
                  <Input
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    placeholder="55g"
                    className="h-7 text-[11px] rounded-lg bg-cream font-mono"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-ink/50 uppercase block">Fat</span>
                  <Input
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    placeholder="12g"
                    className="h-7 text-[11px] rounded-lg bg-cream font-mono"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="mt-2 w-full rounded-full bg-spice py-3 font-semibold text-cream hover:bg-ink shadow-md text-xs sm:text-sm"
            >
              {editingItem ? "Save Changes to Dish" : "Add Item to Live Menu"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Category Manager Dialog */}
      <Dialog open={categoryManagerOpen} onOpenChange={setCategoryManagerOpen}>
        <DialogContent className="max-w-lg rounded-3xl border border-ink/10 bg-frost p-6 text-ink shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-ink flex items-center gap-2">
              <Tag className="size-5 text-spice" />
              <span>Kitchen Menu Categories</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-ink/60">
              Yahan aap nayi custom categories bana sakte hain aur menu categories manage kar sakte hain.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Create new category box */}
            <div className="rounded-2xl border border-spice/30 bg-spice/5 p-3.5 space-y-2.5">
              <label className="font-mono text-[10px] uppercase font-bold text-spice block">
                Nayi Custom Category Banayein
              </label>
              <div className="flex gap-2">
                <Input
                  value={managerNewCatInput}
                  onChange={(e) => setManagerNewCatInput(e.target.value)}
                  placeholder="e.g. Snacks, Chaat, Beverages, South Indian..."
                  className="rounded-xl border-ink/20 text-xs bg-white h-9 font-medium"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreateManagerCategory();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleCreateManagerCategory}
                  className="rounded-xl bg-spice text-cream hover:bg-ink text-xs font-semibold h-9 px-4 shrink-0 gap-1"
                >
                  <Plus className="size-3.5" />
                  <span>Add Category</span>
                </Button>
              </div>

              {/* Suggestions */}
              <div>
                <span className="text-[9px] font-mono uppercase text-ink/50 block mb-1 font-bold">
                  Quick Suggestions (Click to Add):
                </span>
                <div className="flex flex-wrap gap-1">
                  {[
                    "Snacks & Starters",
                    "Chaat & Street Food",
                    "Beverages & Drinks",
                    "South Indian",
                    "Rolls & Wraps",
                    "Healthy Bowls",
                    "Chinese",
                    "Breakfast Specials",
                  ].map((sugg) => (
                    <button
                      key={sugg}
                      type="button"
                      onClick={() => {
                        addCustomCategory(sugg);
                      }}
                      className="rounded-full border border-spice/25 bg-white px-2 py-0.5 text-[10px] font-medium text-spice hover:bg-spice hover:text-white transition-colors"
                    >
                      + {sugg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Existing Categories List */}
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-ink/60 block mb-2">
                All Active Categories ({allCategories.length})
              </span>
              <div className="divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white max-h-60 overflow-y-auto">
                {allCategories.map((cat) => {
                  const isCustom = !DEFAULT_MENU_CATEGORIES.includes(cat);
                  const dishesInCat = menuItems.filter((m) => m.category === cat);
                  const count = dishesInCat.length;

                  return (
                    <div
                      key={cat}
                      className="p-3 flex items-center justify-between text-xs hover:bg-cream/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-ink">{cat}</span>
                        {isCustom ? (
                          <Badge className="bg-spice/15 text-spice border-spice/20 text-[9px] font-mono">
                            Custom
                          </Badge>
                        ) : (
                          <Badge className="bg-ink/5 text-ink/60 border-ink/10 text-[9px] font-mono">
                            Standard
                          </Badge>
                        )}
                        <span className="text-[11px] text-ink/50 font-mono">
                          {count} {count === 1 ? "dish" : "dishes"}
                        </span>
                      </div>

                      {isCustom && (
                        <div>
                          {count === 0 ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCustomCategory(cat)}
                              className="h-7 text-red-600 hover:text-red-700 hover:bg-red-50 text-[11px] px-2 gap-1 rounded-lg"
                              title="Delete unused category"
                            >
                              <Trash2 className="size-3" />
                              <span>Delete</span>
                            </Button>
                          ) : (
                            <span className="text-[10px] font-mono text-ink/40">
                              Active in menu
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── ORDER INDIVIDUAL SIDES & EXTRA ROTIS (THALI ADDONS) MANAGER ─── */}
      <SidesAndRotisManagerSection />
    </div>
  );
};

export const SidesAndRotisManagerSection: React.FC = () => {
  const { thaliAddons, addThaliAddon, updateThaliAddon, deleteThaliAddon } = useDemoStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<any>(null);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [portion, setPortion] = useState("1 pc");
  const [price, setPrice] = useState("35");
  const [description, setDescription] = useState("");
  const [isVeg, setIsVeg] = useState(true);

  const openNewModal = () => {
    setEditingAddon(null);
    setCode("EX");
    setName("");
    setPortion("1 pc");
    setPrice("35");
    setDescription("");
    setIsVeg(true);
    setModalOpen(true);
  };

  const openEditModal = (addon: any) => {
    setEditingAddon(addon);
    setCode(addon.code);
    setName(addon.name);
    setPortion(addon.portion);
    setPrice(String(addon.price));
    setDescription(addon.description || "");
    setIsVeg(addon.isVeg ?? true);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingAddon) {
      updateThaliAddon({
        ...editingAddon,
        code: code.trim().toUpperCase() || "EX",
        name: name.trim(),
        portion: portion.trim() || "1 pc",
        price: Number(price) || 35,
        description: description.trim(),
        isVeg,
      });
    } else {
      addThaliAddon({
        id: `addon-${Date.now()}`,
        code: code.trim().toUpperCase() || "EX",
        name: name.trim(),
        portion: portion.trim() || "1 pc",
        price: Number(price) || 35,
        description: description.trim(),
        isVeg,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="rounded-3xl border border-ink/10 bg-frost p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-spice" />
            <h3 className="font-display text-lg font-bold text-ink">
              Order Individual Sides & Extra Rotis Customizer
            </h3>
          </div>
          <p className="text-xs text-ink/60 mt-0.5">
            Manage all customer-facing sides, add-ons, extra rotis, and portion sizes in real-time.
          </p>
        </div>

        <Button
          onClick={openNewModal}
          size="sm"
          className="rounded-full bg-ink hover:bg-spice text-cream text-xs font-semibold h-8 gap-1.5 shadow-sm"
        >
          <Plus className="size-3.5" />
          <span>Add New Side / Roti</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {thaliAddons.map((addon) => (
          <div
            key={addon.id}
            className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-white p-4 shadow-xs hover:border-spice/40 transition-all space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="grid size-7 place-items-center rounded-lg bg-ink text-cream font-mono text-xs font-bold">
                  {addon.code}
                </span>
                <span className="rounded-full bg-cream px-2 py-0.5 font-mono text-[10px] text-ink/70 border border-ink/10">
                  {addon.portion}
                </span>
              </div>
              <h4 className="mt-2.5 font-display text-sm font-bold text-ink">{addon.name}</h4>
              <p className="mt-1 text-[11px] text-ink/60 line-clamp-2">
                {addon.description || "Fresh homestyle preparation"}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-ink/5 pt-2.5">
              <span className="font-display text-base font-bold text-spice">₹{addon.price}</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditModal(addon)}
                  className="h-7 text-xs text-ink/70 hover:text-ink px-2"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteThaliAddon(addon.id)}
                  className="size-7 rounded-full text-ink/40 hover:text-red-600"
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to Add/Edit Sides */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md rounded-3xl border border-ink/10 bg-frost p-6 text-ink shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold text-ink flex items-center gap-2">
              <Sparkles className="size-4 text-spice" />
              <span>{editingAddon ? "Edit Side / Roti" : "Add New Side / Roti"}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-3 text-xs mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-ink/70 block mb-1">Badge Code</label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="LA, RO, DA"
                  className="h-8 text-xs bg-white rounded-xl font-mono uppercase"
                />
              </div>
              <div>
                <label className="font-semibold text-ink/70 block mb-1">Price (₹)</label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="35"
                  className="h-8 text-xs bg-white rounded-xl font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-ink/70 block mb-1">Side / Addon Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Butter Garlic Naan, Tadka Dal"
                className="h-8 text-xs bg-white rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-ink/70 block mb-1">Portion Size</label>
              <Input
                value={portion}
                onChange={(e) => setPortion(e.target.value)}
                placeholder="e.g. 1 pc, 150ml bowl, 2 pcs"
                className="h-8 text-xs bg-white rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-ink/70 block mb-1">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Crisp flaky layered paratha roasted on tawa with desi ghee"
                className="h-8 text-xs bg-white rounded-xl"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-spice hover:bg-ink text-cream rounded-xl text-xs font-bold h-9 mt-2"
            >
              {editingAddon ? "Save Changes" : "Add Side / Add-on"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
