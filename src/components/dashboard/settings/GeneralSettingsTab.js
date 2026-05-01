import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function GeneralSettingsTab({
  workspaceInitials,
  generalForm,
  setGeneralForm,
  savedGeneral,
  savingGeneral,
  onSave,
}) {
  return (
    <motion.div
      key="general"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <GlassCard className="border-white/5 p-8">
        <h3 className="text-lg font-bold mb-6">Workspace Information</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-2xl font-bold text-accent">
              {workspaceInitials || "WS"}
            </div>
            <div>
              <Button variant="outline" className="text-xs px-4 py-2" disabled>
                Change Logo
              </Button>
              <p className="text-[10px] text-neutral-500 mt-2 uppercase tracking-widest">
                Logo upload will be enabled soon.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Workspace Name"
              value={generalForm.workspaceName}
              onChange={(e) =>
                setGeneralForm((prev) => ({
                  ...prev,
                  workspaceName: e.target.value,
                }))
              }
              placeholder="Workspace name"
            />
            <Input
              label="Workspace URL"
              value={generalForm.workspaceUrl}
              onChange={(e) =>
                setGeneralForm((prev) => ({
                  ...prev,
                  workspaceUrl: e.target.value,
                }))
              }
              placeholder="your-workspace.saasflow.com"
            />
          </div>
          <Input
            label="Business Email"
            value={generalForm.businessEmail}
            onChange={(e) =>
              setGeneralForm((prev) => ({
                ...prev,
                businessEmail: e.target.value,
              }))
            }
            placeholder="admin@company.com"
          />
        </div>
      </GlassCard>

      <div className="flex justify-end gap-3">
        <Button
          variant="ghost"
          onClick={() => setGeneralForm(savedGeneral)}
          disabled={savingGeneral}
        >
          Cancel
        </Button>
        <Button className="px-10" onClick={onSave} disabled={savingGeneral}>
          {savingGeneral ? (
            <span className="flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </motion.div>
  );
}
