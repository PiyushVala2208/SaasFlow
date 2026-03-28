"use client";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { Rocket, Building2, Briefcase } from "lucide-react";

const solutions = [
  { 
    title: "For Startups", 
    desc: "Scale fast with zero infrastructure overhead. Perfect for seed-stage teams.",
    icon: Rocket,
    features: ["Rapid Onboarding", "Flexible Pricing", "Integration Ready"]
  },
  { 
    title: "For Agencies", 
    desc: "Manage multiple clients and projects from a single premium dashboard.",
    icon: Briefcase,
    features: ["White-label Reports", "Client Portals", "Multi-tenant Support"]
  },
  { 
    title: "For Enterprise", 
    desc: "Advanced governance, security, and dedicated support for large organizations.",
    icon: Building2,
    features: ["SSO/SAML", "Audit Logs", "Dedicated Account Manager"]
  }
];

export default function SolutionsPage() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-accent font-bold uppercase tracking-[0.3em] text-sm mb-4">Industries</h2>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter">
          Tailored for your <span className="italic">Business Type</span>
        </h1>
      </div>

      <div className="space-y-12">
        {solutions.map((s, i) => (
          <GlassCard key={i} className={`p-10 border-white/5 flex flex-col md:flex-row gap-10 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex-1 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <s.icon size={28} />
              </div>
              <h3 className="text-3xl font-bold">{s.title}</h3>
              <p className="text-neutral-500 text-lg leading-relaxed">{s.desc}</p>
              <div className="flex flex-wrap gap-3">
                {s.features.map((f, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase text-neutral-400">
                    {f}
                  </span>
                ))}
              </div>
              <Button className="mt-4">Learn More</Button>
            </div>
            <div className="flex-1 w-full h-64 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 flex items-center justify-center text-neutral-700 font-bold italic">
              [Solution Preview Image]
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}