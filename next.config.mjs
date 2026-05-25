import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/blogs", destination: "/writing", permanent: true },
      { source: "/blogs/:slug", destination: "/writing/:slug", permanent: true },
      { source: "/skills", destination: "/about", permanent: true },
      { source: "/experience", destination: "/about", permanent: true },
      { source: "/education", destination: "/about", permanent: true },
      { source: "/achievements", destination: "/about", permanent: true },
      { source: "/case-studies", destination: "/projects", permanent: true },
      { source: "/recommendations", destination: "/about", permanent: true },
    ]
  },
}

export default nextConfig
