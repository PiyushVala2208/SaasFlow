"use client";
import { useState } from "react";
import { UserPlus, X, Copy, Check, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function InviteMemberButton({ orgName, onInviteSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ email: "", role: "Employee" });

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/invite/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, orgName }),
    });

    const data = await res.json();
    

    if (res.ok) {
      setInviteLink(data.inviteLink);
      if (onInviteSuccess && data.user) {
        onInviteSuccess(data.user);
      }
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <UserPlus size={18} /> Invite Member
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                Invite Team Member
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {!inviteLink ? (
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-accent"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase">
                    Role
                  </label>
                  <select
                    className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none"
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Generate Invite Link"
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-neutral-400">
                  Share this link with your team member:
                </p>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10 font-mono text-sm text-accent break-all">
                  {inviteLink.substring(0, 40)}...
                  <button
                    onClick={copyToClipboard}
                    className="ml-auto p-2 hover:bg-white/10 rounded-lg"
                  >
                    {copied ? (
                      <Check size={16} className="text-emerald-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-neutral-800"
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
