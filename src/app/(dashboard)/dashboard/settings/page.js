"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  User,
  Building,
  Shield,
  CreditCard,
  Lock,
  Eye,
  ShieldCheck,
  Bell,
} from "lucide-react"; // Added icons
import StatusBadge from "@/components/dashboard/StatusBadge";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: Building },
    { id: "profile", label: "My Profile", icon: User },
    { id: "security", label: "Security & Audit", icon: Shield }, // Label updated
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Settings
        </h1>
        <p className="text-neutral-500 mt-1">
          Manage your workspace and account preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white/10 text-white border border-white/10 shadow-lg"
                  : "text-neutral-500 hover:bg-white/5 hover:text-neutral-300"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {/* GENERAL TAB */}
            {activeTab === "general" && (
              <motion.div
                key="general"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <GlassCard className="border-white/5 p-8">
                  <h3 className="text-lg font-bold mb-6">
                    Workspace Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-20 h-20 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-2xl font-bold text-accent">
                        AC
                      </div>
                      <div>
                        <Button variant="outline" className="text-xs px-4 py-2">
                          Change Logo
                        </Button>
                        <p className="text-[10px] text-neutral-500 mt-2 uppercase tracking-widest">
                          JPG, PNG or SVG. Max 1MB.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Workspace Name" defaultValue="Acme Corp" />
                      <Input
                        label="Workspace URL"
                        defaultValue="acme.saasflow.com"
                      />
                    </div>
                    <Input
                      label="Business Email"
                      defaultValue="admin@acme.com"
                    />
                  </div>
                </GlassCard>

                <div className="flex justify-end gap-3">
                  <Button variant="ghost">Cancel</Button>
                  <Button className="px-10">Save Changes</Button>
                </div>
              </motion.div>
            )}

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Profile Header Card */}
                <GlassCard className="p-8 border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -mr-16 -mt-16" />

                  <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                    {/* Avatar Upload */}
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-2xl bg-linear-to-tr from-accent to-purple-500 p-0.5">
                        <div className="w-full h-full rounded-2xl bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                          <img
                            src="https://ui-avatars.com/api/?name=John+Doe&background=transparent&color=fff&size=128"
                            alt="Profile"
                            className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      </div>
                      <button className="absolute -bottom-2 -right-2 p-2 bg-accent rounded-lg border border-white/20 shadow-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        <User size={14} className="text-white" />
                      </button>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">John Doe</h3>
                      <p className="text-neutral-500 text-sm">
                        Product Designer at Acme Corp
                      </p>
                      <div className="mt-4 flex gap-2">
                        <StatusBadge status="active" />
                        <span className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/10 text-neutral-400 font-bold uppercase tracking-widest">
                          Member since 2024
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Personal Details Form */}
                <GlassCard className="p-8 border-white/5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Input
                        label="Full Name"
                        defaultValue="John Doe"
                        placeholder="Enter your name"
                      />
                      <Input
                        label="Email Address"
                        defaultValue="john.doe@acme.inc"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="space-y-4">
                      <Input
                        label="Job Title"
                        defaultValue="Product Designer"
                        placeholder="e.g. Developer"
                      />
                      <Input
                        label="Phone Number"
                        defaultValue="+1 (555) 000-0000"
                        placeholder="+1..."
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">
                      Bio
                    </label>
                    <textarea
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-accent/50 transition-all min-h-30"
                      placeholder="Tell us a little about yourself..."
                      defaultValue="Passionate about building high-end SaaS products with liquid UI/UX."
                    />
                  </div>
                </GlassCard>

                {/* Preferences Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GlassCard className="p-6 border-white/5">
                    <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                      <Bell size={16} className="text-accent" />
                      Email Notifications
                    </h4>
                    <div className="space-y-3">
                      {[
                        {
                          label: "Product Updates",
                          desc: "Stay in the loop with new features.",
                        },
                        {
                          label: "Security Alerts",
                          desc: "Get notified about login attempts.",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/2 border border-white/5"
                        >
                          <div>
                            <p className="text-xs font-medium">{item.label}</p>
                            <p className="text-[10px] text-neutral-500">
                              {item.desc}
                            </p>
                          </div>
                          <div className="w-8 h-4 bg-accent/20 rounded-full relative border border-accent/30 cursor-pointer">
                            <div className="absolute right-1 top-1 w-2 h-2 bg-accent rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6 border-white/5 flex flex-col justify-center items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <Shield size={20} className="text-neutral-500" />
                    </div>
                    <h4 className="text-sm font-bold">Two-Factor Auth</h4>
                    <p className="text-[10px] text-neutral-500 mt-1 mb-4">
                      Add an extra layer of security to your account.
                    </p>
                    <Button
                      variant="outline"
                      className="text-[10px] px-4 py-1.5"
                    >
                      Enable 2FA
                    </Button>
                  </GlassCard>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="ghost">Reset</Button>
                  <Button className="px-10">Save Profile</Button>
                </div>
              </motion.div>
            )}

            {/* SECURITY & AUDIT TAB (UPDATED WITH ACTIVITY FEED) */}
            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Password Change Section */}
                <GlassCard className="p-8 border-white/5">
                  <div className="flex items-center gap-2 mb-6 text-accent">
                    <Lock size={18} />
                    <h3 className="text-lg font-bold text-white">
                      Password & Authentication
                    </h3>
                  </div>
                  <div className="space-y-4 max-w-md">
                    <Input
                      label="Current Password"
                      type="password"
                      placeholder="••••••••"
                    />
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="••••••••"
                    />
                    <Button className="text-xs px-6">Update Password</Button>
                  </div>
                </GlassCard>

                {/* Audit Logs / Activity Feed Section */}
                <GlassCard className="p-8 border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldCheck size={120} />
                  </div>

                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-2 text-emerald-500">
                      <Eye size={18} />
                      <h3 className="text-lg font-bold text-white">
                        Audit Logs
                      </h3>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20 font-bold uppercase tracking-widest animate-pulse">
                      Live
                    </span>
                  </div>

                  {/* The Activity Feed Component we built earlier */}
                  <ActivityFeed />

                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
                    <button className="text-xs text-neutral-500 hover:text-white transition-colors underline underline-offset-4">
                      View Full Security History
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* BILLING TAB */}
            {activeTab === "billing" && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GlassCard className="p-8 border-accent/20 bg-accent/5">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">
                          Current Plan
                        </p>
                        <h3 className="text-3xl font-bold italic">Pro Plan</h3>
                      </div>
                      <StatusBadge status="active" />
                    </div>
                    <p className="text-sm text-neutral-400 mb-8">
                      Your next billing date is{" "}
                      <span className="text-white font-medium">
                        March 21, 2026
                      </span>
                    </p>
                    <Button variant="outline" className="w-full">
                      Manage Subscription
                    </Button>
                  </GlassCard>

                  <GlassCard className="p-8 border-white/5">
                    <h3 className="text-lg font-bold mb-4">Workspace Usage</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-neutral-500">Team Members</span>
                          <span>18 / 25</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-accent w-[72%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-neutral-500">
                            Projects Capacity
                          </span>
                          <span>42 / 50</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 w-[84%]" />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>

                <GlassCard className="p-8 border-white/5">
                  <h3 className="text-lg font-bold mb-6">Payment Methods</h3>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
                    <div className="w-12 h-8 bg-neutral-800 rounded-md flex items-center justify-center font-bold text-[10px]">
                      VISA
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium italic">
                        •••• •••• •••• 4242
                      </p>
                      <p className="text-xs text-neutral-500">Expires 12/28</p>
                    </div>
                    <Button variant="ghost" className="text-xs">
                      Edit
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
