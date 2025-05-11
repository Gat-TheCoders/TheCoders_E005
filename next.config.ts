
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
    // Fix for "Module not found: Can't resolve 'async_hooks'", "Module not found: Can't resolve 'fs'", etc.
    // These errors occur when Node.js specific modules are attempted to be bundled for the client.
    // OpenTelemetry (used by Genkit) might be causing this.
    if (!isServer) {
      config.resolve = {
        ...(config.resolve || {}), 
        fallback: {
          ...(config.resolve?.fallback || {}), 
          async_hooks: false,
          "node:async_hooks": false,
          fs: false,
          "node:fs": false,
          tls: false,
          "node:tls": false,
          net: false,
          "node:net": false,
          http2: false,
          "node:http2": false,
          dns: false,
          "node:dns": false,
        },
      };
    }
    return config;
  },
};

export default nextConfig;
