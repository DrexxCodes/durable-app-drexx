/**
 * The original CRA app reads REACT_APP_* variables everywhere.
 * Expose them to the browser bundle as-is so your existing .env keeps working
 * (you can also use NEXT_PUBLIC_* for new variables).
 */
const publicEnv = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => key.startsWith("REACT_APP_"))
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: publicEnv,
  reactStrictMode: true,
  images: { unoptimized: true },
  async headers() {
    return [
      {
        // always revalidate the service worker so updates reach users quickly
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },
};
export default nextConfig;
