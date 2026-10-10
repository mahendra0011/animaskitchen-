import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Facebook,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

interface ContactPageProps {
  onBack: () => void;
  onExploreMenu: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack, onExploreMenu }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    topic: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error("Please provide your name and phone number.");
      return;
    }

    setSubmitted(true);
    toast.success("Message sent to Anima's Kitchen!", {
      description: "Our kitchen manager will call/WhatsApp you within 15 minutes.",
    });
  };

  return (
    <div className="min-h-screen bg-cream text-ink pb-24 sm:pb-12">
      {/* Sticky Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 border-b border-ink/10 bg-frost/90 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="grid size-9 place-items-center rounded-full border border-ink/15 bg-frost text-ink hover:bg-ink hover:text-cream transition-all"
            >
              <ArrowLeft className="size-4" />
            </motion.button>
            <div>
              <h1 className="font-display text-xl font-black text-ink leading-tight">
                Contact Anima’s Kitchen
              </h1>
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink/50">
                Kurji Patna Hub #01 · WhatsApp Helpline · Bulk Orders
              </p>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button
              onClick={onExploreMenu}
              size="sm"
              className="rounded-full bg-spice text-cream hover:bg-ink text-xs font-semibold px-4 gap-1.5"
            >
              <span>Order Thali</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Banner */}
      <div className="border-b border-ink/10 bg-gradient-to-r from-saffron/20 via-frost to-cream py-12">
        <div className="mx-auto max-w-5xl px-5">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-spice">
            GET IN TOUCH WITH OUR CHEFS
          </span>
          <h2 className="mt-1 font-display text-4xl sm:text-5xl font-black text-ink">
            We’d Love to Hear From You.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-ink/75 max-w-xl">
            Whether you need custom thalis for a corporate event, wish to inquire about group meal
            orders, or simply want to share your feedback.
          </p>
        </div>
      </div>

      {/* Main Grid: Contact Details & Form */}
      <div className="mx-auto max-w-5xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Left Column: Direct Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-5 space-y-6"
          >
            <div className="rounded-3xl border border-ink/10 bg-frost/90 p-6 shadow-sm backdrop-blur-md">
              <h3 className="font-display text-xl font-bold text-ink mb-4">Kitchen Headquarters</h3>

              <div className="space-y-4 text-xs leading-relaxed text-ink/80">
                <div className="flex items-start gap-3">
                  <div className="grid size-8 place-items-center rounded-xl bg-spice/10 text-spice shrink-0 mt-0.5">
                    <MapPin className="size-4" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block">Anima's Kitchen</span>
                    <span>Vikash Nagar, Kurji, Patna, Bihar, India</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="grid size-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                    <Phone className="size-4" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block">Hotline & Phone Orders</span>
                    <a
                      href="tel:+917004960724"
                      className="hover:text-spice font-mono font-bold text-ink"
                    >
                      +91 70049 60724
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="grid size-8 place-items-center rounded-xl bg-green-50 text-green-700 shrink-0 mt-0.5">
                    <MessageCircle className="size-4" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block">WhatsApp Direct Helpline</span>
                    <a
                      href="https://wa.me/917004960724?text=Hello%20Anima's%20Kitchen,%20I%20want%20to%20order%20food"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-spice hover:underline font-semibold"
                    >
                      Chat on WhatsApp (+91 70049 60724)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="grid size-8 place-items-center rounded-xl bg-amber-50 text-amber-700 shrink-0 mt-0.5">
                    <Mail className="size-4" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block">Official Email</span>
                    <a
                      href="mailto:animaskitchen24@gmail.com"
                      className="text-spice hover:underline font-semibold"
                    >
                      animaskitchen24@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="grid size-8 place-items-center rounded-xl bg-blue-50 text-[#1877F2] shrink-0 mt-0.5">
                    <Facebook className="size-4 fill-[#1877F2]" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block">Facebook Community Page</span>
                    <a
                      href="https://www.facebook.com/share/1DkpxegDgy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1877F2] hover:underline font-semibold"
                    >
                      facebook.com/share/1DkpxegDgy/ ↗
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="grid size-8 place-items-center rounded-xl bg-blue-50 text-blue-700 shrink-0 mt-0.5">
                    <Clock className="size-4" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-ink block">
                      Daily Order Booking & Delivery Schedule
                    </span>
                    <div className="text-xs space-y-1 text-ink/80">
                      <div>
                        <span className="font-bold text-orange-700">☀️ Lunch Order:</span> 8:00 AM – 10:00 AM
                        <span className="block text-[11px] text-stone-600 font-mono">↳ Delivery: 1:30 PM – 2:30 PM</span>
                      </div>
                      <div>
                        <span className="font-bold text-emerald-800">🌙 Dinner Order:</span> 4:00 PM – 6:00 PM
                        <span className="block text-[11px] text-stone-600 font-mono">↳ Delivery: 7:30 PM – 10:30 PM</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium mt-1">
                      ⚠️ <strong>Late Order Notice:</strong> If you order after the timing, please send a message or request directly on WhatsApp (+91 70049 60724).
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Terms & Service Radius Note */}
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-50/60 p-5 shadow-sm space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800">
                <CheckCircle2 className="size-3" />
                DELIVERY POLICY & LIMITS
              </span>
              <h4 className="font-display text-sm font-bold text-ink">Free Delivery within 4 KM</h4>
              <p className="text-xs text-ink/70 leading-relaxed">
                • <strong>Under 4 KM:</strong> Free doorstep delivery with a{" "}
                <strong>Minimum Order Value of ₹250</strong>.<br />• <strong>Beyond 4 KM:</strong>{" "}
                Delivery charge extra as per distance tier.
                <br />• <strong>Slots:</strong> Fresh cooking dispatched live during Morning (9 AM–2
                PM) and Evening (7 PM–10 PM).
              </p>
            </div>
          </motion.div>

          {/* Right Column: Inquiry Form */}
          <div className="md:col-span-7">
            <div className="rounded-3xl border border-ink/10 bg-frost/95 p-6 sm:p-8 shadow-sm backdrop-blur-md">
              <h3 className="font-display text-2xl font-bold text-ink">Send Us a Note</h3>
              <p className="mt-1 text-xs text-ink/60">
                Have a question about allergens, catering, or daily lunch boxes? We'll get back to
                you promptly.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center">
                  <CheckCircle2 className="size-12 text-emerald-600 mx-auto mb-2" />
                  <h4 className="font-display text-lg font-bold text-emerald-900">
                    Thank You, {formData.name}!
                  </h4>
                  <p className="mt-1 text-xs text-emerald-700">
                    Your inquiry has been received. Our kitchen team will contact you shortly on{" "}
                    {formData.phone}.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        phone: "",
                        email: "",
                        topic: "General Inquiry",
                        message: "",
                      });
                    }}
                    variant="outline"
                    size="sm"
                    className="mt-4 rounded-xl text-xs font-bold"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-ink mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full rounded-xl border border-ink/15 bg-white p-3 text-xs font-medium focus:border-spice focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-ink/15 bg-white p-3 text-xs font-medium focus:border-spice focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-ink mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full rounded-xl border border-ink/15 bg-white p-3 text-xs font-medium focus:border-spice focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink mb-1.5">
                        Topic of Inquiry
                      </label>
                      <select
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="w-full rounded-xl border border-ink/15 bg-white p-3 text-xs font-medium focus:border-spice focus:outline-none"
                      >
                        <option>General Inquiry</option>
                        <option>Daily Meal Orders</option>
                        <option>Bulk Office / Event Catering</option>
                        <option>Custom Diet / Jain Food</option>
                        <option>Feedback for Chef</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1.5">Your Message</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what you need or how we can assist you..."
                      className="w-full rounded-xl border border-ink/15 bg-white p-3 text-xs font-medium focus:border-spice focus:outline-none resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-spice text-cream hover:bg-ink font-bold h-11 text-xs shadow-md transition-all gap-2"
                  >
                    <Send className="size-3.5" />
                    <span>Send Message to Kitchen</span>
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
