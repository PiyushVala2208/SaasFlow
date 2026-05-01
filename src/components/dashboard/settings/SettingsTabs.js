export default function SettingsTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="lg:w-64 flex flex-col gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
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
  );
}
