export const DEFAULT_TASK_TAG_PRESETS = Object.freeze([
  { text: "Feature", color: "#10B981" },
  { text: "Bug", color: "#F43F5E" },
  { text: "Hotfix", color: "#F59E0B" },
  { text: "UI/UX", color: "#3B82F6" },
  { text: "Research", color: "#A855F7" },
]);

const HEX_COLOR_REGEX = /^#(?:[A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
const DEFAULT_FALLBACK_COLOR = "#64748B";

const presetColorByText = new Map(
  DEFAULT_TASK_TAG_PRESETS.map((preset) => [
    String(preset.text || "").trim().toLowerCase(),
    preset.color,
  ]),
);

export function isValidHexColor(value) {
  return HEX_COLOR_REGEX.test(String(value || "").trim());
}

export function normalizeHexColor(value, fallback = DEFAULT_FALLBACK_COLOR) {
  const raw = String(value || "").trim();
  if (!isValidHexColor(raw)) return fallback;

  if (raw.length === 4) {
    const [_, r, g, b] = raw;
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }

  return raw.toUpperCase();
}

export function sanitizeTagText(value) {
  const text = String(value || "")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return "";
  return text.slice(0, 24);
}

function resolvePresetColorByText(text) {
  return presetColorByText.get(String(text || "").toLowerCase()) || null;
}

export function normalizeTaskTag(input) {
  if (input == null) return null;

  if (typeof input === "string") {
    const normalizedText = sanitizeTagText(input);
    if (!normalizedText) return null;

    const presetColor = resolvePresetColorByText(normalizedText);
    return {
      text: normalizedText,
      color: normalizeHexColor(presetColor, DEFAULT_FALLBACK_COLOR),
    };
  }

  if (typeof input !== "object") return null;

  const normalizedText = sanitizeTagText(
    input.text || input.label || input.name,
  );
  if (!normalizedText) return null;

  const presetColor = resolvePresetColorByText(normalizedText);

  return {
    text: normalizedText,
    color: normalizeHexColor(input.color || presetColor, DEFAULT_FALLBACK_COLOR),
  };
}

export function normalizeTaskTags(tags) {
  if (!Array.isArray(tags)) return [];

  const unique = new Map();

  for (const rawTag of tags) {
    const normalized = normalizeTaskTag(rawTag);
    if (!normalized) continue;

    const key = normalized.text.toLowerCase();
    if (!unique.has(key)) {
      unique.set(key, normalized);
    }
  }

  return Array.from(unique.values()).slice(0, 12);
}
