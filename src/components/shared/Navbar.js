"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import { Zap } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" }, // Added Home
  { name: "Features", href: "/features" },
  { name: "Solutions", href: "/solutions" },
  { name: "Pricing", href: "/pricing" },
  { name: "Changelog", href: "/changelog" },
  { name: "Help", href: "/help" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-4" : "py-8"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`glass-card flex items-center justify-between px-6 py-2 rounded-full transition-all duration-500 ${
          scrolled ? "border-white/10 bg-black/40 backdrop-blur-xl" : "border-transparent bg-transparent shadow-none"
        }`}>
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group z-10">
            <div className="bg-accent p-1.5 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">SaaS<span className="text-neutral-500 group-hover:text-accent transition-colors">Flow</span></span>
          </Link>

          {/* Liquid Nav Links */}
          <div className="hidden lg:flex items-center gap-1 relative">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 z-10 ${
                    isActive ? "text-white" : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {/* The Liquid Sliding Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-white/10 border border-white/10 rounded-full -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30
                      }}
                    />
                  )}
                  
                  {link.name}

                  {/* Dot for Changelog */}
                  {link.name === "Changelog" && (
                    <span className="absolute top-2 right-1 w-1 h-1 bg-accent rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 z-10">
            <Link href="/login">
              <Button variant="ghost" className="text-sm">Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" className="text-sm shadow-lg shadow-accent/20">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}