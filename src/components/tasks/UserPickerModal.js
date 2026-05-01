"use client";
import { X, Search, Check, User } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useState, useMemo } from "react";

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

const getIdentityKey = (entity) => {
  const profile = getUserProfile(entity);
  const email = String(profile?.email || "")
    .trim()
    .toLowerCase();
  const userId = getUserId(entity);
  const name = String(profile?.name || "")
    .trim()
    .toLowerCase();

  return email || userId || name;
};

export default function UserPickerModal({
  isOpen,
  onClose,
  members = [],
  selectedUsers = [],
  onToggle = () => {},
}) {
  const [search, setSearch] = useState("");

  const selectedIdsSet = useMemo(() => {
    const safeUsers = Array.isArray(selectedUsers) ? selectedUsers : [];
    const mapped = safeUsers.map((entry) => getUserId(entry)).filter(Boolean);

    return new Set(mapped);
  }, [selectedUsers]);

  if (!isOpen) return null;

  const searchResults = members.filter((member) => {
    const profile = getUserProfile(member);
    const name = profile?.name || "";
    const email = profile?.email || "";
    const searchTerm = search.toLowerCase();
    return (
      name.toLowerCase().includes(searchTerm) ||
      email.toLowerCase().includes(searchTerm)
    );
  });

  const dedupedSearchResults = (() => {
    const seen = new Set();

    return searchResults.filter((member) => {
      const key = getIdentityKey(member);

      if (!key || seen.has(key)) return false;

      seen.add(key);
      return true;
    });
  })();

  const selectedList = dedupedSearchResults.filter((m) =>
    selectedIdsSet.has(getUserId(m)),
  );

  const availableList = dedupedSearchResults.filter(
    (m) => !selectedIdsSet.has(getUserId(m)),
  );

  const finalDisplayList = Array.from(
    new Map(
      [...selectedList, ...availableList].map((m) => [getIdentityKey(m), m]),
    ).values(),
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-300">
      <GlassCard className="w-full max-w-md h-[550px] flex flex-col p-8 border-white/10 bg-neutral-950 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h3 className="text-sm font-black uppercase tracking-widest text-white/90">
            Select Assignees
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-all text-neutral-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative mb-6 shrink-0">
          <input
            autoFocus
            type="text"
            placeholder="Search name or email..."
            className="w-full bg-white/3 border border-white/10 rounded-xl py-4 px-12 text-[11px] text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-neutral-600 shadow-inner"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600"
            size={14}
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2 min-h-0">
          {finalDisplayList.length > 0 ? (
            finalDisplayList.map((member) => {
              const userId = getUserId(member);
              if (!userId) return null;

              const profile = getUserProfile(member);
              const isSelected = selectedIdsSet.has(userId);

              const userName = profile?.name || "Unknown User";
              const userEmail = profile?.email || "No email";
              const userImage = profile?.image;

              return (
                <div
                  key={userId}
                  onClick={() => onToggle(userId)}
                  className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isSelected
                      ? "bg-blue-600/10 border-blue-500/30 text-white shadow-[0_0_20px_rgba(59,130,246,0.05)]"
                      : "hover:bg-white/3 border-transparent text-neutral-400 hover:border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="shrink-0">
                      {userImage ? (
                        <img
                          src={userImage}
                          alt={userName}
                          className="w-10 h-10 rounded-full object-cover border border-white/10"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-[12px] font-black text-white uppercase border border-white/10">
                          {userName[0] || "?"}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`text-sm font-bold truncate ${
                          isSelected ? "text-blue-400" : "text-white/80"
                        }`}
                      >
                        {userName}
                      </p>
                      <p
                        className={`text-[10px] truncate animate-in fade-in duration-500 ${
                          isSelected ? "text-blue-200/80" : "text-neutral-600"
                        }`}
                      >
                        {userEmail}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shrink-0 animate-in zoom-in duration-200">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <User size={32} className="mb-2 text-neutral-700" />
              <p className="text-[10px] font-medium uppercase tracking-widest">
                No results found
              </p>
            </div>
          )}
        </div>

        <div className="pt-6 mt-2 border-t border-white/5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-neutral-200 transition-all active:scale-[0.98] shadow-xl"
          >
            Done
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
