"use client";
import { useState } from "react";
import { Building, Mail, UserCheck, Eye, Trash2, Search } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useRouter } from "next/navigation";
import OrgDetailsSidebar from "./OrgDetailsSidebar";

export default function OrgTable({ organizations }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrgUsers, setSelectedOrgUsers] = useState([]);
  const [currentOrg, setCurrentOrg] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const fetchOrgDetails = async (org) => {
    setCurrentOrg(org);
    setIsSidebarOpen(true);
    setLoadingUsers(true);
    try {
      const res = await fetch(`/api/superadmin/organizations/${org._id}`);
      const data = await res.json();
      console.log("Fetched Users:", data);
      setSelectedOrgUsers(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDelete = async (orgName) => {
    const confirmFirst = confirm(`⚠️ DANGER: Are you sure you want to delete "${orgName}"?`,);
    if (!confirmFirst) return;

    const confirmSecond = confirm(`LAST WARNING: This will permanently wipe out ALL users belonging to ${orgName}. Proceed?`);
    if (!confirmSecond) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/superadmin/organizations/${orgName}`, { method: "DELETE"});

      if (res.ok) {
        alert("Organization deleted successfully!");
        router.refresh(); 
      } else {
        const err = await res.json();
        alert(err.error || "Something went wrong");
      }
    } catch (error) {
      alert("Network error. Could not delete.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredOrgs = organizations?.filter((org) =>
    org._id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <GlassCard className="p-8 border-white/5 overflow-hidden">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Building className="text-purple-500" /> Registered Organizations
          </h3>
          <div className="relative min-w-[300px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-neutral-500 text-[10px] uppercase tracking-widest">
                <th className="pb-4">Organization</th>
                <th className="pb-4">Admin</th>
                <th className="pb-4">Members</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrgs.map((org) => (
                <tr
                  key={org._id}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-5 font-bold text-white">{org._id}</td>
                  <td className="py-5 text-neutral-400 text-sm">
                    {org.adminEmail}
                  </td>
                  <td className="py-5 text-neutral-300">
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <UserCheck size={14} className="text-emerald-500" />
                      {org.memberCount} users
                    </div>
                  </td>
                  <td className="py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => fetchOrgDetails(org)}
                        className="p-2.5 hover:bg-white/10 rounded-xl text-neutral-400 hover:text-white transition-all"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(org._id)}
                        className="p-2.5 hover:bg-red-500/10 rounded-xl text-neutral-600 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* CUSTOM SIDEBAR COMPONENT */}
      <OrgDetailsSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        org={currentOrg}
        users={selectedOrgUsers}
        loading={loadingUsers}
        onDeleteOrg={handleDelete}
      />
    </>
  );
}
