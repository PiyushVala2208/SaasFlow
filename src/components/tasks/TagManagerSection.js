"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Tag, X } from "lucide-react";
import {
  DEFAULT_TASK_TAG_PRESETS,
  isValidHexColor,
  normalizeHexColor,
  normalizeTaskTag,
  normalizeTaskTags,
} from "@/lib/taskTags";

function withAlpha(hex, alpha = 0.25) {
  const color = normalizeHexColor(hex, "#64748B");
  const r = Number.parseInt(color.slice(1, 3), 16);
  const g = Number.parseInt(color.slice(3, 5), 16);
  const b = Number.parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function TagManagerSection({ tags = [], onUpdate }) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customColor, setCustomColor] = useState("#3B82F6");

  const activeTags = useMemo(() => normalizeTaskTags(tags), [tags]);

  const activeTagSet = useMemo(() => {
    return new Set(activeTags.map((item) => item.text.toLowerCase()));
  }, [activeTags]);

  const updateTags = (nextTags) => {
    onUpdate({ tags: normalizeTaskTags(nextTags) });
  };

  const removeTag = (tagText) => {
    updateTags(
      activeTags.filter((item) => item.text.toLowerCase() !== tagText.toLowerCase()),
    );
  };

  const togglePreset = (preset) => {
    const key = preset.text.toLowerCase();

    if (activeTagSet.has(key)) {
      removeTag(preset.text);
      return;
    }

    updateTags([...activeTags, preset]);
  };

  const handleCreateCustomTag = () => {
    const normalized = normalizeTaskTag({
      text: customText,
      color: customColor,
    });

    if (!normalized) return;

    const alreadyExists = activeTagSet.has(normalized.text.toLowerCase());
    if (!alreadyExists) {
      updateTags([...activeTags, normalized]);
    }

    setCustomText("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-1.5 select-none">
          <Tag size={14} /> Tags
        </span>

        <button
          type="button"
          onClick={() => setIsPickerOpen((prev) => !prev)}
          className="w-7 h-7 rounded-full border border-white/10 bg-white/[0.02] text-neutral-500 hover:text-blue-400 hover:border-blue-500/40 transition-all flex items-center justify-center"
          title="Add Tag"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence initial={false}>
          {activeTags.map((tag) => (
            <motion.div
              key={tag.text}
              layout
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-transparent"
              style={{
                borderColor: withAlpha(tag.color, 0.55),
                boxShadow: `0 0 18px ${withAlpha(tag.color, 0.08)}`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: tag.color,
                  boxShadow: `0 0 10px ${withAlpha(tag.color, 0.95)}`,
                }}
              />
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-200">
                {tag.text}
              </span>
              <button
                type="button"
                onClick={() => removeTag(tag.text)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500 hover:text-red-400"
                title={`Remove ${tag.text}`}
              >
                <X size={10} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {activeTags.length === 0 && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-700">
            No labels attached
          </span>
        )}
      </div>

      <AnimatePresence>
        {isPickerOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-white/10 bg-[#090909]/95 backdrop-blur-2xl p-4 shadow-[0_18px_60px_rgba(0,0,0,0.55)] space-y-4"
          >
            <div className="space-y-2">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-600">
                Presets
              </p>

              <div className="grid grid-cols-2 gap-2">
                {DEFAULT_TASK_TAG_PRESETS.map((preset) => {
                  const isActive = activeTagSet.has(preset.text.toLowerCase());

                  return (
                    <button
                      key={preset.text}
                      type="button"
                      onClick={() => togglePreset(preset)}
                      className={`text-left px-3 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                        isActive
                          ? "bg-white/[0.04] border-white/20 text-white"
                          : "bg-white/[0.01] border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                      }`}
                      style={{
                        boxShadow: isActive
                          ? `0 0 20px ${withAlpha(preset.color, 0.2)}`
                          : "none",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: preset.color,
                          boxShadow: `0 0 9px ${withAlpha(preset.color, 0.9)}`,
                        }}
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest truncate">
                        {preset.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-3">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-600">
                Custom Label
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreateCustomTag();
                    }
                  }}
                  placeholder="Tag name"
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white font-bold outline-none placeholder:text-neutral-700 focus:border-blue-500/45"
                />

                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  placeholder="#3B82F6"
                  className={`w-24 bg-white/[0.03] border rounded-xl px-3 py-2 text-[11px] uppercase font-black tracking-wider outline-none ${
                    isValidHexColor(customColor)
                      ? "border-white/10 text-white focus:border-blue-500/45"
                      : "border-red-500/40 text-red-300"
                  }`}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/10">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: normalizeHexColor(customColor, "#64748B"),
                      boxShadow: `0 0 10px ${withAlpha(customColor, 0.9)}`,
                    }}
                  />
                  <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">
                    Preview
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCreateCustomTag}
                  disabled={!customText.trim()}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-500 transition-all disabled:opacity-30"
                >
                  Add
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
