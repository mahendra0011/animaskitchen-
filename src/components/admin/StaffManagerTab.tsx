import React, { useState } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { StaffMember, StaffRole } from "@/types/kitchen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, UserCheck, Clock, Shield, Plus, Phone, Check, X, Sparkles } from "lucide-react";

export const StaffManagerTab: React.FC = () => {
  const { staffList, toggleStaffDuty } = useDemoStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<StaffRole>("Kitchen Staff");
  const [newPhone, setNewPhone] = useState("9876543210");
  const [newShift, setNewShift] = useState<
    "Morning (7AM - 3PM)" | "Evening (3PM - 11PM)" | "Full Day (8AM - 8PM)"
  >("Morning (7AM - 3PM)");

  const onDutyCount = staffList.filter((s) => s.onDuty).length;

  const rolesList: StaffRole[] = [
    "Super Admin",
    "Hub Manager",
    "Head Chef",
    "Kitchen Staff",
    "Dispatcher",
    "Accountant",
  ];

  const permissionsMatrix = [
    {
      module: "Kitchen Display (KDS)",
      roles: ["Super Admin", "Hub Manager", "Head Chef", "Kitchen Staff"],
    },
    { module: "Order Dispatch & Fleet", roles: ["Super Admin", "Hub Manager", "Dispatcher"] },
    { module: "Inventory & POs", roles: ["Super Admin", "Hub Manager", "Head Chef"] },
    { module: "Menu & Price Changes", roles: ["Super Admin", "Hub Manager"] },
    { module: "GST Invoices & Ledger", roles: ["Super Admin", "Hub Manager", "Accountant"] },
    { module: "Customer Grievance CRM", roles: ["Super Admin", "Hub Manager", "Dispatcher"] },
  ];

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newMember: StaffMember = {
      id: `staff_${Date.now()}`,
      name: newName,
      role: newRole,
      phone: newPhone,
      shift: newShift,
      onDuty: true,
      attendanceRate: 98,
    };
    staffList.push(newMember);
    setShowAddModal(false);
    setNewName("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Total Roster
            </span>
            <Users className="size-4 text-ink/40" />
          </div>
          <p className="mt-2 font-display text-2xl text-ink font-bold">
            {staffList.length} Personnel
          </p>
          <span className="text-[10px] text-ink/60 mt-0.5 block">
            Kitchen cooks, managers & dispatchers
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Currently On Duty
            </span>
            <UserCheck className="size-4 text-emerald-600" />
          </div>
          <p className="mt-2 font-display text-2xl text-emerald-700 font-bold">
            {onDutyCount} Active
          </p>
          <span className="text-[10px] text-emerald-800/80 font-medium mt-0.5 block">
            {Math.round((onDutyCount / staffList.length) * 100)}% shift coverage
          </span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Avg Monthly Attendance
            </span>
            <Clock className="size-4 text-spice" />
          </div>
          <p className="mt-2 font-display text-2xl text-spice font-bold">96.4%</p>
          <span className="text-[10px] text-ink/60 mt-0.5 block">Biometric punch record</span>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/50">
              Role Access Control
            </span>
            <Shield className="size-4 text-amber-500" />
          </div>
          <p className="mt-2 font-display text-2xl text-ink font-bold">6 Roles</p>
          <span className="text-[10px] text-ink/60 mt-0.5 block">
            RBAC multi-tier cloud kitchen permissions
          </span>
        </div>
      </div>

      {/* Roster Table Header */}
      <div className="bg-white rounded-2xl border border-ink/10 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-ink/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-base font-bold text-ink">
              Kitchen & Operations Roster
            </h3>
            <p className="text-xs text-ink/60">
              Manage staff clock-in shifts, roles, and kitchen station accountability
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="rounded-xl bg-spice text-white hover:bg-spice/90 text-xs font-semibold gap-1.5 shadow-sm"
          >
            <Plus className="size-3.5" />
            <span>Add Staff Member</span>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-frost/60 border-b border-ink/10 text-ink/60 font-mono text-[10px] uppercase">
                <th className="p-3.5 pl-4 font-semibold">Staff Member</th>
                <th className="p-3.5 font-semibold">Assigned Role</th>
                <th className="p-3.5 font-semibold">Phone Contact</th>
                <th className="p-3.5 font-semibold">Assigned Shift</th>
                <th className="p-3.5 font-semibold">Attendance</th>
                <th className="p-3.5 font-semibold">Duty Status</th>
                <th className="p-3.5 pr-4 text-right font-semibold">Clock In / Out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {staffList.map((member) => (
                <tr key={member.id} className="hover:bg-frost/40 transition-colors">
                  <td className="p-3.5 pl-4 font-semibold text-ink">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-ink text-cream grid place-items-center font-mono font-bold text-xs uppercase">
                        {member.name.substring(0, 2)}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-ink block">{member.name}</span>
                        <span className="text-[10px] text-ink/40 font-mono">ID: {member.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono font-medium ${
                        member.role === "Super Admin" || member.role === "Hub Manager"
                          ? "border-purple-200 bg-purple-50 text-purple-800"
                          : member.role === "Head Chef"
                            ? "border-amber-200 bg-amber-50 text-amber-800"
                            : "border-ink/15 bg-frost text-ink/80"
                      }`}
                    >
                      {member.role}
                    </Badge>
                  </td>
                  <td className="p-3.5 font-mono text-ink/80">
                    <span className="flex items-center gap-1">
                      <Phone className="size-3 text-ink/40" />
                      +91 {member.phone}
                    </span>
                  </td>
                  <td className="p-3.5 text-ink/80 font-medium">{member.shift}</td>
                  <td className="p-3.5 font-mono font-semibold text-emerald-700">
                    {member.attendanceRate}%
                  </td>
                  <td className="p-3.5">
                    {member.onDuty ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        ON DUTY
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-frost text-ink/50 font-mono text-[10px] font-medium border border-ink/10">
                        OFF DUTY
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 pr-4 text-right">
                    <Button
                      size="sm"
                      variant={member.onDuty ? "outline" : "default"}
                      onClick={() => toggleStaffDuty(member.id)}
                      className={`h-7 px-3 text-xs rounded-xl font-medium transition-all ${
                        member.onDuty
                          ? "border-red-200 text-red-600 hover:bg-red-50"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {member.onDuty ? "Clock Out" : "Clock In"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role-Based Permissions Matrix */}
      <div className="bg-white rounded-2xl border border-ink/10 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-ink">
              Role-Based Access Control (RBAC) Matrix
            </h3>
            <p className="text-xs text-ink/60">
              Kitchen staff, chefs, and dispatchers are restricted strictly to authorized views
            </p>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono">
            Security Enforced
          </Badge>
        </div>

        <div className="overflow-x-auto border border-ink/10 rounded-2xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-frost border-b border-ink/10 font-mono text-[10px] uppercase text-ink/60">
              <tr>
                <th className="p-3 pl-4">Platform Module</th>
                {rolesList.map((r) => (
                  <th key={r} className="p-3 text-center">
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-frost/20">
                  <td className="p-3 pl-4 font-bold text-ink">{item.module}</td>
                  {rolesList.map((r) => {
                    const hasAccess = item.roles.includes(r);
                    return (
                      <td key={r} className="p-3 text-center">
                        {hasAccess ? (
                          <span className="inline-grid size-5 place-items-center rounded-full bg-emerald-100 text-emerald-700 mx-auto">
                            <Check className="size-3" />
                          </span>
                        ) : (
                          <span className="inline-grid size-5 place-items-center rounded-full bg-frost text-ink/30 mx-auto">
                            <X className="size-3" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-white rounded-3xl border border-ink/20 shadow-2xl p-6 max-w-md w-full space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-spice">
                  Staff Onboarding
                </span>
                <h3 className="font-display text-lg font-bold text-ink">Add New Team Member</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="size-8 rounded-full bg-frost grid place-items-center text-ink/60 hover:text-ink text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Full Name</label>
                <Input
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Staff Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as StaffRole)}
                  className="w-full text-xs rounded-xl border border-ink/20 bg-white p-2.5 focus:outline-none"
                >
                  {rolesList.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Phone Contact</label>
                <Input
                  required
                  placeholder="10 digit mobile"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Shift Schedule</label>
                <select
                  value={newShift}
                  onChange={(e) => setNewShift(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-ink/20 bg-white p-2.5 focus:outline-none"
                >
                  <option value="Morning (7AM - 3PM)">Morning (7AM - 3PM)</option>
                  <option value="Evening (3PM - 11PM)">Evening (3PM - 11PM)</option>
                  <option value="Full Day (8AM - 8PM)">Full Day (8AM - 8PM)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-ink/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-spice text-white hover:bg-spice/90 text-xs font-semibold"
                >
                  Confirm & Onboard
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
