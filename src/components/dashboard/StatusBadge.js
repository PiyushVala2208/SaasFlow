export default function StatusBadge({ status }) {
  const styles = {
    active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    disabled: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status] || styles.disabled}`}>
      {status}
    </span>
  );
}