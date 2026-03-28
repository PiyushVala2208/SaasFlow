"use client";
import { useState } from "react";
import { UserPlus, ShieldCheck } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import InviteMemberButton from "@/components/shared/InviteMemberButton";
import TeamTable from "@/components/shared/TeamTable";

export default function TeamManager({ initialMembers, orgName }) {
  const [members, setMembers] = useState(initialMembers);

  const handleInviteSuccess = (newUser) => {
    setMembers((prev) => [...prev, newUser]);
  };

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === "active").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase italic">
            Team Management
          </h1>
          <p className="text-neutral-500 mt-1">
            Managing members for{" "}
            <span className="text-accent font-bold">{orgName}</span>
          </p>
        </div>
        <InviteMemberButton
          orgName={orgName}
          onInviteSuccess={handleInviteSuccess}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-5 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <UserPlus size={40} className="text-white" />
          </div>
          <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">
            Total Seats
          </p>
          <p className="text-3xl font-bold mt-1 text-white">{totalMembers}</p>
        </GlassCard>

        <GlassCard className="p-5 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck size={40} className="text-emerald-500" />
          </div>
          <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">
            Active Members
          </p>
          <p className="text-3xl font-bold mt-1 text-emerald-500">
            {activeMembers}
          </p>
        </GlassCard>
      </div>

      <TeamTable initialMembers={members} />
    </div>
  );
}
