"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Building2, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(!!token);
  const [error, setError] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    workEmail: "",
    orgName: "",
    password: "",
  });

  useEffect(() => {
    if (token) {
      fetch(`/api/invite/validate?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.isValid) {
            setFormData((prev) => ({
              ...prev,
              workEmail: data.email,
              orgName: data.orgName,
            }));
            setIsLocked(true);
          } else {
            setError("Invalid or expired invitation link.");
          }
        })
        .catch(() => setError("Failed to validate invitation."))
        .finally(() => setValidating(false));
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, token }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const disabledStyles =
    "bg-white/[0.02] text-neutral-500 border-white/5 cursor-not-allowed opacity-60";

  if (validating) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p>Verifying invitation...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-10 rounded-3xl border-white/10 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-purple-500 to-transparent opacity-50" />

      {isLocked && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm flex items-center gap-2">
          <CheckCircle2 size={18} />
          You are joining <strong>{formData.orgName}</strong>.
        </div>
      )}

      <div className="flex flex-col items-center mb-8">
        <div className="bg-purple-500/10 p-3 rounded-2xl mb-4 border border-purple-500/20">
          <Building2 className="text-purple-500" size={28} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Get Started</h2>
        <p className="text-neutral-500 text-sm mt-2 text-center">
          Create your business workspace in seconds.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="enter your fullname"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
          <Input
            label="Work Email"
            type="email"
            placeholder="enter your email"
            value={formData.workEmail}
            disabled={isLocked}
            className={cn(isLocked && disabledStyles)}
            onChange={(e) =>
              setFormData({ ...formData, workEmail: e.target.value })
            }
          />
        </div>

        <Input
          label="Organization Name"
          type="text"
          placeholder="enter your organization name"
          value={formData.orgName}
          disabled={isLocked}
          className={cn(isLocked && disabledStyles)}
          onChange={(e) =>
            setFormData({ ...formData, orgName: e.target.value })
          }
        />

        <Input
          label="Password"
          type="password"
          placeholder="enter your password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <div className="text-[11px] text-neutral-500 px-1">
          By signing up, you agree to our{" "}
          <span className="text-neutral-300">Terms of Service</span> and{" "}
          <span className="text-neutral-300">Privacy Policy</span>.
        </div>

        <Button
          type="submit"
          disabled={loading || (!!token && error !== "")}
          className="w-full py-4 mt-4 font-semibold tracking-wide bg-white text-black flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Creating Workspace...
            </>
          ) : isLocked ? (
            "Join Workspace"
          ) : (
            "Create Workspace"
          )}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/5 text-center">
        <p className="text-sm text-neutral-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-white font-medium hover:text-accent transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
