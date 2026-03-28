"use client";

export default function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border-white/10 backdrop-blur-xl shadow-2xl">
        <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-accent">
          ${payload[0].value.toLocaleString()} <span className="text-neutral-400 font-normal">Revenue</span>
        </p>
      </div>
    );
  }
  return null;
}