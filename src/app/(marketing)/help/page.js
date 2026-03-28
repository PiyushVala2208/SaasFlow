"use client";
import GlassCard from "@/components/ui/GlassCard";
import { Search, Book, MessageCircle, LifeBuoy, ChevronRight, Rocket} from "lucide-react";

const categories = [
  { title: "Getting Started", icon: Rocket, count: 12 },
  { title: "Account Settings", icon: Book, count: 8 },
  { title: "Billing & Plans", icon: LifeBuoy, count: 5 },
  { title: "API Reference", icon: MessageCircle, count: 24 },
];

export default function HelpPage() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">How can we <span className="italic text-accent">help?</span></h1>
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
          <input 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent/50 transition-all text-lg"
            placeholder="Search for articles, guides..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {categories.map((cat, i) => (
          <GlassCard key={i} className="p-6 border-white/5 hover:bg-white/5 cursor-pointer transition-all group">
            <cat.icon size={32} className="text-accent mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold mb-1">{cat.title}</h3>
            <p className="text-xs text-neutral-500">{cat.count} Articles</p>
          </GlassCard>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        <h3 className="text-xl font-bold mb-6">Popular Articles</h3>
        <div className="space-y-4">
          {["How to invite team members", "Setting up 2FA security", "Integrating Slack notifications"].map((text, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 cursor-pointer group transition-all">
              <span className="text-sm text-neutral-300 group-hover:text-white">{text}</span>
              <ChevronRight size={16} className="text-neutral-600 group-hover:text-accent" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}