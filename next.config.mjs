/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable Next.js built-in image optimization (WebP/AVIF conversion, lazy loading)
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Gzip/Brotli compression for server responses
  compress: true,
  // Remove X-Powered-By header (security + tiny payload win)
  poweredByHeader: false,
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  experimental: {
    // Tree-shake unused CSS on build
    optimizeCss: true,
    // Native browser scroll restoration (faster back/forward navigation)
    scrollRestoration: true,
  },
}

export default nextConfig
