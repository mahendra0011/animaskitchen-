import React, { useState } from "react";
import {
  ShieldCheck,
  FileText,
  Lock,
  RefreshCw,
  Scale,
  Award,
  AlertCircle,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LegalPageProps {
  initialTab?: "privacy" | "terms" | "refund" | "license";
  onBack: () => void;
  onExploreMenu?: () => void;
}

export function LegalCompliancePage({
  initialTab = "privacy",
  onBack,
  onExploreMenu,
}: LegalPageProps) {
  const [activeTab, setActiveTab] = useState<"privacy" | "terms" | "refund" | "license">(
    initialTab
  );

  return (
    <div className="min-h-screen bg-[#faf7f2] text-ink pb-20">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-ink/10 bg-[#faf7f2]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3.5">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-ink/70 hover:text-spice transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Kitchen</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] text-ink/60 font-medium">
              FSSAI & Digital Personal Data Compliant
            </span>
          </div>

          {onExploreMenu && (
            <Button
              onClick={onExploreMenu}
              size="sm"
              className="rounded-full bg-spice hover:bg-spice/90 text-white font-bold text-xs px-4"
            >
              Order Food
            </Button>
          )}
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-[#f2ece1] to-[#faf7f2] border-b border-ink/5 py-12 px-4 sm:px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-spice/10 text-spice text-xs font-mono font-semibold mb-4">
            <Scale className="size-3.5" />
            <span>Legal, Safety & Data Governance Hub</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight">
            Policies & Terms of Service
          </h1>
          <p className="mt-3 text-sm sm:text-base text-ink/70 font-body max-w-xl mx-auto">
            At Anima's Kitchen, we prioritize your food hygiene, digital privacy, and transparent ordering rights under Indian law.
          </p>
          <p className="mt-2 text-[11px] font-mono text-ink/50">
            Last Updated: October 2026 · Registered Kitchen, Patna, Bihar
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-ink/5 rounded-2xl border border-ink/10 mb-8 max-w-2xl mx-auto justify-center">
          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "privacy"
                ? "bg-white text-spice shadow-sm font-black"
                : "text-ink/70 hover:text-ink hover:bg-white/50"
            }`}
          >
            <Lock className="size-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab("terms")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "terms"
                ? "bg-white text-spice shadow-sm font-black"
                : "text-ink/70 hover:text-ink hover:bg-white/50"
            }`}
          >
            <FileText className="size-3.5" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={() => setActiveTab("refund")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "refund"
                ? "bg-white text-spice shadow-sm font-black"
                : "text-ink/70 hover:text-ink hover:bg-white/50"
            }`}
          >
            <RefreshCw className="size-3.5" />
            <span>Refund & Cancellation</span>
          </button>

          <button
            onClick={() => setActiveTab("license")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "license"
                ? "bg-white text-spice shadow-sm font-black"
                : "text-ink/70 hover:text-ink hover:bg-white/50"
            }`}
          >
            <Award className="size-3.5" />
            <span>FSSAI & Licenses</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-ink/10 shadow-sm max-w-4xl mx-auto">
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === "privacy" && (
            <div className="space-y-6 text-sm leading-relaxed text-ink/80 font-body">
              <div className="border-b border-ink/10 pb-4">
                <h2 className="font-display text-2xl font-black text-ink flex items-center gap-2.5">
                  <Lock className="size-6 text-spice" />
                  Privacy Policy & Data Protection
                </h2>
                <p className="text-xs text-ink/60 mt-1">
                  Compliance with the Digital Personal Data Protection (DPDP) Act, 2023 & IT Act, 2000.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-base text-ink mb-2">1. Information We Collect</h3>
                <p>
                  To deliver piping-hot meals and process your orders safely, Anima's Kitchen collects:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-ink/70">
                  <li><strong>Account Identity:</strong> Your Full Name, Email Address, and Phone Number.</li>
                  <li><strong>Delivery Information:</strong> Accurate street address, flat/house number, and landmark coordinates in Patna.</li>
                  <li><strong>Live Rider Tracking:</strong> Temporary GPS location telemetry during active dispatch for delivery boy route coordination.</li>
                  <li><strong>Transaction Details:</strong> Order timestamps, item lists, and payment method reference (we never store card CVV or bank passwords; all transactions occur via RBI-authorized payment gateways like Razorpay).</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-base text-ink mb-2">2. How Your Data Is Used</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-ink/70">
                  <li>Preparing and delivering your homestyle meals through our cloud kitchen.</li>
                  <li>Sending real-time order confirmation, dispatch OTP, and delivery alerts via SMS, Brevo Email, and WhatsApp.</li>
                  <li>Ensuring strict defense against fraudulent orders and automated denial-of-service attempts.</li>
                  <li><strong>Zero Third-Party Data Selling:</strong> We NEVER sell, lease, or monetize your contact information to external advertisers or telemarketers.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-base text-ink mb-2">3. Storage & Cryptographic Security</h3>
                <p className="text-xs text-ink/70">
                  All passwords are encrypted with industry-standard bcrypt hashes. Sessions are cryptographically sealed with 32-character pepper keys. Communications are encrypted end-to-end via TLS 1.3 (HTTPS).
                </p>
              </div>

              <div>
                <h3 className="font-bold text-base text-ink mb-2">4. Your Data Rights & Deletion</h3>
                <p className="text-xs text-ink/70">
                  You have the right to request access to your stored personal information or request full account deletion at any time by emailing us at{" "}
                  <a href="mailto:animaskitchen24@gmail.com" className="text-spice font-bold hover:underline">
                    animaskitchen24@gmail.com
                  </a>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === "terms" && (
            <div className="space-y-6 text-sm leading-relaxed text-ink/80 font-body">
              <div className="border-b border-ink/10 pb-4">
                <h2 className="font-display text-2xl font-black text-ink flex items-center gap-2.5">
                  <FileText className="size-6 text-spice" />
                  Terms of Service & User Agreement
                </h2>
                <p className="text-xs text-ink/60 mt-1">
                  By accessing or placing an order on animaskitchenpatna.online, you agree to these terms.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-base text-ink mb-2">1. Operating Hours & Service Coverage</h3>
                <p className="text-xs text-ink/70">
                  Anima's Kitchen operates primarily across Kurji, Patliputra Colony, Boring Road, Digha, and surrounding Patna municipal zones.
                  Orders are accepted for <strong>Lunch (11:30 AM – 3:30 PM)</strong> and <strong>Dinner (7:00 PM – 10:30 PM)</strong>, subject to ingredient availability.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-base text-ink mb-2">2. Accuracy of Delivery Details</h3>
                <p className="text-xs text-ink/70">
                  Customers are responsible for providing reachable phone numbers and correct delivery addresses. If a rider arrives and the customer is unreachable for more than 15 minutes, the meal will be returned to the kitchen to preserve food safety, and full order charges may apply.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-base text-ink mb-2">3. Tiffin Subscription Policies</h3>
                <p className="text-xs text-ink/70">
                  Monthly and weekly meal plans can be paused with at least 4 hours advance notice prior to meal preparation slots. Unused days are credited to the customer's wallet balance.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-base text-ink mb-2">4. Prohibited Activities</h3>
                <p className="text-xs text-ink/70">
                  Users agree not to scrape our menu, reverse-engineer API endpoints, execute automated bot submissions, or abuse discount promotional codes. Violations result in permanent IP blacklisting.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: REFUND & CANCELLATION */}
          {activeTab === "refund" && (
            <div className="space-y-6 text-sm leading-relaxed text-ink/80 font-body">
              <div className="border-b border-ink/10 pb-4">
                <h2 className="font-display text-2xl font-black text-ink flex items-center gap-2.5">
                  <RefreshCw className="size-6 text-spice" />
                  Refund, Cancellation & Replacement Policy
                </h2>
                <p className="text-xs text-ink/60 mt-1">
                  100% Transparency. Fresh homestyle food made to order.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase font-mono">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    Eligible for Full Refund
                  </div>
                  <ul className="mt-2 text-xs text-emerald-900/80 space-y-1.5 list-disc pl-4">
                    <li>Wrong dish or missing items delivered.</li>
                    <li>Food damaged or spilled in transit by our delivery team.</li>
                    <li>Cancellation requested within 3 minutes of placing the order before kitchen preparation commences.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase font-mono">
                    <AlertCircle className="size-4 text-amber-600" />
                    Non-Refundable Scenarios
                  </div>
                  <ul className="mt-2 text-xs text-amber-900/80 space-y-1.5 list-disc pl-4">
                    <li>Cancellation after the dish has already been cooked and packed.</li>
                    <li>Customer provided incorrect address or phone is switched off upon rider arrival.</li>
                    <li>Subjective taste preference differences (spiciness levels can be customized prior to ordering).</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base text-ink mb-2">Refund Processing Window</h3>
                <p className="text-xs text-ink/70">
                  Approved refunds are initiated immediately to the original payment method (UPI / Credit Card / NetBanking) and typically reflect in your account within 24–48 banking hours.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: FSSAI & LICENSES */}
          {activeTab === "license" && (
            <div className="space-y-6 text-sm leading-relaxed text-ink/80 font-body">
              <div className="border-b border-ink/10 pb-4">
                <h2 className="font-display text-2xl font-black text-ink flex items-center gap-2.5">
                  <Award className="size-6 text-spice" />
                  Food Safety Compliance & Kitchen Licenses
                </h2>
                <p className="text-xs text-ink/60 mt-1">
                  Governed under the Food Safety and Standards Authority of India (FSSAI).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-900">
                      Food Safety Standard
                    </span>
                    <h3 className="text-lg font-black font-display text-ink mt-0.5">
                      FSSAI Food Hygiene & Clean Kitchen Certification
                    </h3>
                  </div>
                  <Award className="size-8 text-amber-600" />
                </div>
                <div className="mt-3 grid sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-white/70 border border-amber-600/20">
                    <span className="text-ink/50 text-[10px] block">Facility Type</span>
                    <span className="font-bold text-ink">Cloud Kitchen & Tiffin</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/70 border border-amber-600/20">
                    <span className="text-ink/50 text-[10px] block">Location</span>
                    <span className="font-bold text-ink">Vikash Nagar, Kurji, Patna</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/70 border border-amber-600/20">
                    <span className="text-ink/50 text-[10px] block">Jurisdiction</span>
                    <span className="font-bold text-ink">Bihar Health & Food Safety</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base text-ink mb-2">Our 5 Pillars of Kitchen Hygiene</h3>
                <ul className="grid sm:grid-cols-2 gap-3 text-xs text-ink/75">
                  <li className="flex items-start gap-2 p-3 rounded-xl bg-ink/5 border border-ink/5">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>100% RO Purified Water:</strong> Used exclusively for all cooking, curries, and utensils sanitization.</span>
                  </li>
                  <li className="flex items-start gap-2 p-3 rounded-xl bg-ink/5 border border-ink/5">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Zero Palm Oil:</strong> Prepared using authentic mustard oil, ghee, and premium sunflower refined oil only.</span>
                  </li>
                  <li className="flex items-start gap-2 p-3 rounded-xl bg-ink/5 border border-ink/5">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Daily Fresh Produce:</strong> Farm-fresh vegetables sourced daily from local Patna sabzi mandis.</span>
                  </li>
                  <li className="flex items-start gap-2 p-3 rounded-xl bg-ink/5 border border-ink/5">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Food-Grade Packaging:</strong> Leak-proof, microwave-safe, BPA-free containers ensuring high hygiene.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Grievance Officer & Contact Footer */}
          <div className="mt-10 pt-6 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-ink/60">
            <div>
              <span className="block font-bold text-ink">Grievance Officer: Anima Kumari</span>
              <span>Email: animaskitchen24@gmail.com · Phone: +91 70049 60724</span>
            </div>
            <a
              href="https://wa.me/917004960724?text=Hi%20Anima's%20Kitchen,%20I%20have%20a%20query%20about%20policies."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500 hover:text-white font-bold transition-colors"
            >
              <span>Instant WhatsApp Support</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
