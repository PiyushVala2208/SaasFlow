"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Button({ children, className, variant = "primary", ...props }) {
  const variants = {
    primary: "bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.15)]",
    outline: "border border-glass-border bg-glass hover:bg-white/5 text-white",
    ghost: "text-neutral-400 hover:text-white hover:bg-white/5",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "px-6 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}