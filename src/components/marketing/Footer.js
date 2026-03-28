"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Instagram, Heart } from "lucide-react";

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "/features" },
      { name: "Solutions", href: "/solutions" },
      { name: "Pricing", href: "/pricing" },
      { name: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "/help" },
      { name: "Documentation", href: "#" },
      { name: "API Status", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/5 bg-[#020202] pt-20 pb-10 overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-accent/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-20">
          {/* Brand Column */}
          <div className="col-span-2 space-y-6">
            <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white italic shadow-[0_0_15px_rgba(59,130,246,0.5)]">S</div>
              SaaS<span className="text-accent">Flow</span>
            </Link>
            <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
              Experience the next generation of workspace management with liquid UI and lightning-fast performance.
            </p>
            <div className="flex gap-4">
              {[Github, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <button key={i} className="p-2 rounded-lg bg-white/5 border border-white/10 text-neutral-500 hover:text-white hover:border-accent/50 transition-all group">
                  <Icon size={18} className="group-hover:scale-110 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section, i) => (
            <div key={i} className="space-y-6">
              <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em]">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link href={link.href} className="text-sm text-neutral-500 hover:text-accent transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* The Legendary Signature Row */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">
            © 2026 SaaSFlow Inc. All rights reserved.
          </p>

          {/* Liquid Signature - Developed with Red Heart by PD */}
          <motion.div 
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  // flex items-center ensures everything is vertically centered
  className="flex items-center gap-2 text-neutral-400 text-sm font-medium"
>
  <span className="leading-none">Developed with</span>
  
  <motion.span
    animate={{ 
      scale: [1, 1.3, 1],
      filter: [
        "drop-shadow(0 0 2px #ff0000)", 
        "drop-shadow(0 0 10px #ff4444)", 
        "drop-shadow(0 0 2px #ff0000)"
      ]
    }}
    transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
    className="flex items-center justify-center" // Center the heart icon itself
  >
    <Heart size={16} className="fill-[#ff0000] text-[#ff0000]" />
  </motion.span> 

  <span className="leading-none">by</span>

  <span 
    className="text-3xl text-white ml-1 hover:text-accent transition-all duration-500 cursor-default italic flex items-center"
    style={{ 
      fontFamily: "'Dancing Script', cursive", 
      textShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
      lineHeight: "1", // Force line height to 1 to stop it from pushing boundaries
      paddingBottom: "4px" // Cursive fonts usually sit a bit high, this brings it down to center
    }}
  >
    pd
  </span>
</motion.div>
        </div>
      </div>

      {/* Font Import for the signature */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
      `}</style>
    </footer>
  );
}