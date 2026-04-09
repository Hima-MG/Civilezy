/** @type {import('next').NextConfig} */
const nextConfig = {
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