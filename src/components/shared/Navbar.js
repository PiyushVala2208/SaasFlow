"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import { Zap, Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "Solutions", href: "/solutions" },
  { name: "Pricing", href: "/pricing" },
  { name: "Changelog", href: "/changelog" },
  { name: "Help", href: "/help" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled ? "py-3 md:py-4" : "py-6 md:py-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div
          className={`glass-card flex items-center justify-between px-4 md:px-6 py-2 rounded-full transition-all duration-500 border ${
            scrolled || mobileMenuOpen
              ? "border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl"
              : "border-transparent bg-transparent shadow-none"
          }`}
        >
          <Link href="/" className="flex items-center gap-2 group z-[110]">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-transform group-hover:scale-110">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight text-white">
              SaaS
              <span className="text-neutral-500 group-hover:text-blue-500 transition-colors">
                Flow
              </span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 relative">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 z-10 ${
                    isActive
                      ? "text-white"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-white/10 border border-white/10 rounded-full -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 md:gap-3 z-[110]">
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="text-sm px-4 py-2">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="primary"
                  className="text-sm px-5 py-2 shadow-lg shadow-blue-500/20"
                >
                  Get Started
                </Button>
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 lg:hidden z-[80]"
            />

            <motion.div
              initial={{
                opacity: 0,
                y: -10,
                scale: 0.95,
                backdropFilter: "blur(0px)",
                WebkitBackdropFilter: "blur(0px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                backdropFilter: "blur(16px)", 
                WebkitBackdropFilter: "blur(16px)",
              }}
              exit={{
                opacity: 0,
                y: -10,
                scale: 0.95,
                backdropFilter: "blur(0px)",
                WebkitBackdropFilter: "blur(0px)",
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute top-full left-4 right-4 mt-3 lg:hidden z-[90]"
            >
              <div className="rounded-[2.5rem] border border-white/10 bg-black/40 p-8 shadow-2xl overflow-hidden relative">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-800/50 blur-[80px] rounded-full" />

                <div className="flex flex-col gap-6 relative z-10">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={`text-2xl font-semibold transition-colors ${
                          pathname === link.href
                            ? "text-blue-500"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}

                  <hr className="border-white/5 my-2" />

                  <div className="flex flex-col gap-4">
                    <Link href="/login">
                      <Button
                        variant="ghost"
                        className="w-full py-6 text-lg border border-white/5"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button
                        variant="primary"
                        className="w-full py-6 text-lg shadow-xl shadow-blue-500/20"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
