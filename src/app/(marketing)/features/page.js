"use client";
import GlassCard from "@/components/ui/GlassCard";
import { Zap, Shield, BarChart3, Globe, Users2, cpu } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { title: "Real-time Analytics", desc: "Track every metric as it happens with our liquid charts.", icon: BarChart3, color: "text-blue-500" },
  { title: "Enterprise Security", desc: "Bank-grade encryption and multi-factor authentication.", icon: Shield, color: "text-emerald-500" },
  { title: "Global Scale", desc: "Deploy your workspace across multiple regions instantly.", icon: Globe, color: "text-purple-500" },
  { title: "Team Collaboration", desc: "Built-in tools for seamless sync between departments.", icon: Users2, color: "text-accent" },
  { title: "Smart Automation", desc: "Automate repetitive tasks with our AI-driven engine.", icon: Zap, color: "text-amber-500" },
  { title: "API First", desc: "Robust API to connect SaaSFlow with your existing stack.", icon: Zap, color: "text-red-500" },
];

export default function FeaturesPage() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">
          Powerful Features for <br /><span className="text-accent italic">Modern Teams</span>
        </h1>
        <p className="text-neutral-500 max-w-2xl mx-auto text-lg">
          Everything you need to manage your business at scale, without the complexity of traditional tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
          >
            <GlassCard className="p-8 h-full border-white/5 hover:border-white/10 transition-all group">
              <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${f.color}`}>
                <f.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{f.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}