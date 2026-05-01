import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function BillingSettingsTab() {
  return (
    <motion.div
      key="billing"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-8 border-accent/20 bg-accent/5">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">
                Current Plan
              </p>
              <h3 className="text-3xl font-bold italic">Pro Plan</h3>
            </div>
            <StatusBadge status="active" />
          </div>
          <p className="text-sm text-neutral-400 mb-8">
            Billing details are static for now.
          </p>
          <Button variant="outline" className="w-full" disabled>
            Manage Subscription
          </Button>
        </GlassCard>

        <GlassCard className="p-8 border-white/5">
          <h3 className="text-lg font-bold mb-4">Workspace Usage</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-neutral-500">Team Members</span>
                <span>18 / 25</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[72%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-neutral-500">Projects Capacity</span>
                <span>42 / 50</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[84%]" />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
