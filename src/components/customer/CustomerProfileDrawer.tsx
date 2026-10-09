import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  User,
  MapPin,
  Clock,
  RotateCw,
  ShoppingBag,
  MessageSquare,
  Send,
  Sparkles,
  Phone,
  Mail,
  ChevronRight,
  Star,
  LogOut,
  Gift,
  Award,
  Wallet,
  Share2,
  LifeBuoy,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Heart,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { TicketIssueType } from "@/types/kitchen";

export const CustomerProfileDrawer: React.FC = () => {
  const {
    profileDrawerOpen,
    setProfileDrawerOpen,
    customerProfile,
    orders,
    addToCart,
    setCartDrawerOpen,
    setActiveOrderId,
    setTrackingViewOpen,
    logout,
    loyaltyProfile,
    redeemLoyaltyPoints,
    customerWallet,
    addWalletMoney,
    hasKitchenPass,
    setHasKitchenPass,
    supportTickets,
    createSupportTicket,
    wishlistIds,
    toggleWishlist,
    menuItems,
  } = useDemoStore();

  const [activeTab, setActiveTab] = useState<
    "orders" | "wishlist" | "wallet" | "tickets" | "support"
  >("orders");

  // Support ticket form
  const [ticketIssue, setTicketIssue] = useState<TicketIssueType>("missing_item");
  const [ticketOrderNum, setTicketOrderNum] = useState<string>(
    orders[0]?.orderNumber || "#AK-8491",
  );
  const [ticketDesc, setTicketDesc] = useState<string>("");
  const [ticketSuccess, setTicketSuccess] = useState<string | null>(null);

  // Chat messages
  const [supportMessage, setSupportMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: "user" | "support"; text: string; time: string }>
  >([
    {
      sender: "support",
      text: "Namaste! Welcome to Anima's Kitchen support. How can we serve you?",
      time: "Just now",
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;

    const userText = supportMessage;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setSupportMessage("");

    setTimeout(() => {
      let reply = "Our head chef has received your note! We cook fresh within 15 minutes.";
      if (userText.toLowerCase().includes("where") || userText.toLowerCase().includes("track")) {
        reply = "Delivery partner Rajesh Kumar is on 100ft Road and will reach in ~12 mins!";
      } else if (userText.toLowerCase().includes("cancel")) {
        reply = "Orders can be cancelled within 2 minutes of dispatch by calling +91 98765 43210.";
      }
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "support",
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 800);
  };

  const handleReorder = (order: (typeof orders)[0]) => {
    order.items.forEach((item) => {
      addToCart(item.menuItem, item.selectedAddons, item.specialInstructions);
    });
    setProfileDrawerOpen(false);
    setCartDrawerOpen(true);
    toast.success(`Re-ordered items from #${order.orderNumber}!`);
  };

  const handleRedeem = (points: number, rewardLabel: string) => {
    const success = redeemLoyaltyPoints(points, rewardLabel);
    if (success) {
      toast.success(`Redeemed ${points} points for "${rewardLabel}"!`);
    } else {
      toast.error("Not enough loyalty points available.");
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketDesc.trim()) return;
    createSupportTicket({
      customerName: customerProfile.name,
      phone: customerProfile.phone,
      orderNumber: ticketOrderNum,
      issueType: ticketIssue,
      description: ticketDesc,
      status: "open",
    });
    setTicketSuccess("Support grievance ticket raised successfully! Ops team assigned.");
    setTicketDesc("");
    setTimeout(() => setTicketSuccess(null), 3000);
  };

  const handleShareReferral = () => {
    const text = `Hey! Order authentic home-style thalis from Anima's Kitchen using my referral code ${loyaltyProfile.referralCode} and get ₹50 off your first meal! https://animas-kitchen.in`;
    navigator.clipboard.writeText(text);
    toast.success("Referral link copied to clipboard! Share on WhatsApp.");
  };

  return (
    <Sheet open={profileDrawerOpen} onOpenChange={setProfileDrawerOpen}>
      <SheetContent className="flex w-full flex-col justify-between p-0 sm:max-w-md bg-frost text-ink border-l border-ink/10 shadow-2xl">
        {/* Profile Header */}
        <SheetHeader className="border-b border-ink/10 bg-cream/90 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-ink font-display text-xl text-cream">
                {customerProfile.name.charAt(0)}
              </div>
              <div>
                <SheetTitle className="font-display text-xl text-ink">
                  {customerProfile.name}
                </SheetTitle>
                <p className="text-xs text-ink/60 flex items-center gap-2">
                  <span>+91 {customerProfile.phone}</span>
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                setProfileDrawerOpen(false);
                toast.success("Logged out successfully");
              }}
              className="h-8 rounded-full border-red-200 bg-red-50/50 px-2.5 text-xs font-semibold text-red-600 hover:bg-red-100 hover:text-red-700 gap-1"
            >
              <LogOut className="size-3.5" />
              <span>Logout</span>
            </Button>
          </div>

          {/* Quick Metrics */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-center font-mono">
            <div className="rounded-xl border border-ink/10 bg-frost p-2">
              <span className="text-[9px] text-ink/50 block uppercase font-bold">Past Orders</span>
              <span className="font-display text-base text-ink font-bold">{orders.length}</span>
            </div>
            <div className="rounded-xl border border-ink/10 bg-frost p-2">
              <span className="text-[9px] text-ink/50 block uppercase font-bold">
                Free Delivery Pass
              </span>
              <span className="font-display text-xs text-ink font-bold block mt-0.5">
                {hasKitchenPass ? "Active 👑" : "₹99/mo"}
              </span>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="mt-4 flex border-b border-ink/10 overflow-x-auto scrollbar-none gap-1">
            {[
              { id: "orders", label: "Orders" },
              {
                id: "wishlist",
                label: `Wishlist ${wishlistIds.length > 0 ? `(${wishlistIds.length})` : ""}`,
              },
              { id: "tickets", label: "Support" },
              { id: "support", label: "Chat" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2.5 pb-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "border-b-2 border-spice text-spice font-bold"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </SheetHeader>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* TAB 1: PAST ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="rounded-2xl border border-ink/10 bg-cream/40 p-4 transition-all hover:border-ink/20 hover:bg-cream/60 space-y-2"
                >
                  <div className="flex items-start justify-between border-b border-ink/5 pb-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-ink">
                        {ord.orderNumber}
                      </span>
                      <p className="text-[10px] text-ink/50 font-mono">
                        {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[9px] uppercase font-mono font-semibold"
                    >
                      {ord.status.replace(/_/g, " ")}
                    </Badge>
                  </div>

                  <div className="text-xs text-ink/70 space-y-0.5">
                    {ord.items.map((it) => (
                      <p key={it.id} className="font-medium text-ink">
                        {it.quantity}x {it.menuItem.name}
                      </p>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-ink/5 pt-2">
                    <span className="font-display text-base text-ink font-bold">
                      ₹{ord.finalTotal}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActiveOrderId(ord.id);
                          setProfileDrawerOpen(false);
                          setTrackingViewOpen(true);
                        }}
                        className="h-7 rounded-full text-[11px] border-ink/15 text-ink"
                      >
                        Live Map
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReorder(ord)}
                        className="h-7 rounded-full bg-ink text-cream text-[11px] hover:bg-spice gap-1"
                      >
                        <RotateCw className="size-3" />
                        <span>Re-order</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: SAVED DISHES / WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="space-y-3">
              {wishlistIds.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-ink/20 p-8 text-center bg-frost/40">
                  <div className="mx-auto grid size-12 place-items-center rounded-full bg-rose-50 text-rose-500 mb-3">
                    <Heart className="size-6" />
                  </div>
                  <h4 className="font-display text-base font-bold text-ink">No Saved Dishes Yet</h4>
                  <p className="mt-1 text-xs text-ink/60 max-w-xs mx-auto">
                    Explore our menu and click the heart icon on your favorite thalis and dishes to
                    save them for quick 1-click ordering!
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setProfileDrawerOpen(false);
                      const el = document.getElementById("menu");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="mt-4 rounded-full bg-spice text-cream text-xs font-bold hover:bg-ink"
                  >
                    Explore Menu & Save
                  </Button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink/70">
                      Saved For You ({wishlistIds.length})
                    </span>
                    <span className="text-[11px] text-spice font-medium">Ready to Order Hot</span>
                  </div>

                  {wishlistIds.map((dishId) => {
                    const dish = menuItems.find((m) => m.id === dishId);
                    if (!dish) return null;
                    return (
                      <div
                        key={dish.id}
                        className="group flex items-center justify-between rounded-2xl border border-ink/10 bg-frost/60 p-3 hover:bg-white hover:border-spice/30 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="size-14 rounded-xl object-cover shrink-0 border border-ink/5"
                          />
                          <div className="overflow-hidden">
                            <h5 className="font-display text-sm font-bold text-ink truncate group-hover:text-spice transition-colors">
                              {dish.name}
                            </h5>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-xs font-bold text-spice">
                                ₹{dish.price}
                              </span>
                              {dish.isThali && (
                                <span className="rounded bg-spice/10 px-1.5 py-0.2 font-mono text-[9px] font-bold text-spice">
                                  THALI
                                </span>
                              )}
                              <span className="text-[10px] text-ink/50">
                                {dish.preparationTimeMinutes}m fresh
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <button
                            type="button"
                            onClick={() => toggleWishlist(dish.id)}
                            className="grid size-8 place-items-center rounded-xl border border-ink/10 text-ink/40 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all"
                            title="Remove from Saved"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                          <Button
                            size="sm"
                            onClick={() => {
                              addToCart(dish);
                              setCartDrawerOpen(true);
                            }}
                            className="h-8 rounded-xl bg-ink text-cream hover:bg-spice text-xs font-semibold px-3 gap-1 shadow-sm"
                          >
                            <ShoppingBag className="size-3.5" />
                            <span>Order</span>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: GRIEVANCE TICKETS */}
          {activeTab === "tickets" && (
            <div className="space-y-4">
              {ticketSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>{ticketSuccess}</span>
                </div>
              )}

              <form
                onSubmit={handleCreateTicket}
                className="p-4 rounded-3xl bg-white border border-ink/10 shadow-sm space-y-3"
              >
                <div className="flex items-center gap-2 border-b border-ink/10 pb-2">
                  <LifeBuoy className="size-4 text-spice" />
                  <h4 className="font-display text-sm font-bold text-ink">
                    Raise Grievance Ticket
                  </h4>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-ink">Issue Type</label>
                  <select
                    value={ticketIssue}
                    onChange={(e) => setTicketIssue(e.target.value as TicketIssueType)}
                    className="w-full text-xs rounded-xl border border-ink/20 p-2 bg-frost focus:outline-none"
                  >
                    <option value="missing_item">Missing Food Item / Side</option>
                    <option value="wrong_item">Wrong Meal Received</option>
                    <option value="delayed_delivery">Order Delayed &gt; 30 Mins</option>
                    <option value="food_quality">Food Quality / Taste Issue</option>
                    <option value="payment_refund">Payment Deducted Twice</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-ink">Order Number</label>
                  <Input
                    value={ticketOrderNum}
                    onChange={(e) => setTicketOrderNum(e.target.value)}
                    className="text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-ink">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Tell us what happened with your meal..."
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    required
                    className="w-full text-xs rounded-xl border border-ink/20 p-2 focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl bg-spice text-white hover:bg-spice/90 text-xs font-semibold h-9"
                >
                  Submit Ticket
                </Button>
              </form>

              {/* Past Tickets */}
              <div className="space-y-2">
                <h5 className="text-[11px] font-mono font-bold text-ink/60 uppercase">
                  Your Past Grievances ({supportTickets.length}):
                </h5>
                {supportTickets.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-2xl bg-white border border-ink/10 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-spice">{t.ticketNumber}</span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-mono ${
                          t.status === "resolved"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {t.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-ink/80">{t.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: LIVE HELP / SUPPORT CHAT */}
          {activeTab === "support" && (
            <div className="flex flex-col h-full justify-between space-y-4">
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      msg.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-spice text-cream rounded-tr-none"
                          : "bg-cream text-ink border border-ink/10 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-ink/40 mt-1 font-mono">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Ask chef about spices, order..."
                  className="h-9 rounded-full border-ink/15 text-xs bg-white"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="size-9 shrink-0 rounded-full bg-ink text-cream hover:bg-spice"
                >
                  <Send className="size-3.5" />
                </Button>
              </form>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
