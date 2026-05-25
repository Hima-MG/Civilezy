/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Firebase Storage download URLs returned by getDownloadURL()
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
      {
        // Direct Google Cloud Storage URLs (fallback / alternative bucket access)
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/courses",
        destination: "https://learn.civilezy.in",
        permanent: true,
      },
      {
        source: "/course/:slug*",
        destination: "https://learn.civilezy.in/course/:slug*",
        permanent: true,
      },
      {
        source: "/login",
        destination: "https://learn.civilezy.in/login",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;