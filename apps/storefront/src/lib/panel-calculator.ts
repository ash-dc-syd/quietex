export type PanelSize = { widthMm: number; heightMm: number }

/** Only use an explicit pair of millimetre dimensions from the catalogue. */
export function panelSize(specifications: { name: string; value: string }[]): PanelSize | null {
  const value = specifications.find(s => s.name.trim().toLowerCase() === "size")?.value
  const match = value?.trim().match(/^(\d+(?:\.\d+)?)\s*mm\s*[x×]\s*(\d+(?:\.\d+)?)\s*mm$/i)
  if (!match) return null
  const sides = [Number(match[1]), Number(match[2])]
  if (sides.some(n => !Number.isFinite(n) || n < 1 || n > 10000)) return null
  return { widthMm: Math.min(...sides), heightMm: Math.max(...sides) }
}

export function calculatePanels(width: number, height: number, size: PanelSize, allowance: number) {
  if ([width, height].some(n => !Number.isFinite(n) || n < 0.01 || n > 30)) {
    throw new Error("Enter a wall width and height between 0.01 and 30 metres.")
  }
  if ([size.widthMm, size.heightMm].some(n => !Number.isFinite(n) || n < 1 || n > 10000) || ![0, 10, 15].includes(allowance)) {
    throw new Error("Please choose a valid panel size and extra allowance.")
  }
  const wallWidthMm = Math.round(width * 1000), wallHeightMm = Math.round(height * 1000)
  const columns = Math.ceil(wallWidthMm / size.widthMm), rows = Math.ceil(wallHeightMm / size.heightMm)
  const base = columns * rows, extra = Math.ceil(base * allowance / 100), total = base + extra
  if (total > 100000) throw new Error("This project needs a custom estimate. Please contact us with your dimensions.")
  return { columns, rows, base, extra, total, area: wallWidthMm * wallHeightMm / 1000000, wallWidthMm, wallHeightMm }
}
