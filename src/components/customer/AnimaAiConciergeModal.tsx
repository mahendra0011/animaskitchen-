import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Send,
  User,
  X,
  RotateCcw,
  ChefHat,
  MapPin,
  Utensils,
  ShieldCheck,
  Calendar,
  Heart,
  Loader2,
  CheckCircle2,
  Phone,
  Clock,
} from "lucide-react";
import { useDemoStore } from "@/context/DemoStoreContext";
import type { MenuItem } from "@/types/kitchen";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

interface AnimaAiConciergeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigateToMenu?: () => void;
  onNavigateToOffers?: () => void;
}

const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
const PRIMARY_MODEL = "gemini-3-flash-preview";
const FALLBACK_MODEL = "gemini-3.5-flash";

const buildDynamicSystemPrompt = (
  menuItems: MenuItem[],
  daySpecialMeal?: any,
  coupons?: any[],
  subscriptions?: any[],
  homepageCustomization?: any,
) => {
  const availableItems = menuItems.filter((m) => m.isAvailable);
  const outOfStockItems = menuItems.filter((m) => !m.isAvailable);

  const menuSummary =
    availableItems && availableItems.length > 0
      ? availableItems
          .slice(0, 18)
          .map(
            (m) =>
              `• ${m.name} — ₹${m.price} (Category: ${m.category}): ${m.description} [Items included: ${
                m.includedItems?.join(", ") || "Freshly cooked to order"
              }]`,
          )
          .join("\n")
      : `• Dal Tadka Thali — ₹189 (Yellow Dal Tadka, 3 Tawa Rotis, Steamed Basmati Rice, Salad, Pickle)
• Anima's Royal Shahi Thali — ₹299 (Shahi Paneer, Dal Makhani, Mix Veg, 3 Butter Rotis, Jeera Rice, Boondi Raita, Gulab Jamun)
• Amritsari Chhole & Kulcha Thali — ₹220 (Spicy Chhole, 2 Puffed Kulchas, Imli Chutney, Sirka Onion, Raita)
• Handi Dum Veg Biryani — ₹280 (Fragrant Basmati, Saffron, Raita)
• Homestyle Rajma Chawal Bowl — ₹180 (Kashmiri Rajma, Basmati Rice, Sirka Onions)
• Desi Ghee Tawa Roti (Stack of 4) — ₹60
• Smoked Paneer Tikka (8 pcs) — ₹240
• Warm Shahi Gulab Jamun (2 pcs) — ₹90
• Kulhad Adrak-Elaichi Chai — ₹60
• Mint Lime Cooler — ₹99`;

  const outOfStockSummary =
    outOfStockItems.length > 0
      ? `\n⚠️ CURRENTLY SOLD OUT TODAY:\n${outOfStockItems.map((m) => `• ${m.name} (Sold Out / Unavailable)`).join("\n")}\n`
      : "";

  const announcementSummary =
    homepageCustomization?.festivalBannerActive && homepageCustomization?.festivalBannerText
      ? `\n📢 LIVE ADMIN ANNOUNCEMENT / BANNER:\n• "${homepageCustomization.festivalBannerText}" (Badge: ${homepageCustomization.festivalBadge || "SPECIAL"})\n`
      : "";

  const specialSummary =
    daySpecialMeal?.title
      ? `\n🔥 TODAY'S CHEF SPECIAL DISH:\n• "${daySpecialMeal.title}" — ${daySpecialMeal.meal || ""}\n`
      : "";

  const couponText =
    coupons && coupons.length > 0
      ? coupons
          .map((c) => `• Code "${c.code}": ${c.discountPercent}% OFF (Min Order: ₹${c.minOrderAmount})`)
          .join("\n")
      : "• Code \"WELCOME20\": 20% OFF on your first thali order";

  return `You are "Anima's Kitchen AI Chef & Customer Concierge" — the authentic, courteous, and knowledgeable digital host of Anima's Kitchen in Patna.
Language: Warm, natural Hinglish (Hindi + English) with polite Indian hospitality ("Namaste ji! 🙏").
Tone: Caring, honest, mouth-watering, and 100% FACTUAL.

CRITICAL GROUND-TRUTH RULE: You must strictly answer based ONLY on the REAL verified facts about Anima's Kitchen below. Never invent fake prices, fake timings, fake addresses, or non-existent dishes. Quote exact prices and timings as listed below.

=======================================================
📍 OFFICIAL RESTAURANT & CONTACT DETAILS:
=======================================================
- Restaurant Name: Anima's Kitchen (Pure Cow Desi Ghee Cloud Kitchen)
- Central Kitchen Address: Vikash Nagar, Kurji, Patna, Bihar, India - 800010
- Phone Hotline / Direct Call: +91 70049 60724
- WhatsApp Helpline: +91 70049 60724 (Fastest response for orders & inquiries)
- Official Email: animaskitchen24@gmail.com
- Facebook Community: https://www.facebook.com/share/1DkpxegDgy/

=======================================================
⏰ DAILY ORDER BOOKING & DELIVERY SCHEDULE (EXACT):
=======================================================
- ☀️ LUNCH ORDER WINDOW:
  • Order Booking Time: 8:00 AM – 10:00 AM
  • Hot Doorstep Delivery: 1:30 PM – 2:30 PM
- 🌙 DINNER ORDER WINDOW:
  • Order Booking Time: 4:00 PM – 6:00 PM
  • Hot Doorstep Delivery: 7:30 PM – 10:30 PM
- ⚠️ Late Order Notice: If customer missed the booking window, they can message directly on WhatsApp (+91 70049 60724) to check if extra thalis are cooking on the brass flame.

=======================================================
🛵 PATNA DELIVERY COVERAGE & RULES:
=======================================================
- Hub Location: Vikash Nagar, Kurji, Patna
- Served Localities: Kurji, Patliputra Colony, Boring Road, Anandpuri, Indrapuri, Rajeev Nagar, Ashiana Nagar, Digha, Budha Colony, Alpana Market, Nehru Nagar, Bailey Road, Raja Bazar, Kankarbagh, Danapur.
- Speed: 25–30 minutes hot delivery in insulated 3-ply thermal heat-lock bags. Arrives steaming hot (above 65°C).
- Delivery Charges: FREE express delivery on orders ₹250+ within 4 km of Kurji Hub. Nominal distance fee for further locations across Patna.

=======================================================
🌿 100% PURITY, HYGIENE & COOKING PHILOSOPHY:
=======================================================
- 100% Pure Vegetarian Kitchen.
- Fat/Oil: 100% Pure Cow Desi Ghee sourced from local dairy co-ops & cold-pressed kachi ghani mustard oil.
- Strict ZERO Policy: ZERO Palm Oil, ZERO Cheap Refined Oils, ZERO Artificial Food Colors, ZERO MSG / Ajinomoto.
- Traditional Cooking Vessels: Heavy Brass Degchis (Handis) for slow-simmered dals/curries, and Cast Iron Tawas for rotis/parathas to retain natural nutrition and home flavor.
- Satvik / Jain Food: Separate prep area with Zero Onion, Zero Garlic, and Zero Root Veg available upon request.

=======================================================
🍲 REAL LIVE MENU & VERIFIED PRICES (CURRENT STORE DATA):
=======================================================
${menuSummary}
${specialSummary}${outOfStockSummary}${announcementSummary}
=======================================================
🎟️ ACTIVE DISCOUNT COUPONS:
=======================================================
${couponText}

=======================================================
💳 PAYMENT MODES:
=======================================================
- Online: Razorpay Official Secure Gateway (Instant UPI: Google Pay, PhonePe, Paytm, BHIM; Debit/Credit Cards: Visa, Mastercard, RuPay; NetBanking 50+ Banks).
- Doorstep: Cash on Delivery (COD) or Scan Rider's Static QR Code.
- Security: 100% RBI & PCI-DSS compliant. No customer card or UPI PIN is ever stored.

=======================================================
🍱 MONTHLY TIFFIN SUBSCRIPTION & KITCHEN PASS:
=======================================================
- Daily homestyle lunch or dinner delivered on time across Patna.
- Freedom to pause/skip meals with 2-hour notice.
- Ideal for working professionals, students in Boring Road/Patliputra, and families.

Always be warm, concise (2-4 short bullet points or paragraphs), and invite them warmly to place an order or message on WhatsApp (+91 70049 60724).`;
};

