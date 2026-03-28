"use client";
import { motion } from "framer-motion"; // Add this for ultra smoothness
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$0",
    desc: "Perfect for small side projects.",
    features: ["Up to 3 Users", "2 Active Projects", "Basic Analytics", "Community Support"],
    accent: "border-white/5"
  },
  {
    name: "Pro",
    price: "$29",
    desc: "For growing teams and businesses.",
    features: ["Up to 25 Users", "Unlimited Projects", "Advanced Analytics", "Priority Support", "Custom Branding"],
    accent: "border-accent/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    popular: true
  },
  {
    name: "Enterprise",
    price: "$99",
    desc: "Advanced security and control.",
    features: ["Unlimited Users", "Dedicated Server", "Role-Based Audit Logs", "24/7 Phone Support", "SSO Integration"],
    accent: "border-purple-500/30"
  }
];
export default function PricingPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6"
        >
          Simple, Transparent <br /><span className="text-accent italic">Pricing</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-neutral-500 max-w-xl mx-auto text-lg"
        >
          Choose the plan that scales with your business flow. No hidden fees.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className={`p-8 flex flex-col h-full relative ${plan.accent}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-neutral-500 text-sm">/month</span>
                </div>
                <p className="text-sm text-neutral-500 mt-4">{plan.desc}</p>
              </div>
              
              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feat, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm text-neutral-300">
                    <div className="bg-white/5 p-1 rounded-full border border-white/10">
                      <Check size={12} className="text-accent" />
                    </div>
                    {feat}
                  </div>
                ))}
              </div>

              <Button variant={plan.popular ? "primary" : "outline"} className="w-full group">
                Get Started 
                <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
              </Button>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}