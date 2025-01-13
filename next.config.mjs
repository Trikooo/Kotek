/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "pub-92b1d54c6fe84a96b595b1359a0e47f2.r2.dev",
      },
      {
        protocol: "https",
        hostname: "pub-b8d635fada6740cfb29608ba79c3471c.r2.dev",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
    ],
  },
};

export default nextConfig;
