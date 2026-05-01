import { motion } from "framer-motion";
import { Lock, Eye, ShieldCheck, Loader2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

export default function SecuritySettingsTab({
  passwordForm,
  setPasswordForm,
  savingPassword,
  onPasswordUpdate,
}) {
  return (
    <motion.div
      key="security"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <GlassCard className="p-8 border-white/5">
        <div className="flex items-center gap-2 mb-6 text-accent">
          <Lock size={18} />
          <h3 className="text-lg font-bold text-white">
            Password & Authentication
          </h3>
        </div>
        <div className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            placeholder="********"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
          />
          <Input
            label="New Password"
            type="password"
            placeholder="********"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="********"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
          />
          <Button
            className="text-xs px-6"
            onClick={onPasswordUpdate}
            disabled={savingPassword}
          >
            {savingPassword ? (
              <span className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Updating...
              </span>
            ) : (
              "Update Password"
            )}
          </Button>
        </div>
      </GlassCard>

      <GlassCard className="p-8 border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <ShieldCheck size={120} />
        </div>

        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2 text-emerald-500">
            <Eye size={18} />
            <h3 className="text-lg font-bold text-white">Audit Logs</h3>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20 font-bold uppercase tracking-widest animate-pulse">
            Live
          </span>
        </div>

        <ActivityFeed />

        <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
          <button className="text-xs text-neutral-500 hover:text-white transition-colors underline underline-offset-4">
            View Full Security History
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
