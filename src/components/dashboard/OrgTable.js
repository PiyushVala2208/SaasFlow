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
      setSelectedOrgUsers(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDelete = async (orgName) => {
    const confirmFirst = confirm(`⚠️ DANGER: Are you sure you want to delete "${orgName}"?`);
    if (!confirmFirst) return;

    const confirmSecond = confirm(`LAST WARNING: This will permanently wipe out ALL users belonging to ${orgName}. Proceed?`);
    if (!confirmSecond) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/superadmin/organizations/${orgName}`, { method: "DELETE" });
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
    org._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-22"> 
      <GlassCard className="p-4 md:p-8 border-white/5 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 md:mb-8">
          <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
            <Building className="text-purple-500 w-5 h-5 md:w-6 md:h-6" /> 
            <span className="truncate">Registered Organizations</span>
          </h3>
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <input
              type="text"
              placeholder="Search organizations..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-neutral-500 text-[10px] uppercase tracking-widest">
                <th className="pb-4 font-medium">Organization</th>
                <th className="pb-4 font-medium">Admin Email</th>
                <th className="pb-4 font-medium">Members</th>
                <th className="pb-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrgs.map((org) => (
                <tr key={org._id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-5 font-bold text-white">{org._id}</td>
                  <td className="py-5 text-neutral-400 text-sm truncate max-w-[200px]">
                    {org.adminEmail}
                  </td>
                  <td className="py-5 text-neutral-300">
                    <div className="flex items-center gap-2 text-xs font-medium bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full w-fit">
                      <UserCheck size={14} />
                      {org.memberCount} users
                    </div>
                  </td>
                  <td className="py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => fetchOrgDetails(org)}
                        className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-all"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(org._id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-neutral-600 hover:text-red-500 transition-all"
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

        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredOrgs.map((org) => (
            <div 
              key={org._id} 
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white text-lg">{org._id}</h4>
                  <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-1">
                    <Mail size={12} /> {org.adminEmail}
                  </p>
                </div>
                <div className="flex gap-2">
                    <button
                      onClick={() => fetchOrgDetails(org)}
                      className="p-2.5 bg-white/5 rounded-xl text-neutral-400 active:scale-95 transition-all"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(org._id)}
                      className="p-2.5 bg-red-500/5 rounded-xl text-red-500/50 active:scale-95 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                </div>
              </div>
              
              <div className="pt-2 flex items-center justify-between border-t border-white/5">
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">Platform Usage</span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                  <UserCheck size={14} />
                  {org.memberCount} active users
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredOrgs.length === 0 && (
          <div className="py-20 text-center text-neutral-500 text-sm">
            No organizations found matching your search.
          </div>
        )}
      </GlassCard>

      <OrgDetailsSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        org={currentOrg}
        users={selectedOrgUsers}
        loading={loadingUsers}
        onDeleteOrg={handleDelete}
      />
    </div>
  );
}