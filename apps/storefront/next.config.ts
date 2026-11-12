import type { NextConfig } from "next"

const config: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // Preserve WordPress product paths, including their trailing slash.
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      { source: "/:path*", has: [{ type: "host", value: "www.quietex.com.au" }], destination: "https://quietex.com.au/:path*", permanent: true },
      { source: "/contact", destination: "/contact-us/", permanent: true },
      { source: "/contact/", destination: "/contact-us/", permanent: true },
    ]
  },
}

export default config
