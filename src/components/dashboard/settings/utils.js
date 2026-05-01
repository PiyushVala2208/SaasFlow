export function buildWorkspaceUrl(orgName) {
  const slug = String(orgName || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug ? `${slug}.saasflow.com` : "";
}

export function hydrateFormsFromPayload(payload) {
  const profile = payload?.currentUser || payload || {};

  return {
    general: {
      workspaceName: profile.workspaceName || profile.orgName || "",
      workspaceUrl:
        profile.workspaceUrl || buildWorkspaceUrl(profile.orgName || ""),
      businessEmail: profile.businessEmail || profile.email || "",
    },
    profile: {
      name: profile.name || "",
      email: profile.email || "",
      jobTitle: profile.jobTitle || "",
      phone: profile.phone || "",
      bio: profile.bio || "",
    },
    meta: {
      orgName: profile.orgName || "",
      role: profile.role || "Employee",
      status: profile.status || "active",
      image: profile.image || "",
      createdAt: profile.createdAt || null,
    },
  };
}