const QUICK_QUESTIONS = [
  {
    icon: "🍛",
    label: "Menu & Thali ke Real Prices?",
    prompt: "Anima's Kitchen ke menu me kaunsi thalis hain aur unke exact prices kya hain?",
  },
  {
    icon: "⏰",
    label: "Lunch & Dinner Timings?",
    prompt: "Lunch aur Dinner order karne ka exact time kya hai aur delivery kab hoti hai?",
  },
  {
    icon: "🌿",
    label: "Pure Cow Desi Ghee & Cooking?",
    prompt: "Aapka khana kis ghee ya bartan me banta hai aur hygiene kaisi rehti hai?",
  },
  {
    icon: "📍",
    label: "Patna Delivery Areas & Free Delivery?",
    prompt: "Patna me kin-kin areas me delivery hoti hai aur free delivery kitne rupaye pe hai?",
  },
  {
    icon: "🍱",
    label: "Monthly Tiffin Service?",
    prompt: "Monthly daily tiffin service ka kya system hai aur pause/resume kaise karein?",
  },
  {
    icon: "📞",
    label: "Address & Phone Number?",
    prompt: "Anima's Kitchen ka exact address, mobile number aur WhatsApp helpline number kya hai?",
  },
];

export const AnimaAiConciergeModal: React.FC<AnimaAiConciergeModalProps> = ({
  open,
  onOpenChange,
  onNavigateToMenu,
  onNavigateToOffers,
}) => {
  const { menuItems, daySpecialMeal, coupons, subscriptions, homepageCustomization } = useDemoStore();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text: "Namaste ji! 🙏 Main hoon Anima's AI Chef. Humare 100% Pure Cow Desi Ghee thalis (Dal Tadka Thali ₹189, Royal Shahi Thali ₹299), Lunch/Dinner order timings, Patna delivery ya phone helpline (+91 70049 60724) ke baare me kuch bhi poochein!",
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeModelUsed, setActiveModelUsed] = useState<string>("gemini-3-flash-preview");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) {
      setTimeout(scrollToBottom, 150);
    }
  }, [messages, open]);

  const callGeminiApi = async (userQuery: string, chatHistory: Message[]): Promise<string> => {
    const formattedHistory = chatHistory
      .slice(-6)
      .map((m) => `${m.sender === "ai" ? "Assistant (Anima AI)" : "Customer"}: ${m.text}`)
      .join("\n\n");

    const dynamicSystemPrompt = buildDynamicSystemPrompt(
      menuItems,
      daySpecialMeal,
      coupons,
      subscriptions,
      homepageCustomization,
    );

    const fullPrompt = `${dynamicSystemPrompt}\n\nRecent Conversation:\n${formattedHistory}\n\nCustomer: ${userQuery}\n\nAssistant (Anima AI):`;

    const tryModel = async (modelName: string): Promise<string> => {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 600,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Empty AI response received.");
      setActiveModelUsed(modelName);
      return text.trim();
    };

    // Try primary latest model (gemini-3-flash-preview), then fallback to (gemini-3.5-flash)
    try {
      return await tryModel(PRIMARY_MODEL);
    } catch (primaryErr) {
      console.warn(`Primary model ${PRIMARY_MODEL} failed, switching to ${FALLBACK_MODEL}:`, primaryErr);
      try {
        return await tryModel(FALLBACK_MODEL);
      } catch (fallbackErr) {
        console.error("All Gemini models failed:", fallbackErr);
        throw fallbackErr;
      }
    }
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newChatHistory = [...messages, userMsg];
    setMessages(newChatHistory);
    setInput("");
    setLoading(true);

    try {
      const aiReply = await callGeminiApi(textToSend, newChatHistory);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const fallbackMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: "ai",
        text: "Maaf kijiye, network connectivity me thodi dikkat aayi hai. Par humara kitchen 100% live hai! Aap direct humare Menu se Dal Tadka Thali (₹189) ya Royal Shahi Thali (₹299) order kar sakte hain, ya direct WhatsApp/Call kar sakte hain: +91 70049 60724. 🙏",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome-fresh",
        sender: "ai",
        text: "Namaste ji! 🙏 Main Anima's AI Chef hoon. Aapko aaj khane me kya pasand aayega? Koi bhi sawaal poochein!",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] p-0 overflow-hidden rounded-3xl border-2 border-spice/20 shadow-2xl bg-white max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#186338] via-[#1F7A47] to-[#E45312] text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/logo.png"
                alt="Anima's Kitchen AI"
                className="size-11 sm:size-12 rounded-full object-contain border-2 border-white/40 shadow-sm bg-white"
              />
              <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="font-display text-lg sm:text-xl font-black text-white leading-tight">
                  Anima’s AI Concierge
                </DialogTitle>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-mono font-bold backdrop-blur-xs text-amber-200">
                  <Sparkles className="size-3" />
                  Gemini 3 Flash Live
                </span>
              </div>
              <DialogDescription className="text-xs text-white/90 font-medium">
                Ask anything about recipes, pure desi ghee, delivery & daily tiffins
              </DialogDescription>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetChat}
              title="Reset Chat"
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors text-xs flex items-center gap-1"
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden sm:inline text-[11px] font-medium">Clear</span>
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Quick Questions Pills */}
        <div className="p-3 bg-frost border-b border-ink/10 shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono font-bold text-ink/70 flex items-center gap-1.5 uppercase">
              <Sparkles className="size-3 text-spice" />
              Quick Questions (Click to Ask):
            </span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold hidden sm:inline">
              ⚡ Powered by {activeModelUsed}
            </span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q.label}
                type="button"
                disabled={loading}
                onClick={() => handleSend(q.prompt)}
                className="whitespace-nowrap px-2.5 py-1.5 rounded-xl border border-ink/10 bg-white hover:border-spice hover:bg-spice/5 text-ink text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all hover:scale-102 shrink-0 disabled:opacity-50"
              >
                <span>{q.icon}</span>
                <span>{q.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-cream/30">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "ai" && (
                <img
                  src="/logo.png"
                  alt="Anima AI"
                  className="size-8 rounded-full object-contain border border-spice/20 shrink-0 bg-white shadow-xs mt-0.5"
                />
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-[#186338] text-white rounded-tr-xs shadow-md font-medium"
                    : "bg-white text-ink border border-ink/10 rounded-tl-xs shadow-xs"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                <div
                  className={`text-[9px] mt-1.5 font-mono ${
                    m.sender === "user" ? "text-white/70 text-right" : "text-ink/40"
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>

              {m.sender === "user" && (
                <div className="size-8 rounded-full bg-spice text-white grid place-items-center shrink-0 shadow-xs mt-0.5">
                  <User className="size-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <img
                src="/logo.png"
                alt="Anima AI"
                className="size-8 rounded-full object-contain border border-spice/20 shrink-0 bg-white shadow-xs"
              />
              <div className="bg-white border border-ink/10 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-2">
                <Loader2 className="size-4 text-spice animate-spin" />
                <span className="text-xs text-ink/70 font-medium">
                  Anima AI chef is typing response...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Footer CTAs */}
        <div className="px-4 py-2 bg-frost/60 border-t border-ink/5 flex items-center justify-between text-[11px] font-mono text-ink/70">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <ShieldCheck className="size-3.5" /> 100% Pure Desi Ghee
            </span>
            <span className="hidden sm:inline text-ink/30">•</span>
            <span className="hidden sm:inline flex items-center gap-1">
              <MapPin className="size-3 text-spice" /> Patna Doorstep Delivery
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToMenu && (
              <button
                onClick={() => {
                  onOpenChange(false);
                  onNavigateToMenu();
                }}
                className="text-spice hover:underline font-bold text-xs"
              >
                View Full Menu →
              </button>
            )}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-white border-t border-ink/10 flex items-center gap-2 shrink-0"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Poochiye... jaise: aaj ka special kya hai? delivery kahan hoti hai?"
            disabled={loading}
            className="flex-1 h-11 rounded-2xl border-2 border-spice/30 focus:border-spice text-xs sm:text-sm bg-white font-medium"
          />
          <Button
            type="submit"
            disabled={!input.trim() || loading}
            className="h-11 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-[#186338] to-[#E45312] hover:opacity-95 text-white font-bold text-xs shadow-md gap-1.5 shrink-0"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            <span className="hidden sm:inline">Ask AI</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
