"use client";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$0",
    desc: "Perfect for small side projects.",
    features: [
      "Up to 3 Users",
      "2 Active Projects",
      "Basic Analytics",
      "Community Support",
    ],
    accent: "border-white/5",
    delay: 0.1,
  },
  {
    name: "Pro",
    price: "$29",
    desc: "For growing teams and businesses.",
    features: [
      "Up to 25 Users",
      "Unlimited Projects",
      "Advanced Analytics",
      "Priority Support",
      "Custom Branding",
    ],
    accent: "border-accent/50 shadow-[0_0_40px_rgba(59,130,246,0.15)]",
    popular: true,
    delay: 0.2,
  },
  {
    name: "Enterprise",
    price: "$99",
    desc: "Advanced security and control.",
    features: [
      "Unlimited Users",
      "Dedicated Server",
      "Role-Based Audit Logs",
      "24/7 Phone Support",
      "SSO Integration",
    ],
    accent: "border-purple-500/30",
    delay: 0.3,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function PricingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-5%] right-[10%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-16 md:mb-24"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs font-bold text-accent uppercase tracking-widest mb-6"
          >
            <Sparkles size={14} />
            Flexible Plans
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter mb-6 leading-[1.1]"
          >
            Simple, Transparent <br />
            <span className="text-accent  bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-neutral-500 max-w-2xl mx-auto text-base md:text-xl px-4"
          >
            Choose the plan that scales with your business flow. No hidden fees,
            cancel anytime.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="relative group h-full"
            >
              <GlassCard
                className={`p-6 md:p-10 flex flex-col h-full relative transition-all duration-500 ${plan.accent} 
                ${plan.popular ? "bg-white/[0.03] border-accent/40" : "hover:border-white/20"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_25px_rgba(59,130,246,0.4)] z-10">
                    Most Popular
                  </div>
                )}

                <div className="mb-8 relative">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl md:text-5xl font-black text-white">
                      {plan.price}
                    </span>
                    <span className="text-neutral-500 text-sm font-medium">
                      /month
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-neutral-500 mt-4 leading-relaxed">
                    {plan.desc}
                  </p>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feat, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-sm md:text-base text-neutral-300"
                    >
                      <div
                        className={`flex-shrink-0 p-1 rounded-full border ${plan.popular ? "bg-accent/20 border-accent/30" : "bg-white/5 border-white/10"}`}
                      >
                        <Check
                          size={12}
                          className={
                            plan.popular ? "text-accent" : "text-neutral-400"
                          }
                        />
                      </div>
                      <span className="group-hover:text-white transition-colors">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={plan.popular ? "primary" : "outline"}
                  className={`w-full py-6 text-base font-bold group/btn ${plan.popular ? "shadow-lg shadow-accent/20" : ""}`}
                >
                  Get Started
                  <span className="inline-block transition-transform group-hover/btn:translate-x-1.5 ml-2">
                    →
                  </span>
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          className="text-center text-neutral-600 text-sm mt-16"
        >
          All plans include 14-day free trial. No credit card required.
        </motion.p>
      </div>
    </main>
  );
}
