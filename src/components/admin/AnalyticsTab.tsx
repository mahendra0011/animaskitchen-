import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, DollarSign, Utensils, Clock, Users } from "lucide-react";

export const AnalyticsTab: React.FC = () => {
  const salesData = [
    { day: "Mon", revenue: 14200, orders: 48 },
    { day: "Tue", revenue: 16800, orders: 54 },
    { day: "Wed", revenue: 15400, orders: 50 },
    { day: "Thu", revenue: 18900, orders: 62 },
    { day: "Fri", revenue: 24500, orders: 84 },
    { day: "Sat", revenue: 29800, orders: 102 },
    { day: "Sun", revenue: 32400, orders: 115 },
  ];

  const popularDishes = [
    { name: "Dal Tadka Thali", orders: 245 },
    { name: "Anima's Royal Thali", orders: 189 },
    { name: "Smoked Paneer Tikka", orders: 142 },
    { name: "Handi Dum Biryani", orders: 128 },
    { name: "Rajma Chawal", orders: 98 },
  ];

  const hourlyRush = [
    { time: "11 AM", orders: 14 },
    { time: "12 PM", orders: 38 },
    { time: "1 PM", orders: 52 },
    { time: "2 PM", orders: 34 },
    { time: "6 PM", orders: 18 },
    { time: "7 PM", orders: 42 },
    { time: "8 PM", orders: 64 },
    { time: "9 PM", orders: 48 },
  ];

  const paymentModes = [
    { name: "UPI (GPay/PhonePe)", value: 68, color: "#ea580c" },
    { name: "Cards", value: 18, color: "#4f46e5" },
    { name: "Cash on Delivery", value: 14, color: "#16a34a" },
  ];

  return (
    <div className="space-y-6 text-ink">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-ink/10 bg-frost p-5">
          <span className="font-mono text-[10px] uppercase font-bold text-ink/50 block">
            Weekly Sales Revenue
          </span>
          <p className="mt-1 font-display text-3xl text-ink">₹1,52,000</p>
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="size-3.5" /> +18.4% vs last week
          </span>
        </div>

        <div className="rounded-3xl border border-ink/10 bg-frost p-5">
          <span className="font-mono text-[10px] uppercase font-bold text-ink/50 block">
            Total Orders Fulfilled
          </span>
          <p className="mt-1 font-display text-3xl text-spice">515</p>
          <span className="text-xs text-ink/60 mt-1 block">99.2% on-time delivery</span>
        </div>

        <div className="rounded-3xl border border-ink/10 bg-frost p-5">
          <span className="font-mono text-[10px] uppercase font-bold text-ink/50 block">
            Average Order Value (AOV)
          </span>
          <p className="mt-1 font-display text-3xl text-ink">₹295</p>
          <span className="text-xs text-ink/60 mt-1 block">Driven by Thali add-ons</span>
        </div>

        <div className="rounded-3xl border border-ink/10 bg-frost p-5">
          <span className="font-mono text-[10px] uppercase font-bold text-ink/50 block">
            Active Tiffin Subscribers
          </span>
          <p className="mt-1 font-display text-3xl text-emerald-700">84</p>
          <span className="text-xs text-ink/60 mt-1 block">Daily recurring recurring lunches</span>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Trend */}
        <div className="rounded-3xl border border-ink/10 bg-frost p-5 shadow-sm">
          <h4 className="font-display text-lg text-ink mb-1">Weekly Revenue Curve (₹)</h4>
          <p className="text-xs text-ink/60 mb-4">Daily gross receipts from kitchen dispatches</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="day" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ea580c"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#salesGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Ordered Dishes */}
        <div className="rounded-3xl border border-ink/10 bg-frost p-5 shadow-sm">
          <h4 className="font-display text-lg text-ink mb-1">Most Loved Menu Items</h4>
          <p className="text-xs text-ink/60 mb-4">Total volume ordered this week</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularDishes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis type="number" stroke="#888" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#888" fontSize={10} width={110} />
                <Tooltip />
                <Bar dataKey="orders" fill="#1c1917" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Peak Rush */}
        <div className="rounded-3xl border border-ink/10 bg-frost p-5 shadow-sm">
          <h4 className="font-display text-lg text-ink mb-1">Peak Ordering Hours</h4>
          <p className="text-xs text-ink/60 mb-4">
            Highlights lunch rush (12-2 PM) and dinner rush (7-9 PM)
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyRush}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="time" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip />
                <Bar dataKey="orders" fill="#facc15" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Split */}
        <div className="rounded-3xl border border-ink/10 bg-frost p-5 shadow-sm">
          <h4 className="font-display text-lg text-ink mb-1">Payment Method Breakdown</h4>
          <p className="text-xs text-ink/60 mb-4">Customer payment preference split</p>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentModes}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {paymentModes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs font-mono">
            {paymentModes.map((m) => (
              <div key={m.name} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                <span>
                  {m.name} ({m.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
