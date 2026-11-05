// Editorial source: Quietex's existing website, reviewed 5 November 2026.
// Medusa catalogue integration follows the first design milestone.
export const media = {
  logo: "https://quietex.com.au/wp-content/uploads/2025/10/quietex-logo-dark.svg",
  logoLight: "https://quietex.com.au/wp-content/uploads/2025/10/quietex-logo-light.svg",
  theatre: "https://quietex.com.au/wp-content/uploads/2025/10/home-theatre-hero.webp",
  office: "https://quietex.com.au/wp-content/uploads/2025/10/office-hero.webp",
  interior: "https://quietex.com.au/wp-content/uploads/2026/02/charlotte-home-cinema-image-1-scaled.webp",
}

export const stellaFinishes = [
  { id: "navy-blue-walnut", name: "Navy Blue / Walnut", shortName: "Walnut", image: "https://quietex.com.au/wp-content/uploads/2026/02/stellawalnut-1-768x768.webp", tone: "#86694e" },
  { id: "sky-grey-blackwood", name: "Sky Grey / Blackwood", shortName: "Blackwood", image: "https://quietex.com.au/wp-content/uploads/2026/02/stella-black-768x768.webp", tone: "#3c3b38" },
] as const

export const featuredPanels = [
  { name: "Stella", detail: "Soundwave pattern", image: stellaFinishes[1].image, href: "/product/stella", tones: ["#3c3b38", "#86694e"], external: false },
  { name: "Margot", detail: "A softer expression", image: "https://quietex.com.au/wp-content/uploads/2026/02/margot-sandstone-1-768x768.webp", href: "https://quietex.com.au/product/margot/", tones: ["#d5c7b6", "#25282a", "#354b61", "#687995"], external: true },
  { name: "Normandy", detail: "Texture with rhythm", image: "https://quietex.com.au/wp-content/uploads/2026/02/normandy-profile-2-768x768.webp", href: "https://quietex.com.au/product/normandy/", tones: ["#86694e", "#3c3b38"], external: true },
  { name: "Adele", detail: "A touch of colour", image: "https://quietex.com.au/wp-content/uploads/2026/02/adele-profile-image-768x768.webp", href: "https://quietex.com.au/product/adele/", tones: ["#344c85"], external: true },
] as const

export const retailers = [
  { name: "Digital Cinema", url: "https://www.digitalcinema.com.au/" },
  { name: "Audio Junction", url: "https://www.audiojunction.com.au/" },
  { name: "Instyle HiFi", url: "https://www.instylehifi.com.au/" },
]

export function enquiryHref(subject: string, body = "") {
  return `mailto:enquiries@quietex.com.au?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
