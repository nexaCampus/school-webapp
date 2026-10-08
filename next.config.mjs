/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable production source maps to prevent leaking source code & internal architecture (Point 17)
  productionBrowserSourceMaps: false,

  // Remove X-Powered-By header to prevent fingerprinting
  poweredByHeader: false,

  // Allowed origins in development
  allowedDevOrigins: [
    '192.168.56.1',
    'localhost',
    '127.0.0.1',
  ],

  // Security Headers Enforcement (Points 2, 3, 11, 17)
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';

    // Content Security Policy
    const cspDirectives = [
      "default-src 'self'",
      // Scripts: self, inline/eval (needed for Next.js in dev/hydration), Google & Razorpay SDKs
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseio.com https://checkout.razorpay.com https://*.razorpay.com",
      // Styles: self, inline (Tailwind & Next.js CSS), Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: self, Google Fonts, data URIs
      "font-src 'self' https://fonts.gstatic.com data:",
      // Images: self, data:, blob:, and external HTTPS domains (Unsplash, Firebase, avatars)
      "img-src 'self' data: blob: https:",
      // Connect: self, Go backend API, Firebase, Razorpay, WebSockets
      "connect-src 'self' https: wss:",
      // Frames: Razorpay checkout modal
      "frame-src 'self' https://checkout.razorpay.com https://*.razorpay.com",
      // Prevent object/embed plugins
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      ...(isDev ? [] : ['upgrade-insecure-requests']),
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspDirectives,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
