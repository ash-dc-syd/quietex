import type { Metadata } from "next"
import "./globals.css"
import "./redesign.css"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Quietex | Acoustic Panels", template: "%s | Quietex" },
  description: "Explore Quietex acoustic panels for home theatres, offices and interiors. Enquire about your project or find a retailer.",
  robots: process.env.SITE_INDEXABLE === "true"
    ? { index: true, follow: true }
    : { index: false, follow: false },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU">
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  )
}
