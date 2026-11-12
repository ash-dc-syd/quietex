export const toneFilters = ["All panels", "Dark", "Light", "Colour", "Timber tones"] as const
export type FinishTone = typeof toneFilters[number]

// Deliberate catalogue classifications. Composite finishes describe backing/face;
// the visible blackwood face is dark timber, not a light grey panel.
const groups: Record<string, readonly FinishTone[]> = {
  "cinema black": ["Dark"],
  "midnight black": ["Dark"],
  "artic white": ["Light"],
  "arctic white": ["Light"],
  "sandstone": ["Light"],
  "royal blue": ["Colour"],
  "intense blue": ["Colour"],
  "olive moss": ["Colour"],
  "midnight blue": ["Colour"],
  "dark blue": ["Colour"],
  "oxford blue": ["Colour"],
  "navy blue/walnut": ["Timber tones"],
  "sky grey/blackwood": ["Dark", "Timber tones"],
}
export function finishesForTone<T extends { name: string }>(finishes: T[], tone: FinishTone): T[] {
  if (tone === "All panels") return finishes
  return finishes.filter(f => groups[f.name.trim().toLowerCase().replace(/\s*\/\s*/g, "/")]?.includes(tone))
}
