"use client";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { ArrowRight, PlayCircle } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { Shield, BarChart3, Users, Zap, Globe, Lock } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };
      
const features = [
  {
    title: "Multi-Tenant Architecture",
    desc: "Isolate data securely for every organization with our advanced workspace logic.",
    icon: <Globe className="text-blue-400" size={24} />,
  },
  {
    title: "Role-Based Access",
    desc: "Define granular permissions for Admins, Managers, and Employees with ease.",
    icon: <Lock className="text-purple-400" size={24} />,
  },
  {
    title: "Real-time Analytics",
    desc: "Track business growth with liquid-smooth charts and live data streaming.",
    icon: <BarChart3 className="text-emerald-400" size={24} />,
  },
  {
    title: "Lightning Performance",
    desc: "Built on Next.js 16 for sub-second page loads and instant interactions.",
    icon: <Zap className="text-amber-400" size={24} />,
  },
  {
    title: "Team Collaboration",
    desc: "Invite members and manage workflows in a unified, premium workspace.",
    icon: <Users className="text-pink-400" size={24} />,
  },
  {
    title: "Enterprise Security",
    desc: "Bank-grade encryption and secure authentication for your peace of mind.",
    icon: <Shield className="text-cyan-400" size={24} />,
  },
];

  return (
    <main className="relative pt-32 pb-20 overflow-hidden">
      {/* Liquid Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-accent/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]" />
      </div>

      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 text-center"
      >
        {/* Modern Badge */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-neutral-400 mb-8 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
          SaaSFlow is now live...
        </motion.div>

        {/* Main Heading */}
        <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
          Manage your <span className="bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">Business</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p variants={itemVariants} className="text-neutral-400 max-w-2xl mx-auto text-lg md:text-xl mb-12 leading-relaxed">
          The all-in-one multi-tenant platform for elite teams. Scale your 
          operations with role-based access and real-time analytics.
        </motion.p>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button className="px-8 py-4 text-base group">
            Start Free Trial 
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" className="px-8 py-4 text-base flex items-center gap-2">
            <PlayCircle size={20} />
            Watch Demo
          </Button>
        </motion.div>

        {/* Dashboard Preview Placeholder */}
        {/* Dashboard Preview - The "Sexy" Mockup */}
<motion.div 
  variants={itemVariants}
  className="mt-24 relative max-w-5xl mx-auto group"
>
  {/* Glow behind the preview */}
  <div className="absolute inset-0 bg-accent/20 blur-[100px] -z-10 opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
  
  <div className="glass-card aspect-video rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-[#050505] p-4 relative">
    
    {/* Browser-like Toolbar */}
    <div className="flex gap-1.5 mb-4 border-b border-white/5 pb-3">
      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
    </div>

    {/* Mock Dashboard Layout */}
    <div className="grid grid-cols-12 gap-4 h-[calc(100%-40px)]">
      {/* Sidebar Mock */}
      <div className="col-span-2 space-y-3 border-r border-white/5 pr-4 hidden md:block">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`h-2 rounded-full w-full ${i === 0 ? 'bg-accent/40' : 'bg-white/5'}`} />
        ))}
      </div>

      {/* Main Content Mock */}
      <div className="col-span-12 md:col-span-10 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col justify-center px-4 gap-2">
              <div className="h-1.5 w-1/2 bg-white/10 rounded-full" />
              <div className="h-3 w-3/4 bg-white/20 rounded-full" />
            </div>
          ))}
        </div>

        {/* Chart Mockup */}
        <div className="h-48 rounded-xl bg-white/[0.02] border border-white/5 relative overflow-hidden p-6">
          <div className="flex justify-between items-end h-full gap-2">
            {[40, 70, 45, 90, 65, 80, 50, 95, 75, 60].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 1 + (i * 0.05), duration: 1 }}
                className="flex-1 bg-gradient-to-t from-accent/50 to-accent rounded-t-sm" 
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-60" />
        </div>

        {/* List Mock */}
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-white/[0.02] border border-white/5 flex items-center px-4 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-white/10" />
                <div className="h-2 w-32 bg-white/10 rounded-full" />
              </div>
              <div className="h-2 w-16 bg-accent/20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Overlay Gradient to make it look "Preview-ish" */}
    <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-purple-500/5 pointer-events-none" />
  </div>
</motion.div>
      </motion.section>
      
      
<section id="features" className="max-w-7xl mx-auto px-6 py-32">
  <div className="text-center mb-16">
    <h2 className="text-4xl font-bold mb-4">Built for Modern Scale</h2>
    <p className="text-neutral-500">Everything you need to run a high-performance SaaS business.</p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {features.map((feature, index) => (
      <GlassCard key={index} className="flex flex-col gap-4 border-white/5 p-8">
        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
          {feature.icon}
        </div>
        <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
        <p className="text-neutral-400 leading-relaxed text-sm">
          {feature.desc}
        </p>
      </GlassCard>
    ))}
  </div>
</section>
      
    </main>
  );
}