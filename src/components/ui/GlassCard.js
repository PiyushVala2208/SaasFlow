"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function GlassCard({ children, className, hoverEffect = true }) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, transition: { duration: 0.2 } } : {}}
      className={cn(
        "glass-card p-6 rounded-2xl transition-all duration-300 backdrop-blur-lg",
        hoverEffect && "hover:border-white/20 hover:bg-white/5",
        className
      )}
    >
      {children}
    </motion.div>
  );
}