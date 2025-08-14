/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Suppress hydration warnings for fdprocessedid attributes
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
    // Suppress specific hydration warnings
    reactRemoveProperties: { properties: ['^fdprocessedid$', '^data-form-type$'] },
  },
  // Add the script to suppress hydration warnings
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Add the script to client-side bundles
      config.resolve.fallback = { 
        fs: false,
        net: false,
        tls: false
      };
    }
    return config;
  },
}

export default nextConfig
