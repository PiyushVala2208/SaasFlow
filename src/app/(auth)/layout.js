import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-200 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-125 w-125 bg-accent/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md p-6 relative z-10">{children}</div>
    </div>
  );
}
