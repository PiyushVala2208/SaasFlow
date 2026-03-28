"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Zap } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/dashboard"); 
      } else {
        const data = await res.json();
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-10 rounded-3xl border-white/10 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-accent to-transparent opacity-50" />

      <div className="flex flex-col items-center mb-10">
        <div className="bg-accent/10 p-3 rounded-2xl mb-4 border border-accent/20">
          <Zap className="text-accent fill-accent" size={28} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
        <p className="text-neutral-500 text-sm mt-2 text-center">
          Enter your credentials to access your workspace.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleLogin}>
        <Input
          label="Email Address"
          type="email"
          placeholder="enter email address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            placeholder="enter password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs text-neutral-500 hover:text-accent transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full py-4 mt-4 font-semibold tracking-wide"
        >
          Sign In to SaaSFlow
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/5 text-center">
        <p className="text-sm text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-white font-medium hover:text-accent transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </motion.div>
  );
}