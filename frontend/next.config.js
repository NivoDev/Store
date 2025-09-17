/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: { styledComponents: true },

  // Expose on the client (and allow override via real env at build time)
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      'https://store-6ryk.onrender.com/api/v1',
  },

  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://store-6ryk.onrender.com/api/v1/:path*',
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=(), payment=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
