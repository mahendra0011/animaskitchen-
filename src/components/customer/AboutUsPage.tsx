import React from "react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Sparkles,
  Heart,
  ShieldCheck,
  Flame,
  Utensils,
  CheckCircle2,
  Award,
  Clock,
  ArrowRight,
} from "lucide-react";
import heroImage from "@/assets/animas-hero-thali.jpg";
import kitchenImage from "@/assets/animas-spice-kitchen.jpg";
import rotiImage from "@/assets/animas-roti-tawa.jpg";

interface AboutUsPageProps {
  onBack: () => void;
  onExploreMenu: () => void;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const pillars = [
  {
    icon: <Sparkles className="size-6" />,
    bg: "bg-amber-100 text-amber-800",
    title: "100% Desi Cow Ghee",
    body: "Zero cheap vegetable oils or palm oils. We only use pure cow ghee sourced directly from certified dairy farms.",
  },
  {
    icon: <Flame className="size-6" />,
    bg: "bg-orange-100 text-orange-800",
    title: "Brass Pot Cooking",
    body: "Slow cooking in traditional brass handis retains 93% of micronutrients and infuses an unmistakable earthen aroma.",
  },
  {
    icon: <ShieldCheck className="size-6" />,
    bg: "bg-emerald-100 text-emerald-800",
    title: "Cooked Fresh Daily",
    body: "Fresh cooking slots: Morning 9 AM – 2 PM and Evening 7 PM – 10 PM. No yesterday's leftovers, guaranteed.",
  },
  {
    icon: <Clock className="size-6" />,
    bg: "bg-blue-100 text-blue-800",
    title: "Heat-Lock Boxes",
    body: "Every thali is packed in insulated, eco-friendly heat-lock compartments that keep rotis soft and dal piping hot.",
  },
];

const stats = [
  { value: "14,200+", label: "Happy Foodies Served", color: "text-ink" },
  { value: "4.9 ★", label: "Average Customer Rating", color: "text-spice" },
  { value: "100%", label: "Pure Desi Cow Ghee", color: "text-leaf" },
  { value: "24 min", label: "Avg Delivery Speed", color: "text-ink" },
];

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onBack, onExploreMenu }) => {
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
                About Anima's Kitchen
              </h1>
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink/50">
                Our Story · Heritage · Pure Desi Ghee Cooking
              </p>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button
              onClick={onExploreMenu}
              size="sm"
              className="rounded-full bg-spice text-cream hover:bg-ink text-xs font-semibold px-4 gap-1.5"
            >
              <span>Explore Menu</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Story Banner */}
      <div className="border-b border-ink/10 bg-gradient-to-b from-frost via-cream to-cream py-16">
        <div className="mx-auto max-w-5xl px-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-spice/25 bg-white/90 px-3.5 py-1 text-xs font-mono font-bold text-spice shadow-sm mb-4"
          >
            <Heart className="size-3.5 fill-spice animate-pulse" />
            ROOTED IN HOME TRADITIONS
          </motion.div>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={1}
            className="font-display text-4xl sm:text-6xl font-black tracking-tight text-ink leading-[1.08]"
          >
            SLOW COOKED IN BRASS. <br />
            <span className="text-spice font-serif italic">SERVED WITH UNCONDITIONAL LOVE.</span>
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={2}
            className="mt-4 max-w-2xl text-base text-ink/75 leading-relaxed"
          >
            Anima's Kitchen was born out of a simple, universal longing: the taste of genuine
            home-cooked food that doesn't upset your stomach or taste like industrial catering.
          </motion.p>
        </div>
      </div>

      {/* Visual Story Split */}
      <div className="mx-auto max-w-5xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-2 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={0}
            className="space-y-4 text-sm text-ink/80 leading-relaxed"
          >
            <h3 className="font-display text-2xl font-bold text-ink">
              The Philosophy Behind Every Thali
            </h3>
            <p>
              Founded with the recipes passed down from grandmother Anima Devi, our kitchen refuses
              the shortcuts taken by modern commercial restaurants. We don't use frozen tomato
              purees, commercial preservatives, or artificial food colorings.
            </p>
            <p>
              Every morning at 6:00 AM, our chefs stone-grind fresh whole spices: cumin seeds,
              coriander, green cardamoms, and whole Kashmiri red chilies. Our yellow dals and rajmas
              simmer slowly in heavy-bottom brass degchis, allowing every grain to absorb the
              tempering of pure cow desi ghee and fresh garlic.
            </p>
            <div className="rounded-2xl border border-ink/10 bg-frost p-4 font-mono text-xs text-ink/70">
              <span className="font-bold text-spice">
                "Food cooked in haste is just fuel. Food cooked with patience is medicine."
              </span>
              <span className="block mt-1 text-[10px] text-ink/40">
                — Anima Devi's Kitchen Creed
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-ink/10 shadow-xl"
          >
            <img
              src={kitchenImage}
              alt="Anima's Kitchen Brass Degchi and Fresh Spices"
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-cream">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-saffron">
                Flagship Kitchen · Vikash Nagar, Kurji, Patna
              </span>
              <p className="font-display text-lg font-bold">
                100% Brass Degchis &amp; Cast Iron Tawas
              </p>
            </div>
          </motion.div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={0}
            className="text-center max-w-xl mx-auto mb-10"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-spice font-bold">
              OUR UNCOMPROMISING STANDARDS
            </span>
            <h3 className="mt-1 font-display text-3xl font-black text-ink">
              Four Pillars of Anima's Kitchen
            </h3>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                custom={i}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  boxShadow: "0 20px 30px -10px rgba(36,24,15,0.12)",
                }}
                className="rounded-3xl border border-ink/10 bg-frost/90 p-6 shadow-sm transition-shadow"
              >
                <div className={`grid size-12 place-items-center rounded-2xl ${p.bg} mb-4`}>
                  {p.icon}
                </div>
                <h4 className="font-display text-lg font-bold text-ink">{p.title}</h4>
                <p className="mt-2 text-xs text-ink/70 leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hygiene & Kitchen Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 rounded-3xl border border-ink/10 bg-gradient-to-r from-saffron/15 via-spice/10 to-leaf/10 p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className={`font-display text-3xl sm:text-4xl font-black ${s.color}`}>
                  {s.value}
                </span>
                <span className="mt-1 block font-mono text-xs text-ink/60">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          custom={0}
          className="mt-12 text-center"
        >
          <h3 className="font-display text-2xl font-bold text-ink">
            Taste the difference of true homemade cooking
          </h3>
          <p className="mt-2 text-xs text-ink/60 max-w-md mx-auto">
            Experience our legendary Dal Tadka Deluxe Thali, hand-rolled hot rotis and rich paneer
            tikka today.
          </p>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-block mt-6"
          >
            <Button
              onClick={onExploreMenu}
              size="lg"
              className="rounded-full bg-spice text-cream hover:bg-ink font-bold px-8 h-12 shadow-lg"
            >
              Explore Today's Menu
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
