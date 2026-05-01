"use client";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { Rocket, Building2, Briefcase, CheckCircle2 } from "lucide-react";

const solutions = [
  {
    title: "For Startups",
    desc: "Scale fast with zero infrastructure overhead. Perfect for seed-stage teams.",
    icon: Rocket,
    features: ["Rapid Onboarding", "Flexible Pricing", "Integration Ready"],
    gradient: "from-blue-500/20 to-transparent",
  },
  {
    title: "For Agencies",
    desc: "Manage multiple clients and projects from a single premium dashboard.",
    icon: Briefcase,
    features: ["White-label Reports", "Client Portals", "Multi-tenant Support"],
    gradient: "from-purple-500/20 to-transparent",
  },
  {
    title: "For Enterprise",
    desc: "Advanced governance, security, and dedicated support for large organizations.",
    icon: Building2,
    features: ["SSO/SAML", "Audit Logs", "Dedicated Account Manager"],
    gradient: "from-emerald-500/20 to-transparent",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function SolutionsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <div className="text-center mb-16 md:mb-24">
            <motion.h2
              variants={titleVariants}
              className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] md:text-sm mb-4"
            >
              Industries
            </motion.h2>
            <motion.h1
              variants={titleVariants}
              className="text-5xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1]"
            >
              Tailored for your <br />
              <span className=" bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
                Business Type
              </span>
            </motion.h1>
          </div>

          <div className="space-y-8 md:space-y-16">
            {solutions.map((s, i) => (
              <motion.div key={i} variants={cardVariants}>
                <GlassCard
                  className={`p-6 md:p-12 border-white/5 flex flex-col md:flex-row gap-8 md:gap-16 items-center group hover:border-white/10 transition-colors duration-500 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
                >
                  <div className="flex-1 space-y-6 w-full">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]">
                      <s.icon size={28} />
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-3xl md:text-4xl font-bold text-white">
                        {s.title}
                      </h3>
                      <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
                        {s.desc}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {s.features.map((f, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] md:text-xs font-semibold uppercase tracking-wider text-neutral-300"
                        >
                          <CheckCircle2 size={12} className="text-accent" />
                          {f}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2">
                      <Button className="w-full sm:w-auto px-8 py-6 group/btn">
                        Learn More
                        <Rocket
                          size={18}
                          className="ml-2 group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform"
                        />
                      </Button>
                    </div>
                  </div>

                  <div
                    className={`flex-1 w-full aspect-square md:aspect-auto md:h-[400px] bg-gradient-to-br ${s.gradient} rounded-[2rem] border border-white/10 flex items-center justify-center relative overflow-hidden group/img`}
                  >
                    <div className="absolute inset-0 bg-white/[0.02] group-hover/img:bg-white/[0.05] transition-colors" />

                    <span className="text-neutral-600 font-bold italic tracking-widest text-sm uppercase opacity-50">
                      {s.title} Preview
                    </span>

                    <div className="absolute top-10 right-10 w-20 h-20 bg-white/5 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute bottom-10 left-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
