"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Shield, Loader2, UserPlus, AlertCircle } from "lucide-react";

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const shakeX = [0, -10, 10, -8, 8, -4, 4, 0];

export default function InviteModal({
  isOpen,
  onClose,
  projectId,
  onInviteSuccess,
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Editor");
  const [dispatching, setDispatching] = useState(false);
  const [error, setError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const emailValid = EMAIL_RE.test(email.trim());
  const emailShowError = emailTouched && email.length > 0 && !emailValid;

  const reset = useCallback(() => {
    setEmail("");
    setRole("Editor");
    setError("");
    setEmailTouched(false);
    setDispatching(false);
  }, []);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const mapStatusToMessage = (status, body) => {
    if (status === 404) return body?.error || "No account matches that email.";
    if (status === 400) return body?.error || "Request could not be completed.";
    if (status === 403) return body?.error || "You cannot invite to this project.";
    if (status === 401) return "Session expired. Sign in again.";
    if (status >= 500) return "Server error. Try again shortly.";
    return body?.error || "Something went wrong.";
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setEmailTouched(true);
    setError("");

    if (!email.trim() || !emailValid) {
      setError("Enter a valid email address.");
      return;
    }

    setDispatching(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          role,
        }),
      });
      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok) {
        onInviteSuccess?.();
        reset();
        onClose();
        return;
      }

      setError(mapStatusToMessage(res.status, data));
    } catch {
      setError("Network error. Check your connection.");
    } finally {
      setDispatching(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            aria-label="Close overlay"
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={() => !dispatching && onClose()}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#080808] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-violet-600/15 blur-[80px]" />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <UserPlus size={18} className="text-violet-400" />
                  <h2
                    id="invite-modal-title"
                    className="text-xl font-semibold tracking-tight text-white"
                  >
                    Invite collaborator
                  </h2>
                </div>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Dispatch access to your workspace
                </p>
              </div>
              <button
                type="button"
                disabled={dispatching}
                onClick={onClose}
                className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-40"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleInvite} className="relative mt-8 space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="invite-email"
                  className="ml-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-400"
                >
                  Email
                </label>
                <div className="relative group">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-violet-400"
                    aria-hidden
                  />
                  <input
                    id="invite-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="colleague@company.com"
                    className={`w-full rounded-2xl border bg-white/[0.03] py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 ${
                      emailShowError
                        ? "border-red-500/40 focus:border-red-500/50 focus:ring-red-500/30"
                        : "border-white/10 focus:border-violet-500/40 focus:ring-violet-500/25"
                    }`}
                  />
                </div>
                {emailShowError && (
                  <p className="ml-1 text-xs text-red-400/90">
                    Please enter a valid email format.
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <div className="ml-1 flex items-center gap-2">
                  <Shield size={12} className="text-neutral-500" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                    Role
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/5 bg-white/[0.02] p-1">
                  {["Viewer", "Editor", "Admin"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      disabled={dispatching}
                      className={`rounded-xl py-2.5 text-[10px] font-semibold uppercase tracking-widest transition-all ${
                        role === r
                          ? "bg-white text-black shadow-lg"
                          : "text-neutral-500 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {error ? (
                  <motion.div
                    key={error}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      x: shakeX,
                    }}
                    transition={{
                      x: { duration: 0.45, ease: "easeInOut" },
                      opacity: { duration: 0.2 },
                    }}
                    className="flex items-start gap-3 rounded-2xl border border-red-500/25 bg-red-500/5 px-4 py-3 text-sm text-red-300"
                  >
                    <AlertCircle
                      className="mt-0.5 shrink-0 text-red-400"
                      size={18}
                    />
                    <span>{error}</span>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <button
                type="submit"
                disabled={dispatching}
                className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-black transition-transform hover:bg-neutral-100 active:scale-[0.99] disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {dispatching ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Dispatching…
                    </>
                  ) : (
                    <>
                      Dispatch invite
                      <UserPlus size={14} />
                    </>
                  )}
                </span>
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
