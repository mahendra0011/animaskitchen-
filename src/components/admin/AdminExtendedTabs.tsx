import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KitchenVideo } from "@/types/kitchen";
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
  Edit3,
  Check,
  ChevronRight,
  Sparkles,
  Building,
  Lock,
  Loader2,
  Instagram,
  Facebook,
  ExternalLink,
  Film,
  Video,
  Play,
  Youtube,
  Upload,
  Camera,
  Image,
  RotateCcw,
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

      {/* 4. Day Special Meal Manager (Day-wise meal plan control) */}
      <AdminDaySpecialMealSection />

      {/* 5. 📸 Food Photo Gallery Manager (Directly above Menu) */}
      <AdminFoodGallerySection />

      {/* 6. 🎬 Live Kitchen Video Reels & YouTube Upload Manager (Above Instagram) */}
      <AdminKitchenVideosSection />

      {/* 7. Instagram & Social Feed Manager */}
      <AdminSocialPostsSection />
    </div>
  );
};

/* =========================================================================
   9. Day Special Meal Manager Component
   ========================================================================= */
const AdminDaySpecialMealSection: React.FC = () => {
  const { daySpecialMeal, updateDaySpecialMeal } = useDemoStore();

  const [form, setForm] = useState({
    active: daySpecialMeal.active,
    day: daySpecialMeal.day,
    title: daySpecialMeal.title,
    badge: daySpecialMeal.badge,
    dishName: daySpecialMeal.dishName,
    description: daySpecialMeal.description,
    price: daySpecialMeal.price,
    originalPrice: daySpecialMeal.originalPrice || 220,
    imageUrl: daySpecialMeal.imageUrl,
    isVeg: daySpecialMeal.isVeg,
    itemsText: (daySpecialMeal.itemsIncluded || []).join(", "),
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const items = form.itemsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    updateDaySpecialMeal({
      active: form.active,
      day: form.day as any,
      title: form.title,
      badge: form.badge,
      dishName: form.dishName,
      description: form.description,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice),
      imageUrl: form.imageUrl,
      isVeg: form.isVeg,
      itemsIncluded: items,
    });
  };

  const daysList: Array<typeof daySpecialMeal.day> = [
    "Daily",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="rounded-2xl border border-ink/10 bg-frost/90 p-5 space-y-4 shadow-xs mt-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-spice" />
            <h3 className="font-display text-base font-bold text-ink">
              4. Day Special Meal (Daily Kitchen Special)
            </h3>
          </div>
          <p className="text-xs text-ink/60">
            Control the featured daily meal box shown prominently right above the customer menu.
          </p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-xs font-semibold text-ink">Special Meal Visible</span>
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
            className="size-4 rounded accent-spice cursor-pointer"
          />
        </label>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Schedule Day</label>
            <select
              value={form.day}
              onChange={(e) => setForm({ ...form, day: e.target.value as any })}
              className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink text-xs font-semibold"
            >
              {daysList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Badge Label</label>
            <input
              type="text"
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              placeholder="e.g. CHEF'S SIGNATURE"
              className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Diet Type</label>
            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="mealIsVeg"
                  checked={form.isVeg}
                  onChange={() => setForm({ ...form, isVeg: true })}
                  className="accent-emerald-600"
                />
                <span className="text-xs font-bold text-emerald-700">Pure Veg 🟢</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="mealIsVeg"
                  checked={!form.isVeg}
                  onChange={() => setForm({ ...form, isVeg: false })}
                  className="accent-red-600"
                />
                <span className="text-xs font-bold text-red-700">Non-Veg 🔴</span>
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Special Dish Name</label>
            <input
              type="text"
              value={form.dishName}
              onChange={(e) => setForm({ ...form, dishName: e.target.value })}
              placeholder="e.g. Shahi Rajma Masala & Jeera Rice Deluxe Thali"
              className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink text-xs font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="font-semibold text-ink">Offer Price (₹)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink text-xs font-bold"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-ink">Original Price (₹)</label>
              <input
                type="number"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink text-xs"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-ink">Description</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Special meal items and cooking description..."
            className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink text-xs"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Included Items (comma separated)</label>
            <input
              type="text"
              value={form.itemsText}
              onChange={(e) => setForm({ ...form, itemsText: e.target.value })}
              placeholder="e.g. Rajma, Jeera Rice, 3 Ghee Rotis, Raita, Salad"
              className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Dish Image URL</label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-xl border border-ink/15 bg-cream/70 px-3 py-2 text-ink text-xs font-mono"
            />
          </div>
        </div>

        <div className="pt-1">
          <Button
            type="submit"
            className="rounded-xl bg-spice hover:bg-ink text-cream text-xs font-bold h-9 px-5 gap-1.5 shadow-md"
          >
            <Check className="size-3.5" />
            <span>Update Day Special Meal</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

/* =========================================================================
   10. Social Posts & Instagram Feed Manager Component
   ========================================================================= */
const AdminSocialPostsSection: React.FC = () => {
  const { socialPosts, addSocialPost, deleteSocialPost } = useDemoStore();

  const [newPost, setNewPost] = useState<{
    imageUrl: string;
    caption: string;
    postUrl: string;
    platform: "instagram" | "facebook";
    likesCount: number;
  }>({
    imageUrl: "",
    caption: "",
    postUrl: "https://www.instagram.com/sanjaysingh1599?utm_source=qr&mdxt=NGFucWt6dWlldmlk",
    platform: "instagram",
    likesCount: 150,
  });

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.imageUrl || !newPost.caption) {
      toast.error("Please provide both an image URL and a caption");
      return;
    }

    addSocialPost({
      imageUrl: newPost.imageUrl,
      caption: newPost.caption,
      postUrl: newPost.postUrl,
      platform: newPost.platform,
      likesCount: Number(newPost.likesCount),
    });

    setNewPost({
      imageUrl: "",
      caption: "",
      postUrl: "https://www.instagram.com/sanjaysingh1599?utm_source=qr&mdxt=NGFucWt6dWlldmlk",
      platform: "instagram",
      likesCount: 150,
    });
  };

  const handleSocialFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setNewPost((prev) => ({
        ...prev,
        imageUrl: result,
      }));
      toast.success(`Photo selected: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl border border-ink/10 bg-frost/90 p-5 space-y-5 shadow-xs mt-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Instagram className="size-4 text-pink-600" />
            <h3 className="font-display text-base font-bold text-ink">
              7. Instagram & Kitchen Stories Feed Manager
            </h3>
          </div>
          <p className="text-xs text-ink/60">
            Publish photos and updates to the social grid directly below the menu.
          </p>
        </div>
        <a
          href="https://www.instagram.com/sanjaysingh1599?utm_source=qr&mdxt=NGFucWt6dWlldmlk"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:underline"
        >
          <span>Open Instagram</span>
          <ExternalLink className="size-3" />
        </a>
      </div>

      {/* New Post Form */}
      <form
        onSubmit={handleAddPost}
        className="p-4 rounded-xl border border-ink/10 bg-cream/50 space-y-3 text-xs"
      >
        <h4 className="font-bold text-ink flex items-center gap-1.5">
          <Plus className="size-3.5 text-spice" />
          <span>Publish New Social Post</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-ink flex items-center justify-between">
              <span>Image Source</span>
              <span className="text-[10px] text-ink/50 font-normal">Direct upload or paste URL</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPost.imageUrl}
                onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/... or choose file"
                className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-ink text-xs font-mono"
                required
              />
              <label className="cursor-pointer shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700 transition-colors shadow-xs">
                <Upload className="size-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSocialFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            {newPost.imageUrl && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-ink/20 shadow-xs mt-1">
                <img
                  src={newPost.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-ink">Instagram / Post Link</label>
            <input
              type="text"
              value={newPost.postUrl}
              onChange={(e) => setNewPost({ ...newPost, postUrl: e.target.value })}
              placeholder="https://www.instagram.com/p/..."
              className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-ink text-xs font-mono"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-ink">Caption / Story Description</label>
          <textarea
            rows={2}
            value={newPost.caption}
            onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
            placeholder="e.g. Freshly puffed rotis right off the iron tawa! Made with pure desi ghee..."
            className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-ink text-xs"
            required
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="postPlatform"
                checked={newPost.platform === "instagram"}
                onChange={() => setNewPost({ ...newPost, platform: "instagram" })}
                className="accent-pink-600"
              />
              <span className="text-xs font-medium text-ink">Instagram</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="postPlatform"
                checked={newPost.platform === "facebook"}
                onChange={() => setNewPost({ ...newPost, platform: "facebook" })}
                className="accent-blue-600"
              />
              <span className="text-xs font-medium text-ink">Facebook</span>
            </label>
          </div>

          <Button
            type="submit"
            className="rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold h-9 px-4 gap-1.5 shadow-md"
          >
            <Plus className="size-3.5" />
            <span>Publish Post</span>
          </Button>
        </div>
      </form>

      {/* Existing Posts List */}
      <div className="space-y-2">
        <h4 className="font-bold text-xs text-ink/70">
          Current Active Posts ({socialPosts.length})
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {socialPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl border border-ink/10 bg-cream/70 p-2.5 flex flex-col justify-between gap-2 text-xs"
            >
              <div className="aspect-square rounded-lg overflow-hidden relative">
                <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white font-mono">
                  {post.platform}
                </span>
              </div>
              <p className="line-clamp-2 text-[11px] text-ink/80">{post.caption}</p>
              <div className="flex items-center justify-between pt-1 border-t border-ink/10">
                <span className="text-[10px] text-ink/50">{post.createdAt}</span>
                <button
                  type="button"
                  onClick={() => deleteSocialPost(post.id)}
                  className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                  title="Delete post"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   11. 🎬 Live Kitchen Video Reels & YouTube Upload Manager Component
   ========================================================================= */
export const AdminKitchenVideosSection: React.FC = () => {
  const {
    kitchenVideos,
    addKitchenVideo,
    updateKitchenVideo,
    deleteKitchenVideo,
    resetKitchenVideosToDefault,
  } = useDemoStore();

  const [videoTitle, setVideoTitle] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [videoSourceType, setVideoSourceType] = useState<"local" | "youtube">("local");
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState("0:35");
  const [tagsInput, setTagsInput] = useState("Desi Ghee, Live Kitchen");
  const [youtubeApiKey, setYoutubeApiKey] = useState(
    (import.meta.env as any).VITE_YOUTUBE_API_KEY || "AIzaSyA6pyHfG6mtjsUKzgifkKBDtWIWTSLHQII",
  );
  const [fetchingYoutube, setFetchingYoutube] = useState(false);
  const [uploadingLocal, setUploadingLocal] = useState(false);

  // Edit modal state
  const [editingVideo, setEditingVideo] = useState<KitchenVideo | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editSourceType, setEditSourceType] = useState<"local" | "youtube">("local");

  // Quick preset from copied local reels
  const localPresets = [
    { name: "Reel 1 (Dal Tadka Tarka)", path: "/videos/kitchen-reel-1.mp4", dur: "0:24" },
    { name: "Reel 2 (Hot Tawa Roti)", path: "/videos/kitchen-reel-2.mp4", dur: "0:45" },
    { name: "Reel 3 (Shahi Paneer Handi)", path: "/videos/kitchen-reel-3.mp4", dur: "0:52" },
    { name: "Reel 4 (Sanitized Packaging)", path: "/videos/kitchen-reel-4.mp4", dur: "1:08" },
    { name: "Reel 5 (Chef Special Plating)", path: "/videos/kitchen-reel-5.mp4", dur: "1:45" },
  ];

  const handleStartEditVideo = (video: KitchenVideo) => {
    setEditingVideo(video);
    setEditTitle(video.title);
    setEditDesc(video.description || "");
    setEditUrl(video.videoUrl);
    setEditDuration(video.duration || "0:30");
    setEditSourceType(
      video.sourceType === "youtube" || video.videoUrl.includes("youtube") ? "youtube" : "local",
    );
  };

  const handleEditFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const blobUrl = URL.createObjectURL(file);
      setEditUrl(blobUrl);
      if (!editTitle) {
        setEditTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
      toast.success(`Selected file: ${file.name}`);
    } catch {
      toast.error("Failed to read file");
    }
  };

  const handleSaveEditVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;
    if (!editTitle.trim()) {
      toast.error("Please provide a title");
      return;
    }
    if (!editUrl.trim()) {
      toast.error("Please provide a video URL or file");
      return;
    }

    updateKitchenVideo(editingVideo.id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      videoUrl: editUrl.trim(),
      duration: editDuration.trim() || "0:30",
      sourceType: editSourceType,
    });

    setEditingVideo(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLocal(true);
    try {
      // Create local blob preview URL for instant playback
      const localBlobUrl = URL.createObjectURL(file);
      setVideoUrl(localBlobUrl);
      if (!videoTitle) {
        setVideoTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
      toast.success(`Video file loaded: ${file.name}`);
    } catch {
      toast.error("Failed to read video file");
    } finally {
      setUploadingLocal(false);
    }
  };

  // Fetch YouTube metadata automatically via YouTube API Key
  const handleFetchYouTubeMeta = async (urlToFetch: string) => {
    if (!urlToFetch) return;

    let extractedId = "";
    if (urlToFetch.includes("youtu.be/")) {
      extractedId = urlToFetch.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (urlToFetch.includes("watch?v=")) {
      extractedId = urlToFetch.split("watch?v=")[1]?.split("&")[0] || "";
    } else if (urlToFetch.includes("embed/")) {
      extractedId = urlToFetch.split("embed/")[1]?.split("?")[0] || "";
    } else if (urlToFetch.length === 11) {
      extractedId = urlToFetch;
    }

    if (!extractedId) {
      toast.error("Invalid YouTube URL or Video ID");
      return;
    }

    setFetchingYoutube(true);
    try {
      if (youtubeApiKey) {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${extractedId}&key=${youtubeApiKey}`,
        );
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          const item = data.items[0];
          setVideoTitle(item.snippet.title || videoTitle);
          setVideoDesc(item.snippet.description?.slice(0, 160) || videoDesc);
          toast.success("Fetched YouTube Video Details successfully!");
        } else {
          toast.info("YouTube ID found. (API returned no item, saving link directly)");
        }
      }
    } catch {
      toast.info("Using direct YouTube URL");
    } finally {
      setFetchingYoutube(false);
    }
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) {
      toast.error("Please provide a video title");
      return;
    }
    if (!videoUrl.trim()) {
      toast.error("Please provide a video URL or select an MP4 file");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    addKitchenVideo({
      title: videoTitle.trim(),
      description: videoDesc.trim(),
      videoUrl: videoUrl.trim(),
      sourceType: videoSourceType,
      duration: duration.trim() || "0:30",
      viewsCount: Math.floor(Math.random() * 2000) + 500,
      likesCount: Math.floor(Math.random() * 300) + 50,
      tags: tags.length > 0 ? tags : ["Anima Kitchen", "Live Cooking"],
    });

    // Reset form
    setVideoTitle("");
    setVideoDesc("");
    setVideoUrl("");
  };

  return (
    <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-frost via-white to-orange-500/5 p-5 sm:p-6 space-y-6 shadow-md mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-600 text-white shadow-sm">
              <Film className="size-4" />
            </span>
            <h3 className="font-serif text-lg font-bold text-ink">
              Live Kitchen Video Reels &amp; YouTube Manager
            </h3>
          </div>
          <p className="text-xs text-ink/70 mt-1">
            Display live cooking video reels directly above the Instagram posts section. Supports
            direct MP4 video files, local uploads, and YouTube embeds!
          </p>
        </div>

        <Badge className="bg-orange-600 text-white font-mono text-xs w-fit">
          {kitchenVideos.length} Videos Active
        </Badge>
      </div>

      {/* YouTube API Configuration Strip */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Youtube className="size-4 text-red-600 shrink-0" />
          <span className="font-mono font-bold text-ink">YouTube Data API v3 Key:</span>
          <code className="bg-white/80 px-2 py-0.5 rounded border border-ink/10 text-[11px] font-mono text-ink/80 truncate max-w-[220px]">
            {youtubeApiKey || "Not configured"}
          </code>
        </div>
        <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
          ✓ API Active &amp; Ready
        </span>
      </div>

      {/* Form: Upload / Add New Video */}
      <form onSubmit={handleAddVideo} className="space-y-4 rounded-xl border border-ink/10 bg-white/70 p-4">
        <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-ink/70 flex items-center gap-1.5">
          <Plus className="size-3.5 text-spice" /> Add New Video Reel to Customer Homepage
        </h4>

        {/* Source Selector Tab */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setVideoSourceType("local");
              setVideoUrl("");
            }}
            className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              videoSourceType === "local"
                ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                : "bg-frost text-ink/70 border-ink/15 hover:bg-white"
            }`}
          >
            <Video className="size-3.5" />
            <span>Local MP4 / Video File</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setVideoSourceType("youtube");
              setVideoUrl("");
            }}
            className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              videoSourceType === "youtube"
                ? "bg-red-600 text-white border-red-600 shadow-sm"
                : "bg-frost text-ink/70 border-ink/15 hover:bg-white"
            }`}
          >
            <Youtube className="size-3.5" />
            <span>YouTube URL / Shorts</span>
          </button>
        </div>

        {/* Video Path / Upload Row */}
        {videoSourceType === "local" ? (
          <div className="space-y-2">
            <label className="text-xs font-bold text-ink/80 block">
              Video File Path or File Upload:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="/videos/kitchen-reel-1.mp4 or CDN URL"
                className="flex-1 rounded-xl border border-ink/20 px-3 py-2 text-xs bg-white focus:outline-none focus:border-spice"
              />
              <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink/10 hover:bg-ink/20 text-ink px-4 py-2 text-xs font-bold transition-colors">
                <Upload className="size-3.5" />
                <span>Upload From PC</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quick Presets from C:\Users\mahen\Videos\video shorr */}
            <div className="pt-1">
              <span className="text-[11px] text-ink/60 font-mono block mb-1">
                ⚡ Quick Presets (From your copied kitchen video folder):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {localPresets.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => {
                      setVideoUrl(preset.path);
                      setVideoTitle(preset.name);
                      setDuration(preset.dur);
                    }}
                    className="rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-950 border border-orange-500/20 px-2 py-1 text-[11px] font-mono transition-colors"
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-bold text-ink/80 block">
              YouTube Video URL or Shorts Link:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                className="flex-1 rounded-xl border border-ink/20 px-3 py-2 text-xs bg-white focus:outline-none focus:border-red-500"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleFetchYouTubeMeta(videoUrl)}
                disabled={fetchingYoutube || !videoUrl}
                className="rounded-xl border-red-500/30 text-red-600 hover:bg-red-50 text-xs gap-1"
              >
                {fetchingYoutube ? "Fetching..." : "Fetch Info"}
              </Button>
            </div>
          </div>
        )}

        {/* Video Title and Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-bold text-ink/80 block">Video Title:</label>
            <input
              type="text"
              required
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="e.g. Pure Desi Ghee Dal Tadka Simmering"
              className="w-full rounded-xl border border-ink/20 px-3 py-2 text-xs bg-white focus:outline-none focus:border-spice"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-ink/80 block">Duration / Tags:</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="0:45"
              className="w-full rounded-xl border border-ink/20 px-3 py-2 text-xs bg-white focus:outline-none focus:border-spice"
            />
          </div>
        </div>

        {/* Description & Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-ink/80 block">Short Description:</label>
            <input
              type="text"
              value={videoDesc}
              onChange={(e) => setVideoDesc(e.target.value)}
              placeholder="Live cooking inside Kurji kitchen with pure ingredients"
              className="w-full rounded-xl border border-ink/20 px-3 py-2 text-xs bg-white focus:outline-none focus:border-spice"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-ink/80 block">Tags (comma separated):</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Desi Ghee, Hot Roti, Patna"
              className="w-full rounded-xl border border-ink/20 px-3 py-2 text-xs bg-white focus:outline-none focus:border-spice"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            className="w-full sm:w-auto rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-6 py-2.5 shadow-md gap-2"
          >
            <Plus className="size-4" />
            <span>Publish Video Reel to Homepage</span>
          </Button>
        </div>
      </form>

      {/* Active Videos List & Management */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-ink/70">
            Currently Live Homepage Videos ({kitchenVideos.length})
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetKitchenVideosToDefault}
            className="rounded-xl border-ink/20 text-xs font-mono gap-1.5 h-8 text-ink/70 hover:text-ink"
            title="Reset to default 5 fresh kitchen reels"
          >
            <RotateCcw className="size-3" />
            <span>Reset Default 5 Videos</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {kitchenVideos.map((video) => (
            <div
              key={video.id}
              className="rounded-2xl border border-ink/15 bg-white p-3 space-y-2 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black/90">
                {video.sourceType === "youtube" || video.videoUrl.includes("youtube") ? (
                  <div className="w-full h-full flex items-center justify-center bg-red-950/40 text-red-400">
                    <Youtube className="size-8" />
                  </div>
                ) : (
                  <video
                    src={video.videoUrl}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                )}
                <div className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[9px] font-mono px-2 py-0.5 rounded-full">
                  {video.sourceType.toUpperCase()}
                </div>
                <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                  {video.duration || "0:30"}
                </div>
              </div>

              <div>
                <h5 className="font-bold text-xs text-ink truncate">{video.title}</h5>
                <p className="text-[11px] text-ink/60 truncate mt-0.5">
                  {video.description || "Video reel on homepage"}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-ink/50 truncate">
                  <span className="truncate">URL: {video.videoUrl}</span>
                </div>
              </div>

              {/* Action Buttons: Edit/Change Video or Delete */}
              <div className="flex items-center justify-between pt-2 border-t border-ink/10 text-xs">
                <span className="text-[10px] font-mono text-ink/50">{video.createdAt}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStartEditVideo(video)}
                    className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-800 px-2 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors font-bold text-[11px]"
                    title="Change / Edit this video"
                  >
                    <Edit3 className="size-3" />
                    <span>Change</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteKitchenVideo(video.id)}
                    className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete Video"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal / Dialog for Changing / Editing Existing Video */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-ink/15 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-orange-600 text-white shadow-sm">
                  <Edit3 className="size-4" />
                </span>
                <div>
                  <h4 className="font-serif text-base font-bold text-ink">Change / Update Video Reel</h4>
                  <p className="text-[11px] text-ink/60">Change the video file, title, duration or YouTube link</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingVideo(null)}
                className="size-8 rounded-full bg-ink/5 hover:bg-ink/10 text-ink/60 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditVideo} className="space-y-3.5">
              {/* Change Source Type */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditSourceType("local")}
                  className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    editSourceType === "local"
                      ? "bg-orange-600 text-white border-orange-600"
                      : "bg-frost text-ink/70 border-ink/15"
                  }`}
                >
                  <Video className="size-3.5" />
                  <span>Local MP4 Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditSourceType("youtube")}
                  className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    editSourceType === "youtube"
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-frost text-ink/70 border-ink/15"
                  }`}
                >
                  <Youtube className="size-3.5" />
                  <span>YouTube URL</span>
                </button>
              </div>

              {/* Video URL or File */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-ink/80 block">Video URL or File Path:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    placeholder="/videos/kitchen-reel-1.mp4 or YouTube link"
                    className="flex-1 rounded-xl border border-ink/20 px-3 py-2 text-xs bg-white focus:outline-none focus:border-spice"
                  />
                  {editSourceType === "local" && (
                    <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink/10 hover:bg-ink/20 text-ink px-3 py-2 text-xs font-bold">
                      <Upload className="size-3.5" />
                      <span>Select PC Video</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        onChange={handleEditFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Quick Preset Selector inside Edit Modal */}
              {editSourceType === "local" && (
                <div>
                  <span className="text-[10px] text-ink/60 font-mono block mb-1">
                    ⚡ Quick Presets (Click to swap video immediately):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {localPresets.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          setEditUrl(preset.path);
                          setEditDuration(preset.dur);
                        }}
                        className="rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-950 border border-orange-500/20 px-2 py-0.5 text-[10px] font-mono"
                      >
                        {preset.name.split(" ")[0]} {preset.name.split(" ")[1]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Title & Duration */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-ink/80 block">Video Title:</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-xl border border-ink/20 px-3 py-2 text-xs bg-white focus:outline-none focus:border-spice"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink/80 block">Duration:</label>
                  <input
                    type="text"
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    placeholder="0:45"
                    className="w-full rounded-xl border border-ink/20 px-3 py-2 text-xs bg-white focus:outline-none focus:border-spice"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-ink/80 block">Description:</label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full rounded-xl border border-ink/20 px-3 py-2 text-xs bg-white focus:outline-none focus:border-spice"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-ink/10">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingVideo(null)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 shadow-sm"
                >
                  Save &amp; Update Live Video
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   12. 📸 Food Photo Gallery Manager Component (Above Menu)
   ========================================================================= */
export const AdminFoodGallerySection: React.FC = () => {
  const {
    foodGallery,
    addFoodGalleryItem,
    deleteFoodGalleryItem,
    resetFoodGalleryToDefault,
  } = useDemoStore();

  const [newItem, setNewItem] = useState({
    title: "",
    caption: "",
    tag: "Signature Thali",
    imageUrl: "",
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use FileReader for base64 / blob URL preview
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setNewItem((prev) => ({
        ...prev,
        imageUrl: result,
        title: prev.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      }));
      toast.success(`Photo loaded: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.imageUrl) {
      toast.error("Please provide an image or upload one from your device!");
      return;
    }
    if (!newItem.title.trim()) {
      toast.error("Please enter a title for the food photo!");
      return;
    }

    addFoodGalleryItem({
      imageUrl: newItem.imageUrl,
      title: newItem.title.trim(),
      caption: newItem.caption.trim(),
      tag: newItem.tag,
    });

    setNewItem({
      title: "",
      caption: "",
      tag: "Signature Thali",
      imageUrl: "",
    });
  };

  return (
    <div className="rounded-2xl border border-ink/10 bg-frost/90 p-5 space-y-5 shadow-xs mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="size-4 text-spice" />
            <h3 className="font-display text-base font-bold text-ink">
              5. Authentic Food Photo Gallery Manager (Above Menu)
            </h3>
          </div>
          <p className="text-xs text-ink/60">
            Control the horizontal photo carousel displayed right above the food menu on the customer homepage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-spice/10 text-spice border-spice/20">
            {foodGallery.length} Photos Active
          </Badge>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetFoodGalleryToDefault}
            className="text-xs gap-1.5 h-8 rounded-xl border-ink/20 hover:bg-ink hover:text-white"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset 16 Images</span>
          </Button>
        </div>
      </div>

      {/* Add New Photo Form */}
      <form
        onSubmit={handleAddItem}
        className="p-4 rounded-xl border border-ink/10 bg-cream/50 space-y-3 text-xs"
      >
        <h4 className="font-bold text-ink flex items-center gap-1.5">
          <Plus className="size-3.5 text-spice" />
          <span>Upload & Add Food Image to Carousel</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* File Upload / Image URL */}
          <div className="space-y-1.5">
            <label className="font-semibold text-ink flex items-center justify-between">
              <span>Image Source</span>
              <span className="text-[10px] text-ink/50 font-normal">Direct upload or paste URL</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newItem.imageUrl}
                onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                placeholder="Image URL or choose file below..."
                className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-ink text-xs font-mono"
              />
              <label className="cursor-pointer shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-spice text-white font-bold hover:bg-spice/90 transition-colors shadow-xs">
                <Upload className="size-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            {newItem.imageUrl && (
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-ink/20 shadow-xs mt-1">
                <img
                  src={newItem.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Title & Tag */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="font-semibold text-ink">Photo Title</label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="e.g. Fresh Desi Ghee Dal Tadka"
                className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-ink text-xs font-medium"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-ink">Badge Tag</label>
              <select
                value={newItem.tag}
                onChange={(e) => setNewItem({ ...newItem, tag: e.target.value })}
                className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-ink text-xs font-medium"
              >
                <option value="Signature Thali">Signature Thali</option>
                <option value="Executive Lunch">Executive Lunch</option>
                <option value="Hygiene Standard">Hygiene Standard</option>
                <option value="Pure Veg">Pure Veg</option>
                <option value="Hot Rotis">Hot Rotis</option>
                <option value="Paneer Special">Paneer Special</option>
                <option value="Farm Fresh">Farm Fresh</option>
                <option value="Daily Tiffin">Daily Tiffin</option>
                <option value="Sunday Special">Sunday Special</option>
              </select>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div className="space-y-1">
          <label className="font-semibold text-ink">Caption / Description</label>
          <textarea
            rows={2}
            value={newItem.caption}
            onChange={(e) => setNewItem({ ...newItem, caption: e.target.value })}
            placeholder="e.g. Prepared hot with RO water, zero palm oil, and fresh veggies."
            className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-ink text-xs"
          />
        </div>

        <div className="flex items-center justify-end pt-1">
          <Button
            type="submit"
            className="rounded-xl bg-spice hover:bg-spice/90 text-white text-xs font-bold h-9 px-5 gap-1.5 shadow-md"
          >
            <Plus className="size-3.5" />
            <span>Add to Live Carousel</span>
          </Button>
        </div>
      </form>

      {/* Existing Items Grid */}
      <div className="space-y-2">
        <h4 className="font-bold text-xs text-ink/70">
          Current Live Carousel Images ({foodGallery.length})
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {foodGallery.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl border border-ink/10 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative aspect-square bg-stone-900 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80";
                  }}
                />
                {item.tag && (
                  <span className="absolute top-1.5 left-1.5 rounded-md bg-black/70 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-mono font-bold text-amber-300">
                    {item.tag}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => deleteFoodGalleryItem(item.id)}
                  className="absolute top-1.5 right-1.5 size-6 rounded-md bg-rose-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-rose-700 transition-all shadow-xs"
                  title="Remove from gallery"
                  aria-label="Remove image"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>

              <div className="p-2 space-y-0.5 flex-1 flex flex-col justify-between">
                <p className="font-bold text-[11px] text-ink line-clamp-1">{item.title}</p>
                {item.caption && (
                  <p className="text-[10px] text-ink/60 line-clamp-1">{item.caption}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


