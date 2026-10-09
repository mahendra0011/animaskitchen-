import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Branch } from "@/types/kitchen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Building,
  MapPin,
  Phone,
  CheckCircle2,
  TrendingUp,
  Flame,
  ArrowRight,
  ShieldCheck,
  Plus,
} from "lucide-react";

export const MultiBranchTab: React.FC = () => {
  const { branches, activeBranchId, setActiveBranchId, addBranch } = useDemoStore();
  const [switchSuccess, setSwitchSuccess] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newHub, setNewHub] = useState({
    name: "",
    code: "",
    city: "Bengaluru",
    address: "",
    phone: "",
    status: "active" as "active" | "busy",
  });

  const handleCreateHub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHub.name.trim() || !newHub.code.trim()) return;

    const created: Branch = {
      id: `branch-${Date.now()}`,
      name: newHub.name.trim(),
      code: newHub.code.trim().toUpperCase(),
      city: newHub.city.trim() || "Bengaluru",
      address: newHub.address.trim() || "Main Road",
      phone: newHub.phone.trim() || "9876543210",
      status: newHub.status,
      activeOrders: 0,
      dailyRevenue: 0,
    };

    addBranch(created);
    setActiveBranchId(created.id);
    setIsAddOpen(false);
    setNewHub({
      name: "",
      code: "",
      city: "Bengaluru",
      address: "",
      phone: "",
      status: "active",
    });
    setSwitchSuccess(`New Hub "${created.name}" created and set as active!`);
    setTimeout(() => setSwitchSuccess(null), 3000);
  };

  const activeBranch = branches.find((b) => b.id === activeBranchId) ||
    branches[0] || {
      id: "branch-indiranagar",
      name: "Indiranagar Central Hub",
      code: "BLR-01",
      address: "12th Main Road, Indiranagar, Bengaluru",
      contactPhone: "+91 98111 22334",
      managerName: "Chef Anima",
      isActive: true,
      activeOrders: 14,
      dailyRevenue: 34200,
    };

  const totalNetworkOrders = branches.reduce((sum, b) => sum + b.activeOrders, 0);
  const totalNetworkRevenue = branches.reduce((sum, b) => sum + b.dailyRevenue, 0);

  const handleSwitchBranch = (b: Branch) => {
    setActiveBranchId(b.id);
    setSwitchSuccess(`Switched active operational view to ${b.name}!`);
    setTimeout(() => setSwitchSuccess(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Active Cloud Hubs
            </span>
            <Building className="size-4 text-ink/40" />
          </div>
          <p className="mt-2 font-display text-2xl text-ink font-bold">{branches.length} Hubs</p>
          <span className="text-[10px] text-ink/60 mt-0.5 block">
            Central + Express cloud kitchens
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Network Active Orders
            </span>
            <Flame className="size-4 text-spice" />
          </div>
          <p className="mt-2 font-display text-2xl text-spice font-bold">
            {totalNetworkOrders} Live
          </p>
          <span className="text-[10px] text-ink/60 mt-0.5 block">
            Across Bengaluru metro region
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Total Network Daily GMV
            </span>
            <TrendingUp className="size-4 text-emerald-600" />
          </div>
          <p className="mt-2 font-display text-2xl text-emerald-700 font-bold">
            ₹{totalNetworkRevenue.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-800/80 font-medium mt-0.5 block">
            Consolidated daily revenue
          </span>
        </div>

        <div className="rounded-2xl border border-spice/20 bg-spice/5 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-spice">
              Current Active Hub
            </span>
            <ShieldCheck className="size-4 text-spice" />
          </div>
          <p className="mt-2 font-display text-base font-bold text-ink truncate">
            {activeBranch.name}
          </p>
          <span className="text-[10px] font-mono text-spice font-bold mt-0.5 block">
            {activeBranch.code} · OPERATIONS LIVE
          </span>
        </div>
      </div>

      {switchSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{switchSuccess}</span>
        </div>
      )}

      {/* Hub Actions & Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div>
          <h3 className="font-display text-lg text-ink font-bold">Cloud Kitchen Hub Locations</h3>
          <p className="text-xs text-ink/60">
            Select a hub to switch live operations, or launch a new dark kitchen location.
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl bg-spice text-white hover:bg-spice/90 gap-1.5 shadow-sm text-xs font-semibold px-4">
              <Plus className="size-4" />
              <span>Add New Hub</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white text-ink">
            <DialogHeader>
              <DialogTitle className="font-display text-xl font-bold flex items-center gap-2">
                <Building className="size-5 text-spice" />
                Launch New Kitchen Hub
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateHub} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink/70">Hub Name</label>
                <Input
                  required
                  placeholder="e.g. HSR Layout Central Kitchen"
                  value={newHub.name}
                  onChange={(e) => setNewHub({ ...newHub, name: e.target.value })}
                  className="rounded-xl border-ink/15 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink/70">Hub Code</label>
                  <Input
                    required
                    placeholder="e.g. BLR-04"
                    value={newHub.code}
                    onChange={(e) => setNewHub({ ...newHub, code: e.target.value })}
                    className="rounded-xl border-ink/15 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink/70">City</label>
                  <Input
                    required
                    placeholder="e.g. Bengaluru"
                    value={newHub.city}
                    onChange={(e) => setNewHub({ ...newHub, city: e.target.value })}
                    className="rounded-xl border-ink/15 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink/70">Contact Phone</label>
                <Input
                  required
                  placeholder="e.g. 9811122334"
                  value={newHub.phone}
                  onChange={(e) => setNewHub({ ...newHub, phone: e.target.value })}
                  className="rounded-xl border-ink/15 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink/70">Address / Locality</label>
                <Input
                  required
                  placeholder="e.g. 27th Main, Sector 1, HSR Layout"
                  value={newHub.address}
                  onChange={(e) => setNewHub({ ...newHub, address: e.target.value })}
                  className="rounded-xl border-ink/15 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-spice text-white hover:bg-spice/90 text-xs font-bold"
                >
                  Create & Activate Hub
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Hub Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {branches.map((b) => {
          const isSelected = b.id === activeBranchId;

          return (
            <div
              key={b.id}
              className={`rounded-3xl border transition-all p-5 flex flex-col justify-between space-y-4 ${
                isSelected
                  ? "border-spice bg-white shadow-lg ring-2 ring-spice/20"
                  : "border-ink/10 bg-white shadow-sm hover:border-ink/20"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-spice block">
                      {b.code}
                    </span>
                    <h3 className="font-display text-lg font-bold text-ink">{b.name}</h3>
                  </div>
                  {isSelected ? (
                    <Badge className="bg-spice text-white font-mono text-[9px] border-none">
                      ACTIVE HUB
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className={`font-mono text-[9px] ${
                        b.status === "busy"
                          ? "border-amber-200 text-amber-700 bg-amber-50"
                          : "border-emerald-200 text-emerald-700 bg-emerald-50"
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </Badge>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-ink/70">
                  <p className="flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="size-3.5 text-ink/40 shrink-0 mt-0.5" />
                    <span>
                      {b.address}, {b.city}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Phone className="size-3 text-ink/40 shrink-0" />
                    <span>+91 {b.phone}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-ink/5">
                  <div className="p-2.5 rounded-xl bg-frost">
                    <span className="text-[10px] text-ink/50 font-mono block">Active Orders</span>
                    <span className="font-mono text-base font-bold text-ink">{b.activeOrders}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-frost">
                    <span className="text-[10px] text-ink/50 font-mono block">Today's GMV</span>
                    <span className="font-mono text-base font-bold text-emerald-700">
                      ₹{b.dailyRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant={isSelected ? "outline" : "default"}
                onClick={() => handleSwitchBranch(b)}
                className={`w-full rounded-2xl text-xs font-semibold gap-1.5 ${
                  isSelected
                    ? "border-spice text-spice bg-spice/5 hover:bg-spice/10"
                    : "bg-ink text-cream hover:bg-ink/90"
                }`}
              >
                <span>{isSelected ? "Currently Selected Hub" : "Switch to this Hub"}</span>
                {!isSelected && <ArrowRight className="size-3.5" />}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Multi-Kitchen Routing Architecture Explanation */}
      <div className="bg-white rounded-2xl border border-ink/10 p-5 shadow-sm space-y-2">
        <h4 className="font-display text-sm font-bold text-ink">
          Smart Geolocation & Multi-Hub Load Balancing
        </h4>
        <p className="text-xs text-ink/70 leading-relaxed">
          Customer orders in Anima's Kitchen are automatically routed to the nearest operational
          cloud kitchen hub based on customer pincode and live kitchen queue capacity. If
          Indiranagar reaches 100% stove occupancy, overflow orders automatically cascade to
          Koramangala or Whitefield.
        </p>
      </div>
    </div>
  );
};
