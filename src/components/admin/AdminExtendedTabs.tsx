import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  Star,
  Tag,
  Gift,
  Bell,
  Settings,
  ShoppingBag,
  Truck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  AlertCircle,
  Copy,
  Trash2,
  Edit2,
  Check,
  ChevronRight,
  Sparkles,
  Building,
  Lock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

/* =========================================================================
   1. Category & Combo Management Tab
   ========================================================================= */
export const AdminCategoriesTab: React.FC = () => {
  const [combos, setCombos] = useState([
    {
      id: "combo-1",
      name: "Daily Working Lunch Combo",
      price: 149,
      items: [
        "4 Phulka Rotis",
        "Yellow Dal Tadka",
        "Steamed Rice",
        "Aloo Gobi Sabzi",
        "Kachumber Salad",
      ],
      ordersCount: 342,
      active: true,
    },
    {
      id: "combo-2",
      name: "Deluxe Paneer Feast Combo",
      price: 219,
      items: [
        "3 Ghee Parathas",
        "Paneer Butter Masala",
        "Jeera Rice",
        "Dal Makhani",
        "Gulab Jamun",
      ],
      ordersCount: 189,
      active: true,
    },
    {
      id: "combo-3",
      name: "Homely Diet Bowl Combo",
      price: 169,
      items: ["Brown Rice", "Double Dal Tadka", "Tawa Salad", "Roasted Papad"],
      ordersCount: 94,
      active: true,
    },
  ]);

  const [newComboName, setNewComboName] = useState("");
  const [newComboPrice, setNewComboPrice] = useState("");

  const handleAddCombo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComboName || !newComboPrice) return;
    setCombos([
      ...combos,
      {
        id: `combo-${Date.now()}`,
        name: newComboName,
        price: Number(newComboPrice),
        items: ["4 Rotis", "Dal Tadka", "Rice", "Seasonal Sabzi"],
        ordersCount: 0,
        active: true,
      },
    ]);
    setNewComboName("");
    setNewComboPrice("");
    toast.success("New Combo created successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-frost/90 border border-ink/10 p-5 rounded-2xl">
        <div>
          <h3 className="font-display text-lg font-bold text-ink">Meal Combos & Thali Bundles</h3>
          <p className="text-xs text-ink/60">
            Create pre-packaged lunch boxes, corporate combos, and daily thali specials with custom
            pricing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {combos.map((combo) => (
          <div
            key={combo.id}
            className="bg-frost/90 border border-ink/10 rounded-2xl p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-base font-bold text-ink">{combo.name}</span>
              <span className="font-display text-lg font-bold text-spice">₹{combo.price}</span>
            </div>

            <div className="space-y-1 bg-cream/60 p-3 rounded-xl border border-ink/5">
              <span className="font-mono text-[10px] uppercase text-ink/50 block font-bold">
                Included Items:
              </span>
              <ul className="text-xs text-ink/80 space-y-0.5">
                {combo.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-spice" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-ink/10 text-xs">
              <span className="font-mono text-ink/60">{combo.ordersCount} orders placed</span>
              <Badge className="bg-emerald-500/15 text-emerald-700 font-mono text-[10px] border-none">
                Active in Store
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Combo Card */}
      <form
        onSubmit={handleAddCombo}
        className="bg-frost/70 border border-dashed border-ink/20 rounded-2xl p-5 space-y-3"
      >
        <h4 className="font-display text-sm font-bold text-ink flex items-center gap-1.5">
          <Plus className="size-4 text-spice" /> Add New Fast Lunch Combo
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Combo Name (e.g. Executive Lunch Box)"
            value={newComboName}
            onChange={(e) => setNewComboName(e.target.value)}
            className="rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-xs text-ink placeholder:text-ink/40"
          />
          <input
            type="number"
            placeholder="Price (₹)"
            value={newComboPrice}
            onChange={(e) => setNewComboPrice(e.target.value)}
            className="rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-xs text-ink placeholder:text-ink/40"
          />
          <Button
            type="submit"
            size="sm"
            className="bg-ink hover:bg-spice text-cream rounded-xl text-xs"
          >
            Create Combo
          </Button>
        </div>
      </form>
    </div>
  );
};

/* =========================================================================
   2. Supplier & Purchase Management Tab
   ========================================================================= */
export const AdminSuppliersTab: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      id: "PO-8041",
      supplier: "Nandini Dairy Co-op",
      item: "Fresh Malai Paneer & Curd",
      quantity: "35 kg",
      totalCost: "₹11,200",
      status: "Delivered & Stocked",
      date: "17 Sep 2026",
    },
    {
      id: "PO-8042",
      supplier: "Annapurna Sharbati Flour Mill",
      item: "Sharbati Wheat Flour (Atta)",
      quantity: "200 kg",
      totalCost: "₹8,400",
      status: "In Transit",
      date: "17 Sep 2026",
    },
    {
      id: "PO-8043",
      supplier: "Malnad Pure Desi Ghee Traders",
      item: "A2 Vedic Gir Cow Bilona Ghee",
      quantity: "40 Litres",
      totalCost: "₹34,000",
      status: "Order Sent",
      date: "16 Sep 2026",
    },
  ]);

  const handleCreatePO = () => {
    const newPO = {
      id: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
      supplier: "Mysore Agro Spices Co.",
      item: "Guntur Red Chillies & Cumin Seeds",
      quantity: "15 kg",
      totalCost: "₹4,850",
      status: "Order Sent",
      date: "Today",
    };
    setPurchaseOrders([newPO, ...purchaseOrders]);
    toast.success(`Purchase Order ${newPO.id} generated & dispatched to supplier.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-frost/90 border border-ink/10 p-5 rounded-2xl">
        <div>
          <h3 className="font-display text-lg font-bold text-ink">Suppliers & Purchase Orders</h3>
          <p className="text-xs text-ink/60">
            Automated restocking workflow: Low Stock Trigger → Purchase Request → Supplier
            Fulfillment → Direct Inventory Credit.
          </p>
        </div>
        <Button
          onClick={handleCreatePO}
          size="sm"
          className="bg-ink hover:bg-spice text-cream rounded-xl text-xs gap-1.5"
        >
          <Plus className="size-3.5" /> Generate Purchase Order
        </Button>
      </div>

      <div className="bg-frost/90 border border-ink/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-ink/10 flex items-center justify-between font-display text-sm font-bold text-ink">
          <span>Active Purchase Orders & Procurement Flow</span>
          <span className="font-mono text-xs text-ink/60 font-normal">
            3 Verified Vendor Partners
          </span>
        </div>
        <div className="divide-y divide-ink/10">
          {purchaseOrders.map((po) => (
            <div
              key={po.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-spice">{po.id}</span>
                  <span className="font-bold text-ink">{po.supplier}</span>
                </div>
                <p className="text-ink/70">
                  Item: <span className="font-semibold text-ink">{po.item}</span> · Qty:{" "}
                  {po.quantity}
                </p>
                <span className="font-mono text-[10px] text-ink/50">Placed: {po.date}</span>
              </div>
              <div className="flex sm:flex-col items-end justify-between gap-1">
                <span className="font-display text-sm font-bold text-ink">{po.totalCost}</span>
                <Badge
                  className={`font-mono text-[10px] border-none ${
                    po.status.includes("Delivered")
                      ? "bg-emerald-500/15 text-emerald-700"
                      : po.status.includes("Transit")
                        ? "bg-amber-500/15 text-amber-700"
                        : "bg-blue-500/15 text-blue-700"
                  }`}
                >
                  {po.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   3. Customer Management & CRM Tab
   ========================================================================= */
export const AdminCustomersTab: React.FC = () => {
  const customers = [
    {
      name: "Rahul Sharma",
      phone: "+91 98765 12345",
      ordersCount: 42,
      totalSpent: "₹8,450",
      averageOrder: "₹201.20",
      lastOrder: "Today (1:15 PM)",
      subscription: "Active Monthly Lunch",
      loyaltyPoints: 920,
      tier: "VIP Customer",
      favourite: "Dal Tadka Thali",
    },
    {
      name: "Priya Patel",
      phone: "+91 98450 67890",
      ordersCount: 28,
      totalSpent: "₹5,620",
      averageOrder: "₹200.70",
      lastOrder: "Yesterday",
      subscription: "Active Weekly Dinner",
      loyaltyPoints: 560,
      tier: "Regular",
      favourite: "Rajma Chawal Bowl",
    },
    {
      name: "Vikram Sen",
      phone: "+91 99887 44332",
      ordersCount: 16,
      totalSpent: "₹3,940",
      averageOrder: "₹246.25",
      lastOrder: "3 days ago",
      subscription: "None",
      loyaltyPoints: 340,
      tier: "Occasional",
      favourite: "Paneer Butter Masala Thali",
    },
    {
      name: "Ananya Iyer",
      phone: "+91 97412 88990",
      ordersCount: 35,
      totalSpent: "₹7,210",
      averageOrder: "₹206.00",
      lastOrder: "Today (12:40 PM)",
      subscription: "Active Monthly Lunch",
      loyaltyPoints: 810,
      tier: "VIP Customer",
      favourite: "Dal Tadka Thali + Roti Pack",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-frost/90 border border-ink/10 p-5 rounded-2xl">
        <div>
          <h3 className="font-display text-lg font-bold text-ink">
            Customer Database & CRM Profiles
          </h3>
          <p className="text-xs text-ink/60">
            Real-time customer metrics: lifetime spending, order velocity, active tiffin plan, and
            favorite items.
          </p>
        </div>
        <div className="font-mono text-xs text-ink/70 bg-cream/60 px-3 py-1.5 rounded-xl border border-ink/10">
          Total Customers: <span className="font-bold text-ink">1,480+</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customers.map((c, idx) => (
          <div
            key={idx}
            className="bg-frost/90 border border-ink/10 rounded-2xl p-5 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-2xl bg-ink text-cream font-display text-sm font-bold">
                  {c.name.charAt(0)}
                </span>
                <div>
                  <h4 className="font-display text-sm font-bold text-ink">{c.name}</h4>
                  <span className="font-mono text-[11px] text-ink/60">{c.phone}</span>
                </div>
              </div>
              <Badge
                className={`font-mono text-[10px] border-none ${
                  c.tier === "VIP Customer"
                    ? "bg-amber-500/20 text-amber-800"
                    : "bg-blue-500/10 text-blue-700"
                }`}
              >
                {c.tier}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-cream/60 p-3 rounded-xl border border-ink/5 text-center">
              <div>
                <span className="font-mono text-[9px] uppercase text-ink/50 block">
                  Total Orders
                </span>
                <span className="font-display text-sm font-bold text-ink">{c.ordersCount}</span>
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase text-ink/50 block">
                  Total Spent
                </span>
                <span className="font-display text-sm font-bold text-spice">{c.totalSpent}</span>
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase text-ink/50 block">
                  Loyalty Pts
                </span>
                <span className="font-display text-sm font-bold text-amber-600">
                  ⭐ {c.loyaltyPoints}
                </span>
              </div>
            </div>

            <div className="text-xs space-y-1 text-ink/75 pt-1">
              <p>
                <span className="text-ink/50 font-mono">Tiffin Plan:</span>{" "}
                <span className="font-semibold text-emerald-700">{c.subscription}</span>
              </p>
              <p>
                <span className="text-ink/50 font-mono">Favorite:</span>{" "}
                <span className="font-semibold">{c.favourite}</span>
              </p>
              <p>
                <span className="text-ink/50 font-mono">Last Order:</span>{" "}
                <span>{c.lastOrder}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   4. Subscriptions / Tiffin Management Tab
   ========================================================================= */
export const AdminSubscriptionsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-frost/90 border border-ink/10 p-5 rounded-2xl">
        <div>
          <h3 className="font-display text-lg font-bold text-ink">
            Tiffin & Subscription Control Room
          </h3>
          <p className="text-xs text-ink/60">
            Daily meal schedule, batch dispatch timers, meal pauses, and delivery route
            optimization.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/15 text-emerald-700 font-mono text-xs px-3 py-1 border-none">
            48 Active Tiffins Tomorrow
          </Badge>
        </div>
      </div>

      {/* Tiffin Schedule Calendar View */}
      <div className="bg-frost/90 border border-ink/10 rounded-2xl p-5 shadow-sm space-y-4">
        <h4 className="font-display text-sm font-bold text-ink">Weekly Tiffin Delivery Calendar</h4>
        <div className="grid grid-cols-7 gap-2 text-center text-xs">
          {[
            { day: "Mon", status: "Active", count: "52 meals", icon: "✅" },
            { day: "Tue", status: "Active", count: "48 meals", icon: "✅" },
            { day: "Wed", status: "Paused", count: "44 meals", icon: "⏸" },
            { day: "Thu", status: "Active", count: "50 meals", icon: "✅" },
            { day: "Fri", status: "Active", count: "54 meals", icon: "✅" },
            { day: "Sat", status: "Weekend Special", count: "24 meals", icon: "🍛" },
            { day: "Sun", status: "Closed", count: "Kitchen Rest", icon: "❌" },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-cream/70 border border-ink/10 rounded-xl space-y-1">
              <span className="font-display font-bold text-sm block text-ink">{item.day}</span>
              <span className="text-base block">{item.icon}</span>
              <span className="font-mono text-[10px] text-ink/60 block">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   5. Reviews & Ratings Moderation Tab
   ========================================================================= */
export const AdminReviewsTab: React.FC = () => {
  const reviews = [
    {
      id: "rev-1",
      customer: "Mahendra Singh",
      rating: 5,
      food: "Dal Tadka Thali",
      comment:
        "Hot, genuine desi ghee smell, and soft tawa rotis! Best homemade food experience in Bangalore.",
      time: "2 hours ago",
      verified: true,
    },
    {
      id: "rev-2",
      customer: "Sneha Reddy",
      rating: 5,
      food: "Monthly Tiffin Subscription",
      comment: "Daily on-time at 1:00 PM sharp. The dabba packaging keeps food steaming hot.",
      time: "5 hours ago",
      verified: true,
    },
    {
      id: "rev-3",
      customer: "Arun K.",
      rating: 4,
      food: "Rajma Chawal Bowl",
      comment: "Super tasty and hearty portion. A bit more onion salad would be perfect!",
      time: "Yesterday",
      verified: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-frost/90 border border-ink/10 p-5 rounded-2xl">
        <div>
          <h3 className="font-display text-lg font-bold text-ink">
            Customer Reviews & Ratings Hub
          </h3>
          <p className="text-xs text-ink/60">
            Overall Rating: 4.9★ across 1,240+ verified customer reviews.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-frost/90 border border-ink/10 rounded-2xl p-4 shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-ink">{rev.customer}</span>
                <span className="font-mono text-[10px] text-ink/50">· {rev.time}</span>
                {rev.verified && (
                  <Badge className="bg-emerald-500/10 text-emerald-700 font-mono text-[9px] border-none">
                    Verified Order
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-0.5 text-amber-500 text-xs">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-amber-500" />
                ))}
              </div>
            </div>
            <p className="text-xs text-ink/80">{rev.comment}</p>
            <div className="flex items-center justify-between text-[11px] text-ink/60 pt-1 border-t border-ink/5">
              <span>
                Item: <strong className="text-ink">{rev.food}</strong>
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[11px] text-spice hover:underline p-0"
              >
                Reply as Kitchen →
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminMarketingTab: React.FC = () => {
  const [emailSubject, setEmailSubject] = useState("🔥 Hot Homestyle Thali Special Today!");
  const [emailTitle, setEmailTitle] = useState("Fresh Desi Ghee Special Lunch");
  const [emailMessage, setEmailMessage] = useState(
    "Cooked fresh today in small batches. Enjoy ₹50 OFF with code GHEE50 on your order!",
  );
  const [targetAudience, setTargetAudience] = useState("all");
  const [isSending, setIsSending] = useState(false);

  const handleSendBroadcast = async () => {
    setIsSending(true);
    toast.loading("Sending branded email broadcast...", { id: "broadcast" });
    try {
      const res = await fetch("/api/email/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: [
            "customer@animaskitchen.com",
            "office.lunch@animas.com",
            "rahul.singh@gmail.com",
          ],
          subject: emailSubject,
          title: emailTitle,
          message: emailMessage,
          buttonText: "Order Warm Food Now",
          buttonUrl: "http://localhost:3000",
        }),
      });
      const data = await res.json();
      toast.dismiss("broadcast");
      if (res.ok && data.success) {
        toast.success(`Branded Email Broadcast delivered to ${data.result?.sent || 3} customers!`);
      } else {
        toast.error(data.error || "Broadcast delivery failed.");
      }
    } catch {
      toast.dismiss("broadcast");
      toast.error("Network error sending broadcast.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-frost/90 border border-ink/10 p-5 rounded-2xl">
        <div>
          <h3 className="font-display text-lg font-bold text-ink">
            Marketing & Email Broadcast Hub
          </h3>
          <p className="text-xs text-ink/60">
            Send premium branded HTML email campaigns, today's specials, and festive discounts to
            all customers.
          </p>
        </div>
      </div>

      {/* Live Email Broadcast Composer */}
      <div className="bg-frost/90 border border-ink/10 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-spice" />
          <h4 className="font-display text-sm font-bold text-ink">
            Compose Branded Email Campaign
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Email Subject Line</label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink focus:outline-none focus:border-spice font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Target Segment</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink focus:outline-none focus:border-spice"
            >
              <option value="all">📢 All Customers (1,240)</option>
              <option value="lunch">🍱 Weekday Lunch Subscribers (380)</option>
              <option value="inactive">⚡ Inactive 15+ Days Segment (142)</option>
              <option value="vips">⭐ VIP Repeat Customers (68)</option>
            </select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-semibold text-ink">Campaign Headline (Header Banner)</label>
            <input
              type="text"
              value={emailTitle}
              onChange={(e) => setEmailTitle(e.target.value)}
              className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink focus:outline-none focus:border-spice font-bold"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-semibold text-ink">Campaign Message Body</label>
            <textarea
              rows={3}
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink focus:outline-none focus:border-spice resize-none"
            />
          </div>
        </div>

        <Button
          disabled={isSending}
          onClick={handleSendBroadcast}
          className="bg-spice hover:bg-ink text-cream text-xs rounded-xl h-9 px-5 flex items-center gap-2 font-semibold shadow-md"
        >
          <Send className="size-3.5" />
          <span>{isSending ? "Dispatching..." : "Send Branded Email Broadcast"}</span>
        </Button>
      </div>

      {/* Preset Fast Campaigns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: "Inactive 15+ Days Segment",
            count: "142 Customers",
            offer: "₹75 OFF on Orders above ₹249",
            code: "WELCOMEBACK75",
          },
          {
            title: "Weekday Lunch Subscribers",
            count: "380 Customers",
            offer: "Free Gulab Jamun on Friday Thali",
            code: "SWEETFRIDAY",
          },
          {
            title: "High-Spending VIPs (₹5K+)",
            count: "68 Customers",
            offer: "Double Loyalty Points Weekend",
            code: "VIPDOUBLE",
          },
        ].map((camp, idx) => (
          <div
            key={idx}
            className="bg-frost/90 border border-ink/10 rounded-2xl p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <Badge className="bg-spice/10 text-spice font-mono text-[10px] border-none uppercase">
                {camp.code}
              </Badge>
              <span className="font-mono text-xs text-ink/60">{camp.count}</span>
            </div>
            <h4 className="font-display text-sm font-bold text-ink">{camp.title}</h4>
            <p className="text-xs text-ink/75 bg-cream/60 p-2.5 rounded-xl border border-ink/5">
              "{camp.offer}"
            </p>
            <Button
              size="sm"
              onClick={() => {
                setEmailSubject(`Special Offer for you: ${camp.offer}`);
                setEmailTitle(camp.title);
                setEmailMessage(`Use coupon code ${camp.code} at checkout to get ${camp.offer}!`);
                toast.info(
                  `Populated broadcast with ${camp.code}! Click 'Send Branded Email Broadcast' above.`,
                );
              }}
              className="w-full bg-ink hover:bg-spice text-cream text-xs rounded-xl h-8"
            >
              Use Campaign Template
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   7. Business Settings Tab
   ========================================================================= */
export const AdminSettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-frost/90 border border-ink/10 p-5 rounded-2xl space-y-4">
        <h3 className="font-display text-lg font-bold text-ink">Kitchen & Business Settings</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Kitchen Operating Timings</label>
            <input
              type="text"
              defaultValue="10:30 AM – 10:30 PM (Daily)"
              className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Delivery Radius</label>
            <input
              type="text"
              defaultValue="7.5 km Geofence (Indiranagar / Domlur / Koramangala)"
              className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-semibold text-ink">GSTIN Registration</label>
            <input
              type="text"
              defaultValue="29ABCDE1234F1Z5 (Food Services 5% GST)"
              className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Delivery Charge Rule</label>
            <input
              type="text"
              defaultValue="Free above ₹299 · ₹25 below ₹299"
              className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink"
            />
          </div>
        </div>

        <Button
          onClick={() => toast.success("Kitchen settings saved!")}
          className="bg-ink hover:bg-spice text-cream rounded-xl text-xs h-9 px-4"
        >
          Save Configuration
        </Button>
      </div>

      {/* Admin Password & Account Security Section */}
      <AdminPasswordManagerCard />
    </div>
  );
};

export const AdminPasswordManagerCard: React.FC = () => {
  const { currentUser } = useDemoStore();
  const [targetEmail, setTargetEmail] = useState(currentUser?.email || "animaskitchen24@gmail.com");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error("Please fill in current and new password.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail,
          oldPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Password updated successfully in secure vault!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Failed to change password.");
      }
    } catch {
      toast.error("Network error updating password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-frost/90 border border-ink/10 p-5 rounded-2xl space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-ink/10 pb-3">
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold text-ink flex items-center gap-2">
            <Lock className="size-4 text-spice" />
            <span>Account Security & Password Vault</span>
          </h3>
          <p className="text-xs text-ink/60">
            Change administrative passwords directly with military-grade scrypt hashing.
          </p>
        </div>
        <Badge className="bg-leaf/15 text-leaf font-mono text-[10px] uppercase border-none">
          AES-Scrypt Protected
        </Badge>
      </div>

      <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-semibold text-ink">Account Email to Update</label>
            <input
              type="email"
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
              className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink font-mono focus:border-spice"
              placeholder="animaskitchen24@gmail.com"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-semibold text-ink">Current Old Password</label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink font-mono focus:border-spice"
              placeholder="Enter current password"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-ink">New Strong Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink font-mono focus:border-spice"
              placeholder="At least 6 characters"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink font-mono focus:border-spice"
              placeholder="Re-type new password"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="bg-spice hover:bg-ink text-cream rounded-xl text-xs h-9 px-5 gap-1.5 font-bold shadow-md shadow-spice/20"
        >
          {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Lock className="size-3.5" />}
          <span>Update & Save New Password</span>
        </Button>
      </form>
    </div>
  );
};

/* =========================================================================
   8. Homepage & Festival Customizer Tab (Dynamic Storefront CMS)
   ========================================================================= */
export const AdminHomepageCustomizerTab: React.FC = () => {
  const { homepageCustomization, updateHomepageCustomization } = useDemoStore();

  const [form, setForm] = useState({
    festivalBannerActive: homepageCustomization.festivalBannerActive,
    festivalBannerText: homepageCustomization.festivalBannerText,
    festivalBadge: homepageCustomization.festivalBadge,
    heroBadge: homepageCustomization.heroBadge,
    heroHeadline: homepageCustomization.heroHeadline,
    heroSubheadline: homepageCustomization.heroSubheadline,
    heroTagline: homepageCustomization.heroTagline,
    announcementColor: homepageCustomization.announcementColor,
    ctaButtonText: homepageCustomization.ctaButtonText,
    posterBannerActive: homepageCustomization.posterBannerActive ?? true,
    posterBannerTitle: homepageCustomization.posterBannerTitle ?? "Special Festive Feast Box",
    posterBannerDescription:
      homepageCustomization.posterBannerDescription ??
      "Prepared with traditional slow-fire copper handis, organic saffron, and rich dry fruits for festive gatherings.",
    festivalCouponCode: homepageCustomization.festivalCouponCode ?? "FESTIVE20",
    specialOfferBannerText:
      homepageCustomization.specialOfferBannerText ?? "Flat 20% OFF on all Festive Thalis",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomepageCustomization(form);
  };

  const handleApplyPreset = (preset: "diwali" | "eid" | "holi" | "normal") => {
    if (preset === "diwali") {
      setForm({
        ...form,
        festivalBannerActive: true,
        festivalBannerText:
          "🪔 Shubh Deepawali Special: 100% Shahi Desi Ghee Thalis & Gulab Jamun Sweets",
        festivalBadge: "DIWALI SPECIAL",
        heroBadge: "100% PURE DESI GHEE HOMESTYLE FEAST",
        heroHeadline: "Diwali Ki Mithas, Ghar Ka Swad",
        heroSubheadline:
          "Special festive feasts prepared with organic ghee and roasted dry fruits.",
        heroTagline:
          "Celebrate festivals with authentic home-cooked thalis delivered hot in insulated boxes.",
        announcementColor: "saffron",
        ctaButtonText: "Order Diwali Feast",
        posterBannerActive: true,
        posterBannerTitle: "Grand Festive Diwali Thali Box",
        posterBannerDescription:
          "Includes 4 Shahi Paneer, Dal Makhani, Kesari Pulao, 4 Desi Ghee Phulkas & 2 Hot Gulab Jamun.",
        festivalCouponCode: "DIWALI25",
        specialOfferBannerText: "Flat 25% OFF with code DIWALI25",
      });
      toast.info("Applied Diwali Preset! Click 'Publish Live' to apply to customer homepage.");
    } else if (preset === "eid") {
      setForm({
        ...form,
        festivalBannerActive: true,
        festivalBannerText: "🌙 Eid Mubarak Special: Royal Dum Pulao, Sheer Khurma & Shahi Daal",
        festivalBadge: "EID CELEBRATION",
        heroBadge: "SPECIAL FESTIVE MENU",
        heroHeadline: "Eid Special Homestyle Feast",
        heroSubheadline:
          "Traditional festive delicacies cooked slow with aromatic cardamom & saffron.",
        heroTagline: "Steaming hot authentic feast dispatched within 25 minutes.",
        announcementColor: "emerald",
        ctaButtonText: "Order Eid Special",
        posterBannerActive: true,
        posterBannerTitle: "Royal Festive Feast Combo",
        posterBannerDescription:
          "Slow-simmered rich dal, fragrant basmati pulao, tawa breads and handmade festive dessert.",
        festivalCouponCode: "EIDMUBARAK",
        specialOfferBannerText: "Free Festive Dessert on Orders Above ₹299",
      });
      toast.info("Applied Eid Preset! Click 'Publish Live' to apply.");
    } else if (preset === "holi") {
      setForm({
        ...form,
        festivalBannerActive: true,
        festivalBannerText:
          "🎨 Rangon Wali Holi Special: Thandai, Malpua & Desi Chole Bhature Special",
        festivalBadge: "HOLI CELEBRATION",
        heroBadge: "FESTIVE FLAVOURS",
        heroHeadline: "Holi Special Swadist Thalis",
        heroSubheadline: "Enjoy colorful festival foods cooked fresh in cold-pressed oils.",
        heroTagline: "Hot home meals for family gatherings and festive celebrations.",
        announcementColor: "spice",
        ctaButtonText: "Order Holi Special",
        posterBannerActive: true,
        posterBannerTitle: "Holi Family Feast Box",
        posterBannerDescription:
          "Special festival combo with sweet surprises and traditional thalis.",
        festivalCouponCode: "HOLI20",
        specialOfferBannerText: "Flat 20% OFF with code HOLI20",
      });
      toast.info("Applied Holi Preset! Click 'Publish Live' to apply.");
    } else {
      setForm({
        ...form,
        festivalBannerActive: false,
        festivalBannerText: "✨ Fresh Homestyle Meals Cooked Daily in Small Batches",
        festivalBadge: "DAILY SPECIAL",
        heroBadge: "100% PURE DESI COW GHEE",
        heroHeadline: "Ghar jaisa swaad.",
        heroSubheadline: "Har din.",
        heroTagline:
          "Desi thalis, made with love and traditional recipes. Freshly cooked, just like home.",
        announcementColor: "saffron",
        ctaButtonText: "Order Thali",
        posterBannerActive: true,
        posterBannerTitle: "Stone-Ground Spices & Desi Cow Ghee",
        posterBannerDescription:
          "Prepared with traditional slow-fire copper handis, organic lentils, and fresh farm vegetables.",
        festivalCouponCode: "WELCOME50",
        specialOfferBannerText: "Flat ₹50 OFF on your first 3 orders",
      });
      toast.info("Applied Standard Everyday Preset! Click 'Publish Live' to apply.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Festival Presets Bar */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-950/20 via-orange-950/10 to-transparent p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-spice" />
              <h3 className="font-display text-base font-bold text-ink">
                1-Click Festival Themes & Presets
              </h3>
            </div>
            <p className="text-xs text-ink/60 mt-1">
              Instantly customize all homepage banners, festival text, and posters for any Indian
              festival.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleApplyPreset("diwali")}
              className="rounded-xl border-amber-500/30 bg-amber-500/10 text-amber-900 hover:bg-amber-500/20 font-bold text-xs"
            >
              🪔 Diwali Special
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleApplyPreset("eid")}
              className="rounded-xl border-emerald-500/30 bg-emerald-500/10 text-emerald-900 hover:bg-emerald-500/20 font-bold text-xs"
            >
              🌙 Eid Special
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleApplyPreset("holi")}
              className="rounded-xl border-rose-500/30 bg-rose-500/10 text-rose-900 hover:bg-rose-500/20 font-bold text-xs"
            >
              🎨 Holi Special
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleApplyPreset("normal")}
              className="rounded-xl text-ink/70 hover:text-ink font-semibold text-xs"
            >
              Default Everyday
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Festival Announcement Top Banner */}
        <div className="rounded-2xl border border-ink/10 bg-frost/90 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-ink">
                1. Top Festival Announcement Bar
              </h3>
              <p className="text-xs text-ink/60">Shows at the very top of the customer website.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs font-semibold text-ink">Banner Visible</span>
              <input
                type="checkbox"
                checked={form.festivalBannerActive}
                onChange={(e) => setForm({ ...form, festivalBannerActive: e.target.checked })}
                className="size-4 rounded accent-spice cursor-pointer"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-semibold text-ink">Announcement Message</label>
              <input
                type="text"
                value={form.festivalBannerText}
                onChange={(e) => setForm({ ...form, festivalBannerText: e.target.value })}
                placeholder="e.g. ✨ Diwali Special: 100% Shahi Desi Ghee Preparation & Sweets"
                className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink text-xs focus:ring-1 focus:ring-spice"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-ink">Badge Tag</label>
              <input
                type="text"
                value={form.festivalBadge}
                onChange={(e) => setForm({ ...form, festivalBadge: e.target.value })}
                placeholder="e.g. FESTIVE SPECIAL"
                className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-ink">Banner Color Theme</label>
              <select
                value={form.announcementColor}
                onChange={(e) =>
                  setForm({
                    ...form,
                    announcementColor: e.target.value as "saffron" | "spice" | "emerald" | "purple",
                  })
                }
                className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink text-xs"
              >
                <option value="saffron">Golden Saffron (Diwali / Autumn)</option>
                <option value="spice">Fiery Spice Orange (Holi / Specials)</option>
                <option value="emerald">Royal Emerald Green (Eid / Summer)</option>
                <option value="purple">Festive Purple & Indigo (Royal Feasts)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-ink">Promo / Coupon Code</label>
              <input
                type="text"
                value={form.festivalCouponCode}
                onChange={(e) => setForm({ ...form, festivalCouponCode: e.target.value })}
                placeholder="e.g. FESTIVE20"
                className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink font-mono text-xs uppercase"
              />
            </div>
          </div>
        </div>

        {/* 2. Main Hero Section Customizer */}
        <div className="rounded-2xl border border-ink/10 bg-frost/90 p-5 space-y-4 shadow-xs">
          <div>
            <h3 className="font-display text-base font-bold text-ink">
              2. Homepage Hero Headline & Branding
            </h3>
            <p className="text-xs text-ink/60">
              Customize the main hero title, badges and call-to-action button.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-ink">Hero Top Badge Pill</label>
              <input
                type="text"
                value={form.heroBadge}
                onChange={(e) => setForm({ ...form, heroBadge: e.target.value })}
                placeholder="e.g. 100% Desi Cow Ghee"
                className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-ink">Hero Main Headline (H1)</label>
              <input
                type="text"
                value={form.heroHeadline}
                onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
                placeholder="e.g. Ghar jaisa swaad."
                className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-ink">Hero Accent Highlight Word</label>
              <input
                type="text"
                value={form.heroSubheadline}
                onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })}
                placeholder="e.g. Har din."
                className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-ink">CTA Button Text</label>
              <input
                type="text"
                value={form.ctaButtonText}
                onChange={(e) => setForm({ ...form, ctaButtonText: e.target.value })}
                placeholder="e.g. Order Festive Thali"
                className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink text-xs"
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-semibold text-ink">Hero Subtitle / Description</label>
              <textarea
                rows={2}
                value={form.heroTagline}
                onChange={(e) => setForm({ ...form, heroTagline: e.target.value })}
                placeholder="Desi thalis, made with love and traditional recipes. Freshly cooked, just like home."
                className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink text-xs"
              />
            </div>
          </div>
        </div>

        {/* 3. Festival Poster Showcase Box */}
        <div className="rounded-2xl border border-ink/10 bg-frost/90 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-ink">
                3. Festival Poster & Feast Box Showcase
              </h3>
              <p className="text-xs text-ink/60">
                Large promotional banner card shown right below the menu.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs font-semibold text-ink">Poster Card Visible</span>
              <input
                type="checkbox"
                checked={form.posterBannerActive}
                onChange={(e) => setForm({ ...form, posterBannerActive: e.target.checked })}
                className="size-4 rounded accent-spice cursor-pointer"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-ink">Poster Card Title</label>
              <input
                type="text"
                value={form.posterBannerTitle}
                onChange={(e) => setForm({ ...form, posterBannerTitle: e.target.value })}
                placeholder="e.g. Special Festive Feast Box"
                className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-ink">Bottom Badge Note</label>
              <input
                type="text"
                value={form.specialOfferBannerText}
                onChange={(e) => setForm({ ...form, specialOfferBannerText: e.target.value })}
                placeholder="e.g. Flat 20% OFF on all Festive Thalis"
                className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink text-xs"
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-semibold text-ink">Poster Description</label>
              <textarea
                rows={2}
                value={form.posterBannerDescription}
                onChange={(e) => setForm({ ...form, posterBannerDescription: e.target.value })}
                placeholder="Detailed festival feast description..."
                className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink text-xs"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            className="rounded-xl bg-spice hover:bg-ink text-cream text-xs font-bold h-10 px-6 gap-2 shadow-md hover:scale-[1.02] transition-all"
          >
            <Check className="size-4" />
            <span>Publish Live to Customer Homepage</span>
          </Button>
          <span className="text-xs text-ink/60">
            Changes reflect instantly on customer website without server restart!
          </span>
        </div>
      </form>
    </div>
  );
};
