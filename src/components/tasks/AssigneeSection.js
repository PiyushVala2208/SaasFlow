"use client";
import { useState, useCallback, useMemo } from "react"; // Added useMemo
import { UserPlus, Plus, X } from "lucide-react";
import UserPickerModal from "./UserPickerModal";

const getUserId = (entity) => {
  const userRef = entity?.user;
  const userRefId =
    userRef && typeof userRef === "object"
      ? userRef._id ||
        userRef.id ||
        (typeof userRef.toString === "function" ? userRef.toString() : "")
      : userRef;

  const fallbackEntityRef = entity && typeof entity !== "object" ? entity : "";
  const raw =
    (userRefId && userRefId !== "[object Object]" ? userRefId : "") ||
    entity?._id ||
    entity?.id ||
    fallbackEntityRef;
  return raw ? String(raw) : "";
};

const getUserProfile = (entity) => {
  return entity?.user ? entity.user : entity;
};

export default function AssigneeSection({
  assignees = [],
  members = [],
  onUpdate,
}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // FIX 1: Saare selected IDs ko nikaal lo safely
  const selectedIds = useMemo(() => {
    const ids = (assignees || [])
      .map((entry) => getUserId(entry))
      .filter(Boolean);

    return Array.from(new Set(ids));
  }, [assignees]);

  // FIX 2: Render ke liye objects ko map karo taaki Data loss na ho (Name "User" na bane)
  const displayAssignees = useMemo(() => {
    return selectedIds
      .map((id) => {
        // Pehle current assignees mein search karo, agar nahi mile toh members list se profile uthao
        return (
          assignees.find((a) => getUserId(a) === id) ||
          members.find((m) => getUserId(m) === id)
        );
      })
      .filter(Boolean);
  }, [selectedIds, assignees, members]);

  const handleToggle = useCallback(
    (userId) => {
      const targetId = userId.toString();
      const isAlreadyAssigned = selectedIds.includes(targetId);

      const newList = isAlreadyAssigned
        ? selectedIds.filter((id) => id !== targetId)
        : [...selectedIds, targetId];

      onUpdate({ assignedTo: newList });
    },
    [selectedIds, onUpdate],
  );

  const handleRemove = (e, userId) => {
    e.stopPropagation();
    const targetId = userId.toString();
    const newList = selectedIds.filter((id) => id !== targetId);

    onUpdate({ assignedTo: newList });
  };

  return (
    <div className="space-y-4">
      <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-1.5 select-none">
        <UserPlus size={14} /> Assign Members
      </span>

      <div className="flex flex-wrap gap-2 items-center">
        {/* FIX 3: displayAssignees use karo mapping ke liye (Full Data sync) */}
        {displayAssignees.map((userEntry, i) => {
          const userId = getUserId(userEntry);
          if (!userId) return null;

          const user = getUserProfile(userEntry);
          const userName = user?.name || "User";
          const avatarUrl =
            user?.image ||
            `https://ui-avatars.com/api/?name=${userName}&background=0D0D0D&color=fff`;

          return (
            <div
              key={`assignee-${userId}-${i}`}
              className="flex items-center gap-2 p-1 pl-1 pr-3 rounded-full bg-blue-600/10 border border-blue-500/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.05)] group hover:border-blue-500/40 transition-all duration-300"
            >
              <img
                src={avatarUrl}
                className="w-7 h-7 rounded-full border border-white/10 object-cover"
                alt={userName}
              />
              <span className="text-[11px] font-bold max-w-[80px] truncate">
                {userName}
              </span>
              <button
                type="button"
                onClick={(e) => handleRemove(e, userId)}
                className="ml-1 text-neutral-500 hover:text-red-400 transition-colors p-0.5"
                title="Remove Member"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="flex items-center gap-2 p-1.5 px-4 rounded-full border border-dashed border-white/10 bg-white/[0.02] text-neutral-500 hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/5 transition-all text-[11px] font-bold"
        >
          <Plus size={14} />
          <span>Add Member</span>
        </button>
      </div>

      <UserPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        members={members}
        selectedUsers={selectedIds}
        onToggle={handleToggle}
      />
    </div>
  );
}
