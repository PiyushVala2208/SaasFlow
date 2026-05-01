"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import SettingsTabs from "@/components/dashboard/settings/SettingsTabs";
import GeneralSettingsTab from "@/components/dashboard/settings/GeneralSettingsTab";
import ProfileSettingsTab from "@/components/dashboard/settings/ProfileSettingsTab";
import SecuritySettingsTab from "@/components/dashboard/settings/SecuritySettingsTab";
import BillingSettingsTab from "@/components/dashboard/settings/BillingSettingsTab";
import SettingsLoadingState from "@/components/dashboard/settings/SettingsLoadingState";
import {
  emptyGeneralForm,
  emptyProfileForm,
  emptyPasswordForm,
  settingsTabs,
} from "@/components/dashboard/settings/constants";
import { hydrateFormsFromPayload } from "@/components/dashboard/settings/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);

  const [generalForm, setGeneralForm] = useState(emptyGeneralForm);
  const [profileForm, setProfileForm] = useState(emptyProfileForm);
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);

  const [savedGeneral, setSavedGeneral] = useState(emptyGeneralForm);
  const [savedProfile, setSavedProfile] = useState(emptyProfileForm);

  const [meta, setMeta] = useState({
    orgName: "",
    role: "Employee",
    status: "active",
    image: "",
    createdAt: null,
  });

  const [savingGeneral, setSavingGeneral] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const memberSince = useMemo(() => {
    if (!meta.createdAt) return "N/A";
    const date = new Date(meta.createdAt);
    return Number.isNaN(date.getTime()) ? "N/A" : String(date.getFullYear());
  }, [meta.createdAt]);

  const workspaceInitials = useMemo(() => {
    const base = generalForm.workspaceName || meta.orgName || "WS";
    return base
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [generalForm.workspaceName, meta.orgName]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/user", { cache: "no-store" });

        if (!res.ok) {
          throw new Error("Failed to load settings");
        }

        const data = await res.json();
        const hydrated = hydrateFormsFromPayload(data);

        setGeneralForm(hydrated.general);
        setSavedGeneral(hydrated.general);
        setProfileForm(hydrated.profile);
        setSavedProfile(hydrated.profile);
        setMeta(hydrated.meta);
      } catch (error) {
        console.error("Settings load error:", error);
        toast.error("Could not load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleGeneralSave = async () => {
    try {
      setSavingGeneral(true);
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "general",
          workspaceName: generalForm.workspaceName,
          workspaceUrl: generalForm.workspaceUrl,
          businessEmail: generalForm.businessEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to save workspace settings");
      }

      const hydrated = hydrateFormsFromPayload(data);
      setGeneralForm(hydrated.general);
      setSavedGeneral(hydrated.general);
      setMeta((prev) => ({ ...prev, ...hydrated.meta }));
      toast.success("Workspace details updated");
    } catch (error) {
      toast.error(error.message || "Failed to save workspace settings");
    } finally {
      setSavingGeneral(false);
    }
  };

  const handleProfileSave = async () => {
    try {
      setSavingProfile(true);
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "profile",
          name: profileForm.name,
          email: profileForm.email,
          jobTitle: profileForm.jobTitle,
          phone: profileForm.phone,
          bio: profileForm.bio,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to save profile");
      }

      const hydrated = hydrateFormsFromPayload(data);
      setProfileForm(hydrated.profile);
      setSavedProfile(hydrated.profile);
      setMeta((prev) => ({ ...prev, ...hydrated.meta }));
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Please fill current and new password");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setSavingPassword(true);
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "password",
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to update password");
      }

      setPasswordForm(emptyPasswordForm);
      toast.success("Password updated");
    } catch (error) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <SettingsLoadingState />;
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Settings
        </h1>
        <p className="text-neutral-500 mt-1">
          Manage your workspace and account preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <SettingsTabs
          tabs={settingsTabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === "general" && (
              <GeneralSettingsTab
                workspaceInitials={workspaceInitials}
                generalForm={generalForm}
                setGeneralForm={setGeneralForm}
                savedGeneral={savedGeneral}
                savingGeneral={savingGeneral}
                onSave={handleGeneralSave}
              />
            )}

            {activeTab === "profile" && (
              <ProfileSettingsTab
                profileForm={profileForm}
                setProfileForm={setProfileForm}
                savedProfile={savedProfile}
                savingProfile={savingProfile}
                onSave={handleProfileSave}
                meta={meta}
                generalForm={generalForm}
                memberSince={memberSince}
              />
            )}

            {activeTab === "security" && (
              <SecuritySettingsTab
                passwordForm={passwordForm}
                setPasswordForm={setPasswordForm}
                savingPassword={savingPassword}
                onPasswordUpdate={handlePasswordUpdate}
              />
            )}

            {activeTab === "billing" && <BillingSettingsTab />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
