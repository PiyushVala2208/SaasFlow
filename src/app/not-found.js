"use client";
import { useState, useEffect } from "react"; // 1. Hooks add kiye
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  // 2. Hydration error fix karne ke liye mounting check
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-screen w-full bg-[#020202] flex flex-col items-center justify-center px-6 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full -z-10" />
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-[150px] md:text-[200px] font-black leading-none tracking-tighter text-white/10 select-none"
      >
        404
      </motion.h1>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center -mt-10 md:-mt-20 z-10"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          You've drifted into <br />
          <span className="text-accent italic">unknown space.</span>
        </h2>
        <p className="text-neutral-500 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved to a different orbit.
        </p>
        
        <Link href="/">
          <Button className="px-10 py-6 text-lg">Back to Safety</Button>
        </Link>
      </motion.div>
      
      {/* 3. Decorative stars - Ab sirf mounted:true par render honge */}
      {mounted && [...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ 
            duration: Math.random() * 3 + 2, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}