"use client";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import {
  Search,
  Book,
  MessageCircle,
  LifeBuoy,
  ChevronRight,
  Rocket,
  Sparkles,
} from "lucide-react";

const categories = [
  { title: "Getting Started", icon: Rocket, count: 12, color: "text-blue-400" },
  { title: "Account Settings", icon: Book, count: 8, color: "text-purple-400" },
  {
    title: "Billing & Plans",
    icon: LifeBuoy,
    count: 5,
    color: "text-emerald-400",
  },
  {
    title: "API Reference",
    icon: MessageCircle,
    count: 24,
    color: "text-amber-400",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HelpPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-5%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <div className="text-center mb-12 md:mb-20">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-accent uppercase tracking-widest mb-6"
            >
              <Sparkles size={14} />
              Support Center
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-tight"
            >
              How can we <br className="sm:hidden" />
              <span className=" text-accent bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                help?
              </span>
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="max-w-2xl mx-auto relative group"
            >
              <div className="absolute inset-0 bg-accent/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10" />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-accent transition-colors"
                size={20}
              />
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 md:py-5 pl-12 pr-4 outline-none focus:border-accent/50 focus:bg-white/[0.08] transition-all text-base md:text-lg backdrop-blur-xl"
                placeholder="Search for articles, guides, or API docs..."
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-24">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <GlassCard className="p-6 md:p-8 border-white/5 hover:border-accent/20 cursor-pointer transition-all duration-500 group h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <cat.icon
                    size={36}
                    className={`${cat.color} mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}
                  />
                  <h3 className="font-bold text-lg mb-1 text-white group-hover:text-accent transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium tracking-wide uppercase">
                    {cat.count} Articles
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 bg-white/10" />
              <h3 className="text-xl md:text-2xl font-bold bg-white/90 bg-clip-text">
                Popular Articles
              </h3>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid gap-3 md:gap-4">
              {[
                "How to invite team members",
                "Setting up 2FA security",
                "Integrating Slack notifications",
                "Understanding Rate Limits",
              ].map((text, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 10 }}
                  className="flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 cursor-pointer group transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm md:text-base text-neutral-400 group-hover:text-white transition-colors">
                      {text}
                    </span>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-neutral-600 group-hover:text-accent transition-all"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
