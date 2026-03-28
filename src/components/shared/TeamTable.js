"use client";
import { useState, useEffect } from "react";
import { Mail, UserMinus, UserCog, Loader2 } from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import GlassCard from "@/components/ui/GlassCard";
import UserDetailDrawer from "./UserDetailDrawer";
import TeamFilters from "./TeamFilters";
import EditUserModal from "./EditUserModel";

export default function TeamTable({ initialMembers }) {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);

  const handleEditClick = (employee) => {
    setEditingEmployee({ ...employee });
    setIsEditModalOpen(true);
  };

  const deleteEmployee = async (id) => {
    if (!confirm("Are you sure?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
      if (res.ok) setMembers((m) => m.filter((user) => user._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const updateUser = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/team/${editingEmployee._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: editingEmployee.role,
          status: editingEmployee.status,
        }),
      });
      if (res.ok) {
        setMembers((m) =>
          m.map((u) => (u._id === editingEmployee._id ? editingEmployee : u)),
        );
        setIsEditModalOpen(false);
      }
    } catch (err) {
      alert("Error updating!");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredEmployees = members.filter((m) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (m.name || "pending invite").toLowerCase().includes(term) ||
      m.email.toLowerCase().includes(term);
    const matchesRole =
      roleFilter === "All"
        ? true
        : roleFilter === "Pending"
          ? m.status === "pending"
          : (m.role || "Employee") === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <TeamFilters
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      <GlassCard className="overflow-hidden border-white/5 p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                  Employee
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                  Access
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                  Status
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEmployees.map((member) => (
                <tr
                  key={member._id}
                  onClick={() => {
                    setSelectedUser(member);
                    setIsDrawerOpen(true);
                  }}
                  className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={`https://ui-avatars.com/api/?name=${member.name || member.email}&background=random&color=fff`}
                        className="w-10 h-10 rounded-full border border-white/10"
                        alt=""
                      />
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-accent transition-colors">
                          {member.name || "Pending Invite"}
                        </p>
                        <p className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                          <Mail size={10} /> {member.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-bold text-neutral-300 uppercase tracking-widest">
                    {member.role || "Employee"}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={member.status || "active"} />
                  </td>
                  <td
                    className="px-6 py-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 text-neutral-500 hover:text-accent hover:bg-accent/10 rounded-lg"
                        onClick={() => handleEditClick(member)}
                      >
                        <UserCog size={16} />
                      </button>
                      <button
                        onClick={() => deleteEmployee(member._id)}
                        className="p-2 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                      >
                        {loadingId === member._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <UserMinus size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <UserDetailDrawer
        user={selectedUser}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onEdit={handleEditClick}
        onDelete={deleteEmployee}
      />
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employee={editingEmployee}
        setEmployee={setEditingEmployee}
        onSave={updateUser}
        isUpdating={isUpdating}
      />
    </div>
  );
}
