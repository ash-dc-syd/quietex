import type { NextConfig } from "next"

const config: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // Preserve WordPress product paths, including their trailing slash.
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      { source: "/:path*", has: [{ type: "host", value: "www.quietex.com.au" }], destination: "https://quietex.com.au/:path*", permanent: true },
      { source: "/medusa-admin/:path*", destination: "https://medusa-server-production-456b.up.railway.app/app/:path*", permanent: false },
      { source: "/contact", destination: "/contact-us/", permanent: true },
      { source: "/contact/", destination: "/contact-us/", permanent: true },
    ]
  },
}

export default config
