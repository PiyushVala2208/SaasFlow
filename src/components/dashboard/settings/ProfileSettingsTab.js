import { motion } from "framer-motion";
import { Bell, Shield, Loader2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function ProfileSettingsTab({
  profileForm,
  setProfileForm,
  savedProfile,
  savingProfile,
  onSave,
  meta,
  generalForm,
  memberSince,
}) {
  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <GlassCard className="p-8 border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -mr-16 -mt-16" />

        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="w-24 h-24 rounded-2xl bg-linear-to-tr from-accent to-purple-500 p-0.5">
            <div className="w-full h-full rounded-2xl bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
              <img
                src={
                  meta.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profileForm.name || "User",
                  )}&background=transparent&color=fff&size=128`
                }
                alt="Profile"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">
              {profileForm.name || "User"}
            </h3>
            <p className="text-neutral-500 text-sm">
              {(profileForm.jobTitle || meta.role) +
                (generalForm.workspaceName
                  ? ` at ${generalForm.workspaceName}`
                  : "")}
            </p>
            <div className="mt-4 flex gap-2">
              <StatusBadge status={meta.status || "active"} />
              <span className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/10 text-neutral-400 font-bold uppercase tracking-widest">
                Member since {memberSince}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-8 border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={profileForm.name}
              onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="Enter your name"
            />
            <Input
              label="Email Address"
              value={profileForm.email}
              onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              placeholder="email@example.com"
            />
          </div>
          <div className="space-y-4">
            <Input
              label="Job Title"
              value={profileForm.jobTitle}
              onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  jobTitle: e.target.value,
                }))
              }
              placeholder="e.g. Developer"
            />
            <Input
              label="Phone Number"
              value={profileForm.phone}
              onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
              placeholder="+1..."
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">
            Bio
          </label>
          <textarea
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-accent/50 transition-all min-h-30"
            placeholder="Tell us a little about yourself..."
            value={profileForm.bio}
            onChange={(e) =>
              setProfileForm((prev) => ({
                ...prev,
                bio: e.target.value,
              }))
            }
          />
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6 border-white/5">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Bell size={16} className="text-accent" />
            Email Notifications
          </h4>
          <div className="space-y-3">
            {[
              {
                label: "Product Updates",
                desc: "Stay in the loop with new features.",
              },
              {
                label: "Security Alerts",
                desc: "Get notified about login attempts.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-white/2 border border-white/5"
              >
                <div>
                  <p className="text-xs font-medium">{item.label}</p>
                  <p className="text-[10px] text-neutral-500">{item.desc}</p>
                </div>
                <div className="w-8 h-4 bg-accent/20 rounded-full relative border border-accent/30">
                  <div className="absolute right-1 top-1 w-2 h-2 bg-accent rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-white/5 flex flex-col justify-center items-center text-center">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Shield size={20} className="text-neutral-500" />
          </div>
          <h4 className="text-sm font-bold">Two-Factor Auth</h4>
          <p className="text-[10px] text-neutral-500 mt-1 mb-4">
            Add an extra layer of security to your account.
          </p>
          <Button variant="outline" className="text-[10px] px-4 py-1.5" disabled>
            Enable 2FA
          </Button>
        </GlassCard>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="ghost"
          onClick={() => setProfileForm(savedProfile)}
          disabled={savingProfile}
        >
          Reset
        </Button>
        <Button className="px-10" onClick={onSave} disabled={savingProfile}>
          {savingProfile ? (
            <span className="flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Saving...
            </span>
          ) : (
            "Save Profile"
          )}
        </Button>
      </div>
    </motion.div>
  );
}
