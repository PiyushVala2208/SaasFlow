"use client";
import GlassCard from "@/components/ui/GlassCard";
import { Zap, Shield, BarChart3, Globe, Users2, Cpu } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Real-time Analytics",
    desc: "Track every metric as it happens with our liquid charts.",
    icon: BarChart3,
    color: "text-blue-500",
  },
  {
    title: "Enterprise Security",
    desc: "Bank-grade encryption and multi-factor authentication.",
    icon: Shield,
    color: "text-emerald-500",
  },
  {
    title: "Global Scale",
    desc: "Deploy your workspace across multiple regions instantly.",
    icon: Globe,
    color: "text-purple-500",
  },
  {
    title: "Team Collaboration",
    desc: "Built-in tools for seamless sync between departments.",
    icon: Users2,
    color: "text-accent",
  },
  {
    title: "Smart Automation",
    desc: "Automate repetitive tasks with our AI-driven engine.",
    icon: Zap,
    color: "text-amber-500",
  },
  {
    title: "API First",
    desc: "Robust API to connect SaaSFlow with your existing stack.",
    icon: Cpu,
    color: "text-red-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
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

export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <div className="text-center mb-16 md:mb-24">
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.1]"
            >
              Powerful Features for <br />
              <span className="text-accent italic bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                Modern Teams
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-neutral-500 max-w-2xl mx-auto text-base md:text-lg px-4"
            >
              Everything you need to manage your business at scale, without the
              complexity of traditional tools.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5 }} 
                className="h-full"
              >
                <GlassCard className="p-6 md:p-8 h-full border-white/5 hover:border-accent/20 transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div
                    className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 ${f.color}`}
                  >
                    <f.icon size={24} />
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-accent transition-colors">
                    {f.title}
                  </h3>

                  <p className="text-neutral-500 text-sm leading-relaxed group-hover:text-neutral-400 transition-colors">
                    {f.desc}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
