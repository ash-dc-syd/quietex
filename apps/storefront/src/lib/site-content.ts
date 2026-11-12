import schema from "@/data/site-sections.json"
export type SiteSection = { id: string; type: string; enabled: boolean; settings: Record<string, string> }
export type SiteDocument = { version: 1; announcement: string; sections: SiteSection[] }
export const defaultContent: SiteDocument = {
  version: 1, announcement: "Acoustic panels for homes and workspaces.",
  sections: schema.filter(s => s.type !== "banner").map(s => ({ id: s.type, type: s.type, enabled: true, settings: Object.fromEntries(s.fields.map(f => [f.key, f.default])) })),
}
