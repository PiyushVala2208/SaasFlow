export const ROLE_BADGE = {
  Owner: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Admin: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Editor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Viewer: "bg-neutral-500/10 text-neutral-400 border-white/10",
};

export const PRIORITY_STYLES = {
  Urgent: {
    base: "border-red-500/20 bg-red-500/10 text-red-400",
    dot: "bg-red-500 shadow-[0_0_8px_currentColor]",
  },
  High: {
    base: "border-orange-500/20 bg-orange-500/10 text-orange-400",
    dot: "bg-orange-500",
  },
  Medium: {
    base: "border-sky-500/20 bg-sky-500/10 text-sky-400",
    dot: "bg-sky-500",
  },
  Low: {
    base: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    dot: "bg-emerald-500",
  },
};

export function avatarUrl(user) {
  if (user?.image) return user.image;
  const name = typeof user === "object" && user?.name ? user.name : "Member";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1a1a&color=f5f5f5&bold=true`;
}

export function buildTeamStack(project) {
  const out = [];
  const seen = new Set();
  const pushUser = (u, key) => {
    if (!u) return;
    const id =
      typeof u === "object" && u._id != null ? String(u._id) : String(u);
    if (seen.has(id)) return;
    seen.add(id);
    out.push({ key, user: typeof u === "object" ? u : { _id: u, name: "?" } });
  };
  if (project.owner) pushUser(project.owner, "owner");
  for (const m of project.members || []) {
    if (m.user) pushUser(m.user, m.user._id ?? m.user);
  }
  return out.slice(0, 8);
}

export const getStatusStyles = (status) => {
  switch (status) {
    case "Completed":
      return { color: "bg-emerald-500", text: "text-emerald-400", glow: "" };
    case "On Hold":
      return { color: "bg-amber-500", text: "text-amber-400", glow: "" };
    case "Archived":
      return { color: "bg-neutral-500", text: "text-neutral-400", glow: "" };
    default:
      return {
        color: "bg-blue-500",
        text: "text-blue-400",
        glow: "shadow-[0_0_20px_rgba(59,130,246,0.12)]",
      };
  }
};
