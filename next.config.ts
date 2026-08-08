import type { NextConfig } from 'next';

/**
 * Baseline security headers.
 *
 * No CSP is set here: the app renders user-supplied base64 images inline and
 * Next injects inline bootstrap scripts, so a meaningful policy needs a nonce
 * pipeline. Add one via middleware before treating CSP as covered.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  // Standalone output keeps the Docker image small.
  output: process.env.DOCKER_BUILD === '1' ? 'standalone' : undefined,

  // Don't advertise the framework version.
  poweredByHeader: false,

  reactStrictMode: true,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Shared CVs and API responses are per-user; never let a CDN cache them.
        source: '/api/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store, max-age=0' }],
      },
    ];
  },
};

export default nextConfig;
