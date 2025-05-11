
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb', // Or your preferred limit
    },
  },
  webpack: (config, { isServer }) => {
    // Fix for "Module not found: Can't resolve 'async_hooks'", "Module not found: Can't resolve 'fs'", "Module not found: Can't resolve 'tls'", and "Module not found: Can't resolve 'net'"
    // These errors occur when Node.js specific modules are attempted to be bundled for the client.
    // OpenTelemetry (used by Genkit) might be causing this.
    // Note: This webpack configuration is standard for Webpack-based builds.
    // If using Turbopack, its handling of fallbacks might differ.
    if (!isServer) {
      config.resolve = {
        ...(config.resolve || {}), // Preserve existing resolve config or use empty obj if undefined
        fallback: {
          ...(config.resolve?.fallback || {}), // Preserve existing fallbacks or use empty obj
          async_hooks: false, // Provide an empty module for client bundles
          fs: false, // Provide an empty module for 'fs'
          tls: false, // Provide an empty module for 'tls'
          net: false, // Provide an empty module for 'net'
        },
      };
    }
    return config;
  },
};

export default nextConfig;

