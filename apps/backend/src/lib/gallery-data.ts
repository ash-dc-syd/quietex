export type GalleryImage = { id: string; url: string; alt: string; caption: string; space: "home" | "work"; panelHandle: string }
export function validateGallery(value: unknown): GalleryImage[] {
  if (!Array.isArray(value) || value.length > 100) throw new Error("Use up to 100 gallery photos.")
  const ids = new Set<string>()
  return value.map(item => {
    if (!item || typeof item !== "object") throw new Error("Invalid gallery photo.")
    const { id, url, alt, caption, space, panelHandle } = item
    if (typeof id !== "string" || !/^[a-zA-Z0-9_-]{1,80}$/.test(id) || ids.has(id)) throw new Error("Photo identifiers must be unique.")
    ids.add(id)
    if (typeof url !== "string" || url.length > 2000 || !/^https:\/\/[^\s]+$/i.test(url)) throw new Error("Photo URLs must use HTTPS.")
    if (typeof alt !== "string" || !alt.trim() || alt.length > 250) throw new Error("Add a photo description of up to 250 characters.")
    if (typeof caption !== "string" || caption.length > 500) throw new Error("Captions can contain up to 500 characters.")
    if (space !== "home" && space !== "work") throw new Error("Choose At home or At work.")
    if (typeof panelHandle !== "string" || panelHandle.length > 200 || (panelHandle && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(panelHandle))) throw new Error("Choose a valid panel.")
    return { id, url, alt: alt.trim(), caption: caption.trim(), space, panelHandle }
  })
}
