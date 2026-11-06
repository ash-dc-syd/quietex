// Editorial source: Quietex's existing website, reviewed 5 November 2026.
// Medusa catalogue integration follows the first design milestone.
export const media = {
  logo: "https://quietex.com.au/wp-content/uploads/2025/10/quietex-logo-dark.svg",
  logoLight: "https://quietex.com.au/wp-content/uploads/2025/10/quietex-logo-light.svg",
  theatre: "https://quietex.com.au/wp-content/uploads/2025/10/home-theatre-hero.webp",
  office: "https://quietex.com.au/wp-content/uploads/2025/10/office-hero.webp",
  interior: "https://quietex.com.au/wp-content/uploads/2026/02/charlotte-home-cinema-image-1-scaled.webp",
}

export const retailers = [
  { name: "Digital Cinema", url: "https://www.digitalcinema.com.au/" },
  { name: "Audio Junction", url: "https://www.audiojunction.com.au/" },
  { name: "Instyle HiFi", url: "https://www.instylehifi.com.au/" },
]

export function enquiryHref(subject: string, body = "") {
  return `mailto:enquiries@quietex.com.au?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
