"use client";
import { Search } from "lucide-react";

export default function TeamFilters({ search, setSearch, roleFilter, setRoleFilter }) {
  const roles = ["All", "Admin", "Manager", "Employee", "Pending"];

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={16} />
        <input
          type="text"
          placeholder="Search employees..."
          className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent/30 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 bg-white/[0.02] p-1 rounded-xl border border-white/5">
        {roles.map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              roleFilter === r ? "bg-accent text-white shadow-lg" : "text-neutral-500 hover:text-white"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}