import type { Metadata } from "next"
import { headers } from "next/headers"
import { isIndexable, siteOrigin } from "@/lib/site-url"
import "./globals.css"
import "./redesign.css"

export async function generateMetadata(): Promise<Metadata> {
  const index = isIndexable((await headers()).get("host"))
  return {
    metadataBase: new URL(siteOrigin()),
    title: { default: "Quietex | Acoustic Panels", template: "%s | Quietex" },
    description: "Explore Quietex acoustic panels for home theatres, offices and interiors. Enquire about your project or find a retailer.",
    robots: { index, follow: index },
  }
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
